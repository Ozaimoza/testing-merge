const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();
const shoppingCartController = require('./shoppingCartController');
const shippingController = require('./shippingController');

const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => {
        const itemPrice = item.product.price || 0;
        return total + item.quantity * itemPrice;
    }, 0);
};

const groupItemsByWarehouse = (cartItems) => {
    const warehouseGroups = {};
    cartItems.forEach((cartItem) => {
        const warehouseId = cartItem.product.warehouse_id;
        if (!warehouseGroups[warehouseId]) {
            warehouseGroups[warehouseId] = [];
        }
        warehouseGroups[warehouseId].push(cartItem);
    });

    return Object.values(warehouseGroups);
};

const calculateTotalWeight = (cartItems) => {
    return cartItems.reduce((totalWeight, cartItem) => {
        const itemWeight = cartItem.product.weight || 0;
        return totalWeight + cartItem.quantity * itemWeight;
    }, 0);
};

const createOrder = async (userId, promoCode = null, courier) => {
    try {
        const userIdInt = parseInt(userId, 10);
        const cartItems = await shoppingCartController.getShoppingCart(userIdInt);

        if (cartItems.length === 0) {
            throw new Error('Shopping cart is empty');
        }

        const warehouseGroups = groupItemsByWarehouse(cartItems);

        let totalPrice = 0;
        let totalShippingFee = 0;

        const user = await prisma.user.findUnique({
            where: {
                user_id: userIdInt,
            },
            include: {
                user_addresses: {
                    select: {
                        city_id: true,
                    },
                },
            },
        });

        if (!user) {
            console.error('User not found');
            throw new Error('User not found');
        }

        const userAddresses = user.user_addresses;

        if (!userAddresses || userAddresses.length === 0 || !userAddresses[0].city_id) {
            console.error('User address or city ID not found');
            throw new Error('User address or city ID not found');
        }

        const destinationCityId = userAddresses[0].city_id;

        // Iterate over each warehouse group
        for (const warehouseGroup of warehouseGroups) {
            // Check if the warehouse group is not empty
            if (warehouseGroup.length > 0) {
                // Calculate total weight for the warehouse group
                const totalWeight = calculateTotalWeight(warehouseGroup);

                // Calculate shipping fee for the warehouse group
                const warehouseShippingFee = await shippingController.calculateShippingFee(
                    warehouseGroup[0].product.warehouse_id,
                    destinationCityId,
                    totalWeight,
                    courier
                );

                // Add the shipping fee to the total shipping fee
                totalShippingFee += warehouseShippingFee;

                // Calculate total price for the warehouse group
                const warehouseTotalPrice = calculateTotalPrice(warehouseGroup);

                // Add the total price to the overall total price
                totalPrice += warehouseTotalPrice;
            }
        }

        let promoDiscountAmount = 0;
        let affiliateDiscountAmount = 0;

        if (promoCode) {
            const promo = await prisma.promotion.findFirst({
                where: {
                    promo_code: promoCode,
                    remaining_usage: { gt: 0 },
                    product_id: null,
                },
            });

            if (promo) {
                if (promo.type === 'percentage') {
                    promoDiscountAmount = (totalPrice * promo.amount) / 100;
                } else if (promo.type === 'fixed') {
                    promoDiscountAmount = promo.amount;
                }

                await prisma.promotion.update({
                    where: { promo_id: promo.promo_id },
                    data: { remaining_usage: promo.remaining_usage - 1 },
                });
            }
        }

        const userAffiliate = await prisma.user.findUnique({
            where: {
                user_id: userIdInt,
            },
        });

        if (userAffiliate && userAffiliate.affiliate_usage) {
            affiliateDiscountAmount = totalPrice * 0.5;

            await prisma.user.update({
                where: { user_id: userIdInt },
                data: { affiliate_usage: false },
            });
        }

        const totalPriceWithDiscounts = totalPrice - promoDiscountAmount - affiliateDiscountAmount;
        const totalPriceWithShipping = totalPriceWithDiscounts + totalShippingFee;

        const order = await prisma.orders.create({
            data: {
                user: {
                    connect: {
                        user_id: userIdInt,
                    },
                },
                order_date: new Date(),
                delivery_time: new Date(),
                deliver_fee: totalShippingFee,
                total_price: parseFloat(totalPriceWithShipping.toFixed(2)),
                payment_status: 'Pending',
                order_status: 'Processing',
                admin: {
                    connect: {
                        admin_id: 1,
                    },
                },
                promo_code: promoCode,
                promo_discount_amount: promoDiscountAmount,
                affiliate_discount_amount: affiliateDiscountAmount,
                order_items: {
                    create: warehouseGroups.flatMap((group) =>
                        group.map((cartItem) => ({
                            product: {
                                connect: {
                                    product_id: cartItem.product.product_id,
                                },
                            },
                            quantity: cartItem.quantity,
                            price: cartItem.product.price,
                        }))
                    ),
                },
            },
        });

        const userCart = await prisma.shoppingCart.findFirst({
            where: {
                user_id: userIdInt,
            },
        });

        await prisma.shoppingCartItem.deleteMany({
            where: { cart_id: userCart.cart_id },
        });

        await prisma.shoppingCart.delete({
            where: { cart_id: userCart.cart_id },
        });

        return order;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create order');
    }
};

const getOrdersForUser = async (userId) => {
    try {
        const userIdInt = parseInt(userId, 10);

        const orders = await prisma.orders.findMany({
            where: {
                user_id: userIdInt,
            },
            include: {
                order_items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return orders;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve orders');
    }
};

module.exports = {
    createOrder,
    getOrdersForUser,
};
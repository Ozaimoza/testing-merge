const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

// Function to add a product to the shopping cart
async function addToCart(userId, productId) {
  try {
    // Check if there's a shopping cart
    let userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: userId,
      },
    });
    // If shopping cart not found generate one
    if (!userCart) {
      userCart = await prisma.shoppingCart.create({
        data: {
          user_id: userId,
        },
      });
    }

    const existingCartItem = await prisma.shoppingCartItem.findFirst({
      where: {
        cart_id: userCart.cart_id,
        product_id: productId,
      },
    });

    if (existingCartItem) {
      return await prisma.shoppingCartItem.update({
        where: { cart_item_id: existingCartItem.cart_item_id },
        data: { quantity: existingCartItem.quantity + 1 },
        include: { product: true },
      });
    } else {
      const product = await prisma.product.findUnique({
        where: { product_id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return await prisma.shoppingCartItem.create({
        data: {
          cart: {
            connect: {
              cart_id: userCart.cart_id,
            },
          },
          product: {
            connect: {
              product_id: productId,
            },
          },
          quantity: 1,
        },
        include: { product: true },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

// Function to retrieve the shopping cart for a user
async function getShoppingCart(userId) {
  try {
    const userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: parseInt(userId, 10),
      },
      include: { cart_items: { include: { product: true } } },
    });

    if (userCart) {
      return userCart.cart_items;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error in getShoppingCart: ${error.message}`);
    throw new Error('Failed to retrieve shopping cart');
  }
}

// Function to remove a product from the shopping cart
async function removeFromCart(cartItemId, userId, productId) {
  try {
    const userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: parseInt(userId, 10),
        cart_items: {
          some: {
            cart_item_id: parseInt(cartItemId, 10),
          },
        },
      },
    });

    if (!userCart) {
      throw new Error('User cart not found');
    }

    const deletedCartItem = await prisma.shoppingCartItem.delete({
      where: { cart_item_id: parseInt(cartItemId, 10) },
      include: { product: true },
    });

    const remainingCartItems = await prisma.shoppingCartItem.count({
      where: { cart_id: userCart.cart_id },
    });

    if (remainingCartItems === 0) {
      await prisma.shoppingCart.delete({
        where: { cart_id: userCart.cart_id },
      });
    }

    return { message: 'Product removed from the shopping cart', deletedCartItem };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

// Function to update the quantity of a product in the shopping cart
async function updateCartItemQuantity(cartItemId, newQuantity, userId) {
  try {
    const userCart = await prisma.shoppingCart.findFirst({
      where: {
        user_id: parseInt(userId, 10),
        cart_items: {
          some: {
            cart_item_id: parseInt(cartItemId, 10),
          },
        },
      },
    });

    if (!userCart) {
      throw new Error('User cart not found');
    }

    const updatedCartItem = await prisma.shoppingCartItem.update({
      where: { cart_item_id: parseInt(cartItemId, 10) },
      data: { quantity: newQuantity },
      include: { product: true },
    });

    if (newQuantity === 0) {
      await prisma.shoppingCartItem.delete({
        where: { cart_item_id: parseInt(cartItemId, 10) },
      });

      const remainingCartItems = await prisma.shoppingCartItem.count({
        where: { cart_id: userCart.cart_id },
      });

      if (remainingCartItems === 0) {
        await prisma.shoppingCart.delete({
          where: { cart_id: userCart.cart_id },
        });
      }

      return { message: 'Product removed from the shopping cart', deletedCartItem: updatedCartItem };
    }

    return { message: 'Quantity updated for the product in the shopping cart', updatedCartItem };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
}

module.exports = {
  addToCart,
  getShoppingCart,
  removeFromCart,
  updateCartItemQuantity,
};

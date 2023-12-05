const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const OrderController = {
  getAllOrders: async (req, res) => {
    const orders = await prisma.orders.findMany({
      include: { order_items: true },
    });
    res.json(orders);
  },

  getOrderById: async (req, res) => {
    const orderId = parseInt(req.params.id);
    const order = await prisma.orders.findUnique({
      where: { order_id: orderId },
      include: { order_items: true },
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.json(order);
    }
  },

  updateOrder: async (req, res) => {
    const orderId = parseInt(req.params.id);
    const updatedOrder = await prisma.orders.update({
      where: { order_id: orderId },
      data: req.body,
      include: { order_items: true },
    });

    res.json(updatedOrder);
  },

  deleteOrder: async (req, res) => {
    const orderId = parseInt(req.params.id);
    await prisma.orders.delete({
      where: { order_id: orderId },
    });

    res.json({ message: 'Order deleted successfully' });
  },
};

module.exports = OrderController;

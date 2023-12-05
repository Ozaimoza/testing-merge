const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create an order
router.post('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const promoCode = req.body.promoCode;
  const courier = req.body.courier; 

  try {
    const order = await orderController.createOrder(userId, promoCode, courier);
    return res.status(200).json({ message: 'Order processed successfully', orderId: order.order_id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get orders for a user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await orderController.getOrdersForUser(userId);
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

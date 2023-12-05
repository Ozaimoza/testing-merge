const express = require("express");
const router = express.Router();
const prisma = require("../prisma/generated/client");
const adminRouter = require("./admin");


const productRouter = require("./product");
const userRouter = require("./user");
const orderRouter = require("./order");
const promotionRouter = require("./promoRoutes");
const affiliateRouter = require("./affiliateRoutes");

const shoppingCartRoutes = require('./shoppingCartRoutes');
const userAuthRoutes = require('./userAuthenticationRoutes'); 
const orderRoutes = require('./orderRoutes');
const proofOfPaymentRoutes = require('./proofOfPaymentRoutes');

router.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

router.use("/admin", adminRouter);
router.use("/product", productRouter);
router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/promo", promotionRouter);
router.use("/affiliate", affiliateRouter);

router.use('/shoppingCart', shoppingCartRoutes);
router.use('/userauth', userAuthRoutes);  
router.use('/user/orders', orderRoutes);
router.use('/user', proofOfPaymentRoutes);

module.exports = router;

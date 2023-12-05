const express = require("express");
const router = express.Router();
const prisma = require("../prisma/generated/client");
const adminRouter = require("./admin");

const productRouter = require("./product");
const userRouter = require("./user");
const orderRouter = require("./order");
const promotionRouter = require("./promoRoutes");
const affiliateRouter = require("./affiliateRoutes");

const shoppingCartRoutes = require("./shoppingCartRoutes");
const userAuthRoutes = require("./userAuthenticationRoutes");
const orderRoutes = require("./orderRoutes");
const proofOfPaymentRoutes = require("./proofOfPaymentRoutes");
const axios = require("axios");

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

router.use("/shoppingCart", shoppingCartRoutes);
router.use("/userauth", userAuthRoutes);
router.use("/user/orders", orderRoutes);
router.use("/user", proofOfPaymentRoutes);

//raja ongkir province
router.get("/rajaongkir/province", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/province",
      {
        headers: {
          key: "5985d7433b5faf58ae6933d9876eddf1",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//raja ongkir city
router.get("/rajaongkir/city", async (req, res) => {
  const { provinceId } = req.query;

  if (!provinceId) {
    return res.status(400).json({ error: "Province ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.rajaongkir.com/starter/city?province=${provinceId}`,
      {
        headers: {
          key: "5985d7433b5faf58ae6933d9876eddf1",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/rajaongkir/citydetail", async (req, res) => {
  const { province, id } = req.query;

  if (!province) {
    return res.status(400).json({ error: "Province ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.rajaongkir.com/starter/city?id=${id}&province=${province}`,
      {
        headers: {
          key: "5985d7433b5faf58ae6933d9876eddf1",
        },
      }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router;
module.exports = router;

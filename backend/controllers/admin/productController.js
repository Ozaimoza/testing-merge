const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const productController = {
  getAllProduct: async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products || {});
  },

  getByID: async (req, res) => {
    const param = req.params.id;
    try {
      const id = parseInt(param);
      const product = await prisma.product.findUnique({
        where: { product_id: id },
      });
      return res.json(product || {});
    } catch (e) {
      res.status(400).json({ message: "id must be a number" });
    }
  },

  createProduct: async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Please upload the image" });

      const {
        name,
        description,
        price,
        stock,
        is_available,
        category_id,
        warehouse_id,
        weight,
      } = req.body;
      const intStock = parseInt(stock);
      const intPrice = parseInt(price);
      const intWeight = parseInt(weight);
      const isAvailableBoolean = is_available.toLowerCase() === "true";

      const product = await prisma.product.create({
        data: {
          name: name,
          description: description,
          price: intPrice,
          stock: intStock,
          is_available: isAvailableBoolean,
          category_id: parseInt(category_id), // Convert to number
          warehouse_id: parseInt(warehouse_id), // Convert to number
          image: req.file.filename,
          weight: intWeight,
        },
      });

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        stock,
        is_available,
        category_id,
        warehouse_id,
        weight,
      } = req.body;
      const intStock = parseInt(stock);
      const numericPrice = parseFloat(price);
      const intWeight = parseInt(weight);

      const isAvailableBoolean =
        typeof is_available === "string"
          ? is_available.toLowerCase() === "true"
          : typeof is_available === "boolean"
            ? is_available
            : undefined;

      let updatedProduct;

      if (req.file) {
        // Jika ada file gambar baru, perbarui juga gambar
        updatedProduct = await prisma.product.update({
          where: {
            product_id: parseInt(id),
          },
          data: {
            name: name,
            description: description,
            price: numericPrice,
            stock: intStock,
            is_available: isAvailableBoolean,
            category_id: parseInt(category_id),
            warehouse_id: parseInt(warehouse_id),
            weight: intWeight,
            image: req.file.filename,
          },
        });
      } else {
        // Jika tidak ada file gambar baru, hanya perbarui informasi produk lainnya
        updatedProduct = await prisma.product.update({
          where: {
            product_id: parseInt(id),
          },
          data: {
            name: name,
            description: description,
            price: numericPrice,
            stock: intStock,
            is_available: isAvailableBoolean,
            category_id: parseInt(category_id),
            warehouse_id: parseInt(warehouse_id),
            weight: intWeight,
          },
        });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedProduct = await prisma.product.delete({
        where: {
          product_id: parseInt(id),
        },
      });

      res.json(deletedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getByCategory: async (req, res) => {
    try {
      const { category_id } = req.params;
      const products = await prisma.product.findMany({
        where: {
          category_id: parseInt(category_id),
        },
      });
      res.json(products || {});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllProductDetails: async (req, res) => {
    try {
      const productDetails = await prisma.product.findMany({
        include: {
          category: { select: { category_name: true } },
          warehouse: { select: { city_name: true } },
        },
      });

      res.json(productDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

};



module.exports = productController;

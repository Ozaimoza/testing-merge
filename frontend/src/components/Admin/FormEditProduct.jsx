// FormEditProduct.jsx
import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const FormEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    is_available: '',
    category_id: '',
    warehouse_id: '',
    weight: '',
    image: null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/product/${id}`);
        const productData = response.data;
        setFormData({
          name: productData.name,
          description: productData.description,
          price: String(productData.price),
          stock: String(productData.stock),
          is_available: String(productData.is_available),
          category_id: String(productData.category_id),
          warehouse_id: String(productData.warehouse_id),
          weight: String(productData.weight),
          image: null, // Biarkan null untuk menyimpan gambar yang ada
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleEditProduct = async () => {
    try {
      const {
        name,
        description,
        price,
        stock,
        is_available,
        category_id,
        warehouse_id,
        weight,
        image,
      } = formData;

      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('description', description);
      formDataToSend.append('price', price);
      formDataToSend.append('stock', stock);
      formDataToSend.append('is_available', is_available);
      formDataToSend.append('category_id', category_id);
      formDataToSend.append('warehouse_id', warehouse_id);
      formDataToSend.append('weight', weight);
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.put(`http://localhost:3000/product/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Produk berhasil diubah:', response.data);

      // Setelah berhasil mengubah, arahkan ke halaman produk
      navigate('/admin/product');
    } catch (error) {
      console.error('Error ubah produk:', error);
    }
  };

  return (
    <Box p={4}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Heading mb={4}>Edit Produk</Heading>
        {/* Tambahkan tautan untuk kembali ke halaman produk */}
        <Link to="/admin/product">
          <Button colorScheme="blue">Kembali ke Produk</Button>
        </Link>
      </Box>

      <form encType="multipart/form-data">
        <label>Nama Produk</label>
        <Input
          type="text"
          name="name"
          placeholder="Nama Produk"
          value={formData.name}
          onChange={handleInputChange}
          mb={3}
        />

        <label>Deskripsi</label>
        <Input
          type="text"
          name="description"
          placeholder="Deskripsi"
          value={formData.description}
          onChange={handleInputChange}
          mb={3}
        />

        <label>Harga</label>
        <Input
          type="text"
          name="price"
          placeholder="Harga"
          value={formData.price}
          onChange={handleInputChange}
          mb={3}
        />

        <label>Stok</label>
        <Input
          type="number"
          name="stock"
          placeholder="Stok"
          value={formData.stock}
          onChange={handleInputChange}
          mb={3}
        />

        <label>Tersedia (true/false)</label>
        <Input
          type="text"
          name="is_available"
          placeholder="Tersedia (true/false)"
          value={formData.is_available}
          onChange={handleInputChange}
          mb={3}
        />

        <label>ID Kategori</label>
        <Input
          type="number"
          name="category_id"
          placeholder="ID Kategori"
          value={formData.category_id}
          onChange={handleInputChange}
          mb={3}
        />

        <label>ID Gudang</label>
        <Input
          type="number"
          name="warehouse_id"
          placeholder="ID Gudang"
          value={formData.warehouse_id}
          onChange={handleInputChange}
          mb={3}
        />

        <label>Berat</label>
        <Input
          type="number"
          name="weight"
          placeholder="Berat"
          value={formData.weight}
          onChange={handleInputChange}
          mb={3}
        />

        <label>Gambar Produk</label>
        <Input type="file" name="image" onChange={handleImageChange} mb={3} />

        <Button colorScheme="blue" mt={4} onClick={handleEditProduct}>
          Simpan Perubahan
        </Button>
      </form>
    </Box>
  );
};

export default FormEditProduct;

// FormAddProduct.jsx
import React, { useState } from 'react';
import { Box, Heading, Button, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const FormAddProduct = () => {
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleTambahProduk = async () => {
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
      formDataToSend.append('image', image);

      const response = await axios.post('http://localhost:3000/product', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Produk berhasil ditambahkan:', response.data);

      // Setelah berhasil menambahkan, arahkan ke halaman produk
      navigate('/admin/product');
    } catch (error) {
      console.error('Error tambah produk:', error);
    }
  };

  return (
    <Box p={4}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Heading mb={4}>Tambah Produk</Heading>
        {/* Tambahkan tautan untuk kembali ke halaman produk */}
        <Link to="/admin/product">
          <Button colorScheme="blue">Kembali ke Produk</Button>
        </Link>
      </Box>

      <form encType="multipart/form-data">
        <Input
          type="text"
          name="name"
          placeholder="Nama Produk"
          value={formData.name}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="text"
          name="description"
          placeholder="Deskripsi"
          value={formData.description}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="text"
          name="price"
          placeholder="Harga"
          value={formData.price}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="number"
          name="stock"
          placeholder="Stok"
          value={formData.stock}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="text"
          name="is_available"
          placeholder="Tersedia (true/false)"
          value={formData.is_available}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="number"
          name="category_id"
          placeholder="ID Kategori"
          value={formData.category_id}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="number"
          name="warehouse_id"
          placeholder="ID Gudang"
          value={formData.warehouse_id}
          onChange={handleInputChange}
          mb={3}
        />
        <Input
          type="number"
          name="weight"
          placeholder="Berat"
          value={formData.weight}
          onChange={handleInputChange}
          mb={3}
        />
        <Input type="file" name="image" onChange={handleImageChange} mb={3} />
        <Button colorScheme="green" mt={4} onClick={handleTambahProduk}>
          Simpan Produk
        </Button>
      </form>
    </Box>
  );
};

export default FormAddProduct;

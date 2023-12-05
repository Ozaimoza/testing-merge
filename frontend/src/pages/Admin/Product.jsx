// Product.jsx

import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Text, Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';



const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/product/detail');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/product/search?term=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <Flex p={4} mx="auto" maxW="1200px" justifyContent="space-between" flexDirection="column">
      {/* Header */}
      <Box mb={4}>
        <Text fontSize="4xl" fontWeight="bold" my="1" textAlign="center" textTransform="uppercase">
          Product Management
        </Text>
      </Box>

     {/* Search bar dan Tombol "Tambah Produk" */}
          <Flex my="3" justifyContent="space-between" width={['100%', '48%']}>
              {/* Tombol untuk mengarahkan ke formulir tambah produk */}
              <Link to="/admin/product/add">
                  <Button colorScheme="green" fontSize="sm" mr="2">
                      Tambah Produk
                  </Button>
              </Link>

              <InputGroup mb="3" mx="5">
                  <Input
                      placeholder="Search Product"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fontSize="sm"
                  />
                  <InputRightElement width="3rem">
                      <Button colorScheme="blue" h="2.5rem" size="sm" onClick={handleSearch} fontSize="sm">
                          Search
                      </Button>
                  </InputRightElement>
              </InputGroup>
          </Flex>

      {/* Product List */}
      <Flex flexWrap="wrap" justifyContent="space-between">
        {products.map((product) => (
          <Box
            key={product.product_id}
            p={4}
            mb={4}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            width={['100%', '48%']} // Responsive width for 2 columns
          >
            <Flex justifyContent="space-between">
              {/* Gambar Produk */}
              <Box flex="1" mr={4}>
                <Image
                  src={`http://localhost:3000/images/${product.image}`}
                  alt={product.name}
                  maxH="150px"
                  mb={2}
                  width="100%"
                  borderRadius="md"
                />
              </Box>

              {/* Data Produk */}
              <Box flex="2" mr={4}>
                <Text fontSize="xl" fontWeight="semibold">
                  {product.name}
                </Text>
                <Text fontSize="md">{product.description}</Text>
                <Text color="gray.500" fontSize="sm">
                  Price: ${product.price}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Stock: {product.stock}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Category: {product.category.category_name}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Warehouse: {product.warehouse.city_name}
                </Text>
                {/* Tambahkan informasi lainnya sesuai kebutuhan */}
              </Box>

              {/* Tombol Aksi */}
              <Box>
                <Link to={`/admin/product/edit/${product.product_id}`}>
                  <Button colorScheme="blue" mb={2} fontSize="sm">
                    Edit
                  </Button>
                </Link>
                <Button colorScheme="red" mb={2} ml={2} fontSize="sm">
                  Delete
                </Button>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default Product;

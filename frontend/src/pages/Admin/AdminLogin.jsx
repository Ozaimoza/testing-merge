import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/admin/login', credentials);
      const { token } = response.data;

      setError(null);

      localStorage.setItem('Token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/admin/product');
    } catch (error) {
      setError('Login gagal. Cek kembali username dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      bg={useColorModeValue('gray.200', 'gray.800')} // Warna latar belakang abu-abu
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={4}
        maxW="350px"
        bg={useColorModeValue('white', 'gray.700')} // Warna latar belakang putih atau abu-abu gelap
        shadow="md"
        rounded="lg"
        textAlign="center"
      >
        <Heading mb={6}>Welcome back!</Heading>
        <Text fontSize="lg" color="gray.600" mb={6}>
          Let's start manage 404 website!
        </Text>
        <Stack spacing={4}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AdminLogin;

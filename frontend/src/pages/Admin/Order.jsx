// Order.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
  Select,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Order = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/order/detail', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        });

        setOrderDetails(response.data);
      } catch (error) {
        console.error('Kesalahan mengambil detail pesanan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/order/${orderId}`,
        { order_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        }
      );

      setOrderDetails((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSearch = () => {
    // Handle search functionality if needed
  };

  return (
    <Box p={4} mx="auto">
      <Heading my="5" textAlign="center" textTransform="uppercase">
        Order Management
      </Heading>

      {/* search bar */}
      <Box my="5" w="25%" ml="auto">
        <HStack w="full">
          <InputGroup size="sm">
            <Input placeholder="Search Order" textAlign={"center"} />
          </InputGroup>
          <Button
            as={Link}
            to="create"
            colorScheme="blue"
            h="1.75rem"
            size="sm"
            onClick={handleSearch}
          >
            Search
          </Button>
        </HStack>
      </Box>
      {/* end of search bar */}

      <Box border="1px solid" rounded="3xl" overflowX="auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : orderDetails.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  No.
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Order ID
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Order Date
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Total Price
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Product Name
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Quantity
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Price
                </Th>
                <Th textAlign="center" borderBottom="1px solid" p={2}>
                  Order Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderDetails.map((order, index) => (
                <Tr key={order.order_id}>
                  <Td textAlign="center" p={2}>{index + 1}</Td>
                  <Td textAlign="center" p={2}>{order.order_id}</Td>
                  <Td textAlign="center" p={2}>
                    {new Date(order.order_date).toLocaleDateString()}
                  </Td>
                  <Td textAlign="center" p={2}>{order.total_price}</Td>
                  <Td textAlign="center" p={2}>
                    {order.order_items[0]?.product.name}
                  </Td>
                  <Td textAlign="center" p={2}>{order.order_items[0]?.quantity}</Td>
                  <Td textAlign="center" p={2}>{order.order_items[0]?.price}</Td>
                  <Td textAlign="center" p={2}>
                    <Box display="flex" alignItems="center">
                      {order.ProofsOfPayment  [0]?.image && (
                        <img
                          src={order.ProofsOfPayment  [0].image}
                          alt={`Proof of Payment ${order.order_id}`}
                          style={{ maxWidth: '50px', marginRight: '10px' }}
                        />
                      )}
                      <Select
                        size="sm"
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const orderId = order.order_id;
                          handleStatusChange(orderId, newStatus);
                        }}
                        value={order.order_status}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="finish">Finish</option>
                      </Select>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default Order;

import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Button, Select, HStack, Input, InputGroup, InputRightElement, } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const handleSearch = () => { };


  return (
    <Box p={4} mx="auto">
      <Heading my="5" textAlign="center" textTransform="uppercase">
        User Management
      </Heading>
      <Box my="5" w="25%" ml="auto">
        <HStack w="full">
          <InputGroup size="sm">
            <Input placeholder="Search User" textAlign={"center"} />
          </InputGroup>
          <Button
            as={Link}
            to="create"
            colorScheme="blue"
            h="1.75rem"
            size="sm"
            onClick={handleSearch}
          >Search
          </Button>
        </HStack>
      </Box>
      <Box border="1px solid" rounded="3xl" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textAlign="center" borderBottom="1px solid" p={2}>No.</Th>
              <Th textAlign="center" borderBottom="1px solid" p={2}>User ID</Th>
              <Th textAlign="justify" borderBottom="1px solid" p={2}>Name</Th>
              <Th textAlign="justify" borderBottom="1px solid" p={2}>Email</Th>
              <Th textAlign="justify" borderBottom="1px solid" p={2}>Affiliate Code</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={user.user_id}>
                <Td textAlign="center" p={2}>{index + 1}</Td>
                <Td textAlign="center" p={2}>{user.user_id}</Td>
                <Td textAlign="justify" p={2}>{user.full_name}</Td>
                <Td textAlign="justify" p={2}>{user.email}</Td>
                <Td textAlign="justify" p={2} color="red">{user.affiliate_code}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default User;

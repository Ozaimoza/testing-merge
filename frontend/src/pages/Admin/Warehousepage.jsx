import {
  Box,
  Text,
  VStack,
  Button,
  WrapItem,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { getAllWarehouses } from "../../modules/fetch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteWarehouse } from "../../modules/fetch/index";

export default function Warehousepage() {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWarehouses = async () => {
    const warehouses = await getAllWarehouses();
    setWarehouses(warehouses);
  };
  useEffect(() => {
    fetchWarehouses();
  }, [searchTerm]);

  //search
  const handleSearch = () => {
    // Gunakan filter untuk mencocokkan gudang berdasarkan nama
    const filteredWarehouses = warehouses.warehouses.filter((warehouse) =>
      warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update state dengan daftar gudang yang sesuai
    setWarehouses({ warehouses: filteredWarehouses });
  };

  //Delete
  const handleDelete = async (warehouseId) => {
    try {
      // Panggil fungsi deleteWarehouse dari modul fetch/index.js
      await deleteWarehouse(warehouseId);

      // Update state warehouses setelah penghapusan
      const updatedWarehouses = warehouses.warehouses.filter(
        (warehouse) => warehouse.warehouse_id !== warehouseId
      );
      setWarehouses({ warehouses: updatedWarehouses });

      // Tampilkan notifikasi atau pesan sukses jika diperlukan
      console.log("Warehouse deleted successfully!");
    } catch (error) {
      // Tangani error jika terjadi kesalahan saat penghapusan
      console.error("Error deleting warehouse:", error.message);
    }
  };

  return (
    <>
      <Box bg="blue.200" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Warehouse
        </Text>
      </Box>

      <Box align="center" p="20px">
        <VStack spacing={4} align="stretch" p={12}>
          {/* search bar */}
          <Box>
            <HStack w="full">
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  placeholder="Warehouse Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleSearch}>
                    Search
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button as={Link} to="create" colorScheme="blue">
                Add Warehouse
              </Button>
            </HStack>
          </Box>
          {/* end of search bar */}

          <VStack overflowY="auto" h="70vh" bg="gray.200" p={4}>
            {warehouses?.warehouses?.map((warehouse) => (
              <WrapItem
                bg="blue.200"
                w="full"
                rounded="lg"
                key={`${warehouse.warehouse_id} `}
              >
                <Box w="80%" rounded="lg">
                  <Text>{`${warehouse.warehouse_name}`}</Text>
                  <Text>{`${warehouse.city_name}`}</Text>
                  <Text>{`${warehouse.province_name}`}</Text>
                </Box>
                <Box p={2}>
                  <VStack spacing={2}>
                    <Button
                      w="full"
                      colorScheme="yellow"
                      as={Link}
                      to={`/admin/warehouse/${warehouse.warehouse_id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      w="full"
                      colorScheme="red"
                      onClick={() => handleDelete(warehouse.warehouse_id)}
                      key={warehouse.warehouse_id}
                    >
                      Delete
                    </Button>
                  </VStack>
                </Box>
              </WrapItem>
            ))}
          </VStack>
        </VStack>
      </Box>
    </>
  );
}

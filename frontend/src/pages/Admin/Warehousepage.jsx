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
  
  export default function Warehousepage() {
    const [warehouses, setWarehouses] = useState([]);
    useEffect(() => {
      const fetchWarehouses = async () => {
        const warehouses = await getAllWarehouses();
        setWarehouses(warehouses);
      };
      fetchWarehouses();
    }, []);
  
    const handleClick = () => {};
  
    return (
      <>
        <Box bg="blue.200" w="full" align="center" height="60px">
          <Text pt={5}>Warehouse</Text>
        </Box>
  
        <Box align="center" p="20px">
          <VStack spacing={4} align="stretch" p={12}>
            {/* search bar */}
            <Box>
              <HStack w="full">
                <InputGroup size="md">
                  <Input pr="4.5rem" placeholder="Warehouse Name" />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}></Button>
                  </InputRightElement>
                </InputGroup>
                <Button as={Link} to="create" colorScheme="blue">
                  Add Warehouse
                </Button>
              </HStack>
            </Box>
            {/* end of search bar */}
  
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
                    <Button w="full" colorScheme="yellow">
                      Edit
                    </Button>
                    <Button w="full" colorScheme="red">
                      Delete
                    </Button>
                  </VStack>
                </Box>
              </WrapItem>
            ))}
          </VStack>
        </Box>
      </>
    );
  }
  
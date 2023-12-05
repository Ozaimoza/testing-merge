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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  editCategory,
  deleteCategory,
} from "../../modules/fetch";

const Categorypage = () => {
  const [categories, setCategories] = useState([]);
  //   const [categoryName, setCategoryName] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalHeader, setModalHeader] = useState("Add Category");
  const [modalButtonLabel, setModalButtonLabel] = useState("Create");
  const OverlayOne = () => <ModalOverlay backdropFilter="blur(10px) " />;
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categorys);
      // console.log(response.categorys);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const handleSearch = () => {
    // Check if categories is an array
    if (Array.isArray(categories)) {
      // Gunakan filter untuk mencocokkan gudang berdasarkan nama
      const filteredCategories = categories.filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Update state dengan daftar gudang yang sesuai
      setCategories(filteredCategories);
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalHeader === "Add Category") {
        // Logika untuk menambah kategori baru
        const data = {
          category_name: categoryData.category_name,
        };
        await createCategory(data);
        console.log("Category Created Successfully ", data);
      } else if (modalHeader === "Edit Category") {
        // Logika untuk mengedit kategori
        await editCategory(
          categoryData.category_id,
          categoryData.category_name
        );
        console.log(
          "Category Edited Successfully ",
          categoryData.category_id,
          categoryData.category_name
        );
      }

      await fetchCategories();
      onClose();
    } catch (error) {
      console.error("error:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      //   console.log(id);
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("error:", error.message);
    }
  };

  return (
    <>
      <Box bg="blue.200" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Category
        </Text>
      </Box>

      <Box align="center" p="20px">
        <VStack spacing={4} align="stretch" p={12}>
          {/* Search bar */}
          <Box>
            <HStack w="full">
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  placeholder="Category Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleSearch}>
                    Search
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setModalHeader("Add Category");
                  setModalButtonLabel("Create");
                  setCategoryData(null);
                  setOverlay(<OverlayOne />);
                  onOpen();
                }}
              >
                Add Category
              </Button>
            </HStack>
          </Box>
          {/* End of search bar */}

          <VStack overflowY="auto" h="70vh" bg="gray.200" p={4}>
            {categories?.map((category) => (
              <WrapItem
                bg="blue.200"
                w="full"
                rounded="lg"
                key={`${category.category_id}`}
              >
                <Box w="80%" rounded="lg">
                  <Text>{`${category.category_name}`}</Text>
                </Box>
                <Box p={2}>
                  <VStack spacing={2}>
                    <Button
                      w="full"
                      colorScheme="yellow"
                      onClick={() => {
                        setModalHeader("Edit Category");
                        setModalButtonLabel("Update"); // Ubah teks header modal
                        setOverlay(<OverlayOne />);
                        setCategoryData(category); // Set data kategori yang akan diedit
                        onOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      w="full"
                      colorScheme="red"
                      onClick={() => handleDelete(category.category_id)}
                      // key={category.category_id}
                    >
                      Delete
                    </Button>
                  </VStack>
                </Box>
              </WrapItem>
            ))}
          </VStack>
        </VStack>

        {/* Modal */}

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <ModalHeader>
              <Text as="b" fontSize="x-large">
                {modalHeader}
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <Text as="b" fontSize="large">
                  Category Name
                </Text>
                <Input
                  placeholder="Category Name"
                  size="lg"
                  value={categoryData?.category_name || ""}
                  onChange={(e) => {
                    setCategoryData((prevData) => ({
                      ...prevData,
                      category_name: e.target.value,
                    }));
                  }}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit}>{modalButtonLabel}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default Categorypage;

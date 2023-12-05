import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Stack,
  Select,
  Input,
  Link,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { IoIosBackspace } from "react-icons/io";
import {
  createWarehouse,
  getWarehouseById,
  editWarehouse,
} from "../modules/fetch";
import { useParams } from "react-router-dom";

const WarehouseForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedProvinceID, setSelectedProvinceID] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchWarehouseById = async (id) => {
    try {
      const response = await getWarehouseById(id);
      const warehouseData = response;

      // Update state variables with the fetched data
      setWarehouseName(warehouseData.warehouse_name);
      setSelectedProvince(warehouseData.province_name); // Assuming the server response has a 'province' field
      setSelectedProvinceID(warehouseData.province_id); // Assuming the server response has a 'province' field
      setSelectedCity(warehouseData.city_name); // Assuming the server response has a 'city' field
      setPostalCode(warehouseData.postal_code); // Assuming the server response has a 'postalCode' field
    } catch (error) {
      setError("Error fetching warehouse by id");
      console.log(error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/rajaongkir/province"
      );
      setProvinces(response.data);
    } catch (error) {
      setError("Error fetching provinces");
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCitiesByProvince = async (provinceId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/rajaongkir/city?provinceId=${provinceId}`
      );
      setCities(response.data);
      //   console.log(cities);
      if (response.data.length > 0) {
        setPostalCode(response.data[0].postal_code);
      }
    } catch (error) {
      setError("Error fetching cities");
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  if (id) {
    useEffect(() => {
      fetchWarehouseById(id);
    }, []);
  }

  useEffect(() => {
    if (selectedProvinceID) {
      fetchCitiesByProvince(selectedProvinceID);
    }
    // console.log(selectedProvinceID, selectedProvince);
  }, [selectedProvinceID]);

  const handleSubmit = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/rajaongkir/citydetail?id=${selectedCity}&province=${selectedProvinceID}`
      );
      const detail = res.data;
      const data = {
        warehouse_name: warehouseName,
        province_id: parseInt(detail.province_id),
        province_name: detail.province,
        city_id: parseInt(detail.city_id),
        city_name: detail.city_name,
        postal_code: parseInt(detail.postal_code),
      };

      await createWarehouse(data);
      //   console.log(data);
      console.log("Warehouse created successfully!");
    } catch (error) {
      setError(`Error fetching citydetail data: ${error.message}`);
      console.error("Error fetching citydetail data:", error);
    }
  };

  const handleEdit = async (warehouseID) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/rajaongkir/citydetail?id=${selectedCity}&province=${selectedProvinceID}`
      );
      const detail = res.data;
      const id = warehouseID;
      const data = {
        warehouse_name: warehouseName,
        province_id: parseInt(detail.province_id),
        province_name: detail.province,
        city_id: parseInt(detail.city_id),
        city_name: detail.city_name,
        postal_code: parseInt(detail.postal_code),
      };

      await editWarehouse(id, data);
      console.log("data successfully updated", data);
    } catch (error) {
      setError(`Error fetching citydetail data: ${error.message}`);
      console.error("Error fetching citydetail data:", error);
    }
  };

  return (
    <>
      <Box bg="blue.200" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Warehouse Form
        </Text>
      </Box>
      <Stack p={10} spacing={3}>
        <Button
          as={Link}
          href="/admin/warehouse"
          width="60px"
          h="60px"
          rounded="full"
          bg={"white"}
          align="center"
          _hover={{
            transform: "scale(1.1)",
            transitionDuration: "0.4s",
            rounded: "full",
            transitionTimingFunction: "ease-in-out",
            bg: "gray.400",
          }}
        >
          <IoIosBackspace size={64} />
        </Button>

        <Box p={6} bg="gray.100" rounded="lg">
          <Stack spacing={3}>
            <Text as="b" fontSize="x-large">
              Warehouse Name
            </Text>
            <Input
              placeholder="Warehouse Name"
              size="lg"
              bg="white"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
            />
            <Text as="b" fontSize="x-large">
              Province
            </Text>
            <Select
              placeholder={
                selectedProvince ? selectedProvince : "Select Provice"
              }
              //   value={selectedProvince}
              size="lg"
              onChange={(e) => {
                setSelectedProvince(e.target.name);
                setSelectedProvinceID(e.target.value);
                // console.log(selectedProvinceID);
              }}
              bg="white"
            >
              {provinces.map((province) => (
                <option
                  key={province.province_id}
                  value={province.province_id}
                  name={province.province}
                >
                  {province.province}
                </option>
              ))}
            </Select>
            <Text as="b" fontSize="x-large">
              City
            </Text>
            <Select
              placeholder={selectedCity ? selectedCity : "Select City"}
              //   value={selectedCity}
              size="lg"
              bg="white"
              onChange={(e) => {
                setSelectedCity(e.target.value);
                const selectedCityData = cities.find(
                  (city) => city.city_id === e.target.value
                );
                if (selectedCityData) {
                  setPostalCode(selectedCityData.postal_code);
                }
              }}
            >
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </Select>
            {error && <Text color="red.500">{error}</Text>}
            <Text as="b" fontSize="x-large">
              Postal Code
            </Text>
            <Input
              bg="white"
              placeholder="Postal Code"
              size="lg"
              isReadOnly
              value={postalCode}
            />
            {/* Tombol Create */}
            {!id && (
              <Button bg="blue.100" onClick={handleSubmit}>
                Create
              </Button>
            )}

            {/* Tombol Edit */}
            {id && (
              <Button bg="blue.100" onClick={() => handleEdit(id)}>
                Edit
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default WarehouseForm;

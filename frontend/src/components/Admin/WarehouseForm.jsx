// Komponen WarehouseForm
import { useState, useEffect } from "react";
import { Text, Box, Stack, Select, Input, Link } from "@chakra-ui/react";
import axios from "axios";
import { IoIosBackspace } from "react-icons/io";

const WarehouseForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (selectedProvince) {
      fetchCitiesByProvince(selectedProvince);
    }
  }, [selectedProvince]);

  return (
    <>
      <Box bg="blue.200" w="full" align="center" height="60px">
        <Text fontWeight="bold" fontSize={"xx-large"}>
          Warehouse Form
        </Text>
      </Box>{" "}
      <Box
        size="md"
        height="60px"
        width="60px"
        rounded="lg"
        bg="red"
        align="center"
        boxShadow="lg"
        _hover={{
          transform: "scale(1.1)",
          transitionDuration: "0.4s",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <IoIosBackspace size={35} />
      </Box>
      <Box p={6} bg="gray.100" m={10} rounded="lg">
        <Stack spacing={3}>
          <Text as="b" fontSize="x-large">
            Warehouse Name
          </Text>
          <Input placeholder="Warehouse Name" size="lg" />
          <Text as="b" fontSize="x-large">
            Province
          </Text>
          <Select
            placeholder="Select Province"
            size="lg"
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province}
              </option>
            ))}
          </Select>
          <Text as="b" fontSize="x-large">
            City
          </Text>
          <Select
            placeholder="Select City"
            size="lg"
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
            placeholder="Postal Code"
            size="lg"
            isReadOnly
            value={postalCode}
          />
        </Stack>
      </Box>
    </>
  );
};

export default WarehouseForm;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Warehousepage from "./pages/Admin/Warehousepage";
import WarehouseForm from "./components/WarehouseForm";
import AdminSidebar from "./components/AdminSidebar";
import Categorypage from "./pages/Admin/Categorypage";
import { Box, Flex } from "@chakra-ui/react";

const AdminRouter = () => {
  return (
    <>
      <Flex w="100vw" h="100vh" align="center">
        <AdminSidebar />
        <Box bg="white" w="full" h="full">
          <Routes>
            <Route path="/warehouse" element={<Warehousepage />} />
            <Route path="/warehouse/create" element={<WarehouseForm />} />
            <Route path="/warehouse/:id" element={<WarehouseForm />} />
            <Route path="/category" element={<Categorypage />} />
          </Routes>
        </Box>
      </Flex>
    </>
  );
};

export default AdminRouter;

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRouter from "./AdminRouter"; // Sesuaikan dengan struktur proyek Anda
import UserRouter from "./UserRouter"; // Sesuaikan dengan struktur proyek Anda

const App = () => {
  return (
    <React.StrictMode>
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/user/*" element={<UserRouter />} />
            {/* Mungkin Anda ingin menambahkan rute lain di sini */}
          </Routes>
        </Router>
      </ChakraProvider>
    </React.StrictMode>
  );
};

export default App;

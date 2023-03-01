import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import Layout from "./Layout";
import { Box } from "@mui/material";

const NotFoundError = () => {
  return (
    <Box sx={{marginLeft: 3}}>
      <h1>Not Found</h1>
      <h3>ページが見つかりません</h3>
    </Box>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/*" element={<NotFoundError />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

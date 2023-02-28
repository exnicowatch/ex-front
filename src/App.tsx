import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./components/main/MainPage";
import Layout from "./Layout";

const NotFoundError = () => {
  return (
    <>
      <h1>ページが存在しません</h1>
    </>
  )
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/*" element={<NotFoundError />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

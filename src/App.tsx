import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import MainPage from "./components/main/MainPage";
import Header from "./header/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

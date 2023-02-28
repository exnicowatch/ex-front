import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";

const ExtensionError = () => {
  return (
    <>
      <h1>拡張機能が導入されていません</h1>
      <p>使用するにはExNicoExtensionを導入する必要があります</p>
    </>
  )
}

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        {window.ex === undefined ? (
          <ExtensionError />
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
};

export default Layout;

import React from "react";
import { Link } from "react-router-dom";
import Styled from "./MainPage.module.scss";

const MainPage = () => {
  return <div className={Styled.mainPage}>
    MainPage
    <ul>
      <li>
        <Link to="/watch/sm9">sm9</Link>
      </li>
      <li>
        <Link to="/watch/lv340461518">lv340461518</Link>
      </li>
    </ul>
  </div>;
};

export default MainPage;

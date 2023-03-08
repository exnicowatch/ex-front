import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Styled from "./MainPage.module.scss";

const MainPage = () => {
  useEffect(() => {
    document.title = "ExNicoWatch";
  }, []);
  return (
    <div className={Styled.mainPage}>
      MainPage
      <ul>
        <li>
          <Link to="/watch/sm9">sm9</Link>
        </li>
        <li>
          <Link to="/watch/sm500873">sm500873</Link>
        </li>
        <li>
          <Link to="/watch/sm37198633">sm37198633</Link>
        </li>
        <li>
          <Link to="/watch/sm41551011">sm41551011</Link>
        </li>
        <li>
          <Link to="/watch/sm37539735">sm37539735</Link>
        </li>
        <li>
          <Link to="/watch/lv340461518">lv340461518</Link>
        </li>
        <li>
          <Link to="/watch/test">test</Link>
        </li>
      </ul>
    </div>
  );
};

export default MainPage;

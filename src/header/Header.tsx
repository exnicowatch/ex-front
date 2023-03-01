import { AppBar, Avatar, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { NicoContext } from "../provider/NicoProvider";
import DehazeIcon from '@mui/icons-material/Dehaze';
import Styled from "./Header.module.scss";
import UserMenu from "../components/UserMenu/UserMenu";

const Header = () => {
  const nicoContextValue = useContext(NicoContext);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleUserMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenUserMenu(true);
    setUserMenuAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setOpenUserMenu(false);
    setUserMenuAnchorEl(null);
  }
  return (
    <AppBar position="static" className={Styled.header}>
      <Container className={Styled.headerCnt}>
        <Toolbar disableGutters className={Styled.headerBar}>
          <IconButton>
            <DehazeIcon />
          </IconButton>
          <Typography
            className={Styled.logoTitle}
            variant="h5"
            noWrap
            component={Link}
            to="/"
          >
            ExNicoWatch
          </Typography>
          <div style={{ flexGrow: 1 }}></div>
          {nicoContextValue.isLogin ? (
            <>
              <button className={Styled.iconBtn} onClick={handleUserMenuClick}>
                <Avatar src={nicoContextValue.loginUser?.icons.large} alt="UserIcon" />
              </button>
              <UserMenu anchorEl={userMenuAnchorEl} isOpen={openUserMenu} onClose={handleUserMenuClose} setIsOpen={setOpenUserMenu} />
            </>
          ) : (
            <Button variant="outlined" href="https://account.nicovideo.jp/login" target="_blank">ログイン</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

import { Avatar, Box, Divider, Popover } from "@mui/material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NicoContext } from "../../provider/NicoProvider";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import HelpIcon from "@mui/icons-material/Help";
import Styled from "./UserMenu.module.scss";

interface UserMenuProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onClose: () => void;
  anchorEl: HTMLButtonElement | null;
}

const UserMenu = (props: UserMenuProps) => {
  const nicoContextValue = useContext(NicoContext);
  const navigate = useNavigate();
  const navigateUserMenu = (path: string) => {
    navigate(path);
    props.setIsOpen(false);
  };
  return (
    <Popover
      open={props.isOpen}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      onClose={props.onClose}
      className={Styled.userMenu}
    >
      <Box className={Styled.userMenuHeader} onClick={() => navigateUserMenu("/user/me")}>
        <Avatar className={Styled.userMenuIcon} src={nicoContextValue.loginUser?.icons.large} />
        <Box className={Styled.userMenuMeta}>
          <p className={Styled.nickname}>{nicoContextValue.loginUser?.nickname}</p>
          <Box className={Styled.userMenuMetaData}>
            <p>
              {nicoContextValue.loginUser?.id}
              {nicoContextValue.loginUser?.registeredVersion}
            </p>
            <p className={`${nicoContextValue.loginUser?.isPremium ? Styled.premium : ""}`}>
              {nicoContextValue.loginUser?.isPremium ? "プレミアム会員" : "一般会員"}
            </p>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box className={Styled.userMenuMain}>
        <ul>
          <li onClick={() => navigateUserMenu("/user/me")}>
            <Link to="/user/me">
              <PersonIcon />
              ユーザーページ
            </Link>
          </li>
          <Divider />
          <li onClick={() => navigateUserMenu("/ranking")}>
            <Link to="/ranking">
              <StarIcon />
              ランキング
            </Link>
          </li>
          <Divider />
          <li onClick={() => navigateUserMenu("/help")}>
            <Link to="/help">
              <HelpIcon />
              ヘルプ
            </Link>
          </li>
        </ul>
      </Box>
    </Popover>
  );
};

export default UserMenu;

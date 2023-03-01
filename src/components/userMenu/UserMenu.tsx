import { Popover } from "@mui/material";
import React from "react";
import Styled from "./UserMenu.module.scss";

interface UserMenuProps{
  isOpen: boolean,
  onClose: () => void,
  anchorEl: HTMLButtonElement | null
}

const UserMenu = (props: UserMenuProps) => {
  return (
    <Popover
      open={props.isOpen}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={props.onClose}
    >
      The content of the Popover.
    </Popover>
  )
}

export default UserMenu;

import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import { User } from "../../../typesUI.ts";
import { logout } from "../../../features/users/usersThunks.ts";
import { unsetUser } from "../../../features/users/usersSlice.ts";

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const HandleLogout = () => {
    dispatch(logout());
    dispatch(unsetUser());
    navigate('/login');
  };

  return (
    <>
      <Button onClick={handleClick} color="inherit">
        Hello, {user.username}!
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={HandleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

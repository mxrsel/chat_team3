import { AppBar, styled, Toolbar, Typography } from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks.ts";
import UserMenu from "./UserMenu.tsx";
import AnonimusMenu from "./AnonimusMenu.tsx";
import { selectUser } from "../../../features/users/usersSlice.ts";

const Link = styled(NavLink)({
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    color: "inherit",
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  return (
    <AppBar position="sticky" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/">Chat</Link>
        </Typography>
        {user ? <UserMenu user={user} /> : <AnonimusMenu />}
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;

import React from "react";
import { OnlineUsers } from "../../../../typesUI.ts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { List, ListItem } from "@mui/material";

interface Props {
  users: OnlineUsers;
}

const UsersItem: React.FC<Props> = ({ users }) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
        }}
      >
        <List>
          <ListItem
            sx={{
              "&:hover": {
                backgroundColor: "lightgrey",
                cursor: "pointer",
              },
              padding: "8px 16px",
            }}
          >
            <Typography variant="h5">{users.username}</Typography>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default UsersItem;

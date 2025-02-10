import React from 'react';
import { OnlineUsers } from '../../../../typesUI.ts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { List, ListItem } from '@mui/material';

interface Props {
  user: OnlineUsers
}

const UsersItem: React.FC<Props> = ({user}) => {
  return (
    <>
      <Box
        sx={{
          width: '300px',
          borderRadius: '10px',
          margin: '10px auto',
          bgcolor: 'rgba(213,210,210,0.93)',
          overflowY: 'auto',
        }}>
        <List>
          <ListItem>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '290px'
              }}
            >
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <img width="30" height="30" src="https://img.icons8.com/office/40/user.png" alt="user"/>
                <Typography sx={{marginLeft: '10px', fontSize: '20px'}}>
                  {user.username}
                </Typography>
              </Box>
              <img width="20" height="20" src="https://img.icons8.com/emoji/48/green-circle-emoji.png"
                          alt="green-circle-emoji"/>
            </Box>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default UsersItem;
import { OnlineUsers } from '../../../../typesUI.ts';
import React from 'react';
import { List, ListItem } from '@mui/material';

interface Props {
  onlineUsers: OnlineUsers[]
}

const UsersList: React.FC<Props> = ({onlineUsers}) => {

  return (
    <>
      <h1>Online Now</h1>
      <List>
        {onlineUsers.map((user) => (
          <ListItem key={user._id}
            sx={{
              '&:hover': {
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
            },
              padding: '8px 16px',
            }}
          >{user.username}</ListItem>
        ))}
      </List>
    </>
  );
};

export default UsersList


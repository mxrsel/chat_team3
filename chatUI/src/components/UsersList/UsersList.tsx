import UsersItem from './UsersItem.tsx';
import { OnlineUsers } from '../../typesUI.ts';
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
      {onlineUsers.
        filter((user) => user.isOnline)
        .map((onlineUser, index) => (
        <ListItem key={index}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer',
                    },
                    padding: '8px 16px',
                  }}>
          <UsersItem key={index} users={onlineUser}/>
        </ListItem>
        ))
      }
      </List>
    </>
  );
};

export default UsersList


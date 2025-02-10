import { OnlineUsers } from '../../../../typesUI.ts';
import React from 'react';
import { List } from '@mui/material';
import UsersItem from './UsersItem.tsx';

interface Props {
  onlineUsers: OnlineUsers[]
}

const UsersList: React.FC<Props> = ({onlineUsers}) => {
  return (
    <>
      <List
        sx={{
          border: '1px solid rgba(110,104,104,0.28)',
          backgroundColor: 'rgba(207,200,200,0.28)',
          borderRadius: '10px'
        }}
      >
        {onlineUsers.map((user) => (
          <UsersItem key={user._id} user={user} />
        ))}
      </List>
    </>
  );
};

export default UsersList


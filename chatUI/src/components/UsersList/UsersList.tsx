import UsersItem from './UsersItem.tsx';
import { OnlineUsers } from '../../typesUI.ts';
import React from 'react';
import { List, ListItem } from '@mui/material';

interface Props {
  onlineUsers: OnlineUsers[]
}

const UsersList: React.FC<Props> = ({onlineUsers}) => {
  console.log('Пользователи в компоненте:', onlineUsers);
  return (
    <>
      <List>
      {onlineUsers.map((onlineUser, index) => (
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


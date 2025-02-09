import UsersList from '../components/UsersList/UsersList.tsx';
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../users/usersSlice.ts';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { IMessage, OnlineUsers } from '../../../typesUI.ts';
import { useNavigate } from 'react-router-dom';
import Messages from '../components/Messages/Messages.tsx';
import Box from '@mui/joy/Box';
import Container from '@mui/material/Container';
import { Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/joy/Typography';

const ChatPage = () => {
  const user = useAppSelector(selectUser);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('Authorize first!');
      navigate('/login');
      return;
    }

    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onopen = () => {
      console.log('WebSocket connected');

      if (ws.current) {
        ws.current.send(
          JSON.stringify({
            type: 'USER_LOGIN',
            payload: user.token,
          }),
        );
      }
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data);

      if (decodedMessage.type === 'LOGIN_USER') {
        setMessages(decodedMessage.payload);

        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              type: 'NEW_USER',
              id: user._id,
            })
          );
        }
      }

      if (decodedMessage.type === 'SET_ONLINE_USERS') {
        setOnlineUsers(decodedMessage.payload);
      }

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((prevState) => [...prevState, decodedMessage.payload]);
      }
    };

    ws.current.close = () => {
      console.log('WS disconnected');
      ws.current!.send(JSON.stringify({
        type: 'USER_LOGOUT',
        payload: user.token,
      }));
    };


    return () => {
      if (ws.current) {
        ws.current.close();
        console.log('Connection closed');
      }
    };
  }, [navigate, user]);


  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!ws.current) return;

    if (user) {
      ws.current?.send(
        JSON.stringify({
          type: 'NEW_MESSAGE',
          payload: {
            user: user._id,
            message: newMessage,
          },
        })
      );

      setNewMessage('');
    }
  };

  return (
    <Container>
      <Box sx={{display: 'flex', justifyContent: 'space-between', height: '420px', flexWrap: 'wrap'}}>
        <Box sx={{width: '350px'}}>
          <UsersList onlineUsers={onlineUsers}/>
        </Box>
        <Box sx={{width: '65%' }}>
          <Box sx={{marginBottom: '20px', height: '400px', overflowY: 'auto'}}>
            {messages.length > 0 ?
              <Messages messages={messages}/>
              :
              <Typography level="h1" sx={{margin: '20%'}}>No message yet!</Typography>
            }
          </Box>
          <Box>
            <form
              onSubmit={onSubmit}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{width: '80%', marginBottom: '10px'}}>
                <TextField
                  multiline
                  sx={{width: '100%'}}
                  variant="outlined"
                  placeholder="message"
                  minRows={1}
                  id="message"
                  name="message"
                  value={newMessage}
                  onChange={onChange}
                />
              </Box>
              <Box>
                <Button
                  sx={{width: '90px'}}
                  type="submit"
                  variant="contained"
                >
                  <SendIcon fontSize='medium' sx={{margin: '2px auto'}}/>
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatPage;
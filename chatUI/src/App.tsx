import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import Container from "@mui/material/Container";
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from "./features/users/LoginPage.tsx";
import RegisterPage from "./features/users/RegisterPage.tsx";
import { useEffect, useRef, useState } from 'react';
import UsersList from './components/UsersList/UsersList.tsx';

interface OnlineUser {
  token: string;
  username: string;
}

const getToken = (): string | null => sessionStorage.getItem('token');

const App = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  const connectWebSocket = (token: string) => {
    const ws = new WebSocket('ws://localhost:8000/chat');

    ws.onopen = () => {
      console.log('WebSocket connected');

      ws.send(
        JSON.stringify({
          type: 'USER_LOGIN',
          payload: token,
        }),
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'USERS') {
        setOnlineUsers(message.payload);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      setTimeout(() => connectWebSocket(token), 3000);
    };

    return ws;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log('Authorize first!');
      navigate('/login');
      return;
    }

    ws.current = connectWebSocket(token);

    const handleBeforeUnload = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: 'USER_LOGOUT',
            payload: token,
          }),
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (ws.current) {
        ws.current.send(
          JSON.stringify({
            type: 'USER_LOGOUT',
            payload: token,
          }),
        );
        localStorage.removeItem(token)
        ws.current.close();
      }
    };
  }, [navigate]);


  return (
    <>
      <header>
        <AppToolbar />
      </header>

      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/' element={<UsersList onlineUsers={onlineUsers}/>}/>
            <Route path="*" element={<h1>Not found</h1>} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;

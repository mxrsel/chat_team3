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

const App = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
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
            payload: token,
          }),
        );
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'USERS') {
        setOnlineUsers(message.payload);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
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

import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./features/users/LoginPage.tsx";
import RegisterPage from "./features/users/RegisterPage.tsx";
import ChatPage from './features/chat/containers/ChatPage.tsx';
import './App.css';

const App = () => {
  return (
    <>
      <header>
        <AppToolbar />
      </header>
      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<h1>Not found</h1>} />
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;

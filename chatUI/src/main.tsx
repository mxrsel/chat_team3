import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from "react-redux";
import {persistor, store} from "./app/store";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
             <CssBaseline/>
                 <BrowserRouter>
                     <App />
                 </BrowserRouter>
        </PersistGate>
    </Provider>
)

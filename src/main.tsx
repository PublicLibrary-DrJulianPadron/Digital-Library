import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from './app/store/index.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App } from './app/App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </StrictMode>
    </GoogleOAuthProvider>
);

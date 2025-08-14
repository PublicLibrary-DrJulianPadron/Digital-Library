import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from './app/store/index.ts';
import { App } from './app/App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <App />
            </Provider>
        </PersistGate>
    </StrictMode>
);

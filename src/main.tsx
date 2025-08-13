import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './app/App.tsx'
import './index.css'
import store from './app/store/index.ts';

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    counter: counterReducer, // Aquí definimos nuestros reductores
    // otrosSlices: otrosSlicesReducer
  },
});

export default store;
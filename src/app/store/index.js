import { configureStore } from '@reduxjs/toolkit';

const dummyReducer = () => ({});
const store = configureStore({
  reducer: {
    dummy: dummyReducer,
  },
});


export default store;
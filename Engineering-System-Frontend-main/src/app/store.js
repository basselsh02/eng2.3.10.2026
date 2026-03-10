import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../features/theme/themeSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import authReducer from '../features/auth/authSlice';


export default configureStore({
    reducer: {
        theme: themeReducer,
        sidebar: sidebarReducer,
        auth: authReducer,
    },
});
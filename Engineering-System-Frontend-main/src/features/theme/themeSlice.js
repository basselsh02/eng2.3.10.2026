import { createSlice } from '@reduxjs/toolkit';


export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: localStorage.getItem("theme") || "light",
    },
    reducers: {
        toggleTheme: (state) => {
            state.value = state.value === 'light' ? 'dark' : 'light';
            localStorage.setItem("theme", state.value);
        },
        setTheme: (state, action) => {
            state.value = action.payload;
            localStorage.setItem("theme", state.value);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
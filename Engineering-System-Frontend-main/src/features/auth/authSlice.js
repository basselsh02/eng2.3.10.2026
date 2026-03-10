// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";


export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/me");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const initialState = {
    token: localStorage.getItem("token"),
    user: null,
    loading: false,
    initialized: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token } = action.payload;
            localStorage.setItem("token", token);
            state.token = token;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.user = null;
            state.initialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                state.initialized = true;

                if (action.payload?.status === 401) {
                    localStorage.removeItem("token");
                    state.token = null;
                    state.user = null;
                }
            });
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
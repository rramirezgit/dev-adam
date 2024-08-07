import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userAuth0: any | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  userAuth0: null,
  error: null,
  isLoading: false,
};

export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { dispatch }) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    dispatch(setAuthState({ isAuthenticated: true, accessToken: token }));
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      // Dispatch the action to fetch user data after successful login
      dispatch(setAuthState({ isAuthenticated: true, accessToken }));
      await dispatch(fetchUserAuth0());

      return { accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await axios.post('/api/register', { email, password });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const authorize = createAsyncThunk(
  'auth/authorize',
  async (provider: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/authorize', { provider });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      return { accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    { userId, userData }: { userId: string; userData: any },
    { getState, rejectWithValue }
  ) => {
    try {
      const { accessToken } = (getState() as RootState).auth;
      if (!accessToken) throw new Error('No access token available');

      const response = await axios.patch(`/api/updateUser`, {
        userId,
        userData,
        token: accessToken,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserAuth0 = createAsyncThunk(
  'auth/fetchUserAuth0',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = (getState() as RootState).auth;
      const localAccessToken = localStorage.getItem('accessToken');

      if (!accessToken && !localAccessToken) throw new Error('No access token available');

      const response = await axios.get('/api/fetchUser', {
        headers: { Authorization: `Bearer ${localAccessToken}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('accessToken');
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userAuth0 = null;
    },
    setAuthState(
      state,
      action: PayloadAction<{ isAuthenticated: boolean; accessToken: string | null }>
    ) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ accessToken: string }>) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload || 'Unknown error';
        state.isLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload || 'Unknown error';
        state.isLoading = false;
      })
      .addCase(authorize.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authorize.fulfilled, (state, action: PayloadAction<{ accessToken: string }>) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(authorize.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload || 'Unknown error';
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.userAuth0 = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload || 'Unknown error';
        state.isLoading = false;
      })
      .addCase(fetchUserAuth0.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAuth0.fulfilled, (state, action: PayloadAction<any>) => {
        state.userAuth0 = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserAuth0.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload || 'Unknown error';
        state.isLoading = false;
      });
  },
});

export const { logout, setAuthState } = authSlice.actions;

export default authSlice.reducer;

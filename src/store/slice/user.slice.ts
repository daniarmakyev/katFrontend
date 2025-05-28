import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logout, checkAuth } from '../action/user.actions';

// Add decode function
export const decodeSpecialization = (specialization: string): string => {
  switch (specialization) {
    case "medicine":
      return "медицина";
    case "ecology":
      return "экология";
    case "police":
      return "полиция";
    case "transport":
      return "транспорт";
    case "housing":
      return "жкх";
    case "social":
      return "соцзащита";
    case "government":
      return "госуслуги";
    case "corruption":
      return "коррупция";
    case "education":
      return "образование";
    default:
      return specialization;
  }
};

export interface IUser {
  id: number;
  login: string;
  specialization: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuth: boolean;
  notification: {
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info" | "loading";
  };
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuth: false,
  notification: {
    show: false,
    message: "",
    type: "info"
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    hideNotification: (state) => {
      state.notification.show = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notification = {
          show: true,
          message: "Выполняется вход...",
          type: "loading"
        };
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          specialization: decodeSpecialization(action.payload.specialization)
        };
        state.isAuth = true;
        state.error = null;
        state.notification = {
          show: true,
          message: "Вход выполнен успешно",
          type: "success"
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
        state.isAuth = false;
        state.notification = {
          show: true,
          message: `Ошибка: ${action.error.message || "Не удалось войти"}`,
          type: "error"
        };
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.error = null;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          specialization: decodeSpecialization(action.payload.specialization)
        };
        state.isAuth = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuth = false;
        state.error = action.error.message || 'Ошибка авторизации';
      });
  },
});

export const { clearError, hideNotification } = userSlice.actions;
export default userSlice.reducer;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { IUser } from "../slice/user.slice";
import { api } from "../../helpers/const";

interface LoginResponse {
  message: string;
  data: IUser;
}

interface LoginCredentials {
  login: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginCredentials) => {
    try {
      const response = await axios.get<LoginResponse>(
        `${api}users/login/${credentials.login}`
      );

      localStorage.setItem('userId', response.data.data.id.toString());

      return response.data.data;
    } catch (error) {
      console.error(error);

      throw new Error("Ошибка при входе в систему");
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async () => {
    localStorage.removeItem('userId');
    window.location.href = '/';
    return;
  }
);

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async () => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      try {
        const response = await axios.get<IUser>(
          `${api}users/${userId}`
        );
        return response.data;
      } catch (error) {
        console.error("Ошибка при проверке авторизации", error);
        localStorage.removeItem('userId');
        throw new Error("Сессия истекла");
      }
    }
    throw new Error("Не авторизован");
  }
);
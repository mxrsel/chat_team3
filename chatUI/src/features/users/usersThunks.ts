import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GlobalError,
  LoginMutation,
  RegisterMutation,
  RegisterResponse,
  User,
  ValidationError,
} from '../../typesUI.ts';
import axiosApi from "../../utils/axiosApi.ts";
import { isAxiosError } from "axios";
import { RootState } from "../../app/store.ts";

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterMutation,
  { rejectValue: ValidationError }
>(
  "users/register",
  async (registerMutation: RegisterMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<RegisterResponse>(
        "/users/register",
        registerMutation,
      );
      localStorage.setItem('token', response.data.user.token);
      return response.data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  },
);

export const login = createAsyncThunk<
  User,
  LoginMutation,
  { rejectValue: GlobalError }
>("users/login", async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
      "users/sessions",
      loginMutation,
    );
    localStorage.setItem('token', response.data.user.token);
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data as GlobalError);
    }

    throw error;
  }
});

export const logout = createAsyncThunk<void, void, { state: RootState }>(
  "users/logout",
  async (_, { getState }) => {
    const token = getState().users.user?.token;
    await axiosApi.delete("/users/sessions", {
      headers: { Authorization: token },
    });
  },
);

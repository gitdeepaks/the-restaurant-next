import { Dispatch, SetStateAction } from "react";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phoneNumber: number;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber: string;
  email: string;
}

export interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

export interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}

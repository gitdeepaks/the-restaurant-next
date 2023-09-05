"use client";

import { ReactNode, useState, createContext, useEffect } from "react";
import { AuthState, State, User } from "../../../formDataTypes";
import { getCookie } from "cookies-next";
import axios from "axios";
import { set } from "react-hook-form";
import { get } from "http";
export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: false,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      } else {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        console.log(res);

        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        setAuthState({
          data: res.data,
          error: null,
          loading: false,
        });
      }
    } catch (error: any) {
      console.log(error);
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

import { FormData } from "../../formDataTypes";
import axios from "axios";
import useAuthContext from "./useAuthContext";
import { use } from "react";

const useAuth = () => {
  const { loading, data, error, setAuthState } = useAuthContext();

  const signin = async (data: FormData) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", {
        email: data.email,
        password: data.password,
      });
      setAuthState({
        data: res.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      console.log(error);
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };
  const signup = async (data: FormData) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      setAuthState({
        data: res.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      console.log(error);
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  return { signin, signup };
};
export default useAuth;

import { FormData } from "../../formDataTypes";
import axios from "axios";
const useAuth = () => {
  const signin = async (data: FormData) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", {
        email: data.email,
        password: data.password,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const signup = () => {};

  return { signin, signup };
};
export default useAuth;

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "../../../formDataTypes";

function AuthModelInput({
  register,
  errors,
  isSignIn,
}: {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isSignIn: boolean;
}) {
  return (
    <>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className={`border ${
              errors.firstName ? "border-red-500" : ""
            } rounded p-2 py-3 w-[49%]`}
            placeholder="FirstName"
            {...register("firstName", {
              required: true,
              pattern: /^[a-zA-Z]+$/,
            })}
          />

          <input
            type="text"
            className={`border ${
              errors.lastName ? "border-red-500" : ""
            } rounded p-2 py-3 w-[49%]`}
            placeholder="LastName"
            {...register("lastName", {
              required: true,
              pattern: /^[a-zA-Z]+$/,
            })}
          />
        </div>
      )}
      <div
        className={`border ${
          errors.city ? "border-red-500" : ""
        } my-3 flex text-sm w-full`}
      >
        <input
          type="email"
          className={`border ${
            errors.email ? "border-red-500" : ""
          } rounded p-2 py-3 w-full`}
          placeholder="Email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
      </div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className={`border ${
              errors.city ? "border-red-500" : ""
            } rounded p-2 py-3 w-[49%]`}
            placeholder="City"
            {...register("city", { required: true, pattern: /^[a-zA-Z]+$/ })}
          />
          <input
            type="text"
            className={`border ${
              errors.phoneNumber ? "border-red-500" : ""
            } rounded p-2 py-3 w-[49%]`}
            placeholder="Phone Number"
            {...register("phoneNumber", {
              required: true,
              pattern: /^[0-9]+$/i,
              maxLength: 10,
              minLength: 10,
            })}
          />
        </div>
      )}
      <div className="my-3 flex text-sm w-full">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
          {...register("password", { required: true })}
        />
      </div>
    </>
  );
}

export default AuthModelInput;

import { FieldErrors, UseFormRegister } from "react-hook-form";

// Define the formData type
interface formData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phoneNumber: string;
  password: string;
}

function AuthModelInput({
  register,
  errors,
}: {
  register: UseFormRegister<formData>;
  errors: FieldErrors<formData>;
}) {
  return (
    <>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className={`border ${
            errors.firstName ? "border-red-500" : ""
          } rounded p-2 py-3 w-[49%]`}
          placeholder="FirstName"
          {...register("firstName", { required: true, pattern: /^[a-zA-Z]+$/ })}
        />

        <input
          type="text"
          className={`border ${
            errors.lastName ? "border-red-500" : ""
          } rounded p-2 py-3 w-[49%]`}
          placeholder="LastName"
          {...register("lastName", { required: true, pattern: /^[a-zA-Z]+$/ })}
        />
      </div>
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

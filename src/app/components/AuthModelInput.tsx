function AuthModelInput() {
  return (
    <>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="FirstName"
        />
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="LastName"
        />
      </div>
      <div className="my-3 flex text-sm w-full">
        <input
          type="email"
          className="border rounded p-2 py-3 w-full"
          placeholder="Email"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="City"
        />
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="Phone Number"
        />
      </div>
      <div className="my-3 flex text-sm w-full">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
        />
      </div>
    </>
  );
}

export default AuthModelInput;

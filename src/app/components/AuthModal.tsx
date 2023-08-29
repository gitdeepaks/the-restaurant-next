"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AuthModelInput from "./AuthModelInput";
import { SubmitHandler, useForm } from "react-hook-form";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface formData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phoneNumber: string;
}

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      firstName: "Deepak",
      lastName: "Sankhyan",
      email: "deepak@yahoo.com",
      city: "Jaipur",
      phoneNumber: "1234567890",
    },
  });

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignin ? signInContent : signUpContent;
  };

  const onSubmit: SubmitHandler<formData> = (data) => console.log(data);

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
      >
        {renderContent("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2 h-[600px]">
            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
              <p className="text-sm">
                {renderContent("Sign in", "Create Account")}
              </p>
            </div>
            <div className="m-auto">
              <h2 className="text2xl fontlight text-center">
                {renderContent("Log into your account", "Create your Account")}
              </h2>
            </div>
            <AuthModelInput register={register} errors={errors} />
            <button
              onClick={handleSubmit(onSubmit)}
              className="uppercase bg-red-700 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
            >
              {renderContent("Sign in", "Create Account")}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

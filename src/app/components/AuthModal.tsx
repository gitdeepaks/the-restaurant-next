"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AuthModelInput from "./AuthModelInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormData } from "../../../formDataTypes";
import useAuth from "@/hooks/useAuth";
import { isDataView } from "util/types";

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

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin } = useAuth();

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignIn ? signInContent : signUpContent;
  };

  const onSubmit = (data: any) => {
    isSignIn ? signin(data) : console.log("sign up", data);
  };

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
            <AuthModelInput
              register={register}
              errors={errors}
              isSignIn={isSignIn}
            />
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

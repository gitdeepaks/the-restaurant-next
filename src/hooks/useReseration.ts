"use client";
import axios from "axios";
import { sl } from "date-fns/locale";
import { Dispatch, SetStateAction, useState } from "react";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    time,
    firstName,
    lastName,
    phoneNumber,
    email,
    occasion,
    request,
    date,
    setDidBook,
  }: {
    slug: string;
    partySize: string;
    time: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    occasion: string;
    request: string;
    date: string;
    setDidBook: Dispatch<SetStateAction<boolean>>;
  }) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
          firstName,
          lastName,
          phoneNumber,
          email,
          occasion,
          request,
        },
        {
          params: {
            partySize,
            date,
            time,
          },
        }
      );

      setLoading(false);
      setDidBook(true);
      return res.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { error, loading, createReservation };
}

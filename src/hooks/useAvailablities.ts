"use client";
import { Time } from "@/utils/convertToDisplayTime";
import axios from "axios";
import { useState } from "react";
import { set } from "react-hook-form";

export default function useAvailablities() {
  const [loaging, setLoading] = useState(false);
  const [data, setData] = useState<
    { time: Time; available: boolean }[] | null
  >();
  const [error, setError] = useState<boolean | string>(false);

  const fetchAvailablities = async ({
    slug,
    partySize,
    date,
    time,
  }: {
    slug: string;
    partySize: string;
    date: string;
    time: string;
  }) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availablity`,
        {
          params: {
            partySize,
            date,
            time,
          },
        }
      );
      setData(res.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
      console.log(error);
    }
  };

  return { fetchAvailablities, data, error, loaging };
}

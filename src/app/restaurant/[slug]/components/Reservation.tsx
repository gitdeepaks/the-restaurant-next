"use client";

import { partySize, times } from "@/data";
import useAvailablities from "@/hooks/useAvailablities";
import { convertToDisplayTime } from "@/utils/convertToDisplayTime";
import { CircularProgress } from "@mui/material";
import { useState, useRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Reservation({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data, error, loaging, fetchAvailablities } = useAvailablities();

  const partySizeSelectRef = useRef<HTMLSelectElement>(null);

  const timeSizeSelectRef = useRef<HTMLSelectElement>(null);

  console.log({ data });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDate(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const filterTimes = () => {
    const timeRange: typeof times = [];
    let isInTimeRange = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isInTimeRange = true;
      }
      if (isInTimeRange) {
        timeRange.push(time);
      }
      if (time.time === closeTime) {
        isInTimeRange = false;
      }
    });

    return timeRange;
  };

  const handleSubmit = () => {
    fetchAvailablities({
      slug,
      date,
      partySize: String(partySizeSelectRef.current?.value),
      time: String(timeSizeSelectRef.current?.value),
    });
    // console.log({
    //   slug,
    //   date,
    //   partySize: String(partySizeSelectRef.current?.value),
    //   time: String(timeSizeSelectRef.current?.value),
    // });
  };

  return (
    <div className="w-[27%] relative text-reg">
      <div className="bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation</h4>
        </div>

        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select
            name=""
            className="py-3 border-b font-light"
            id=""
            ref={partySizeSelectRef}
          >
            {partySize.map((size) => (
              <option value={size.value} key={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="py-3 w-28 border-bottom font-light text-reg"
              dateFormat="MMMM d"
            />
          </div>

          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              name=""
              id=""
              className="py-3 border-b font-light"
              ref={timeSizeSelectRef}
            >
              {filterTimes().map((time) => (
                <option value={time.time} key={time.time}>
                  {time.displayTime}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <button
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16 disabled:bg-gray-600"
            onClick={handleSubmit}
            disabled={loaging}
          >
            {loaging ? <CircularProgress color="inherit" /> : "Find a Table"}
          </button>
        </div>
        {data?.length ? (
          <div className="mt-4">
            <p className="text-reg">Select a time</p>
            <div className="flex flex-wrap mt-2">
              {data.map((time) => {
                return time.available ? (
                  <div className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 mr-3 rounded">
                    {convertToDisplayTime(time.time)}
                  </div>
                ) : (
                  <div className="bg-gray-600 p-2 w-24 mb-3 mr-3"></div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Reservation;

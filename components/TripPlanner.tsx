"use client";

import React from "react";
import dynamic from "next/dynamic";
import TripForm from "./planning/TripForm";
import TripMap from "@/components/planning/TripMap";

export const TripPlanner = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-8">
      <div className="w-full lg:w-1/3 h-full">
        <TripForm />
      </div>
      <div className="w-full lg:w-2/3 h-[500px] lg:h-auto min-h-[600px]">
        <TripMap />
      </div>
    </div>
  );
};

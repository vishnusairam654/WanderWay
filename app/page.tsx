// app/page.tsx
// Main page — TripForm+ChatBot top row, Map+Weather middle, TripResults bottom.
// ChatBot and Map positions are swapped vs original layout.

"use client";

import React, { useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import TripForm from "@/components/planning/TripForm";
import TripMap from "@/components/planning/TripMap";
import ChatBot from "@/components/planning/ChatBot";
import TripResults from "@/components/planning/TripResults";
import WeatherWidget from "@/components/planning/WeatherWidget";
import type { TripData, Waypoint } from "@/types/trip";

export default function Page() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleTripUpdate = (data: TripData) => {
    setTripData(data);
    setWaypoints(data.waypoints);
    // Smooth scroll to results after a short delay
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  const handleEditRequest = (message: string) => {
    setPendingMessage(message);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <NavBar />

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 lg:px-8 py-8 space-y-16">

        {/* ── Row 1: TripForm (left) + ChatBot (right) ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-secondary rounded-full" />
            <h2 className="text-3xl font-eagle font-bold text-foreground">
              Plan Your Journey
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row w-full gap-8">
            {/* TripForm — 1/3 width */}
            <div className="w-full lg:w-1/3">
              <TripForm onTripPlanned={handleTripUpdate} />
            </div>
            {/* ChatBot — 2/3 width (was Map) */}
            <div className="w-full lg:w-2/3">
              <ChatBot
                onTripDataUpdate={handleTripUpdate}
                pendingMessage={pendingMessage}
                onPendingMessageConsumed={() => setPendingMessage("")}
              />
            </div>
          </div>
        </section>

        {/* ── Row 2: TripMap (left) + WeatherWidget (right) ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h2 className="text-3xl font-eagle font-bold text-foreground">
              Trip Map
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map — takes most space (was ChatBot area) */}
            <div className="flex-1 h-[480px] lg:h-[520px]">
              <TripMap waypoints={waypoints} />
            </div>
            {/* Weather Widget sidebar */}
            <div className="w-full lg:w-72 shrink-0">
              <WeatherWidget
                city={tripData?.destination || "Goa"}
                days={5}
                className="h-full"
              />
            </div>
          </div>
        </section>

        {/* ── Row 3: Trip Results ── */}
        <section ref={resultsRef} className="w-full pb-24">
          <TripResults
            tripData={tripData}
            onEditRequest={handleEditRequest}
          />
        </section>
      </div>
    </main>
  );
}
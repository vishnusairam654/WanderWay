// app/page.tsx
// Main page — wires ChatBot waypoint updates to TripMap via shared state.

"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import TripForm from "@/components/planning/TripForm";
import TripMap from "@/components/planning/TripMap";
import ChatBot from "@/components/planning/ChatBot";
import TripResults from "@/components/planning/TripResults";
import WeatherWidget from "@/components/planning/WeatherWidget";

interface Waypoint {
  name: string;
  latitude: number;
  longitude: number;
  day: number;
}

export default function Page() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <NavBar />
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 lg:px-8 py-8 space-y-24">
        {/* Trip Planner: Form + Map */}
        <section>
          <div className="flex flex-col lg:flex-row w-full gap-8">
            <div className="w-full lg:w-1/3">
              <TripForm />
            </div>
            <div className="w-full lg:w-2/3 h-[500px] lg:h-auto min-h-[600px]">
              <TripMap waypoints={waypoints} />
            </div>
          </div>
        </section>

        {/* AI Chat + Weather side by side */}
        <section className="w-full">
          <div className="flex items-center gap-3 ml-2 mb-8">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h2 className="text-3xl font-eagle font-bold text-foreground">Trip Assistant</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ChatBot takes most space */}
            <div className="flex-1">
              <ChatBot onWaypointsUpdate={setWaypoints} />
            </div>

            {/* Weather widget in sidebar */}
            <div className="w-full lg:w-72 shrink-0">
              <WeatherWidget city="Goa" days={5} className="h-full" />
            </div>
          </div>
        </section>

        {/* Trip Results */}
        <section className="w-full pb-24">
          <TripResults />
        </section>
      </div>
    </main>
  );
}
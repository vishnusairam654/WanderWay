import React from "react";
import NavBar from "@/components/NavBar";
import { TripPlanner } from "@/components/TripPlanner";
import ChatBot from "@/components/planning/ChatBot";
import TripResults from "@/components/planning/TripResults";

const page = () => {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <NavBar />
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 lg:px-8 py-8 space-y-24">
        <section>
          <TripPlanner />
        </section>

        <section className="w-full">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 ml-2">
              <div className="h-8 w-1.5 bg-primary rounded-full" />
              <h2 className="text-3xl font-eagle font-bold text-foreground">Trip Assistant</h2>
            </div>
            <ChatBot />
          </div>
        </section>

        <section className="w-full pb-24">
          <TripResults />
        </section>
      </div>
    </main>
  );
};



export default page;

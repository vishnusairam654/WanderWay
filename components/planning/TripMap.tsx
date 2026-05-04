"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // init once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716], // Bengaluru
      zoom: 12,
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-lg border border-border/60 shadow-primary/5" 
    />
  );
}

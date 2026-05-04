"use client";

import React from "react";
import { 
  MapPin, 
  Utensils, 
  Car, 
  Wallet, 
  Clock, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Coffee,
  Train,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Place {
  name: string;
  description: string;
  rating: number;
  time: string;
  image: string;
}

interface FoodLocation {
  name: string;
  type: string;
  priceRange: "$" | "$$" | "$$$";
  vibe: string;
}

interface TravelOption {
  type: string;
  duration: string;
  price: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

const TripResults = () => {
  // Mock Data
  const places: Place[] = [
    {
      name: "Lalbagh Botanical Garden",
      description: "Historic garden with a glass house modeled after London's Crystal Palace.",
      rating: 4.8,
      time: "Morning (2-3 hours)",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Bangalore Palace",
      description: "Tudor-style palace known for its wooden carvings and floral motifs.",
      rating: 4.6,
      time: "Afternoon (2 hours)",
      image: "https://images.unsplash.com/photo-1600664640141-866468697920?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const food: FoodLocation[] = [
    { name: "MTR (Mavalli Tiffin Rooms)", type: "South Indian", priceRange: "$", vibe: "Heritage" },
    { name: "The Only Place", type: "Steakhouse", priceRange: "$$", vibe: "Cozy Garden" },
    { name: "Koshy's", type: "Multicuisine", priceRange: "$$", vibe: "Old-world charm" },
  ];

  const travel: TravelOption[] = [
    { type: "Private Taxi", duration: "1.5 hours", price: "₹1,200", icon: <Car size={18} /> },
    { type: "BMTC Vayu Vajra", duration: "2 hours", price: "₹250", icon: <Train size={18} />, recommended: true },
    { type: "Airport Shuttle", duration: "2.5 hours", price: "₹150", icon: <Plane size={18} /> },
  ];

  const budgetItems = [
    { label: "Accommodation", amount: "₹8,500", percentage: 45, color: "bg-primary" },
    { label: "Food & Dining", amount: "₹4,200", percentage: 25, color: "bg-secondary" },
    { label: "Sightseeing", amount: "₹2,800", percentage: 15, color: "bg-accent" },
    { label: "Transport", amount: "₹2,500", percentage: 15, color: "bg-muted-foreground" },
  ];

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={120} className="text-primary" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
            <CheckCircle2 size={16} />
            <span>Itinerary Generated</span>
          </div>
          <h1 className="font-eagle text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Weekend in <span className="text-primary">Bengaluru</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            We've curated a perfect blend of heritage, nature, and culinary delights. 
            Estimated total budget: <span className="font-bold text-foreground">₹18,000</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 text-sm font-medium">
              <Clock size={14} className="text-primary" />
              <span>3 Days / 2 Nights</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 text-sm font-medium">
              <Star size={14} className="text-secondary" />
              <span>Nature Focus</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Places & Food */}
        <div className="lg:col-span-2 space-y-8">
          {/* Places to Visit */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <MapPin size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-eagle font-bold">Must-Visit Places</h2>
              </div>
              <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 transition-all">
                View on Map <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {places.map((place, i) => (
                <div key={i} className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Star size={12} className="text-secondary fill-secondary" />
                      <span className="text-xs font-bold">{place.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{place.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">{place.description}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 w-fit px-3 py-1.5 rounded-lg">
                      <Clock size={12} />
                      <span>{place.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Food Locations */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Utensils size={24} className="text-secondary" />
              </div>
              <h2 className="text-2xl font-eagle font-bold">Culinary Hotspots</h2>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
              {food.map((item, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <Coffee size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-secondary transition-colors">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.vibe}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-secondary-foreground bg-secondary/20 px-3 py-1 rounded-full border border-secondary/20">
                    {item.priceRange}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Travel & Budget */}
        <div className="space-y-8">
          {/* Travel Options */}
          <section className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-xl">
                <Car size={20} className="text-accent-foreground" />
              </div>
              <h2 className="text-xl font-eagle font-bold">Getting Around</h2>
            </div>

            <div className="space-y-3">
              {travel.map((option, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group",
                    option.recommended 
                      ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" 
                      : "bg-background border-border/50 hover:border-primary/30"
                  )}
                >
                  {option.recommended && (
                    <div className="absolute top-0 right-0 bg-primary text-[8px] font-black uppercase text-primary-foreground px-2 py-0.5 rounded-bl-lg tracking-widest">
                      Best Value
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-muted/80 text-muted-foreground group-hover:text-primary transition-colors">
                        {option.icon}
                      </div>
                      <span className="font-bold text-sm">{option.type}</span>
                    </div>
                    <span className="font-bold text-primary">{option.price}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-8">Est. {option.duration}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Budget Breakdown */}
          <section className="bg-primary p-6 rounded-3xl shadow-xl shadow-primary/10 text-primary-foreground space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-xl">
                <Wallet size={20} />
              </div>
              <h2 className="text-xl font-eagle font-bold">Budget Forecast</h2>
            </div>

            <div className="space-y-5">
              {budgetItems.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.label}</span>
                    <span>{item.amount}</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-foreground/10 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full animate-in slide-in-from-left duration-1000", item.color === 'bg-primary' ? 'bg-secondary' : 'bg-primary-foreground/60')}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-primary-foreground/10">
              <button className="w-full py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20">
                Detailed Breakdown
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TripResults;

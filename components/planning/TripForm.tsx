import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";

const TripForm = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center px-8 lg:px-16 py-12 bg-background">
      {/* Header section with Nature aesthetic */}
      <div className="">
        <h1 className="font-mamenchisa text-3xl md:text-4xl text-foreground mb-3 leading-tight">
          Craft your <br />
          <span className="text-primary italic">Perfect Journey</span>
        </h1>
      </div>

      {/* Form Container */}
      <form className="space-y-6 font-milkywalky bg-card p-3 md:p-8 rounded-3xl border border-border/60 shadow-lg shadow-primary/5">
        {/* Location Inputs */}
        <div className="space-y-5">
          <div className="relative group">
            <label className="block text-sm font-milkywalky font-bold text-foreground mb-2 ml-1">
              Starting Point
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <MapPin size={18} />
              </div>
              <input
                className="w-full pl-11 pr-4 py-3.5 font-milkywalky bg-background border-2 border-border/80 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                placeholder="e.g., Bengaluru, Karnataka"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-milkywalky font-bold text-foreground mb-2 ml-1">
              Destination
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-secondary transition-colors">
                <MapPin size={18} />
              </div>
              <input
                className="w-full pl-11 pr-4 py-3.5 font-milkywalky bg-background border-2 border-border/80 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300"
                placeholder="Where do you want to explore?"
              />
            </div>
          </div>
        </div>

        {/* Date Inputs */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1 relative group">
            <label className="block text-sm font-milkywalky font-bold text-foreground mb-2 ml-1">
              Departure
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                className="w-full pl-11 pr-4 py-3.5 font-milkywalky bg-background border-2 border-border/80 rounded-2xl text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex-1 relative group">
            <label className="block text-sm font-milkywalky font-bold text-foreground mb-2 ml-1">
              Return
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                className="w-full pl-11 pr-4 py-3.5 font-milkywalky bg-background border-2 border-border/80 rounded-2xl text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Group Size & Submit */}
        <div className="flex flex-col sm:flex-row gap-5 items-end pt-2">
          <div className="w-full sm:w-1/3 relative group">
            <label className="block text-sm font-milkywalky font-bold text-foreground mb-2 ml-1">
              Explorers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Users size={18} />
              </div>
              <select className="w-full pl-11 pr-4 py-3.5 font-milkywalky bg-background border-2 border-border/80 rounded-2xl text-foreground appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 cursor-pointer">
                <option>1 Explorer</option>
                <option>2 Explorers</option>
                <option>3 Explorers</option>
                <option>Group (4+)</option>
              </select>
            </div>
          </div>

          <div className="w-full sm:w-2/3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-primary text-primary-foreground font-milkywalky font-bold text-lg rounded-2xl hover:bg-primary/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 active:translate-y-0 active:shadow-md transition-all duration-300"
            >
              Start Planning <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TripForm;

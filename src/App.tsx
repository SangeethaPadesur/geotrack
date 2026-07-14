import { useState } from "react";
import { useFleetStream } from "./hooks/useFleetStream";
import { Map } from "./components/Map";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const { fleet, center, isLoading } = useFleetStream();
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "idle" | "delayed">("all");

  if (isLoading || !center) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-slate-50 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar center={center} filter={filter} setFilter={setFilter} setSelectedPosition={setSelectedPosition}/>
      <main className="flex-1 min-h-0">
        <Map 
          selectedDriverPosition={selectedPosition} 
          activeFilter={filter} 
          fleet={fleet} 
          center={center} 
        />
      </main>

    </div>
  );
}

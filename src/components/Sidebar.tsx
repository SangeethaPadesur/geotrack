export const Sidebar = ({center, filter , setFilter, setSelectedPosition}) => {
    return (
         <aside className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-1">GeoTrack Control</h1>
            <p className="text-xs text-slate-400">Real-Time Fleet Operations Terminal</p>
          </div>
          
          <div className="space-y-50">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter Fleet</label>
            <div className="grid grid-cols-2 gap-2">
              {(["all", "active", "idle", "delayed"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-2 text-xs font-medium capitalize rounded-lg border transition-all cursor-pointer ${
                    filter === type 
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Telemetry Hook</label>
            <button 
              onClick={() => setSelectedPosition(center)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 hover:border-indigo-500 text-left text-xs rounded-xl flex items-center justify-between transition-all group cursor-pointer"
            >
              <div>
                <p className="font-semibold text-slate-300 group-hover:text-white">Track Regional Center Hub</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Focus camera frame onto local coordinates</p>
              </div>
              <span className="text-indigo-400 font-mono text-sm">→</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-4 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            Status: Stream Online (500 Nodes / 400ms Batching)
          </p>
        </div>
      </aside>
    )
}
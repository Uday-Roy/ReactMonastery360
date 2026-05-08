import React, { useState, useEffect } from "react";
import { monasteryAPI, reviewAPI } from "../utils/api";
import { useUIStore } from "../store/index";

export default function Monasteries() {
  const [monasteries, setMonasteries] = useState([]);
  const [filteredMonasteries, setFilteredMonasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("");
  const { showNotification } = useUIStore();

  useEffect(() => {
    loadMonasteries();
  }, []);

  useEffect(() => {
    if (region) {
      setFilteredMonasteries(monasteries.filter((m) => m.region === region));
    } else {
      setFilteredMonasteries(monasteries);
    }
  }, [region, monasteries]);

  const loadMonasteries = async () => {
    try {
      setLoading(true);
      const response = await monasteryAPI.getAll();
      setMonasteries(response.data);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to load monasteries",
      });
    } finally {
      setLoading(false);
    }
  };

  const regions = [...new Set(monasteries.map((m) => m.region))];

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          Explore Sacred Monasteries
        </h1>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500"
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading monasteries...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonasteries.map((m) => (
              <div key={m._id} className="card-hover">
                <img
                  src={m.image || "https://via.placeholder.com/400x300"}
                  alt={m.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                <p className="text-orange-300 mb-2">{m.region}</p>
                {m.history && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {m.history}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">★ {m.rating || 4.5}</span>
                  <button className="btn-primary text-sm">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";

export default function MonasteryDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          Monastery Details
        </h1>
        <div className="card">
          <p className="text-gray-400">Loading monastery details...</p>
        </div>
      </div>
    </div>
  );
}

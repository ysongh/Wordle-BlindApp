"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";

const WordleGamesList = () => {
  const router = useRouter();

  const [games] = useState([
    {
      id: 1,
      date: '2024-10-30',
      status: 'completed',
      attempts: 4,
      timeSpent: '3:45',
      word: 'SMART',
      score: 85,
    },
    {
      id: 2,
      date: '2024-10-29',
      status: 'completed',
      attempts: 6,
      timeSpent: '5:20',
      word: 'GLOBE',
      score: 70,
    },
    {
      id: 3,
      date: '2024-10-28',
      status: 'failed',
      attempts: 6,
      timeSpent: '4:15',
      word: 'PAINT',
      score: 0,
    }
  ]);

  const getStatusColor = (status) => {
    return status === 'completed' ? 'text-green-500' : 'text-red-500';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mt-[70px]">
          <h1 className="text-3xl font-bold text-gray-900">Wordle Games</h1>
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg 
            hover:bg-blue-700 transition-colors duration-200"  onClick={() => router.push("/wordle/create-game")}>
            New Game
          </button>
        </div>
      </div>

      {/* Games List */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {games.map((game) => (
              <div 
                key={game.id} 
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">{game.date}</span>
                  </div>

                  <div className="flex items-center">
                    <span className={`text-sm capitalize ${getStatusColor(game.status)}`}>
                      {game.status}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm">
                      Attempts: {game.attempts}/6
                    </span>
                  </div>

                  <div className={`text-sm font-medium ${getScoreColor(game.score)}`}>
                    Score: {game.score}
                  </div>

                  <div className="flex justify-end">
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800" onClick={() => router.push("/wordle")}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordleGamesList;
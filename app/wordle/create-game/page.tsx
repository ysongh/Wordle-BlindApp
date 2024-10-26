"use client";

import { useState } from 'react';

export default function WordleSetup() {
  const [customWord, setCustomWord] = useState('');
  const [error, setError] = useState('');

  const handleWordSubmit = () => {
    const word = customWord.trim().toUpperCase();
    
    if (!word) {
      setError('Please enter a word');
      return;
    }
    
    if (word.length !== 5) {
      setError('Word must be exactly 5 letters');
      return;
    }
    
    if (!/^[A-Z]+$/.test(word)) {
      setError('Word must contain only letters');
      return;
    }

    setError('');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Wordle Setup</h1>
      
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label htmlFor="word" className="block text-sm font-medium text-gray-700">
            Enter a 5-letter word
          </label>
          <input
            type="text"
            id="word"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
            maxLength={5}
            placeholder="Enter word..."
          />
        </div>

        {error && (
          <p className='text-red-500'>{error}</p>
        )}

        <button
          onClick={handleWordSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Game
        </button>
      </div>
    </div>
  );
};
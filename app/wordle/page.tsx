"use client";

import { useState, useEffect } from 'react';
import { Login } from "../components/Login";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = ['REACT', 'LEARN', 'BUILD', 'QUICK', 'STUFF', 'WORLD'];

export default function Wordle() {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, []);

  const handleKeyPress = (e) => {
    if (gameOver) return;

    if (e.key === 'Enter' && currentGuess.length === WORD_LENGTH) {
      submitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Za-z]$/.test(e.key)) {
      setCurrentGuess(prev => (prev + e.key).toUpperCase());
    }
  };

  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameOver(true);
      setMessage('Congratulations! You won! 🎉');
    } else if (currentRow === MAX_ATTEMPTS - 1) {
      setGameOver(true);
      setMessage(`Game Over! The word was ${targetWord}`);
    } else {
      setCurrentRow(prev => prev + 1);
      setCurrentGuess('');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, gameOver]);

  const getTileColor = (letter, index, rowIndex) => {
    if (rowIndex > currentRow) return 'bg-gray-200';
    if (!letter) return 'bg-gray-200';
    if (targetWord[index] === letter) return 'bg-green-500';
    if (targetWord.includes(letter)) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Wordle Clone</h1>
      <Login />
      <div className="grid gap-2 mb-4">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {Array.from({ length: WORD_LENGTH }).map((_, index) => {
              const letter = rowIndex === currentRow 
                ? currentGuess[index] 
                : guess[index];
              
              return (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center text-xl font-bold text-white uppercase transition-colors ${getTileColor(letter, index, rowIndex)}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {message && (
        <div className="mt-4 text-xl font-semibold text-gray-800">
          {message}
        </div>
      )}

      <div className="mt-8 text-gray-600">
        Type letters to guess the {WORD_LENGTH}-letter word
      </div>
    </div>
  );
}
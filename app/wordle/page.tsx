"use client";

import { useState, useEffect } from 'react';
import {
  NadaValue,
  NadaValues,
  NamedValue,
  PartyName,
  ProgramBindings,
} from "@nillion/client-core";
import { useNilStoreProgram,  useNilCompute, useNillion } from "@nillion/client-react-hooks";

import { Login } from "../components/Login";
import { transformNadaProgramToUint8Array } from '../utils/transformNadaProgramToUint8Array';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = ['REACT', 'LEARN', 'BUILD', 'QUICK', 'STUFF', 'WORLD'];

const PROGRAM_NAME = "wordle";

export default function Wordle() {
  const nilStoreProgram = useNilStoreProgram();
  const { client } = useNillion();
  const nilCompute = useNilCompute();

  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, []);

  // Action to store Program with Nada
  const handleStoreProgram = async () => {
    try {
      const programBinary = await transformNadaProgramToUint8Array(
        `/programs/${PROGRAM_NAME}.nada.bin`
      );
      nilStoreProgram.execute({
        name: PROGRAM_NAME,
        program: programBinary,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

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
    console.log(currentGuess);
    handleCompute();

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

  const handleCompute = () => {
    console.log(nilStoreProgram.data);
    if (!nilStoreProgram.data) throw new Error("compute: program id required");

    const bindings = ProgramBindings.create(nilStoreProgram.data)
      .addInputParty(PartyName.parse("Party1"), client.partyId)
      .addOutputParty(PartyName.parse("Party1"), client.partyId);

    const values = NadaValues.create()
      .insert(NamedValue.parse("letter_1"), NadaValue.createSecretInteger(1))
      .insert(NamedValue.parse("letter_2"), NadaValue.createSecretInteger(2))
      .insert(NamedValue.parse("letter_3"), NadaValue.createSecretInteger(4))
      .insert(NamedValue.parse("guess_letter_1"), NadaValue.createSecretInteger(1))
      .insert(NamedValue.parse("guess_letter_2"), NadaValue.createSecretInteger(2))
      .insert(NamedValue.parse("guess_letter_3"), NadaValue.createSecretInteger(4));

    nilCompute.execute({ bindings, values });
    console.log(nilCompute);
    console.log(nilCompute.data);
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
      <button
        onClick={() => handleStoreProgram()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mt-2 inline-block"
      >
        Store Program
      </button>
      {nilStoreProgram.data && (
        <div className="mt-4 mb-5">
          <p className="text-sm text-gray-600">Program ID: {nilStoreProgram.data}</p>
        </div>
      )}
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

      
      {nilCompute.isSuccess && (
        <div className="mt-4 mb-5">
           {`${nilCompute.data?.substring(0, 4)}...${nilCompute.data?.substring(nilCompute.data.length - 4)}`}
        </div>
      )}
    </div>
  );
}
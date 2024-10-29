"use client";

import { useState, useEffect } from 'react';
import {
  NadaValue,
  NadaValues,
  NamedValue,
  PartyName,
  ProgramBindings,
} from "@nillion/client-core";
import { useNilStoreProgram,  useNilCompute, useNilComputeOutput, useNillion } from "@nillion/client-react-hooks";

import { Login } from "../components/Login";
import { transformNadaProgramToUint8Array } from '../utils/transformNadaProgramToUint8Array';
import { letterToNumber } from '../utils/letterToNumber';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORDS = ['REACT', 'LEARN', 'BUILD', 'QUICK', 'STUFF', 'WORLD'];
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];
const PROGRAM_NAME = "wordle";

export default function Wordle() {
  const nilStoreProgram = useNilStoreProgram();
  const { client } = useNillion();
  const nilCompute = useNilCompute();
  const nilComputeOutput = useNilComputeOutput();

  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState({});

  useEffect(() => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, []);

  useEffect(() => {
    if (nilCompute.data) handleGetOutput();
  }, [!nilCompute.data])

  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACK');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [currentGuess, gameOver]);
  
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

  const handleGetOutput = () => {
    if (!nilCompute.data) throw new Error("compute-output: Compute id is required");
    nilComputeOutput.execute({ id: nilCompute.data });
  };

  let computeOutput = "idle";
  let computeArray = null;
  if (nilComputeOutput.isSuccess) {
    computeOutput = JSON.stringify(nilComputeOutput.data, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    });
    computeArray = JSON.parse(computeOutput);
    computeArray = Object.values(computeArray);
  }


  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER' && currentGuess.length === 5) {
      submitGuess();
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const getKeyColor = (key) => {
    if (!usedLetters[key]) return 'bg-gray-300 hover:bg-gray-400';
    switch (usedLetters[key]) {
      case 'correct':
        return 'bg-green-500 hover:bg-green-600';
      case 'present':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'absent':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-300 hover:bg-gray-400';
    }
  };

  const submitGuess = () => {
    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);
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
    if (!nilStoreProgram.data) throw new Error("compute: program id required");

    const bindings = ProgramBindings.create(nilStoreProgram.data)
      .addInputParty(PartyName.parse("Party1"), client.partyId)
      .addOutputParty(PartyName.parse("Party1"), client.partyId);

    const values = NadaValues.create()
      .insert(NamedValue.parse("letter_1"), NadaValue.createSecretInteger(letterToNumber(targetWord[0])))
      .insert(NamedValue.parse("letter_2"), NadaValue.createSecretInteger(letterToNumber(targetWord[1])))
      .insert(NamedValue.parse("letter_3"), NadaValue.createSecretInteger(letterToNumber(targetWord[2])))
      .insert(NamedValue.parse("guess_letter_1"), NadaValue.createSecretInteger(letterToNumber(currentGuess[0])))
      .insert(NamedValue.parse("guess_letter_2"), NadaValue.createSecretInteger(letterToNumber(currentGuess[1])))
      .insert(NamedValue.parse("guess_letter_3"), NadaValue.createSecretInteger(letterToNumber(currentGuess[2])));

    nilCompute.execute({ bindings, values });
  };

  const getTileColor = (letter, index, rowIndex) => {
    if (rowIndex > currentRow) return 'bg-gray-200';
    if (!letter) return 'bg-gray-200';
    if (computeArray && computeArray[index] === "1") return 'bg-green-500';
    if (computeArray && computeArray[index] === "2") return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 mt-20">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">Wordle Clone</h1>
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

      {/* Virtual Keyboard */}
      <div className="w-full max-w-2xl">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-2">
            {row.map((key) => {
              const isWideKey = key === 'ENTER' || key === 'BACK';
              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`
                    ${isWideKey ? 'w-16' : 'w-10'} 
                    h-14 
                    ${getKeyColor(key)}
                    text-white 
                    font-bold 
                    rounded 
                    transition-colors
                    flex 
                    items-center 
                    justify-center
                    text-sm
                  `}
                >
                  {key === 'BACK' ? '←' : key}
                </button>
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

      <ul className="list-disc pl-5 mt-4">
        <li className="mt-2">Status: {nilComputeOutput.status}</li>
        <li className="mt-2">Output: {computeOutput}</li>
      </ul>
    </div>
  );
}
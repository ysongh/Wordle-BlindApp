"use client";

import Link from 'next/link';

const Navbar = () => {

  return (
    <div className="fixed top-0 w-full bg-blue-600 h-20 flex items-center z-10">
      <div className="relative left-4">
        <Link href="/">
          <p className="text-white text-3xl font-bold">Wordle Blind App</p>
        </Link>
      </div>
      <div className="fixed right-6">
        <div className="flex flex-row gap-8 items-center">
          <Link href="/">
            <div className="text-white font-bold">
              Home
            </div>
          </Link>
          <Link href="/wordle">
            <div className="text-white font-bold">
              Game
            </div>
          </Link>
          <Link href="/wordle/create-game">
            <div className="text-white font-bold">
              Create
            </div>
          </Link>
        </div>
      </div>
    </div >
  );
};

export default Navbar;
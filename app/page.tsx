
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-white mt-[100px]">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Wordle Blind App
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Play Wordle with advanced security powered by Nillion's secure computation network
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold 
              hover:bg-blue-700 transition-colors duration-200">
              Start Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

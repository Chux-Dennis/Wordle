import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "antd";
import { Volume2, VolumeX, StarsIcon } from "lucide-react"; // Lucide Icons

// Import audio files
import successSound from "../assets/audio/success-sound.mp3";
import gamePlaySound from "../assets/audio/drum-loop.mp3";

const targetWord = "DENIS"; // Word to guess

const WordleGame: React.FC = () => {
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Mute by default

  // Refs for audio elements
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      } else if (key === "ENTER") {
        handleEnter();
      } else if (key === "BACKSPACE") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, attempt, gameOver]);

  const handleKeyPress = (letter: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + letter);
    }
  };

  const handleEnter = () => {
    if (currentGuess.length === 5 && attempt < 6 && !gameOver) {
      setGuesses((prev) => {
        const newGuesses = [...prev];
        newGuesses[attempt] = currentGuess;
        return newGuesses;
      });

      if (currentGuess === targetWord) {
        setGameOver(true);
        if (successAudioRef.current) {
          successAudioRef.current.play();
        }
      }

      setAttempt((prev) => prev + 1);
      setCurrentGuess("");
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const getTileColor = (char: string, index: number) => {
    if (targetWord[index] === char) return "bg-green-500";
    if (targetWord.includes(char)) return "bg-yellow-500";
    return "bg-gray-700";
  };

  const toggleSound = () => {
    if (gameAudioRef.current) {
      if (isMuted) {
        gameAudioRef.current.volume = 0.5;
        gameAudioRef.current.loop = true;
        gameAudioRef.current
          .play()
          .catch(() => console.log("Autoplay blocked"));
      } else {
        gameAudioRef.current.pause();
      }
    }
    setIsMuted(!isMuted);
  };

  const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white xs:px-8 ss:px-0">
      {/* Audio Elements */}
      <audio ref={gameAudioRef} src={gamePlaySound} />
      <audio ref={successAudioRef} src={successSound} />

      {/* Mute/Unmute Button */}
      <Tooltip title="Control Sound">
        <button
          onClick={toggleSound}
          className="absolute top-5 right-5 bg-gray-800 p-2 rounded-md hover:bg-gray-700"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </Tooltip>
      <Tooltip title="Ask AI for help">
        <button
          onClick={toggleSound}
          className="absolute top-[5rem] right-5 bg-gray-800 p-2 rounded-md hover:bg-gray-700"
        >
          <StarsIcon />
        </button>
      </Tooltip>

      {/* Wordle Grid */}
      <div className="grid grid-rows-6 gap-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {Array.from(
              rowIndex === attempt ? currentGuess.padEnd(5) : guess.padEnd(5)
            ).map((char, colIndex) => (
              <div
                key={colIndex}
                className={`w-14 h-14 flex items-center justify-center border-2 border-gray-700 text-2xl font-bold uppercase rounded-md ${
                  rowIndex < attempt
                    ? getTileColor(char, colIndex)
                    : "bg-transparent"
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* On-screen Keyboard */}
      <div className="mt-6 space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.split("").map((letter) => (
              <button
                key={letter}
                className="bg-gray-700 px-3 py-2 rounded-md text-lg font-bold"
                onClick={() => handleKeyPress(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-2 mt-2">
          <button
            className="bg-red-600 px-4 py-2 rounded-md text-lg"
            onClick={handleBackspace}
          >
            ⌫
          </button>
          <button
            className="bg-green-600 px-4 py-2 rounded-md text-lg"
            onClick={handleEnter}
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
};

const GamePlay = () => {
  return (
    <>
      <div>
        <WordleGame />
      </div>
    </>
  );
};

export default GamePlay;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import helper from "../helper";
import Image from "../assets/image/logo.png";
import { Tooltip, Modal, Spin } from "antd";
import { Volume2, VolumeX, Stars } from "lucide-react";

// Import audio files
import successSound from "../assets/audio/success-sound.mp3";
import gamePlaySound from "../assets/audio/drum-loop.mp3";

interface IComponentProps {
  word: string;
}

const GamePlay = ({ word }: IComponentProps) => {
  const targetWord = word.toUpperCase();
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // State to store the screen width
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  // Function to check if the screen width is wider than a given limit
  const screenWidthWiderThan = (widthLimit: number): boolean => {
    return screenWidth > widthLimit;
  };

  useEffect(() => {
    const updateScreenWidth = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

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

  const openHintModal = async () => {
    if (hintUsed) return;
    setIsModalOpen(true);
    setLoadingHint(true);
    try {
      const hint = await helper.getAIAssistance(targetWord);
      setAiHint(hint);
    } catch (error) {
      setAiHint("Failed to fetch AI hint.");
    }
    setLoadingHint(false);
    setHintUsed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white xs:px-8 ss:px-0"
    >
      <audio ref={gameAudioRef} src={gamePlaySound} />
      <audio ref={successAudioRef} src={successSound} />

      <Tooltip title="Control Sound">
        <button
          onClick={toggleSound}
          className="absolute top-5 right-5 bg-gray-800 p-2 rounded-md hover:bg-gray-700"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </Tooltip>

      <Tooltip title={hintUsed ? "Hint already used" : "Ask AI for help"}>
        <motion.button
          onClick={openHintModal}
          disabled={hintUsed}
          initial={{ scale: 1 }}
          animate={hintUsed ? {} : { scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`absolute top-[5rem] right-5 p-2 rounded-md ${
            hintUsed
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          <Stars size={24} />
        </motion.button>
      </Tooltip>

      <button className="absolute top-5 left-5 p-2 rounded-md">
        <img src={Image} alt="" width={"35px"} />
      </button>

      <div className="grid grid-rows-6 gap-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {Array.from(
              rowIndex === attempt ? currentGuess.padEnd(5) : guess.padEnd(5)
            ).map((char, colIndex) => (
              <motion.div
                key={colIndex}
                className={`w-14 h-14 flex items-center justify-center border-2 border-gray-700 text-2xl font-bold uppercase rounded-md ${
                  rowIndex < attempt
                    ? getTileColor(char, colIndex)
                    : "bg-transparent"
                }`}
                initial={{ rotateX: 0 }}
                animate={rowIndex < attempt ? { rotateX: 360 } : {}}
                transition={{ duration: 0.4 }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {["QWERTYUIOP", "ASDFGHJKL"].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 ">
            {row.split("").map((letter) => (
              <motion.button
                key={letter}
                className="bg-gray-700 px-3 py-2 rounded-md text-lg text-[1.1rem] font-bold"
                onClick={() => handleKeyPress(letter)}
                whileTap={{ scale: .8 }}
              >
                {letter}
              </motion.button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-1">
          {/* Remove this button on mobile view */}
          {screenWidthWiderThan(600) === true && (
            <motion.button
              className="bg-blue-600 px-6 py-2 rounded-md text-lg font-bold text-white"
              onClick={handleEnter}
              whileTap={{ scale: 0.9 }}
            >
              Enter
            </motion.button>
          )}

          {"ZXCVBNM".split("").map((letter) => (
            <motion.button
              key={letter}
              className="bg-gray-700 px-3 py-2 rounded-md text-lg font-bold"
              onClick={() => handleKeyPress(letter)}
              whileTap={{ scale: 0.9 }}
            >
              {letter}
            </motion.button>
          ))}

          {/* Remove this button on mobile view */}
          {screenWidthWiderThan(600) === true && (
            <motion.button
              className="bg-red-600 px-6 py-2 rounded-md text-lg font-bold text-white"
              onClick={handleBackspace}
              whileTap={{ scale: 0.9 }}
            >
              ⌫
            </motion.button>
          )}

          <Modal
            title="AI Assistance"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            {loadingHint ? (
              <Spin size="large" />
            ) : (
              <p className="text-gray-800 text-lg">{aiHint}</p>
            )}
          </Modal>
        </div>
      </div>

      {/* Adding this buttons on  a new line if it is on mobile view */}
      {screenWidthWiderThan(600) === false && (
        <div className="flex mt-3 gap-2">
          <motion.button
            className="bg-blue-600 px-6 py-2 rounded-md text-lg font-bold text-white"
            onClick={handleEnter}
            whileTap={{ scale: 0.9 }}
          >
            Enter
          </motion.button>
          <motion.button
            className="bg-red-600 px-6 py-2 rounded-md text-lg font-bold text-white"
            onClick={handleBackspace}
            whileTap={{ scale: 0.9 }}
          >
            ⌫
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default GamePlay;



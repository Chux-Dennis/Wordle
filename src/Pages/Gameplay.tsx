import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import helper from "../helper";
import Image from "../assets/image/logo.png";
import { Tooltip, Modal, Spin, Button } from "antd";
import { Volume2, VolumeX, Stars, LucideMenu } from "lucide-react";
import Confetti from "react-confetti";

import successSound from "../assets/audio/success-sound.mp3";
import gamePlaySound from "../assets/audio/drum-loop.mp3";

interface IComponentProps {
  word: string;
}

interface SlideMenuProps {
  buttons: React.ReactNode[];
}

const SlideMenu = ({ buttons }: SlideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="flex items-center bg-gray-700 gap-4 p-4 rounded-md font-sf overflow-hidden mb-3"
      animate={{ width: isOpen ? "180px" : "50px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <LucideMenu />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {buttons.map((btn, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {btn}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false); // Changed from showPlayAgainModal
  const [showLoseModal, setShowLoseModal] = useState(false); // New state for lose condition
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

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
    if (!gameOver && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + letter);
    }
  };

  const handleEnter = () => {
    if (currentGuess.length === 5 && attempt < 6 && !gameOver) {
      const newGuesses = [...guesses];
      newGuesses[attempt] = currentGuess;
      setGuesses(newGuesses);

      if (currentGuess === targetWord) {
        setGameOver(true);
        setShowConfetti(true);
        setShowWinModal(true); // Show win modal instead of generic play again
        if (successAudioRef.current) {
          successAudioRef.current.play();
        }
        setTimeout(() => setShowConfetti(false), 5000);
      } else if (attempt === 5) {
        setGameOver(true);
        setShowLoseModal(true); // Show lose modal
      }

      setAttempt((prev) => prev + 1);
      setCurrentGuess("");
    }
  };

  const handleBackspace = () => {
    if (!gameOver) {
      setCurrentGuess((prev) => prev.slice(0, -1));
    }
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

  const handlePlayAgain = () => {
    window.location.reload(); // Reload the page
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

      {showConfetti && (
        <Confetti
          width={screenWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          
          
        />
      )}

      {screenWidthWiderThan(600) === true && (
        <>
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
              disabled={hintUsed || gameOver}
              initial={{ scale: 1 }}
              animate={hintUsed || gameOver ? {} : { scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={`absolute top-[5rem] right-5 p-2 rounded-md ${
                hintUsed || gameOver
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Stars size={24} />
            </motion.button>
          </Tooltip>
        </>
      )}

      {screenWidthWiderThan(600) === false ? (
        <div className="fixed top-5 left-5 mb-3">
          <SlideMenu
            buttons={[
              <motion.button
                onClick={openHintModal}
                disabled={hintUsed || gameOver}
                initial={{ scale: 1 }}
                animate={hintUsed || gameOver ? {} : { scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`p-2 rounded-md ${
                  hintUsed || gameOver
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <Stars size={24} />
              </motion.button>,
              <button
                onClick={toggleSound}
                className="bg-gray-800 p-2 rounded-md hover:bg-gray-700"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>,
            ]}
          />
        </div>
      ) : (
        <div className="fixed top-5 left-5">
          <img src={Image} alt="" width={"35px"} />
        </div>
      )}

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
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.split("").map((letter) => (
              <motion.button
                key={letter}
                className="bg-gray-700 px-3 py-2 rounded-md text-lg text-[1.1rem] font-bold"
                onClick={() => handleKeyPress(letter)}
                whileTap={{ scale: 0.8 }}
                disabled={gameOver}
              >
                {letter}
              </motion.button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-1">
          {screenWidthWiderThan(600) === true && (
            <motion.button
              className="bg-blue-600 px-6 py-2 rounded-md text-lg font-bold text-white"
              onClick={handleEnter}
              whileTap={{ scale: 0.9 }}
              disabled={gameOver}
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
              disabled={gameOver}
            >
              {letter}
            </motion.button>
          ))}

          {screenWidthWiderThan(600) === true && (
            <motion.button
              className="bg-red-600 px-6 py-2 rounded-md text-lg font-bold text-white"
              onClick={handleBackspace}
              whileTap={{ scale: 0.9 }}
              disabled={gameOver}
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

          <Modal
            title="Congratulations!"
            open={showWinModal}
            footer={[
              <Button key="again" type="primary" onClick={handlePlayAgain}>
                Play Again
              </Button>,
              <Button key="close" onClick={() => setShowWinModal(false)}>
                Close
              </Button>,
            ]}
          >
            <p className="text-gray-800 text-lg">
              You guessed the word correctly!
            </p>
          </Modal>

          <Modal
            title="Game Over"
            open={showLoseModal}
            footer={[
              <Button key="again" type="primary" onClick={handlePlayAgain}>
                Play Again
              </Button>,
              <Button key="close" onClick={() => setShowLoseModal(false)}>
                Close
              </Button>,
            ]}
          >
            <p className="text-gray-800 text-lg">
              The word was "{targetWord}". Better luck next time!
            </p>
          </Modal>
        </div>
      </div>

      {screenWidthWiderThan(600) === false && (
        <div className="flex mt-3 gap-2">
          <motion.button
            className="bg-blue-600 px-6 py-2 rounded-md text-lg font-bold text-white"
            onClick={handleEnter}
            whileTap={{ scale: 0.9 }}
            disabled={gameOver}
          >
            Enter
          </motion.button>
          <motion.button
            className="bg-red-600 px-6 py-2 rounded-md text-lg font-bold text-white"
            onClick={handleBackspace}
            whileTap={{ scale: 0.9 }}
            disabled={gameOver}
          >
            ⌫
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default GamePlay;

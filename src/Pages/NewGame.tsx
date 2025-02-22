import { useState, useEffect } from "react";
import Gameplay from "./Gameplay";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion
import Image from "../assets/image/logo2x.png";
const Endpoint = import.meta.env.VITE_ENDPOINT;

const NewPage = () => {
  const [ellipsis, setEllipsis] = useState("");
  const [wordToBeGuessed, setWordToBeGuessed] = useState<string>("");
  const [fetchSuccesful,setFetchSuccesful] = useState<boolean>(false)

  // Function to get a random word out ot of all words
  const getRandomWordIndex = (numberOfWords: number): number => {
    return Math.floor(Math.random() * numberOfWords);
  };
  // Function to fetch word
  const fetchGameWord = async () => {
    try {
      const response = await axios.get(Endpoint);
      const randomWord =
        response.data[getRandomWordIndex(response.data.length)].word;
      setWordToBeGuessed(randomWord);
      setTimeout(() => {
        setFetchSuccesful(true);
      },4500)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Interval to update the ellipsis
    const interval = setInterval(() => {
      setEllipsis((prev) => {
        if (prev.length === 3) return ""; // Reset after 3 dots
        return prev + "."; // Add a dot
      });
    }, 500); // Adjust the speed of the animation (500ms = 0.5s)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    ///Fetch word
    fetchGameWord();
  }, []);

  return (
    <>
      {fetchSuccesful ? (
        <>{wordToBeGuessed && <Gameplay word={wordToBeGuessed} />}</>
      ) : (
        <div className="relative h-screen">
          <div className="flex h-screen flex-col justify-center items-center">
            {/* Animated Image */}
            <motion.img
              src={Image}
              alt="Loading Logo"
              initial={{ opacity: 0, scale: 0.5 }} // Initial state
              animate={{ opacity: 1, scale: 1 }} // Animate to this state
              transition={{ duration: 1, ease: "easeInOut" }} // Animation duration and easing
            />

            {/* Loading Text with Ellipsis Animation */}
            <motion.p
              className="font-sf text-white font-bold xs:text-[1.1rem] ss:text-[1.7rem] mt-4"
              initial={{ opacity: 0, y: 20 }} // Initial state
              animate={{ opacity: 1, y: 0 }} // Animate to this state
              transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }} // Animation delay, duration, and easing
            >
              Hold on, while we get the right word for you{ellipsis}
            </motion.p>
          </div>

          {/* Background Gradient */}
          <div className="absolute h-full inset-0 -z-10 w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#4978ce_100%)]"></div>
        </div>
      )}
    </>
  );
};


export default NewPage
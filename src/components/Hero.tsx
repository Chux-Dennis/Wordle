import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlayCircleIcon } from "lucide-react";
import Rules from "./Rules";
import { Theme } from "@radix-ui/themes";
import { Button as RadButton } from "@radix-ui/themes";
import { useState, useEffect } from "react"; // Import useState and useEffect

const Hero = () => {
  const navigate = useNavigate()
  // State management for opening and closing the Rules modal
  const [rulesModal,setRulesModal] = useState<boolean>(false)

  // State to store the screen width
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // Function to update the screen width state
  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  // Add a resize event listener when the component mounts
  useEffect(() => {
    window.addEventListener("resize", updateScreenWidth);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  // Function to check if the screen width is wider than a given limit
  const screenWidthWiderThan = (widthLimit: number): boolean => {
    return screenWidth > widthLimit;
  };

  // Function to get different colors in the Wordle block
  const getColorFunctionOne = (index: number): string => {
    switch (index) {
      case 1:
        return "yellow";
      case 2:
        return "yellow";
      case 3:
        return "gray";
      case 4:
        return "green";
      case 5:
        return "gray";
      default:
        return "gray"; // Default case returns "gray" or any other fallback color
    }
  };

  // Animation variants for the Wordle letters
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Animation for the button
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <Theme>
      <div className="flex justify-center mt-12 mx-3">
        <div className="flex flex-col">
          {/* Conditionally render based on screen width */}
          {screenWidthWiderThan(620) ? (
            <div className="text-white font-bold font-Space">
              <h1 className="font-bold text-[4rem] flex items-center gap-4">
                SPOT THE{" "}
                <motion.div
                  className="wordle-word inline"
                  style={{ display: "inline-flex" }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delayChildren: 0.5, staggerChildren: 0.1 }} // Delay before animation starts
                >
                  {["G", "R", "E", "E", "N"].map((letter, index) => (
                    <motion.span
                      key={index}
                      className={`${
                        index < 2 ? "gray" : index === 2 ? "yellow" : "gray"
                      } letter`}
                      variants={letterVariants}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              </h1>
              <h1 className="font-bold text-[4rem] flex items-center gap-4">
                <motion.div
                  className="wordle-word hidden"
                  style={{ display: "inline-flex" }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delayChildren: 0.7, staggerChildren: 0.1 }} // Slightly longer delay for the second word
                >
                  {["C", "R", "A", "C", "K"].map((letter, index) => (
                    <motion.span
                      key={index}
                      className={`${getColorFunctionOne(index)} letter`}
                      variants={letterVariants}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
                <span className="ss:hidden">CRACK</span> THE CODE
              </h1>
            </div>
          ) : (
            <div className="text-white font-bold font-Space mx-3">
              <h1 className="font-bold xs:text-[2.3rem] ss:text-[4rem] flex items-center gap-4">
                SPOT THE GREEN
              </h1>
              <h1 className="font-bold xs:text-[2.3rem] ss:text-[4rem] flex items-center gap-4">
                CRACK THE CODE
              </h1>
            </div>
          )}

          {/* Button */}
          <div className="flex justify-center mt-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
              transition={{ delay: 3 }} // Delay for the button animation
              whileHover="hover"
              whileTap="tap"
            >
              <RadButton
                size={"3"}
                className="font-Monomakh !cursor-pointer mt-8 hover:scale-105"
                style={{ cursor: "pointer" }}
                onClick={()=>{
                  navigate("/new")
                }}
              >
                Play Game <PlayCircleIcon />
              </RadButton>
            </motion.div>
          </div>
          <div className="text-white font-Space mt-8 opacity-50">
            <p className="text-center text-sm cursor-pointer hover:underline" onClick={() => {
              setRulesModal(true)
            }}>Rules</p>
          </div>

          <Rules open={rulesModal} onClose={()=> setRulesModal(false)}/>
        </div>
      </div>
    </Theme>
  );
};

export default Hero;

// // Function to get different colors in the wordle black
// const getColorFunctionOne = (index: number): string => {
//   switch (index) {
//     case 1:
//       return "yellow";
//     case 2:
//       return "yellow";
//     case 3:
//       return "gray";
//     case 4:
//       return "green";
//     case 5:
//       return "gray";
//     default:
//       return "gray"; // Default case returns "gray" or any other fallback color
//   }
// };

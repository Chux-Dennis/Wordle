import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Theme } from "@radix-ui/themes";
import { Button as RadButton } from "@radix-ui/themes";

const Hero = () => {

  // Function to get different colors in the wordle black
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
      <div className="flex justify-center mt-12">
        <div className="flex flex-col">
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
                className="wordle-word  hidden"
                
                style={{ display: "inline-flex" }}
                initial="hidden"
                animate="visible"
                transition={{ delayChildren: 0.7, staggerChildren: 0.1 }} // Slightly longer delay for the second word
              >
                {["C", "R", "A", "C", "K"].map((letter, index) => (
                  <motion.span
                    key={index}
                    className={`${
                      getColorFunctionOne(index)
                    } letter`}
                    variants={letterVariants}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
             <span className=" ss:hidden ">CRACK</span> THE CODE
            </h1>
          </div>
          <div className="flex justify-center mt-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
              transition={{ delay: 4 }} // Delay for the button animation
              whileHover="hover"
              whileTap="tap"
            >
              <RadButton
                size={"3"}
                className="font-Monomakh !cursor-pointer mt-8"
                style={{ cursor: "pointer" }}
              >
                Get Started <ArrowRight/>
              </RadButton>
            </motion.div>
          </div>
        </div>
      </div>
    </Theme>
  );
};

export default Hero;

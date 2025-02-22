import Image from "../assets/image/logo.png"

import { Tooltip } from "antd";
import { TwitterIcon } from "lucide-react";
const Twitter = import.meta.env.VITE_TWITTER
const Navigation = () => {
  
  return (
    <>
      <nav className="text-white mx-4 p-8 flex justify-between items-center">
        <div className="logo-pair flex items-center gap-4">
          <img src={Image} alt="" width={"50px"} />
          <h1 className="font-sf  text-white font-bold">WORDLE.</h1>
        </div>

        {/* <div className="circular-container flex -ml-[50px] w-[350px] bg-white gap-4 md:flex xs:hidden text-black font-sf p-4 rounded-full justify-center items-center">
          <p className="font-sf hover:text-theme cursor-pointer text-[1.2rem]">Rules</p>
          <p className="font-sf  hover:text-theme cursor-pointer text-[1.2rem]">Community</p>
          <p className="font-sf  hover:text-theme cursor-pointer text-[1.2rem]">Support</p>
        </div> */}

        <div className="">
          {/* <p>X</p> */}

          <Tooltip title="X Account">
            <a href={Twitter} target="_blank">
              <TwitterIcon className="hover:text-theme cursor-pointer" />
            </a>
          </Tooltip>
        </div>
      </nav>
    </>
  );
}

export default Navigation
import React, { useState } from "react";
import TouristInstructionCard from "./TouristInstructionCard";
import TouristNavBar from "../shared/NavBar/TouristNavBar";

import airplaneImage from "../../assets/airplane.png";
import bedroom from "../../assets/bedroom.png";
import banat from "../../assets/banat.png";
import { Fade } from "react-awesome-reveal";


const cards = [
  {
    superTitle: "GET Started",
    title: "Book your Flight!",
    desc: "The best part about booking a flight is that you don’t need to stress over the details – just pick your destination, and you’re halfway there. Whether it’s a quick getaway or an adventure abroad, booking is simple and hassle-free. No complicated steps, just click and get ready to take off!",
    img: airplaneImage,
    waterMark: "01",
  },
  {
    superTitle: "Next Step",
    title: "Book your Hotel!",
    desc: "The great thing about finding a place to stay is that you don’t need anything fancy – just a cozy bed and a warm welcome. Booking a hotel is as easy as picking your favorite spot, and we’ll take care of the rest. No need to overthink it – comfort is waiting for you at the tap of a button!",
    img: bedroom,
    waterMark: "02",
  },
  {
    superTitle: "where you go is the key",
    title: "Plan your Trip!",
    desc: "Planning your trip is easier than you think – just choose where you want to go, and we’ll help with the rest. From flights and hotels to local tour guides, must-see landmarks, and transportation options, we’ve got everything covered. Customize your adventure, explore at your own pace, and let us handle the details so you can enjoy the journey.",
    img: banat,
    waterMark: "03",
  },
];

const TouristWelcome = ({setFlag}) => {
 setFlag(false);

  return (
    <div className="relative">
      <div className='relative bg-[#075B4C] z-10 overflow-scroll  size-full flex flex-col  items-center h-[100vh] before:content-[""] before:bg-fit before:bg-no-repeat before:size-full before:absolute before:z-[0] before:animate-tourist-background'>
        
        
        <Fade
          className="text-white left-[100px] top-[20%] absolute"
          direction="up"
          cascade
        >
          <h1 className="lg:text-[88px] text-xl leading-10 sm:text-[50px] sm:leading-[50px] font-semibold lg:leading-[100px] ">
            Prepare To See The <br />
            World!
          </h1>
        </Fade>
        <Fade
          className="text-white left-[100px] top-[40%] absolute"
          direction="up"
          cascade
        >
          
        </Fade>
        <main className="w-[80%] h-full mt-[100vh] gap-20 justify-center flex flex-col m-0">
          {cards.map((card, index) => (
            <TouristInstructionCard
              key={index}
              {...card}
              leftToRight={index % 2 === 0}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default TouristWelcome;
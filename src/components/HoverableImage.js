import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import image1 from "../7.jpg";
import image2 from "../8.jpg";
import image3 from "../9.jpg";

const HoverableImage = () => {
  const [mainImage, setMainImage] = useState(image1);
  const [hoverText, setHoverText] = useState(
    "Welcome to Event Organization System"
  );
  const [hovered, setHovered] = useState(false);
  const [arrowDisabled, setArrowDisabled] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const images = [
    {
      src: image1,
      hoverText: "Image 1",
    },
    {
      src: image2,
      hoverText: "Image 2",
    },
    {
      src: image3,
      hoverText: "Image 3",
    },
  ];
  const handleLeftArrowClick = () => {
    if (arrowDisabled) return;
    setArrowDisabled(true);
    setTimeout(() => {
      if (mainImage === image2) {
        setMainImage(image1);
        setHoverText("Welcome to Event Organization System");
      } else if (mainImage === image3) {
        setMainImage(image2);
        setHoverText("Image 2");
      }
    }, 500);
    setFadeOut(true); // set the fade out animation
    setTimeout(() => {
      setFadeOut(false); // reset the fade out animation
      setFadeIn(true); // set the fade in animation
      setTimeout(() => {
        setFadeIn(false); // reset the fade in animation
      }, 500); // wait for 500ms before resetting
    }, 500); // wait for 500ms before setting fade in
    setArrowDisabled(false);
  };

  const handleRightArrowClick = () => {
    if (!arrowDisabled) {
      setArrowDisabled(true);
      setTimeout(() => {
        if (mainImage === image1) {
          setMainImage(image2);
          setHoverText("Image 2");
        } else if (mainImage === image2) {
          setMainImage(image3);
          setHoverText("Image 3");
        }
      }, 500);
      setFadeOut(true); // set the fade out animation
      setTimeout(() => {
        setFadeOut(false); // reset the fade out animation
        setFadeIn(true); // set the fade in animation
        setTimeout(() => {
          setFadeIn(false); // reset the fade in animation
        }, 500); // wait for 500ms before resetting
      }, 500); // wait for 500ms before setting fade in
    }
    setArrowDisabled(false);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <Image
        src={mainImage}
        alt="Main Image"
        className={`${fadeOut ? "fade-out" : ""} ${fadeIn ? "fade-in" : ""}`} // added fade out and fade in classes
        style={{
          width: "100%",
          height: "480px",
          objectFit: "cover",
          cursor: "pointer",
          transition: "opacity 0.5s ease-in-out 2s", // added animationDelay
          opacity: arrowDisabled ? 0.5 : 1,
          animationDelay: "4s", // added animationDelay
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <p className="hoverText" style={{ color: "white" }}>
          {hoverText}
        </p>
      </div>
      <BsChevronLeft
        size={32}
        style={{
          position: "absolute",
          top: "50%",
          left: "-5%",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
        }}
        onClick={handleLeftArrowClick}
      />
      <BsChevronRight
        size={32}
        style={{
          position: "absolute",
          top: "50%",
          right: "-5%",
          transform: "translate(50%, -50%)",
          cursor: "pointer",
        }}
        onClick={handleRightArrowClick}
      />
    </div>
  );
};

export default HoverableImage;

import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CarouselComponent = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Carousel showArrows={true} showThumbs={false} onChange={handleOnChange}>
      {images.map((imageUrl, index) => (
        <div key={index}>
          {index === currentIndex && (
            <img
              src={imageUrl}
              alt="carousel item"
              style={{ maxWidth: "100%", height: "20rem" }}
            />
          )}
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;

// RatingStars.js
import React from 'react';
import { IoIosStar, IoIosStarOutline, IoIosStarHalf } from "react-icons/io";
import { DivEtoile } from "./StyledMovieDetail";

const RatingStars = ({ rating, setRating }) => {
  return (
    <DivEtoile>
      <p >Choisir une Note /5 :</p>
      {[1, 2, 3, 4, 5].map((star, index) => {
        return (
          <span key={index} style={{ cursor: 'pointer' }} onClick={() => setRating(star)}>
            {rating >= star ? <IoIosStar /> : rating >= star - 0.5 ? <IoIosStarHalf /> : <IoIosStarOutline />}
          </span>
        );
      })}
    </DivEtoile>
  );
};

export default RatingStars;

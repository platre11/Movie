// RatingStars.js
import React from 'react';
import {DivEtoile} from "./StyledMovieDetail"

const RatingStars = ({ rating, setRating }) => {
  return (
    <DivEtoile>
        <p style={{ fontFamily: 'Roboto, sans-serif', color: 'white' }}>Choisir une Note /5 :</p>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: 'pointer', color: rating >= star ? 'yellow' : 'White' }}
          onClick={() => setRating(star)} // Modifie la note lorsque l'étoile est cliquée
          
        >
          ★
        </span>
      ))}
    </DivEtoile>
  );
};

export default RatingStars;

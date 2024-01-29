// ReviewFrom.js
import React, { useState } from 'react';
import RatingStars from './RatingStars';
import styled from 'styled-components'

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      alert('Veuillez donner une note avant de soumettre.');
      return;
    }
    const newReview = {
      rating: parseInt(rating), // Assurez-vous que la note est un nombre
      comment,
      date: new Date().toISOString()
    };
    onSubmit(newReview);
    setRating(0); // Réinitialiser la note
    setComment(''); // Réinitialiser le commentaire
  };
  
  const ButtonSoumettre = styled.button`
  height: 3vh;
  width: 5.5vw;
  border: none;
  border-radius: 10px;
  `
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <RatingStars rating={rating} setRating={setRating} />
      </div>
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Commentaire"
          required
        />
      </div>
      <ButtonSoumettre style={{ marginBottom: '20px', background: 'white' }}type="submit">Soumettre</ButtonSoumettre>
    </form>
  );
};

export default ReviewForm;

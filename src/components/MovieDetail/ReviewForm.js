import React, { useState } from 'react';

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert('Le rating doit être entre 1 et 5.');
      return;
    }
    const newReview = {
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString() // ajoute la date actuelle
    };
    onSubmit(newReview);
    setRating('');
    setComment('');
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Commentaire:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Soumettre</button>
    </form>
  );
};

export default ReviewForm;

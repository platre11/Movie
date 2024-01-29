// MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../../services/SwapiService';
import { ComposantMoveDetail, BackButton, ComposantMoveDetail2, ComposantMoveDetail3 } from './StyledMovieDetail'; // Assurez-vous que le chemin est correct
import ReviewForm from './ReviewForm';
import ErrorMessage from './ErrorMessage'; // Composant pour afficher les messages d'erreur


const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // État pour gérer les erreurs
  const { id } = useParams();
  const navigate = useNavigate();
  const [globalRatingCount, setGlobalRatingCount] = useState({1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

  const addReview = (review) => {
    setReviews(prevReviews => {
      const newReviews = [review, ...prevReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
      // Mettre à jour le décompte global des notes
      const newGlobalRatingCount = {...globalRatingCount};
      newGlobalRatingCount[review.rating] = newGlobalRatingCount[review.rating] + 1 || 1;
      setGlobalRatingCount(newGlobalRatingCount);
      return newReviews;
    });
  };
  const renderAverageRating = (reviews) => {
    const { average, count } = calculateAverageRating(reviews);
    const fullStars = Math.floor(average);
    const halfStar = average % 1 !== 0;
  
    return (
      <div>
        <h2 style={{ display: 'flex', justifyContent: 'center' }}>Note Moyenne des Évaluations</h2>
        <div>
          {Array.from({ length: fullStars }, (_, index) => (
            <span key={index} style={{ color: 'yellow' }}>★</span>
          ))}
          {halfStar && <span style={{ color: 'yellow' }}>★</span>}
          {Array.from({ length: 5 - fullStars - (halfStar ? 1 : 0) }, (_, index) => (
            <span key={index} style={{ color: 'grey' }}>☆</span>
          ))}
          <span> {average.toFixed(1)} ({count} Avis)</span>
        </div>
      </div>
    );
  };
  
  
  
  
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError(''); // Réinitialiser l'erreur avant de charger les données
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData);
      } catch (error) {
        console.error(`Impossible de récupérer le film avec l'ID ${id} :`, error);
        setError(`Impossible de récupérer le film. Veuillez réessayer plus tard.`);
      }
      setIsLoading(false);
    };

    fetchMovie();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!movie) {
    return <ErrorMessage message="Film non trouvé." />;
  }
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => index + 1).map((star, index) => (
      <span key={index} style={{ color: rating >= star ? 'yellow' : 'gray' }}>
        ★
      </span>
    ));
  };
  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return { average: averageRating, count: reviews.length }; // Retourne la moyenne exacte et le compte
  };
  
  


  return (
    <ComposantMoveDetail>
      <ComposantMoveDetail2>
      <BackButton onClick={handleBack}>Retour à la liste des films</BackButton>
      <h1>{movie.title}</h1>
      <p className="paragraphe">{movie.opening_crawl}</p>
      <ComposantMoveDetail3>

      {renderAverageRating(reviews)}
      <ReviewForm onSubmit={addReview} />
      
      {reviews.map((review, index) => (
    <div key={index} className='b'>
    <div>{renderStars(review.rating)}</div>
    <p>Commentaire : {review.comment}</p>
    <p>Date : {new Date(review.date).toLocaleString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })}
      
    </p> {/* Affiche la date sans les secondes */}
  </div>
))}
</ComposantMoveDetail3>
     </ComposantMoveDetail2>
    </ComposantMoveDetail>
  );
};

export default MovieDetail;

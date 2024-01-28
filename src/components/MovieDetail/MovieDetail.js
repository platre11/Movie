// MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../../services/SwapiService';
import { ComposantMoveDetail, BackButton } from './StyledMovieDetail'; // Assurez-vous que le chemin est correct
import ReviewForm from './ReviewForm';
import ErrorMessage from './ErrorMessage'; // Composant pour afficher les messages d'erreur


const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // État pour gérer les erreurs
  const { id } = useParams();
  const navigate = useNavigate();

  const addReview = (review) => {
    setReviews([...reviews, review]);
    const sortedReviews = [review, ...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    setReviews(sortedReviews);
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

  return (
    <ComposantMoveDetail>
      <BackButton onClick={handleBack}>Retour à la liste des films</BackButton>
      <h1>{movie.title}</h1>
      <p className="paragraphe">{movie.opening_crawl}</p>
      <ReviewForm onSubmit={addReview} />
      {reviews.map((review, index) => (
  <div key={index}>
    <p>Évaluation : {review.rating}</p>
    <p>Commentaire : {review.comment}</p>
    <p>Date : {new Date(review.date).toLocaleString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })}
    </p> {/* Affiche la date sans les secondes */}
  </div>
))}

    </ComposantMoveDetail>
  );
};

export default MovieDetail;

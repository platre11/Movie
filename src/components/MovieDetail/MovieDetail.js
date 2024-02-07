// MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../../services/SwapiService';
import { ComposantMoveDetail, BackButton, ComposantMoveDetail2, ComposantMoveDetail3, ComposantMoveDetailComment } from './StyledMovieDetail';
import ReviewForm from './ReviewForm';
import ErrorMessage from './ErrorMessage';
import { AiOutlineLike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { MdComment } from "react-icons/md";
import { IoIosStar, IoIosStarOutline, IoIosStarHalf } from "react-icons/io";

let reviewCounter = 0;

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [globalRatingCount, setGlobalRatingCount] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [reviews, setReviews] = useState([]);
  const [showChildCommentForm, setShowChildCommentForm] = useState(null);

  const addReview = (newReview) => { // Fonction pour ajouter une nouvelle critique
    setReviews((prevReviews) => {
      const fullNewReview = {
        ...newReview,
        id: ++reviewCounter,
        isLiked: false,
        likes: 0,
        childComments: []
      };
      const updatedReviews = [fullNewReview, ...prevReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
      const newGlobalRatingCount = { ...globalRatingCount };
      newGlobalRatingCount[newReview.rating] = newGlobalRatingCount[newReview.rating] + 1 || 1;
      setGlobalRatingCount(newGlobalRatingCount);
      return updatedReviews;
    });
  };
  const getTotalLikes = (reviews) => {
    let totalLikes = 0;
    reviews.forEach(review => {
      totalLikes += review.likes;
      review.childComments.forEach(childComment => {
        totalLikes += childComment.likes;
      });
    });
    return totalLikes;
  };
  
  const getTotalComments = (reviews) => {
    let totalComments = 0;
    reviews.forEach(review => {
      totalComments += 1; // Pour le commentaire principal
      totalComments += review.childComments.length; // Ajouter le nombre de sous-commentaires
    });
    return totalComments;
  };

  const addChildComment = (parentReviewId, parentCommentId, childCommentText) => {   // Fonction pour ajouter un commentaire enfant à une critique
    setReviews((prevReviews) => {
      const addComment = (comments, parentId) => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            const newChildComment = {
              id: ++reviewCounter,
              text: childCommentText,
              isLiked: false,
              likes: 0,
              childComments: []
            };
            return { ...comment, childComments: [...comment.childComments, newChildComment] };
          } else if (comment.childComments) {
            return { ...comment, childComments: addComment(comment.childComments, parentId) };
          }
          return comment;
        });
      };

      return addComment(prevReviews, parentCommentId || parentReviewId);
    });
  };

  const renderAverageRating = (reviews) => {    // Fonction pour rendre l'affichage de la note moyenne des évaluations
    const { average, count } = calculateAverageRating(reviews);
  const fullStars = Math.floor(average);
  const halfStar = average % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div>
      <h2 style={{ display: 'flex', justifyContent: 'center' }}>Note Moyenne des Évaluations</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {Array.from({ length: fullStars }, (_, index) => <IoIosStar key={index} />)}
        {halfStar && <IoIosStarHalf />}
        {Array.from({ length: emptyStars }, (_, index) => <IoIosStarOutline key={index} />)}
        <span> {average.toFixed(1)} ({count} Avis)</span>
      </div>
    </div>
    );
  };

  const renderStars = (rating) => {   // Fonction pour rendre les étoiles de notation
    return Array.from({ length: 5 }, (_, index) => index + 1).map((star, index) => (
      <span key={index}>
        {rating >= star ? <IoIosStar color="black" /> : rating >= star - 0.5 ? <IoIosStarHalf color="yellow" /> : <IoIosStarOutline color="gray" />}
      </span>
    ));
  };

  const calculateAverageRating = (reviews) => {   // Fonction pour calculer la note moyenne des évaluations
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return { average: averageRating, count: reviews.length };
  };

  const toggleLike = (reviewId) => {   // Fonction pour gérer le clic sur le bouton "J'aime" pour une critique principale
    setReviews((prevReviews) => prevReviews.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          isLiked: !review.isLiked,
          likes: review.isLiked ? review.likes - 1 : review.likes + 1,
        };
      }
      return review;
    }));
  };

  const toggleChildLike = (reviewId, childCommentId) => {   // Fonction pour gérer le clic sur le bouton "J'aime" pour un commentaire enfant
    const toggleLikeRecursive = (comments) => {
      return comments.map((comment) => {
        if (comment.id === childCommentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        } else if (comment.childComments) {
          return {
            ...comment,
            childComments: toggleLikeRecursive(comment.childComments),
          };
        }
        return comment;
      });
    };
    setReviews((prevReviews) => prevReviews.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          childComments: toggleLikeRecursive(review.childComments),
        };
      }
      return review;
    }));
  };

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError('');
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

  const renderComments = (comments, parentReviewId, isNested = false) => {   // Fonction pour rendre les commentaires et les commentaires enfants récursivement.
    return comments.map((comment, index) => {
      // Si c'est le premier sous-commentaire, appliquer un padding-left. Sinon, ne pas en appliquer.
      const paddingLeft = !isNested ? '20px' : '0px';
      
      return (
        <ComposantMoveDetailComment key={comment.id} style={{ paddingLeft: paddingLeft }}>
          <p>{comment.text}</p>
          {comment.isLiked ? (
            <FcLike onClick={() => toggleChildLike(parentReviewId, comment.id)} />
          ) : (
            <AiOutlineLike onClick={() => toggleChildLike(parentReviewId, comment.id)} />
          )}
        </ComposantMoveDetailComment>
      );
    });
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
          <div className='compteur-like-comment'>
            <p><FcLike /> {getTotalLikes(reviews)}</p>
            <p><MdComment /> {getTotalComments(reviews)}</p>
          </div>
          {reviews.map((review) => (
            <div key={review.id} className='review'>
              <div>{renderStars(review.rating)}</div>
              <p>Commentaire : {review.comment}</p>
              <p>Date : {new Date(review.date).toLocaleString('fr-FR')}</p>
              {review.isLiked ? (
                <FcLike onClick={() => toggleLike(review.id)} />
              ) : (
                <AiOutlineLike onClick={() => toggleLike(review.id)} />
              )}
              <span className='number-like'>{review.likes}</span>
              {showChildCommentForm !== review.id && (
                <MdComment onClick={() => setShowChildCommentForm(review.id)} />
              )}
              {showChildCommentForm === review.id && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const childCommentText = e.target.elements.childCommentInput.value;
                  addChildComment(review.id, null, childCommentText);
                  e.target.reset();
                  setShowChildCommentForm(null);
                }}>
                  <input name="childCommentInput" placeholder="Ajoutez un commentaire" />
                  <button type="submit">Soumettre</button>
                </form>
              )}
              {renderComments(review.childComments, review.id)}
              
            </div>
          ))}
        </ComposantMoveDetail3>
      </ComposantMoveDetail2>
    </ComposantMoveDetail>
  );
};

export default MovieDetail;
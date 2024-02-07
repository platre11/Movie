// Comment.js
import React from 'react';
import { AiOutlineLike, FcLike } from "react-icons/ai"; // Assurez-vous que ces icônes sont importées correctement
import { StyledComment } from './StyledComment'; // Mettez à jour le chemin si nécessaire

const Comment = ({ review, onToggleLike, onAddChildComment, onToggleChildLike }) => {
  
  // Utilisez onToggleLike et onToggleChildLike pour les interactions avec les likes
  // Utilisez onAddChildComment pour ajouter des commentaires enfants

  return (
    <StyledComment>
      {/* Logique pour afficher les étoiles et les likes */}
      {/* Formulaire pour ajouter un commentaire enfant */}
      {/* Affichage des commentaires enfants (récursivement si nécessaire) */}
    </StyledComment>
  );
};

export default Comment;

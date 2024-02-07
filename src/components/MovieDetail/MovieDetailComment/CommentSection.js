// CommentSection.js
import React from 'react';
import { AiOutlineLike, FcLike } from "react-icons/ai"; // Assurez-vous que ces icônes sont importées correctement

const CommentSection = ({ reviews, onLike, onAddChildComment, onToggleLike, onToggleChildLike }) => {

    
  return (
      <div>
      {renderComments(comments, parentReviewId)}
    </div>
  );
};

export default CommentSection;

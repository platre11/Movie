// LikesContext.js
import React, { useState, createContext } from 'react';

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likes, setLikes] = useState({});

  const addLike = (commentId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [commentId]: (prevLikes[commentId] || 0) + 1
    }));
  };

  const removeLike = (commentId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [commentId]: Math.max((prevLikes[commentId] || 0) - 1, 0)
    }));
  };

  return (
    <LikesContext.Provider value={{ likes, addLike, removeLike }}>
      {children}
    </LikesContext.Provider>
  );
};

export default LikesContext;

import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function QuestionLikeButton({ question }) {
  const [liked, setLiked] = useState(question.voted === 'like');
  const [disliked, setDisliked] = useState(question.voted === 'dislike');
  const [likes, setLikes] = useState(question.no_like);
  const [dislikes, setDislikes] = useState(question.no_dislikes);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(question.voted === 'like');
    setDisliked(question.voted === 'dislike');
  }, [question]);

  const handleVote = async (question_id, vote_type) => {
    if (!auth){
      navigate('/login');
    }
    try {
      const response = await fetch(`http://localhost:8080/vote?user_id=${auth.user_id}&question_id=${question_id}&vote_type=${vote_type}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (vote_type === 'like') {
        if (liked) {
          setLiked(false);
          setLikes(likes - 1);
        } else {
          setLiked(true);
          setDisliked(false);
          setLikes(likes + 1);
          if (disliked) setDislikes(dislikes - 1);
        }
      } else if (vote_type === 'dislike') {
        if (disliked) {
          setDisliked(false);
          setDislikes(dislikes - 1);
        } else {
          setDisliked(true);
          setLiked(false);
          setDislikes(dislikes + 1);
          if (liked) setLikes(likes - 1);
        }
      }

      console.log("Vote registered successfully");
    } catch (e) {
      console.error("An error occurred while voting: ", e);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <FaThumbsUp
        style={{ marginRight: 5, marginTop: 3, cursor: "pointer" }}
        color={liked ? "#98c4e3" : "gray"}
        onClick={() => handleVote(question.question_id, 'like')}
      />
      <p style={{ color: "gray", fontSize: 16 }}>
        {likes}
      </p>
      <FaThumbsDown
        style={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          cursor: "pointer",
        }}
        color={disliked ? "#98c4e3" : "gray"}
        onClick={() => handleVote(question.question_id, 'dislike')}
      />
      <p style={{ color: "gray", fontSize: 16 }}>
        {dislikes}
      </p>
    </div>
  );
}

export default QuestionLikeButton;

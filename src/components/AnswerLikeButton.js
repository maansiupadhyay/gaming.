import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

function AnswerLikeButton({ answer }) {
  const [liked, setLiked] = useState(answer.voted === 'like');
  const [disliked, setDisliked] = useState(answer.voted === 'dislike');
  const [likes, setLikes] = useState(answer.no_likes);
  const [dislikes, setDislikes] = useState(answer.no_dislikes);
  const { auth } = useAuth();

  useEffect(() => {
    setLiked(answer.voted === 'like');
    setDisliked(answer.voted === 'dislike');
  }, [answer]);

  const handleVote = async (answer_id, vote_type) => {
    try {
      const response = await fetch(`http://localhost:8080/vote?user_id=${auth.user_id}&answer_id=${answer_id}&vote_type=${vote_type}`, {
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
          setLikes(likes + 1);
          if (disliked) {
            setDisliked(false);
            setDislikes(dislikes - 1);
          }
        }
      } else if (vote_type === 'dislike') {
        if (disliked) {
          setDisliked(false);
          setDislikes(dislikes - 1);
        } else {
          setDisliked(true);
          setDislikes(dislikes + 1);
          if (liked) {
            setLiked(false);
            setLikes(likes - 1);
          }
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
        onClick={() => handleVote(answer.answer_id, 'like')}
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
        onClick={() => handleVote(answer.answer_id, 'dislike')}
      />
      <p style={{ color: "gray", fontSize: 16 }}>
        {dislikes}
      </p>
    </div>
  );
}

export default AnswerLikeButton;

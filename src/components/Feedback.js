import React, { useState } from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth"; 

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 65vw;
  background-color: white;
  color: #333;
  border-radius: 2px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
  margin-left: 40px;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.02);
  margin: 10px 0;
  border: 0.5px solid #ddd;
  border-radius: 4px;
  color: #131d52;
  outline: none;
  resize: none;
  &:focus {
    border-color: #131d52;
    transition: border-color 0.2s ease-in-out;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  cursor: pointer;
  height: 40px;
  font-size: 14px;

  &:hover {
    background-color: #343a40;
    transition: background-color 0.2s ease-in;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: #131d52;
  align-self: flex-start;
  width: 100%;
`;

const Alert = styled.div`
  background-color: ${(props) => (props.type === "success" ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.type === "success" ? "#155724" : "#721c24")};
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${(props) => (props.type === "success" ? "#c3e6cb" : "#f5c6cb")};
  border-radius: 4px;
  text-align: center;
`;

function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(null);
  const { auth } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth) {
      setAlert({ message: "You must be logged in to submit feedback.", type: "error" });
      return;
    }

    if (!message.trim()) {
      setAlert({ message: "Feedback cannot be empty.", type: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: auth.user_id, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      setMessage(""); 
      setAlert({ message: "Feedback submitted successfully!", type: "success" });
    } catch (error) {
      setAlert({ message: "Error submitting feedback. Please try again.", type: "error" });
    }
  };

  return (
    <CardContainer>
      <Title>Submit Your Feedback</Title>
      <hr style={{ marginTop: 5 }} />
      {alert && <Alert type={alert.type}>{alert.message}</Alert>}
      <form onSubmit={handleSubmit}>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your feedback here..."
        />
        <SubmitButton type="submit">Submit Feedback</SubmitButton>
      </form>
    </CardContainer>
  );
}

export default FeedbackForm;

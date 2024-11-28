import React, { useState } from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 60vw;
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
  height: 300px;
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

const AskButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  margin-right: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  height: 40px;
  font-size: 14px;

  &:hover {
    background-color: #343a40;
    transition: background-color 0.2s ease-in;
  }
`;

const AnswerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  color: #131d52;
  align-self: flex-start;
  width: 100%;
`;

const Label = styled.label`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-left: 5px;
  align-items: center;
  font-size: 14px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-weight: 450;
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

function LeaveAnswerCard({ question }) {
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const { auth } = useAuth();
  const [alert, setAlert] = useState(null); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("user_id", auth.user_id); 
    formData.append("question_id", question.question_id); 
    formData.append("answer_text", details); 
  
    if (file) {
      formData.append("image_file", file); 
    } else {
      formData.append("image_file", ""); 
    }
  
    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      const response = await fetch("http://localhost:8080/addanswer", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the form");
        
      }
  
      const result = await response.json();
      console.log("Form submitted successfully:", result);
      window.location.reload(); 
      
      setAlert({
        message: "Answer submitted successfully!",
        type: "success",
      });
  
      e.target.reset(); 
      setFile(null); 
    } catch (error) {
      console.error("Error submitting the form:", error);
      setAlert({ message: "Error submitting the form.", type: "error" });
    }
  };
  

  return (
    <div style={{ display: "flex" }}>
      <CardContainer>
        <AnswerTitle>
        {alert && <Alert type={alert.type}>{alert.message}</Alert>}
        Leave An Answer
        </AnswerTitle>
        <hr style={{ marginTop: 5 }} />
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flex: 5 }}>
            <Textarea 
              name="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Type your answer here"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 10,
            }}
          >
            <Label htmlFor="photo">Upload Photo</Label>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                flex: 3.85,
              }}
            >
              <input
                type="file"
                id="photo"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label
                htmlFor="photo"
                style={{
                  backgroundColor: "#131d52",
                  color: "white",
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderRadius: 4,
                  marginTop: -5,
                  marginBottom: 20,
                }}
              >
                Choose File
              </label>
              <p style={{ marginTop: 0, marginLeft: 10, fontSize: 14 }}>
                {file ? file.name : "No file chosen"}
              </p>
            </div>
          </div>
          <AskButton type="submit">Post Your Answer</AskButton>
        </form>
      </CardContainer>
      <div style={{ marginRight: 50 }}></div>
    </div>
  );
}

export default LeaveAnswerCard;

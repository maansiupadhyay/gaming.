import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import MainNav from "../components/MainNav";
import Side from "../Side";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { lineSpinner } from "ldrs";
import AnswerCard from "../AnswerCard";
import styled from "styled-components";
import { AiFillQuestionCircle } from "react-icons/ai";
import LeaveAnswerCard from "./LeaveAnswerCard";
import QuestionLikeButton from "../components/QuestionLikeButton";
import Poll from "../components/Poll";
import { FaPollH } from "react-icons/fa";
import SaveButton from "../components/Saved";

lineSpinner.register();

const AskButton = styled.button`
  width: 30%;
  padding: 10px;
  margin-right: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

  &:hover {
    background-color: #343a40;
    transition: background-color 0.2s ease-in;
  }
`;

const QuestionButton = styled.div`
  width: 10%;
  margin-right: 10px;
  display: flex;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  height: 20px;
  background-color: #131d52;
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 12px;
`;

function AddAnswerPage() {
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const { questionId } = location.state || {};
  const [question, setQuestion] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const { auth } = useAuth();
  const [imageURL, setImageURL] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionsAnswers = async () => {
      try {
        const url = `http://localhost:8080/answers?user_id=${auth.user_id}&&question_id=${questionId}&page_no=1`;
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setQuestion(result.questions);
        setAnswers(result.answers);
        console.log(questionId);

        setIsLoading(false);
        setType(result?.questions.type);
        setImageURL(result?.questions.image_file || "");
      } catch (e) {
        console.error("An error occurred while fetching the question data: ", e);
        setError(e.message);
      }
    };
    fetchQuestionsAnswers();
  }, [auth.user_id, questionId]);

  if (isLoading)
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="#333"
        ></l-line-spinner>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <TopBar
        isLoggedIn={true}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        login={() => {
          navigate("/login");
        }}
        navigate={navigate}
      />
      <MainNav />
      <div style={{ display: "flex" }}>
        <div>
          <div
            className="question-card"
            style={{
              marginLeft: 40,
              padding: 30,
              paddingBottom: 10,
              flexDirection: "column",
              display: "flex",
              marginTop: 30,
              boxShadow: "0 8px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="question-content">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      borderRadius: "50%",
                      height: 40,
                      width: 40,
                      backgroundColor: "lightgray",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${question.profile_image}`}
                      alt="profile-photo"
                      style={{ height: 40, width: 40, objectFit: "cover" }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "400",
                      marginTop: 5,
                      marginLeft: 5,
                    }}
                  >
                    {question.username}
                  </p>
                </div>
                <QuestionButton>
                  {type===1?<><AiFillQuestionCircle style={{ marginRight: 2 }} />
                  Question</>:<><FaPollH />Poll</>}
                </QuestionButton>
              </div>
              {type===1?
              <>
              <p style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
                {question.question}
              </p>
                </>
                  :
                  <div style={{flex:1, display:'flex', justifyContent:'center'}}>
                  <Poll question={question.question} questionId={questionId}/>
                  </div>}
              <p style={{ fontSize: 16 }}>{question.description}</p>
            </div>

            {imageURL && (
              <div style={{ margin: "20px" }}>
                <img
                  src={`data:image/png;base64,${imageURL}`}
                  alt="Question-Image"
                  style={{ width: "90%", height: "auto", objectFit: "contain" }}
                />
                
              </div>
            )}
            <hr/>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <AskButton>Add Answer to the Question</AskButton>
              <div style={{ display: "flex", marginTop: 8, marginRight: 10 }}>
                <QuestionLikeButton question={question} />
                <SaveButton question={question}/>
              </div>
            </div>
          </div>
          <AnswerCard answers={answers} />
          <LeaveAnswerCard question={question}/>
        </div>
        <Side />
      </div>
    </div>
  );
}

export default AddAnswerPage;

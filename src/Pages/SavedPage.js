import React, { useState, useEffect } from "react";
import "../App.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import MainNav from "../components/MainNav";
import Side from "../Side";
import useAuth from "../hooks/useAuth";
import "../QuestionCard.css";
import { BsFillPinFill } from "react-icons/bs";
import UserImage from "../assets/profilephoto.png";
import { AiFillQuestionCircle } from "react-icons/ai";
import { lineSpinner } from 'ldrs';
import QuestionLikeButton from "../components/QuestionLikeButton";
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
  font-size: 12px;
`;

const QuestionTitle = styled.p`
  &:hover{
    color: #131d52;
    cursor: pointer;
  }
`

function SavedPage() {
  const [question, setQuestion] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchquestion = async () => {
      try {
        const url = `http://localhost:8080/saveQuestion?user_id=${auth.user_id}`;
        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setQuestion(result.save_questions);
        setIsLoading(false);
      } catch (e) {
        console.error("An error occurred while fetching the question data: ", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchquestion();
  }, [auth.user_id]);

  if (isLoading) return <div style={{ width: "100%", height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <l-line-spinner
      size="40"
      stroke="3"
      speed="1"
      color="#333"
    ></l-line-spinner>
  </div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="header-container" style={{marginBottom: '40px'}}>
      <TopBar
        isLoggedIn={true}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        profile={() => {
          navigate("/profile");
        }}
        login={() => {}}
        navigate={navigate}
        Logout={() => {}}
      />
      <MainNav tabs={["Home", "Profile", "Questions", "Answers", "Logout"]} />
      <div style={{ display: "flex" }}>
        <div style={{ flex: 2, marginTop: 10 }}>
          {question?.map((question,index)=>(
            <div
            className="question-card"
            style={{
              marginLeft: 40,
              padding: 30,
              paddingBottom: 10,
              flexDirection: "column",
              width:'65vw'
            }}
          >
            <div className="question-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      borderRadius: "50%",
                      height: 50,
                      width: 50,
                      backgroundColor: "lightgray",
                    }}
                  >
                    <img
                      src={UserImage}
                      alt="profile-photo"
                      style={{ height: 50, width: 50 }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: "400",
                      marginTop: 10,
                      marginLeft: 5,
                    }}
                  >{question.username}</p>
                </div>
                <QuestionButton style={{ marginTop: 10 }}>
                  <AiFillQuestionCircle style={{ marginRight: 2 }} />
                  Question
                </QuestionButton>
              </div>
              <QuestionTitle style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }} onClick={()=>navigate('/addanswer',{ state: { questionId: question.question_id }})}>
                <BsFillPinFill style={{ marginRight: 5 }} /> {question.question}
              </QuestionTitle>
              <p style={{ fontSize: 16 }}>
                {question.discription}
              </p>
            </div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <AskButton>Add Answer to the Question</AskButton>
              <div style={{ display: "flex", marginTop: 8, marginRight: 10 }}>
                <QuestionLikeButton question={question}/>
                <p style={{ color: "gray", fontSize: 16 }}>{question.like}</p>
                <SaveButton question={question}/>
              </div>
            </div>
          </div>
        ))}
        </div>

        <div style={{ flex: 1 }}>
          <Side />
        </div>
      </div>
    </div>
  );
}

export default SavedPage;

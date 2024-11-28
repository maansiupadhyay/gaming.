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
import { AiFillQuestionCircle } from "react-icons/ai";
import { lineSpinner } from 'ldrs';

lineSpinner.register();

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
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  cursor: pointer;
  font-size: 12px;
`;

const QuestionTitle = styled.p`
  &:hover {
    color: #131d52;
    cursor: pointer;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #131d52;
  color: white;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

function AnswersPage() {
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1); // Maintain current page number
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setIsLoading(true);
        const url = `http://localhost:8080/user_answered_questions?user_id=${auth.user_id}&page_no=${pageNo}`;
        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setAnswers(result.user_answered_questions);
        setTotalPages(result.total_pages); // Set total pages from API response
        setIsLoading(false);
      } catch (e) {
        console.error("An error occurred while fetching the answers data: ", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [auth.user_id, pageNo]); // Fetch answers when pageNo changes

  const handleNextPage = () => {
    window.scrollTo(0, 0);
    if (pageNo < totalPages) {
      setPageNo((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    window.scrollTo(0, 0);
    if (pageNo > 1) {
      setPageNo((prevPage) => prevPage - 1);
    }
  };

  if (isLoading)
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <l-line-spinner size="40" stroke="3" speed="1" color="#333"></l-line-spinner>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="header-container">
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
          {answers?.map((answer, index) => (
            <div
              className="question-card"
              style={{
                marginLeft: 40,
                padding: 30,
                paddingBottom: 10,
                flexDirection: "column",
              }}
              key={index}
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
                        overflow: 'hidden',
                        border: '1px solid rgba(19, 29, 82, 0.5)'
                      }}
                    >
                      <img src={`data:image/png;base64,${answer.profile_image}`} alt="profile-photo" style={{ height: 50, width: 50 }} />
                    </div>
                    <p style={{ fontSize: 22, fontWeight: "400", marginTop: 10, marginLeft: 5 }}>{answer.username}</p>
                  </div>
                  <QuestionButton style={{ marginTop: 10 }}>
                    <AiFillQuestionCircle style={{ marginRight: 2 }} />
                    Question
                  </QuestionButton>
                </div>
                <QuestionTitle
                  style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }}
                  onClick={() => navigate("/addanswer", { state: { questionId: answer.question_id } })}
                >
                  <BsFillPinFill style={{ marginRight: 5 }} /> {answer.question}
                </QuestionTitle>
                <p style={{ fontSize: 16 }}>{answer.description}</p>
              </div>
            </div>
          ))}
          <PaginationContainer>
            <PaginationButton onClick={handlePreviousPage} disabled={pageNo === 1}>
              Previous
            </PaginationButton>
            <span>Page {pageNo} of {totalPages}</span>
            <PaginationButton onClick={handleNextPage} disabled={pageNo === totalPages}>
              Next
            </PaginationButton>
          </PaginationContainer>
        </div>

        <div style={{ flex: 1 }}>
          <Side />
        </div>
      </div>
    </div>
  );
}

export default AnswersPage;

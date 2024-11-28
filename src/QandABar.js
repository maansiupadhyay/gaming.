import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import QuestionCard from "./QuestionCard";
import { lineSpinner } from "ldrs";
import "./App.css";
import useAuth from "./hooks/useAuth";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

lineSpinner.register();

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NavContainer = styled.nav`
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
  margin-top: 30px;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  border-bottom: 2px solid #131e56;
`;

const NavItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  background-color: ${(props) => (props.active ? "#131e56" : "transparent")};
  color: ${(props) => (props.active ? "white" : "black")};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#131e56" : "#98c4e3")};
    color: ${(props) => (props.active ? "white" : "black")};
  }
`;

const QuestionCardContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const SeeMoreLink = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #131e56;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #343a40;
    transition: background-color 0.2s ease-in-out;
  }
`;

function QuestionNav({ toggleDropdown }) {
  const [activeTab, setActiveTab] = useState("Recent Questions");
  const tabs = ["Recent Questions", "Most Answered", "No Answers"];
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getApiData = async () => {
      setIsLoading(true);
      try {
        const url = `http://localhost:8080/home?user_id=${auth.user_id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        switch (activeTab) {
          case "Recent Questions":
            setQuestions(result.recent_questions);
            break;
          case "Most Answered":
            setQuestions(result.most_answered);
            break;
          case "No Answers":
            setQuestions(result.no_answered);
            break;
          default:
            setQuestions([]);
            break;
        }
        setIsLoading(false);
      } catch (e) {
        console.error("An error occurred while fetching the data: ", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    getApiData();
  }, [activeTab, auth.user_id]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search`, { state: { searchQuery } });
    }
  };

  const handleSearchClick = () => {
    navigate(`/search`, { state: { searchQuery } });
  };

  const handleSeeMore = () => {
    switch (activeTab) {
      case "Recent Questions":
        navigate("/recentquestion");
        break;
      case "Most Answered":
        navigate("/mostanswered");
        break;
      case "No Answers":
        navigate("/noanswered");
        break;
      default:
        break;
    }
  };

  if (isLoading)
    return (
      <div
        style={{
          width: "60vw",
          height: "50vh",
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
    <NavContainer>
      <NavList>
        {tabs.map((tab) => (
          <NavItem
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </NavItem>
        ))}
        <div
          className="right-section"
          style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <AiOutlineSearch
              color="black"
              onClick={handleSearchClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <input
            type="text"
            placeholder="Search here ..."
            className="search-input"
            style={{ backgroundColor: "transparent", color: "black" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </NavList>
      <QuestionCardContainer>
        <QuestionCard questions={questions} />
      </QuestionCardContainer>
      <SeeMoreLink onClick={handleSeeMore}>See More</SeeMoreLink>
    </NavContainer>
  );
}

export default QuestionNav;

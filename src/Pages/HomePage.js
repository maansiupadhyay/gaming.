import React, { useState, useEffect } from "react";
import "../App.css";
import Side from "../Side";
import QandABar from "../QandABar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "../Modal.css";
import "ldrs/helix";
import { lineSpinner } from "ldrs";
import ImageUrl from "../assets/chrome.png";
import TopBar from "../components/TopBar";
import MainNav from "../components/MainNav";
import useAuth from "../hooks/useAuth";

lineSpinner.register();

const AskBox = styled.textarea`
  font-size: 14px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  &:focus {
    outline: none;
    box-shadow: 0 0 3px #131e56;
  }
`;

const AskButton = styled.button`
  width: 85%;
  padding: 10px;
  margin-right: 10px;
  background-color: #343a40;
  color: white;
  border: none;
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

  &:hover {
    background-color: #555e66;
    transition: background-color 0.2s ease-in;
  }
`;

const SubmitButton = styled.button`
  margin-right: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  cursor: pointer;
  height: 35px;
  font-size: 14px;
  border-radius: 2px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

  &:hover {
    background-color: #98c4e3;
    color:#333;
    transition: background-color 0.2s ease-in;
  }
`;

function MainPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loginAreaHeight, setLoginAreaHeight] = useState("0px");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const getApiData = async () => {
      try {
        const url = auth.user_id
          ? `https://backend-pv08.onrender.com/home?user_id=${auth.user_id}`
          : `https://backend-pv08.onrender.com/home`;
        console.log(url);
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setResult(data);
        if (data.valid) {
          setAuth((prevAuth) => ({
            ...prevAuth,
            username: data.user_info.username,
          }));
          setIsLoggedIn(true);
        }
        setIsLoading(false);
      } catch (e) {
        console.error("An error occurred while fetching the data: ", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    getApiData();
  }, [auth.user_id, setAuth]);

  
  useEffect(() => {
    if (showProfile) {
      setLoginAreaHeight("300px");
    } else {
      setLoginAreaHeight("0px");
    }
  }, [showProfile]);

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

  const login = () => {
    navigate("/login");
  };

  const profile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="header-container">
      <TopBar
        isLoggedIn={isLoggedIn}
        setShowProfile={setShowProfile}
        showProfile={showProfile}
        loginAreaHeight={loginAreaHeight}
        profile={profile}
        login={login}
        navigate={navigate}
        username={isLoggedIn ? result.user_info.username : "User"}
      />
      <MainNav />
      <div className="page-title" style={{ display: "flex"}}>
        <div style={{ flex: 1}}>
          <div>
            <h3 className="title-heading">
              Welcome to GDP
            </h3>
            <p
              className="title-para"
            >
              Where Game Devs level up together! 
              Got questions?Got answers? 
              Let’s turn bugs into features and 
              code into epic wins. Game on!
            </p>
            <div
              style={{
                display: "flex",
                olor: "white",
                fontWeight: "300",
                margin: 90,
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              <AskButton className="title-button" onClick={() => navigate("/contact")}>About Us</AskButton>
              <AskButton className="title-button" onClick={() => navigate("/askquestion")}>
                Ask Question
              </AskButton>
            </div>
          </div>
        </div>
        <div
          style={{ flex: 1.75, alignItems: "flex-end", position: "relative", display:'flex', justifyContent:'center' }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
              width: "100%",
              maxWidth: "950px",
              alignSelf:'center',
              backgroundImage: `url(${ImageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "90% 100%",
              padding: "45px",
              paddingTop:"85px",
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              flex:1
            }}
          >
            <AskBox
              placeholder="Ask a question and you will be sure to find an answer!"
              style={{
                backgroundColor: 'aliceblue',
                borderWidth: 0,
                height: "100%",
                width: "90%",
                resize: "none",
                padding: "15px",
                boxSizing: "border-box",
                color:'#131e56'
              }}
            />
            <SubmitButton
              style={{
                position: "absolute",
                bottom: "18%",
                right: "10%",
                width: 95,
              }}
            >
              Ask Now
            </SubmitButton>
          </div>
        </div>
      </div>
      <div className="thirdbar">
        <QandABar/>
        <div className="SideView"><Side /></div>
      </div>
    </div>
  );
}

export default MainPage;

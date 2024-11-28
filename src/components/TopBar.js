import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoHomeSharp } from "react-icons/io5";
import { FaCircleQuestion } from "react-icons/fa6";
import { MdQuestionAnswer } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import UserImage from "../assets/profilephoto.png";
import useAuth from "../hooks/useAuth";
import { IoMdPerson } from "react-icons/io";
import "../TopBar.css";
import Side from "../Side";
import '../App.css';

const LeftSectionButton = styled.button`
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-weight: 600;
  &:hover {
    color: #98c4e3;
    transition: color 0.1s ease-in;
  }
`;

const ProfileButton = styled.button`
  text-decoration: none;
  color: #98c4e3;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 400;
  &:hover {
    color: white;
    transition: color 0.1s ease-in;
  }
`;

const LoginArea = styled.div`
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: height 0.75s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const ProfileImage = styled.div`
  background-color: white;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  margin-right: 5px;
  &:hover {
    background-color: gray;
    transition: background-color 0.1s ease-in;
  }
`;

const DropdownButton = styled.button`
    display: block;
    left: 20px;
    background-color: #131d52;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
`;

const TopBar = ({ isLoggedIn, showProfile, setShowProfile, login}) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loginAreaHeight, setLoginAreaHeight] = useState("0px");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (showProfile) {
      setLoginAreaHeight("300px");
    } else {
      setLoginAreaHeight("0px");
    }
  }, [showProfile]);

  const profile = () => {
    setShowProfile(!showProfile);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const Logout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      localStorage.setItem("auth", false);
      setShowProfile(false);
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 800);
    } catch (e) {
      console.error("An error occurred while logging out: ", e);
    }
  };

  return (
    <div className="top-bar-content">
      <div className={`dropdown-content ${dropdownVisible ? 'open' : 'close'}`}>
        <div style={{height:'200px', width:'100%', backgroundColor:'#131d52', padding:20}}>
          <div style={{borderRadius:'50%', backgroundColor:'white', height:100, width: 100}}></div>
          <div><h3 style={{color: 'white', marginTop:20}}>UserName</h3></div>
        </div>
        <Side/>
      </div>
      <LoginArea style={{ height: loginAreaHeight }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            paddingLeft: 150,
            paddingRight: 20,
          }}
        >
          <ProfileImage>
            <img
              src={UserImage}
              alt="user-image"
              style={{ width: "100%", height: "100%" }}
            />
          </ProfileImage>
          <h5>Welcome {auth.username}</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h5 style={{ marginLeft: 50 }}>Quick Links</h5>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 50,
              flex: 1,
            }}
          >
            <ProfileButton onClick={() => navigate("/profile")}>
              <IoHomeSharp size={14} style={{ marginBottom: 5 }} /> Profile Page
            </ProfileButton>
            <ProfileButton onClick={() => navigate("/question")}>
              <FaCircleQuestion size={14} style={{ marginBottom: 5 }} />{" "}
              Questions Asked
            </ProfileButton>
            <ProfileButton onClick={() => navigate("/answer")}>
              <MdQuestionAnswer size={14} style={{ marginBottom: 5 }} /> Answers
            </ProfileButton>
            <ProfileButton onClick={() => Logout()}>
              <BiLogOut size={16} style={{ marginBottom: 2 }} /> Logout
            </ProfileButton>
          </div>
        </div>
      </LoginArea>
      <div className="top-bar">
        <div className="left-section">
          <LeftSectionButton onClick={isLoggedIn ? profile : login}>
            {isLoggedIn ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <ProfileImage style={{ height: 30, width: 30 }}>
                  <img
                    src={UserImage}
                    alt="user-image"
                    style={{ width: "100%", height: "100%" }}
                  />
                </ProfileImage>
                {auth.username}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <IoMdPerson style={{ marginRight: 5 }} /> Login
              </div>
            )}
          </LeftSectionButton>
        </div>
        <div
          className="right-section"
          style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <DropdownButton
            onClick={toggleDropdown}
            className="topbar-dropdown-button"
          >
            Menu
          </DropdownButton>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

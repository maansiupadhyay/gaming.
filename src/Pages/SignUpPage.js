import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import axios from "../api/Axios";
import { FaInfoCircle } from "react-icons/fa";
import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "../assets/LoginBack.png";
import useAuth from "../hooks/useAuth";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(90deg, rgba(12,20,57,1) 20%, rgba(21,33,88,1) 59%, rgba(24,49,112,1) 90%);
`;

const Form = styled.form`
  padding: 20px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #131d52;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    background-color: #4a5b8c;
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    transform: scale(1);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #131d52;
  background-color: #b5c1ed;
  padding: 5px 10px;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 14px;
`;

const SignInText = styled.div`
  color: #98c4e3;
  font-size: 15px;
  font-weight: 300;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

const PageSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100vh;
  background: linear-gradient(90deg, rgba(12,20,57,1) 20%, rgba(21,33,88,1) 59%, rgba(24,49,112,1) 90%);
`;

const SignInLink = styled.p`
  color: #131d52;
  text-decoration: none;
  transition: color 0.3s, text-decoration 0.3s;

  &:hover {
    color: #98c4e3;
    text-decoration: underline;
  }
`;

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{5,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const SIGNUP_URL = "/signup";

function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const { setAuth } = useAuth();
  const fromLogin = location.state?.fromLogin || false; 

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  useEffect(() => {
    const getApiData = async () => {
      try {
        const url = `http://localhost:8080/auth/data`;
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const accessToken = data.accessToken;
        const user_id = data?.user_id || false;
        const user = data.user_name;
        const pwd = data.password;
        setAuth({ user, pwd, user_id, accessToken });
        setUser("");
        setPwd("");
        console.log(user_id);
        if (user_id && !fromLogin) { // Check if not from the login page
          navigate("/");
        }
      } catch (e) {
        console.error("An error occurred while fetching the data: ", e);
      }
    };

    getApiData();
  }, [setAuth, fromLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        SIGNUP_URL,
        JSON.stringify({
          username: user,
          password: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      navigate('/login');
      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <Container>
      <PageSection style={{ flex: 1.4 }}>
        <img
          src={Background}
          alt="signup-image"
          style={{ width: "100%", height: "100vh" }}
        />
      </PageSection>
      <PageSection>
        <Form onSubmit={handleSubmit}>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h2 style={{ fontSize: 27, color: "#131d52" }}>Sign Up</h2>
          <Input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            placeholder="Username"
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onBlur={() => setUserFocus(true)}
          />
          <ErrorMessage
            id="uidnote"
            className={
              userFocus && user && !validName ? "instructions" : "offscreen"
            }
          >
            <FaInfoCircle />
            6 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </ErrorMessage>
          <Input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            placeholder="Password"
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onBlur={() => setPwdFocus(true)}
          />
          <ErrorMessage
            id="pwdnote"
            className={
              pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"
            }
          >
            <FaInfoCircle />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </ErrorMessage>
          <Input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            placeholder="Confirm Password"
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onBlur={() => setMatchFocus(true)}
          />
          <ErrorMessage
            id="confirmnote"
            className={
              matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"
            }
          >
            <FaInfoCircle />
            Must match the first password input field.
          </ErrorMessage>
          <Button disabled={!validName || !validPwd || !validMatch ? true : false}>
            Sign Up
          </Button>
          <SignInText>
            <div></div>
            <br />
            <span className="line">
              <SignInLink onClick={() => navigate("/login")}>
                Already registered? Sign In
              </SignInLink>
            </span>
          </SignInText>
        </Form>
      </PageSection>
    </Container>
  );
}

export default SignUpPage;

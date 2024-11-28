import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import MainNav from "../components/MainNav";
import Side from "../Side";
import UserImage from "../assets/profilephoto.png";
import useAuth from "../hooks/useAuth";
import { lineSpinner } from "ldrs";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

lineSpinner.register();

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  width: 97%;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: 5%;
  margin-top: 5%;
  margin-right: 5%;
  margin-bottom: 20px;
`;

const AskButton = styled.button`
  width: 150px;
  padding: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;

  &:hover {
    background-color: #4eb5ff;
    transition: background-color 0.2s ease-in;
  }
`;

const QuestionButton = styled.button`
  width: 150px;
  padding: 10px;
  background-color: #131d52;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 20px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

  &:hover {
    background-color: #4eb5ff;
    transition: background-color 0.2s ease-in;
  }
`;

const ProfileItem = styled.div`
  margin: 10px 0;
  font-size: 1.2em;
  font-weight: 500;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  align-self: flex-start;
  width: 100%;
  margin-left: 60px;
`;

const ProfileTitle = styled.h2`
  font-size: 2em;
  font-weight: bold;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  color: #131d52;
  align-self: flex-start;
  width: 100%;
`;

const ProfileContent = styled.div`
  display: flex;
  width: 100%;
`;

const ProfileImage = styled.div`
  margin-left: 20px;
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(19, 29, 82, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileDetails = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.2em;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 1em;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  width: 80%;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [joinDate, setJoinDate] = useState();
  const [profile, setProfile] = useState({
    user_id: auth.user_id,
    username: "",
    email: "",
    city: "",
    country: "",
    about: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    gender: "",
    profile_image: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = `http://localhost:8080/user_profile?user_id=${auth.user_id}`;
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setProfile(result);
        setJoinDate(result.join_date);
        setIsLoading(false);
      } catch (e) {
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [auth.user_id]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const url = `http://localhost:8080/update_profile`;

      const formData = new FormData();

      for (const key in profile) {
        formData.append(key, profile[key]);
      }

      formData.append("user_id", 1);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setProfile({ ...profile, profile_image: e.target.files[0] });
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const epochTimestamp = joinDate;
  const date = new Date(epochTimestamp * 1000);

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
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

  return (
    <div className="header-container">
      <TopBar
        isLoggedIn={true}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        loginAreaHeight="0px"
        profile={() => {}}
        login={() => {}}
        navigate={navigate}
        Logout={() => {}}
      />
      <MainNav />
      <div style={{ display: "flex" }}>
        <div style={{ flex: 2 }}>
          <ProfileContainer>
            {successMessage && (
              <div
                style={{
                  color: "green",
                  marginBottom: "10px",
                  fontSize: 15,
                  fontWeight: "400",
                }}
              >
                <i>{successMessage}</i>
              </div>
            )}
            <ProfileTitle>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>About {profile.username}</div>
                {!isEditing && (
                  <div style={{ flex: 1, display: "flex", width: "90%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flex: 1,
                        width: "50%",
                      }}
                    >
                      <a
                        style={{ cursor: "pointer" }}
                        href={`${profile.linkedin}`}
                      >
                        <FaLinkedinIn size={16} style={{ marginRight: 10 }} />
                      </a>

                      <a
                        style={{ cursor: "pointer" }}
                        href={`${profile.facebook}`}
                      >
                        <FaFacebookF size={15} style={{ marginRight: 10 }} />
                      </a>

                      <a
                        style={{ cursor: "pointer" }}
                        href={`${profile.twitter}`}
                      >
                        <FaTwitter size={16} style={{ marginRight: 10 }} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <hr />
            </ProfileTitle>

            <ProfileContent>
              <div>
                <ProfileImage>
                  <img
                    src={
                      profile.profile_image && profile.profile_image !== ""
                        ? profile.profile_image instanceof File
                          ? URL.createObjectURL(profile.profile_image)
                          : `data:image/png;base64,${profile.profile_image}`
                        : UserImage
                    }
                    alt="Profile"
                  />
                </ProfileImage>

                {!isEditing ? (
                  <>
                    <AskButton onClick={handleEditProfile}>
                      Edit Profile
                    </AskButton>
                  </>
                ) : (
                  <AskButton onClick={handleSaveProfile}>Save</AskButton>
                )}
              </div>
              <ProfileDetails>
                <ProfileItem>
                  {isEditing ? (
                    <div>
                      <label style={{ fontSize: 13 }}>Profile Image:</label>
                      <br />
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>Username:</label>
                      <br />
                      <Input
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>Email:</label>
                      <br />
                      <Input
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>City:</label>
                      <br />
                      <Input
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>Country:</label>
                      <br />
                      <Input
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>About:</label>
                      <br />
                      <Input
                        name="about"
                        value={profile.about}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>Gender:</label>
                      <br />
                      <Input
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>LinkedIn:</label>
                      <br />
                      <Input
                        name="linkedin"
                        value={profile.linkedin}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>Twitter:</label>
                      <br />
                      <Input
                        name="twitter"
                        value={profile.twitter}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                      <br />
                      <label style={{ fontSize: 13 }}>Facebook:</label>
                      <br />
                      <Input
                        name="facebook"
                        value={profile.facebook}
                        onChange={handleChange}
                        style={{ marginTop: 0, fontSize: 14 }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", width: "100%" }}>
                      <div style={{ flex: 0.85 }}>
                        <p style={{ fontSize: 17, fontWeight: "600" }}>
                          Joined at:{" "}
                          <span
                            style={{
                              color: "gray",
                              fontSize: 17,
                              fontWeight: "500",
                            }}
                          >
                            {date.toLocaleDateString()}
                          </span>
                        </p>
                        <p style={{ fontSize: 17, fontWeight: "600" }}>
                          Username:{" "}
                          <span
                            style={{
                              color: "gray",
                              fontSize: 17,
                              fontWeight: "500",
                            }}
                          >
                            {profile.username}
                          </span>
                        </p>
                        <p style={{ fontSize: 17, fontWeight: "600" }}>
                          Email:{" "}
                          <span
                            style={{
                              color: "gray",
                              fontSize: 17,
                              fontWeight: "500",
                            }}
                          >
                            {profile.email}
                          </span>
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 17, fontWeight: "600" }}>
                          City:{" "}
                          <span
                            style={{
                              color: "gray",
                              fontSize: 17,
                              fontWeight: "500",
                            }}
                          >
                            {profile.city}
                          </span>
                        </p>
                        <p style={{ fontSize: 17, fontWeight: "600" }}>
                          Country:{" "}
                          <span
                            style={{
                              color: "gray",
                              fontSize: 17,
                              fontWeight: "500",
                            }}
                          >
                            {profile.country}
                          </span>
                        </p>
                        <p style={{ fontSize: 17, fontWeight: "600" }}>
                          Gender:{" "}
                          <span
                            style={{
                              color: "gray",
                              fontSize: 17,
                              fontWeight: "500",
                            }}
                          >
                            {profile.gender}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </ProfileItem>
              </ProfileDetails>
            </ProfileContent>
            {!isEditing && (
              <div
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  marginBottom: "10px",
                  marginTop: "20px"
                }}
              >
                About:{" "}
                <span style={{ fontWeight: "500", color: "gray" }}>
                  <i>{profile.about}</i>
                </span>
              </div>
            )}
            <div>
              <QuestionButton
                style={{ marginRight: 20 }}
                onClick={() => navigate("/question")}
              >
                Questions Asked
              </QuestionButton>
              <QuestionButton
                style={{ marginRight: 20 }}
                onClick={() => navigate("/answer")}
              >
                Questions Answered
              </QuestionButton>
              <QuestionButton onClick={() => navigate("/saved")}>
                Saved Questions
              </QuestionButton>
            </div>
          </ProfileContainer>
        </div>
        <div style={{ flex: 1 }}>
          <Side />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import MainNav from "../components/MainNav";
import Side from "../Side";
import { lineSpinner } from "ldrs";
import FeedbackForm from "../components/Feedback";

lineSpinner.register();

function FeedbackPage() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

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
          <FeedbackForm />
        </div>

        <div style={{ flex: 1 }}>
          <Side />
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage;

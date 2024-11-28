import React, { useState } from "react";
import MainNav from "../components/MainNav";
import TopBar from "../components/TopBar";
import styled from "styled-components";
import Side from "../Side";
import useAuth from "../hooks/useAuth";
import AutoComplete from "../components/AutoComplete";
import "../App.css";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 10px;
  width: 95%;
  background-color: white;
  color: #333;
  border-radius: 2px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 50px auto;
  margin-top: 30px;
`;

const CardTitle = styled.div`
  display: flex;
  padding: 10px;
  color: #131d52;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 22px;
  font-weight: 500;
  justify-content: flex-start;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  margin: 10px 0;
  border: 0.5px solid #ddd;
  border-radius: 4px;
  color: #131d52;

  &:focus {
    border-color: #131d52;
    transition: border-color 0.2s ease-in-out;
  }
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

const Select = styled.select`
  width: 100%;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  margin: 10px 0;
  border: 0.5px solid #ddd;
  border-radius: 4px;
  color: #131d52;

  &:focus {
    border-color: #131d52;
    transition: border-color 0.2s ease-in-out;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.03);
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
  height: 40px;
  font-size: 14px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

  &:hover {
    background-color: #343a40;
    transition: background-color 0.2s ease-in;
  }
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

function AskQuestion() {
  const [showProfile, setShowProfile] = useState(false);
  const { auth } = useAuth();
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", auth.user_id);
    formData.append("question_title", e.target.title.value);
    formData.append("tags", e.target.tags.value);
    formData.append("question_type", e.target.questionType.value);
    formData.append("details", e.target.details.value);

    if (file) {
      formData.append("image_file", file);
    } else {
      formData.append("image_file", "");
    }
for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await fetch("http://localhost:8080/addquestion", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      setAlert({ message: "Question submitted successfully!", type: "success" });

      e.target.reset();
      setFile(null);
    } catch (error) {
      console.error("Error submitting the form:", error);

      setAlert({ message: "Error submitting the form.", type: "error" });
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", width: '100%' }}>
      <TopBar
        isLoggedIn={true}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        loginAreaHeight="0px"
        profile={() => {}}
        login={() => {}}
        navigate={() => {}}
        Logout={() => {}}
        username={auth.username}
      />
      <MainNav />
      <div style={{ display: "flex", justifyContent: "flex-end"}}>
        <div style={{ flex: 2, display: 'flex', justifyContent:'flex-end' }}>
          <div style={{width: '100%'}}>
          <CardContainer>
            {alert && <Alert type={alert.type}>{alert.message}</Alert>}
            <CardTitle>Ask Question</CardTitle>
            <hr style={{ marginTop: 0, color: "gray" }} />
            <form onSubmit={handleSubmit} style={{marginBottom: '10px'}}>
              <div style={{ display: "flex" }}>
                <Label htmlFor="title" style={{ marginBottom: 30 }}>
                  Question Title <span style={{ color: "red", marginLeft: 2 }}>*</span>
                </Label>
                <div style={{ display: "flex", flexDirection: "column", flex: 5 }}>
                  <Input type="text" id="title" required />
                  <p style={{ fontSize: 11 }}>
                    Please choose an appropriate title for the question to answer it even easier.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <Label htmlFor="questionType" style={{ marginBottom: 30 }}>
                  Question Type<span style={{ color: "red", marginLeft: 2 }}>*</span>
                </Label>
                <div style={{ display: "flex", flexDirection: "column", flex: 5 }}>
                  <Select defaultValue={"Select a Question Type"} id="questionType" required>
                    <option value="Select a Question Type">Select a Question Type</option>
                    <option value="Question">Question</option>
                    <option value="Poll">Poll</option>
                  </Select>
                  <p style={{ fontSize: 11 }}>
                    Please choose the appropriate category so others can easily search your question.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <Label htmlFor="tags" style={{ marginBottom: 30 }}>
                  Tags
                </Label>
                <div style={{ display: "flex", flexDirection: "column", flex: 5 }}>
                  <AutoComplete />
                  <p style={{ fontSize: 11 }}>
                    Please choose suitable keywords. Ex:{" "}
                    <span style={{ color: "#BCBEBF" }}>question, poll</span>.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Label htmlFor="details" style={{ marginTop: 15 }}>
                  Details <span style={{ color: "red", marginLeft: 2 }}>*</span>
                </Label>
                <div style={{ display: "flex", flex: 5 }}>
                  <Textarea id="details" required />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: 'flex-start', marginTop: 10 }}>
                <Label htmlFor="photo">Upload Photo</Label>
                <div style={{ display: "flex", justifyContent: 'flex-start', flex: 3.85 }}>
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

              <AskButton type="submit">Ask Question</AskButton>
            </form>
          </CardContainer>
          </div>
        </div>
        <div style={{ flex: 0.75 }}>
        <Side  />
        </div>
      </div>
    </div>
  );
}

export default AskQuestion;

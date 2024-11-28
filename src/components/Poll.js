import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const Poll = ({ question, questionId }) => {
  const [options, setOptions] = useState([
    { id: 1, text: "Yes", votes: 0 },
    { id: 2, text: "No", votes: 0 },
  ]);
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const [answeredValue, setAnsweredValue] = useState(null);

  useEffect(() => {
    const fetchPollData = async () => {
      console.log(`Fetching poll data for user_id: ${auth.user_id}, question_id: ${questionId}`);
      try {
        const response = await fetch(`http://localhost:8080/poll_question?user_id=${auth.user_id}&question_id=${questionId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('Fetched data:', data);
        setOptions([
          { id: 1, text: "Yes", votes: data.yes },
          { id: 2, text: "No", votes: data.no },
        ]);

        if (data.answered) {
          setAnsweredValue(data.answered);
          setVoted(true);
          // Set selected option based on the answered value
          setSelectedOption(data.answered === "Yes" ? 1 : 2);
        }
      } catch (e) {
        console.error('Fetch error:', e);
        setError("An error occurred while fetching poll data: " + e.message);
      }
    };

    fetchPollData();
  }, [auth.user_id, questionId]);

  const handleVote = async () => {
    window.location.reload();
    if (selectedOption === null) return;
    try {
      const updatedOptions = options.map((option) =>
        option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option
      );
      setOptions(updatedOptions);
      setVoted(true);

      const answerText = selectedOption === 1 ? "Yes" : "No";

      const voteData = {
        poll_id: questionId,
        vote: selectedOption === 1 ? "yes" : "no",
      };
      const response = await fetch(`http://localhost:8080/add_poll?user_id=${auth.user_id}&question_id=${questionId}&answer_text=${answerText}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteData),
      });
      if (!response.ok) throw new Error("Failed to submit vote");

    } catch (e) {
      console.error(e);
      setError("An error occurred while submitting your vote");
    }
  };



  return (
    <div style={styles.pollContainer}>
      <h2 style={styles.heading}>{question}</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {!voted ? (
        <>
          <div style={styles.optionContainer}>
            {options.map((option) => (
              <div key={option.id} style={styles.option}>
                <label>
                  <input
                    type="radio"
                    name="poll"
                    value={option.id}
                    checked={selectedOption === option.id} 
                    onChange={() => setSelectedOption(option.id)}
                    style={styles.radioInput}
                  />
                  <span style={styles.optionText}>{option.text}</span>
                </label>
              </div>
            ))}
          </div>
          <button onClick={handleVote} style={styles.voteButton} disabled={selectedOption === null}>
            Vote
          </button>
        </>
      ) : (
        <>
          <div>
            <p>Your current answer: <i>{answeredValue}</i></p>
          </div>
          <div style={styles.optionContainer}>
            {options.map((option) => (
              <div key={option.id} style={styles.option}>
                <label>
                  <input
                    type="radio"
                    name="poll"
                    value={option.id}
                    checked={selectedOption === option.id} 
                    onChange={() => setSelectedOption(option.id)}
                    style={styles.radioInput}
                  />
                  <span style={styles.optionText}>{option.text}</span>
                </label>
              </div>
            ))}
          </div>
          <button onClick={handleVote} style={styles.voteButton} disabled={selectedOption === null}>
            Change Vote
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  pollContainer: {
    marginTop: "10px",
    width: "100%",
  },
  heading: {
    color: "#131d52",
    marginBottom: "20px",
    fontSize: 18,
    fontWeight: "600",
  },
  optionContainer: {
    marginBottom: "20px",
  },
  option: {
    marginBottom: "10px",
  },
  optionText: {
    fontSize: "16px",
    color: "#131d52",
    marginLeft: "8px",
  },
  radioInput: {
    marginRight: "10px",
  },
  voteButton: {
    display: "block",
    width: "50%",
    padding: "10px",
    backgroundColor: "#131d52",
    color: "#fff",
    border: "none",
    marginTop: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  resultHeading: {
    color: "#131d52",
    textAlign: "center",
  },
  resultBarContainer: {},
  resultText: {
    color: "#131d52",
    fontWeight: "bold",
  },
  resultBarWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "5px",
  },
  resultBar: {
    height: "12px",
    backgroundColor: "#131d52",
    borderRadius: "5px",
    transition: "width 0.5s",
    flex: 1,
  },
  percentageText: {
    fontSize: "14px",
    color: "#131d52",
  },
};

export default Poll;

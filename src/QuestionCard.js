import React from 'react';
import './QuestionCard.css';
import styled from "styled-components";
import { AiFillQuestionCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import QuestionLikeButton from './components/QuestionLikeButton';
import SaveButton from './components/Saved';

const AskButton = styled.button`
  width: 30%;
  padding: 10px;
  margin-right: 10px;
  background-color: #131e56;
  color: white;
  border: none;
  cursor: pointer;
  height: 40px;
  font-size: 12px;

  &:hover {
    background-color: #98c4e3;
    color: #333;
    transition: background-color 0.2s ease-in;
  }
  
  @media (max-width: 800px) {
    font-size: 11px;
  }
`

const QuestionButton = styled.div`
  width: 10%;
  margin-right: 10px;
  display: flex;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  height: 20px;
  background-color: #131e56;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
`

const QuestionTitle = styled.p`
  &:hover{
    color: #131e56;
    cursor: pointer;
  }
`
const QuestionCard = ({ questions }) => {

  const navigate = useNavigate();
  
  return(
  <div style={{flex:1}}>
    {questions.map((question, index) => (
      <div className="question-card" style={{ padding: 20, paddingBottom: 5, flexDirection: 'column' }}>
      <div className="question-content">
        <div style={{ display:'flex', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignContent: 'center'}}>
            <div style={{borderRadius:'50%', height:30, width:30, backgroundColor:'lightgray', overflow:'hidden'}}>
            <img src={`data:image/png;base64,${question.profile_image}`} alt="profile-photo" style={{height:30, width:30}} />
          </div>
          <p style={{ fontSize: 16, fontWeight: '350', marginLeft:5 }}>{question.username}</p>
          </div>
          <QuestionButton><AiFillQuestionCircle style={{marginRight:2}}/>Question</QuestionButton>
        </div>
        <QuestionTitle style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }} onClick={()=>navigate('/addanswer',{ state: { questionId: question.question_id }})}>{question.question}</QuestionTitle>
        <p style={{ fontSize: 14 }}>{question.discription}</p>
      </div>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <AskButton>Add Answer to the Question</AskButton>
        <div style={{ display: 'flex', marginTop: 8, marginRight: 10 }}>
          <QuestionLikeButton question={question}/>
          <SaveButton question={question}/>
        </div>
      </div>
    </div>
    ))}
  </div>
  )
};

export default QuestionCard;

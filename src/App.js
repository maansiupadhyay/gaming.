import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import RequireAuth from "./components/RequireAuth";
import ProfilePage from "./Pages/ProfilePage";
import QuestionPage from "./Pages/QuestionPage";
import AnswerPage from "./Pages/AnswersPage";
import AskQuestion from "./Pages/AskQuestion";
import AddAnswerPage from "./Pages/AddAnswer";
import SearchPage from "./Pages/SearchPage";
import SavedPage from "./Pages/SavedPage";
import MostAnswered from "./Pages/MostAnswered";
import NoAnswered from "./Pages/NoAnwered";
import RecentQuestion from "./Pages/RecentQuestion";
import AppFooter from "./components/AppFooter";
import ScrollToTop from "./components/ScrollToTop";
import FeedbackPage from "./Pages/Feedback";
import ContactPage from "./Pages/ContactUs";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/question" element={<QuestionPage />} />
          <Route path="/answer" element={<AnswerPage />} />
          <Route path="/askquestion" element={<AskQuestion />} />
          <Route path="/addanswer" element={<AddAnswerPage />} />
          <Route path="/savedquestion" element={<SavedPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mostanswered" element={<MostAnswered />} />
          <Route path="/noanswered" element={<NoAnswered />} />
          <Route path="/recentquestion" element={<RecentQuestion />} />
          <Route path="/saved" element={<SavedPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/feedback" element={<FeedbackPage/>} />
          <Route path="*" />
        </Route>
      </Routes>
      <AppFooter/>
    </Router>
  );
}

export default App;

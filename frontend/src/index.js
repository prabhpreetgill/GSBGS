import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Enroll from "./Components/Enroll/Enroll";
import Term from "./Components/Term/Term";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InTerm from "./Components/Inside Term/InTerm";
import School from "./Components/School/School";
import Attendance from "./Components/Attendance/Attendance";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<App />}></Route>
        <Route path="/enroll" element={<Enroll />}></Route>
        <Route path="/attendance" element={<Attendance />}></Route>
        <Route path="/term" element={<Term />}></Route>
        <Route path="/term/:termId" element={<InTerm />}></Route>
        <Route path="/school" element={<School />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

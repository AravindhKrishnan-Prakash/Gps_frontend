import React, { useState, useEffect } from "react";
import "./Staff.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Staff = () => {
  const [batch, setBatch] = useState("");
  const [classroom, setClassroom] = useState("");
  const [subject, setSubject] = useState("");
  const [staffName, setStaffName] = useState(""); // This will come from the logged-in user
  const [generatedCode, setGeneratedCode] = useState("");

  const batchlist = ["BECSE26G1", "BECSE26G2", "BECSE26AIML"];
  const classroomlist = ["GRDLAB", "PROGRAMMINGLAB1", "PROGRAMMINGLAB2", "HARDWARELAB"];
  const subjectlist = ["19z501", "19z502", "19z503", "19z504", "19z505", "19O001", "19z511", "19z512"];

  useEffect(() => {
    const loggedInUsername = localStorage.getItem('username'); // Get the username from localStorage
    if (loggedInUsername) {
      setStaffName(loggedInUsername); // Set the username as staff name
    }
  }, []);


  const batchlistHandler = (event) => setBatch(event.target.value);
  const classroomlistHandler = (event) => setClassroom(event.target.value);
  const subjectlistHandler = (event) => setSubject(event.target.value);

  const generateRandomCode = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const handleGenerateCode = (event) => {
    event.preventDefault();
    const code = generateRandomCode(10);
    setGeneratedCode(code);
    window.alert(`Generated Code: ${code}`);
  };

  const handleRecord = async (event) => {
    event.preventDefault();
    
    const formData = {
        staff_name: staffName,
        subject: subject,
        date: new Date().toISOString().slice(0, 10), // Current date
        batch: batch
    };

    try {
        const response = await axios.post("https://gps-backend-2.onrender.com/api/attendance/record/", formData);
        console.log("Response:", response.data);
        window.alert("Attendance recorded successfully!");
    } catch (error) {
        console.error("Error recording attendance:", error);
        window.alert("Error recording attendance!");
    }
  };

  const handleSendMsg = async (event) => {
    event.preventDefault();

    let errorMessage = "";
    if (!batch) errorMessage += "Student Batch is required.\n";
    if (!classroom) errorMessage += "Classroom is required.\n";
    if (!subject) errorMessage += "Subject is required.\n";
    if (!generatedCode) errorMessage += "Generated Code is required.\n";

    if (errorMessage) {
      window.alert(errorMessage.trim());
      return;
    }

    const formData = {
      staff_name: staffName,
      batch,
      classroom,
      subject,
      generated_code: generatedCode
    };

    try {
      const response = await axios.post("https://gps-backend-2.onrender.com/api/staff/", formData);
      console.log("Response:", response.data);
      window.alert("Message Successfully Sent!");
    } catch (error) {
      console.error("Error sending data:", error);
      window.alert("Error submitting form data!");
    }
  };

  return (
    <div className="staff-container">
      <h1 className="staff-title">Staff Dashboard</h1>
      <form className="staff-form">
        {/* Staff name is no longer a selectable option */}
        <div className="form-group">
          <label htmlFor="staffName">Staff Name: {staffName}</label>
        </div>
        <div className="form-group">
          <label htmlFor="batch">Student Batch</label>
          <select name="batch" value={batch} onChange={batchlistHandler} required>
            <option value="" disabled>Select Batch</option>
            {batchlist.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="classroom">Class Room</label>
          <select name="classroom" value={classroom} onChange={classroomlistHandler} required>
            <option value="" disabled>Select Classroom</option>
            {classroomlist.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject Code</label>
          <select name="subject" value={subject} onChange={subjectlistHandler} required>
            <option value="" disabled>Select Subject</option>
            {subjectlist.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
       
        <button onClick={handleGenerateCode} className="btn-generate">Generate Code</button>
        {generatedCode && <p className="generated-code">Generated Code: {generatedCode}</p>}
        <button onClick={handleSendMsg} className="btn-send">Send Message</button>
        <button onClick={handleRecord} className="btn-modify">Record Attendance</button>
        
        <Link to="/staff/record">
          <button className="btn-view-attendance">View Attendance Records</button>
        </Link>
      </form>
    </div>
  );
};

export default Staff;

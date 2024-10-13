import React, { useState, useEffect } from 'react';
import './Student.css';
import axios from 'axios';

const StudentForm = () => {
  const subjectCodes = [
    "19z501", "19z502", "19z503", "19z504", "19z505", "19O001", "19z511", "19z512",
  ];

  const staffNames = [
    "ABIRAMI S K", "ADLENE ANUSHA J", "AMSA SREE GAYATHRI D", "ANISHA C D", "ANUSHA T",
    "ARUL ANAND N", "ARUL JOTHI S", "ARUNKUMAR BALAKRISHNAN", "GOPIKA RANI N", "ILANGO KRISHNAMURTHI",
    "INDUMATHI D", "JAYASHREE L S", "KARPAGAM G R", "KAVITHA C", "LOVELYN ROSE S", "NAVINA N",
    "PRAKASH J", "PRIYA G", "RAMESH A C", "SANTHI V", "SARAN KIRTHIC R", "SARANYA K G",
    "SATHIYAPRIYA K", "SIVARANJANI S", "SUDHA SADASIVAM G", "SURIYA S", "THIRUMAHAL R", "VIJAYALAKSHMI S"
  ];

  const batchlist = ["BECSE26G1", "BECSE26G2", "BECSE26AIML"];

  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    batch: '',
    staffName: '',
    subjectCode: '',
    status: '',
    location: { latitude: '0.0', longitude: '0.0' },
    code: ''
  });

  const [isFullScreen, setIsFullScreen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // Timer for 60 seconds
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission
  const [message, setMessage] = useState(''); // Display message
  const [hasExitedFullscreen, setHasExitedFullscreen] = useState(false); // Track exit confirmation

  useEffect(() => {
    const storedRollNumber = localStorage.getItem('rollNumber');
    setFormData((prevData) => ({
      ...prevData,
      rollNumber: storedRollNumber || '',
    }));

    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }

    const handleFullscreenChange = () => {
      const element = document.documentElement;

      // Check if we have exited fullscreen mode
      if (!document.fullscreenElement) {
        const userConfirmation = window.confirm("You have exited fullscreen mode. Do you want to exit?");

        // If user cancels the confirmation dialog
        if (!userConfirmation) {
          // No need to try to re-enter fullscreen, just return
          setIsFullScreen(false);
          setMessage("Exited the fullscreen.");
          return;
        }

        // Try to re-enter fullscreen if the user confirms
        if (element.requestFullscreen) {
          element.requestFullscreen().catch((error) => {
            console.error("Failed to enter fullscreen:", error);
          });
          setMessage("Back to fullscreen mode.");
          setIsFullScreen(true); // Update state to reflect that we're in fullscreen
        }
      } else {
        // Handle the case where we're still in fullscreen, if necessary
        setIsFullScreen(true); // Update state to reflect that we're in fullscreen
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer when time is up
          if (document.exitFullscreen) {
            document.exitFullscreen();
            setMessage("Time's up. Exiting fullscreen mode.");
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isSubmitted, hasExitedFullscreen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
        },
        (error) => {
          setMessage('Unable to retrieve location.');
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (formData.status === 'Present' && (!formData.location.latitude || !formData.location.longitude || !formData.code)) {
      setMessage('Location and code are required if the student is present.');
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/store-student-data/", formData);
      console.log('Response:', response.data);
      setMessage('Attendance Recorded Successfully!');
      setIsSubmitted(true); // Mark form as submitted
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Error recording attendance!');
    }
  };

  const isSubmitEnabled = timeLeft <= 10; // Enable submit button for the last 10 seconds

  return (
    <div className="form-container">
      <h2>Student Attendance Form</h2>
      <div className="timer">Time left: {timeLeft} seconds</div>
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="batch">Batch</label>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Batch</option>
            {batchlist.map((batch, index) => (
              <option key={index} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="staffName">Staff Name</label>
          <select
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Staff Name</option>
            {staffNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subjectCode">Subject Code</label>
          <select
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Subject Code</option>
            {subjectCodes.map((code, index) => (
              <option key={index} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required={formData.status === 'Present'}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <div className="status-options">
            <label>
              <input
                type="radio"
                name="status"
                value="Present"
                onChange={handleChange}
                required
              />
              Present
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="Absent"
                onChange={handleChange}
                required
              />
              Absent
            </label>
          </div>
        </div>
        {formData.status === 'Present' && (
          <div className="form-group">
            <label>Location</label>
            <button type="button" onClick={handleLocation} className="location-btn">
              Get Location
            </button>
            {formData.location.latitude && (
              <p>Latitude: {formData.location.latitude}, Longitude: {formData.location.longitude}</p>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={!isSubmitEnabled || isSubmitted}
          className="submit-btn"
        >
          {isSubmitted ? 'Submitted' : 'Submit'}
        </button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default StudentForm;

// import React, { useState } from 'react';
// import axios from 'axios';
// import './Record.css'; // Create this for styling

// const Record = () => {
//   const [staffName, setStaffName] = useState("");
//   const [subjectCode, setSubjectCode] = useState("");
//   const [date, setDate] = useState("");
//   const [records, setRecords] = useState([]);
//   const [error, setError] = useState("");
//   const [batch,setBatch]=useState("");

//   const handleViewAttendance = async (event) => {
//     event.preventDefault();

//     if (!staffName || !subjectCode || !date) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/attendance/view/", {
//         staff_name: staffName,
//         subject_code: subjectCode,
//         batch:batch,
//         date: date

//       });
//       setRecords(response.data);
//       setError(""); // Clear any previous errors
//     } catch (error) {
//       setError("Error fetching attendance records.");
//       console.error(error);
//     }
//   };
//   const getStatusClass = (status) => {
//     if (status === "Present") return "status-present";
//     if (status === "Doubt") return "status-doubt";
//     return "status-absent"; // Default to "Absent"
//   };
//   const batchlist = ["BECSE26G1", "BECSE26G2", "BECSE26AIML"];
//   const batchlistHandler = (event) => setBatch(event.target.value);

//   return (
//     <div className="record-container">
//       <h1 className="record-title">View Attendance Records</h1>
//       <form className="record-form" onSubmit={handleViewAttendance}>
//         <div className="form-group">
//           <label htmlFor="staffName">Staff Name</label>
//           <input
//             type="text"
//             name="staffName"
//             value={staffName}
//             onChange={(e) => setStaffName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="subjectCode">Subject Code</label>
//           <input
//             type="text"
//             name="subjectCode"
//             value={subjectCode}
//             onChange={(e) => setSubjectCode(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="batch">Student Batch</label>
//           <select name="batch" value={batch} onChange={batchlistHandler} required>
//             <option value="" disabled>Select Batch</option>
//             {batchlist.map((option, index) => (
//               <option key={index} value={option}>{option}</option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="date">Date</label>
//           <input
//             type="date"
//             name="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn-view">View Attendance</button>
//       </form>

//       {error && <p className="error">{error}</p>}

//       {records.length > 0 && (
//         <div className="records-display">
//           <h2>Attendance Records:</h2>
//           <table className="attendance-table">
//             <thead>
//               <tr>
//                 <th>Roll Number</th>
//                 <th>Student Name</th>
//                 <th>Course Code</th>
//                 <th>Code Validation</th>
//                 <th>Location Validation</th>
//                 <th>Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((record, index) => (
//                 <tr key={index}>
//                   <td>{record.roll_number}</td>
//                   <td>{record.student_name}</td>
                 
//                   <td>{record.course_code}</td>
//                   <td>{record.code_validation}</td>
//                   <td>{record.location_validation}</td>
//                   <td>{record.date}</td>
//                   <td className={getStatusClass(record.attendance_status)}>
//                     {record.attendance_status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <br /><br /><br /><br />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Record;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Record.css'; // Create this for styling
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable plugin for tables

const Record = () => {
  const [staffName, setStaffName] = useState(""); // Initially empty
  const [subjectCode, setSubjectCode] = useState("");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [batch, setBatch] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Use useEffect to set the staff name from localStorage
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setStaffName(username);
    }
  }, []);

  const handleViewAttendance = async (event) => {
    event.preventDefault();

    if (!staffName || !subjectCode || !date) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://gps-backend-2.onrender.com/api/attendance/view/", {
        staff_name: staffName,
        subject_code: subjectCode,
        batch: batch,
        date: date
      });
      setRecords(response.data);
      setError("");
    } catch (error) {
      setError("Error fetching attendance records.");
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record.roll_number);
    setUpdatedStatus(record.attendance_status);
  };

  const handleSave = async (rollNumber, courseCode, date) => {
    try {
      await axios.put(`https://gps-backend-2.onrender.com/api/attendance/update/${rollNumber}/`, {
        attendance_status: updatedStatus,
        course_code: courseCode,
        date: date
      });

      const updatedRecords = records.map((record) =>
        record.roll_number === rollNumber ? { ...record, attendance_status: updatedStatus } : record
      );
      setRecords(updatedRecords);
      setEditingRecord(null);
    } catch (error) {
      console.error("Error updating attendance status", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Attendance Record", 10, 10);
    doc.text(`Staff Name: ${staffName}`, 10, 20);
    doc.text(`Subject Code: ${subjectCode}`, 10, 30);
    doc.text(`Batch: ${batch}`, 10, 40);
    doc.text(`Date: ${date}`, 10, 50);

    doc.autoTable({
      head: [['Roll Number', 'Student Name','Course Code', 'Code Validation', 'Location Validation', 'Status']],
      body: records.map(record => [
        record.roll_number,
        record.student_name,
        record.course_code,
        record.code_validation,
        record.location_validation,
        record.attendance_status
      ]),
      startY: 60
    });

    doc.save('attendance_record.pdf');
  };

  const batchlist = ["BECSE26G1", "BECSE26G2", "BECSE26AIML"];
  const batchlistHandler = (event) => setBatch(event.target.value);

  const getStatusClass = (status) => {
    if (status === "Present") return "status-present";
    if (status === "Doubt") return "status-doubt";
    return "status-absent"; // Default to "Absent"
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredRecords = records.filter((record) => {
    if (statusFilter === "All") return true;
    return record.attendance_status === statusFilter;
  });

  return (
    <div className="record-container">
      <h1 className="record-title">View Attendance Records</h1>
      <form className="record-form" onSubmit={handleViewAttendance}>
        <div className="form-group">
          <label htmlFor="staffName">Staff Name</label>
          <input
            type="text"
            name="staffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)} // Not needed but just for consistency
            disabled 
          />
        </div>
        <div className="form-group">
          <label htmlFor="subjectCode">Subject Code</label>
          <input
            type="text"
            name="subjectCode"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
          />
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
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-view">View Attendance</button>
        {records.length > 0 && <button onClick={handleDownloadPDF} className="btn-download">Download as PDF</button>}
      </form>

      {error && <p className="error">{error}</p>}

      {records.length > 0 && (
        <div className="records-display">
          <h2>Attendance Records:</h2>
          <div className="filter-container">
            <label htmlFor="statusFilter">Filter by Status: </label>
            <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Doubt">Doubt</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Course Code</th>
                <th>Code Validation</th>
                <th>Location Validation</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.roll_number}</td>
                  <td>{record.student_name}</td>
                  <td>{record.course_code}</td>
                  <td>{record.code_validation}</td>
                  <td>{record.location_validation}</td>
                  <td>{record.date}</td>
                  <td className={getStatusClass(record.attendance_status)}>
                    {editingRecord === record.roll_number ? (
                      <select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Doubt">Doubt</option>
                        <option value="Absent">Absent</option>
                      </select>
                    ) : (
                      record.attendance_status
                    )}
                  </td>
                  <td>
                    {editingRecord === record.roll_number ? (
                      <button onClick={() => handleSave(record.roll_number, record.course_code, record.date)}>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(record)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Record;

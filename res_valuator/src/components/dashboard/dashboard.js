// import React, { useEffect, useState } from "react";
// const Dashboard = () => {
//     const [data, setData] = useState({
//         jd: "",/*same names as in db*/
//         weights: [],
//         employer: "",
//         password1: "",
//         password2: "",
//       });
//       const handleChange = ({ currentTarget: input }) => {
//         setData({ ...data, [input.name]: input.value });
//       };  
//   return (
//     <div>
//       <h1 style={{color:"white"}}>Dashboard</h1>
//       <input
//        type="text"
//        placeholder="Enter JD"
//        name="jd"
//        value={data.jd}
//        onChange={handleChange} 
//       />
//     </div>
//   )
// }

// export default Dashboard
import React, { useEffect, useState } from 'react';

import './dashboard.css'; // Import the CSS file
import JobDetails from './jobDetails';
import { Link, useNavigate } from 'react-router-dom';
import AddJobModal from './AddJobModal';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const r_id = localStorage.getItem("r_id");
    fetch(`http://127.0.0.1:5001/dashboard/${r_id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        // Process the retrieved data
        console.log(data);
        setJobs(data.data);
        
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occur during the request
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      navigate("/login");
    }
  },[])

  const buttonStyle = {
    '--clr': '#FF44CC'
  };

  return (
    <div className="dashboard-container">
      <h2>Job Dashboard</h2>
      <button className='add-new' onClick={() => setIsOpen(true)} style={buttonStyle}><span>Add New Job</span><i></i></button>
      <div className="card-container">
        {jobs.map((job) => (
            <div className="card" key={job._id} >
              <h3>{job.job_title}</h3>
              <p>Status: {job.status}</p>
              <Link style={{textDecoration:'none', color:'#000'}} to={`/dashboard/${job.jobId}`}>
                <button className='job-det' style={{textDecoration:'none',fontSize:'15px',backgroundColor:'#fff',padding:'10px 30px', borderRadius:'20px', fontStyle:'bold'}}>Job Details</button>
              </Link>
            </div>
          
        ))}
      </div>
      <AddJobModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  );

};

export default Dashboard;

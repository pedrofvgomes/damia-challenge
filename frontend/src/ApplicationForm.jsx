import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ApplicationForm = () => {
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState(null);
    const [submitStatus, setSubmitStatus] = useState('');
    const [position, setPosition] = useState('');

    useEffect(() => {
        const positionId = window.location.pathname.split('/').pop();

        axios.get(`http://localhost:8000/api/positions/${positionId}`)
            .then(response => {
                if (response.status === 200) {
                    setPosition(response.data.position);
                }
            })
            .catch(error => {
                console.error("Error fetching position:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!coverLetter || !resume) {
            alert("Please provide both a cover letter and a resume.");
            return;
        }

        const formData = new FormData();
        formData.append('cover_letter', coverLetter);
        formData.append('resume', resume);
        formData.append('position_id', position.id);

        axios.post('http://localhost:8000/api/apply/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setSubmitStatus("Application submitted successfully.");
                }
            })
            .catch(error => {
                setSubmitStatus("Error submitting application. Please try again.");
                console.error("Error submitting application:", error);
            });
    };

    return (
        <div id="application-form"> 
            <h1>Submit Your Application</h1>
            <span><strong>Position</strong>: {position.name}</span>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        label="Cover Letter"
                        multiline
                        fullWidth
                        rows={6}
                        variant="outlined"
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        placeholder="Enter your cover letter here"
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="resume" style={{ marginBottom: '10px', display: 'block' }}>Upload Resume (PDF):</label>
                    <input
                        type="file"
                        accept=".pdf"
                        id="resume"
                        onChange={e => setResume(e.target.files[0])}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '10px' }}
                >
                    Submit Application
                </Button>

                {submitStatus && <p style={{ marginTop: '20px', color: submitStatus.includes('Error') ? 'red' : 'green' }}>{submitStatus}</p>}
            </form>
        </div>
    );
}

export default ApplicationForm;

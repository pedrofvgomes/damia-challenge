import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const statuses = [
    ['received', 'Received'],
    ['under_review', 'Under Review'],
    ['initial_interview', 'Initial Interview'],
    ['technical_interview', 'Technical Interview'],
    ['final_interview', 'Final Interview'],
    ['offered', 'Offered'],
    ['accepted', 'Accepted'],
    ['rejected', 'Rejected'],
    ['withdrawn', 'Withdrawn']
];

const Application = () => {
    const placeholder = 'Update the status';
    const [selectedStatus, setSelectedStatus] = useState('');

    const [application, setApplication] = useState({});

    useEffect(() => {
        const applicationId = window.location.pathname.split('/').pop();

        axios.get(`http://localhost:8000/api/applications/${applicationId}`)
            .then(response => {
                if (response.status === 200) {
                    setApplication(response.data.application);
                    // order the statuses by descending timestamp
                    const sortedStatuses = response.data.application.statuses.sort((a, b) => {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });
                    response.data.application.statuses = sortedStatuses;
                    setApplication(response.data.application);

                }
            })
            .catch(error => {
                console.error("Error fetching application:", error);

                window.location.href = '/';
            });
    }, []);

    const renderDetails = () => {
        return (
            <>
                <p><strong>{'Position: '}</strong> {application.position.name}</p>
                <p><strong>{'Candidate: '}</strong> {application.candidate.name}</p>

                <p><strong>History of statuses:</strong></p>
                <div id="statuses">
                    {application.statuses.map(status => {
                        return (
                            <div className='status' style={{ position: 'relative' }}>
                                <strong>{statuses.find(s => s[0] === status.status)[1]}</strong>
                                <br />
                                <span>{new Date(status.timestamp).toLocaleString()}</span>

                                <Button
                                    className="remove-recruiter"
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '20px',
                                        transform: 'translateY(-50%)',
                                        backgroundColor: 'red',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        height: '30px',
                                        width: '30px',
                                        padding: 0,
                                        '&:hover': {
                                            backgroundColor: 'darkred',
                                            color: 'white'
                                        }
                                    }}
                                    onClick={() => {
                                        window.confirm("Are you sure you want to remove this status?") &&

                                            axios.delete(`http://localhost:8000/api/delete-status/${status.id}`)
                                                .then(response => {
                                                    if (response.status === 200) {
                                                        window.location.reload();
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error("Error removing status:", error);
                                                });
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </Button>
                            </div>
                        )
                    })}
                </div>

                <select
                    value={selectedStatus}
                    onChange={e => {
                        setSelectedStatus(e.target.value);

                        window.confirm("Are you sure you want to update the status?") &&

                            axios.post('http://localhost:8000/api/add-status/', {
                                status: e.target.value,
                                candidate_id: application.candidate.id,
                                position_id: application.position.id
                            })
                                .then(response => {
                                    if (response.status === 200) {
                                        window.location.reload();
                                    }
                                })
                                .catch(error => {
                                    console.error("Error updating status:", error);
                                });
                    }}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {statuses.map((option, index) => (
                        <option key={index} value={option[0]}>
                            {option[1]}
                        </option>
                    ))}
                </select>

                {application.cover_letter && <>
                    <p><strong>Cover letter:</strong></p>
                    <p id="cover-letter">{application.cover_letter}</p>
                </>}
                {application.resume && <>
                    <p><strong>Resume:</strong></p>
                    <a href='' onClick={(e) => {
                        e.preventDefault();
                        window.open(`http://localhost:8000${application.resume}`, '_blank');
                    }} target="_blank" rel="noreferrer">View resume</a>
                </>}
            </>
        )
    }

    return (
        <>
            <h1 style={{ marginBottom: '30px', alignSelf: 'center' }}>Application details</h1>
            <div id="application-details">
                {Object.keys(application).length > 0 && renderDetails()}
            </div>
        </>
    );
}

export default Application;
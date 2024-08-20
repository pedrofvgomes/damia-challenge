import React, { useEffect, useState } from "react";
import axios from "axios";
import InviteRecruiter from "./InviteRecruiter";
import { Button, IconButton } from "@mui/material";

const Recruiters = () => {
    const headers = [
        'Name',
        'Email'
    ];

    // name of the header by which the table is sorted
    const [selectedOrder, setSelectedOrder] = useState('Name');
    // direction of the sort
    const [direction, setDirection] = useState('asc');

    // recruiters to be displayed in a list
    const [recruiters, setRecruiters] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/recruiters')
            .then(response => {
                if (response.status === 200) {
                    setRecruiters(response.data.recruiters);
                }
            })
            .catch(error => {
                console.error("Error fetching recruiters:", error);
            });
    }, []);

    useEffect(() => {
        let sortedRecruiters = [...recruiters];

        sortedRecruiters.sort((a, b) => {
            // Determine the field to sort by based on selectedOrder
            let fieldA, fieldB;

            switch (selectedOrder) {
                case 'Name':
                    fieldA = a.name.toLowerCase();
                    fieldB = b.name.toLowerCase();
                    break;
                case 'Email':
                    fieldA = a.email.toLowerCase();
                    fieldB = b.email.toLowerCase();
                    break;
                default:
                    return 0;
            }

            // Perform the sorting based on direction
            if (direction === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
        });

        setRecruiters(sortedRecruiters);
    }, [direction, selectedOrder]);

    const drawHeader = () => {
        return (
            <div id='headers' className="recruiter">
                {headers.map((header, index) => {
                    return (
                        <span
                            key={index}
                            onClick={() => {
                                if (selectedOrder === header)
                                    setDirection(direction === 'asc' ? 'desc' : 'asc');
                                else {
                                    setSelectedOrder(header);
                                    setDirection('asc');
                                }
                            }}
                            style={{
                                backgroundColor: selectedOrder === header ? '#73d0b9' : 'white',
                                color: selectedOrder === header ? 'white' : '#73d0b9',
                                cursor: 'pointer'
                            }}
                        >
                            {header}

                            <span>
                                {selectedOrder === header ? (direction === 'desc' ? '▲' : '▼') : ''}
                            </span>
                        </span>
                    );
                })}
            </div>
        );
    };

    const drawRecruiters = () => {
        return (
            <div id="recruiters-list">
                {recruiters.map(recruiter => {
                    return (
                        <div
                            key={recruiter.id}
                            className='recruiter'
                            style={{ position: 'relative' }}
                        >
                            <span>{recruiter.name}</span>
                            <span>{recruiter.email}</span>
                            <Button
                                className="remove-recruiter"
                                sx={{
                                    position: 'absolute',
                                    right: '20px',
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
                                    axios.post('http://localhost:8000/api/remove-recruiter/', {
                                        recruiter_id: recruiter.id
                                    })
                                        .then(response => {
                                            if (response.status === 200) {
                                                window.location.reload();
                                            }
                                        })
                                        .catch(error => {
                                            console.error("Error removing recruiter:", error);
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
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div style={{ position: 'relative' }}>
                <div>
                    {drawHeader()}
                    {drawRecruiters()}
                </div>
                <InviteRecruiter />
            </div>
        </>
    );
}

export default Recruiters;

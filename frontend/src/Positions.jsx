import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "@mui/material";

const Positions = () => {
    const headers = [
        'Name',
        'Location',
        'Date Posted',
        'Number of Applicants'
    ]

    // name of the header by which the table is sorted
    const [selectedOrder, setSelectedOrder] = useState('Name');
    // direction of the sort
    const [direction, setDirection] = useState('asc');

    // positions to be displayed in a list
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/positions')
            .then(response => {
                if (response.status === 200) {
                    setPositions(response.data.positions);
                }
            })
    }, []);

    useEffect(() => {
        let sortedPositions = [...positions];

        sortedPositions.sort((a, b) => {
            // Determine the field to sort by based on selectedOrder
            let fieldA, fieldB;

            switch (selectedOrder) {
                case 'Name':
                    fieldA = a.name.toLowerCase();
                    fieldB = b.name.toLowerCase();
                    break;
                case 'Location':
                    fieldA = a.location.toLowerCase();
                    fieldB = b.location.toLowerCase();
                    break;
                case 'Date Posted':
                    fieldA = new Date(a.datePosted);
                    fieldB = new Date(b.datePosted);
                    break;
                case 'Number of Applicants':
                    fieldA = a.numberOfApplicants;
                    fieldB = b.numberOfApplicants;
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

        setPositions(sortedPositions);
    }, [direction, selectedOrder]);

    const drawHeader = () => {
        return (
            <div id='headers'>
                {headers.map((header, index) => {
                    return (
                        <span
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
                                color: selectedOrder === header ? 'white' : '#73d0b9'
                            }}
                        >
                            {header}

                            <span>
                                {selectedOrder === header ? (direction === 'desc' ? '▲' : '▼') : ''}
                            </span>
                        </span>
                    )
                })}
            </div>
        )
    }

    const drawPositions = () => {

        return (
            <div id="positions-list">
                {positions.map(position => {
                    return (
                        <div
                            className='position'
                            onClick={() => {
                                axios.get(`http://localhost:8000/api/positions/${position.id}`)
                                    .then(response => {
                                        if (response.status === 200) {
                                            console.log(response.data.position);
                                            setOpenPosition(response.data.position);
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Error fetching position:", error);
                                    })
                                    .finally(() => {
                                        setModalOpen(true);
                                    });
                            }}
                        >
                            <span>{position.name}</span>
                            <span>{position.location}</span>
                            <span>{position.datePosted.split('T')[0].split('-').reverse().join('/')}</span>
                            <span>{position.numberOfApplicants}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [openPosition, setOpenPosition] = useState({});

    const drawPositionModal = () => {
        if (Object.keys(openPosition).length === 0) return null;
        else return (
            <>
                <h1>{openPosition.name}</h1>
                <div>
                    <p id="description">
                        {openPosition.description}
                    </p>
                    <div id="details">
                        <span><strong>Company</strong> <br />{openPosition.client.name} <br /> {openPosition.client.email}</span>
                        <span><strong>Recruiter</strong> <br />{openPosition.recruiter.name} <br /> {openPosition.recruiter.email}</span>
                        <span><strong>Salary</strong> <br />{openPosition.salary}</span>
                        <strong>Applicants</strong>
                        <div id="applicants">
                            {openPosition.candidates.map(applicant => {
                                return (
                                    <div>
                                        <span>{applicant.name}</span>
                                        <br />
                                        <span>{applicant.email}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Button
                    id="delete-position"
                    onClick={() => {
                        window.confirm("Are you sure you want to delete this position?") &&

                        axios.delete(`http://localhost:8000/api/delete-position/${openPosition.id}`)
                            .then(response => {
                                if (response.status === 200) {
                                    window.location.reload();
                                }
                            })
                            .catch(error => {
                                console.error("Error deleting position:", error);
                            })
                            .finally(() => {
                                setModalOpen(false);
                                setOpenPosition({});
                            });
                    }}
                >
                    Delete
                </Button>
            </>
        )
    }

    return (
        <div>
            <div>
                {drawHeader()}
                {drawPositions()}
            </div>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setOpenPosition({});
                }}
            >
                <div id="position">
                    {drawPositionModal()}
                </div>
            </Modal>

        </div>
    );
};

export default Positions;
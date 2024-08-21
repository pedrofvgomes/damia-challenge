import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "@mui/material";

const MyApplications = () => {
    const headers = [
        'Position Name',
        'Status',
        'Last Status Update'
    ];

    // name of the header by which the table is sorted
    const [selectedOrder, setSelectedOrder] = useState('Position Name');
    // direction of the sort
    const [direction, setDirection] = useState('asc');

    // applications to be displayed in a list
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/my-applications')
            .then(response => {
                if (response.status === 200) {
                    setApplications(response.data.applications);
                }
            })
            .catch(error => {
                console.error("Error fetching applications:", error);
            });
    }, []);

    useEffect(() => {
        let sortedApplications = [...applications];

        sortedApplications.sort((a, b) => {
            // Determine the field to sort by based on selectedOrder
            let fieldA, fieldB;

            switch (selectedOrder) {
                case 'Position Name':
                    fieldA = a.position.name.toLowerCase();
                    fieldB = b.position.name.toLowerCase();
                    break;
                case 'Status':
                    fieldA = a.status.toLowerCase();
                    fieldB = b.status.toLowerCase();
                    break;
                case 'Last Status Update':
                    fieldA = new Date(a.lastStatusUpdate);
                    fieldB = new Date(b.lastStatusUpdate);
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

        setApplications(sortedApplications);
    }, [direction, selectedOrder]);

    const drawHeader = () => {
        return (
            <div id='headers' className="applications">
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
                                color: selectedOrder === header ? 'white' : '#73d0b9'
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

    const [modalOpen, setModalOpen] = useState(false);
    const [openApplication, setOpenApplication] = useState({});

    const drawApplicationModal = () => {
        if (Object.keys(openApplication).length === 0) return null;
        return (
            <>
                <h1>{openApplication.position.name}</h1>
                <div>
                    <p id="description">
                        {openApplication.position.description}
                    </p>
                    <div id="details">
                        <span><strong>Company</strong> <br />{openApplication.position.client.name} <br /> {openApplication.position.client.email}</span>
                        <span><strong>Recruiter</strong> <br />{openApplication.position.recruiter.name} <br /> {openApplication.position.recruiter.email}</span>
                        <span><strong>Salary</strong> <br />{openApplication.position.salary}</span>
                        <span><strong>Location</strong> <br />{openApplication.position.location}</span>
                        <span><strong>Date Posted</strong> <br />{openApplication.position.datePosted.split('T')[0].split('-').reverse().join('/')}</span>
                        <span><strong>Number of Applicants</strong> <br />{openApplication.position.numberOfApplicants}</span>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            <div>
                {drawHeader()}
                <div id="applications-list">
                    {applications.map(application => {
                        return (
                            <div
                                key={application.id}
                                className='application'
                                onClick={() => {
                                    setOpenApplication(application);
                                    setModalOpen(true);
                                }}
                            >
                                <span>{application.position.name}</span>
                                <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                                <span>{new Date(application.lastStatusUpdate).toLocaleDateString()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setOpenApplication({});
                }}
            >
                <div id="position">
                    {drawApplicationModal()}
                </div>
            </Modal>
        </div>
    );
};

export default MyApplications;

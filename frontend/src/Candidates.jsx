import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "axios";

const Candidates = observer(() => {
    const headers = [
        'Name',
        'Position',
        'Status',
        'Last Status Update'
    ];

    // name of the header by which the table is sorted
    const [selectedOrder, setSelectedOrder] = useState('Name');
    // direction of the sort
    const [direction, setDirection] = useState('asc');

    // candidates to be displayed in a list
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/candidates')
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.candidates);
                    setCandidates(response.data.candidates);
                }
            })
            .catch(error => {
                console.error("Error fetching candidates:", error);
            });
    }, []);

    useEffect(() => {
        let sortedCandidates = [...candidates];

        sortedCandidates.sort((a, b) => {
            // Determine the field to sort by based on selectedOrder
            let fieldA, fieldB;

            switch (selectedOrder) {
                case 'Name':
                    fieldA = a.name.toLowerCase();
                    fieldB = b.name.toLowerCase();
                    break;
                case 'Position':
                    fieldA = a.position.toLowerCase();
                    fieldB = b.position.toLowerCase();
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

        setCandidates(sortedCandidates);
    }, [direction, selectedOrder]);

    const drawHeader = () => {
        return (
            <div id='headers'>
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

    const drawCandidates = () => {
        return (
            <div id="candidates-list">
                {candidates.map(candidate => {
                    return (
                        <div
                            key={candidate.id}
                            className='candidate'
                        >
                            <span>{candidate.name}</span>
                            <span>{candidate.position}</span>
                            <span>{candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}</span>
                            <span>{new Date(candidate.lastStatusUpdate).toLocaleDateString()}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <div>
                {drawHeader()}
                {drawCandidates()}
            </div>
        </div>
    );
});

export default Candidates;

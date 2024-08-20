import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "axios";

const Positions = observer(() => {
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
    const [positions, setPositions] = useState([
        {
            id: 1,
            name: 'Software Engineer',
            location: 'San Francisco, CA',
            datePosted: '10/10/2021',
            numberOfApplicants: 10
        }
    ]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/positions')
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.positions);
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
                        <div className='position'>
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

    return (
        <div>
            <div>
                {drawHeader()}
                {drawPositions()}
            </div>

        </div>
    );
});

export default Positions;
import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/create-position/', {
            name,
            location,
            salary_min: salaryMin,
            salary_max: salaryMax,
            description,
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Position created successfully!');
                    navigate('/positions'); 
                }
            })
            .catch(error => {
                console.error("Error creating position:", error);
                alert('There was an error creating the position.');
            });
    };

    return (
        <div id="create-form">
            <h2 style={{margin: 0}}>Create New Position</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Position Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Salary Min"
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Salary Max"
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <div style={{ marginTop: '20px', alignSelf: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary">
                        Create Position
                    </Button>
                    <Button
                        onClick={() => navigate('/positions')}
                        style={{ marginLeft: '10px', color: 'white', backgroundColor: 'red' }}
                        id="cancel-button"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Create;

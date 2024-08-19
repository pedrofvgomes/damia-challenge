import React from 'react';
import { useNavigate } from 'react-router-dom';
import store from './store';
import { Button } from '@mui/material';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout/', {
                refresh: store.token
            }, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            });
            store.clearAuth(); 
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Button
            variant='contained'
            onClick={() => {}}
        >
            Logout
        </Button>
    )
};

export default Logout;

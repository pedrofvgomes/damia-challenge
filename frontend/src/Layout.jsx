import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import axios from "axios";

const Layout = () => {
    const [user, setUser] = useState({
        username: '',
        name: '',
        email: '',
        user_type: ''
    });

    const navigate = useNavigate();

    let title = window.location.pathname.replace('/', '');
    if (title === '')
        title = 'dashboard';

    const links = [
        'candidates',
        'recruiters',
        'positions',
        'create'
    ]

    const renderLinks = () => {
        return links.map(link => {
            const selected = link === title ? 'selected' : '';

            return <a href={`/${link}`} className={selected}>
                {link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
        })
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/user')
            .then(response => {
                if (response.status === 200) {
                    setUser(response.data.user);
                }
            })
            .catch(error => {
                console.error("Error fetching user:", error);
            });
    }, []);

    return (
        <div id="layout">
            <nav>
                <img
                    src='/logo1.png'
                    alt='logo'
                    onClick={() => navigate('/')}
                />
                {renderLinks()}

                <h3 id="user-info">
                    {user.name && user.user_type && <>
                        {'Logged in as  '} <strong>{user.username} ({user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)})</strong>
                    </>}
                </h3>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/authentication')
                    }}
                >
                    Logout
                </Button>
            </nav>

            <main id={title}>
                <Outlet />
            </main>
        </div >
    )
}

export default Layout
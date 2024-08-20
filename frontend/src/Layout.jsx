import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from "axios";

const Layout = (props) => {
    const [user, setUser] = useState({
        username: '',
        name: '',
        email: '',
        user_type: ''
    });

    const navigate = useNavigate();

    const title = window.location.pathname.replace('/', '') || 'dashboard';

    const accessibleLinks = {
        'recruiter': ['positions', 'candidates', 'create'],
        'candidate': ['positions', 'apply'],
        'client': ['recruiters', 'positions']
    };

    const renderLinks = () => {
        if (!user?.user_type) return null;

        return accessibleLinks[user.user_type].map(link => {
            const selected = link === title ? 'selected' : '';

            return <a key={link} href={`/${link}`} className={selected}>
                {link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
        });
    };

    // Function to check if the user has access to the current page
    const redirectIfInvalidPage = () => {
        const currentPath = window.location.pathname.replace('/', '');

        // Check if user_type exists and if the path is valid for the user type
        if (user.user_type && accessibleLinks[user.user_type]) {
            const validPaths = accessibleLinks[user.user_type];

            // If the current path is not in validPaths, redirect to home
            if (!validPaths.includes(currentPath) && currentPath !== '') {
                navigate('/');
            }
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem('token'))
            navigate('/authentication');

        axios.get('http://localhost:8000/api/user')
            .then(response => {
                if (response.status === 200) {
                    setUser(response.data.user);

                    let redirect = '/';
                    switch (response.data.user.user_type) {
                        case 'recruiter':
                            redirect = '/positions';
                            break;
                        case 'candidate':
                            redirect = '/positions';
                            break;
                        case 'client':
                            redirect = '/recruiters';
                            break;
                        default:
                            break;
                    }

                    props.setWhereToRedirect(redirect);

                }
            })
            .catch(error => {
                console.error("Error fetching user:", error);
            });
    }, []);

    useEffect(() => {
        // Check for valid page access after user data is loaded
        if (user.user_type) {
            redirectIfInvalidPage();
        }
    }, [user]);

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
                        sessionStorage.removeItem('token');
                        navigate('/authentication');
                    }}
                >
                    Logout
                </Button>
            </nav>

            <main id={title}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;

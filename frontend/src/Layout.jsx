import React, { useEffect } from "react"
import { Outlet, useNavigate } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import { Button } from '@mui/material'
import store from './store'
import { observer } from "mobx-react-lite"

const Layout = observer(() => {
    const navigate = useNavigate();

    let title = window.location.pathname.replace('/', '');
    if (title === '')
        title = 'dashboard';

    const links = [
        'dashboard',
        'browse',
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
        if (sessionStorage.getItem('token') === null)
            navigate('/authentication')
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

                <UserAvatar />
                <Button
                    variant="contained"
                    onClick={() => {
                        store.clearAuth()
                        navigate('/authentication')
                    }}
                >
                    Logout
                </Button>
            </nav>

            <main id={title}>
                <h1>
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                </h1>

                <Outlet />
            </main>
        </div>
    )
});

export default Layout
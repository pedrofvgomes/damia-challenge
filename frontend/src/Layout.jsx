import React, { useEffect } from "react"
import { Outlet, useNavigate } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import { Button } from '@mui/material'
import store from './store'
import Logout from "./Logout"

const Layout = () => {
    const navigate = useNavigate();

    let title = window.location.pathname.replace('/', '');
    if (title === '')
        title = 'dashboard';

    useEffect(() => {
        function validate() {
            let isAuthenticated = store.isAuthenticated();

            if (!isAuthenticated)
                navigate('/authentication');
        }

        validate();
    }, [])

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
                <Logout />
            </nav>

            <main id={title}>
                <h1>
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                </h1>

                <Outlet />
            </main>
        </div>
    )
}

export default Layout
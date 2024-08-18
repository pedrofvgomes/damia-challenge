import React from "react"
import { Outlet } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import { Button } from '@mui/material'

const Layout = () => {
    return (
        <div id="layout">
            <nav>
                {/* Logo */}
                <img
                    src='/logo1.png'
                    alt='logo'
                    onClick={() => window.location.href = '/'}
                />
                {/* Dashboard */}
                <a href='/dashboard'>Dashboard</a>
                <a href='/profile'>Profile</a>
                <a href='/history'>History</a>
                {/* Create */}
                <Button
                    id="create"
                    onClick={() => window.location.href = '/create'}
                >
                    Create
                </Button>
                {/* User dropdown */}
                <UserAvatar />
            </nav>

            <Outlet />
        </div>
    )
}

export default Layout
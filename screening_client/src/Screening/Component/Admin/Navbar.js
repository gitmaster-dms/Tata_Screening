import React, { useState } from 'react';
import './Navbar.css';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';

const Navbar = ({ onLogout }) => {
    const history = useNavigate();
    const Port = process.env.REACT_APP_API_KEY;
    const colleagueEmail = localStorage.getItem('colleagueEmail');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const personName = localStorage.getItem('name');
    const avatarLetter = personName ? personName.charAt(0).toUpperCase() : '';

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileClick = () => {
        setShowLogoutPopup(!showLogoutPopup);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    // const handleLogout = async () => {
    //     try {
    //         const refresh = localStorage.getItem('refresh');
    //         const userID = localStorage.getItem('userID');
    //         const response = await axios.post(`${Port}/Screening/logout/`, { refresh, clg_id: userID });

    //         if (response.status >= 200 && response.status < 300) {
    //             alert("Are you sure you want to Log out ?");
    //             console.log('Logout successful');
    //             onLogout();
    //             localStorage.removeItem('refresh');
    //             setShowLogoutPopup(false);
    //             history('/');
    //         } else {
    //             console.error('Logout failed:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Logout error:', error.message);
    //     }
    // };

    const handleLogout = async () => {
        try {
            // Ask for confirmation before proceeding
            const confirmed = window.confirm("Are you sure you want to Log out ?");
            if (!confirmed) {
                return; // If not confirmed, do nothing
            }

            const refresh = localStorage.getItem('refresh');
            const userID = localStorage.getItem('userID');
            const response = await axios.post(`${Port}/Screening/logout/`, { refresh, clg_id: userID });

            if (response.status >= 200 && response.status < 300) {
                console.log('Logout successful');
                onLogout();
                localStorage.removeItem('refresh');
                setShowLogoutPopup(false);
                history('/');
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };
    ///////////////////// LOGO 
    const logoUrl = localStorage.getItem('logoooooooooooooooooooooooooooo');
    console.log(logoUrl, 'Logo Fetching in Navbar');

    return (
        <div>
            <nav className='navbar navbar-expand navsize elevation-1'>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <ul className='navbar-nav'>
                    {
                        logoUrl ?
                            (
                                <img src={logoUrl} style={{ height: '40px', width: '80px' }} />
                            ) :
                            (
                                <span></span>
                            )
                    }
                    {/* <img src={alfalogo} style={{ height: '40px',width: '80px' }} /> */}

                    <li className='nav-item d-none d-sm-inline-block navbartitle'>
                        Health Screening
                    </li>
                </ul>

                <ul className='navbar-nav ml-auto'>
                    <li className="nav-item iconss">
                        {/* <GTranslateIcon /> */}
                        {/* <div id="google_translate_element"></div> */}
                    </li>
                    <li className='nav-item iconss'>
                        <NotificationsNoneOutlinedIcon />
                    </li>

                    <Stack direction="row" className="userlogin" onClick={() => setShowLogoutPopup(!showLogoutPopup)}>
                        <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg">
                            {avatarLetter}
                        </Avatar>
                    </Stack>

                    {/* Logout Popup */}
                    {showLogoutPopup && (
                        <div className="profile-card">
                            <div className="blur-background" onClick={handleProfileClick}></div>
                            <div className="card cardlogin">

                                <div className='row'>
                                    <div className='col-md-2'>
                                        <Stack direction="row" spacing={2}>
                                            <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg">
                                                {avatarLetter}
                                            </Avatar>
                                        </Stack>
                                    </div>

                                    <div className='col-md-8'>
                                        <h4 className="mailidddddddddd ml-4">{personName}</h4>
                                    </div>

                                    <div className='col-md-1'>
                                        {/* {isEditing ? (
                                            null
                                        ) : ( */}
                                        {/* <EditOutlinedIcon /> */}
                                        {/* )} */}
                                    </div>
                                </div>

                                <div className='row mt-2'>
                                    <div className='col-md-2'>
                                        <MailOutlineIcon className="mailcolor" />
                                    </div>

                                    <div className='col-md-10 mt-2'>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm loginformcontrol"
                                            />
                                        ) : (
                                            <h4 className="mailidddddddddd">{colleagueEmail}</h4>
                                        )}
                                    </div>
                                </div>

                                <div className='row mt-1'>
                                    <div className='col-md-2'>
                                        <CallOutlinedIcon className="mailcolor" />
                                    </div>

                                    <div className='col-md-10 mt-2'>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm loginformcontrol"
                                            />
                                        ) : (
                                            <h4 className="mailidddddddddd">{phoneNumber}</h4>
                                        )}
                                    </div>
                                </div>

                                {/* <div className='row mt-1'>
                                    <div className='col-md-2'>
                                        <PlaceOutlinedIcon className="mailcolor" />
                                    </div>

                                    <div className='col-md-10 mt-2'>
                                        <h4 className="mailidddddddddd">{location}</h4>
                                    </div>
                                </div> */}
                                {isEditing ? (
                                    <button
                                        className='btn btn-sm btnname'
                                        style={{ color: '#B91D1D', fontSize: '18px', fontWeight: '550' }}
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        className='btn btn-sm btnname'
                                        style={{ color: '#B91D1D', fontSize: '18px', fontWeight: '550' }}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;

import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Stack,
    Tooltip,
    Button,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registrationBadge from '../../Images/TataLogoNav.png';

const Navbar = ({ onLogout }) => {
    const history = useNavigate();
    const Port = process.env.REACT_APP_API_KEY;

    const personName = localStorage.getItem("name");
    const colleagueEmail = localStorage.getItem("colleagueEmail");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const logoUrl = localStorage.getItem("logoooooooooooooooooooooooooooo");
    const avatarLetter = personName ? personName.charAt(0).toUpperCase() : "";

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (!confirmed) return;

        try {
            const refresh = localStorage.getItem("refresh");
            const userID = localStorage.getItem("userID");
            const response = await axios.post(`${Port}/Screening/logout/`, {
                refresh,
                clg_id: userID,
            });

            if (response.status >= 200 && response.status < 300) {
                onLogout();
                localStorage.removeItem("refresh");
                setAnchorEl(null);
                history("/");
            } else {
                console.error("Logout failed:", response.statusText);
            }
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#f2f2f2",
                color: "#333",
                boxShadow: "none",
                borderBottom: "none",
                zIndex: 1200,
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {/* {logoUrl ? (
                        <Box
                            component="img"
                            src={logoUrl}
                            alt="Logo"
                            sx={{ height: 40, width: 80, objectFit: "contain" }}
                        />
                    ) : null} */}

                    <Box
                        sx={{
                            ml: 2,
                            px: 1.5,
                            py: 0.5,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "25px",
                            background: "linear-gradient(90deg, #2FB3F5 0%, #1439A4 100%)",
                            boxShadow: 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={registrationBadge}
                            alt="Registration Badge"
                            sx={{
                                height: 36,
                                width: "auto",
                                objectFit: "contain",
                                p: 0.3,
                            }}
                        />

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                mx: 1,
                                borderColor: "rgba(255,255,255,0.5)",
                                height: 36,
                            }}
                        />

                        {/* Text */}
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                fontFamily: "Playfair Display, serif",
                                color: "#fff",
                                letterSpacing: 0.3,
                            }}
                        >
                            REGISTRATION
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            ml: 2,
                            px: "auto",
                            height: "3em",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "25px",
                            background: "rgba(255, 255, 255, 1)",
                        }}
                    >
                        <Tooltip title="Notifications">
                            <IconButton color="inherit">
                                <NotificationsNoneOutlinedIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <IconButton onClick={handleAvatarClick}>
                                <Avatar sx={{ bgcolor: "#1976d2" }}>{avatarLetter}</Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    mt: 1.5,
                                    minWidth: 250,
                                    borderRadius: 2,
                                    overflow: "visible",
                                },
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "#1976d2" }}>{avatarLetter}</Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {personName}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <MenuItem>
                                <MailOutlineIcon sx={{ mr: 1, color: "text.secondary" }} />
                                <Typography variant="body2">{colleagueEmail}</Typography>
                            </MenuItem>

                            <MenuItem>
                                <CallOutlinedIcon sx={{ mr: 1, color: "text.secondary" }} />
                                <Typography variant="body2">{phoneNumber}</Typography>
                            </MenuItem>

                            <Divider />

                            <Box sx={{ textAlign: "center", p: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={handleLogout}
                                    sx={{
                                        fontWeight: 600,
                                        borderRadius: "20px",
                                        textTransform: "none",
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Menu>
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

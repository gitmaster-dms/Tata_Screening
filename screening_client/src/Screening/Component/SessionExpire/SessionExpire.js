import { Modal, Box, Typography, Button, Zoom } from "@mui/material";

const SessionExpire = ({ open }) => {
    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <Modal
            open={open}
            onClose={handleLogout}
            closeAfterTransition
        >
            <Zoom in={open}>
                <Box
                    onClick={handleLogout}
                    sx={{
                        background: "black",
                        borderRadius: "12px",
                        padding: "24px",
                        maxWidth: 400,
                        margin: "150px auto",
                        textAlign: "center",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        Session Expired
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Your session has expired. Please log in again to continue.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogout}
                    >
                        Go to Login
                    </Button>
                </Box>
            </Zoom>
        </Modal>
    );
};

export default SessionExpire;

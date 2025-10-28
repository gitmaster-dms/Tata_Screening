import { Box, Typography } from "@mui/material";
import logo from "../../Images/SPERO-Final-logo png (1) 2.png"; 
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "rgba(240, 246, 251, 1)",
        color: "black",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: "Roboto",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: "1rem",
        }}
      >
        Powered by
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            height: 23,
            width: 50,
          }}
        />
      </Typography>
    </Box>
  );
};

export default Footer;

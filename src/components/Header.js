import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom"; // Import useHistory for navigation
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  //get username form local storage
  var username = localStorage.getItem("username");
  // console.log(username);

  //use useHistory for navigation
  let history = useHistory();

  const handleLogout = () => {
    //Remove all items
    localStorage.clear();
    //Redirect to same page - /products
    // history.push("/");
    //Refresh the page
    // history.go();
    history.push("/");
    window.location.reload();
  };

  // const handleBackClick = () => {
  //   history.push("/"); // Navigate to the homepage or explore page
  // };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : !username ? (
        <>
          <Box width="30vw">{children && children}</Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              className="header-title"
              variant="text"
              onClick={() => {
                history.push("/login");
              }}
            >
              {/* <Link to="/login">LOGIN</Link> : this will fail the test cases  but its fine to use that*/}
              Login
            </Button>
            <Button
              className="header-title"
              variant="contained"
              onClick={() => {
                history.push("/register");
              }}
            >
              Register
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Box width="30vw">{children && children}</Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {/* <img src="avatar.png" alt={username}></img> */}
            <Avatar alt={username} src="./" />
            <p>{username}</p>
            <Button
              className="header-title"
              variant="text"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Header;

import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import MenuIcon from "@mui/icons-material/Menu";

// Css
import "./userPanelStyle.css";
import { enLogoutHandler } from "../../utils/actions";
const AppNavbar = () => {
  const endutoken = localStorage.getItem("endutoken");
  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand href="/" className="-logo-container">
          <img src={require("../../assets/userpanel/brand.png")} alt="brand" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav">
          <MenuIcon />
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="-nav-menu">
            <NavDropdown title="Features" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#features">Pricing</Nav.Link>
            <Nav.Link href="#pricing">About us</Nav.Link>
            <Nav.Link href="#pricing">Contact</Nav.Link>
            <Nav.Link href="#pricing">Blog</Nav.Link>
          </Nav>
          <Nav>
            {!endutoken ? (
              <>
                <Nav.Link href="user/login">
                  <button className="-signIn-button">log In</button>
                </Nav.Link>
                <Nav.Link eventKey={2} href="user/sign-up">
                  <button className="-signUp-button">Sign Up</button>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link eventKey={2} onClick={enLogoutHandler}>
                <button className="-signUp-button">Log Out</button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

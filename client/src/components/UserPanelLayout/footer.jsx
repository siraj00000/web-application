import React from "react";
import Container from "react-bootstrap/Container";

import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Footer = () => {
  const [lang, setLang] = React.useState("");

  const handleChange = (event) => {
    setLang(event.target.value);
  };

  return (
    <footer className="-footer-section">
      <Container>
        <img
          src={require("../../assets/userpanel/brand.png")}
          alt="footer-brand-logo"
        />
        <h4>Subscribe to our newsletter</h4>
        <div className="-footer-form">
          <MailOutlinedIcon />
          <input type="email" placeholder="input your email" />
          <button>Subscribe</button>
        </div>
        <div className="-sitemap">
          <ul>
            <li>Product</li>
            <li>Features</li>
            <li>Pricing</li>
          </ul>
          <ul>
            <li>Resources</li>
            <li>Blog</li>
            <li>User guides</li>
          </ul>
          <ul>
            <li>Company</li>
            <li>About us</li>
            <li>Contact us</li>
          </ul>
          <ul>
            <li>Company & Pricing</li>
            <li>Personal</li>
            <li>Start up</li>
            <li>Organisation</li>
          </ul>
        </div>
        <section className="-footer-bottom">
          <FormControl
            sx={{ m: 1, minWidth: 120, bgcolor: "#EAECF0FF" }}
            size="small"
          >
            <InputLabel id="demo-select-small">lang</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={lang}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"english"}>English</MenuItem>
              <MenuItem value={"hindi"}>Hindi</MenuItem>
            </Select>
          </FormControl>
          <p>© 2022 Brand, Inc. Privacy, Term, Sitemap</p>
          <div className="-social-links">
            <TwitterIcon sx={{ color: "#2EBAE8FF" }} />
            <FacebookRoundedIcon sx={{ color: "#2E6FE8FF" }} />
            <LinkedInIcon sx={{ color: "#2148A5FF" }} />
            <YouTubeIcon sx={{ color: "#E82E2EFF" }} />
          </div>
        </section>
      </Container>
    </footer>
  );
};

export default Footer;

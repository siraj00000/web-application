import React from 'react';
import './home.css';
import { Col, Container, Row } from 'react-bootstrap';
// components
import CorouselComp from '../../components/carousel';
import HomeCard from '../../components/homeCard';
import HomeBottomCard from '../../components/homeBottomCard';
// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Home = () => {
  return (
    <>
      <section className="home-section1">
        <Container fluid>
          <Row>
            <Col  >
              <p>Simplest way to verify authentic products.</p>
              <button>
                Scan now
              </button>
              <p>Check and then buy</p>
            </Col>
            <Col ><img src={require("../../assets/home/homemain.jpg")} alt="verify product" /></Col>
          </Row>
        </Container>
      </section>
      <div className='divider'></div>

      <section className="home-section2">
        <h1>3 services in One</h1>
        <CorouselComp
          item1={
            <main className='home-main'>
              <p>
                Avoid Fake Products
              </p>
              <p>
                Simply Check
              </p>
              <button>KNOW HOW</button>
              <img src={require('../../assets/home/fakehome.png')} alt="fake product" />

            </main>
          }
          item2={
            <main className='home-main2'>
              <p>
                Cannot track warranty status?
              </p>
              <p>
                Use Label Marker
              </p>
              <button>SEE MORE</button>
              <img src={require('../../assets/home/warrantyhome.png')} alt="warranty status" />

            </main>
          }
          item3={
            <main className='home-main3'>
              <p>
                Cannot book service?
              </p>
              <p>
                Label Marker will Help
              </p>
              <button>FIND OUT MORE</button>
              <img src={require('../../assets/home/servicehome.png')} alt="service" />
            </main>
          }
        />
      </section>
      <div className='divider'></div>
      <section className="home-section3">
        <h1>
          What Label Maker Provides?
        </h1>
        <p>
          That you cannot do otherwise
        </p>
        <p><span>$0</span> Absolutely Free</p>
        <p><CheckCircleOutlineIcon sx={{ backgroundColor: "rgba(195, 226, 250, 0.5)", color: "#2987C2FF", paddingRight: 0, marginRight: "10px", fontSize: "1.2rem", borderRadius: "50%" }} />Scan and Verify Authentic Products in 2 steps</p>
        <p><CheckCircleOutlineIcon sx={{ backgroundColor: "rgba(195, 226, 250, 0.5)", color: "#2987C2FF", paddingRight: 0, marginRight: "10px", fontSize: "1.2rem", borderRadius: "50%" }} />Register and Track Product Warranty</p>
        <p><CheckCircleOutlineIcon sx={{ backgroundColor: "rgba(195, 226, 250, 0.5)", color: "#2987C2FF", paddingRight: 0, marginRight: "10px", fontSize: "1.2rem", borderRadius: "50%" }} />Book your service at regular intervals</p>
      </section>
      <div className='divider'></div>
      <section className='home-section4'>
        <h1>How it works ?</h1>
        <main>
          <HomeCard
            image={require(`../../assets/home/scanQR.jpg`)}
            step={"Step1"}
            text={"Scan QR code on the packaging box. You get to know the tentative fakes"}
          />
          <HomeCard
            image={require(`../../assets/home/packaging.jpg`)}
            step={"Step2"}
            text={"purchase the product and open the packaging"}
          />
          <HomeCard
            image={require(`../../assets/home/insidepackaging.jpg`)}
            step={"Step3"}
            text={"Scan the QR code inside the packaging box and find out real fake status"}
          />
        </main>
      </section>
      <div className='divider'></div>
      <section className='home-section5'>
        <h1>
          Label Maker in Numbers
        </h1>
        <main>
          <HomeBottomCard
            Icon={SearchIcon}
            bgColor={"#F2F8FCFF"}
            text1={"Time to Verify"}
            text2={"10 Seconds"}
            text3={"To figure out fake products"}
          />
          <HomeBottomCard
            Icon={BrightnessLowIcon}
            bgColor={"#DEE1E69E"}
            text1={"Warranty"}
            text2={"2 Minutes"}
            text3={"To register your product warranty"}
          />
          <HomeBottomCard
            Icon={ShoppingCartIcon}
            bgColor={"#EBAD0321"}
            text1={"Service Booking"}
            text2={"30 Seconds"}
            text3={"To schedule and book your service"}
          />
        </main>
      </section>
    </>
  );
};

export default Home;
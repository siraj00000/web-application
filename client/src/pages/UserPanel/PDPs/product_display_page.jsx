import React, { useEffect, useMemo, useState } from "react";
import "./features.css";
import { Container } from "react-bootstrap";

// icons
import StarIcon from "@mui/icons-material/Star";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

import { useNavigate, useParams } from "react-router-dom";
import { token } from "../../../utils/actions";
import { verifyDSN } from "../../../utils/userActions";
import Splash from "../../../components/splash";
import { CONNECTS } from "../../../utils/data";
import { merge } from "../../../utils/merging";
import ProductServices from "../../../components/services";
import ProductCrousel from "../../../components/Swiper";

const ProductPage = () => {
  const navigate = useNavigate();
  const { type, dsN } = useParams();
  let userAuthToken = localStorage.getItem("_venls");
  // States
  const [productDetail, setProductDetail] = useState({ data: [], error: "" });
  useEffect(() => {
    if (type === "ds1" || type === "ds2") {
      if (!userAuthToken && type === "ds2") {
        navigate("/user/login");
      }
      const fetchProductDetail = () => {
        verifyDSN(token, `/api/product-details/${dsN}`)
          .then((res) => setProductDetail({ data: res.data.data, error: "" }))
          .catch((error) => {
            setProductDetail({ data: [], error });
          });
      };
      fetchProductDetail();
    } else navigate("/", { replace: true });
  }, []);

  let productData = productDetail.data;
  let hasOwnedBy = productData?.length !== 0 && productData?.owner.msg; // Hidden if not owned
  let PRODUCT_IMAGES = productData?.productDetail?.image_list;
  let PRODUCT_HEADINGS = productData?.productDetail?.carousel_headings;
  let PRODUCT_DESCRIPTION = productData?.productDetail?.product_description;
  let PRODUCT_TEXTS = productData?.productDetail?.carousel_text;
  let FEATURES_LIST = productData?.productDetail?.feature;
  let error = productDetail.error;

  const content = useMemo(
    () => merge(PRODUCT_IMAGES, PRODUCT_HEADINGS, PRODUCT_TEXTS),
    [PRODUCT_IMAGES, PRODUCT_HEADINGS, PRODUCT_TEXTS]
  );

  const handleErrorReporting = () => {
    let reportAttributes = {
      brand_name: productData?.brand?.brand,
      product_name: productData?.productDetail.product_name,
      product_image: PRODUCT_IMAGES[0] || "",
    };
    navigate("report-error", { state: reportAttributes });
  };

  const handleRegisterWarranty = () => {
    navigate("register-warranty", { state: `${type}/${dsN}` });
  };

  const servicesToShow = () => {
    let brand = productData?.brand;
    if (brand === undefined) return;
    let services = [];

    for (let index = 0; index < CONNECTS.length; index++) {
      const service = brand[CONNECTS[index].enableKey];

      if (service) {
        let info = brand[CONNECTS[index].info];
        let name = CONNECTS[index].Service;
        let Icon = CONNECTS[index].Icon;
        let asset = CONNECTS[index].asset;

        services.push({ name, info, Icon, asset });
      }
    }

    return services;
  };

  let services = useMemo(() => servicesToShow(), [productData]);

  if (error)
    return (
      <section className="no-lable-container">
        <ReportGmailerrorredIcon sx={{ color: "#0c0c1c", fontSize: 40 }} />
        <p className="no-lable-error">{error}</p>
      </section>
    );

  if (productData?.length === 0) return <Splash token={true} />;

  return (
    <Container className="_container">
      <section className="section1-mobile">
        <ArrowLeftIcon />
        <h1>Scan Result</h1>
      </section>
      <section className="features-section1">
        <div>
          <h1>Product Scan Result</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
            magni laborum at saepe, ad praesentium.
          </p>
        </div>

        <div className="section1-container2">
          <img
            src={require("../../../assets/Product/congrats_man_image.jpg")}
            alt="congrats man"
          />
          <p>
            Congrats! Your label is fine. Make sure you scan the hidden code
            after you buy this product. <br />
            {"\n\n" + hasOwnedBy}
          </p>
        </div>
      </section>

      <section className="features-section2">
        <div>
          <h1>{productData?.brand?.brand}</h1>
          <h2>{productData?.productDetail.product_name}</h2>
          <button onClick={handleRegisterWarranty}>Register Warranty</button>
        </div>
        <img src={PRODUCT_IMAGES[0].url || ""} alt={"brand"} />
      </section>
      <section className="mobile-section">
        <div>
          <img
            src={require("../../../assets/Product/whatsapp_mobile.png")}
            alt="12"
          />
          <p>Whatsapp Connect Now</p>
        </div>
        <div>
          <img
            src={require("../../../assets/Product/instagram_mobile.png")}
            alt="12"
          />
          <p>Instagram Connect Now</p>
        </div>
        <div>
          <img
            src={require("../../../assets/Product/instagram_mobile.png")}
            alt="12"
          />
          <p>Twitter Connect Now</p>
        </div>
      </section>
      <section className="features-section3">
        <h1>Description</h1>
        <p>{PRODUCT_DESCRIPTION}</p>
        <div>
          <div className="feature_listing">
            <p>
              {Object.entries(FEATURES_LIST).map(([key, value]) => (
                <React.Fragment key={key + value}>
                  <StarIcon
                    sx={{
                      color: "#2987C2FF",
                      fontSize: "2rem",
                      marginRight: "25px",
                    }}
                  />
                  {value}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <button onClick={handleErrorReporting}>Report Error</button>
      </section>

      {/* Product Crousel */}
      <ProductCrousel content={content} />

      <section className="features-section5">
        {services?.map((item, index) => (
          <ProductServices key={index} index={index} content={item} />
        ))}
      </section>
    </Container>
  );
};

export default ProductPage;

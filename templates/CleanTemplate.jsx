import React, { Fragment, useEffect, useState } from "react";
import { Col, Row, Container, Image, Button, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import toastr from "toastr";
import * as newsletterContentService from "../../../services/newsletterContentService";

function CleanTemplate() {
  const navigate = useNavigate();
  const location = useLocation();

  const [contentData, setContentData] = useState({
    id: "",
    title: "",
    subject: "",
    image: "",
    paragraph: "",
    footerText: "",
    headerText: "",
    author: "",
  });

  useEffect(() => {
    if (location.state && location.state.type === "VIEW_NEWSLETTER") {
      const newsLetterId = location.state.payload;
      setContentData((prevState) => {
        const pd = { ...prevState };
        pd.id = newsLetterId;
        return pd;
      });
      newsletterContentService
        .getContentByNewsletterId(newsLetterId)
        .then(onGetContentSuccess)
        .catch(onGetContentError);
    }
  }, []);

  const onGetContentSuccess = (data) => {
    let contentsData = data?.items;

    if (contentsData) {
      for (let i = 0; i < contentsData.length; i++) {
        switch (contentsData[i]?.newsletterTemplateKey?.keyName) {
          case "Title":
            setContentData((prevState) => {
              const pd = { ...prevState };
              pd.title = contentsData[i]?.value;
              return pd;
            });
            break;
          case "Subject":
            setContentData((prevState) => {
              const pd = { ...prevState };
              pd.subject = contentsData[i]?.value;
              return pd;
            });
            break;
          case "Image":
            setContentData((prevState) => {
              const pd = { ...prevState };
              pd.image = contentsData[i]?.value;
              return pd;
            });
            break;
          case "Paragraph":
            setContentData((prevState) => {
              const pd = { ...prevState };
              pd.paragraph = contentsData[i]?.value;
              return pd;
            });
            break;
          case "FooterText":
            setContentData((prevState) => {
              const pd = { ...prevState };
              pd.footerText = contentsData[i]?.value;
              return pd;
            });
            break;
          case "HeaderText":
            setContentData((prevState) => {
              const pd = { ...prevState };
              pd.headerText = contentsData[i]?.value;
              return pd;
            });
            break;
          default:
            break;
        }
      }
    }

    setContentData((prevState) => {
      const pd = { ...prevState };
      pd.author = `${contentsData[0]?.user?.firstName} ${contentsData[0]?.user?.lastName}`;
      return pd;
    });
  };

  const onGetContentError = (error) => {
    toastr.error("Load error", error);
  };

  const returnToNewsletters = () => {
    navigate(`/newsletters`);
  };

  const newsletterSignupClicked = () => {
    navigate(`/newsletter/signup`);
  };

  return (
    <Fragment>
      <div className="py-4 py-lg-8 pb-14 bg-white ">
        <Container>
          <Fragment key={contentData?.id}>
            <Row className="justify-content-center">
              <Col xl={8} lg={8} md={12} sm={12} className="mb-2">
                <div className="text-center mb-4">
                  <h5 className="display-6  mb-4">{contentData?.headerText}</h5>
                </div>
                <hr className="mt-8 mb-5" />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xl={8} lg={8} md={12} sm={12} className="mb-2">
                <div className="text-center mb-4">
                  <h1 className="display-3 fw-bold mb-4">
                    {contentData?.title}
                  </h1>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xl={7} lg={7} md={7} sm={12} className="mb-6">
                <Image
                  src={contentData?.image}
                  alt=""
                  className="img-fluid rounded-3"
                />
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xl={8} lg={8} md={12} sm={12} className="mb-2">
                <div>
                  <h3>{contentData?.subject}</h3>
                </div>
                <br />
                <div>{contentData?.paragraph}</div>
                <hr className="mt-8 mb-5" />
                Author: {contentData?.author}
                <div className="py-12">
                  <div className="d-flex justify-content-center mb-6">
                    <Card.Body>
                      <h3>
                        <Button
                          onClick={newsletterSignupClicked}
                          type="submit"
                          className="btn btn-primary text-inherit"
                        >
                          Sign Up for Migrately Newsletters
                        </Button>
                        <Button
                          type="submit"
                          className="btn btn-info text-inherit mx-5"
                          onClick={(e) => {
                            e.preventDefault();
                            returnToNewsletters(e);
                          }}
                        >
                          Return to newsletters
                        </Button>
                      </h3>
                      <div>{contentData?.footerText}</div>
                    </Card.Body>
                  </div>
                </div>
              </Col>
            </Row>
          </Fragment>
        </Container>
      </div>
    </Fragment>
  );
}

export default CleanTemplate;

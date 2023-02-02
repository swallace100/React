import React, { Fragment } from "react";

import { Col, Row, Container, Image, Button, Card } from "react-bootstrap";
import PropTypes from "prop-types";

const CleanTemplatePreview = (props) => {
  return (
    <React.Fragment>
      <div className="py-4 py-lg-8 pb-14 bg-white ">
        <Container>
          <Fragment key={props?.aNewsletter?.id}>
            <Row className="justify-content-center">
              <Col xl={8} lg={8} md={12} sm={12} className="mb-2">
                <div className="text-center mb-4">
                  <h5 className="display-6  mb-4">
                    <div>{props?.aNewsletter?.content[5].value}</div>
                  </h5>
                </div>
                <hr className="mt-8 mb-5" />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xl={8} lg={8} md={12} sm={12} className="mb-2">
                <div className="text-center mb-4">
                  <h1 className="display-3 fw-bold mb-4">
                    {props?.aNewsletter?.content[0].value}
                  </h1>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xl={7} lg={7} md={7} sm={12} className="mb-6">
                <Image
                  src={props?.aNewsletter?.content[2].value}
                  alt=""
                  className="img-fluid rounded-3"
                />
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xl={8} lg={8} md={12} sm={12} className="mb-2">
                <div>
                  <h3>{props?.aNewsletter?.content[1].value}</h3>
                </div>
                <br />
                <div>{props?.aNewsletter?.content[3].value}</div>
                <hr className="mt-8 mb-5" />
                Author: Current User
                <div className="py-12">
                  <div className="d-flex justify-content-center mb-6">
                    <Card.Body>
                      <h3>
                        <Button
                          type="submit"
                          className="btn btn-primary text-inherit newsletterpreview-button"
                        >
                          Sign Up for Migrately Newsletters
                        </Button>
                        <Button
                          type="submit"
                          className="btn btn-info text-inherit mx-3 newsletterpreview-button"
                        >
                          Return to newsletters
                        </Button>
                      </h3>
                      <div>{props?.aNewsletter?.content[4].value}</div>
                    </Card.Body>
                  </div>
                </div>
              </Col>
            </Row>
          </Fragment>
        </Container>
      </div>
    </React.Fragment>
  );
};
CleanTemplatePreview.propTypes = {
  aNewsletter: PropTypes.shape({
    id: PropTypes.number,
    headerText: PropTypes.string.isRequired,
    footerText: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    paragraph: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    coverPhoto: PropTypes.string.isRequired,
    createdBy: PropTypes.number.isRequired,
    content: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
export default CleanTemplatePreview;

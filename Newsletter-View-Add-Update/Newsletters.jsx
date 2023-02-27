import React, { useEffect, useState, Fragment, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import * as newsletterService from "../../services/newsletterService";

import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";
import toastr from "toastr";
import NewsletterCard from "./NewsletterCard";
import PropTypes from "prop-types";

const Newsletters = (props) => {
  const [pageData, setPageData] = useState({
    arrayOfNewsletterCards: [],
    newsletterCardComponents: [],
    totalCount: 0,
    pageSize: 6,
    pageIndex: 1,
    initialPageLoad: true,
    userIsAdmin: false,
  });

  const [newsletterQueryValue, setNewsletterQueryValue] = useState({
    query: "",
    queriedActive: false,
    queriedValue: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (newsletterQueryValue.queriedActive) {
      newsletterService
        .queryPaged(
          pageData.pageIndex - 1,
          pageData.pageSize,
          newsletterQueryValue.queriedValue
        )
        .then(onGetNewsletterSuccess)
        .catch(onGetNewsletterError);
    } else {
      newsletterService
        .getAllPaged(pageData.pageIndex - 1, pageData.pageSize)
        .then(onGetNewsletterSuccess)
        .catch(onGetNewsletterError);
    }
  }, [pageData.pageIndex, newsletterQueryValue.queriedValue]);

  useEffect(() => {
    var adminLoggedIn = false;

    for (var i = 0; i < props.currentUser.roles.length; i++) {
      if (props.currentUser.roles[i] === "Admin") {
        adminLoggedIn = true;
      }
    }

    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.initialPageLoad = false;
      pd.userIsAdmin = adminLoggedIn;
      return pd;
    });
  }, [pageData.userIsAdmin]);

  const onGetNewsletterSuccess = (data) => {
    let arrayOfDocs = data.value.item;

    if (arrayOfDocs?.pagedItems) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.arrayOfNewsletterCards = arrayOfDocs;
        pd.newsletterCardComponents =
          pd.arrayOfNewsletterCards.pagedItems.map(mapNewsletter);
        pd.totalCount = arrayOfDocs.totalCount;
        return pd;
      });
    } else {
      toastr.error("No matches found.");
      resetQueries();
    }
  };

  const onQueryFieldChange = (event) => {
    const target = event.target;
    const newQueryValue = target.value;
    const nameOfField = target.name;
    setNewsletterQueryValue((prevState) => {
      const newQueryObject = {
        ...prevState,
      };
      newQueryObject[nameOfField] = newQueryValue;
      return newQueryObject;
    });
  };

  const resetQueries = () => {
    setNewsletterQueryValue((prevState) => {
      const pd = { ...prevState };
      pd.query = "";
      pd.queriedActive = false;
      pd.queriedValue = "";

      return pd;
    });
  };

  const onQueryEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      resetQueries();
      setPageData({ ...pageData, pageIndex: 1 });

      setNewsletterQueryValue((prevState) => {
        const pd = { ...prevState };
        pd.queriedActive = true;
        pd.queriedValue = newsletterQueryValue.query;

        return pd;
      });
    }
  };

  const onGetNewsletterError = (error) => {
    toastr.error("Load error", error);
  };

  const mapNewsletter = (aNewsletter) => {
    return (
      <>
        <NewsletterCard
          currentUser={props.currentUser}
          mappedNewsletter={aNewsletter}
          arrayOfNewsletters={pageData.arrayOfNewsletterCards}
          key={"ListA-" + aNewsletter.id}
          onViewClicked={onCardClicked}
          onEditClicked={onCardClicked}
        ></NewsletterCard>
      </>
    );
  };

  const onCardClicked = useCallback((thisNewsletter) => {
    return thisNewsletter;
  }, []);

  const newsletterSignupClicked = () => {
    navigate(`/newsletter/signup`);
  };

  const changePageClicked = (page) => {
    setPageData({ ...pageData, pageIndex: page });
  };

  return (
    <Fragment>
      <div className="pt-9 pb-5 bg-white">
        <Container>
          <Row>
            <Col
              xl={{ offset: 2, span: 8 }}
              lg={{ offset: 1, span: 10 }}
              md={12}
              sm={12}
            >
              <div className="text-center mb-5">
                <h1 className=" display-2 fw-bold">Newsletters</h1>
                <h4>
                  View all of our newsletters that help you better understand
                  your immigration needs.
                </h4>
              </div>
            </Col>
          </Row>
          <div className="d-flex flex-row-reverse mx-9 mb-3">
            <Button
              onClick={resetQueries}
              className="btn btn-light text-inherit mx-1"
              type="submit"
            >
              Reset
            </Button>
            <Form className="mt-5 mt-lg-0 ms-lg-3 d-flex align-items-center">
              <span className="position-absolute ps-3 search-icon">
                <i className="fe fe-search"></i>
              </span>
              <Form.Control
                type="Search"
                id="query"
                name="query"
                className="ps-6"
                value={newsletterQueryValue.query}
                onKeyDown={onQueryEnterPress}
                onChange={onQueryFieldChange}
              />
            </Form>
          </div>
          <div className="d-flex flex-row-reverse mx-6 ">
            <Button
              onClick={newsletterSignupClicked}
              className="btn btn-primary text-inherit mx-5 "
              type="submit"
            >
              Sign Up for Migrately Newsletters
            </Button>
          </div>
        </Container>
      </div>

      <div className="pb-16 bg-white ml-5 ">
        <Container className=" newsletter-container ">
          <div className="newsletter-content-height">
            <Row
              lg={4}
              md={4}
              xs={12}
              className="mt-3 mt-lg-0 d-flex justify-content-center "
            >
              {pageData.newsletterCardComponents}
            </Row>
          </div>
          <Row>
            <Col className="pb-5 mt-3 mx-9">
              <Pagination
                locale={locale}
                onChange={changePageClicked}
                current={pageData.pageIndex}
                total={pageData.totalCount}
                pageSize={pageData.pageSize}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

Newsletters.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.node.isRequired,
  }).isRequired,
};

export default Newsletters;

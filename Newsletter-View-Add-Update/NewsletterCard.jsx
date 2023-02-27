import React from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Newsletters.css";
import PropTypes from "prop-types";
import { Edit } from "react-feather";

function NewsletterCard(props) {
  const aNewsletter = props?.mappedNewsletter;

  const navigate = useNavigate();

  const goToSingleNewsletter = () => {
    const stateForTransport = {
      type: "VIEW_NEWSLETTER",
      payload: aNewsletter.id,
    };

    if (aNewsletter.newsletterTemplate.id === 1) {
      navigate(`/newsletters/c/${aNewsletter?.id}`, {
        state: stateForTransport,
      });
    }
  };

  const editNewsletter = () => {
    const stateForTransport = {
      type: "EDIT_NEWSLETTER",
      payload: aNewsletter.id,
    };

    if (aNewsletter.newsletterTemplate.id === 1) {
      navigate(`/newsletters/manage/${aNewsletter?.id}`, {
        state: stateForTransport,
      });
    }
  };

  return (
    <Card className="mb-4 m-5 shadow-lg text-center ">
      <Link
        to=""
        onClick={(e) => {
          e.preventDefault();
          goToSingleNewsletter();
        }}
      >
        <Card.Img
          variant="top"
          src={aNewsletter?.coverPhoto}
          className="rounded-top-md newsletter-image mt-3"
        />
      </Link>
      <Card.Body className="d-flex justify-content-center">
        <h3 className="mt-2">
          <Link
            to=""
            className="text-inherit"
            onClick={(e) => {
              e.preventDefault();
              goToSingleNewsletter();
            }}
          >
            {aNewsletter?.name}
          </Link>
        </h3>

        {props?.currentUser?.roles.includes("Admin") && (
          <div className="mx-1 mt-5">
            <button
              title="Edit"
              className="btn btn-light btn-sm newsletter-edit-button"
              onClick={editNewsletter}
            >
              <Edit size="18px" color="Black" />
            </button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

NewsletterCard.propTypes = {
  mappedNewsletter: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    coverPhoto: PropTypes.string.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    dateToExpire: PropTypes.string.isRequired,
    dateToPublish: PropTypes.string.isRequired,
    newletterTemplate: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    user: PropTypes.shape({
      userId: PropTypes.number.isRequired,
    }),
  }),
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf.isRequired,
  }),
};

export default React.memo(NewsletterCard);

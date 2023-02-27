import React, { useEffect, useState, Fragment, useRef } from "react";
import { Row, Container, Dropdown, Button } from "react-bootstrap";
import "./Newsletters.css";
import * as newsletterContentService from "../../services/newsletterContentService";
import * as newsletterTemplateService from "../../services/newsletterTemplateService";
import * as newsletterService from "../../services/newsletterService";
import CleanTemplatePreview from "./templates/CleanTemplatePreview";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Formik,
  Form,
  Field,
  withFormik,
  ErrorMessage,
  FieldArray,
} from "formik";
import { addNewsletterSchema } from "../../schemas/addNewsletterSchema";
import * as Yup from "yup";

import PropTypes from "prop-types";
import toastr from "toastr";
import FileUpload from "components/fileUpload/FileUpload";
import Swal from "sweetalert2";

const NewsletterManager = (props) => {
  const [pageData, setPageData] = useState({
    arrayOfTemplates: [],
    templateComponents: [],
    templateId: 0,
    totalCount: 0,
    pageSize: 10,
    pageIndex: 1,
    initialPageLoad: true,
  });

  const currentUser = props.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);

  const [formData, setFormData] = useState({
    templateId: 0,
    id: 0,
    name: "",
    dateToPublish: "",
    dateToExpire: "",
    createdBy: currentUser.id,
    coverPhoto: "",
    submitText: "Add Newsletter",
    submitButtonText: "Add",
    content: [
      {
        id: 0,
        value: "",
        contentOrder: 1,
        newsletterTemplateKey: { id: 1 },
      },
      {
        id: 0,
        value: "",
        contentOrder: 2,
        newsletterTemplateKey: { id: 2 },
      },
      {
        id: 0,
        value: "",
        contentOrder: 3,
        newsletterTemplateKey: { id: 3 },
      },
      {
        id: 0,
        value: "",
        contentOrder: 4,
        newsletterTemplateKey: { id: 4 },
      },
      {
        id: 0,
        value: "",
        contentOrder: 5,
        newsletterTemplateKey: { id: 5 },
      },
      {
        id: 0,
        value: "",
        contentOrder: 6,
        newsletterTemplateKey: { id: 6 },
      },
    ],
  });

  const newsletterAddSchema = Yup.object().shape({
    id: Yup.number().required("Is Required"),
    templateId: Yup.number().required("Is Required"),
    createdBy: Yup.number().required("Is Required"),
    name: Yup.string().min(2).max(4000).required("Is Required"),
    dateToPublish: Yup.string().min(2).max(100).required("Is Required"),
    dateToExpire: Yup.string().min(2).max(100).required("Is Required"),
    coverPhoto: Yup.string().min(2).max(255).required("Is Required"),
    content: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().min(2).max(4000).required("Is Required"),
      })
    ),
  });

  useEffect(() => {
    if (pageData.initialPageLoad) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.initialPageLoad = false;
        return pd;
      });
      newsletterTemplateService
        .getAllPaged(pageData.pageIndex - 1, pageData.pageSize)
        .then(onGetTemplatesSuccess)
        .catch(onGetTemplatesError);

      if (location.state && location.state.type === "EDIT_NEWSLETTER") {
        const newsLetterId = location.state.payload;
        setFormData((prevState) => {
          const pd = { ...prevState };
          pd.id = newsLetterId;
          return pd;
        });
        newsletterContentService
          .getContentByNewsletterId(newsLetterId)
          .then(onGetContentSuccess)
          .catch(onGetContentError);
      }
    }
  }, [pageData.pageIndex]);

  const onGetTemplatesSuccess = (data) => {
    let arrayOfDocs = data.value.item;

    if (arrayOfDocs?.pagedItems) {
      setPageData((prevState) => {
        const pd = { ...prevState };
        pd.arrayOfTemplates = arrayOfDocs;
        pd.templateComponents =
          pd.arrayOfTemplates.pagedItems.map(mapTemplates);
        pd.totalCount = arrayOfDocs.totalCount;
        return pd;
      });
    }
  };

  const onGetTemplatesError = (error) => {
    toastr.error("Load error", error);
  };

  const onGetContentSuccess = (data) => {
    let contentsData = data?.items;

    if (contentsData) {
      const publishDateSplit =
        contentsData[0]?.newsletter?.dateToPublish.split("T");
      const dateToPublish = publishDateSplit[0];

      const expireDateSplit =
        contentsData[0]?.newsletter?.dateToExpire.split("T");

      const dateToExpire = expireDateSplit[0];

      setFormData((prevState) => {
        const pd = { ...prevState };
        pd.name = contentsData[0]?.newsletter?.name;
        pd.dateToPublish = dateToPublish;
        pd.dateToExpire = dateToExpire;

        return pd;
      });

      for (let i = 0; i < contentsData.length; i++) {
        switch (contentsData[i]?.newsletterTemplateKey?.keyName) {
          case "Title":
            setFormData((prevState) => {
              const pd = { ...prevState };
              pd.submitText = "Edit Newsletter?";
              pd.submitButtonText = "Edit";
              pd.content[0].id = contentsData[i]?.id;
              pd.content[0].value = contentsData[i]?.value;
              return pd;
            });
            break;
          case "Subject":
            setFormData((prevState) => {
              const pd = { ...prevState };
              pd.content[1].id = contentsData[i]?.id;
              pd.content[1].value = contentsData[i]?.value;
              return pd;
            });
            break;
          case "Image":
            setFormData((prevState) => {
              const pd = { ...prevState };
              pd.content[2].id = contentsData[i]?.id;
              pd.content[2].value = contentsData[i]?.value;
              pd.coverPhoto = contentsData[i]?.value;
              return pd;
            });
            break;
          case "Paragraph":
            setFormData((prevState) => {
              const pd = { ...prevState };
              pd.content[3].id = contentsData[i]?.id;
              pd.content[3].value = contentsData[i]?.value;
              return pd;
            });
            break;
          case "FooterText":
            setFormData((prevState) => {
              const pd = { ...prevState };
              pd.content[4].id = contentsData[i]?.id;
              pd.content[4].value = contentsData[i]?.value;
              return pd;
            });
            break;
          case "HeaderText":
            setFormData((prevState) => {
              const pd = { ...prevState };
              pd.content[5].id = contentsData[i]?.id;
              pd.content[5].value = contentsData[i]?.value;
              return pd;
            });
            break;
          default:
            break;
        }
      }
    }
  };

  const onGetContentError = (error) => {
    toastr.error("Load error", error);
  };

  const mapTemplates = (item) => {
    return (
      <Dropdown.Item
        key={item.id}
        to="#"
        className="d-flex align-items-center"
        label={item.name}
        value={item.id}
        onClick={() => selectHandler(item.id)}
      >
        {item.name}
      </Dropdown.Item>
    );
  };

  const selectHandler = (id) => {
    setFormData((prevState) => {
      const pd = { ...prevState };
      pd.templateId = id;
      return pd;
    });
  };

  const uploadFile = (file, setFieldValue) => {
    setFieldValue("coverPhoto", file[0].url);
    setFieldValue(`content[2].value`, file[0].url);
  };

  const handleSubmit = (values) => {
    Swal.fire({
      title: formData.submitText,
      text: "Would you like to post this newsletter?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: formData.submitButtonText,
    }).then((result) => {
      if (result["isConfirmed"]) {
        if (formData.id) {
          newsletterService
            .editNewsletterWithContent(values, formData.id)
            .then(onAddSuccess)
            .catch(onAddError);
        } else {
          newsletterService
            .addNewsletterWithContent(values)
            .then(onAddSuccess)
            .catch(onAddError);
        }
      } else if (result["isDenied"]) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const onAddSuccess = (response) => {
    let successfulAddId = response.item;
    setFormData((prevState) => {
      const fd = { ...prevState };
      fd.id = successfulAddId;

      return fd;
    });

    Swal.fire("Congrats!", "You made a newsletter!", "success");

    currentUser?.roles.includes("Admin")
      ? navigate(`/newsletters`)
      : navigate(`/newsletters`);
  };

  const onAddError = (response) => {
    Swal.fire({
      title: "Oops",
      text: "Something went wrong!",
      response,
      icon: "error",
    });
    currentUser?.roles.includes("Admin");
    navigate(`/newslettermanager`);
  };

  const onResetClick = async (resetForm) => {
    Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    Swal.fire({
      title: "Are you sure you want to reset this form?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset the form!",
      cancelButtonText: "No, back to draft!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await resetForm();
        Swal.fire("Draft Reset!", "Your draft has been reset.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your newsletter draft is safe :)");
      }
    });
  };

  return (
    <Fragment>
      <div className="pt-9 pb-5 bg-white">
        <Container>
          <Row>
            <div className="mb-5">
              <h3 className=" display-3 fw-bold">Newsletter Manager</h3>
              <Row className="d-inline-flex ">
                <h3 className="mb-3">
                  Select a template to begin creating a newsletter
                </h3>
                <Dropdown>
                  <Dropdown.Toggle>Templates</Dropdown.Toggle>
                  <Dropdown.Menu align="ul">
                    {pageData.templateComponents}
                  </Dropdown.Menu>
                </Dropdown>
              </Row>
            </div>
          </Row>
        </Container>
        {formData.templateId === 1 && (
          <Formik
            innerRef={ref}
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={handleSubmit}
            validationSchema={newsletterAddSchema}
            onReset={null}
          >
            {({ values, setFieldValue, resetForm }) => (
              <>
                <div className="row py-6 px-12 bg-white blogform-card-shadow">
                  <div className="col-6">
                    <div className="card-body">
                      <div className="p-lg-6 card blogform-card-shadow">
                        <Form autoComplete="off">
                          <div className="row">
                            <div className="mb-3 col-12">
                              <div>
                                <label htmlFor="title" className="form-label">
                                  Name of Newsletter
                                </label>

                                <Field
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  name="name"
                                  required
                                ></Field>

                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="newsletterform-validation-error-message"
                                ></ErrorMessage>
                              </div>
                            </div>

                            <div className="mb-3 col-6">
                              <div>
                                <label
                                  htmlFor="dateToPublish"
                                  className="form-label"
                                >
                                  Published On
                                </label>

                                <Field
                                  type="date"
                                  className="form-control"
                                  id="dateToPublish"
                                  placeholder="dateToPublish"
                                  name="dateToPublish"
                                  required
                                ></Field>
                              </div>
                            </div>

                            <div className="mb-3 col-6">
                              <div>
                                <label
                                  htmlFor="dateToExpire"
                                  className="form-label"
                                >
                                  Expire On
                                </label>

                                <Field
                                  type="date"
                                  className="form-control"
                                  id="dateToExpire"
                                  placeholder="dateToExpire"
                                  name="dateToExpire"
                                  required
                                ></Field>
                              </div>
                            </div>
                            <FieldArray name="content">
                              <div>
                                {values.content.length > 0 &&
                                  values.content.map((item, index) => (
                                    <div className="mb-3 col-12" key={index}>
                                      {item.newsletterTemplateKey?.id === 1 && (
                                        <div>
                                          <label
                                            htmlFor="title"
                                            className="form-label"
                                          >
                                            Newsletter Title
                                          </label>

                                          <Field
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name={`content.${index}.value`}
                                            required
                                          ></Field>

                                          <ErrorMessage
                                            name={`content.${index}.value`}
                                            component="div"
                                            className="newsletterform-validation-error-message"
                                          ></ErrorMessage>
                                        </div>
                                      )}
                                      {item.newsletterTemplateKey?.id === 2 && (
                                        <div>
                                          <label
                                            htmlFor="subject"
                                            className="form-label"
                                          >
                                            Subject
                                          </label>

                                          <Field
                                            type="text"
                                            className="form-control"
                                            id="subject"
                                            name={`content.${index}.value`}
                                            required
                                          ></Field>

                                          <ErrorMessage
                                            name={`content.${index}.value`}
                                            component="div"
                                            className="newsletterform-validation-error-message"
                                          ></ErrorMessage>
                                        </div>
                                      )}
                                      {item.newsletterTemplateKey?.id === 4 && (
                                        <div>
                                          <label
                                            htmlFor="paragraph"
                                            className="form-label"
                                          >
                                            Content Paragraph
                                          </label>

                                          <Field
                                            component="textarea"
                                            rows="4"
                                            type="textarea"
                                            className="form-control"
                                            control="textarea"
                                            id="paragraph"
                                            name={`content.${index}.value`}
                                            required
                                          ></Field>

                                          <ErrorMessage
                                            name={`content.${index}.value`}
                                            component="div"
                                            className="newsletterform-validation-error-message"
                                          ></ErrorMessage>
                                        </div>
                                      )}
                                      {item.newsletterTemplateKey?.id === 3 && (
                                        <div>
                                          <div>
                                            <label
                                              htmlFor="coverPhoto"
                                              className="form-label"
                                            >
                                              Image Upload
                                            </label>
                                          </div>

                                          <div className="mb-3 col-12">
                                            <FileUpload
                                              onUploadSuccess={(file) =>
                                                uploadFile(file, setFieldValue)
                                              }
                                              name={`content.${index}.value`}
                                            ></FileUpload>
                                          </div>
                                        </div>
                                      )}
                                      {item.newsletterTemplateKey?.id === 6 && (
                                        <div>
                                          <label
                                            htmlFor="headerText"
                                            className="form-label"
                                          >
                                            Header Text
                                          </label>

                                          <Field
                                            type="text"
                                            className="form-control"
                                            id="headerText"
                                            name={`content.${index}.value`}
                                            required
                                          ></Field>

                                          <ErrorMessage
                                            name={`content.${index}.value`}
                                            component="div"
                                            className="newsletterform-validation-error-message"
                                          ></ErrorMessage>
                                        </div>
                                      )}
                                      {item.newsletterTemplateKey?.id === 5 && (
                                        <div>
                                          <label
                                            htmlFor="footerText"
                                            className="form-label"
                                          >
                                            FooterText
                                          </label>

                                          <Field
                                            type="text"
                                            className="form-control"
                                            id="footerText"
                                            name={`content.${index}.value`}
                                            required
                                          ></Field>

                                          <ErrorMessage
                                            name={`content.${index}.value`}
                                            component="div"
                                            className="newsletterform-validation-error-message"
                                          ></ErrorMessage>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </FieldArray>
                            <div className="col-6 btn-group mt-4">
                              <Button
                                id="submit"
                                type="submit"
                                variant="outline-primary"
                                className="mx-2 newslettermanager-button"
                              >
                                Post
                              </Button>
                              <Button
                                onClick={() => onResetClick(resetForm)}
                                variant="outline-warning"
                                className="newslettermanager-button"
                              >
                                Reset
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    {
                      <CleanTemplatePreview
                        currentUser={currentUser.id}
                        aNewsletter={{ ...values }}
                      />
                    }
                  </div>
                </div>
              </>
            )}
          </Formik>
        )}
      </div>
    </Fragment>
  );
};

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => ({
    templateId: props?.aNewsletter?.[0]?.templateId || 0,
    name: props?.aNewsletter?.[0]?.name || "",
    coverPhoto: props?.aNewsletter?.[0]?.coverPhoto || "",
    dateToPublish: props?.aNewsletter?.[0]?.dateToPublish || "",
    dateToExpire: props?.aNewsletter?.[0]?.dateToExpire || "",
    createdBy: props?.aNewsletter?.[0]?.createdBy || 0,
    content: [
      {
        text: props?.aNewsletter?.content?.[0]?.value || "",
        contentOrder: props?.aNewsletter?.content?.[0]?.contentOrder || 0,
        newsletterTemplateKey:
          props?.aNewsletter?.content?.[0]?.newsletterTemplateKey || 0,
      },
    ],
  }),
  validationSchema: addNewsletterSchema,
  handleSubmit: function (values, { props }) {
    props.onNext(values);
  },
})(NewsletterManager);

NewsletterManager.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.node.isRequired,
  }).isRequired,
};

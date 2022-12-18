import React, { useState } from "react";
import axios from "axios";
import FormError from "./FormError";
import Notification from "./Notification";
import logo from "../images/logo.webp";
import LoadingSpinner from "./LoadingSpinner";

const ContactForm = () => {
  const [formData, setformData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [notification, setNotification] = useState("");
  const [success, setSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  const inputChangeHandler = (event) => {
    const { value, name } = event.target;
    setformData((prevformData) => {
      return {
        ...prevformData,
        [name]: value,
      };
    });
  };

  const validate = (inputValues) => {
    const errors = {};
    // eslint-disable-next-line
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!inputValues.recipient) {
      errors.recipient = "Email is required!";
    } else if (!emailRegex.test(inputValues.recipient)) {
      errors.recipient = "This is an invalid email format!";
    }
    if (!inputValues.subject) {
      errors.subject = "Subject is required!";
    }
    if (!inputValues.message) {
      errors.message = "Message is required!";
    }
    return errors;
  };

  const hideNotification = () => {
    setIsSendEmail(true);
    setTimeout(() => {
      setIsSendEmail(false);
    }, 10000);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const errors = validate(formData);
    //check form validation errors
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setLoading(true);
      setFormErrors({});
      try {
        //post form data
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.post(`${baseUrl}/sendemail`, formData);
        setLoading(false);
        //check server response
        if (response.data.success) {
          setNotification(response.data.message);
          setSuccess(response.data.success);
          //clear form inputs
          setformData({
            recipient: "",
            subject: "",
            message: "",
          });
        } else {
          setNotification(response.data.error);
          setSuccess(response.data.success);
        }
      } catch (err) {
        setLoading(false);
        setNotification(err.message);
        setSuccess(false);
      }
      //hide notification after 10 seconds
      hideNotification();
    }
  };

  return (
    <div className="main-container">
      {loading && <LoadingSpinner />}
      {isSendEmail && <Notification notif={notification} success={success} />}
      <div className="container">
        <div className="contact-info">
          <img className="logo" src={logo} alt="logo" />
          <h3 className="title">Eretz Mailer</h3>
          <p className="text">
            Our application makes it easy for you to stay connected with your
            contacts, no matter where you are. Whether you're at the office, on
            the go, or working remotely, you can send your email from any device
            with an internet connection.
          </p>
        </div>

        <div className="contact-form">
          <form onSubmit={submitHandler}>
            <h3 className="title">Write Email</h3>
            <div className="input-container">
              <label className="label">Recipient</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                name="recipient"
                value={formData.recipient}
                onChange={inputChangeHandler}
              />
              <FormError error={formErrors.recipient} />
            </div>
            <div className="input-container">
              <label className="label">Subject</label>
              <input
                type="text"
                className="input"
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={inputChangeHandler}
              />
              <FormError error={formErrors.subject} />
            </div>
            <div className="input-container textarea">
              <label className="label">Message</label>
              <textarea
                className="input"
                placeholder="Message"
                name="message"
                value={formData.message}
                onChange={inputChangeHandler}
              ></textarea>
              <FormError error={formErrors.message} />
            </div>
            <button type="submit" className="btn">
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

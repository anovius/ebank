/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from "react";
import "../styles.scss";

import Auth from "../../../api/auth";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../actions/authActions";

import Alert from "../../../components/Alert";

import Input from "../Input";
import User from "../../../api/user";

function Forgot() {
  const [emailError, setEmailError] = useState(null);

  const [email, setEmail] = useState(null);

  const [user, setUser] = useState(null);
  const [checkTwoFactor, setCheckTwoFactor] = useState(false);

  const [success, setSuccess] = useState("");

  

  const [isSignup, setIsSignup] = useState(false);

  const checkForErrors = () => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const emailValid = email !== null && re.test(email);

    setEmailError(!emailValid ? "Invalid Email Address" : null);

    return emailValid;
  };

  const handleLogin = () => {
    setSuccess("");
    if(checkForErrors()){
      User.forgotPassword({email: email}).then(res => {
        setEmail("")
        setSuccess(res.data.data);
      }).catch(err => {
        setEmailError("No user found with this email");
      })
    }
  };

  useEffect(() => {

  }, []);

  return (
    <main className="login">
      <div>

      <section
        className="box"
        >
        <h2>FORGOT</h2>
        <p>Enter your registered email adderss</p>
        <Input
          label="Email"
          img="email.svg"
          setValue={setEmail}
          isPassword={false}
          type="email"
        />
        {emailError && <Alert text={emailError} error={true} />}
        <div className="buttons">
          <button onClick={handleLogin}>Get Reset Link</button>
        </div>
        <p>{success}</p>
        <div className="bottom">
          <p>
            Try to login?
            <span>
              {" "}
              <Link to="/login">Click Here</Link>
            </span>
          </p>
        </div>
        
      </section>
      <p style={checkTwoFactor ? { display: "none" } : null}>
        {"©"} 2022. All rights reserved.
      </p>
      </div>
    </main>
  );
}

export default Forgot;
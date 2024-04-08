/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from "react";
import "../styles.scss";

import Auth from "../../../api/auth";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../actions/authActions";

import TwoFactorAuth from "./TwoFactorAuth";

import Alert from "../../../components/Alert";

import Input from "../Input";

function Login() {
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [user, setUser] = useState(null);
  const [checkTwoFactor, setCheckTwoFactor] = useState(false);

  

  const [isSignup, setIsSignup] = useState(false);

  const checkForErrors = () => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const passwordValid = password !== null && password.length >= 6;
    const emailValid = email !== null && re.test(email);

    setPasswordError(
      !passwordValid ? "Password should be atleast 6 characters long" : null
    );

    setEmailError(!emailValid ? "Invalid Email Address" : null);

    return passwordValid && emailValid;
  };

  const handleLogin = () => {
    setUser({ email, password });

    if (checkForErrors()) {
      Auth.login({ user: {email, password} }).then((res) => {
        setUser(res.data.data.user);
        setCheckTwoFactor(true);
      }).catch((err) => {
        setPasswordError("Invalid Email or Password");
      })
    }
  };

  useEffect(() => {

    if(window.localStorage.getItem("fromSignup")) {
      setIsSignup(true);
      window.localStorage.removeItem("fromSignup");
    }
    setCheckTwoFactor(false);
  }, []);

  return (
    <main className="login">
      <div>
      
      {checkTwoFactor && <TwoFactorAuth user={user} />}

      <section
        className="box"
        style={checkTwoFactor ? { display: "none" } : null}
        >
        {isSignup && <div class="alert alert-success" role="alert">
      Registration successful. A verification email has been sent to your email address
    </div> }
        <h2>LOG IN</h2>
        <p>Log in with your credentials</p>
        
        <Input
          label="Email"
          img="email.svg"
          setValue={setEmail}
          isPassword={false}
          type="email"
        />
        {emailError && <Alert text={emailError} error={true} />}
        <Input
          label="Password"
          img="lock.svg"
          setValue={setPassword}
          isPassword={true}
          type="text"
          forgotPasswordLink={true}
        />
        {passwordError && <Alert text={passwordError} error={true} />}
        <div className="buttons">
          <button onClick={handleLogin}>LOG IN</button>
          <Link to="/signup">
            <button className="signupButton">SIGN UP</button>
          </Link>
        </div>
        <div className="bottom">
          <p>
            New to EBankc?
            <span>
              {" "}
              <Link to="/signup">Create an account</Link>
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

export default Login;
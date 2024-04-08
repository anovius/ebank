/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from "react";
import "../styles.scss";

import Auth from "../../../api/auth";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../actions/authActions";
import Alert from "../../../components/Alert";

import Input from "../Input";
import User from "../../../api/user";

function Reset() {
  const [passwordError, setPasswordError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordC, setPasswordC] = useState(null);

  const {email, otp} = useParams();
  const navigate = useNavigate();

  const checkForErrors = () => {
   
    const passwordValid = password !== null && password.length >= 6;
  

    setPasswordError(
      !passwordValid ? "Password should be atleast 6 characters long" : null
    );

    if (password !== passwordC) {
      setPasswordError("Passwords do not match");
      return false;
    }

    return passwordValid
  };

  const handleLogin = () => {
    if (checkForErrors()) {
      User.resetPassword({email, otp, password}).then((res) => {
        navigate("/login");
      }).catch((err) => {
        setPasswordError("Reset link expired");
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
        <h2>Reset</h2>

        <Input
          label="Password"
          img="lock.svg"
          setValue={setPassword}
          isPassword={true}
          type="text"
        />

        <Input
          label="Confirm Password"
          img="lock.svg"
          setValue={setPasswordC}
          isPassword={true}
          type="text"
        />
        {passwordError && <Alert text={passwordError} error={true} />}

        <div className="buttons">
          <button onClick={handleLogin}>Reset Password</button>
        </div>
      </section>
      </div>
    </main>
  );
}

export default Reset;
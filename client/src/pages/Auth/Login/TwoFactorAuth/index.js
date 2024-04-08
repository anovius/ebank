import React, { useState, useEffect } from "react";
import "../../styles.scss";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../actions/authActions";

import ReactCodeInput from "react-code-input";

import Alert from "../../../../components/Alert";
import Auth from "../../../../api/auth";

export default function TwoFactorAuth({ user }) {
  const dispatch = useDispatch();
  const twoFactorAuthEnabled = useSelector(
    (state) => state.auth.twoFactorAuthEnabled
  );

  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkForErrors = () => {
    if (code && code.length === 4) {
      setError(null);
      setCode(null);
      return true;
    }

    setError("Invalid code");
    return false;
  };

  const handleContinue = () => {
    if (checkForErrors()) {
      Auth.twoFactor({user: {email: user.email, otp: code}}).then((res) => {
        window.localStorage.setItem("token", res.data.data.user.token);
        if(res.data.data.user.role === 2){
          window.location.reload();
          dispatch(loginUser(res.data.data.user));
        }
        dispatch(loginUser(res.data.data.user));
      }).catch((err) => {
        setError("Invalid OTP");
      })
      // dispatch(loginUser(user));
    }
  };

  useEffect(() => {
    if (!twoFactorAuthEnabled) dispatch(loginUser(user));
  }, [twoFactorAuthEnabled]);

  return (
    <main className="login">
      <div>
      <section className="box">
      <h2>2FA CODE</h2>
      <p>
        Please enter the verification code sent to your Email
      </p>
      <ReactCodeInput
        type="number"
        fields={4}
        onChange={(val) => setCode(val)}
        autoFocus={false}
      />
      {error && <Alert text={error} error={true} />}
      <div className="buttons">
        <button onClick={handleContinue}>CONTINUE</button>
      </div>
      <div className="bottom">
        <p>
          <span>
            <Link to="/lost-device">Lost access to device?</Link>
          </span>
        </p>
      </div>
    </section>
    <p>{"©"} 2022. All rights reserved.</p>
      </div>
    </main>
  );
}
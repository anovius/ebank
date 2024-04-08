import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";

import { Link } from "react-router-dom";

import { useDetectClickOutside } from "react-detect-click-outside";

export default function Input({
  label,
  img,
  setValue,
  isPassword,
  type,
  forgotPasswordLink = false,
}) {
  const [activeInput, setActiveInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useDetectClickOutside({
    onTriggered: () => setActiveInput(false),
  });

  const inputRef = useRef(null);

  useEffect(() => {
    activeInput ? inputRef.current.focus() : inputRef.current.blur();
  }, [activeInput]);

  return (
    <div className="inputContainer" onClick={() => setActiveInput(true)}>
      <div className="top">
        <label htmlFor="input">{label}</label>
        {forgotPasswordLink && (
          <Link to="/forgot">Forgot password?</Link>
        )}
      </div>
      <div
        className="inputBox"
        ref={ref}
        style={
          activeInput
            ? { boxShadow: "rgba(0, 128, 0, 0.3) 0px 0px 0px 3px" }
            : undefined
        }
      >
        <img src={`/images/login/${img}`} alt="Input icon" />
        <input
          id="input"
          ref={inputRef}
          type={isPassword && !isVisible ? "password" : type}
          onChange={(e) => setValue(e.target.value)}
          autoComplete={!isPassword && "email"}
        />
        {isPassword && (
          <img
            className="eye"
            src={`/images/login/${
              !isVisible ? "eyeVisible.svg" : "eyeInvisible.svg"
            }`}
            alt="Eye icon"
            onClick={() => setIsVisible(!isVisible)}
          />
        )}
      </div>
    </div>
  );
}

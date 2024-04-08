/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineKey,
} from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineContentCopy } from "react-icons/md";

import { useDetectClickOutside } from "react-detect-click-outside";

import Modal from "@mui/material/Modal";

import ReactCodeInput from "react-code-input";
import QRCode from "qrcode.react";

import Alert from "../../Alert";

import { useDispatch, useSelector } from "react-redux";
import { enableTwoFactorAuth } from "../../../actions/authActions";

function TextButtonModal({ title, text, button, open, setOpen, setContinue }) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <section className="modalBox">
        <div className="top">
          <h2>{title}</h2>
          <AiOutlineClose onClick={() => setOpen(false)} />
        </div>
        <div className="body">
          <p>{text}</p>
          <button onClick={() => setContinue(true)}>{button}</button>
        </div>
      </section>
    </Modal>
  );
}

function TwoFactorModal({ open, setOpen, setContinue }) {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  const handleConfirm = () => {
    if (code && code.length === 6) {
      setError(null);
      setCode(null);
      setContinue(true);
    } else {
      setError("Invalid code");
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <section className="modalBox modalBoxTwoFactor">
        <div className="top">
          <h2>ENABLE 2FA</h2>
          <AiOutlineClose onClick={() => setOpen(false)} />
        </div>
        <div className="body">
          <Alert
            text="Scan the QR code and enter the 2FA code from your authenticator"
            bgColor="#83ce83"
            includeIcon={false}
          />
          <QRCode
            value="http://facebook.github.io/react/"
            fgColor="darkgreen"
          />
          <h4>NMUTSIJIOAZVO3SWIVFVK3SGEYXHELZ3KZPEC6TFJFMHUYJDGISQ</h4>
          <button className="copyButton">
            <MdOutlineContentCopy color="white" />
            COPY
          </button>
          <h4>2FA code</h4>
          <ReactCodeInput
            type="number"
            fields={6}
            onChange={(val) => setCode(val)}
          />
          {error && <Alert text={error} error={true} />}
          <button onClick={handleConfirm} className="confirmButton">
            CONFIRM
          </button>
        </div>
      </section>
    </Modal>
  );
}

function Input({ label, placeholder, type, icon }) {
  const [activeInput, setActiveInput] = useState(false);

  const ref = useDetectClickOutside({
    onTriggered: () => setActiveInput(false),
  });

  const inputRef = useRef(null);

  useEffect(() => {
    activeInput ? inputRef.current.focus() : inputRef.current.blur();
  }, [activeInput]);

  return (
    <div className="inputContainer" onClick={() => setActiveInput(true)}>
      <label htmlFor="label">{label}</label>
      <div
        className="inputBox"
        ref={ref}
        style={
          activeInput
            ? { boxShadow: "rgba(0, 128, 0, 0.3) 0px 0px 0px 3px" }
            : undefined
        }
      >
        {icon}
        <input
          id="label"
          placeholder={placeholder || ""}
          ref={inputRef}
          type={type}
        />
      </div>
    </div>
  );
}

function ChangePassword({ twoFactorEnabled }) {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (code && code.length === 6) {
      setError(null);
      setCode(null);
    } else {
      setError("Invalid code");
    }
  };

  return (
    <div className="box changePassword">
      <p className="title">Change password</p>
      <div className="body">
        <Alert
          text="If you forgot your password, log out and click “Forgot password?” on the login page to reset it"
          bgColor="#83ce83"
        />
        <Input
          label="Current password"
          icon={<HiOutlineKey />}
          type="password"
        />
        <Input
          label="New password"
          icon={<HiOutlineLockClosed />}
          type="password"
        />
        <Input
          label="Confirm password"
          icon={<HiOutlineLockClosed />}
          type="password"
        />
        {twoFactorEnabled && (
          <div className="twoFactorCode">
            <h4>2FA code</h4>
            <ReactCodeInput
              type="number"
              fields={6}
              onChange={(val) => setCode(val)}
            />
          </div>
        )}
        {error && <Alert text={error} error={true} />}
        <button onClick={handleSubmit}>SUBMIT</button>
        <Alert
          text="This will log you out from all other sessions"
          bgColor="#fff3cd"
        />
      </div>
    </div>
  );
}

function ChangeEmail({ twoFactorEnabled }) {
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (code && code.length === 6) {
      setError(null);
      setCode(null);
    } else {
      setError("Invalid code");
    }
  };

  return (
    <div className="box changeEmail">
      <p className="title">Change email address</p>
      <div className="body">
        <Input
          label="New email address"
          icon={<HiOutlineMail />}
          placeholder="Enter your email"
          type="email"
        />
        {twoFactorEnabled && (
          <div className="twoFactorCode">
            <h4>2FA code</h4>
            <ReactCodeInput
              type="number"
              fields={6}
              onChange={(val) => setCode(val)}
            />
          </div>
        )}
        {error && <Alert text={error} error={true} />}
        <button onClick={handleSubmit}>SUBMIT</button>
      </div>
    </div>
  );
}

function TwoFactorAuth({ twoFactorEnabled, setTwoFactorEnabled }) {
  const [open, setOpen] = useState(false);
  const [continueModal, setContinueModal] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (continueModal) {
      setOpen(false);
      setOpenSecond(true);
      setContinueModal(false);
    }
  }, [continueModal]);

  useEffect(() => {
    if (twoFactorEnabled) {
      setOpen(false);
      setOpenSecond(false);
    }
  }, [twoFactorEnabled]);

  const disable = () => {
    if (code && code.length === 6) {
      setError(null);
      setTwoFactorEnabled(false);
      setCode(null);
    } else {
      setError("Invalid code");
    }
  };

  const handleBtnClick = () => {
    if (twoFactorEnabled) {
      disable();
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="box twoFactorAuth">
      <TextButtonModal
        title="ENABLE 2FA"
        text="Set up 2FA to make your account more secure"
        button="CONTINUE"
        open={open}
        setOpen={setOpen}
        setContinue={setContinueModal}
      />
      <TwoFactorModal
        open={openSecond}
        setOpen={setOpenSecond}
        setContinue={setTwoFactorEnabled}
      />
      <p className="title">Two-factor authentication (2FA)</p>
      <div className="body">
        {!twoFactorEnabled && (
          <div className="reccomended">
            <h4>Reccomended</h4>
            <p>Set up 2FA to make your account more secure</p>
          </div>
        )}

        <p style={twoFactorEnabled ? { marginTop: "6rem" } : undefined}>
          Google Authenticator or Authy
        </p>
        <h3>{twoFactorEnabled ? "ENABLED" : "DISABLED"}</h3>
        <div className="buttonBox">
          {twoFactorEnabled && (
            <div className="twoFactorCode">
              <h4>2FA code</h4>
              <ReactCodeInput
                type="number"
                fields={6}
                onChange={(val) => setCode(val)}
              />
            </div>
          )}
          {error && <Alert text={error} error={true} />}
          <button
            className={!twoFactorEnabled ? "enableBtn" : "disableBtn"}
            onClick={handleBtnClick}
          >
            {!twoFactorEnabled ? "ENABLE" : "DISABLE"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseAcc() {
  const [open, setOpen] = useState(false);
  const [continueModal, setContinueModal] = useState(false);

  useEffect(() => {
    if (continueModal) {
      setOpen(false);
      setContinueModal(false);
    }
  }, [continueModal]);

  return (
    <div className="box closeAcc">
      <TextButtonModal
        title="CLOSE ACCOUNT"
        text="Are you sure you want to close your account? This action cannot be undone!"
        button="CONTINUE"
        open={open}
        setOpen={setOpen}
        setContinue={setContinueModal}
      />
      <p className="title">Close account</p>
      <div className="body">
        <p>
          Click here if you wish to permanently close your EBankc App account.
          You will receive an email with a link to confirm your request, which
          will then be processed by our support team.
        </p>
        <button onClick={() => setOpen(true)}>CLOSE ACCOUNT</button>
      </div>
    </div>
  );
}

function Security() {
  const dispatch = useDispatch();
  const twoFactorEnabledState = useSelector(
    (state) => state.auth.twoFactorAuthEnabled
  );

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    twoFactorEnabledState
  );

  const enable2FA = () => dispatch(enableTwoFactorAuth(twoFactorEnabled));

  useEffect(() => {
    if (twoFactorEnabled !== twoFactorEnabledState) {
      enable2FA();
    }
  }, [twoFactorEnabled]);

  return (
    <main className="security">
      <section className="left">
        <ChangePassword twoFactorEnabled={twoFactorEnabled} />
        <ChangeEmail twoFactorEnabled={twoFactorEnabled} />
      </section>
      <section className="right">
        <TwoFactorAuth
          twoFactorEnabled={twoFactorEnabled}
          setTwoFactorEnabled={setTwoFactorEnabled}
        />
        <CloseAcc />
      </section>
    </main>
  );
}

export default Security;

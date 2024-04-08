import React from "react";
import { Modal } from "@material-ui/core";
import "./styles.scss";

import { Link } from "react-router-dom";

export default function KycPopup({ popup, setPopup }) {
  const handleClose = () => {
    setPopup(0);
  };

  return (
    <Modal open={popup !== 0 ? true : false}>
      <section className="kycpopup">
        <div className="box">
          <div className="headertitle">
            <img
              src="images/close.svg"
              alt="close"
              width={15}
              height={15}
              onClick={handleClose}
              className="firstImg"
            />
            <h1>KYC REQUIRED</h1>
            <img
              src="images/close.svg"
              alt="close"
              width={15}
              height={15}
              onClick={handleClose}
            />
          </div>
          <div className="content">
            <p>
              Please verify your identity with us. It helps to ensure your
              account is secure and in compliance with the law.
            </p>

            <Link to="/settings?openQuery=1">BEGIN KYC</Link>
          </div>
        </div>
      </section>
    </Modal>
  );
}

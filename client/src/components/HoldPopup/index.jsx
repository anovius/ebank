import React, { useEffect } from "react";
import { Modal } from "@material-ui/core";
import "./styles.scss";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { holdAsset } from "../../actions/authActions";

import Alert from "../Alert";
import Transaction from "../../api/transaction";

export default function HoldPopup({ popup, setPopup, asset }) {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);

  const [wallet, setWallet] = useState(null);

  const [error, setError] = useState(null);

  const getAssetFromWallet = (asset) => {
    let index = wallet?.assets.findIndex((a) => a.symbol === asset);
    console.log("asset" ,wallet?.assets[index]);
    return index > -1 ? wallet?.assets[index].amount : 0;
  }

  useEffect(() => {
    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    })
  }, []);

  const btnPercentages = [0.25, 0.5, 0.75, 1];

  const handleClose = () => {
    setPopup(0);
  };

  const handleChange = (e) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleCheck = () => {
    
  };

  const handlePercentage = (index) => {
    let available = getAssetFromWallet("EBCT");

    let newAmount = parseFloat(available * btnPercentages[index - 1]);

    setAmount((amount) => parseFloat(newAmount));
  };

  const handleSubmit = () => {
    let available = getAssetFromWallet("EBCT");

    if (amount > available) {
      setError("Not enough funds.");
      return null;
    }

    let body = {
      hold :{
        asset: "EBCT",
        amount: amount,
      }
    }

    Transaction.hold(body).then((res) => {
      setPopup(0);
    });
  };

  return (
    <Modal open={popup !== 0 ? true : false}>
      <section className="holdpopup">
        <div className="box">
          <div className="headertitle">
            <img
              src="/images/close.svg"
              alt="close"
              width={15}
              height={15}
              onClick={handleClose}
              className="firstImg"
            />
            <h1>HOLD</h1>
            <img
              src="/images/close.svg"
              alt="close"
              width={15}
              height={15}
              value={amount}
              onClick={handleClose}
            />
          </div>
          <div className="content">
            <span className="asset">
              <h4>Asset</h4>
              <div className="assetcontainer">
                <div className="left">
                  <img
                    src="/images/dashboard/ebct.svg"
                    alt="ebct"
                    width={30}
                    height={30}
                  />
                  <span>
                    <h3>EBCT</h3>
                    <h4>EBCT token</h4>
                  </span>
                </div>
                <div className="right">
                  <div className="imgbox">
                    <img
                      src="/images/header/info.svg"
                      alt="info"
                      width={20}
                      height={20}
                    />
                  </div>

                  <div
                    className="infotip
                  "
                  >
                    Upgrade your membership tier and earn additional rewards
                  </div>
                </div>
              </div>
            </span>
            <span className="available">
              <h3>Available</h3>
              <h2>{getAssetFromWallet("EBCT")}</h2>
            </span>

            <span className="amount">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={handleChange}
                onBlur={handleCheck}
              />
              <div className="btnrow">
                <button onClick={() => handlePercentage(1)}>25%</button>
                <button onClick={() => handlePercentage(2)}>50%</button>
                <button onClick={() => handlePercentage(3)}>75%</button>
                <button onClick={() => handlePercentage(4)}>100%</button>
              </div>
            </span>
            {error && <Alert text={error} error={true} />}
            <span className="rewards">
              <h4>Rewards paid daily</h4>
            </span>
            <span className="delegatebox">
              <button
                className={amount > 0.0 ? "delegate" : "delegate disable"}
                onClick={handleSubmit}
                disabled={amount > 0.0 ? false : true}
              >
                DELEGATE
              </button>
            </span>
          </div>
        </div>
      </section>
    </Modal>
  );
}

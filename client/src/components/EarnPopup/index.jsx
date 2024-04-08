/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Modal } from "@material-ui/core";
import "./styles.scss";
import { useState } from "react";
import { useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { holdAsset } from "../../actions/authActions";

import Alert from "../Alert";
import Transaction from "../../api/transaction";
import Asset from "../../api/asset";
import { environment } from "../../constants";

export default function EarnPopup({ popup, setPopup, asset }) {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);

  const [error, setError] = useState(null);

  const [wallet, setWallet] = useState(null);
  const [assets, setAssets] = useState([]);

  const [active, setActive] = useState(0);

  const [open, setOpen] = useState(false);

  const btnPercentages = [0.25, 0.5, 0.75, 1];

  const getAssetFromWallet = (asset) => {
    let index = wallet?.assets.findIndex((a) => a.symbol === asset);
    console.log("asset" ,wallet?.assets[index]);
    return index > -1 ? wallet?.assets[index].amount : 0;
  }

  // const assets = [
  //   {
  //     name: "BTC",
  //     full: "Bitcoin",
  //     icon: "/images/dashboard/bitcoin.svg",
  //   },
  //   {
  //     name: "ETH",
  //     full: "Ethereum",
  //     icon: "/images/dashboard/ethereum.svg",
  //   },
  //   {
  //     name: "BNB",
  //     full: "Binance Coin",
  //     icon: "/images/dashboard/bnb.svg",
  //   },
  //   {
  //     name: "USDC",
  //     full: "USD Coin",
  //     icon: "/images/dashboard/usdc.svg",
  //   },
  //   {
  //     name: "USDT",
  //     full: "Tether",
  //     icon: "/images/dashboard/usdt.svg",
  //   },
  // ];

  const handleClose = () => {
    setPopup(0);
  };

  const handleChange = (e) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleCheck = () => {
    if (amount > getAssetFromWallet(assets[active]?.name)) {
      setAmount(getAssetFromWallet(assets[active]?.name));
    }
  };

  const handlePercentage = (index) => {
    let available = getAssetFromWallet(assets[active].name);

    let newAmount = parseFloat(available * btnPercentages[index - 1]);

    

    setAmount((amount) => parseFloat(newAmount));
  };

  const handleSubmit = () => {
    let available = getAssetFromWallet(assets[active].name);

    if (amount > available) {
      setError("Not enough funds.");
      return null;
    }

    let body = {
      hold :{
        asset: assets[active].name,
        amount: amount,
      }
    }

    Transaction.hold(body).then((res) => {
      setPopup(0);
    }); 
  };

  const handleActive = (ind) => {
    setActive(ind);
    setOpen(false);
  };

  useEffect(() => {
    assets.forEach((assetObject, index) => {
      if (assetObject.name === asset) {
        setActive(index);
      }
    });

    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    })

    Asset.getAll().then((res) => {
      setAssets(res.data.data.assets);
    });
  }, []);

  return (
    <Modal open={popup !== 0 ? true : false}>
      <section className="earnpopup">
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
            <h1>EARN</h1>
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
              {open ? (
                <div className="opencontainer">
                  <div className="absolutecontainer">
                    {assets.map((assetObject, index) => (
                      <>
                        {active === index && assetObject.name !== 'EBCT' && (
                          <div
                            className={
                              active === index
                                ? "assetcontainer active"
                                : "assetcontainer"
                            }
                            onClick={() => handleActive(index)}
                          >
                            <div className="left">
                              <img
                                src={ environment.file_url + "/" + assetObject.icon}
                                alt={assetObject.name}
                                width={30}
                                height={30}
                              />
                              <span>
                                <h3>{assetObject.name}</h3>
                                <h4>{assetObject.full}</h4>
                              </span>
                            </div>
                            {active === index && <MdKeyboardArrowDown />}
                          </div>
                        )}
                      </>
                    ))}
                    {assets.map((assetObject, index) => (
                      <>
                        {active !== index && assetObject.name !== 'EBCT' &&  (
                          <div
                            className={
                              active === index
                                ? "assetcontainer active"
                                : "assetcontainer"
                            }
                            onClick={() => handleActive(index)}
                          >
                            <div className="left">
                              <img
                                src={ environment.file_url + "/" + assetObject.icon}
                                alt={assetObject.name}
                                width={30}
                                height={30}
                              />
                              <span>
                                <h3>{assetObject.name}</h3>
                                <h4>{assetObject.full}</h4>
                              </span>
                            </div>
                            {active === index && <MdKeyboardArrowDown />}
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {assets.map((assetObject, index) => (
                    <>
                      {index === active && assetObject.name !== 'EBCT' && (
                        <div
                          className="assetcontainer"
                          onClick={() => setOpen((open) => !open)}
                        >
                          <div className="left">
                            <img
                              src={ environment.file_url + "/" + assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {!open ? (
                            <MdKeyboardArrowUp />
                          ) : (
                            <MdKeyboardArrowDown />
                          )}
                        </div>
                      )}
                    </>
                  ))}
                </>
              )}
            </span>
            <span className="available">
              <h3>Available</h3>
              <h2>{getAssetFromWallet(assets[active]?.name)}</h2>
              <h4>Your asset will start earning interest after 24 hours</h4>
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
                CONFIRM
              </button>
            </span>
            <span className="important">
              <div className="b">
                <h4>IMPORTANT!</h4>
                <p>Min amount: {assets[active]?.min} {assets[active]?.name}</p>
              </div>
            </span>
          </div>
        </div>
      </section>
    </Modal>
  );
}

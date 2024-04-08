import React, { useState } from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import HoldPopup from "../HoldPopup";
import RedeemPopup from "../RedeemPopup";
import DepositWithdrawPopup from "../DepositWithdrawPopup";
import EarnPopup from "../EarnPopup";

import { useLocation } from "react-router-dom";

function BottomMenu() {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState(0);
  const [asset, setAsset] = useState();

  const handleOpen = () => {
    setOpen((open) => !open);
  };

  const handlePopup = (prop1, prop2 = undefined) => {
    setPopup((popup) => prop1);
    if (prop2 !== undefined) {
      setAsset((asset) => prop2);
    }

    setOpen((open) => false);
  };

  const getPopup = () => {
    switch (popup) {
      case 1:
        return <HoldPopup popup={popup} setPopup={setPopup} asset={asset} />;
      case 2:
        return <RedeemPopup popup={popup} setPopup={setPopup} asset={asset} />;
      case 3:
        return <EarnPopup popup={popup} setPopup={setPopup} asset={asset} />;
      case 4:
        return (
          <DepositWithdrawPopup
            popup={popup}
            setPopup={setPopup}
            type={"deposit"}
          />
        );
      case 5:
        return (
          <DepositWithdrawPopup
            popup={popup}
            setPopup={setPopup}
            type={"withdraw"}
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <>
          {popup !== 0 && getPopup()}
          {open ? (
            <footer className="menu">
              <div className="content">
                <ul>
                  <li>
                    <button onClick={() => handlePopup(4)}>
                      <img
                        src="/images/header/deposit.svg"
                        alt="deposit"
                        width={30}
                        height={30}
                      />
                      <h5>DEPOSIT</h5>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handlePopup(5)}>
                      <img
                        src="/images/header/withdraw.svg"
                        alt="withdraw"
                        width={30}
                        height={30}
                      />
                      <h5>WITHDRAW</h5>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handlePopup(3, "BTC")}>
                      <img
                        src="/images/navigation/earn.svg"
                        alt="earn"
                        width={30}
                        height={30}
                      />
                      <h5>EARN</h5>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handlePopup(2, "BTC")}>
                      <img
                        src="/images/dashboard/redeem.svg"
                        alt="redeem"
                        width={30}
                        height={30}
                      />
                      <h5>REDEEM</h5>
                    </button>
                  </li>
                  <li>
                    <Link to="/convert" onClick={() => setOpen(false)}>
                      <img
                        src="/images/navigation/convert.svg"
                        alt="convert"
                        width={30}
                        height={30}
                      />
                      <h5>CONVERT</h5>
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => handlePopup(1, "EBCT")}>
                      <img
                        src="/images/dashboard/stake.svg"
                        alt="stake"
                        width={30}
                        height={30}
                      />
                      <h5>HOLD EBCT</h5>
                    </button>
                  </li>
                </ul>
                <div className="btnbox">
                  <button onClick={handleOpen}>
                    <MdKeyboardArrowDown size={30} color="white" />
                  </button>
                </div>
              </div>
            </footer>
          ) : (
            <footer className="footerMenu">
              <div className="content">
                <ul>
                  <li>
                    <Link to="/dashboard">
                      <img
                        src="/images/navigation/dashboard.svg"
                        alt="dashboard"
                        width={20}
                        height={20}
                      />
                      <h5>Dashboard</h5>
                    </Link>
                  </li>
                  <li>
                    <Link to="/wallet">
                      <img
                        src="/images/navigation/wallet.svg"
                        alt="wallet"
                        width={20}
                        height={20}
                      />
                      <h5>Wallet</h5>
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleOpen}>
                      <MdKeyboardArrowUp size={30} color="white" />
                    </button>
                  </li>
                  <li>
                    <Link to="/earn">
                      <img
                        src="/images/navigation/earn.svg"
                        alt="earn"
                        width={20}
                        height={20}
                      />
                      <h5>Earn</h5>
                    </Link>
                  </li>
                  <li>
                    <Link to="/ebct">
                      <img
                        src="/images/navigation/ebnk.svg"
                        alt="ebct"
                        width={20}
                        height={20}
                        className="ebct"
                      />
                      <h5>EBCT</h5>
                    </Link>
                  </li>
                </ul>
              </div>
            </footer>
          )}
        </>
      )}
    </>
  );
}

export default BottomMenu;

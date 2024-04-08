/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import DepositWithdrawPopup from "../DepositWithdrawPopup";
import MobileMenu from "../MobileMenu";
import RedeemPopup from "../RedeemPopup";
import EarnPopup from "../EarnPopup";
import BorrowPopup from "../BorrowPopup";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/authActions";
import { setVisible } from "../../actions/configActions";
import { useLocation } from "react-router-dom";
import { Modal } from "@material-ui/core";
import Transaction from "../../api/transaction";
import Asset from "../../api/asset";
import KYC from "../../api/kyc";
import { environment } from "../../constants";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header({ page }) {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.config.isVisible);
  const [prices, setPrices] = useState([]);
  const user = useSelector((state) => state.auth.user);
  

  const location = useLocation();

  const [level, setLevel] = useState(1);

  const [myStats, setMyStats] = useState({});

  const [menu, setMenu] = useState(false);

  const [amount, setAmount] = useState(0);

  const [error, setError] = useState(null);

  const [active, setActive] = useState(0);
  const [active2, setActive2] = useState(0);

  const [activeCol, setActiveCol] = useState(null);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const btnPercentages = [0.25, 0.5, 0.75, 1];

  const [wallet, setWallet] = useState(null);
  const [assets, setAssets] = useState([]);

  const repayAssets = [
    {
      "id": "62b16495ce2d192cd924a838",
      "icon": "/uploads/usdt.svg",
      "name": "USDT",
      "full": "USDT",
      "min": 0.161678,
      "max": 234,
      "conversion": 0.01138,
      "percentageCharge": 0.02,
      "fixCharge": 0,
      "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "status": 1,
      "karmaOne": 3,
      "karmaTwo": 5,
      "karmaThree": 7,
      "karmaFour": 9,
      "walletAddress": "0xF354582e017B363254550e8e06A558596920eb20"
    },
    {
      "id": "62b16495ce2d192cd924a83b",
      "icon": "/uploads/usdc.svg",
      "name": "USDC",
      "full": "USDC",
      "min": 0.161678,
      "max": 234,
      "conversion": 0.01138,
      "percentageCharge": 0.02,
      "fixCharge": 0,
      "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "status": 1,
      "karmaOne": 3,
      "karmaTwo": 5,
      "karmaThree": 7,
      "karmaFour": 9,
      "walletAddress": "0xF354582e017B363254550e8e06A558596920eb20"
    }
  ];

  const levels = [
    { name: "Karma lvl 1", img: "bronze.svg", amount: 0 },
    { name: "Karma lvl 2", img: "silver.svg", amount: 50000 },
    { name: "Karma lvl 3", img: "gold.svg", amount: 200000 },
    { name: "Karma lvl 4", img: "diamond.svg", amount: 1000000 },
  ];

  const getLevel = () => {
    let holding = parseFloat(user.wallet.assets["EBCT"].holding);

    for (let i = 0; i < levels.length; i++) {
      if (i === 3) {
        setLevel(i + 1);
        return;
      } else {
        if (holding >= levels[i].amount && holding < levels[i + 1].amount) {
          setLevel(i + 1);
          return;
        }
      }
    }
  };

  const getCollateral = (name) => {
    return assets.findIndex((asset) => {
      if (asset.name === name) {
        return asset;
      }
    })
  }

  useEffect(() => {
    getLevel();

    Asset.getMyAssets().then(
      res => {
        console.log(res.data.data);
        setMyStats(res.data.data);
      }
    );


    KYC.getLevel().then((res) => {
      console.log(res.data);
      setLevel(res.data.data.level);
    });

    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
      Asset.getAll().then((resp) => {
        setAssets(resp.data.data.assets);
        setActiveCol(res.data.data.wallet.usdtBorrow);
        let index = resp.data.data.assets.findIndex((asset) => { return asset.name === res.data.data.wallet.usdtBorrow.collateralSymbol});
        setActive(index);
        let am = res.data.data.wallet.assets.findIndex((a) => a.symbol === "USDT");
        am = res.data.data.wallet.assets[am].amount;
        console.log("===================",am);
        if(am < res.data.data.wallet.usdtBorrow.amount + res.data.data.wallet.usdtBorrow.interest){
          setMsg("Total USDC in wallet is less than the amount have to repay. Rest of the amount will be deducted from collateral.");
        }
      });

    })

    Asset.getPrices().then((res) => {
      setPrices(res.data.data);
    })


  }, []);

  const handleChange = (e) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleCheck = () => {
    if (amount > 10000) {
      setAmount(10000);
    }
  };

  const handleActive = (ind) => {
    setActive(ind);
    setOpen(false);
  };

  const [msg, setMsg] = useState("");

  const handleActive2 = (ind) => {
    setActive2(ind);
    if(repayAssets[ind].name === 'USDC'){
      let index = assets.findIndex((asset) => { return asset.name === wallet.usdcBorrow.collateralSymbol});
      if(getAssetFromWallet("USDC") < wallet.usdcBorrow.amount + wallet.usdcBorrow.interest){
        setMsg("Total USDC in wallet is less than the amount have to repay. Rest of the amount will be deducted from collateral.");
      }else{
        setMsg("");
      }
      setActive(index);
      setActiveCol(wallet.usdcBorrow);
    }else{
      let index = assets.findIndex((asset) => { return asset.name === wallet.usdtBorrow.collateralSymbol});
      setActive(index);
      if(getAssetFromWallet("USDT") < wallet.usdtBorrow.amount + wallet.usdtBorrow.interest){
        setMsg("Total USDT in wallet is less than the amount have to repay. Rest of the amount will be deducted from collateral.");
      }else{
        setMsg("");
      }
      setActiveCol(wallet.usdtBorrow);
    }
    setOpen2(false);
  };


  const handleSubmit = () => {
    let body = {
      asset: repayAssets[active2].name,
    }

    Transaction.repay(body).then((res) => {
      setModal(false);
    })
  }

  const routeInfo = {
    Dashboard: {
      icon: "/images/navigation/dashboard.svg",
      subtitle: "Account value",
      tooltip:
        "This is the aggregate sum of all of your balances on the platform, converted into USD. The sum includes all wallet balances, stake balances and hold balances. It does not include pending balances or balances on hold.",
      btn1: "DEPOSIT",
      btn1Icon: "/images/header/deposit.svg",
      btn2: "WITHDRAW",
      btn2Icon: "/images/header/withdraw.svg",
    },
    Wallet: {
      icon: "/images/navigation/wallet.svg",
      subtitle: "Available",
      tooltip: "The value of your wallet balances, estimated in USD",
      btn1: "DEPOSIT",
      btn1Icon: "/images/header/deposit.svg",
      btn2: "WITHDRAW",
      btn2Icon: "/images/header/withdraw.svg",
    },
    Earn: {
      icon: "/images/navigation/earn.svg",
      subtitle: "Total Holding",
      tooltip:
        "Estimated total value of your staked, holding and holding assets, expressed in USD",
      btn1: "EARN",
      btn1Icon: "/images/dashboard/earn.svg",
      btn2: "REDEEM",
      btn2Icon: "/images/dashboard/redeem.svg",
    },
    Borrow: {
      icon: "/images/navigation/earn.svg",
      subtitle: "Total Borrowing",
      tooltip:
        "Estimated total value of your staked, holding and holding assets, expressed in USD",
      btn1: "BORROW",
      btn1Icon: "/images/dashboard/earn.svg",
      btn2: "REPAY LOAN",
      btn2Icon: "/images/dashboard/redeem.svg",
    },
    EBCT: {
      icon: "/images/ebct.svg",
      subtitle: "Total amount",
      tooltip: "",
      btn1: "DEPOSIT",
      btn1Icon: "/images/header/deposit.svg",
      btn2: "WITHDRAW",
      btn2Icon: "/images/header/withdraw.svg",
    },
    Convert: {
      icon: "/images/navigation/convert.svg",
      subtitle: "Total amount",
      tooltip: "",
      removeBottom: true,
    },
    Buy: {
      icon: "/images/navigation/buy.svg",
      subtitle: "",
      tooltip: "",
      removeBottom: true,
    },
    Transactions: {
      icon: "/images/navigation/transaction.svg",
      subtitle: "Total amount",
      tooltip: "",
      removeBottom: true,
    },
    Support: {
      icon: "/images/navigation/support.png",
      subtitle: "Total amount",
      tooltip: "",
      removeBottom: true,
    },
    Referral: {
      icon: "/images/navigation/invite.svg",
      subtitle: "Total amount",
      tooltip: "",
      removeBottom: true,
    },
    Settings: {
      icon: "/images/settings/activity.svg",
      subtitle: "Total amount",
      tooltip: "",
      removeBottom: true,
    },
  };

  const calcAssetWalletValue = (asset, turnToString = true) => {
    const val = user.wallet.assets[asset].wallet * prices[asset];

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const getAssetFromWallet = (asset) => {
    let index = wallet.assets.findIndex((a) => a.symbol === asset);
    return index > -1 ? wallet.assets[index].amount : 0;
  }

  const calcAssetholdingValue = (asset, turnToString = true) => {
    const val = user.wallet.assets[asset].holding * prices[asset];

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetBorrowValue = (asset, turnToString = true) => {
    const val = (user.wallet.assets[asset].borrowed || 0) * prices[asset];

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetTotalValue = (asset, turnToString = true) => {
    const val =
      calcAssetWalletValue(asset, false) + calcAssetholdingValue(asset, false);

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const getAccValue = () => {
    let sum = 0;

    if (page === "EBCT") {
      sum = myStats.totalEbct;
      return (Math.round(sum * 100) / 100).toLocaleString("en-US");
    }

    let val = 0;

      switch (page) {
        case "Wallet":
          val = myStats.inWallet;
          break;
        case "Earn":
          val = myStats.totalHolding;
          break;
        case "Borrow":
          val = myStats.totalBorrow;
          break;
        default:
          val = myStats.total;
          break;
      }

      if(!val) return 0;

    
    if(page === "Earn") return val.toFixed(6);

    return (Math.round(val * 100) / 100).toLocaleString("en-US");
  };

  const [dropdown, setDropdown] = useState(false);
  const [buttonPopup, setButtonPopup] = useState(0);

  const handleVisible = () => {
    dispatch(setVisible(!isVisible));
  };

  const handleButton = (type) => {
    console.log(type);
    switch (type) {
      case "DEPOSIT":
        setButtonPopup(1);
        break;
      case "WITHDRAW":
        setButtonPopup(2);
        break;
      case "EARN":
        setButtonPopup(3);
        break;
      case "REDEEM":
        setButtonPopup(4);
        break;
      case "BORROW":
        setButtonPopup(5);
        break;
      case "REPAY LOAN":
        setModal(true);
        break;
      default:
        break;
    }
  };

  const getButtonPopup = () => {
    switch (buttonPopup) {
      case 1:
        return (
          <DepositWithdrawPopup
            popup={buttonPopup}
            setPopup={setButtonPopup}
            type={"deposit"}
          />
        );
      case 2:
        return (
          <DepositWithdrawPopup
            popup={buttonPopup}
            setPopup={setButtonPopup}
            type={"withdraw"}
          />
        );
      case 3:
        return (
          <EarnPopup
            popup={buttonPopup}
            setPopup={setButtonPopup}
            asset="USDT"
          />
        );
      case 4:
        return <RedeemPopup popup={buttonPopup} setPopup={setButtonPopup} />;
      case 5:
        return <BorrowPopup popup={buttonPopup} setPopup={setButtonPopup} />;
      default:
        break;
    }
  };

  const handleMenu = () => {
    setMenu((menu) => !menu);
  };

  const [modal, setModal] = useState(false);

  const [repayAsset, setRepayAsset] = useState("");

  const [hasError, setErrors] = useState(false);

  const handleRepayAsset = () => {
    Transaction.repay({asset: repayAsset}).then((res) => {
      setModal(false);
    }).catch((err) => {
      setErrors(true);
    })
  }

  const handleClose = () => {
    setModal(false);
  }



  return (
    <>
      <header className="mainheader">
      {menu && <MobileMenu />}
      {buttonPopup !== 0 && getButtonPopup()}
      <div
        className={
          location.pathname !== "/buy" &&
          location.pathname !== "/convert" &&
          location.pathname !== "/transactions" &&
          location.pathname !== "/settings"
            ? "mRow"
            : "mRow without"
        }
      >
        <span className="mTitle">
          <img
            src={routeInfo[page].icon}
            alt="routeIcon"
            width={30}
            height={30}
          />
          <h1>{page}</h1>
        </span>
        <span className="mInfo">
          <img
            src={`/images/karma/${levels[level - 1].img}`}
            alt="level"
            width={25}
            height={25}
            className="mOutside level"
          />
          <div className="rmobile">
            <img
              src={menu ? "/images/close.svg" : "/images/header/menu.svg"}
              alt="menu"
              width={menu ? 20 : 25}
              height={menu ? 20 : 25}
              className="menubtn"
              onClick={handleMenu}
            />
          </div>
          <div className="rtwo">
            <img
              src="/images/header/notification.svg"
              alt="level"
              width={25}
              height={25}
              className="mOutside mBell"
            />
            <div className="notificationdropdown">
              <h3>Notifications - 0 New</h3>
              {user.notifications.map((each) => (
                <span>
                  <h4>{each.action}</h4>
                  <h6>{each.time}</h6>
                </span>
              ))}
            </div>
            <div
              className="mMenu"
              onClick={() => setDropdown((dropdown) => !dropdown)}
            >
              <div className="mColumn">
                <h3>EBankc App User</h3>
                <h4>{levels[level - 1].name} Tier</h4>
              </div>
              {!dropdown ? (
                <img
                  src="/images/header/down.svg"
                  alt="down"
                  width={20}
                  height={20}
                  className="dropicon"
                />
              ) : (
                <img
                  src="/images/header/up.svg"
                  alt="up"
                  height={20}
                  width={20}
                  className="dropicon"
                />
              )}
              {dropdown && (
                <div className="mDropdown">
                  <ul>
                    <li>
                      <Link to="/settings">
                        <img
                          src="/images/header/settings.svg"
                          alt="settings"
                          width={20}
                          height={20}
                        />
                        <h3>Settings</h3>
                      </Link>
                    </li>
                    <li>
                      <Link to="/support">
                        <img
                          src="/images/header/support.svg"
                          alt="support"
                          width={20}
                          height={20}
                        />
                        <h3>Support</h3>
                      </Link>
                    </li>
                    <li onClick = {() => {
                      let link = environment.frontend_url + "/signup?referralCode=" + window.localStorage.getItem("referralCode");
                      // copy this link to clipboard
                      navigator.clipboard.writeText(link);
                      toast.success('Link Copied to Clipboard', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                    }}>
                        <a href="javascript:void(0)"><img
                          src="/images/header/invite.svg"
                          alt="support"
                          width={20}
                          height={20}
                        />
                        <h3>Invite Someone</h3></a>
                    </li>
                    <li>
                      <Link to="/" onClick={() => dispatch(logout())}>
                        <img
                          src="/images/header/logout.svg"
                          alt="logout"
                          width={20}
                          height={20}
                        />
                        <h3>Logout</h3>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </span>
      </div>
      {routeInfo[page] && !routeInfo[page].removeBottom && (
        <div className="mRow">
          <span className="mLeft">
            <span>
              {routeInfo[page].subtitle}
              <img
                onClick={handleVisible}
                src={
                  isVisible
                    ? "/images/header/crossed.svg"
                    : "/images/header/eye.svg"
                }
                alt="eye"
                width={20}
                height={20}
                className="mEye"
              />
            </span>
            <span>
              <h1>{isVisible ? `${"$" + getAccValue() || "0.00"}` : "---"}</h1>
              {routeInfo[page].tooltip !== "" && (
                <>
                  <img
                    src="/images/header/info.svg"
                    alt="eye"
                    width={20}
                    height={20}
                    className="mInfo"
                  />
                  <p className="mTooltip">{routeInfo[page].tooltip}</p>
                </>
              )}
            </span>
          </span>
          <div className="mRight">
            {routeInfo[page].btn1 && (
              <button onClick={() => handleButton(routeInfo[page].btn1)}>
                <img
                  src={routeInfo[page].btn1Icon}
                  alt="btnIcon"
                  width={20}
                  height={20}
                />
                <h3>{routeInfo[page].btn1}</h3>
              </button>
            )}
            {routeInfo[page].btn2 && (
              <button onClick={() => handleButton(routeInfo[page].btn2)}>
                <img
                  src={routeInfo[page].btn2Icon}
                  alt="btnIcon"
                  width={20}
                  height={20}
                />
                <h3>{routeInfo[page].btn2}</h3>
              </button>
            )}
          </div>
        </div>
      )}
      </header>
      <Modal open = {modal} onClose={handleClose}>
      <section className="redeempopup">
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
          <h1>Repay</h1>
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
        <span className="available">
            <h4>Repayment Due = ${activeCol?.amount + activeCol?.interest}</h4>
            <h4>Locked Collateral = ${activeCol?.collateral * prices[activeCol?.collateralSymbol]}</h4>
          </span>
          <span className="asset">
            <h4>Choose Repayment Options</h4>
            {open2 ? (
              <div className="opencontainer">
                <div className="absolutecontainer">
                  {repayAssets.map((assetObject, index) => (
                    <>
                      {active2 === index && (
                        <div
                          className={
                            active2 === index
                              ? "assetcontainer active"
                              : "assetcontainer"
                          }
                          onClick={() => handleActive2(index)}
                        >
                          <div className="left">
                            <img
                              src={environment.file_url + "/" + assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {active2 === index && <MdKeyboardArrowDown />}
                        </div>
                      )}
                    </>
                  ))}
                  {repayAssets.map((assetObject, index) => (
                    <>
                      {active2 !== index && (
                        <div
                          className={
                            active2 === index
                              ? "assetcontainer active"
                              : "assetcontainer"
                          }
                          onClick={() => handleActive2(index)}
                        >
                          <div className="left">
                            <img
                              src={environment.file_url + "/" +assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {active2 === index && <MdKeyboardArrowDown />}
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {repayAssets.map((assetObject, index) => (
                  <>
                    {index === active2 && (
                      <div
                        className="assetcontainer"
                        onClick={() => setOpen2(!open2)}
                      >
                        <div className="left">
                          <img
                            src={environment.file_url + "/" +assetObject.icon}
                            alt={assetObject.name}
                            width={30}
                            height={30}
                          />
                          <span>
                            <h3>{assetObject.name}</h3>
                            <h4>{assetObject.full}</h4>
                          </span>
                        </div>
                        {!open2 ? (
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

          <span className="asset">
            <h4>Collateral Asset</h4>
              <>
                {assets.map((assetObject, index) => (
                  <>
                    {index === active && (
                      <div
                        className="assetcontainer"
                        onClick={() => setOpen((open) => !open)}
                      >
                        <div className="left">
                          <img
                            src={environment.file_url + "/" +assetObject.icon}
                            alt={assetObject.name}
                            width={30}
                            height={30}
                          />
                          <span>
                            <h3>{assetObject.name}</h3>
                            <h4>{assetObject.full}</h4>
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </>
          </span>

          <span className="delegatebox">
            <button
              className={"delegate"}
              onClick={handleSubmit}
            >
              REPAY
            </button>
            </span>
            <p style={{marginTop:'20px', color: 'red'}}>{msg}</p>
        </div>
      </div>
    </section>
        </Modal> 
        <ToastContainer /> 
    </>
  );
}

export default Header;

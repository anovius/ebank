/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Modal } from "@material-ui/core";
import "./styles.scss";
import { useState } from "react";
import { useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


import { useMoralisWeb3Api, useMoralis } from "react-moralis";

import { useDispatch, useSelector } from "react-redux";
import { borrowAsset } from "../../actions/authActions";

import Alert from "../Alert";

import { motion } from "framer-motion";
import Transaction from "../../api/transaction";

function Dropdown({ open, setOpen, data, active, setActive }) {
  const dropdownVariants = {
    open: { opacity: 1, display: "flex" },
    closed: { opacity: 0, display: "none" },
  };

  return (
    <div
      className="dropdown"
      onClick={() => setOpen(!open)}
      style={
        open
          ? {
              boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px",
            }
          : undefined
      }
    >
      <p>{data[active]}</p>
      <MdKeyboardArrowDown />
      <motion.div
        className="dropdownData"
        animate={open ? "open" : "closed"}
        variants={dropdownVariants}
        transition={{ duration: 0.2 }}
      >
        {data.map((val, i) => (
          <p
            key={i}
            className={i === active ? "active" : undefined}
            onClick={() => setActive(i)}
          >
            {val}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

export default function BorrowPopup({ popup, setPopup }) {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [assetAmount, setAssetAmount] = useState(0);
  const [collateralAmount, setCollateralAmount] = useState(0);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [error, setError] = useState(null);

  const [activeAsset, setActiveAsset] = useState(1);
  const [activeCollateral, setActiveCollateral] = useState(0);

  const truncate = (amount) => {
    let truncated = Math.trunc(amount);

    if (parseFloat(amount - truncated) >= parseFloat(0.000001)) {
      return parseFloat(amount).toFixed(5);
    } else {
      return Math.round(amount);
    }
  };

  const Web3Api = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const assets = [
    {
      name: "USDC",
      full: "USD Coin",
      icon: "/images/dashboard/usdc.svg",
    },
    {
      name: "USDT",
      full: "Tether",
      icon: "/images/dashboard/usdt.svg",
    },
  ];

  const [wallet, setWallet] = useState({
    assets: [
      {
        name: "BTC",
        amount: 0,
      }
    ],
  });

  const [prices, setPrices] = useState([]);

  const getAssetFromWallet = (asset) => {
    let index = wallet.assets.findIndex((a) => a.symbol === asset);
    return index > -1 ? wallet.assets[index].amount : 0;
  }

  async function getLivePrice(address){
    if(!address) return 0;
    const options = {
      address: address,
      chain: "bsc",
    };
    const price = await Web3Api.token.getTokenPrice(options);
    console.log(price.usdPrice);
    return price.usdPrice;
  }

  const refreshPrices = async () => {
    setInterval(async () => {
      tempAssets.forEach(async (asset) => {
        let tempPrices = prices;
        tempPrices[asset.name] = 0;
        tempPrices[asset.name] = await getLivePrice(asset.address);
        setPrices(tempPrices);
      })
      let collateralVal = prices[collaterals[activeCollateral].name];
      setCollateralAmount((2 * assetAmount) / collateralVal || 0);
    }, 10000);
  }

  useEffect(() => {
    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    });
    tempAssets.forEach(async (asset) => {
      let tempPrices = prices;
      tempPrices[asset.name] = 0;
      tempPrices[asset.name] = await getLivePrice(asset.address);
      console.log(tempPrices);
      setPrices(tempPrices);
    })
    refreshPrices();
  }, [isInitialized]);

  const tempAssets = [
    {
      name: "BTC",
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"
    },
    {
      name: "ETH",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
    },
    {
      name: "BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    }
  ];

  const collaterals = [
    {
      name: "BTC",
      full: "Bitcoin",
      icon: "/images/dashboard/bitcoin.svg",
    },
    {
      name: "ETH",
      full: "Ethereum",
      icon: "/images/dashboard/ethereum.svg",
    },
    {
      name: "BNB",
      full: "Binance Coin",
      icon: "/images/dashboard/bnb.svg",
    },
  ];

  const handleClose = () => {
    setPopup(0);
  };

  const handleChange = (e) => {
    let amount = parseFloat(e.target.value);

    let collateralVal = prices[collaterals[activeCollateral].name];

    if(collateralVal === 0) return;

    setAssetAmount(amount);
    setCollateralAmount((2 * amount) / collateralVal || 0);
  };

  const handleSubmit = () => {
    if(collateralAmount === 0) return;
    let asset = assets[activeAsset].name;
    if(wallet.isUSDCBorrowed && asset === 'USDC') {
      setError('You already have a USDC loan');
      return;
    }
    if(wallet.isUSDTBorrowed && asset === 'USDT') {
      setError('You already have a USDT loan');
      return;
    }

    let collateral = collaterals[activeCollateral].name;

    let available = getAssetFromWallet(collateral);
    
    if (collateralAmount > available) {
      setError("Not enough funds.");
      return null;
    }
    
    let body = {
      borrow:{
        amount: assetAmount,
        amountSymbol: asset,
        collateral: collateralAmount,
        collateralSymbol: collateral,
      }
    }

    Transaction.borrow(body).then((res) => {
      setPopup(0);
    })

    setError(null);
  };

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
            <h1>BORROW</h1>
            <img
              src="/images/close.svg"
              alt="close"
              width={15}
              height={15}
              onClick={handleClose}
            />
          </div>
          <div className="body">
            <label>Credit Amount</label>
            <div className="inputContainer">
              <p>$</p>
              <input
                placeholder="5000"
                defaultValue={assetAmount}
                onChange={handleChange}
              />
              <Dropdown
                open={openDropdown === 0}
                setOpen={(open) => setOpenDropdown(open ? 0 : null)}
                data={assets.map((asset) => asset.name)}
                active={activeAsset}
                setActive={setActiveAsset}
              />
            </div>
            <label>Collateral Required</label>
            <div className="inputContainer">
              <p className="collateralAmount">{truncate(collateralAmount)}</p>

              <Dropdown
                open={openDropdown === 1}
                setOpen={(open) => setOpenDropdown(open ? 1 : null)}
                data={collaterals.map((asset) => asset.name)}
                active={activeCollateral}
                setActive={setActiveCollateral}
              />
            </div>
            {error && <Alert text={error} error={true} />}
            <button onClick={handleSubmit}>Borrow</button>
          </div>
          
        </div>
      </section>
    </Modal>
  );
}

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import "./styles.scss";
import { Link } from "react-router-dom";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import WalletMobile from "../WalletMobile";
import HoldPopup from "../../components/HoldPopup";
import RedeemPopup from "../../components/RedeemPopup";
import EarnPopup from "../../components/EarnPopup";
import DepositWithdrawPopup from "../../components/DepositWithdrawPopup";
import Transaction from "../../api/transaction";

import { useSelector } from "react-redux";
import Asset from "../../api/asset";
import { environment } from "../../constants";

function Wallet() {

  const [prices, setPrices] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const transactionsData = useSelector(
    (state) => state.transaction.transactions
  );

  useEffect(() => {
    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
      setIsVisible(true);
    })

    Asset.getAll().then((res) => {
      setAssets(res.data.data.assets);
    });

    Transaction.getAll().then((res) => {
      setTransactions(res.data.data.transactions);
    });

    Asset.getPrices().then((res) => {
      setPrices(res.data.data);
    })
  }, [transactionsData]);

  const formatDate = (date) => {
    let newDate = new Date(date);
    let month = newDate.getMonth();
    let day = newDate.getDate();
    let year = newDate.getFullYear();

    if (month === 12) {
      month = 1;
    } else {
      month++;
    }

    return `${day}/${month}/${year}`;
  }

  const [transactions, setTransactions] = useState([]);

  const calcAssetWalletValue = (value, asset, turnToString = true) => {
    const val =
      Math.round(value * prices[asset] * 100) / 100;

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetholdingValue = (asset, turnToString = true) => {
    const val =
      Math.round(getAssetFromWallet(assets[asset]) * prices[asset] * 100) / 100;

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const [popup, setPopup] = useState(0);
  const [asset, setAsset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [assets, setAssets] = useState([]);

  const getAssetFromWallet = (asset) => {
    try{
      let index = wallet.assets.findIndex((a) => a.symbol === asset);
    console.log("asset" ,wallet.assets[index]);
    return index > -1 ? wallet.assets[index].amount : 0;
    }
    catch(e){
      return 0;
    }
  }

  const getHoldingFromWallet = (asset) => {
    let index = wallet?.assets.findIndex((a) => a.symbol === asset);
    console.log("asset" ,wallet?.assets[index]);
    return index > -1 ? wallet?.assets[index].holding : 0;
  }

  const truncate = (amount) => {
    let truncated = Math.trunc(amount);

    if (parseFloat(amount - truncated) >= parseFloat(0.000001)) {
      return truncated;
    } else {
      return Math.round(amount);
    }
  };

  const [filter, setFilter] = useState({
    asset: 0,
    type: 0,
    status: 0,
    time: 0,
    amount: 0,
  });

  const handleSort = (index) => {
    var keys = Object.keys(filter);
    const trueIndex = index - 1;
    let tempFilter = JSON.parse(JSON.stringify(filter));
    if (tempFilter[keys[trueIndex]] === 2) {
      tempFilter[keys[trueIndex]] = 0;
    } else {
      tempFilter[keys[trueIndex]] = tempFilter[keys[trueIndex]] + 1;
    }

    // eslint-disable-next-line array-callback-return
    keys.map((key, keyIndex) => {
      if (keyIndex === trueIndex) {
        return null;
      } else {
        tempFilter[key] = 0;
      }
    });
    setFilter(tempFilter);
  };

  useEffect(() => {
    let tempTransactions = [];
    let keys = Object.keys(filter);
    let filterBy;
    let order;
    let blacklist = [];

    // eslint-disable-next-line array-callback-return
    keys.map((key) => {
      if (filter[key] !== 0) {
        filterBy = key;
        order = filter[key];
      }
    });

    if (!filterBy) return null;

    let sortColumn = transactions.map((transaction) => {
      return transaction[filterBy];
    });

    if (filterBy === "amount") {
      if (order === 1) {
        sortColumn.sort(function (a, b) {
          return a - b;
        });
      } else if (order === 2) {
        sortColumn.sort(function (a, b) {
          return b - a;
        });
      }
    } else if (filterBy === "time") {
      if (order === 1) {
        sortColumn.sort((a, b) => a - b);
      } else if (order === 2) {
        sortColumn.sort((a, b) => b - a);
      }
    } else {
      sortColumn.sort();
      if (order === 2) {
        sortColumn.reverse();
      }
    }

    sortColumn.forEach((value) => {
      transactions.forEach((transaction, index) => {
        if (transaction[filterBy] === value && !blacklist.includes(index)) {
          tempTransactions.push(transaction);
          blacklist.push(index);
        }
      });
    });

    setTransactions((transactions) => [...tempTransactions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handlePopup = (value, assetPassed) => {
    setPopup((popup) => value);
    setAsset((asset) => assetPassed);
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
    <main className="wallet">
      <Header page="Wallet" />
      <WalletMobile />
      {popup !== 0 && getPopup()}
      <section className="desktop">
        <div className="leftside">
          <div className="largebox">
            <h3>EBCT</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>Asset</th>
                  <th>In wallet</th>
                  <th>Holding</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span>
                      <img
                        src="images/dashboard/ebct.svg"
                        width={25}
                        height={25}
                        alt="ebct"
                      />
                      <h4>EBCT</h4>
                    </span>
                  </td>
                  <td>
                    <div className="column">
                      <h4>
                        {isVisible
                          ? `${getAssetFromWallet("EBCT")}`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${"$" + getAssetFromWallet("EBCT") * (prices["EBCT"] || 0)}`
                          : "--"}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div className="column">
                      <h4>
                        {isVisible
                          ? `${getHoldingFromWallet("EBCT")}`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${"$" + getHoldingFromWallet("EBCT") * (prices["EBCT"] || 0)}`
                          : "---"}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div className="buttons">
                      <button onClick={() => handlePopup(1, "EBCT")}>
                        <span>
                          <img
                            src="images/dashboard/stake.svg"
                            alt="stake"
                            height={15}
                            width={15}
                          />
                          Hold
                        </span>
                      </button>
                      <button onClick={() => handlePopup(2, "EBCT")}>
                        <span>
                          <img
                            src="images/dashboard/lock.svg"
                            alt="lock"
                            height={15}
                            width={15}
                          />
                          Redeem
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="largebox">
            <h3>Assets</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>Asset</th>
                  <th>In wallet</th>
                  <th>Holding</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <>
                  {asset.status === 1 && asset.name !== 'EBCT' && <tr>
                    <td>
                      <span>
                        <img
                          src={ environment.file_url + '/' + asset.icon}
                          width={25}
                          height={25}
                          alt={asset.name}
                        />
                        <h4>{asset.name}</h4>
                      </span>
                    </td>
                    <td>
                      <div className="column">
                        <h4>
                          {isVisible
                            ? `${(
                              getAssetFromWallet(asset.name)
                              )}`
                            : "---"}
                        </h4>
                        <h6>
                          {isVisible
                            ? `${"$" + getAssetFromWallet(asset.name) * (prices[asset.name] || 0)}`
                            : "---"}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <div className="column">
                        <h4>
                          {isVisible
                            ? `${(
                              getHoldingFromWallet(asset.name)
                              )}`
                            : "---"}
                        </h4>
                        <h6>
                          {isVisible
                            ? `${"$" + getHoldingFromWallet(asset.name) * (prices[asset.name] || 0)}`
                            : "---"}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <div className="buttons">
                        <button onClick={() => handlePopup(4, asset.name)}>
                          <span>
                            <img
                              src="images/header/deposit.svg"
                              alt="earn"
                              height={15}
                              width={15}
                            />
                            Deposit
                          </span>
                        </button>
                        <button onClick={() => handlePopup(5, asset.name)}>
                          <span>
                            <img
                              src="images/header/withdraw.svg"
                              alt="redeem"
                              height={15}
                              width={15}
                            />
                            Withdraw
                          </span>
                        </button>
                      </div>
                    </td>
                    </tr>}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rightside">
          <div className="recentactivity">
            <h3>Recent Activity</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>
                    <div className="thBox" onClick={() => handleSort(1)}>
                      Asset
                      {filter.asset === 1 && <MdKeyboardArrowUp />}
                      {filter.asset === 2 && <MdKeyboardArrowDown />}
                    </div>
                  </th>
                  <th>
                    <div className="thBox" onClick={() => handleSort(2)}>
                      Type
                      {filter.type === 1 && <MdKeyboardArrowUp />}
                      {filter.type === 2 && <MdKeyboardArrowDown />}
                    </div>
                  </th>
                  <th>
                    <div className="thBox" onClick={() => handleSort(3)}>
                      Status
                      {filter.status === 1 && <MdKeyboardArrowUp />}
                      {filter.status === 2 && <MdKeyboardArrowDown />}
                    </div>
                  </th>
                  <th>
                    <div className="thBox" onClick={() => handleSort(4)}>
                      Time
                      {filter.time === 1 && <MdKeyboardArrowUp />}
                      {filter.time === 2 && <MdKeyboardArrowDown />}
                    </div>
                  </th>
                  <th>
                    <div className="thBox" onClick={() => handleSort(5)}>
                      Amount
                      {filter.amount === 1 && <MdKeyboardArrowUp />}
                      {filter.amount === 2 && <MdKeyboardArrowDown />}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="notransactions">
                      No Transactions Yet
                    </td>
                  </tr>
                ) : (
                  <>
                    {transactions
                      .slice(
                        0,
                        transactions.length > 5 ? 5 : transactions.length
                      )
                      .map((transaction) => (
                        <tr>
                          <td>{transaction.asset}</td>
                          <td>{transaction.type}</td>
                          <td>{transaction.status}</td>
                          <td>
                            {formatDate(transaction.time)}
                          </td>
                          <td>{transaction.amount}</td>
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
            </table>
            <div className="viewtransactions">
              <Link to="/transactions">VIEW ALL TRANSACTIONS</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Wallet;

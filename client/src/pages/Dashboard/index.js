/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect } from "react";
import "./styles.scss";

import CarouselComponent from "../../components/Carousel";
import Header from "../../components/Header";
import { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Chart from "../../components/Chart";
import HoldPopup from "../../components/HoldPopup";
import RedeemPopup from "../../components/RedeemPopup";
import EarnPopup from "../../components/EarnPopup";
import DashboardMobile from "../DashboardMobile";

import { useSelector } from "react-redux";
import Transaction from "../../api/transaction";
import Asset from "../../api/asset";
import { environment } from "../../constants";
import http from "../../api/axios";

function Dashboard() {
  const isVisible = useSelector((state) => state.config.isVisible);
  const user = useSelector((state) => state.auth.user);
  const transactionsData = useSelector(
    (state) => state.transaction.transactions
  );

  const [wallet, setWallet] = useState(null);
  const [stats, setStats] = useState({});
  const [assets, setAssets] = useState([
    {
      name: "BTC",
      icon: "images/dashboard/bitcoin.svg",
      decimals: 6,
    },
  ]);

  const navigate = useNavigate();

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(+window.localStorage.getItem("role") === 2){
      navigate("/admin/assets");
    }

    http.refreshToken();

    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    })

    Asset.getAll().then((res) => {
      setAssets(res.data.data.assets);
      setLoading(false);
    });

    Transaction.getAll().then((res) => {
      setTransactions(res.data.data.transactions);
    });

    Asset.getPrices().then((res) => {
      setPrices(res.data.data);
    })

    Asset.getStats().then((res) => {
      setStats(res.data.data);
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

  const [popup, setPopup] = useState(0);
  const [asset, setAsset] = useState(0);

  const [time, setTime] = React.useState("7 days");

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  // const assets = [
  //   {
  //     name: "BTC",
  //     icon: "images/dashboard/bitcoin.svg",
  //     decimals: 6,
  //   },
  //   {
  //     name: "ETH",
  //     icon: "images/dashboard/ethereum.svg",
  //     decimals: 4,
  //   },
  //   {
  //     name: "BNB",
  //     icon: "images/dashboard/bnb.svg",
  //     decimals: 4,
  //   },
  //   {
  //     name: "USDC",
  //     icon: "images/dashboard/usdc.svg",
  //     decimals: 2,
  //   },
  //   {
  //     name: "USDT",
  //     icon: "images/dashboard/usdt.svg",
  //     decimals: 2,
  //   },
  // ];

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

  const calcAssetWalletValue = (asset, turnToString = true) => {
    let index = assets.findIndex((a) => a.name === asset);
    if (index === -1) {
      return 0;
    }
    const val = getAssetFromWallet(asset) * prices[index];
    console.log("=============", index, asset, assets, prices, getAssetFromWallet(asset), prices[index]);
    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetholdingValue = (asset, turnToString = true) => {
    let index = assets.findIndex((a) => a.name === asset);
    const val = getHoldingFromWallet(asset) * prices[index];
    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetTotalValue = (asset, turnToString = true) => {
    const val =
      calcAssetWalletValue(asset, false) + calcAssetholdingValue(asset, false);

    return turnToString ? val.toLocaleString("en-US") : val;
  };

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

  const getAssetFromWallet = (asset) => {
    try{
      let index = wallet.assets.findIndex((a) => a.symbol === asset);
    return index > -1 ? wallet.assets[index].amount : 0;
    }
    catch(e){
      return 0;
    }
  }

  const getHoldingFromWallet = (asset) => {
    let index = wallet?.assets.findIndex((a) => a.symbol === asset);
    return index > -1 ? wallet?.assets[index].holding : 0;
  }

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
      default:
        break;
    }
  };

  function filterPrices(price){
    console.log(price);
    if(typeof price === 'undefined') return 0;
    else return parseFloat(price);
  }

  return (
    <Suspense>
      {!loading && <main className="dashboard">
      <Header page="Dashboard" />
      {popup !== 0 && getPopup()}
      <DashboardMobile />
      <section className="desktop">
        <div className="leftside">
          <div className="earnings">
            <div className="earnbox">
              <h6>24h earnings</h6>
              <h4>
                {isVisible ? "$" + filterPrices(stats?.oneDay) : "---"}
              </h4>
            </div>
            <div className="earnbox">
              <h6>7d earnings</h6>
              <h4>
                {isVisible ? "$" + filterPrices(stats?.sevenDay)  : "---"}
              </h4>
            </div>
            <div className="earnbox">
              <h6>30d earnings</h6>
              <h4>
                {isVisible ? "$" + filterPrices(stats?.thirtyDay)  : "---"}
              </h4>
            </div>
          </div>
          <div className="largebox">
            <h3>EBCT</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>Asset</th>
                  <th>In wallet</th>
                  <th>Holding</th>
                  <th>Total</th>
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
                          ? `${getAssetFromWallet("EBCT").toFixed(5)}`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${"$" + (getAssetFromWallet("EBCT") * prices["EBCT"] || 0 ).toFixed(6)}`
                          : "---"}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div className="column">
                      <h4>
                        {isVisible
                          ? `${getHoldingFromWallet("EBCT").toFixed(5)}`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${"$" + (getHoldingFromWallet("EBCT") * prices["EBCT"] || 0).toFixed(6)}`
                          : "---"}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div className="column">
                      <h4>
                        {isVisible
                          ? `${(
                            getHoldingFromWallet("EBCT") +
                            getAssetFromWallet("EBCT")
                            )}`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${"$" + ((getHoldingFromWallet("EBCT") +
                          getAssetFromWallet("EBCT")) * prices["EBCT"] || 0).toFixed(6) }`
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
                  <th>Total</th>
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
                                getAssetFromWallet(asset.name).toFixed(5)
                              )}`
                            : "---"}
                        </h4>
                        <h6>
                          {isVisible
                            ? `${"$" + (getAssetFromWallet(asset.name) * prices[asset.name] || 0).toFixed(5)}`
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
                            ? `${"$" + (getHoldingFromWallet(asset.name) * prices[asset.name] || 0).toFixed(5)}`
                            : "---"}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <div className="column">
                        <h4>
                          {isVisible
                            ? `${(
                              getAssetFromWallet(asset.name) +
                              getHoldingFromWallet(asset.name)
                              )}`
                            : "---"}
                        </h4>
                        <h6>
                          {isVisible
                            ? `${"$" + (((getAssetFromWallet(asset.name) +
                            getHoldingFromWallet(asset.name)) * prices[asset.name] || 0)).toFixed(5)}`
                            : "---"}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <div className="buttons">
                        <button onClick={() => handlePopup(3, asset.name)}>
                          <span>
                            <img
                              src="images/dashboard/earn.svg"
                              alt="earn"
                              height={15}
                              width={15}
                            />
                            Earn
                          </span>
                        </button>
                        <button onClick={() => handlePopup(2, asset.name)}>
                          <span>
                            <img
                              src="images/dashboard/redeem.svg"
                              alt="redeem"
                              height={15}
                              width={15}
                            />
                            Redeem
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr> }
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rightside">
          <div className="carouselandchartwrapper">
            <div className="carousel">
              <CarouselComponent />
            </div>
            <div className="chart">
              <span>
                <div className="top">
                  <img
                    src="images/dashboard/ebct.svg"
                    alt="ebct"
                    width={30}
                    height={30}
                  />
                  <h4>EBCT</h4>
                </div>
                <div className="bottom">
                  <h3>{isVisible ? `$${prices["EBCT"]}` : "---"}</h3>
                  <select name="time" id="time" onChange={handleChange}>
                    <option value="7 days">7 days</option>
                    <option value="14 days">14 days</option>
                    <option value="30 days">30 days</option>
                  </select>
                </div>
              </span>
              <Chart time={time} />
            </div>
          </div>

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
    </main> }
    </Suspense>
  );
}

export default Dashboard;

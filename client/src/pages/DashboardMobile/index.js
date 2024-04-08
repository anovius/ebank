import React, { useState, useEffect } from "react";
import HoldPopup from "../../components/HoldPopup";
import RedeemPopup from "../../components/RedeemPopup";
import EarnPopup from "../../components/EarnPopup";
import CarouselComponent from "../../components/Carousel";
import Chart from "../../components/Chart";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";
import { environment } from "../../constants";


import { useSelector } from "react-redux";
import Transaction from "../../api/transaction";
import Asset from "../../api/asset";
import http from "../../api/axios";

function DashboardMobile() {
  const isVisible = useSelector((state) => state.config.isVisible);
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState({});
  const user = useSelector((state) => state.auth.user);
  const transactionsData = useSelector(
    (state) => state.transaction.transactions
  );


  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [assets, setAssets] = useState([]);

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


  const [transactions, setTransactions] = useState([]);

  const [popup, setPopup] = useState(0);
  const [asset, setAsset] = useState(0);

  const [active, setActive] = useState(0);

  const [time, setTime] = React.useState("7 days");

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const calcAssetWalletValue = (asset, turnToString = true) => {
    const val =
      Math.round(user.wallet.assets[asset].wallet * prices[asset] * 100) / 100;

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetholdingValue = (asset, turnToString = true) => {
    const val =
      Math.round(user.wallet.assets[asset].holding * prices[asset] * 100) / 100;

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetTotalValue = (asset, turnToString = true) => {
    const val =
      calcAssetWalletValue(asset, false) + calcAssetholdingValue(asset, false);

    return turnToString ? val.toLocaleString("en-US") : val;
  };

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

  const handleActive = (number) => {
    if (active === number) {
      setActive((active) => 0);
    } else {
      setActive((active) => number);
    }
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
        return <div>Wassup</div>;
      default:
        break;
    }
  };

  function filterPrices(price){
    console.log(price);
    if(typeof price === 'undefined') return 0;
    else return parseFloat(price).toFixed(2);
  }


  return (
    <section className="mobile">
      {popup !== 0 && getPopup()}
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
        <div className="ebct">
          <button className="title">
            <div className="lefttitle">
              <img
                src="images/dashboard/ebct.svg"
                alt="ebct"
                width={30}
                height={30}
                className="titleimg"
              />
              <h2>EBCT</h2>
            </div>
            <div className="righttitle">
              <div className="text">
              <h1>
                {isVisible
                  ? `${(getAssetFromWallet("EBCT")+getHoldingFromWallet("EBCT")).toFixed(2)}`
                  : "---"}
              </h1>
              <h2>
                {isVisible
                  ? `${"$" +((getAssetFromWallet("EBCT")+getHoldingFromWallet("EBCT")) * prices["EBCT"] || 0).toFixed(5)}`
                  : "---"}
              </h2>
              </div>
              <div className="menuicon" onClick={() => handleActive(1)}>
                {active === 1 ? (
                  <MdKeyboardArrowUp size={30} />
                ) : (
                  <MdKeyboardArrowDown size={30} />
                )}
              </div>
            </div>
          </button>
          <div className={active !== 1 ? "content" : "content height"}>
            <div className="title">
              <div className="lefttitle">
                <img
                  src="images/dashboard/stake.svg"
                  alt="ebct"
                  width={20}
                  height={20}
                  className="titleimg"
                />
                <h4>Holding</h4>
              </div>
              <div className="righttitle">
              <div className="text">
              <h4>
                {isVisible
                  ? `${getHoldingFromWallet("EBCT")}`
                  : "---"}
              </h4>
              <h6>
                {isVisible
                  ? `${"$" + (getHoldingFromWallet("EBCT") * prices["EBCT"] || 0).toFixed(2)}`
                  : "---"}
              </h6>
            </div>
                <div className="menuicon notvisible">
                  <MdKeyboardArrowDown size={30} />
                </div>
              </div>
            </div>
            <div className="title">
              <div className="lefttitle">
                <img
                  src="images/navigation/wallet.svg"
                  alt="ebct"
                  width={20}
                  height={20}
                  className="titleimg"
                />
                <h4>In Wallet</h4>
              </div>
              <div className="righttitle">
                <div className="text">
                  <h1>
                    {isVisible
                      ? `${(getAssetFromWallet("EBCT"))}`
                      : "---"}
                  </h1>
                  <h2>
                    {isVisible ? `${"$" + (getAssetFromWallet("EBCT") * prices["EBCT"] || 0).toFixed(2)}` : "--"}
                  </h2>
                </div>
                <div className="menuicon notvisible">
                  <MdKeyboardArrowDown size={30} />
                </div>
              </div>
            </div>
            <div className="buttonBox">
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
          </div>
        </div>
        <div className="othercoins">
          {assets.map((asset, index) => (
            <>
            { asset.status === 1 && asset.name !== 'EBCT' && 
              <div className="ebct">
              <button className="title">
                <div className="lefttitle">
                  <img
                    src={ environment.file_url + "/" + asset.icon}
                    alt="ebct"
                    width={30}
                    height={30}
                    className="titleimg"
                  />
                  <h2>{asset.name}</h2>
                </div>
                <div className="righttitle">
                  <div className="text">
                    <h1>
                      {isVisible
                        ? `${(
                          getAssetFromWallet(asset.name) +
                              getHoldingFromWallet(asset.name)
                          )}`
                        : "---"}
                    </h1>
                    <h2>
                      {isVisible
                        ? `${"$" +(
                          (getAssetFromWallet(asset.name) +
                              getHoldingFromWallet(asset.name) 
                        ) * prices[asset.name] || 0).toFixed(2)}`
                        : "--"}
                    </h2>
                  </div>
                  <div
                    className="menuicon"
                    onClick={() => handleActive(index + 2)}
                  >
                    {active === index + 2 ? (
                      <MdKeyboardArrowUp size={30} />
                    ) : (
                      <MdKeyboardArrowDown size={30} />
                    )}
                  </div>
                </div>
              </button>
              <div
                className={active !== index + 2 ? "content" : "content height"}
              >
                <div className="title">
                  <div className="lefttitle">
                    <img
                      src="images/dashboard/stake.svg"
                      alt="ebct"
                      width={20}
                      height={20}
                      className="titleimg"
                    />
                    <h4>Holding</h4>
                  </div>
                  <div className="righttitle">
                    <div className="text">
                      <h1>
                        {isVisible
                          ? `${(
                            getHoldingFromWallet(asset.name)
                            )}`
                          : "---"}
                      </h1>
                      <h2>
                        {isVisible
                          ? `${"$" + getHoldingFromWallet(asset.name) * prices[asset.name] || 0}`
                          : "--"}
                      </h2>
                    </div>
                    <div className="menuicon notvisible">
                      <MdKeyboardArrowDown size={30} />
                    </div>
                  </div>
                </div>
                <div className="title">
                  <div className="lefttitle">
                    <img
                      src="images/navigation/wallet.svg"
                      alt="ebct"
                      width={20}
                      height={20}
                      className="titleimg"
                    />
                    <h4>In Wallet</h4>
                  </div>
                  <div className="righttitle">
                    <div className="text">
                      <h1>
                        {isVisible
                          ? `${truncate(getAssetFromWallet(asset.name))}`
                          : "---"}
                      </h1>
                      <h2>
                        {isVisible
                          ? `${"$" + getAssetFromWallet(asset.name) * prices[asset.name] || 0}`
                          : "--"}
                      </h2>
                    </div>
                    <div className="menuicon notvisible">
                      <MdKeyboardArrowDown size={30} />
                    </div>
                  </div>
                </div>
                <div className="buttonBox">
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
                        src="images/dashboard/lock.svg"
                        alt="lock"
                        height={15}
                        width={15}
                      />
                      Redeem
                    </span>
                  </button>
                </div>
              </div>
            </div>
            }
            </>    
          ))}
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
                    .slice(0, transactions.length > 5 ? 5 : transactions.length)
                    .map((transaction) => (
                      <tr>
                        <td>{transaction.asset}</td>
                        <td>{transaction.type}</td>
                        <td>{transaction.status}</td>
                        <td>
                          {formatDate(transaction.time)
                            }
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
  );
}

export default DashboardMobile;

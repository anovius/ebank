import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import "./styles.scss";
import Chart from "../../components/Chart";
import HoldPopup from "../../components/HoldPopup";
import RedeemPopup from "../../components/RedeemPopup";
import EarnPopup from "../../components/EarnPopup";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import KYC from "../../api/kyc";
import Transaction from "../../api/transaction";
import Asset from "../../api/asset";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

function EBCT() {
  const isVisible = useSelector((state) => state.config.isVisible);
  const user = useSelector((state) => state.auth.user);
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState([]);
  const transactionsData = useSelector(
    (state) => state.transaction.transactions
  );

  const [level, setLevel] = useState(1);

  const [karma, setKarma] = useState({
    level: 1,
    amount: 0,
  });

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

  const truncate = (amount) => {
    let truncated = Math.trunc(amount);

    if (parseFloat(amount - truncated) >= parseFloat(0.000001)) {
      return amount.toFixed(5);
    } else {
      return Math.round(amount);
    }
  };

  useEffect(() => {
    getLevel();
    KYC.getLevel().then((res) => {
      console.log(res.data);
      setKarma(res.data.data);
      setLevel(res.data.data.level);
    });
    
    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    })

    Asset.getPrices().then((res) => {
      setPrices(res.data.data);
    })

    Asset.getStats().then((res) => {
      setStats(res.data.data);
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    Transaction.getAll().then((res) => {
      setTransactions(res.data.data.transactions);
    });

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

  const [time, setTime] = useState("7 days");
  const [asset, setAsset] = useState();
  const [wallet, setWallet] = useState(null);
  const [popup, setPopup] = useState(0);

  const handleChange = (event) => {
    setTime(event.target.value);
  };

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
        return <div>Wassup</div>;
      default:
        break;
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

  const calcAssetWalletValue = (asset, turnToString = true) => {
    const val = user.wallet.assets[asset].wallet * prices[asset];

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const calcAssetholdingValue = (asset, turnToString = true) => {
    const val = user.wallet.assets[asset].holding * prices[asset];

    return turnToString ? val.toLocaleString("en-US") : val;
  };

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


  return (
    <main className="EBCT">
      <Header page="EBCT" />
      {popup !== 0 && getPopup()}
      <section className="desktop">
        <div className="fullwidth">
          <div className="earningsAndChart">
            <div className="earnings">
              <div className="earnbox">
                <h6>24h earnings</h6>
                <h4>
                  {isVisible ? "$" + stats.oneDay : "---"}
                </h4>
              </div>
              <div className="earnbox">
                <h6>7d earnings</h6>
                <h4>
                  {isVisible
                    ? "$" + stats.sevenDay
                    : "---"}
                </h4>
              </div>
              <div className="earnbox">
                <h6>30d earnings</h6>
                <h4>
                  {isVisible
                    ? "$" + stats.thirtyDay
                    : "---"}
                </h4>
              </div>
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
          <div className="ebct">
            <button className="title">
              <div className="leftmaintitle">
                <img
                  src="images/dashboard/ebct.svg"
                  alt="ebct"
                  width={30}
                  height={30}
                  className="titleimg"
                />
                <h2>EBCT</h2>
              </div>
            </button>
            <div className="content height">
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
                        ? `${truncate(getHoldingFromWallet("EBCT"), 5)}`
                        : "---"}
                    </h1>
                    <h2>
                      {isVisible
                        ? `${"$" + getHoldingFromWallet("EBCT") * prices["EBCT"]}`
                        : "---"}
                    </h2>
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
                        ? `${truncate(getAssetFromWallet("EBCT"), 5)}`
                        : "---"}
                    </h1>
                    <h2>
                      {isVisible
                        ? `${"$" + getAssetFromWallet("EBCT") * prices["EBCT"]}`
                        : "---"}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="buttonBox">
                <div>
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
                <Link to="/convert">
                  <span>
                    <img
                      src="images/navigation/convert.svg"
                      alt="lock"
                      height={15}
                      width={15}
                    />
                    Convert
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="largebox">
            <h3>EBCT</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "start" }}>Asset</th>
                  <th>Holding</th>
                  <th>In wallet</th>
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
                        {" "}
                        {isVisible
                          ? `${truncate(getHoldingFromWallet("EBCT"), 5)}`
                          : "---"}
                      </h4>
                      <h6>
                        {" "}
                        {isVisible
                          ? `${"$" + getHoldingFromWallet("EBCT") * prices["EBCT"]}`
                          : "---"}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div className="column">
                      <h4>
                        {isVisible
                          ? `${truncate(getAssetFromWallet("EBCT"), 5)}`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${"$" + getAssetFromWallet("EBCT") * prices["EBCT"]}`
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
                      <Link to="/convert">
                        <span>
                          <img
                            src="images/navigation/convert.svg"
                            alt="lock"
                            height={15}
                            width={15}
                          />
                          Convert
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="below">
          <div className="leftside">
            <div className="earnings">
              <div className="earnbox">
                <span>
                  <img
                    src={`/images/karma/${levels[level - 1].img}`}
                    alt="bronze"
                    width={25}
                    height={25}
                  />
                  <strong>{levels[level - 1].name}</strong>
                </span>
                <div className="linegraph">
                  <h5>
                    {isVisible ?  karma.amount : "---"}
                  </h5>
                  <div className="containergraph">
                    <div
                      className="reached"
                      style={{
                        width: `${
                          (karma.amount /
                            levels[level - (level === 4 ? 1 : 0)].amount) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <h5 className="destination">
                  {levels[level]?.amount} EBCT
                  </h5>
                </div>
                {!(
                  user.wallet.assets["EBCT"].holding >=
                  levels[levels.length - 1].amount
                ) && (
                  <p>
                    {level !== 4 && <>
                    Hold{" "}
                    {isVisible
                      ? levels[level - (level === 4 ? 1 : 0)].amount -
                      karma.amount
                      : "-"}{" "}
                    more EBCT to reach Karma Level {level + 1}.
                    </>}
                  </p>
                )}
              </div>
            </div>
            <div className="largebox">
              <h3>EBCT Token Returns</h3>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "start" }}>
                      Karma lvl / EBCT Staked.
                    </th>
                    <th>Return</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span>
                        <img
                          src="/images/karma/bronze.svg"
                          width={25}
                          height={25}
                          alt="ebct"
                        />
                        <div className="karmaContent">
                          <h4>Karma lvl 1.</h4>
                          <h4>0 - 49,999</h4>
                        </div>
                      </span>
                    </td>
                    <td>1%</td>
                  </tr>
                  <tr>
                    <td>
                      <span>
                        <img
                          src="/images/karma/silver.svg"
                          width={25}
                          height={25}
                          alt="ebct"
                        />
                        <div className="karmaContent">
                          <h4>Karma lvl 2.</h4>
                          <h4>50,000 - 199,999</h4>
                        </div>
                      </span>
                    </td>
                    <td>2%</td>
                  </tr>
                  <tr>
                    <td>
                      <span>
                        <img
                          src="/images/karma/gold.svg"
                          width={25}
                          height={25}
                          alt="ebct"
                        />
                        <div className="karmaContent">
                          <h4>Karma lvl 3.</h4>
                          <h4>200,000 - 1,000,000</h4>
                        </div>
                      </span>
                    </td>
                    <td>3%</td>
                  </tr>
                  <tr>
                    <td>
                      <span>
                        <img
                          src="/images/karma/diamond.svg"
                          width={25}
                          height={25}
                          alt="ebct"
                        />

                        <div className="karmaContent">
                          <h4>Karma lvl 4.</h4>
                          <h4>Above 1,000,000</h4>
                        </div>
                      </span>
                    </td>
                    <td>4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="rightside">
            <div className="earnings">
              <div className="earnbox">
                <div className="earntext">
                  <h5>Auto-Stake EBCT deposits</h5>
                  <img
                    src="/images/header/info.svg"
                    alt="info"
                    width={15}
                    height={15}
                  />
                </div>
                <AntSwitch
                  defaultChecked
                  inputProps={{ "aria-label": "ant design" }}
                />
              </div>
              <div className="earnbox">
                <div className="earntext">
                  <h5>Auto-Compound</h5>
                  <img
                    src="/images/header/info.svg"
                    alt="info"
                    width={15}
                    height={15}
                  />
                </div>
                <AntSwitch inputProps={{ "aria-label": "ant design" }} />
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
        </div>
      </section>
    </main>
  );
}

export default EBCT;

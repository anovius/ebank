import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import "./styles.scss";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { styled } from "@mui/material/styles";

import Switch from "@mui/material/Switch";
import Transaction from "../../api/transaction";

import { useSelector } from "react-redux";
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

function EarnToken() {
  const isVisible = useSelector((state) => state.config.isVisible);
  const prices = useSelector((state) => state.price.prices);
  const user = useSelector((state) => state.auth.user);
  const transactionsData = useSelector(
    (state) => state.transaction.transactions
  );

  const [stats, setStats] = useState({
    hold: {
      total: 0,
      price: 0
    },
    earnings: {
        total: 0,
        price: 0
    }
  });

  useEffect(() => {
    Transaction.getAll().then((res) => {
      setTransactions(res.data.data.transactions);
    });

    Asset.getEarnings(tokenName).then((res) => {
      setStats(res.data.data);
    })

    Asset.getSpecial().then((res) => {
      console.log(res.data);
      setAssets(res.data.data);
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


  const { token } = useParams();

  const tokenName = token.toUpperCase();

  const calcAssetholdingValue = (asset, turnToString = true) => {
    const val = user.wallet.assets[asset].holding * prices[asset];

    return turnToString ? val.toLocaleString("en-US") : val;
  };

  const [assets, setAssets] = useState([]);

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

  return (
    <main className="earntoken">
      <Header page="Earn" />
      <section className="desktop">
        <div className="leftside">
          <div className="largebox">
            <h3>About {assets[tokenName]?.name}</h3>
            <p>{assets[tokenName]?.description}</p>
          </div>
          <div className="earnings">
            <div className="earnbox">
              <img src="/images/lock.svg" alt="lock" width={25} height={25} />
              <h4>30 days locked up period</h4>
            </div>
            <div className="earnbox">
              <img src="/images/time.svg" alt="time" width={25} height={25} />
              <h4>Rewards paid daily</h4>
            </div>
          </div>
          <div className="largebox">
            <h3>EBankc {assets[tokenName]?.name} Returns</h3>
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
                        <h4>{assets[tokenName]?.lvl1range}</h4>
                      </div>
                    </span>
                  </td>
                  <td>{assets[tokenName]?.lvl1}%</td>
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
                        <h4>{assets[tokenName]?.lvl2range}</h4>
                      </div>
                    </span>
                  </td>
                  <td>{assets[tokenName]?.lvl2}%</td>
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
                        <h4>{assets[tokenName]?.lvl3range}</h4>
                      </div>
                    </span>
                  </td>
                  <td>{assets[tokenName]?.lvl3}%</td>
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
                        <h4>{assets[tokenName]?.lvl4range}</h4>
                      </div>
                    </span>
                  </td>
                  <td>{assets[tokenName]?.lvl4}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="rightside">
          <div className="largebox">
            <h3>Your Holdings</h3>
            <table>
              <thead>
                <tr>
                  <th>Holding</th>
                  <th>{assets[tokenName]?.name} Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="column">
                      <h4>
                        {isVisible
                          ? `${
                              stats?.hold.total
                            }`
                          : "---"}
                      </h4>
                      <h6>
                        {isVisible
                          ? `${
                              "$" +
                              stats?.hold.price
                            }`
                          : "---"}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div className="column">
                      <h4>{isVisible ? stats?.earnings.total : "---"}</h4>
                      <h6>${isVisible ? stats?.earnings.price : "---"}</h6>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="earnings">
            <div className="earnbox">
              <div className="earntext">
                <h4>Auto-Compound</h4>
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
              <h4 className="nextreward">
                Next reward due in <strong>{stats?.nextDay} Days</strong>
              </h4>
            </div>
            {assets[tokenName]?.autoDeploy && (
              <div className="earnbox">
                <div className="earntext">
                  <h4>Auto-Deploy deposits</h4>
                  <img
                    src="/images/header/info.svg"
                    alt="info"
                    width={15}
                    height={15}
                  />
                </div>
                <AntSwitch inputProps={{ "aria-label": "ant design" }} />
              </div>
            )}
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
    </main>
  );
}

export default EarnToken;

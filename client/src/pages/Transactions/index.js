import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import Header from "../../components/Header";

import { useSelector } from "react-redux";

import Transaction from "../../api/transaction";

import SmallNavigation from "../../components/SmallNavigation";
import Select from "../../components/Select";

import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineClose,
} from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import { motion } from "framer-motion";

import { CSVLink } from "react-csv";

function SmallDropdown({ title, values, open, setOpen, active, setActive }) {
  const shortenString = (str) =>
    str.substr(0, 13) + (str.length > 13 ? "..." : "");

  return (
    <div className="dropdown">
      <div className={`titleBox ${open ? "activeTitleBox" : undefined}`}>
        <h4 onClick={() => setOpen(!open)}>{shortenString(active || title)}</h4>
        <div className="icons">
          {active && (
            <div className="close" onClick={() => setActive(null)}>
              <MdOutlineClose color="#a0a0a0" />
            </div>
          )}
          {open ? (
            <MdKeyboardArrowUp
              color="darkgreen"
              size="1rem"
              onClick={() => setOpen(!open)}
            />
          ) : (
            <MdKeyboardArrowDown
              color="darkgreen"
              size="1rem"
              onClick={() => setOpen(!open)}
            />
          )}
        </div>
      </div>
      {open && (
        <div className="dropdownValues">
          <SimpleBar style={{ maxHeight: 350 }}>
            {values.map((value, i) => (
              <div
                className={`value ${
                  active === value ? "activeValue" : undefined
                }`}
                onClick={() => {
                  setActive(typeof value === "object" ? value.title : value);
                  setOpen(false);
                }}
              >
                {typeof value === "object" ? (
                  <div className="assetValue">
                    <img src={`/images/dashboard/${value.img}`} alt="Asset" />
                    <div className="text">
                      <h3>{value.title}</h3>
                      <h4>{value.name}</h4>
                    </div>
                  </div>
                ) : (
                  <h4 key={i}>{value}</h4>
                )}
              </div>
            ))}
          </SimpleBar>
        </div>
      )}
    </div>
  );
}


function RecentActivity({ link }) {
  const transactionsData = useSelector(
    (state) => state.transaction.transactions
  );

  useEffect(() => {
    Transaction.getAll().then((res) => {
      setTransactions(res.data.data.transactions);
    });
  }, [transactionsData]);

  const [transactions, setTransactions] = useState(transactionsData);

  const [forceUp, setForceUp] = useState(0);

  const forceUpdate = () => setForceUp(forceUp + 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [date, setDate] = useState(new Date());

  const changeMonth = (direction) => {
    const tempDate = date;

    tempDate.setMonth(tempDate.getMonth() + direction);

    tempDate.setHours(0, 0, 0, 0);

    setThreeDotsOpen(false);

    setDate(tempDate);

    forceUpdate();
  };

  const isSameMonth = (dateParam = new Date()) => {
    const today = new Date(dateParam);

    return (
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  const [filter, setFilter] = useState({
    asset: 0,
    type: 0,
    status: 0,
    id: 0,
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

    setTransactions(tempTransactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const [filterOpen, setFilterOpen] = useState(false);

  const [activeAsset, setActiveAsset] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [txid, setTxid] = useState(null);
  const [typingID, setTypingID] = useState(false);

  const fitsTopFilter = (transaction) => {
    let assetFits = true;
    let typeFits = true;
    let statusFits = true;
    let idFits = true;
    let dateFits = true;

    if (activeAsset) {
      assetFits = activeAsset.toLowerCase() === transaction.asset.toLowerCase();
    }

    if (activeType) {
      typeFits = activeType.toLowerCase() === transaction.type.toLowerCase();
    }

    if (activeStatus) {
      statusFits =
        activeStatus.toLowerCase() === transaction.status.toLowerCase();
    }

    dateFits = isSameMonth(transaction.time);

    if (txid) {
      idFits = txid === transaction.id.toString();
    }

    return assetFits && typeFits && statusFits && idFits && dateFits;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setTxid(e.target.value);
    }
  };

  const inputRef = useRef(null);

  const resetInput = () => {
    inputRef.current.value = null;
    setTxid(null);
    setTypingID(null);
  };

  const assets = [
    { title: "BTC", name: "Bitcoin", img: "bitcoin.svg" },
    { title: "BNB", name: "Binance Coin", img: "bnb.svg" },
    { title: "ETH", name: "Ehtereum", img: "ethereum.svg" },
    { title: "USDC", name: "USD Coin", img: "usdc.svg" },
    { title: "USDT", name: "Tether", img: "usdt.svg" },
    { title: "EBCT", name: "EBankc Coin", img: "ebct.svg" },
  ];
  const types = [
    "Deposit",
    "Withdrawals",
    "Reward",
    "Convert from",
    "Convert to",
    "Delegated",
    "Redeemed",
  ];
  const statuses = [
    "Broadcast",
    "Cancelled",
    "Completed",
    "Confirmed",
    "Dropped",
    "Email confirmation required",
    "Failed",
    "Not found",
    "Pending",
    "Processing",
    "Rejected",
    "User cancel request",
  ];

  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdowns = [
    {
      title: "Assets",
      values: assets,
      active: activeAsset,
      setActive: setActiveAsset,
    },
    {
      title: "Type",
      values: types,
      active: activeType,
      setActive: setActiveType,
    },
    {
      title: "Status",
      values: statuses,
      active: activeStatus,
      setActive: setActiveStatus,
    },
  ];

  const [threeDotsOpen, setThreeDotsOpen] = useState(false);

  const [csvData, setCsvData] = useState([]);
  const [csvFilename, setCsvFilename] = useState("transactions.svg");

  const generateCsvFilename = () => {
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();

    if (month === 12) {
      month = 1;
    } else {
      month++;
    }

    return `transactions_${month}_${day}_${year}.csv`;
  };

  const generateCSVdata = async () => {
    const data = [];
    const keys = ["Asset", "Type", "Status", "ID", "Time", "Amount"];

    // Remove ID
    if (link !== "Wallet ledger") {
      const index = keys.indexOf("ID");
      if (index > -1) {
        keys.splice(index, 1);
      }
    }

    data.push(keys);

    for await (const transaction of transactions) {
      if (!isSameMonth(transaction.time)) {
        continue;
      }

      let transactionArray = [];
      for await (let [key, value] of Object.entries(transaction)) {
        if (key === "id" && link !== "Wallet ledger") {
          continue;
        }

        if (key === "time") {
          value = value.toLocaleDateString("en-US").toString();
        }

        transactionArray.push(value);
      }

      data.push(transactionArray);
    }

    setCsvFilename(generateCsvFilename());

    setCsvData(data);
  };

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

  useEffect(() => {
    generateCSVdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threeDotsOpen]);

  const dotsVariants = {
    open: { opacity: 1, display: "flex" },
    closed: { opacity: 0, display: "none" },
  };

  return (
    <div className="recentactivity">
      <div className="top">
        <div className={`left ${filterOpen ? "filtersOpen" : undefined}`}>
          {dropdowns.map((dropdown, i) => (
            <SmallDropdown
              title={dropdown.title}
              values={dropdown.values}
              active={dropdown.active}
              setActive={dropdown.setActive}
              open={openDropdown === i}
              setOpen={(open) => setOpenDropdown(open ? i : null)}
              key={i}
            />
          ))}
          <div className="input">
            <input
              placeholder="Enter Txid"
              onChange={(e) => setTypingID(e.target.value)}
              onKeyPress={handleKeyPress}
              ref={inputRef}
            />
            {typingID && <MdOutlineClose onClick={resetInput} />}
          </div>
        </div>
        <div className="right">
          <FiFilter
            onClick={() => setFilterOpen(!filterOpen)}
            className="filter"
          />
          <BsThreeDotsVertical
            onClick={() => setThreeDotsOpen(!threeDotsOpen)}
            style={
              threeDotsOpen && {
                boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px",
              }
            }
          />
          {csvData.length === 1 ? (
            <motion.div
              className="dotsDropdown cannotDownload"
              animate={threeDotsOpen ? "open" : "closed"}
              variants={dotsVariants}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/images/navigation/transaction.svg"
                alt="Transaction icon"
              />
              <p>Download as CSV </p>
            </motion.div>
          ) : (
            <CSVLink data={csvData} filename={csvFilename}>
              <motion.div
                className="dotsDropdown"
                animate={threeDotsOpen ? "open" : "closed"}
                variants={dotsVariants}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/images/navigation/transaction.svg"
                  alt="Transaction icon"
                />
                <p>Download as CSV </p>
              </motion.div>
            </CSVLink>
          )}
        </div>
      </div>
      <div className="table-responsive">
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
            {link === "Wallet ledger" && (
              <th>
                <div className="thBox" onClick={() => handleSort(4)}>
                  ID
                  {filter.id === 1 && <MdKeyboardArrowUp />}
                  {filter.id === 2 && <MdKeyboardArrowDown />}
                </div>
              </th>
            )}

            <th>
              <div className="thBox" onClick={() => handleSort(5)}>
                Time
                {filter.time === 1 && <MdKeyboardArrowUp />}
                {filter.time === 2 && <MdKeyboardArrowDown />}
              </div>
            </th>
            <th>
              <div className="thBox" onClick={() => handleSort(6)}>
                Amount
                {filter.amount === 1 && <MdKeyboardArrowUp />}
                {filter.amount === 2 && <MdKeyboardArrowDown />}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <h5 className="notransactions">No transactions yet</h5>
          ) : (
            <>
              {transactions
                .map((transaction, index) => {
                  if (!fitsTopFilter(transaction)) return null;

                  return (
                    <tr>
                      <td>{transaction.asset}</td>
                      <td>{transaction.type}</td>
                      <td>{transaction.status}</td>
                      {link === "Wallet ledger" && <td>{index+1}</td>}

                      <td>
                        {formatDate(transaction.time)}
                      </td>
                      <td>{transaction.amount}</td>
                    </tr>
                  );
                })}
            </>
          )}
        </tbody>
      </table>
      </div>
      <div className="monthSwitcher">
        <MdKeyboardArrowLeft onClick={() => changeMonth(-1)} />
        <p>{months[date.getMonth()]}</p>
        {!isSameMonth() && (
          <MdKeyboardArrowRight onClick={() => changeMonth(1)} />
        )}
      </div>
    </div>
  );
}

function Transactions() {
  const links = [
    {
      img: "/images/navigation/wallet.svg",
      name: "Wallet ledger",
    },
    {
      img: "/images/navigation/earn.svg",
      name: "Earnings ledger",
    },
    {
      img: "/images/navigation/buy.svg",
      name: "Staking ledger",
    },
    {
      img: "/images/navigation/bank.svg",
      name: "Locking ledger",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <main className="transactions">
      <Header page="Transactions" />
      <section className="content">
        <SmallNavigation links={links} open={open} setOpen={setOpen} />
        <Select links={links} active={open} setActive={setOpen} />
        <RecentActivity link={links[open].name} />
      </section>
    </main>
  );
}

export default Transactions;

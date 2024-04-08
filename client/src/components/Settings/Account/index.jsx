/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import "./styles.scss";

import { MdKeyboardArrowDown } from "react-icons/md";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSettings } from "../../../actions/authActions";

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

function Account() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [logoutDropdownOpen, setLogoutDropdownOpen] = useState(false);
  const [withdrawDropdownOpen, setWithdrawDropdownOpen] = useState(false);

  const [activeLanguage, setActiveLanguage] = useState(user.settings.language);
  const [activeCurrency, setActiveCurrency] = useState(user.settings.currency);
  const [activeLogout, setActiveLogout] = useState(user.settings.logout);
  const [activeWithdraw, setActiveWithdraw] = useState(user.settings.withdraw);

  const [languageData] = useState(["English"]);
  const [currencyData] = useState(["USD", "EUR"]);
  const [logoutData] = useState([
    "in 5 minutes",
    "in 10 minutes",
    "in 15 minutes",
    "in 30 minutes",
    "in 60 minutes",
  ]);
  const [withdrawData] = useState([0, 1, 2, 3]);

  useEffect(() => {
    setActiveLanguage((activeLanguage) => user.settings.language);
    setActiveCurrency((activeCurrency) => user.settings.currency);
    setActiveLogout((activeLogout) => user.settings.logout);
    setActiveWithdraw((activeWithdraw) => user.settings.withdraw);
  }, []);

  useEffect(() => {
    const settingsData = {
      language: activeLanguage,
      currency: activeCurrency,
      logout: activeLogout,
      withdraw: activeWithdraw,
    };
    dispatch(setSettings(settingsData));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage, activeCurrency, activeLogout, activeWithdraw]);

  return (
    <main className="account">
      <section className="box accountBox">
        <p className="title">Account</p>
        <div className="body">
          <div className="row">
            <h3>Name</h3>
            <h3 className="value">{user.name}</h3>
          </div>
          <div className="row">
            <h3>Email address</h3>
            <h3 className="value">{user.email}</h3>
          </div>
          <div className="row">
            <h3>Country</h3>
            <h3 className="value">{user.country}</h3>
          </div>
        </div>
      </section>
      <section className="box settingsBox">
        <p className="title">Settings</p>
        <div className="body">
          <div className="row">
            <h3>Language</h3>
            <Dropdown
              open={languageDropdownOpen}
              setOpen={setLanguageDropdownOpen}
              data={languageData}
              active={activeLanguage}
              setActive={setActiveLanguage}
            />
          </div>

          <div className="row">
            <h3>Currency</h3>
            <Dropdown
              open={currencyDropdownOpen}
              setOpen={setCurrencyDropdownOpen}
              data={currencyData}
              active={activeCurrency}
              setActive={setActiveCurrency}
            />
          </div>

          <div className="row">
            <h3>Automatic logout</h3>
            <Dropdown
              open={logoutDropdownOpen}
              setOpen={setLogoutDropdownOpen}
              data={logoutData}
              active={activeLogout}
              setActive={setActiveLogout}
            />
          </div>

          <div className="row">
            <h3>Max. number of withdrawals per day</h3>
            <Dropdown
              open={withdrawDropdownOpen}
              setOpen={setWithdrawDropdownOpen}
              data={withdrawData}
              active={activeWithdraw}
              setActive={setActiveWithdraw}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Account;

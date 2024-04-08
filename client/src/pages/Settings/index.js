import React, { useState, useEffect } from "react";
import "./styles.scss";
import Header from "../../components/Header";

import { useLocation } from "react-router-dom";

import SmallNavigation from "../../components/SmallNavigation";
import Select from "../../components/Select";
import {
  Account,
  ActivityLog,
  Security,
  Verification,
} from "../../components/Settings";

function Transactions() {
  const location = useLocation();
  const search = location.search;
  const openQuery = new URLSearchParams(search).get("openQuery");

  const links = [
    {
      img: "/images/settings/account.svg",
      name: "Account",
    },
    {
      img: "/images/settings/verification.svg",
      name: "Verification",
    },
    {
      img: "/images/settings/security.svg",
      name: "Security",
    },
    {
      img: "/images/settings/activity.svg",
      name: "Activity log",
    },
    {
      img: "/images/settings/support.svg",
      name: "Support",
      link: "https://EBankc.netlify.app/faq",
    },
  ];

  const [components] = useState([
    <Account />,
    <Verification />,
    <Security />,
    <ActivityLog />,
  ]);

  const [open, setOpen] = useState(parseInt(openQuery) || 0);

  useEffect(() => {
    open >= 4 && setOpen(0);
  }, [open]);

  return (
    <main className="settings">
      <Header page="Settings" />
      <section className="content">
        <SmallNavigation links={links} open={open} setOpen={setOpen} />
        <Select links={links} active={open} setActive={setOpen} />
        {components[open]}
      </section>
    </main>
  );
}

export default Transactions;

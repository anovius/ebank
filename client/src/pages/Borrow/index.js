import React, { useEffect, useState } from "react";
import "./styles.scss";
import Header from "../../components/Header";
import { Link } from "react-router-dom";


import { useSelector } from "react-redux";
import Transaction from "../../api/transaction";

function Borrow() {
  const isVisible = useSelector((state) => state.config.isVisible);
  const user = useSelector((state) => state.auth.user);

  const [borrowAssets, setBorrowAssets] = useState([]);

  const info = [
    {
      name: "USDC",
      icon: "images/dashboard/usdc.svg",
      prcnt: "1%",
      lockup: true,
    },
    {
      name: "USDT",
      icon: "images/dashboard/usdt.svg",
      prcnt: "1%",
      lockup: true,
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

  useEffect(() => {
    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    });
    Transaction.getBorrow().then((res) => {
      setBorrowAssets(res.data.data);
    })
  }, []);



  const calcAssetholdingValue = (asset, turnToString = true) => {
    return 0;
  };

  const truncate = (amount) => {
    let truncated = Math.trunc(amount);

    console.log(
      amount,
      truncated,
      parseFloat(amount - truncated),
      parseFloat(1.00001 - 1)
    );

    if (parseFloat(amount - truncated) >= parseFloat(0.000001)) {
      return parseFloat(amount).toFixed(5);
    } else {
      return Math.round(amount);
    }
  };

  return (
    <main className="borrow">
      <Header page="Borrow" />
      <section className="tokenBoxesRow">
        {info.map((coin, index) => (
          <Link to={`${coin.name}`} className="tokenbox">
            <div className="header">
              <img src={coin.icon} alt={coin.name} height={35} width={35} />
              <h3>{coin.name}</h3>
            </div>
            <div className="middle">
              <div className="midleft">
                <h4 style={{ opacity: "0.5" }}>Borrowed</h4>
                <h2>
                  {isVisible
                    ? `${truncate(borrowAssets[coin.name])}`
                    : "----"}
                </h2>
                <h3 style={{ opacity: "0.5" }}>
                  {isVisible
                    ? `${"$" + borrowAssets[coin.name]}`
                    : "---"}
                </h3>
              </div>
              <div className="midright">
                <h4>LTV down to</h4>
                <h2 className="green">{coin.prcnt}</h2>
              </div>
            </div>
            <div className="bottom">
              <div className="botleft">
                <h5 style={{ opacity: "0.5" }}>
                </h5>
                <h6 style={{ opacity: "0.5" }}>Instant credit</h6>
              </div>
              <div className="botright">
                <button>View Details</button>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

export default Borrow;

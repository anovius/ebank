import React, { useState, useEffect } from "react";
import "./styles.scss";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { convertAssets } from "../../actions/authActions";

import Alert from "../../components/Alert";
import Asset from "../../api/asset";
import { environment } from "../../constants";
import Transaction from "../../api/transaction";


import { useMoralisWeb3Api, useMoralis } from "react-moralis";

function Convert() {
  const dispatch = useDispatch();
  const [prices, setPrices] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const [amount, setAmount] = useState(0);
  const [received, setReceived] = useState(null);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [activeFrom, setActiveFrom] = useState(0);
  const [activeTo, setActiveTo] = useState(1);

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [max, setMax] = useState(0);
  const [min] = useState(5);

  const Web3Api = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const [assets, setAssets] = useState([
    {
      name: "BTC",
      full: "Bitcoin",
      icon: "images/dashboard/bitcoin.svg",
    },
    {
      name: "ETH",
      full: "Ethereum",
      icon: "images/dashboard/ethereum.svg",
    },
    {
      name: "BNB",
      full: "Binance Coin",
      icon: "images/dashboard/bnb.svg",
    },
    {
      name: "USDC",
      full: "USD Coin",
      icon: "images/dashboard/usdc.svg",
    },
    {
      name: "USDT",
      full: "Tether",
      icon: "images/dashboard/usdt.svg",
    },
    {
      name: "EBCT",
      full: "EBankc Coin",
      icon: "images/dashboard/ebct.svg",
    },
  ]);

  
  const [wallet, setWallet] = useState({
    assets: [
      {
        name: "BTC",
        amount: 0,
      }
    ],
  });

  async function getLivePrice(address){
    return 0;
  }

  const refreshPrices = async () => {
    setInterval(async () => {
      Asset.getPrices().then((res) => {
        setPrices(res.data.data);
      })
    }, 10000);
  }

  const priceOf = (asset) => {
    return (Math.round(prices[asset] * 100) / 100).toLocaleString("en-US");
  };

  const handleActiveFrom = (ind) => {
    setActiveFrom(ind);
    setOpenFrom(false);
  };

  const handleActiveTo = (ind) => {
    setActiveTo(ind);
    setOpenTo(false);
  };

  const getAssetFromWallet = (asset) => {
    let index = wallet.assets.findIndex((a) => a.symbol === asset);
    return index > -1 ? wallet.assets[index].amount : 0;
  }

  useEffect(() => {
    openTo && setOpenFrom(false);
    Asset.getAll().then((res) => {
      setAssets(res.data.data.assets);
      Asset.getPrices().then((res) => {
        console.log(res.data.data);
        setPrices(res.data.data);
        refreshPrices();
      })
      refreshPrices();
    });

    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    })
  }, [openTo, isInitialized]);

  const calcAssetValue = (asset, amount) => {
    return amount * prices[asset];
  };

  const calcAssetAmount = (asset, cash) => {
    return cash / prices[asset];
  };

  const convert = () => {
    if(amount === 0) return;
    let from = prices[assets[activeFrom].name];
    let to = prices[assets[activeTo].name];
    
    let cash = amount * from;
    setReceived(cash/to);
  };  

  const handleConvert = async () => {
    convert();
    let body = {
      fromAsset: {
        name: assets[activeFrom].name,
        amount: amount,
      },

      toAsset: {
        name: assets[activeTo].name,
        amount: received,
      }
    }

    Transaction.convert(body).then((res) => {
      navigate("/wallet");
    });
  }

  return (
    <main className="convert">
      <Header page="Convert" />
      <section className="box">
        <section className="asset">
          <h4>From</h4>
          {openFrom ? (
            <div className="opencontainer">
              <div className="absolutecontainer">
                {assets.map((assetObject, index) => {
                  if (index === activeTo) return null;

                  return (
                    <>
                      {activeFrom === index && (
                        <div
                          className={
                            activeFrom === index
                              ? "assetcontainer active"
                              : "assetcontainer"
                          }
                          onClick={() => handleActiveFrom(index)}
                        >
                          <div className="left">
                            <img
                              src={environment.file_url + '/' + assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {activeFrom === index && <MdKeyboardArrowDown />}
                        </div>
                      )}
                    </>
                  );
                })}
                {assets.map((assetObject, index) => {
                  if (index === activeTo) return null;

                  return (
                    <>
                      {activeFrom !== index && (
                        <div
                          className={
                            activeFrom === index
                              ? "assetcontainer active"
                              : "assetcontainer"
                          }
                          onClick={() => handleActiveFrom(index)}
                        >
                          <div className="left">
                            <img
                              src={environment.file_url + '/' + assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {activeFrom === index && <MdKeyboardArrowDown />}
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
              <>
                {assets.map((assetObject, index) => (
                  <>
                    {index === activeFrom && (
                      <div
                        className="assetcontainer"
                        onClick={() => setOpenFrom((openFrom) => !openFrom)}
                      >
                        <div className="left">
                          <img
                            src={environment.file_url + '/' + assetObject.icon}
                            alt={assetObject.name}
                            width={30}
                            height={30}
                          />
                          <span>
                            <h3>{assetObject.name}</h3>
                            <h4>{assetObject.full}</h4>
                          </span>
                        </div>
                        {!openFrom ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <MdKeyboardArrowDown />
                        )}
                      </div>
                    )}
                  </>
                ))}
              </>
            </div>
          ) : (
            <>
              {assets.map((assetObject, index) => (
                <>
                  {index === activeFrom && (
                    <div
                      className="assetcontainer"
                      onClick={() => setOpenFrom((openFrom) => !openFrom)}
                    >
                      <div className="left">
                        <img
                          src={environment.file_url + '/' + assetObject.icon}
                          alt={assetObject.name}
                          width={30}
                          height={30}
                        />
                        <span>
                          <h3>{assetObject.name}</h3>
                          <h4>{assetObject.full}</h4>
                        </span>
                      </div>
                      {!openFrom ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </div>
                  )}
                </>
              ))}
            </>
          )}
          <p>
            1 {assets[activeFrom].name} = ${priceOf(assets[activeFrom].name)}
          </p>
        </section>
        <section className="asset">
          <h4>To</h4>
          {openTo ? (
            <div className="opencontainer">
              <div className="absolutecontainer">
                {assets.map((assetObject, index) => {
                  if (index === activeFrom) return null;

                  return (
                    <>
                      {activeTo === index && (
                        <div
                          className={
                            activeTo === index
                              ? "assetcontainer active"
                              : "assetcontainer"
                          }
                          onClick={() => handleActiveTo(index)}
                        >
                          <div className="left">
                            <img
                              src={environment.file_url + '/' + assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {activeTo === index && <MdKeyboardArrowDown />}
                        </div>
                      )}
                    </>
                  );
                })}
                {assets.map((assetObject, index) => {
                  if (index === activeFrom) return null;

                  return (
                    <>
                      {activeTo !== index && (
                        <div
                          className={
                            activeTo === index
                              ? "assetcontainer active"
                              : "assetcontainer"
                          }
                          onClick={() => handleActiveTo(index)}
                        >
                          <div className="left">
                            <img
                              src={environment.file_url + '/' + assetObject.icon}
                              alt={assetObject.name}
                              width={30}
                              height={30}
                            />
                            <span>
                              <h3>{assetObject.name}</h3>
                              <h4>{assetObject.full}</h4>
                            </span>
                          </div>
                          {activeTo === index && <MdKeyboardArrowDown />}
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
              <>
                {assets.map((assetObject, index) => (
                  <>
                    {index === activeTo && (
                      <div
                        className="assetcontainer"
                        onClick={() => setOpenTo((openTo) => !openTo)}
                      >
                        <div className="left">
                          <img
                            src={environment.file_url + '/' + assetObject.icon}
                            alt={assetObject.name}
                            width={30}
                            height={30}
                          />
                          <span>
                            <h3>{assetObject.name}</h3>
                            <h4>{assetObject.full}</h4>
                          </span>
                        </div>
                        {!openTo ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <MdKeyboardArrowDown />
                        )}
                      </div>
                    )}
                  </>
                ))}
              </>
            </div>
          ) : (
            <>
              {assets.map((assetObject, index) => (
                <>
                  {index === activeTo && (
                    <div
                      className="assetcontainer"
                      onClick={() => setOpenTo((openTo) => !openTo)}
                    >
                      <div className="left">
                        <img
                          src={environment.file_url + '/' + assetObject.icon}
                          alt={assetObject.name}
                          width={30}
                          height={30}
                        />
                        <span>
                          <h3>{assetObject.name}</h3>
                          <h4>{assetObject.full}</h4>
                        </span>
                      </div>
                      {!openTo ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </div>
                  )}
                </>
              ))}
            </>
          )}
          <p>
            1 {assets[activeTo].name} = ${priceOf(assets[activeTo].name)}
          </p>
        </section>

        <section className="available">
          <h4>Available</h4>
          <h3>
            {getAssetFromWallet(assets[activeFrom].name)}{" "}
            {assets[activeFrom].name}
          </h3>
        </section>

        <section className="bottom">
          <h4>{assets[activeFrom].name} spent</h4>
          <input
            placeholder="0.0000"
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
          {received && (
            <div className="received">
              <p>{assets[activeTo].name} received</p>
              <h2>
                {received} {assets[activeTo].name}
              </h2>
              <button onClick={handleConvert}>Convert</button>
            </div>
          )}

          {error && <Alert text={error} error={true} />}
          <button onClick={convert}>GET QUOTE</button>
          <div className="max">
            <p>
              Max ={" "}
              <span>
                {(Math.round(max * 100) / 100).toLocaleString("en-US")} {assets[activeTo].name}
              </span>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Convert;

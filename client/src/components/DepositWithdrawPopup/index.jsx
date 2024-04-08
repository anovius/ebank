import React, { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import "./styles.scss";
import KycPopup from "../KycPopup";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Transaction from "../../api/transaction";
import TransactionInfo from "../TransactionInfo";
import Asset from "../../api/asset";
import { environment } from "../../constants";
import Alert from "../Alert";

export default function DepositPopup({ popup, setPopup, type }) {
  const [assets, setAssets] = useState([
    {
      name: "BTC",
      full: "Bitcoin",
      icon: "/images/dashboard/bitcoin.svg",
      min: 0.01138,
    },
  ]);
  const [wallet, setWallet] = useState({
    assets: [],
  });

  useEffect(async () => {
    Asset.getAll().then(res => {
      setAssets(res.data.data.assets);
    });
    Transaction.wallet().then((res) => {
      setWallet(res.data.data.wallet);
    })
  }, []);

  const getAssetFromWallet = (asset) => {
    let index = wallet.assets.findIndex((a) => a.symbol === asset);
    return index > -1 ? wallet.assets[index].amount : 0;
  }

  const [verified] = useState(true);

  const [amount, setAmount] = useState(0);

  const [transactionInfo, setTransactionInfo] = useState(false);

  const [active, setActive] = useState(0);
  const [address, setAddress] = useState("");

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setAmount(parseFloat(e.target.value));
    handleCheck();
    if(e.target.value > assets[active].max){
      setError("Max amount Allowed is " +assets[active].max);
    }
    else{
      setError("")
    }
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleCheck = () => {
    if (+popup !== 2 && amount > assets[active].max) {
      setError("Max amount Allowed is " +assets[active].max);
      return false;
    }
    if (+popup === 2 && amount > getAssetFromWallet(assets[active].name)) {
      setError("Not enough funds.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!handleCheck()) return;
    if(type === 'deposit'){
      setTransactionInfo(true);
    }
    else{
      let body = {
        transaction:{
          amount: amount,
          asset: assets[active].name,
          address: address,
        }
      }
      Transaction.withdraw(body).then(res => {
        console.log(res);
        setSuccess("Withdrawal request successful");
        setAmount(0);
        setAddress("");
      });
    }
  };

  const networks = [
    {
      name: "ERC 20",
      full: "Ethereum Mainnet",
      icon: "images/dashboard/ethereum.svg",
    },
  ];

  const handleClose = () => {
    setPopup(0);
  };

  const handleActive = (ind) => {
    setActive(ind);
    setOpen(false);
  };

  const withdrawPopup = () => {
    return (
      <Modal open={popup !== 0 ? true : false}>
        <section className="withdrawpopup">
          <div className="box">
            <div className="headertitle">
              <img
                src="/images/close.svg"
                alt="close"
                width={15}
                height={15}
                onClick={handleClose}
                className="firstImg"
              />
              <h1>WITHDRAW</h1>
              <img
                src="/images/close.svg"
                alt="close"
                width={15}
                height={15}
                value={amount}
                onClick={handleClose}
              />
            </div>
            <div className="content">
              <span className="asset">
                <h4>Asset</h4>
                {open ? (
                  <div className="opencontainer">
                    <div className="absolutecontainer">
                      {assets.map((assetObject, index) => (
                        <>
                          {active === index && assetObject.status === 1 && (
                            <div
                              className={
                                active === index
                                  ? "assetcontainer active"
                                  : "assetcontainer"
                              }
                              onClick={() => handleActive(index)}
                            >
                              <div className="left">
                                <img
                                  src={environment.file_url + '/' + assetObject?.icon}
                                  alt={assetObject?.name}
                                  width={30}
                                  height={30}
                                />
                                <span>
                                  <h3>{assetObject?.name}</h3>
                                  <h4>{assetObject?.full}</h4>
                                </span>
                              </div>
                              {active === index && <MdKeyboardArrowDown />}
                            </div>
                          )}
                        </>
                      ))}
                      {assets.map((assetObject, index) => (
                        <>
                          {active !== index &&  assetObject.status === 1 && (
                            <div
                              className={
                                active === index
                                  ? "assetcontainer active"
                                  : "assetcontainer"
                              }
                              onClick={() => handleActive(index)}
                            >
                              <div className="left">
                                <img
                                  src={environment.file_url + '/' + assetObject?.icon}
                                  alt={assetObject?.name}
                                  width={30}
                                  height={30}
                                />
                                <span>
                                  <h3>{assetObject?.name}</h3>
                                  <h4>{assetObject?.full}</h4>
                                </span>
                              </div>
                              {active === index && <MdKeyboardArrowDown />}
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {assets.map((assetObject, index) => (
                      <>
                        {index === active && assetObject.status === 1 && (
                          <div
                            className="assetcontainer"
                            onClick={() => setOpen((open) => !open)}
                          >
                            <div className="left">
                              <img
                                src={environment.file_url + '/' + assetObject?.icon}
                                alt={assetObject?.name}
                                width={30}
                                height={30}
                              />
                              <span>
                                <h3>{assetObject?.name}</h3>
                                <h4>{assetObject?.full}</h4>
                              </span>
                            </div>
                            {!open ? (
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
              </span>
              <span className="available">
                <h3>Available</h3>
                <h2>{
                  getAssetFromWallet(assets[active].name)
                }</h2>
              </span>
              <span className="amount">
                <label>Destination Address</label>
                <input
                  type="string"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </span>
              <span className="amount">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleChange}
                />
              </span>
              {error && <Alert text={error} error={true} />}
              {success && <Alert text={success} error={false} />}
              <span className="delegatebox">
                <button
                  className={amount > 0.0 && address!==''? "delegate" : "delegate disable"}
                  onClick={handleSubmit}
                  disabled={amount > assets[active].min ? false : true || amount <= assets[active].max ? false : true}
                >
                  WITHDRAW
                </button>
              </span>
            </div>
          </div>
        </section>
      </Modal>
    );
  };

  const depositPopup = () => {
    return (
      !transactionInfo ?
      <Modal open={popup !== 0 ? true : false}>
        <section className="depositpopup">
          <div className="box">
            <div className="headertitle">
              <img
                src="/images/close.svg"
                alt="close"
                width={15}
                height={15}
                onClick={handleClose}
                className="firstImg"
              />
              <h1>DEPOSIT</h1>
              <img
                src="/images/close.svg"
                alt="close"
                width={15}
                height={15}
                value={amount}
                onClick={handleClose}
              />
            </div>
            <div className="content">
              <span className="asset">
                <h4>Asset</h4>
                {open ? (
                  <div className="opencontainer">
                    <div className="absolutecontainer">
                      {assets.map((assetObject, index) => (
                        <>
                          {active === index &&  assetObject.status === 1 &&(
                            <div
                              className={
                                active === index
                                  ? "assetcontainer active"
                                  : "assetcontainer"
                              }
                              onClick={() => handleActive(index)}
                            >
                              <div className="left">
                                <img
                                  src={environment.file_url + '/' + assetObject?.icon}
                                  alt={assetObject?.name}
                                  width={30}
                                  height={30}
                                />
                                <span>
                                  <h3>{assetObject?.name}</h3>
                                  <h4>{assetObject?.full}</h4>
                                </span>
                              </div>
                              {active === index && <MdKeyboardArrowDown />}
                            </div>
                          )}
                        </>
                      ))}
                      {assets.map((assetObject, index) => (
                        <>
                          {active !== index &&  assetObject.status === 1 &&(
                            <div
                              className={
                                active === index
                                  ? "assetcontainer active"
                                  : "assetcontainer"
                              }
                              onClick={() => handleActive(index)}
                            >
                              <div className="left">
                                <img
                                  src={environment.file_url + '/' + assetObject?.icon}
                                  alt={assetObject?.name}
                                  width={30}
                                  height={30}
                                />
                                <span>
                                  <h3>{assetObject?.name}</h3>
                                  <h4>{assetObject?.full}</h4>
                                </span>
                              </div>
                              {active === index && <MdKeyboardArrowDown />}
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {assets.map((assetObject, index) => (
                      <>
                        {index === active &&  assetObject.status === 1 && (
                          <div
                            className="assetcontainer"
                            onClick={() => setOpen((open) => !open)}
                          >
                            <div className="left">
                              <img
                                src={environment.file_url + '/' + assetObject?.icon}
                                alt={assetObject?.name}
                                width={30}
                                height={30}
                              />
                              <span>
                                <h3>{assetObject?.name}</h3>
                                <h4>{assetObject?.full}</h4>
                              </span>
                            </div>
                            {!open ? (
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
              </span>
              {assets[active].name === "ETH" && (
                <span className="asset">
                  <h4>Network</h4>
                  <div className="assetcontainer">
                    <div className="left">
                      <img
                        src={networks[0].icon}
                        alt={networks[0].name}
                        width={30}
                        height={30}
                      />
                      <span>
                        <h3>{networks[0].name}</h3>
                        <h4>{networks[0].full}</h4>
                      </span>
                    </div>
                  </div>
                </span>
              )}
              <span className="amount">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleChange}
                  onBlur={handleCheck}
                />
              </span>
              <span className="delegatebox mt-4">
              <button
              className={amount > assets[active].min &&  amount <= assets[active].max ? "delegate" : "delegate disable"}
              onClick={handleSubmit}
              >
                  Deposit
                </button>
              </span>
              <p class="depositError">{error}</p>
              
              <span className="warningbox">
                <div className="b">
                  <p>
                    <strong>Minimum Amount: </strong>
                    {assets[active].min} {assets[active].name}
                    <br />
                    Any amount below the minimum won't be credited or refunded
                  </p>
                </div>
              </span>
            </div>
          </div>
        </section>
      </Modal> 
      : <TransactionInfo transaction={{asset: assets[active].name, amount: amount, address: assets[active].walletAddress}} setPopup={setPopup} />
    );
  };

  return (
    <>
      {verified ? (
        <>{type === "deposit" ? depositPopup() : withdrawPopup()}</>
      ) : (
        <KycPopup popup={popup} setPopup={setPopup} />
      )}
    </>
  );
}

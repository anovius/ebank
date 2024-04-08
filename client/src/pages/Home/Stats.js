import React, { useEffect, useState } from 'react';
import './Stats.scss';
import Nav from './Nav';
import Footer from './Footer';
import btc from '../../images/dashboard/btc.webp';
import eth from '../../images/dashboard/ethereum.svg';
import bnb from '../../images/dashboard/bnb.svg';
import ebct from '../../images/dashboard/ebct.svg';
import three from '../../images/dashboard/three.webp';
import Asset from '../../api/asset';
import { environment } from '../../constants';

const Stats = () => {

  const [assetsOne, setOneAssets] = useState([]);
  const [assetsTwo, setTwoAssets] = useState([]);
  const [middleIndex, setMiddleIndex] = useState(0);

  useEffect(() => {
    Asset.getAll().then(res => {
      setOneAssets(res.data.data.assets.slice(0, Math.ceil(res.data.data.assets.length / 2)));
      setTwoAssets(res.data.data.assets.slice(Math.ceil(res.data.data.assets.length / 2)));
    })
  }, [])

  const cards = [
    {
      name: "BTC",
      value: 25,
      img: btc,
    },
    {
      name: "EBCT",
      value: 310000000,
      img: ebct,
    },
    {
      name: "ETH",
      value: 1369,
      img: eth,
    },
    {
      name: "BNB",
      value: 2690,
      img: bnb,
    },
    {
      name: "BTC",
      value: 25,
      img: btc,
    },
    {
      name: "USDC, USDT",
      value: 2730290,
      img: three,
    },
  ];

  const mainStats = [
    {
      label: "Percentage staked",
      value: "63.12%",
    },
    {
      label: "EBCT Locked",
      value: "520M",
    },
  ];

  const miniStats = [
    {
      value: "$0.0005",
      label: "EBCT Price",
    },
    {
      value: "$6,907,376",
      label: "Market Cap",
    },
    {
      value: "310,650,624 EBCT",
      label: "Circulating Supply",
    },
    {
      value: "1,000,000,000 EBCT",
      label: "Max Supply",
    },
  ];

  const community = [
    {
      value: "23,075",
      label: "Register Holders",
    },
    {
      value: "$1,289,040",
      label: "Withdrawals Paid out",
    },
  ];

  const tokenContract = "Oxf8688fD01B8e5ac811b0cA51Be1af08457aB602a";

  return (
    <>
      <Nav />

      <div className="statsMain">
        <div className="statStart">
          <div className="statsText">
            <h1>EBankc Stats</h1>
            <p>Here is a detailed breakdown of all the assets currently managed on EBankc App. Updated monthly.</p>
          </div>
          <div className="statsCards">
            <div className="statsFirst-col">
            {assetsOne.map((curElem, i) => {
              const { name, stats, icon } = curElem;
                return (
                  <>
                  <div className="statsCard" key={i}>
                  <img src={environment.file_url+'/'+icon} alt="" />
                  <h3>{stats}</h3>
                  <p>{name}</p>
                </div>
                  </>
                )
              })}
            </div>
            <div className="statsSecond-col">
              {assetsTwo.map((curElem, i) => {
                const { name, stats, icon } = curElem;
                return (
                  <>
                    <div className="statsCard" key={i}>
                      <img src={environment.file_url+'/'+icon} alt="" />
                      <h3>{stats}</h3>
                      <p>{name}</p>
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>

        <div className="statsEbct">
          <h2>EBCT Stats</h2>


          <div className="statsCard-row">
            {mainStats.map((curElem, i) => {
              const { label, value } = curElem;
              return (
                <>
                  <div className="statsGreen-card">
                    <h5>{value}</h5>
                    <p>{label}</p>
                  </div>

                </>
              )
            })}
          </div>


          <div className="token-content">
            <div className="token-data">
              {
                miniStats.map((curElem, index) => {
                  const { label, value } = curElem
                  return (
                    <>
                      <div className="tokenData-card">
                        <h6>{value}</h6>
                        <p>{label}</p>
                      </div>
                    </>
                  )
                })
              }
            </div>
            <div className="tokenContract">
              <h5>{tokenContract}</h5>
              <p>Contract Address</p>
            </div>
          </div>
        </div>

        <div className="community">
          <h2>EBankc Community</h2>
          <div className="community-row">
            {community.map((curElem, i) => {
              const {value, label} = curElem;
              return (
                <>
                  <div className="community-cirle">
                    <h5>{value}</h5>
                    <p>{label}</p>
                  </div>
                </>
              )
            })}
          </div>
        </div>

      </div>


      <Footer />
    </>
  )
}

export default Stats

import React, { useEffect, useState } from "react";
import './index.scss'
import Nav from "./Nav";
import Footer from './Footer';
import laptop from '../../images/laptop_and_phone.webp';
import logo from '../../images/ebct.svg'
import phone from '../../images/phone.webp';
import checkmark from '../../images/checkmark.svg';
import earn from '../../images/earn.svg';
import online from '../../images/online.svg';
import utilityCard from '../../images/credit_card.svg'
import tokenImg from '../../images/token.svg'
import User from "../../api/user";
import { environment } from "../../constants";
import { Link } from "react-router-dom";


function Home() {

    const [team, setTeam] = useState([]);

    const assets = [
        {
            name: "BTC",
            increase: 8,
            color: "#f7931a",
            img: "/images/dashboard/bitcoin.svg",
        },
        {
            name: "ETH",
            increase: 8,
            color: "#627ee9",
            img: "/images/dashboard/ethereum.svg",
        },
        {
            name: "BNB",
            increase: 6,
            color: "#f0b90b",
            img: "/images/dashboard/bnb.svg",
        },
        {
            name: "USDC",
            increase: 9,
            color: "#2775ca",
            img: "/images/dashboard/usdc.svg",
        },
        {
            name: "USDT",
            increase: 9,
            color: "#26a17a",
            img: "/images/dashboard/usdt.svg",
        },
        {
            name: "EBCT",
            increase: 4,
            color: "#013220",
            img: "/images/dashboard/ebct.svg",
        },
    ];

    const pros = [
        {
            title: "Accessible and easy to use",
            text: "Our Web App is very accessible and simple to use.",
        },
        {
            title: "Top-Tier Protection",
            text: "Your assets and privacy are secured. We've built a premium compliance program to safeguard your assets.",
        },
        {
            title: "Global Reach",
            text: "Easily manage your account from anywhere in the world.",
        },
    ];

    const getAllUsers = () => {
        User.getAllTeam().then(res => {
            setTeam(res.data.data);
        })
    }

    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <>
            <Nav />

            <section className="start">
                <div className="inner">
                    <img src={laptop} className="laptopMob" alt="Graphic of laptop and phone" />
                    <div className="content">
                        <h1>Unlocking the power of Defi-Banking</h1>
                        <p>
                            Earn Interest, borrow, and exchange digital assets at competitive
                            rates
                        </p>
                        <Link to="/signup"><button type="button">
                            Create Account
                        </button></Link>
                    </div>
                </div>
            </section>


            <section className="assets">
                <h2>Available Assets</h2>
                <div className="asset_grid">
                    {assets.map((asset, i) => (

                        <div key={i} asset={asset} className="asset" style={{ borderColor: asset.color }}>
                            <img
                                className="token-img"
                                src={`${asset.img}`}
                                alt="Icon of asset"
                            />
                            <h3 style={{ color: asset.color }}>{asset.name}</h3>
                            <p>Up to {asset.increase}% in 30 days</p>
                        </div>
                    ))}
                </div>
            </section>



            {/* Pros Section */}

            <section className="pros">
                <div className="inner">
                    <img src={phone} className="phone" alt="Graphic of phone" />
                    <div className="advantages">
                        {pros.map((pro, i) => (
                            <div className="advantage" key={i}>
                                <img src={checkmark} width={100} alt="Icon of checkmark" />
                                <div className="content">
                                    <h4>{pro.title}</h4>
                                    <p>{pro.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>




            {/* Earn Section */}

            <section className="earn">
                <div className="inner">
                    <img src={earn} className="earn-img" alt="Earn icon" />
                    <div className="text">
                        <h2>Earn short term Interest</h2>
                        <h4>Increase your reward level by holding more EBCT token</h4>
                        <p>
                            We offer the {"market's"} leading returns on your crypto assets.
                            Rewards gets paid out after 30 days.
                        </p>
                    </div>
                </div>
            </section>


            {/* Borrow Section */}

            <section className="borrow">
                <div className="inner">
                    <img src={online} className="online-img" alt="Online icon" />
                    <div className="text">
                        <h2>Borrow and Transact seamlessly</h2>
                        <h5>Borrow Stablecoins</h5>
                        <p>Collaterize your asset to borrow Stablecoins</p>
                        <h5>No origination Fees</h5>
                        <p>Transact seamlessly with no gas fees attached.</p>
                        <h5>No Downtime</h5>
                        <p>Carryout transaction 24/7 on the app</p>
                    </div>
                </div>
            </section>


            {/* Utility Section */}

            <section className="utility">
                <div className="inner">
                    <img src={utilityCard} className="utility-img" alt="Credit Card icon" />
                    <div className="text">
                        <h2>Integrated Utility Card</h2>
                        <h4>EBankc Card (coming soon)</h4>
                        <p>Get a pocket size gateway integrated with your EBankc account</p>
                        <h5>Key Features</h5>
                        <ul>
                            <li>Make purchase directly from your account</li>
                            <li>Supported by several merchants globally</li>
                            <li>2% discount on each transaction</li>
                        </ul>
                    </div>
                </div>
            </section>


            {/* Token Section */}

            <section className="token">
               <div className="inner">
               <img src={tokenImg} className="token-img" alt="Icon of token" />
                <div className="text">
                    <h2>The EBankc Utility Token (EBCT)</h2>
                    <h4>The EBCT token powers the EBankc ecosystem</h4>
                    <ul>
                        <li>Boost your rewards</li>
                        <li>Earn interest on your EBCT</li>
                    </ul>
                    <button>Learn More</button>
                </div>
               </div>
            </section>



            <div className="Team">
                <div className="teamContainer">
                    <marquee behavior="scroll" direction="right" scrollamount="12">
                    <div className="teamRow">
                        
                        {team.map((user, i) => (
                            <div className="team-member">
                                <img src={environment.file_url + '/' + user.img} alt="" />
                                    <div className="teamName">{user.name}</div>
                                <div className="TeamRank">{user.designation}</div>
                            </div>
                        ))}

                    </div>
                    </marquee>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Home;
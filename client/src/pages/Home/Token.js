import React from 'react';
import './Token.scss';
import Nav from './Nav';
import Footer from './Footer';
import token from '../../images/Token/tokens.webp';
import boost from '../../images/Token/boost.png';
import earn from '../../images/Token/earn.png';
import lamp from '../../images/Token/lamp.png';
import usdc from '../../images/dashboard/usdc.svg';
import usdt from '../../images/dashboard/usdt.svg';
import btc from '../../images/dashboard/btc.webp';
import eth from '../../images/dashboard/ethereum.svg';
import ebct from '../../images/dashboard/ebct.svg';
import ada from '../../images/dashboard/ada.webp';
import bnb from '../../images/dashboard/bnb.svg';
import Tokens from '../../images/token.svg';


export default function Token() {

    const earnStats = [
        {
            img: boost,
            title: "Boost your reward",
            text: "Boost your karma with EBCT to increase your interest on assets. The higher your Karma level, the higher your interest",
        },
        {
            img: earn,
            title: "Earn up to 4% monthly",
            text: "Hold EBCT tokens and earn up to 4% in 30 days on your tokens",
        },
        {
            img: lamp,
            title: "Swap Easily",
            text: "You can easily swap your EBCT tokens to other assets on the EBank DApp",
        },
    ];

    const getRoadmap = [
        {
            title: "Exchange Asset",
            text: "Easily exchange your assets to EBCT on the EBankc App",
        },
        {
            title: "Purchase on Exchanges (coming soon)",
            text: "After the presale EBCT will be listed on several exchanges",
        },
        {
            title: "Refer a friend (coming soon)",
            text: "Refer your friend and family and earn $20 worth of EBCT on your account",
        },
    ];

    const tokenData = [
        {
            value: "0.005",
            label: "EBCT Price",
            dollarSign: true,
        },
        {
            value: "480,596,060",
            label: "Market Cap",
        },
        {
            value: "520,000,000",
            label: "Circulating Supply",
        },
        {
            value: "1,000,000,000",
            label: "Max Supply",
        },
    ];

    const tokenContract = "Oxf8688fD01B8e5ac811b0cA51Be1af08457aB602a";

    const tableOneTitle =
        "The EBankc Karma is a reward program, which extends interestdepending on a user's verification level and the number of EBCTtokens the user holds in his EBankc wallet";
    const tableOneData = [
        {
            name: "USDC",
            img: usdc,
            levels: [3, 5, 7, 9],
        },
        {
            name: "USDT",
            img: usdt,
            levels: [3, 5, 7, 9],
        },
        {
            name: "BTC",
            img: btc,
            levels: [2, 4, 6, 8],
        },
        {
            name: "ETH",
            img: eth,
            levels: [2, 4, 6, 8],
        },
        {
            name: "EBCT",
            img: ebct,
            levels: [1, 2, 3, 4],
        },
        {
            name: "ADA",
            img: ada,
            levels: [1, 2, 4, 6],
        },
        {
            name: "BNB",
            img: bnb,
            levels: [1, 2, 4, 6],
        },
    ];

    const tableTwoTitle = "Borrowing rates and karma level";
    const tableTwoData = [
        {
            name: "USDT",
            img: usdt,
            levels: [8, 6, 4, 2],
        },
        {
            name: "USDC",
            img: usdc,
            levels: [8, 6, 4, 2],
        },
    ];


    return (
        <>
            <Nav />

            <section className="Token">
                <div className="inner">
                    <img src={token} className="tokenImg" alt="" />
                    <div className="tokenContent">
                        <h1>The EBCT Utility Token</h1>
                        <h2>Level up with EBCT tokens</h2>
                        <p>
                            EBCT is an Erc20-compliant utility token embedded in the Ethereum Chain as a smart contract.
                        </p>
                    </div>
                </div>
            </section>

            <div className="Reward">
                <div className="rewardEarn">
                    <div className="earnText">
                        <h2>EBCT Utility & Reward</h2>
                        <p>
                            By holding EBCT tokens users can receive up to 4% interest in 30 days. Holding EBCT tokens also increases your karma level, which increases your reward on other tokens.
                        </p>
                        <button type='button'>Learn More</button>
                    </div>
                    <div className="earnStats">
                        {earnStats.map((curElem, index) => {
                            const { img, title, text } = curElem
                            return (
                                <>
                                    <div className="statsCard" key={index}>
                                        <img src={img} alt="" />
                                        <div className="heading">{title}</div>
                                        <div className="text">{text}</div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="karma">
                <div className="inner">
                    <h2>EBankc Karma Program</h2>


                    <div className="TableKarma">
                        <h4>{tableOneTitle}</h4>
                        <div className="tableContain">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th>
                                            <div>Karma level 1</div>
                                            <p>(0 - 49,999EBTC)</p>
                                        </th>
                                        <th>
                                            <div>Karma level 2</div>
                                            <p>(50,000 - 199,999EBTC)</p>
                                        </th>
                                        <th>
                                            <div>Karma level 3</div>
                                            <p>(200,000 - 1,000,000EBTC)</p>
                                        </th>
                                        <th>
                                            <div>Karma level 4</div>
                                            <p>(1,000,000+ EBTC)</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableOneData.map((curElem, index) => {
                                        const { name, img, levels } = curElem
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <td>
                                                        <div className="table-flex">
                                                            <div className="currenc-logo">
                                                                <img src={img} alt="" />
                                                            </div>
                                                            <div className="name">{name}</div>
                                                        </div>
                                                    </td>
                                                    <td><div className='level'>{levels[0]}%</div></td>
                                                    <td><div className='level'>{levels[1]}%</div></td>
                                                    <td><div className='level'>{levels[2]}%</div></td>
                                                    <td><div className='level'>{levels[3]}%</div></td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="TableKarma">
                        <h4>{tableTwoTitle}</h4>
                        <div className="tableContain">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th>
                                            <div>Karma level 1</div>
                                            <p>(0 - 49,999EBTC)</p>
                                        </th>
                                        <th>
                                            <div>Karma level 2</div>
                                            <p>(50,000 - 199,999EBTC)</p>
                                        </th>
                                        <th>
                                            <div>Karma level 3</div>
                                            <p>(200,000 - 1,000,000EBTC)</p>
                                        </th>
                                        <th>
                                            <div>Karma level 4</div>
                                            <p>(1,000,000+ EBTC)</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableTwoData.map((curElem, index) => {
                                        const { name, img, levels } = curElem
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <td>
                                                        <div className="table-flex">
                                                            <div className="currenc-logo">
                                                                <img src={img} alt="" />
                                                            </div>
                                                            <div className="name">{name}</div>
                                                        </div>
                                                    </td>
                                                    <td><div className='level'>{levels[0]}%</div></td>
                                                    <td><div className='level'>{levels[1]}%</div></td>
                                                    <td><div className='level'>{levels[2]}%</div></td>
                                                    <td><div className='level'>{levels[3]}%</div></td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="howTo">
                <div className="inner">
                    <h2>How to get EBCT</h2>
                    <p className='innerText'>210,000,000 EBCT will be distributed through our Reward program</p>
                    <div className="content">
                        <div className="token-img">
                            <img src={Tokens} alt="" />
                        </div>
                        <div className="list">
                            <div className="listItem">
                                <div className="token-digit">1</div>
                                <div className='tokenText'>
                                    <h5>Exchange Asset</h5>
                                    <p>Easily exchange your assets to EBCT on the EBankc App</p>
                                </div>
                            </div>
                            <div className="listItem">
                                <div className="token-digit">2</div>
                                <div className='tokenText'>
                                    <h5>Purchase on Exchanges (coming soon)</h5>
                                    <p>After the presale EBCT will be listed on several exchanges</p>
                                </div>
                            </div>
                            <div className="listItem">
                                <div className="token-digit">3</div>
                                <div className='tokenText'>
                                    <h5>Refer a friend (coming soon)</h5>
                                    <p>Refer your friend and family and earn $20 worth of EBCT on your account</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <div className="EBCT-stats">
                <div className="inner">
                    <h2>EBCT Stats</h2>
                    <div className="token-content">
                        <div className="token-data">
                            {
                                tokenData.map((curElem, index) => {
                                    const {label, value} = curElem
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
            </div>

            <Footer />
        </>
    )
}

import React from 'react';
import Nav from './Nav';
import './About.scss';
import Footer from './Footer';
import building from '../../images/About/buildings.webp';
import Bitgo from '../../images/About/bitgo.jpeg';
import onramp from '../../images/About/onramper.png';
import compound from '../../images/About/compound.png';
import ledger from '../../images/About/ledger.png';
import google from '../../images/About/google.png';
import whiteStar from '../../images/About/whitestar.png';
import capitalBlock from '../../images/About/genblock.png';
import distributed from '../../images/About/distributedcompute.jpg';
import stoneGroup from '../../images/About/stone.png';
import transaction from '../../images/About/transaction.svg';
import fees from '../../images/About/nofees.svg';
import license from '../../images/About/license.svg';
import security from '../../images/About/security.svg';
import token from '../../images/About/token.svg';
import support from '../../images/About/customerSupport.svg';
import qin from '../../images/About/qin.webp';
import barrette from '../../images/About/barrette.webp';
import reid from '../../images/About/reid.webp';
import denos from '../../images/About/tesha.webp';



const About = () => {

    const backedCompanies = [
        "bitgo.jpeg",
        "onramper.png",
        "compound.png",
        "ledger.png",

        "google.png",
    ];

    const partnerCompanies = [
        "whitestar.png",
        "genblock.png",
        "distributedcompute.jpg",
        "stone.png",
    ];

    const trustReasons = [
        {
            text: "Swift Automatic Transactions",
            img: "transaction.svg",
        },
        {
            text: "No Hidden Fees",
            img: "nofees.svg",
        },
        {
            text: "Licensed and Regulated",
            img: "license.svg",
        },
        {
            text: "Top-tier Security and insurance on assets",
            img: "security.svg",
        },
        {
            text: "EBCT Utility Token",
            img: "token.svg",
        },
        {
            text: "24/7 Customer Support",
            img: "customerSupport.svg",
        },
    ];

    const team = [
        {
            img: "qin.webp",
            name: "Mr. Qin Hauzheng",
            role: "CEO (Founder)",
        },
        {
            img: "barrette.webp",
            name: "Barrette David",
            role: "CFO",
        },
        {
            img: "reid.webp",
            name: "Reid Adrian",
            role: "Director of client service",
        },
        {
            img: "tesha.webp",
            name: "Tesha Denos",
            role: "Head of Institutional Lending",
        },
    ];

    return (
        <>
            <Nav />

            <section className="About">
                <div className="Topinner">
                    <h2 >Commercializing DeFi Banking</h2>
                    <p>EBankc is the most rewarding and secured institution in the DeFi industry.</p>
                    <div className="image-building">
                        <img src={building} alt="" />
                    </div>
                    <p>
                    EBankc was created  to solve inefficiency within the DeFi market .
                    </p>
                    <p>Our services include, but are not limited to:</p>
                    <ul>
                        <li>Instant Online Consumer Loans</li>
                        <li>Passive interest for assets</li>
                        <li>E-commerce Financing</li>
                    </ul>
                    <p>
                    EBankc is the answer to solving the scarcity of Crypto lending, trading, and asset management services within the DeFi industry. This is achieved by creating innovative and convenient financial solutions. EBankc has gradually evolved into a global market leader in the online consumer lending and crypto investment segment.
                    </p>
                    <p>
                    Our competitive advantage prevails because of our efficient business model, which utilizes cutting-edge technology solutions, service diversification, and the best business professionals to ensure our longstanding success in the Fintech Market.
                    </p>
                </div>

                <div className="backed">
                    <h2>Backed By</h2>
                    <div className="Company">
                        <div className="companyCard">
                            <img src={Bitgo} alt="" />
                        </div>
                        <div className="companyCard">
                            <img src={compound} alt="" />
                        </div>
                        <div className="companyCard">
                            <img src={ledger} alt="" />
                        </div>
                        <div className="companyCard">
                            <img src={google} alt="" />
                        </div>

                    </div>
                </div>

                <div className="partners">
                    <h2>Partners</h2>
                    <div className="partner">
                        <div className="partnerCard">
                            <img src={whiteStar} alt="" />
                        </div>
                        <div className="partnerCard">
                            <img src={capitalBlock} alt="" />
                        </div>
                        <div className="partnerCard">
                            <img src={distributed} alt="" />
                        </div>
                        <div className="partnerCard">
                            <img src={stoneGroup} alt="" />
                        </div>
                    </div>
                </div>

                <div className="whyChoose">
                    <h2>Why Choose Us</h2>
                    <div className="chooseReason">
                        <div className="chooseCard">
                            <img src={transaction} alt="" />
                            <div className="title">Swift Automatic Transactions</div>
                        </div>
                        <div className="chooseCard">
                            <img src={fees} alt="" />
                            <div className="title">No Hidden Fees</div>
                        </div>
                        <div className="chooseCard">
                            <img src={license} alt="" />
                            <div className="title">Licensed and Regulated</div>
                        </div>
                        <div className="chooseCard">
                            <img src={security} alt="" />
                            <div className="title">Top-tier Security and insurance on assets</div>
                        </div>
                        <div className="chooseCard">
                            <img src={token} alt="" />
                            <div className="title">EBCT Utility Token</div>
                        </div>
                        <div className="chooseCard">
                            <img src={support} alt="" />
                            <div className="title">24/7 Customer Support</div>
                        </div>

                    </div>
                </div>

                {/*<div className="Teams">
                    <h2>The Team</h2>
                    <p>Meet our team of highly experienced and talented professionals</p>
                    <div className="teamMember">
                        <div className="teamCard">
                            <div className="teamImg">
                                <img src={qin} alt="" />
                            </div>
                            <div className="teamName">Mr. Qin Hauzheng</div>
                            <div className="teamRank">CEO (Founder)</div>
                        </div>
                        <div className="teamCard">
                            <div className="teamImg">
                                <img src={barrette} alt="" />
                            </div>
                            <div className="teamName">Barrette David</div>
                            <div className="teamRank">CFO</div>
                        </div>
                        <div className="teamCard">
                            <div className="teamImg">
                                <img src={reid} alt="" />
                            </div>
                            <div className="teamName">Reid Adrian</div>
                            <div className="teamRank">Director of client service</div>
                        </div>
                        <div className="teamCard">
                            <div className="teamImg">
                                <img src={denos} alt="" />
                            </div>
                            <div className="teamName">Tesha Denos</div>
                            <div className="teamRank">Head of Institutional Lending</div>
                        </div>
                    </div>
        </div>*/}

            </section>

            <Footer />
        </>
    )
}

export default About

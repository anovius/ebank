import React from 'react';
import './PreSale.scss';
import Nav from './Nav';
import Footer from './Footer';

const PreSale = () => {
    return (
        <>
            <Nav />

            <section className='PreSale'>
                <div className="main">
                    <div className="container">
                        <div className="preRow">
                            <div className="content">
                                <h1>The EBCT Utility Token</h1>
                                <h2>Level up with EBCT tokens</h2>
                                <p>EBCT is an Erc20-compliant utility token embedded in the Ethereum Chain as a smart contract.</p>
                                <div className="btns">
                                <button type='button'>WhitePaper</button>
                                <button type='button'>SignUp</button>
                                </div>
                            </div>
                            <div className="timer">
                                <h3>Pre-Sale Starts In:</h3>
                                <ul>
                                    <li>
                                        <div className="dashbox">
                                            <div className="value">00</div>
                                            <div className="label">days</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dashbox">
                                            <div className="value">00</div>
                                            <div className="label">hours</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dashbox">
                                            <div className="value">00</div>
                                            <div className="label">minutes</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dashbox">
                                            <div className="value">00</div>
                                            <div className="label">seconds</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default PreSale

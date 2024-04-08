import React from "react";
import './Nav.scss';
import logo from '../../images/ebct.svg'
import { Link, NavLink } from 'react-router-dom';


function Nav() {

    const socialMedia = [
        {
            link: "https://t.me/+34KPqqtdgA5hMzEx",
            img: "/images/footer/social_media/telegram.svg",
        },
        {
            link: "https://medium.com/@EBankcdefi",
            img: "/images/footer/social_media/medium.svg",
        },
    ];


    return (
        <>
            <div className="Nav">
                <nav className="nav">
                    <div className="container">
                        <input type="checkbox" id="nav-check" />
                        <Link to="/" className="logo-with-text">
                            <div className="logo">
                                <img src={logo} alt="" />
                            </div>
                            <div className="nav_text">EBankc</div>
                        </Link>
                        <div class="nav-btn">
                            <label for="nav-check">
                                <span></span>
                                <span></span>
                                <span></span>
                            </label>
                        </div>
                        <ul className="navbar-nav nav-links">
                            <li className="nav-item">
                                <NavLink to="/about" className="nav-link">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/token" className="nav-link">Token</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/corporates" className="nav-link">Corporates</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/blog" className="nav-link">Blog</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/stats" className="nav-link">Stats</NavLink>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.ebctsale.com" target="_blank" rel="noopener noreferrer" className="nav-link">EBCT Presale</a>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/faq" className="nav-link">FAQ</NavLink>
                            </li>
                            <li>
                                <div className="social_media">
                                    {socialMedia.map((media, i) => (
                                        <a key={i} target="_blank" rel="noreferrer" href={media.link}>
                                            <div className="imageContainer">
                                                <img src={media.img} alt="Icon of social media" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </li>
                            <li >
                                <Link to="/login"><button className="btn login-button">Log In</button></Link>
                            </li>
                        </ul>

                    </div>
                </nav>
            </div>
        </>
    );
}

export default Nav;
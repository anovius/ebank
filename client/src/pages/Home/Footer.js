import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom'
import logo from '../../images/ebct.svg'


const Footer = () => {


  const socialMedia = [
    {
      link: "https://t.me/+34KPqqtdgA5hMzEx",
      img: "/images/footer/social_media/telegram.svg",
    },
    {
      link: "https://medium.com/@EBankcdefi",
      img: "/images/footer/social_media/medium.svg",
    }
  ];

  const companyLinks = [
    {
      link: "/",
      name: "Home",
    },
    {
      link: "/about",
      name: "About",
    },
    {
      link: "/token",
      name: "Token",
    },
    {
      link: "/corporates",
      name: "Corporate Clients",
    },
    {
      link: "/contact",
      name: "Contact",
    },
  ];

  const resourceLinks = [
    {
      link: "/stats",
      name: "Stats",
    },
    {
      link: "/blog",
      name: "Blog",
    },
    {
      link: "/faq",
      name: "FAQ",
    },
  ];

  const legalLinks = [
    {
      link: "/terms_and_conditions",
      name: "Terms & Conditions",
    },
    {
      link: "/privacy_policy",
      name: "Privacy Policy",
    },
    {
      link: "/cookie_policy",
      name: "Cookie Policy",
    },
  ];


  return (
    <>
      <div className="outerbg">
        <footer className="footer">
          <div className="topText">
            <h2>Start Earning on your holdings</h2>
            <p>Unlock daily interest on your cryptos with as little as $500.</p>
            <p>Withdraw your assets whenever you want.</p>
            <a href="/signup">
              <button>Sign Up</button>
            </a>
          </div>

          <img className="logo" src={logo} alt="Icon of logo" />
          <div className="social_media">
            {socialMedia.map((media, i) => (
              <a key={i} target="_blank" rel="noreferrer" href={media.link}>
                <div className="imageContainer">
                  <img src={media.img} alt="Icon of social media" />
                </div>
              </a>
            ))}
          </div>
          <div className="lists">
            <div className="list">
              <p>Company</p>
              <ul>
                {companyLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.link}>
                      <a>{link.name}</a>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="list">
              <p>Resources</p>
              <ul>
                {resourceLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.link}>
                      <a>{link.name}</a>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="list">
              <p>Legal</p>
              <ul>
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.link}>
                      <a>{link.name}</a>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bottom">
            <p>© 2022. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Footer
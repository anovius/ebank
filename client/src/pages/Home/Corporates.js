import React from 'react';
import './Corporates.scss';
import Nav from './Nav';
import Footer from './Footer';
import laptop from '../../images/corporate/laptop.webp';
import lapMob from '../../images/corporate/laptop_and_phone.webp';
import security from '../../images/corporate/security.svg';

const Corporates = () => {

  const steps = [
    "Complete the EBank Corporate Account application form, providing all the necessary documents",
    "The EBankc approves your application, providing the application form is fully completed",
    "You will receive a welcome letter from the support team with your account logins which you can change after login",
    "You will then be able to access and fund your EBank Corporate Account to enjoy high returns on your assets",
  ];

  return (
    <>
      <Nav />

      <section className="Corporates">
        <div className="corporatesMain">
          <div className="corporatesStart">
            <h1>DeFi Banking Solution for Corporate Digital Assets</h1>

            <p>The EBankc Platform has created a unique platform for institutional investors. Our mission is to provide credit services in the DeFi space, for both individual and cooperate investors.</p>

            <p>Corporate Institutions can now store their assets and earn passive interest on them. They also get access to instant loans in Stable coins.</p>

            <button type='button'>Sign Up Now</button>
          </div>
        </div>

        {/* ux */}

        <div className="userExp">
          <img src={laptop} alt="" />
          <div className="content">
            <h5>Leading User Experience</h5>
            <h2>Fast and Accessible</h2>
            <p>EBankc is designed with client's experience in mind. The Cooperate interface is fast and easy to use.</p>
          </div>
        </div>

        {/* safety */}
        <div className="userExp safety">
          <img src={lapMob} alt="" />
          <div className="content">
            <h5>Safety First</h5>
            <h2>Maximum Security and Insurance on Custodial Assets</h2>
            <p>We've equipped the platform with top-quality security infrastructure designed to ensure maximum protection of assets at all times. Assets are backed by funds from both private and institutional partners and token sales. This fund ensures a better collateral ratio when needed, acting as a safety cushion during a shortfall.</p>
          </div>
        </div>

        {/* business */}
        <div className="userExp">
          <img src={security} alt="" />
          <div className="content">
            <h5>Know Your Business</h5>
            <h2>Licensed and Regulated Defi System</h2>
            <p>EBankc hold all required licenses and registrations and constantly bring their operations in line with newly adopted legislative regulations.</p>
          </div>
        </div>

        <div className="process">
          <h2>EBank Corporate Account Process</h2>
          <p>To get started with EBankc cooperate services, applicants will need to follow the steps below:</p>

          <div className="corporateSteps">
            {steps.map((curElem, i) => {
              return (
                <>
                  <div className="corporateCard">
                    <div className="corporate-Digit">{i}.</div>
                    <p>{curElem}</p>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />

    </>
  )
}

export default Corporates

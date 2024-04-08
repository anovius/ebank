import React, { useEffect, useState } from "react";
import "./styles.scss";
import VerifyButton from "@passbase/button/react";

import { BsCheck2 } from "react-icons/bs";

import KYC from "../../../api/kyc";

function KycLevel() {

  const [kyc, setKyc] = useState(null);

  useEffect(() => {
    KYC.get().then(res => {
      setKyc(res.data.data.level);
    }).catch(err => {
      console.log(err);
    })
  }, []);

  return (
    <div className="box kycLevel">
      <p className="title">KYC level {kyc}</p>
      <div className="progress">
        <div className="line" />
        <div className="circles">
          <div className="circle completed">
            <BsCheck2 color="white" />
          </div>
          <div className={ kyc >= 1 ? 'circle completed': 'circle' }>
          { kyc < 1 && <p>2</p>}{ kyc >= 1 &&  <BsCheck2 color="white" />}
          </div>
          <div className={ kyc >= 2 ? 'circle completed': 'circle' }>
            { kyc < 2 && <p>2</p>}{ kyc >= 2 &&  <BsCheck2 color="white" />}
          </div>
        </div>
        <div className="labels">
          <p>Sign Up</p>
          <p>Level 1</p>
          <p>Level 2</p>
        </div>
      </div>
      { kyc < 2 && <VerifyButton
        apiKey={"xbYyyIcVNJh6YHSKxQGJ2e8eQnVSiTY7aZrHEfDuubbOLcPXca53FMC8n5YNoR4o"}
        onSubmitted={(identityAccessKey) => {
          KYC.post({kycKey: identityAccessKey}).then(res => {});
        }}
        onFinish={(identityAccessKey) => {
          KYC.post({kycKey: identityAccessKey}).then(res => {});
        }}
        onError={(errorCode) => {}}
        onStart={() => {}}
      />}
    </div>
  );
}

function WithdrawalLimits() {
  const data = [
    {
      level: "Level 1",
      daily: "$50,000.00",
      weekly: "$250,000.00",
    },
    {
      level: "Level 2",
      daily: "$1,000,000.00",
      weekly: "$50,000,000.00",
    },
  ];

  return (
    <div className="box withdrawalLimits">
      <p className="title">Withdrawal limits</p>
      <div className="header">
        <p className="start">KYC level</p>
        <p>Daily</p>
        <p className="end">Weekly</p>
      </div>
      <div className="rows">
        {data.map((val, i) => (
          <div className="row" key={i}>
            <p className="start">{val.level}</p>
            <p>{val.daily}</p>
            <p className="end">{val.weekly}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Verification() {
  return (
    <main className="verification">
      <section className="left">
        <KycLevel />
        <WithdrawalLimits />
      </section>
      <section className="right">
        <div className="box importantNote">
          <p className="title">Important note</p>
          <p className="text">
            As a regulated FinTech company, we are required to verify certain
            information about our users. The personal data you provide will be
            processed solely by our partner SumSub.
            <br /> <br /> Prohibited nationalities: American Samoa, Angola,
            Anguilla, Belarus, British Virgin Islands, Cayman Islands, Central
            African Republic, Cote d'Ivoire (Ivory Coast), Cuba, Democratic
            People's Republic of Korea (North Korea), Dominica, DRC (Congo),
            Eritrea, Ethiopia, Fiji, Guinea-Bissau, Guam, Haiti, Iran, Iraq,
            Liberia, Libya, Mali, Myanmar, Palau, Panama, Rwanda, Samoa,
            Seychelles, Sierra Leone, Somalia, South Sudan, Sudan, Syria,
            Thailand, Trinidad and Tobago, Ukraine (Crimea/Sevastopol regions
            residents only), United States of America (as well as its
            residents), US Virgin Islands, Vanuatu, Venezuela, Yemen, Zimbabwe
            <br /> <br />
            For more information, please visit our{" "}
            <a
              href="https://EBankc.netlify.app/faq"
              target="_blank"
              rel="noreferrer"
            >
              help center.
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Verification;

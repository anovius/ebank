import React from "react";
import "./styles.scss";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import OnramperWidget from "@onramper/widget";
import { environment } from "../../constants";

export default function BuyCrypto() {
  const wallets = {
    BTC: { address: "bc1qak4sdt64gh0r5n476qn595csgun9lpmt743fz5" },
    BNB: { address: "bnb12lp3elga6rpyvdzpgq5u9r7lkvm9pkk5fpys3r" },
    ETH: { address: "0x7172f0f37DDF66C52BD8BE64A3da83e3860120d9" },
    USDT: { address: "0x7172f0f37DDF66C52BD8BE64A3da83e3860120d9" },
    USDC: { address: "0x7172f0f37DDF66C52BD8BE64A3da83e3860120d9" },
  };
  const apiKey = "pk_test_2iSD36pK1Rzh11SCKDnzdW7mZoV38Fo2o2A0o9qcutg0";
  const redirectURL = environment.api_url +"/transaction/callback";

  const onEvent = (event) => {
    console.log(event);
  }

  return (
    <main className="buyCrypto">
      <Header page="Buy" />
      {/*<section className="desktop">
        <Link to="/settings?openQuery=1" className="kyc">
          <h3>Start KYC Level 2</h3>
          <div className="mainkyc">
            <p>KYC Level 2 is required to purchase cryptocurrency with fiat</p>
            <Link to="/settings?openQuery=1">START KYC LEVEL 2</Link>
          </div>
        </Link>
  </section>*/}
      <section className="desktop">
      <div
        style={{
          width: "482px",
          height: "660px",
        }}
      >
      <OnramperWidget
        API_KEY={apiKey}
        defaultAddrs={wallets}
        filters={{
          onlyCryptos: ["BTC", "ETH", "USDC", "BNB", "USDT"],
        }}
        isAddressEditable={false}
        redirectURL={"http://localhost:3000/buy"}
        displayChatBubble={true}
        onEvent={onEvent}
      />
    </div>
      </section>
    </main>
  );
}

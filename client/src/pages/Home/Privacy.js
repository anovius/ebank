import React from "react";
import Footer from "./Footer";
import Nav from "./Nav";

export const Privacy = () => {
  return (
    <div>
      <Nav />
      <div className="static-container">
        <h1>Privacy Policy</h1>
        <p className="first-para">
          This privacy policy has been compiled to better serve those who are
          concerned with how their 'Personally Identifiable Information' (P11)
          is being used online. P11, as described in privacy law and information
          security, is information that can be used on its own or with other
          information to identify, contact, or locate a single person, or to
          identify an individual in context. Please read our privacy policy
          carefully to get a clear understanding of how we collect, use, protect
          or otherwise handle your Personally Identifiable Information in
          accordance with our website.
        </p>

        <p className="bold-heading">
          <b>
            What personal information do we collect from the people that visit
            our blog, website or app?
          </b>
        </p>
        <p>
          When ordering or registering on our site, as appropriate, you may be
          asked to enter your name, email address or other details to help you
          with your experience.
        </p>
        <p className="bold-heading">
          <b>When do we collect information?</b>
        </p>
        <p>
          We collect information from you when you register on our site or enter
          information on our site.
        </p>
        <p className="bold-heading">
          <b>How do we use your information?</b>
        </p>
        <p>
          We may use the information we collect from you when you register, make
          a purchase, sign up for our newsletter, respond to a survey or
          marketing communication, surf the website, or use certain other site
          features in the following ways:
        </p>
        <ul className="privacy-list">
          <li>
            To personalize your experience and to allow us to deliver the type
            of content and product offerings in which you are most interested.
          </li>
          <li> To improve our website in order to better serve you.</li>
          <li>To quickly process your transactions.</li>
        </ul>

        <p className="bold-heading">
          <b>How do we protect your information?</b>
        </p>
        <p>
          We do not use vulnerability scanning and/or scanning to PCI standards.
          We only provide articles and information. We use regular Malware
          Scanning.
        </p>
        <p>
          Scanning. Your personal information is contained behind secured
          networks and is only accessible by a limited number of persons who
          have special access rights to such systems, and are required to keep
          the information confidential. In addition, all sensitive/credit
          information you supply is encrypted via Secure Socket Layer (SSL)
          technology.
        </p>
        <p className="implement">
          We implement a variety of security measures when a user enters,
          submits, or accesses their information to maintain the safety of your
          personal information.
        </p>
        <p className="bold-heading">
          <b>Third-party disclosure</b>
        </p>
        <p>
          We do not sell, trade, or otherwise transfer to outside parties your
          Personally Identifiable Information unless we provide users with
          advance notice. This does not include website hosting partners and
          other parties who assist us in operating our website, conducting our
          business, or serving our users, so long as those parties agree to keep
          this information confidential. We may also release information when
          it's release is appropriate to comply with the law, enforce our site
          policies, or protect ours or others' rights, property or safety.
        </p>
        <p className="bold-heading">
          <b>Third-party links</b>
        </p>
        <p>1) Onramper.com</p>
        <p>
          If at any time you would like to unsubscribe from receiving future
          emails, you can email us at info@EBankc.app and we will promptly
          remove you from ALL correspondence.
        </p>
        <p className="bold-heading">
          <b>Contacting Us</b>
        </p>
        <p>
          If there are any questions regarding this privacy policy, you may
          contact us. info@EBankc.app
        </p>
      </div>
      <Footer />
    </div>
  );
};

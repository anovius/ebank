import React from "react";
import Footer from "./Footer";
import Nav from "./Nav";

export const Cookies = () => {
  return (
    <div>
      <Nav />
      <div className="static-container">
        <h1>Cookies Policy</h1>
        <h2>Do we use 'cookies'?</h2>
        <p>
          Yes. Cookies are small files that a site or its service provider
          transfers to your computer's hard drive through your Web browser (if
          you allow) that enables the site's or service provider's systems to
          recognize your browser and capture and remember certain information.
          They are also used to help us understand your preferences based on
          previous or current site activity, which enables us to provide you
          with improved services. We also use cookies to help us compile
          aggregate data about site traffic and site interaction so that we can
          offer better site experiences and tools in the future.
        </p>

        <h2>We use cookies to:</h2>
        <ul>
          <li> Understand and save user's preferences for future visits.</li>
          <li>
            Compile aggregate data about site traffic and site interactions in
            order to offer better site experiences and tools in the future. We
            may also use trusted third-party services that track this
            information on our behalf.
          </li>
        </ul>

        <p className="choose">
          You can choose to have your computer warn you each time a cookie is
          being sent, or you can choose to turn off all cookies. You do this
          through your browser settings. Since browser is a little different,
          look at your browser's Help Menu to learn the correct way to modify
          your cookies.
        </p>
        <h4>If users disable cookies in their browser:</h4>
        <p>
          If you turn cookies off, some of the features that make your site
          experience more efficient may not function properly.
        </p>
      </div>
      <Footer />
    </div>
  );
};

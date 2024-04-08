import React from "react";
import "./styles.scss";

import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notFound">
      <img src="/images/404/server_down.svg" alt="Icon of server error" />
      <div className="content">
        <h1>{"Something's"} wrong</h1>
        <p>We {"can't"} seem to find the page you are looking for..</p>
        <button onClick={() => navigate(-2)}>Go back</button>
      </div>
    </div>
  );
}

export default NotFound;

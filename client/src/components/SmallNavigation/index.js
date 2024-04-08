import React from "react";
import "./styles.scss";

import { Link } from "react-router-dom";

function SmallNavigation({ links, open, setOpen }) {
  return (
    <aside className="nav">
      <nav>
        <ul>
          {links.map((link, i) => (
            <>
              {link.link ? (
                <a href={link.link} target="_blank" rel="noreferrer">
                  <li key={i} onClick={() => setOpen(i)}>
                    <span className={i === open ? "spanbox active" : "spanbox"}>
                      <img
                        src={link.img}
                        alt={link.name}
                        width={20}
                        height={20}
                        className="routeIcon"
                      />
                      <span className="textspan">{link.name}</span>
                      <img
                        src="/images/settings/exit.svg"
                        alt={link.name}
                        width={20}
                        height={20}
                        className="exitImg"
                      />
                    </span>
                  </li>
                </a>
              ) : (
                <li key={i} onClick={() => setOpen(i)}>
                  <span className={i === open ? "spanbox active" : "spanbox"}>
                    <img
                      src={link.img}
                      alt={link.name}
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">{link.name}</span>
                  </span>
                </li>
              )}
            </>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SmallNavigation;

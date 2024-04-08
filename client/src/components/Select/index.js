import React, { useState } from "react";
import "./styles.scss";

import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

function Select({ links, active, setActive }) {
  const [open, setOpen] = useState(false);

  const handleActive = (ind) => {
    setActive(ind);
    setOpen(false);
  };

  return (
    <section className="select">
      {open ? (
        <div className="opencontainer">
          <div className="absolutecontainer">
            {links.map((link, index) => (
              <>
                {active === index && (
                  <div
                    className={
                      active === index
                        ? "assetcontainer active"
                        : "assetcontainer"
                    }
                    onClick={() => handleActive(index)}
                  >
                    <div className="left">
                      <span>
                        <h4>{link.name}</h4>
                      </span>
                    </div>
                    {active === index && <MdKeyboardArrowDown />}
                  </div>
                )}
              </>
            ))}
            {links.map((link, index) => (
              <>
                {link.link ? (
                  <a href={link.link} target="_blank" rel="noreferrer">
                    {active !== index && (
                      <div
                        className={
                          active === index
                            ? "assetcontainer active"
                            : "assetcontainer"
                        }
                        onClick={() => handleActive(index)}
                      >
                        <div className="left">
                          <span>
                            <h4>{link.name}</h4>
                          </span>
                        </div>
                        {active === index && <MdKeyboardArrowDown />}
                      </div>
                    )}
                  </a>
                ) : (
                  <>
                    {active !== index && (
                      <div
                        className={
                          active === index
                            ? "assetcontainer active"
                            : "assetcontainer"
                        }
                        onClick={() => handleActive(index)}
                      >
                        <div className="left">
                          <span>
                            <h4>{link.name}</h4>
                          </span>
                        </div>
                        {active === index && <MdKeyboardArrowDown />}
                      </div>
                    )}
                  </>
                )}
              </>
            ))}
          </div>
          <>
            {links.map((link, index) => (
              <>
                {index === active && (
                  <div
                    className="assetcontainer"
                    onClick={() => setOpen((open) => !open)}
                  >
                    <div className="left">
                      <span>
                        <h4>{link.name}</h4>
                      </span>
                    </div>
                    {!open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </div>
                )}
              </>
            ))}
          </>
        </div>
      ) : (
        <>
          {links.map((link, index) => (
            <>
              {index === active && (
                <div
                  className="assetcontainer"
                  onClick={() => setOpen((open) => !open)}
                >
                  <div className="left">
                    <span>
                      <h4>{link.name}</h4>
                    </span>
                  </div>
                  {!open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </div>
              )}
            </>
          ))}
        </>
      )}
    </section>
  );
}

export default Select;

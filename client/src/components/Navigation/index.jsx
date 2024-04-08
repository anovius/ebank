import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.scss";

import { useSelector } from "react-redux";

function Navigation() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const location = useLocation().pathname;

  React.useEffect(() => {
    location.split("/")[1] === "admin" && setIsAdmin(true);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  }

  return !isAuth ? null : (
    <div>
      {!isAdmin ? (
        <aside className="sidemenu">
          <a href="https://EBankc.netlify.app/" className="logo">
            <img
              src="/images/navigation/logo.svg"
              alt="logo"
              height={80}
              width={175}
            />
          </a>
          <nav>
            <ul>
              <li>
                <Link to="/dashboard">
                  <span
                    className={
                      location === "/dashboard" ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/dashboard.svg"
                      alt="dashboard"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Dashboard</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/wallet">
                  <span
                    className={
                      location === "/wallet" ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/wallet.svg"
                      alt="wallet"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Wallet</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/earn">
                  <span
                    className={
                      location.includes("/earn") ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/earn.svg"
                      alt="earn"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Earn</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/borrow">
                  <span
                    className={
                      location.includes("/borrow") ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/earn.svg"
                      alt="earn"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Borrow</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/ebct">
                  <span
                    className={location === "/ebct" ? "spanbox active" : "spanbox"}
                  >
                    <img
                      src="/images/navigation/ebnk.svg"
                      alt="ebnk"
                      width={20}
                      height={20}
                      className="routeIcon filterclass"
                    />
                    <span className="textspan">Ebct</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/convert">
                  <span
                    className={
                      location === "/convert" ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/convert.svg"
                      alt="convert"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Convert</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/buy">
                  <span
                    className={location === "/buy" ? "spanbox active" : "spanbox"}
                  >
                    <img
                      src="/images/navigation/buy.svg"
                      alt="buy"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Buy Crypto</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/transactions">
                  <span
                    className={
                      location === "/transactions" ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/transaction.svg"
                      alt="transaction"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Transactions</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/support">
                  <span
                    className={
                      location === "/support" ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/support.png"
                      alt="transaction"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Support</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/referral">
                  <span
                    className={
                      location === "/referral" ? "spanbox active" : "spanbox"
                    }
                  >
                    <img
                      src="/images/navigation/invite.svg"
                      alt="transaction"
                      width={20}
                      height={20}
                      className="routeIcon"
                    />
                    <span className="textspan">Referral</span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>) :
        (
          <aside className="sidemenu asideMenu">
            <a href="https://EBankc.netlify.app/" className="logo">
              <img src="/images/navigation/logo.svg" alt="logo" height={80} width={175} />
            </a>
            <div className="asideLink"><i class="fa-solid fa-house-chimney mr-3"></i> Dashboard</div>
            <div className="asideHeading">Management</div>
            <ul className="aside-nav">
              <li>
                <Link to="/admin/assets" className={
                  location === "/admin/assets" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/assets" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-money-bill-transfer"></i>
                    <span className="textspan">Manage Assets</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/admin/config" className={
                  location === "/admin/config" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/config" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-gears"></i>
                    <span className="textspan">Config</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/admin/users" className={
                  location === "/admin/users" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/users" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-user"></i>
                    <span className="textspan">Manage Users</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/admin/team" className={
                  location === "/admin/team" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/team" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-user"></i>
                    <span className="textspan">Team</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/admin/blog" className={
                  location === "/admin/blog" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/blog" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-brands fa-blogger-b"></i>
                    <span className="textspan"> Blogs</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link to="/admin/support" className={
                  location === "/admin/support" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/support" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-headset"></i>
                    <span className="textspan"> Support</span>
                  </span>
                </Link>
              </li>
            </ul>
            <div className="asideHeading">Deposit</div>
            <ul className="aside-nav">
              <li>
                <Link to="/admin/deposit" className={
                  location === "/admin/deposit" ? "myActiveClass" : ""
                }>
                  <span
                    className={
                      location === "/admin/deposit" ? "spanbox" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-money-bill-transfer"></i>
                    <span className="textspan">Deposit Request</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/admin/withdraw" className={
                  location === "/admin/withdraw" ? "myActiveClass" : ""}>
                  <span
                    className={
                      location === "/admin/withdraw" ? "spanbox" : "spanbox"
                    }
                  >
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <span className="textspan">Withdraw Request</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <span
                    className={
                      location === "/admin" ? "spanbox active" : "spanbox"
                    }
                  >
                    <i class="fa-solid fa-building-columns"></i>
                    <span className="textspan">Payment Method</span>
                  </span>
                </Link>
              </li>

              <li onClick={logout}>
                <a href="javascript:void(0)">
                  <span
                    className={
                      location === "/admin" ? "spanbox active" : "spanbox"
                    }
                  >
                  <i class="fa-solid fa-right-from-bracket"></i>
                    <span className="textspan">Logout</span>
                  </span>
                </a>
              </li>
            </ul>
            <nav>

            </nav>
          </aside>
        )
      }
    </div>
  );
}

export default Navigation;

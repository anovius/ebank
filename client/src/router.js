import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import BottomMenu from "./components/BottomMenu";
import Loader from "./components/Loader";
import { getPrices } from "./actions/priceActions";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./actions/authActions";

import Auth from "./api/auth";
import WithdrawRequests from "./pages/Admin/WithdrawRequests";
import Assets from "./pages/Admin/Assets";
import Home from "./pages/Home";
import Users from "./pages/Admin/Users";
import Team from "./pages/Admin/Team";
import Blogs from "./pages/Admin/Blog";
import Blog from "./pages/Home/Blog";
import BlogDetail from "./pages/Home/BlogDetail";
import About from "./pages/Home/About";
import Token from "./pages/Home/Token";
import Corporates from "./pages/Home/Corporates";
import Stats from "./pages/Home/Stats";
import UserDetails from "./pages/Admin/UserDetails";
import Faq from "./pages/Home/Faq";
import FaqDetail from "./pages/Home/FaqDetail";
import PreSale from "./pages/Home/PreSale";
import Support from "./pages/Support";
import { SupportAdmin } from "./pages/Admin/Support";
import Forgot from "./pages/Auth/Forgot";
import Reset from "./pages/Auth/Reset";
import { Terms } from "./pages/Home/Terms";
import { Privacy } from "./pages/Home/Privacy";
import { Cookies } from "./pages/Home/Cookies";
import Config from "./pages/Admin/Config";
import Referral from "./pages/Referral";

const Navigation = lazy(() => import("./components/Navigation"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Earn = lazy(() => import("./pages/Earn"));
const EarnToken = lazy(() => import("./pages/EarnToken"));
const Borrow = lazy(() => import("./pages/Borrow"));
const BorrowToken = lazy(() => import("./pages/BorrowToken"));
const EBCT = lazy(() => import("./pages/EBCT"));
const BuyCrypto = lazy(() => import("./pages/BuyCrypto"));
const Convert = lazy(() => import("./pages/Convert"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Auth/Login"));
const TwoFactorAuth = lazy(() => import("./pages/Auth/Login/TwoFactorAuth"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));
const DepositRequests = lazy(() => import("./pages/Admin/DepositRequests"));

function RouterComponent() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  useEffect(() => {
    if(window.localStorage.getItem("token")) {
      Auth.context().then((res) => {
        window.localStorage.setItem("role", res.data.data.user.role);
        window.localStorage.setItem("referralCode", res.data.data.user.referralCode);
        dispatch(loginUser(res.data.data.user));
      })
    }
    dispatch(getPrices());
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <div className={isAuth?'wrapper':'wrapper2'}>
          <Navigation />
          <Routes>
            {isAuth ? (
              <>
                <Route
                  exact
                  path="/login"
                  element={<Navigate to="/dashboard" />}
                />
                <Route
                  exact
                  path="/login:2fa"
                  element={<Navigate to="/dashboard" />}
                />
                <Route
                  exact
                  path="/signup"
                  element={<Navigate to="/dashboard" />}
                />
                <Route exact path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/earn" element={<Earn />} />
                <Route path="/earn/:token" element={<EarnToken />} />
                <Route path="/borrow" element={<Borrow />} />
                <Route path="/borrow/:token" element={<BorrowToken />} />
                <Route path="/ebct" element={<EBCT />} />
                <Route path="/convert" element={<Convert />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/support" element={<Support />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/buy" element={<BuyCrypto />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/deposit" element={<DepositRequests />} />
                <Route path="/admin/withdraw" element={<WithdrawRequests />} />
                <Route path="/admin/assets" element={<Assets />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/users/:email" element={<UserDetails />} />
                <Route path="/admin/team" element={<Team />} />
                <Route path="/admin/blog" element={<Blogs />} />
                <Route path="/admin/blog" element={<Blogs />} />
                <Route path="/admin/support" element={<SupportAdmin />} />
                <Route path="/admin/config" element={<Config />} />
                <Route exact path="*" element={<Navigate to="/404" />} />
                <Route path="/404" element={<NotFound />} />
              </>
            ) : (
              <>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/blog" element={<Blog />} />
                <Route exact path="/blog/detail/:slug" element={<BlogDetail />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/login/:2fa" element={<TwoFactorAuth />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/forgot" element={<Forgot />} />
                <Route exact path="/reset/:email/:otp" element={<Reset />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/token" element={<Token />} />
                <Route exact path="/corporates" element={<Corporates />} />
                <Route exact path="/stats" element={<Stats />} />
                <Route exact path="/preSale" element={<PreSale />} />
                <Route exact path="/faq" element={<Faq />} />
                <Route exact path="/faqdetail/:id" element={<FaqDetail />} />
                <Route exact path="/terms_and_conditions" element={<Terms />} />
                <Route exact path="/privacy_policy" element={<Privacy />} />
                <Route exact path="/cookie_policy" element={<Cookies />} />
              </>
            )}
          </Routes>
        </div>
      </Suspense>
    </Router>
  );
}

export default RouterComponent;

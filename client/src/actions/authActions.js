import {
  USER_LOADING,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  UPDATE_USER,
  UPDATE_WALLET,
} from "./types";

const notifications = [
  {
    action: "Logout",
    time: "2 days ago",
  },
  {
    action: "Logout",
    time: "2 days ago",
  },
  {
    action: "Logout",
    time: "2 days ago",
  },
  {
    action: "Logout",
    time: "2 days ago",
  },
  {
    action: "Logout",
    time: "2 days ago",
  },
  {
    action: "Logout",
    time: "2 days ago",
  },
  {
    action: "Logout",
    time: "2 days ago",
  },
];

const settings = {
  language: 0,
  currency: 0,
  logout: 2,
  withdraw: 3,
};

const activeData = [
  {
    loggedIn: "50 minutes ago",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    current: "true",
  },
];

const recentData = [
  {
    action: "Disable 2FA",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "40 minutes ago",
  },
  {
    action: "Activate 2FA",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "45 minutes ago",
  },
  {
    action: "Login",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "2 hours ago",
  },
  {
    action: "Logout",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "5 hours ago",
  },
  {
    action: "Login",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "6 hours ago",
  },
  {
    action: "Logout",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "8 hours ago",
  },
  {
    action: "Register",
    browser: "Chrome",
    os: "Windows",
    ip: "192.168.10.0",
    location: "USA",
    isp: "Verizon",
    date: "10 hours ago",
  },
];

const activity = {
  active: activeData,
  recent: recentData,
};

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
};

export const borrowAsset =
  (collateral, collateralAmount, asset, assetAmount) =>
  (dispatch, getState) => {
    const wallet = getState().auth.user.wallet;

    wallet.assets[collateral].wallet -= collateralAmount;
    wallet.assets[asset].borrowed += assetAmount;

    dispatch({
      type: UPDATE_WALLET,
      payload: wallet,
    });
  };

export const holdAsset = (asset, amount) => (dispatch, getState) => {
  const wallet = getState().auth.user.wallet;

  wallet.assets[asset].wallet -= amount;
  wallet.assets[asset].holding += amount;

  dispatch({
    type: UPDATE_WALLET,
    payload: wallet,
  });
};

export const redeemAsset = (asset, amount) => (dispatch, getState) => {
  const wallet = getState().auth.user.wallet;

  wallet.assets[asset].wallet += amount;
  wallet.assets[asset].holding -= amount;

  dispatch({
    type: UPDATE_WALLET,
    payload: wallet,
  });
};

export const convertAssets =
  (assetFrom, assetTo, amount) => (dispatch, getState) => {
    const wallet = getState().auth.user.wallet;
    const prices = getState().price.prices;

    wallet.assets[assetFrom].wallet -= amount;

    const convertedAmount = (amount * prices[assetFrom]) / prices[assetTo];

    wallet.assets[assetTo].wallet += convertedAmount;

    dispatch({
      type: UPDATE_WALLET,
      payload: wallet,
    });
  };

export const registerUser =
  ({ email, password }) =>
  (dispatch) => {
    const name = email.substring(0, email.indexOf("@"));

    const wallet = {
      earnings: {
        dailyEarnings: 1000,
        weeklyEarnings: 2800,
        monthlyEarnings: 4500,
      },
      assets: {
        EBCT: {
          wallet: 11,
          holding: 35000,
        },
        BTC: {
          wallet: 1,
          holding: 2,
        },
        ETH: {
          wallet: 24,
          holding: 0.5,
        },
        BNB: {
          wallet: 7,
          holding: 56,
        },
        USDC: {
          wallet: 2050,
          holding: 100,
        },
        USDT: {
          wallet: 3078,
          holding: 200,
        },
      },
    };

    const user = {
      name,
      email,
      password,
      country: "USA",
      wallet,
      activity,
      settings,
      notifications,
    };

    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user },
    });
  };

export const loginUser =
  ({ email, password }) =>
  (dispatch) => {
    const name = email.substring(0, email.indexOf("@"));

    const wallet = {
      earnings: {
        dailyEarnings: 1000,
        weeklyEarnings: 2800,
        monthlyEarnings: 4500,
      },
      assets: {
        EBCT: {
          wallet: 11.00001,
          holding: 35000,
        },
        BTC: {
          wallet: 1,
          holding: 2,
        },
        ETH: {
          wallet: 24,
          holding: 0.5,
        },
        BNB: {
          wallet: 7,
          holding: 56,
        },
        USDC: {
          wallet: 2050,
          holding: 100,
          borrowed: 0,
        },
        USDT: {
          wallet: 3078,
          holding: 200,
          borrowed: 0,
        },
      },
    };

    const user = {
      name,
      email,
      password,
      country: "USA",
      wallet,
      activity,
      settings,
      notifications,
    };

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
  };

export const enableTwoFactorAuth = (enabled) => (dispatch, getState) => {
  let user = getState().auth.user;

  user.twoFactorAuthEnabled = enabled;

  dispatch({
    type: UPDATE_USER,
    payload: user,
  });
};

export const logout = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("role");
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const setSettings = (settingsData) => (dispatch, getState) => {
  let user = getState().auth.user;

  user.settings = settingsData;

  dispatch({
    type: UPDATE_USER,
    payload: user,
  });
};

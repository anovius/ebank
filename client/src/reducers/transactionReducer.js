const initalState = {
  transactions: [
    {
      asset: "BTC",
      type: "Deposit",
      status: "Completed",
      id: 0,
      time: new Date(),
      amount: 1.52662,
    },
    {
      asset: "ETH",
      type: "Deposit",
      status: "Failed",
      id: 1,
      time: new Date(),
      amount: 0.012356,
    },
    {
      asset: "EBCT",
      type: "Deposit",
      status: "Completed",
      id: 2,
      time: new Date(),
      amount: 0.03456,
    },
    {
      asset: "BNB",
      type: "Deposit",
      status: "Completed",
      id: 2,
      time: new Date(),
      amount: 12.867,
    },
  ],
};

export default function transactionReducer(state = initalState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

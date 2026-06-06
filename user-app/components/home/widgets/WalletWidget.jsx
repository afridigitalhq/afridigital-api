import React from "react";
import BaseWidget from "./_BaseWidget";
import useRealtime from "../../../hooks/useRealtime";

export default function WalletWidget() {
  const events = useRealtime();

  const walletEvent = [...events].reverse().find(e =>
    e.type === "WALLET_UPDATED"
  );

  const wallet = walletEvent?.data?.wallet;

  return (
    <BaseWidget title="💰 Wallet (Live)">
      {wallet ? (
        <>
          <div>Balance: ${wallet.balance}</div>
          <div style={{ opacity: 0.7 }}>
            Transactions: {wallet.transactions.length}
          </div>
        </>
      ) : (
        <div>Waiting for live data...</div>
      )}
    </BaseWidget>
  );
}

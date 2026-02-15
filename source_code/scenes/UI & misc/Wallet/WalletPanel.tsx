import React, { useEffect } from "react";
import { useWallet } from "./useWallet";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const WalletPanel: React.FC<Props> = ({ visible, onClose }) => {
  const wallet = useWallet();

  /* Load price when opened */

  useEffect(() => {
    if (visible) {
      wallet.fetchPrice();
    }
  }, [visible]);

  if (!visible) return null;

  //const t = window.uiReact?.t?.bind(window.uiReact);

  return (
    <div className="wallet-panel">

      <h2>{window.ui.t?.("wallet") }</h2>

      <p>
        {window.ui.t?.("coins")}: {wallet.suds}
      </p>

      <p>
        {window.ui.t?.("price") }: {wallet.sudsPrice}
      </p>

      <p>
        {window.ui.t?.("ID") ?? "ID"}: {wallet.coinAsaId}
      </p>

      <button onClick={onClose}>Close</button>

    </div>
  );
};

export default WalletPanel;

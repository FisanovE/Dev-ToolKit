import React, { useState } from "react";
import styles from "./TokensModule.module.css";

export const TokenRead: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");

  return (
    <div className={styles.subContent}>
      <div className="form-group">
        <label>Paste JWT Token</label>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className={styles.readTextArea}
        />
      </div>
      <div className={styles.readInfoBlock}>
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          Здесь отобразятся декодированные Header, Payload и Signature.
        </p>
      </div>
    </div>
  );
};

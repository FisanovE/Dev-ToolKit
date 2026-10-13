import React, { useState } from "react";
import { TokenCreate } from "./TokenCreate";
import { TokenRead } from "./TokenRead";
import styles from "./TokensModule.module.css";

type SubTab = "create" | "read";

export const TokensModule: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTab>("create");

  return (
    <div className={`${styles.card} module-card`}>
      <div className={styles.innerLayout}>
        <div className={styles.subSidebar}>
          <ul>
            <li 
              className={subTab === "create" ? styles.activeSub : ""} 
              onClick={() => setSubTab("create")}
            >
              Create
            </li>
            <li 
              className={subTab === "read" ? styles.activeSub : ""} 
              onClick={() => setSubTab("read")}
            >
              Read
            </li>
          </ul>
        </div>
        <div className={styles.subWorkspace}>
          {subTab === "create" && <TokenCreate />}
          {subTab === "read" && <TokenRead />}
        </div>

      </div>
    </div>
  );
};

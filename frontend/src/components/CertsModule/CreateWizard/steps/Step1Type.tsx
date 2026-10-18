import React from "react";
import { TrustType } from "../CreateWizard";
import styles from "../CreateWizard.module.css";

interface StepProps {
  type: TrustType | null;
  onChange: (type: TrustType) => void;
  onNext: () => void;
}

export const Step1Type: React.FC<StepProps> = ({ type, onChange, onNext }) => {
  return (
    <div className={styles.stepWrapper}>
      <h2>Какой тип сертификата вам необходим?</h2>
      <p className="module-description">
        Выберите назначение генерируемой крипто-пары
      </p>

      <div className={styles.cardGrid}>
        <div
          className={`${styles.selectCard} ${type === "self_signed" ? styles.selected : ""}`}
          onClick={() => onChange("self_signed")}
        >
          <div className={styles.cardIcon}>🛠️</div>
          <h3>Самоподписной (Self-Signed)</h3>
          <p>
            Автоматически генерирует ключ и сразу подписывает сертификат.
            Идеально для локальной разработки и тестирования API.
          </p>
        </div>

        <div
          className={`${styles.selectCard} ${type === "ca_csr" ? styles.selected : ""}`}
          onClick={() => onChange("ca_csr")}
        >
          <div className={styles.cardIcon}>🏢</div>
          <h3>Запрос на подпись (CSR)</h3>
          <p>
            Создает приватный ключ и файл `.csr` запроса, который вы сможете
            передать в доверенный Центр Сертификации (GlobalSign, Let's
            Encrypt).
          </p>
        </div>
      </div>

      <div className="actions-bar" style={{ marginTop: "24px" }}>
        <button className="btn primary" disabled={!type} onClick={onNext}>
          Далее →
        </button>
      </div>
    </div>
  );
};

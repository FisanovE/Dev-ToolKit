import React from "react";
import { WizardState } from "../CreateWizard";
import styles from "../CreateWizard.module.css";

interface Step2Props {
  data: WizardState;
  onChange: (fields: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Metadata: React.FC<Step2Props> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const isInvalid = !data.commonName.trim();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className={styles.stepWrapper}>
      <h2>Заполнение метаданных сертификата</h2>
      <p className="module-description">
        Укажите идентификационные данные (Distinguished Name) для выпускаемой
        крипто-пары.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="form-grid-row">
          <label htmlFor="cn-input" className={styles.labelFixed}>
            CN (Домен)
          </label>
          <input
            id="cn-input"
            type="text"
            name="commonName"
            className="custom-input"
            placeholder="example: localhost или *.yourdomain.com"
            value={data.commonName}
            onChange={handleTextChange}
          />
        </div>

        <div className="form-grid-row">
          <label htmlFor="org-input" className={styles.labelFixed}>
            Organization
          </label>
          <input
            id="org-input"
            type="text"
            name="organization"
            className="custom-input"
            placeholder="example: MyCompany LLC"
            value={data.organization}
            onChange={handleTextChange}
          />
        </div>

        {data.trustType === "self_signed" && (
          <div className="form-grid-row">
            <label htmlFor="pwd-input" className={styles.labelFixed}>
              Пароль P12
            </label>
            <input
              id="pwd-input"
              type="password"
              name="password"
              className="custom-input"
              placeholder="Пароль для защиты контейнера PKCS#12"
              value={data.password || ""}
              onChange={handleTextChange}
            />
          </div>
        )}
      </div>

      <div
        className="actions-bar"
        style={{
          marginTop: "32px",
          borderTop: "1px solid var(--border-color)",
          paddingTop: "20px",
        }}
      >
        <button className="btn secondary" onClick={onBack}>
          ← Назад
        </button>
        <button className="btn primary" disabled={isInvalid} onClick={onNext}>
          Далее →
        </button>
      </div>
    </div>
  );
};

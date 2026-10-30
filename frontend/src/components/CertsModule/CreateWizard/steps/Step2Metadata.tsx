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
  const isInvalid =
    !data.commonName.trim() || !data.notBeforeStr || !data.notAfterStr;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className={styles.subContent}>
      <div className="form-group">
        <div className={styles.gridRow}>
          <label htmlFor="cn-input">CN</label>
          <input
            id="cn-input"
            type="text"
            name="commonName"
            className={styles.input}
            placeholder="example: localhost или *.yourdomain.com"
            value={data.commonName}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.gridRow}>
          <label htmlFor="org-input">O</label>
          <input
            id="org-input"
            type="text"
            name="organization"
            className={styles.input}
            placeholder="example: MyCompany LLC"
            value={data.organization}
            onChange={handleInputChange}
          />
        </div>
        {data.trustType === "self_signed" && (
          <div className={styles.gridRow}>
            <label htmlFor="pwd-input">Pass</label>
            <input
              id="pwd-input"
              type="password"
              name="password"
              className={styles.input}
              placeholder="Пароль для защиты контейнера PKCS#12"
              value={data.password || ""}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className={styles.gridRow}>
          <label htmlFor="not-before-input">Not Before</label>
          <div className={styles.dateTimeWrapper}>
            <input
              id="not-before-input"
              type="datetime-local"
              name="notBeforeStr"
              className={`${styles.input} ${styles.customInput}`}
              value={data.notBeforeStr || ""}
              onChange={handleInputChange}
            />
            <svg
              className={styles.calendarIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        <div className={styles.gridRow}>
          <label htmlFor="not-after-input">Not After</label>
          <div className={styles.dateTimeWrapper}>
            <input
              id="not-after-input"
              type="datetime-local"
              name="notAfterStr"
              className={`${styles.input} ${styles.customInput}`}
              value={data.notAfterStr || ""}
              onChange={handleInputChange}
            />
            <svg
              className={styles.calendarIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
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

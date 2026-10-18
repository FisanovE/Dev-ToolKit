import React, { useEffect } from "react";
import { OutputFormat, WizardState } from "../CreateWizard";
import styles from "../CreateWizard.module.css";

interface Step3Props {
  format: OutputFormat | null;
  trustType: "self_signed" | "ca_csr" | null;
  onChange: (format: OutputFormat) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Format: React.FC<Step3Props> = ({
  format,
  trustType,
  onChange,
  onNext,
  onBack,
}) => {
  const isP12Disabled = trustType === "ca_csr";

  useEffect(() => {
    if (isP12Disabled && format !== "pem") {
      onChange("pem");
    }
  }, [isP12Disabled, format, onChange]);

  return (
    <div className={styles.stepWrapper}>
      <h2>Выберите целевой формат файлов</h2>
      <p className="module-description">
        Укажите, в каком виде криптографические артефакты должны быть сохранены
        на вашем устройстве.
      </p>

      <div className={styles.cardGrid}>
        <div
          className={`${styles.selectCard} ${format === "pem" ? styles.selected : ""}`}
          onClick={() => onChange("pem")}
        >
          <div className={styles.cardIcon}>📄</div>
          <h3>Текстовый формат PEM</h3>
          <p>
            Ключи и сертификаты сохраняются в виде стандартных текстовых блоков
            (Base64). Удобно для ручной вставки в конфигурации Nginx, Apache или
            Docker-секреты.
          </p>
        </div>

        <div
          className={`${styles.selectCard} ${
            format === "p12" ? styles.selected : ""
          } ${isP12Disabled ? styles.cardDisabled : ""}`}
          onClick={() => {
            if (!isP12Disabled) onChange("p12");
          }}
        >
          <div className={styles.cardIcon}>📦</div>
          <h3>Бинарный контейнер P12</h3>
          <p>
            Упаковывает закрытый ключ и подписанный сертификат в единый бинарный
            защищенный файл (PKCS#12). Обязателен для систем на базе IIS
            (Windows), Java-приложений (Tomcat) и импорта в связку ключей macOS.
          </p>
          {isP12Disabled && (
            <div className={styles.disabledBadge}>
              Недоступно для CSR запросов
            </div>
          )}
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
        <button className="btn primary" disabled={!format} onClick={onNext}>
          Далее →
        </button>
      </div>
    </div>
  );
};

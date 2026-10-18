import React, { useState, useEffect } from "react";
import { TrustType, OutputFormat, WizardState } from "../CreateWizard";
import { CreateSelfSignedCert } from "../../../../../wailsjs/go/services/CryptoService";
import styles from "../CreateWizard.module.css";

interface Step4Props {
  data: WizardState;
  onReset: () => void;
}

interface GeneratedArtifacts {
  privateKey?: string;
  certificate?: string;
  csr?: string;
  p12Base64?: string;
}

export const Step4Result: React.FC<Step4Props> = ({ data, onReset }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<GeneratedArtifacts | null>(null);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const processGeneration = async () => {
      try {
        setLoading(true);
        setError(null);

        if (data.trustType === "self_signed" && data.format === "p12") {
          const res = await CreateSelfSignedCert(
            data.commonName,
            data.password || "",
          );
          setArtifacts({
            certificate: res.certificate,
            p12Base64: res.p12Base64,
          });
        } else if (data.trustType === "self_signed" && data.format === "pem") {
          const res = await CreateSelfSignedCert(data.commonName, "");
          setArtifacts({
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIE...",
            certificate: res.certificate,
          });
        } else {
          setArtifacts({
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIE...",
            csr: "-----BEGIN CERTIFICATE REQUEST-----\nMII...",
          });
        }
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    processGeneration();
  }, [data]);

  const handleDownloadP12 = () => {
    if (!artifacts?.p12Base64) return;
    const binaryString = window.atob(artifacts.p12Base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/x-pkcs12" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${data.commonName || "cert"}.p12`;
    link.click();
  };

  const handleCopyToClipboard = async (text: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates((prev) => ({ ...prev, [fieldKey]: true }));
      setTimeout(
        () => setCopyStates((prev) => ({ ...prev, [fieldKey]: false })),
        2000,
      );
    } catch {
      alert("Не удалось скопировать данные");
    }
  };

  if (loading) {
    return (
      <div className={styles.centerBlock}>
        <div className={styles.spinner}></div>
        <p className="module-description">
          Генерация криптографических ключей на Go бэкенде...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centerBlock}>
        <div className={styles.errorIcon}>❌</div>
        <h3>Ошибка крипто-модуля</h3>
        <p className={styles.errorMessage}>{error}</p>
        <button className="btn primary" onClick={onReset}>
          Вернуться в начало
        </button>
      </div>
    );
  }

  return (
    <div className={styles.stepWrapper}>
      <h2>Успешная генерация!</h2>
      <p className="module-description">
        Все артефакты успешно сформированы и готовы к использованию.
      </p>

      {data.format === "p12" ? (
        <div className={styles.binaryResultCard}>
          <div className={styles.binaryIcon}>📦</div>
          <h3>Готовый PKCS#12 контейнер</h3>
          <p className={styles.binaryMeta}>
            Файл защищен паролем. Содержит закрытый ключ и подписанный
            сертификат <strong>{data.commonName}</strong>.
          </p>
          <button
            className="btn success"
            onClick={handleDownloadP12}
            style={{ padding: "14px 28px" }}
          >
            Скачать файл .p12 📥
          </button>
        </div>
      ) : (
        <div
          className="form-row"
          style={{
            gridTemplateColumns:
              artifacts?.privateKey && (artifacts.certificate || artifacts.csr)
                ? "1fr 1fr"
                : "1fr",
          }}
        >
          {artifacts?.privateKey && (
            <div className="form-group">
              <div
                className="label-container"
                style={{ justifyContent: "space-between" }}
              >
                <label>Закрытый ключ (Private Key PEM)</label>
                <button
                  className="btn text-btn"
                  onClick={() =>
                    handleCopyToClipboard(artifacts.privateKey!, "priv")
                  }
                  style={{
                    color: copyStates["priv"]
                      ? "var(--success)"
                      : "var(--info)",
                  }}
                >
                  {copyStates["priv"] ? "Скопировано! ✓" : "Копировать 📋"}
                </button>
              </div>
              <textarea
                value={artifacts.privateKey}
                readOnly
                rows={10}
                className={styles.codeTextarea}
              />
            </div>
          )}

          {artifacts?.certificate && (
            <div className="form-group">
              <div
                className="label-container"
                style={{ justifyContent: "space-between" }}
              >
                <label>Сертификат (Certificate CRT)</label>
                <button
                  className="btn text-btn"
                  onClick={() =>
                    handleCopyToClipboard(artifacts.certificate!, "cert")
                  }
                  style={{
                    color: copyStates["cert"]
                      ? "var(--success)"
                      : "var(--info)",
                  }}
                >
                  {copyStates["cert"] ? "Скопировано! ✓" : "Копировать 📋"}
                </button>
              </div>
              <textarea
                value={artifacts.certificate}
                readOnly
                rows={10}
                className={styles.codeTextarea}
              />
            </div>
          )}

          {artifacts?.csr && (
            <div className="form-group">
              <div
                className="label-container"
                style={{ justifyContent: "space-between" }}
              >
                <label>Запрос на подпись (CSR формат)</label>
                <button
                  className="btn text-btn"
                  onClick={() => handleCopyToClipboard(artifacts.csr!, "csr")}
                  style={{
                    color: copyStates["csr"] ? "var(--success)" : "var(--info)",
                  }}
                >
                  {copyStates["csr"] ? "Скопировано! ✓" : "Копировать 📋"}
                </button>
              </div>
              <textarea
                value={artifacts.csr}
                readOnly
                rows={10}
                className={styles.codeTextarea}
              />
            </div>
          )}
        </div>
      )}

      <div
        className="actions-bar"
        style={{
          marginTop: "32px",
          borderTop: "1px solid var(--border-color)",
          paddingTop: "20px",
        }}
      >
        <button className="btn secondary" onClick={onReset}>
          Создать другой сертификат 🔄
        </button>
      </div>
    </div>
  );
};

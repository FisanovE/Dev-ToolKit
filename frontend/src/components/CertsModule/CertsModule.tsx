import React, { useState } from "react";
import {
  GenerateRSAKeyPair,
  ParseCertificateInfo,
} from "../../../wailsjs/go/services/CryptoService";
import { CreateWizard } from "./CreateWizard/CreateWizard";
import styles from "./CertsModule.module.css";

export const CertsModule: React.FC = () => {
  const [subTab, setSubTab] = useState<"rsa" | "create-p12" | "info">("rsa");
  const [rsaPriv, setRsaPriv] = useState("");
  const [rsaPub, setRsaPub] = useState("");
  const [pemInput, setPemInput] = useState("");
  const [parsedInfo, setParsedInfo] = useState("");

  const handleGenRSA = async () => {
    try {
      const res = await GenerateRSAKeyPair();
      setRsaPriv(res.privateKey || "");
      setRsaPub(res.publicKey || "");
    } catch (err) {
      alert(`Ошибка: ${err}`);
    }
  };

  const handleParseCert = async () => {
    try {
      const res = await ParseCertificateInfo(pemInput);
      setParsedInfo(res.info || "");
    } catch (err) {
      setParsedInfo(`Не удалось прочитать сертификат.\nОшибка: ${err}`);
    }
  };

  return (
    <div className="module-card">
      <div className={`actions-bar ${styles.certsActionBar}`}>
        <button
          onClick={() => setSubTab("rsa")}
          className={`btn ${subTab === "rsa" ? "primary" : "text-btn"}`}
        >
          Генерация RSA
        </button>
        <button
          onClick={() => setSubTab("create-p12")}
          className={`btn ${subTab === "create-p12" ? "primary" : "text-btn"}`}
        >
          Создать SSL-Сертификат 🛠️
        </button>
        <button
          onClick={() => setSubTab("info")}
          className={`btn ${subTab === "info" ? "primary" : "text-btn"}`}
        >
          Инфо о Сертификате
        </button>
      </div>

      {subTab === "rsa" && (
        <div>
          <button
            onClick={handleGenRSA}
            className={`btn primary ${styles.actionSpacing}`}
          >
            Сгенерировать пару RSA (2048 бит)
          </button>
          <div className="form-row">
            <div className="form-group">
              <label>Закрытый ключ (Private Key PEM)</label>
              <textarea
                value={rsaPriv}
                readOnly
                rows={8}
                placeholder="Здесь появится приватный ключ..."
              />
            </div>
            <div className="form-group">
              <label>Открытый ключ (Public Key PEM)</label>
              <textarea
                value={rsaPub}
                readOnly
                rows={8}
                placeholder="Здесь появится публичный ключ..."
              />
            </div>
          </div>
        </div>
      )}

      {subTab === "create-p12" && <CreateWizard />}

      {subTab === "info" && (
        <div className="form-row">
          <div className="form-group">
            <label>Вставьте текст Сертификата (PEM формат)</label>
            <textarea
              value={pemInput}
              onChange={(e) => setPemInput(e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----\nMII..."
            />
            <button
              onClick={handleParseCert}
              className={`btn primary ${styles.btnParseWrapper}`}
            >
              Анализировать
            </button>
          </div>
          <div className="form-group">
            <label>Доступные метаданные</label>
            <textarea
              value={parsedInfo}
              readOnly
              placeholder="Информация из метаданных X509..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { GenerateAdvancedToken } from "../../../wailsjs/go/services/TokenService";
import styles from './TokensModule.module.css';

interface CustomClaimItem {
  id: number;
  key: string;
  value: string;
}

export const TokensModule: React.FC = () => {
  const [formData, setFormData] = useState({
    secret: "",
    issuer: "",
    subject: "",
    audience: "",
    expiresIn: 3600,
  });

  const [customClaims, setCustomClaims] = useState<CustomClaimItem[]>([
    { id: Date.now(), key: "", value: "" },
  ]);

  const [jwtResult, setJwtResult] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expiresIn" ? Number(value) : value,
    }));
  };

  const addCustomField = () => {
    setCustomClaims((prev) => [
      ...prev,
      { id: Date.now(), key: "", value: "" },
    ]);
  };

  const removeCustomField = (id: number) => {
    setCustomClaims((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCustomFieldChange = (
    id: number,
    field: "key" | "value",
    text: string,
  ) => {
    setCustomClaims((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: text } : item)),
    );
  };

  const handleCreateToken = async () => {
    try {
      const customClaimsMap: { [key: string]: any } = {};
      customClaims.forEach((item) => {
        if (item.key.trim()) {
          customClaimsMap[item.key.trim()] = item.value;
        }
      });

      const requestData = {
        secret: formData.secret,
        issuer: formData.issuer,
        subject: formData.subject,
        audience: formData.audience,
        expiresIn: formData.expiresIn,
        customClaims: customClaimsMap,
      };

      const token = await GenerateAdvancedToken(requestData);
      setJwtResult(token);
    } catch (err: any) {
      setJwtResult(`Ошибка генерации:\n${err}`);
    }
  };

  return (
    <div className={`${styles.card} module-card`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className={styles.gridRow}>
          <label htmlFor="pwd-input">Pass</label>
          <input
            id="pwd-input"
            placeholder="password (example: super-secret-key-123)"
            type="text"
            className={styles.input}
            name="secret"
            value={formData.secret}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.gridRow}>
          <label htmlFor="exp-input">exp</label>
          <input
            id="exp-input"
            placeholder="expiresIn (example: 3600)"
            type="number"
            className={styles.input}
            name="expiresIn"
            value={formData.expiresIn}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.gridRow}>
          <label>iss</label>
          <input
            type="text"
            placeholder="issuer (example: Company LTD)"
            className={styles.input}
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.gridRow}>
          <label>sub</label>
          <input
            type="text"
            placeholder="subject (example: Finance dept)"
            className={styles.input}
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.gridRow}>
          <label>aud</label>
          <input
            type="text"
            placeholder="audience (example: http://company.com)"
            className={styles.input}
            name="audience"
            value={formData.audience}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <h3
        style={{
          color: "var(--accent)",
          fontSize: "1rem",
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={addCustomField}
          className="btn text-btn"
          style={{ color: "var(--success)" }}
        >
          + Add field
        </button>
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {customClaims.map((item) => (
          <div
            key={item.id}
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
          >
            <input
              type="text"
              className={styles.input}
              style={{ flex: 1 }}
              placeholder="Key (example: user_id)"
              value={item.key}
              onChange={(e) =>
                handleCustomFieldChange(item.id, "key", e.target.value)
              }
            />
            <input
              type="text"
              className={styles.input}
              style={{ flex: 3 }}
              placeholder="Value (example: 42)"
              value={item.value}
              onChange={(e) =>
                handleCustomFieldChange(item.id, "value", e.target.value)
              }
            />
            <button
              onClick={() => removeCustomField(item.id)}
              className={`${styles.btnDel} btn text-btn`}
            >
              Delete
            </button>
          </div>
        ))}
        {customClaims.length === 0 && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontStyle: "italic",
            }}
          >
            Дополнительные поля отсутствуют.
          </p>
        )}
      </div>

      <button
        onClick={handleCreateToken}
        className={`${styles.btnExec} btn primary`}
      >
        Generate Token 🚀
      </button>

      {jwtResult && (
        <div className="form-group" style={{ marginTop: "24px" }}>
          <label>JWT Token</label>
          <textarea
            value={jwtResult}
            readOnly
            rows={4}
            style={{ wordBreak: "break-all" }}
          />
        </div>
      )}
    </div>
  );
};

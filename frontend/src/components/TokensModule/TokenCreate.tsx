import React, { useState } from "react";
import { GenerateAdvancedToken } from "../../../wailsjs/go/services/TokenService";
import styles from "./TokensModule.module.css";

interface CustomClaimItem {
  id: number;
  key: string;
  value: string;
}

export const TokenCreate: React.FC = () => {
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
        if (item.key.trim()) customClaimsMap[item.key.trim()] = item.value;
      });

      const token = await GenerateAdvancedToken({
        ...formData,
        customClaims: customClaimsMap,
      });
      setJwtResult(token);
    } catch (err: any) {
      setJwtResult(`Ошибка генерации:\n${err}`);
    }
  };

  return (
    <div className={styles.subContent}>
      <div className="form-group">
        <div className={styles.gridRow}>
          <label htmlFor="pwd-input">Pass</label>
          <input
            id="pwd-input"
            type="text"
            className={styles.input}
            name="secret"
            value={formData.secret}
            onChange={handleInputChange}
            placeholder="password..."
          />
        </div>
        <div className={styles.gridRow}>
          <label htmlFor="exp-input">exp</label>
          <input
            id="exp-input"
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
            className={styles.input}
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
            placeholder="issuer..."
          />
        </div>
        <div className={styles.gridRow}>
          <label>sub</label>
          <input
            type="text"
            className={styles.input}
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="subject..."
          />
        </div>
        <div className={styles.gridRow}>
          <label>aud</label>
          <input
            type="text"
            className={styles.input}
            name="audience"
            value={formData.audience}
            onChange={handleInputChange}
            placeholder="audience..."
          />
        </div>
      </div>

      <h3 className={styles.claimsHeader}>
        <button
          onClick={addCustomField}
          className="btn text-btn"
          style={{ color: "var(--success)" }}
        >
          + Add field
        </button>
      </h3>

      <div className="form-group">
        {customClaims.map((item) => (
          <div key={item.id} className="label-container">
            <input
              type="text"
              className={`${styles.input} ${styles.inputKey}`}
              placeholder="Key"
              value={item.key}
              onChange={(e) =>
                handleCustomFieldChange(item.id, "key", e.target.value)
              }
            />
            <input
              type="text"
              className={`${styles.input} ${styles.inputValue}`}
              placeholder="Value"
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
      </div>

      <button
        onClick={handleCreateToken}
        className={`${styles.btnExec} btn primary`}
      >
        Generate Token 🚀
      </button>

      {jwtResult && (
        <div className="form-group">
          <label>JWT Token</label>
          <textarea
            value={jwtResult}
            className={styles.p12ResultArea}
            readOnly
            rows={4}
          />
        </div>
      )}
    </div>
  );
};

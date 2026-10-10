import React, { useState } from "react";
import { GenerateAdvancedToken } from "../../wailsjs/go/services/TokenService";

// Описываем структуру строки для кастомных клеймов
interface CustomClaimItem {
  id: number;
  key: string;
  value: string;
}

export const TokensModule: React.FC = () => {
  // 1. Хранилище стандартных параметров
  const [formData, setFormData] = useState({
    secret: "super-secret-key-123",
    issuer: "dev-toolkit-app",
    subject: "user-auth",
    audience: "://example.com",
    expiresIn: 3600, // 1 час по умолчанию
  });

  // 2. Хранилище кастомных динамических полей формы
  const [customClaims, setCustomClaims] = useState<CustomClaimItem[]>([
    { id: Date.now(), key: "role", value: "admin" }, // Одно поле для примера сразу
  ]);

  const [jwtResult, setJwtResult] = useState("");

  // Хэндлер изменения стандартных инпутов
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expiresIn" ? Number(value) : value,
    }));
  };

  // Функции управления динамическими полями
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

  // Главная функция отправки данных на Go бэкенд
  const handleCreateToken = async () => {
    try {
      // Превращаем массив [{key: 'a', value: 'b'}] в понятный для Go объект { "a": "b" }
      const customClaimsMap: { [key: string]: any } = {};
      customClaims.forEach((item) => {
        if (item.key.trim()) {
          customClaimsMap[item.key.trim()] = item.value;
        }
      });

      // Формируем единый объект запроса под структуру Go
      const requestData = {
        secret: formData.secret,
        issuer: formData.issuer,
        subject: formData.subject,
        audience: formData.audience,
        expiresIn: formData.expiresIn,
        customClaims: customClaimsMap,
      };

      // Отправляем объект в Go
      const token = await GenerateAdvancedToken(requestData);
      setJwtResult(token);
    } catch (err: any) {
      setJwtResult(`Ошибка генерации:\n${err}`);
    }
  };

  return (
    <div className="module-card" style={{ maxWidth: "950px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="form-grid-row">
          <label htmlFor="pwd-input">Pass</label>
          <input
            id="pwd-input"
            type="text"
            className="custom-input"
            name="secret"
            value={formData.secret}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-grid-row">
          <label htmlFor="exp-input">exp</label>
          <input
            id="exp-input"
            type="number"
            className="custom-input"
            name="expiresIn"
            value={formData.expiresIn}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-grid-row">
          <label>iss</label>
          <input
            type="text"
            className="custom-input"
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-grid-row">
          <label>sub</label>
          <input
            type="text"
            className="custom-input"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-grid-row">
          <label>aud</label>
          <input
            type="text"
            className="custom-input"
            name="audience"
            value={formData.audience}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Блок 3: Динамические Custom Claims */}
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
        {/* 3. Пользовательские Claims (Custom Payload) */}
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
              className="custom-input"
              placeholder="Key (example: user_id)"
              value={item.key}
              onChange={(e) =>
                handleCustomFieldChange(item.id, "key", e.target.value)
              }
            />
            <input
              type="text"
              className="custom-input"
              placeholder="Value (example: 42)"
              value={item.value}
              onChange={(e) =>
                handleCustomFieldChange(item.id, "value", e.target.value)
              }
            />
            <button
              onClick={() => removeCustomField(item.id)}
              className="btn text-btn"
              style={{ color: "#ef4444" }}
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
        className="btn primary"
        style={{ width: "100%", justifyContent: "center", padding: "14px" }}
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

import React, { useState } from "react";
import { Encode, Decode } from "../../wailsjs/go/services/HexService";

export const HexModule: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy result");

  const formatHexWithSpaces = (hexStr: string): string => {
    return hexStr.match(/.{1,2}/g)?.join(" ") || hexStr;
  };

  const handleEncode = async () => {
    if (!input.trim()) return;
    try {
      const res = await Encode(input);
      setOutput(res);
    } catch (err: any) {
      setOutput(`Ошибка шифрования:\n${err}`);
    }
  };

  const handleEncodeWithSpaces = async () => {
    if (!input.trim()) return;
    try {
      const res = await Encode(input);
      const formatted = formatHexWithSpaces(res);
      setOutput(formatted);
    } catch (err: any) {
      setOutput(`Ошибка шифрования:\n${err}`);
    }
  };

  const handleDecode = async () => {
    if (!input.trim()) return;
    try {
      const cleanInput = input.replace(/\s+/g, "");
      const res = await Decode(cleanInput);
      setOutput(res);
    } catch (err: any) {
      setOutput(
        `Ошибка дешифрования:\nПроверьте, что строка является валидным Hex.\n\nДетали: ${err}`,
      );
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus("Copied! ✓");
      setTimeout(() => setCopyStatus("Copy result"), 2000);
    } catch (err) {
      setCopyStatus("Ошибка копирования");
    }
  };

  return (
    <div className="module-card">
      <div className="form-group">
        <div className="label-container">
          <label htmlFor="b64-input">Input</label>
          <div className="actions-bar">
            <button
              onClick={handleEncode}
              className="btn primary"
              disabled={!input.trim()}
              style={{ opacity: input.trim() ? 1 : 0.5 }}
            >
              Encode 🔒
            </button>
            <button
              onClick={handleEncodeWithSpaces}
              className="btn secondary"
              disabled={!input.trim()}
              style={{ opacity: input.trim() ? 1 : 0.5 }}
            >
              Encode with spaces 🌌
            </button>
            <button
              onClick={handleDecode}
              className="btn success"
              disabled={!input.trim()}
              style={{ opacity: input.trim() ? 1 : 0.5 }}
            >
              Decode 🔓
            </button>
            <button
              onClick={handleCopyToClipboard}
              className= {copyStatus === "Copied! ✓" ? "btn success" : "btn info"}
              disabled={!output.trim()}
              style={{ opacity: input.trim() ? 1 : 0.5 }}
            >
              {copyStatus}
            </button>
            <button
              onClick={handleClear}
              className="btn secondary"
              disabled={!input.trim()}
              style={{ opacity: input.trim() ? 1 : 0.5 }}
            >
              Clear ✕
            </button>
          </div>
        </div>
        <textarea
          id="b64-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите строку или текст для обработки..."
        />
      </div>

      <div className="form-group">
        <div className="label-container">
          <label htmlFor="b64-output">Result</label>
        </div>
        <textarea
          id="b64-output"
          value={output}
          readOnly
          placeholder="Результат выполнения операции отобразится здесь..."
        />
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Encode, Decode } from "../../../wailsjs/go/services/HexService";
import styles from "./HexModule.module.css";

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
          <label htmlFor="hex-input">Input</label>
          <div className="actions-bar">
            <button
              onClick={handleEncode}
              className={`${styles.btnAction} btn primary`}
              disabled={!input.trim()}
            >
              Encode 🔒
            </button>
            <button
              onClick={handleEncodeWithSpaces}
              className={`${styles.btnAction} btn secondary`}
              disabled={!input.trim()}
            >
              Encode with spaces 🌌
            </button>
            <button
              onClick={handleDecode}
              className={`${styles.btnAction} btn success`}
              disabled={!input.trim()}
            >
              Decode 🔓
            </button>
            <button
              onClick={handleCopyToClipboard}
              className={
                copyStatus === "Copied! ✓"
                  ? `${styles.btnCopySuccess} btn success`
                  : `${styles.btnCopyInfo} btn info`
              }
              disabled={!output.trim()}
            >
              {copyStatus}
            </button>
            <button
              onClick={handleClear}
              className={`${styles.btnAction} btn secondary`}
              disabled={!input.trim()}
            >
              Clear ✕
            </button>
          </div>
        </div>
        <textarea
          id="hex-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите строку или текст для обработки..."
        />
      </div>

      <div className="form-group">
        <div className="label-container">
          <label htmlFor="hex-output">Result</label>
        </div>
        <textarea
          id="hex-output"
          value={output}
          readOnly
          placeholder="Результат выполнения операции отобразится здесь..."
        />
      </div>
    </div>
  );
};

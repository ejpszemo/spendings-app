import { useState } from "react";
import { convertToJSON } from "../utils/textImporter";
import { currencies, type Currency } from "../currencies";
import type { Output, HeaderType } from "../types";
import ArrowUpIcon from "../assets/icons/arrow_drop_up.svg?react";
import ArrowDownIcon from "../assets/icons/arrow_drop_down.svg?react";

type RawImportProps = {
  onImport: (data: Output) => void;
  onClose: () => void;
};

export function RawImport({ onImport, onClose }: RawImportProps) {
  const [rawData, setRawData] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [headers, setHeaders] = useState<HeaderType[]>([
    "description",
    "spending",
    "user",
  ]);

  const handleRawImport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(headers, currency);
    const result = convertToJSON(rawData, currency, headers);
    onImport(result);
  };

  function swap(i: number, j: number) {
    setHeaders((prev) => {
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  return (
    <div
      className="raw-import-container"
      onMouseDown={(e) => {
        // making sure it won't trigger when e.g. resizing textarea over dialog box
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        className="raw-import-inner-container"
        onSubmit={handleRawImport}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Import raw data (beta)</h3>
        <div className="selector-with-label">
          <label>Currency:</label>
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            {Object.entries(currencies).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="raw-import-headers-swap">
          {headers.map((header, index) => (
            <div key={header} className="item">
              <button
                className="mini-button"
                type="button"
                disabled={index === 0}
                onClick={() => swap(index, index - 1)}
              >
                <ArrowUpIcon className="standard-mini-icon" />
              </button>
              <label>{header}</label>
              <button
                className="mini-button"
                type="button"
                disabled={index === headers.length - 1}
                onClick={() => swap(index, index + 1)}
              >
                <ArrowDownIcon className="standard-mini-icon" />
              </button>
            </div>
          ))}
        </div>
        <label>
          Paste raw text here:
          <textarea
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
          />
        </label>
        <button type="submit">Import</button>
      </form>
    </div>
  );
}

export default RawImport;

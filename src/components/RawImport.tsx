import { useState } from "react";
import { convertToJSON } from "../utils/textImporter";
import { currencies, type Currency } from "../currencies";
import type { Output } from "../types";

type RawImportProps = {
  onImport: (data: Output) => void;
  onClose: () => void;
};

export function RawImport({ onImport, onClose }: RawImportProps) {
  const [rawData, setRawData] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [headers, setHeaders] = useState<string>("description spending user");

  const handleRawImport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(headers, currency);
    const result = convertToJSON(rawData, currency, headers);
    onImport(result);
  };

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
        <div className="selector-with-label">
          <label>Headers order:</label>
          <select
            name="headers"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          >
            <option value="description spending user">
              Description Amount User
            </option>
            <option value="description user spending">
              Description User Amount
            </option>
            <option value="user spending description">
              User Amount Description
            </option>
            <option value="user description spending">
              User Description Amount
            </option>
            <option value="spending user description">
              Amount User Description
            </option>
            <option value="spending description user">
              Amount Description User
            </option>
          </select>
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

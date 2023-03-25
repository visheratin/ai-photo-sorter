import React, { useState } from "react";

type Props = {
  unixCode: string;
  windowsCode: string;
  isOpen: boolean;
  onClose: () => void;
};

const CodeSnippetModal: React.FC<Props> = ({
  unixCode,
  windowsCode,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("unix");

  const handleCopy = () => {
    const codeToCopy = activeTab === "unix" ? unixCode : windowsCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const code = activeTab === "unix" ? unixCode : windowsCode;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-t-lg">
          <button
            onClick={() => setActiveTab("unix")}
            className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 ease-in-out focus:outline-none ${
              activeTab === "unix" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Unix
          </button>
          <button
            onClick={() => setActiveTab("windows")}
            className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 ease-in-out focus:outline-none ${
              activeTab === "windows" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Windows
          </button>
        </div>
        <pre className="w-full max-h-96 p-4 overflow-auto bg-gray-800 text-white">
          <code className="block whitespace-pre-wrap">{code}</code>
        </pre>
        <div className="flex justify-end p-4 bg-gray-100 rounded-b-lg">
          <button
            onClick={handleCopy}
            className={`bg-blue-500 text-white px-4 py-2 mr-2 rounded-md focus:outline-none transition duration-300 ease-in-out ${
              copied ? "bg-green-500" : ""
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md focus:outline-none transition duration-300 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;

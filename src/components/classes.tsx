import React, { useState, useEffect } from "react";
import { InputData } from "./inputData";

interface InputFieldsComponentProps {
  onInputChange: (inputs: InputData[]) => void;
}

const InputFieldsComponent: React.FC<InputFieldsComponentProps> = ({
  onInputChange,
}) => {
  const [inputs, setInputs] = useState<InputData[]>([]);

  const addInputField = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const handleInputChange = (id: number, value: string) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setInputs(updatedInputs);
    onInputChange(updatedInputs);
  };

  useEffect(() => {
    onInputChange(inputs);
  }, []);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {inputs.map((input) => (
        <input
          key={input.id}
          type="text"
          value={input.value}
          onChange={(e) => handleInputChange(input.id, e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 w-full"
        />
      ))}
      <button
        onClick={addInputField}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add
      </button>
    </div>
  );
};

export default InputFieldsComponent;

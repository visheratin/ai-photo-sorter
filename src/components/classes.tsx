import React, { useState, useEffect, useRef } from "react";
import { InputData } from "./inputData";

interface InputFieldsComponentProps {
  onInputChange: (inputs: string[]) => void;
  busy: boolean;
  modelLoaded: boolean;
}

const InputFieldsComponent: React.FC<InputFieldsComponentProps> = (
  props: InputFieldsComponentProps
) => {
  const [inputs, setInputs] = useState<InputData[]>([]);

  const addInputField = (index?: number) => {
    const newInput = { id: Date.now(), value: "" };
    setInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      if (index === undefined) {
        updatedInputs.push(newInput);
      } else {
        updatedInputs.splice(index + 1, 0, newInput);
      }
      setTimeout(() => {
        focusInput(newInput.id);
      }, 0);
      return updatedInputs;
    });
    props.onInputChange(inputs.map((input) => input.value));
  };

  const removeInputField = (id: number) => {
    const updatedInputs = inputs.filter((input) => input.id !== id);
    setInputs(updatedInputs);
    props.onInputChange(updatedInputs.map((input) => input.value));
  };

  const handleInputChange = (id: number, value: string) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setInputs(updatedInputs);
    props.onInputChange(updatedInputs.map((input) => input.value));
  };

  const focusInput = (id: number) => {
    const inputElement = document.getElementById(
      `input-${id}`
    ) as HTMLInputElement;
    inputElement?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInputField(index);
    }
  };

  useEffect(() => {
    props.onInputChange(inputs.map((input) => input.value));
  }, []);

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      {inputs.map((input, index) => (
        <div key={input.id} className="flex items-center space-x-2 w-full">
          <input
            id={`input-${input.id}`}
            type="text"
            value={input.value}
            disabled={props.busy}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            onKeyUp={(e) => handleKeyPress(e, index)}
            className="flex-grow px-4 py-2 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300"
          />
          <button
            disabled={props.busy}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
            onClick={() => {
              removeInputField(input.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9.586l4.293-4.293a1 1 0 011.414 1.414L11.414 11l4.293 4.293a1 1 0 01-1.414 1.414L10 12.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 11 4.293 6.707a1 1 0 011.414-1.414L10 9.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
      <button
        disabled={props.busy || !props.modelLoaded}
        onClick={() => addInputField()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
      >
        Add
      </button>
    </div>
  );
};

export default InputFieldsComponent;

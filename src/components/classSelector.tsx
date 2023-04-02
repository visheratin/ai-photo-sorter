import React, { useEffect, useState } from "react";
import { FileInfo } from "./fileInfo";

interface ClassSelectorProps {
  file: FileInfo | undefined;
  classes: string[];
  onClassSet: (file: FileInfo, className: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ClassSelector = (props: ClassSelectorProps) => {
  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const selectClass = (className: string) => {
    if (props.file) {
      props.onClassSet(props.file, className);
      props.onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        props.isOpen && props.classes.length > 0 ? "block" : "hidden"
      }`}
      onClick={closeModal}
    >
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg mb-4">Select new class</h2>
        <ul className="divide-y divide-gray-200">
          {props.classes.map((className, idx) => (
            <li
              key={idx}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100"
              onClick={() => selectClass(className)}
            >
              {className}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassSelector;

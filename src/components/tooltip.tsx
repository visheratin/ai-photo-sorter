// components/Tooltip.js
import { useState } from "react";

const Tooltip = (props: { tooltipContent: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        className="text-gray-500 focus:outline-none"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <span className="text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
          ?
        </span>
      </button>

      {showTooltip && (
        <div
          className="absolute top-0 left-0 ml-5 mt-3 p-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md shadow-lg"
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="arrow-up bg-white border-gray-300"></div>
          {props.tooltipContent}
        </div>
      )}

      <style jsx>{`
        .arrow-up {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid white;
          position: absolute;
          top: -5px;
          left: 8px;
          border-bottom-color: #ffffff;
          border-bottom-style: solid;
          border-bottom-width: 5px;
          margin-left: -5px;
          margin-top: -1px;
        }
      `}</style>
    </div>
  );
};

export default Tooltip;

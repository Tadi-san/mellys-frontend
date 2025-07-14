import React, { FC, useState } from "react";

interface JsonViewerProps {
  data: any; // Replace 'any' with the type of your JSON data if known
}

const JsonViewer: FC<JsonViewerProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div className="flex flex-col my-4 p-1 items-start w-[80%] h-56 mx-auto ">
      <button
        className="my-2 px-4 py-2 bg-gray-600 text-white font-light rounded-md hover:bg-gray-500 focus:outline-none"
        onClick={toggleExpand}
      >
        {expanded ? "Collapse" : "Expand"}
      </button>
      <pre className=" w-full bg-slate-100 overflow-x-hidden p-2 h-full ">
        <code>{JSON.stringify(data, null, expanded ? 2 : 0)}</code>
      </pre>
    </div>
  );
};

export default JsonViewer;

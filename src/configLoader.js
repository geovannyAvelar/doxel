"use client";

import { useEditorStore } from "@/store";
import { parseConfig } from "@/parser";

export default function ConfigLoader() {
  const setElements = useEditorStore((state) => state.setElements);
  const setConfig = useEditorStore((state) => state.setConfig);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (! file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target.result;
        const config = parseConfig(jsonString);
        
        setConfig(config);
        setElements(config.elements);
        
        console.log("Loaded config:", config);
        console.log("Total elements:", config.elements.length);
      } catch (error) {
        console.error("Error parsing config:", error);
        alert("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 bg-white border-b">
      <label className="flex items-center gap-2 cursor-pointer">
        <span className="font-medium">Load Config: </span>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="text-sm"
        />
      </label>
    </div>
  );
}
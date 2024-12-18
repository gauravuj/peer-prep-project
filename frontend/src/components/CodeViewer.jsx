import React, { useState, useEffect } from "react";
import { useCollaborativeEditor } from "../hooks/useCollaborativeEditor";
import Button from "../components/Button";
import Select from "../components/Select";
import Output from "../components/Output";
import { languages } from "../configs/monaco";
import { executePistonCode } from "../services/CollaborationService";
import { useLocation } from "react-router-dom";
import { Play, Loader } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { Modal } from "./LanguageModal";
import { useViewAttempt } from "../hooks/useViewAttempt";
import SaveNavigator from "./SaveNavigator";

export default function CodeViewer(props) {
  const { saves, languagesUsed, date } = props;
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState({
    type: "initial",
    content: "No output yet",
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentSave, setCurrentSave] = useState(saves.length);

  console.log(saves);

  const { getContent, changeTheme } = useViewAttempt({
    containerId: "editor-container",
    defaultLanguage: languagesUsed[currentSave - 1],
    theme,
    initialContent: saves[currentSave - 1],
  });

  // Handle code execution
  const handleRun = async () => {
    setIsExecuting(true);
    setOutput({ type: "running", content: "Executing code..." });

    try {
      const code = getContent();
      if (!code.trim()) {
        throw new Error("No code to execute");
      }

      const result = await executePistonCode(
        languagesUsed[currentSave - 1],
        code,
      );

      if (result.success) {
        setOutput({
          type: "success",
          content: result.output || "Code executed successfully with no output",
        });
      } else {
        const errorPrefix =
          {
            compilation: "⚠️ Compilation Error:\n",
            runtime: "❌ Runtime Error:\n",
            system: "⚠️ System Error:\n",
          }[result.errorType] || "⚠️ Error:\n";

        setOutput({
          type: "error",
          content: errorPrefix + (result.error || "Unknown error occurred"),
        });
      }
    } catch (error) {
      setOutput({
        type: "error",
        content: "⚠️ System Error:\n" + error.message,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle theme changes
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    changeTheme(newTheme);
  };

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
      <Header
        date={date}
        saves={saves}
        setCurrentSave={setCurrentSave}
        currentSave={currentSave}
      />

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={languagesUsed[currentSave - 1]}
            onChange={() => {
              console.log("Shouldn't be called");
            }}
            options={languages}
            className="min-w-[150px]"
            disabled={true}
          />
          <Button
            onClick={handleRun}
            disabled={isExecuting}
            icon={isExecuting ? Loader : Play}
            className={isExecuting ? "animate-spin" : ""}
          >
            {isExecuting ? "Running..." : "Run"}
          </Button>
        </div>

        <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
      </div>

      <div
        id="editor-container"
        className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-700/30 bg-[#1e1e1e]"
      />

      <Output output={output} className="max-h-[200px] overflow-auto" />
    </div>
  );
}

function Header({ date, saves, setCurrentSave, currentSave }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-md mb-2 font-bold text-[#bcfe4d]">CODE VIEWER</div>
      <SaveNavigator
        maxSave={saves.length}
        setCurrentSave={setCurrentSave}
        currentSave={currentSave}
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">{`Question attempted on ${new Date(date).toLocaleDateString()}`}</span>
      </div>
    </div>
  );
}

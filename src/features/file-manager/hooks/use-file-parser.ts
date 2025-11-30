import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFileManagerStore } from "../store/file-manager-store";

export const useFileParser = () => {
  const navigate = useNavigate();
  const { parseFiles, parsedProject } = useFileManagerStore();

  const parseAndNavigate = useCallback(async () => {
    await parseFiles();
    navigate("/editor");
  }, [parseFiles, navigate]);

  return {
    parseAndNavigate,
    parsedProject,
  };
};

import { ParsedProject } from "@/lib/types/project.types";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportProjectToCsv(
  project: ParsedProject,
): Promise<boolean> {
  const concepts = project.folder_structure.children[0]?.children || [];
  const languages = project.languages.map((l) => l.code);

  const headers = [
    "ID",
    ...languages,
    ...languages.map((l) => `${l}_approved`),
  ];
  const rows: string[] = [headers.map(escapeCsvField).join(",")];

  for (const concept of concepts) {
    const row: string[] = [concept.name];
    for (const lang of languages) {
      const t = concept.translations.find((tr) => tr.language === lang);
      row.push(t?.value || "");
    }
    for (const lang of languages) {
      const t = concept.translations.find((tr) => tr.language === lang);
      row.push(t?.approved ? "true" : "false");
    }
    rows.push(row.map(escapeCsvField).join(","));
  }

  const csvContent = rows.join("\n");

  const savePath = await save({
    defaultPath: `${project.filename.replace(".babler", "")}_translations.csv`,
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

  if (!savePath) return false;

  await writeTextFile(savePath, csvContent);
  return true;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

export async function importCsvToProject(
  project: ParsedProject,
): Promise<ParsedProject | null> {
  const filePath = await open({
    multiple: false,
    filters: [{ name: "CSV Files", extensions: ["csv"] }],
  });

  if (!filePath) return null;

  const content = await readTextFile(filePath);
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return null;

  const headers = parseCsvLine(lines[0]);
  const idIndex = headers.indexOf("ID");
  if (idIndex === -1) return null;

  const langHeaders = headers.filter(
    (h) => h !== "ID" && !h.endsWith("_approved"),
  );

  const updatedChildren = [...project.folder_structure.children[0].children];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const id = fields[idIndex];
    if (!id) continue;

    const existingIdx = updatedChildren.findIndex((c) => c.name === id);
    const translations = langHeaders.map((lang) => {
      const langIdx = headers.indexOf(lang);
      const approvedIdx = headers.indexOf(`${lang}_approved`);
      return {
        language: lang,
        value: fields[langIdx] || "",
        approved: approvedIdx >= 0 ? fields[approvedIdx] === "true" : false,
      };
    });

    if (existingIdx >= 0) {
      updatedChildren[existingIdx] = {
        ...updatedChildren[existingIdx],
        translations,
      };
    } else {
      updatedChildren.push({
        type: "folder",
        name: id,
        description: "",
        comment: "",
        translations,
      });
    }
  }

  return {
    ...project,
    folder_structure: {
      ...project.folder_structure,
      children: [
        {
          ...project.folder_structure.children[0],
          children: updatedChildren,
        },
      ],
    },
  };
}

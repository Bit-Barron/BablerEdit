import React, { useMemo } from "react";
import { useEditorStore } from "@/lib/store/editor.store";
import { useProjectStore } from "@/lib/store/project.store";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Button } from "@/components/ui/retroui/button";

interface LangStats {
  code: string;
  total: number;
  translated: number;
  untranslated: number;
  approved: number;
  unapproved: number;
  percentComplete: number;
  percentApproved: number;
  wordCount: number;
}

export const StatisticsDialog: React.FC = () => {
  const { statisticsDialogOpen, setStatisticsDialogOpen } = useEditorStore();
  const { parsedProject } = useProjectStore();

  const stats = useMemo<LangStats[]>(() => {
    if (!parsedProject?.folder_structure?.children?.[0]?.children) return [];

    const concepts = parsedProject.folder_structure.children[0].children;
    const languages = parsedProject.languages;

    return languages.map((lang) => {
      let translated = 0;
      let untranslated = 0;
      let approved = 0;
      let wordCount = 0;

      for (const concept of concepts) {
        const t = concept.translations.find((tr) => tr.language === lang.code);
        if (t && t.value && t.value.trim() !== "") {
          translated++;
          wordCount += t.value.trim().split(/\s+/).length;
          if (t.approved) approved++;
        } else {
          untranslated++;
        }
      }

      const total = concepts.length;
      return {
        code: lang.code,
        total,
        translated,
        untranslated,
        approved,
        unapproved: translated - approved,
        percentComplete: total > 0 ? Math.round((translated / total) * 100) : 0,
        percentApproved: total > 0 ? Math.round((approved / total) * 100) : 0,
        wordCount,
      };
    });
  }, [parsedProject]);

  const totalKeys = stats.length > 0 ? stats[0].total : 0;

  return (
    <Dialog open={statisticsDialogOpen} onOpenChange={setStatisticsDialogOpen}>
      <Dialog.Content className="max-w-3xl max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
          Translation Statistics
        </Dialog.Header>

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <div className="text-2xl font-bold">{totalKeys}</div>
              <div className="text-sm text-muted-foreground">Total Keys</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <div className="text-2xl font-bold">{stats.length}</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <div className="text-2xl font-bold">
                {stats.length > 0
                  ? Math.round(
                      stats.reduce((sum, s) => sum + s.percentComplete, 0) /
                        stats.length
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">Avg. Complete</div>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold">Language</th>
                  <th className="text-center px-3 py-3 font-semibold">Translated</th>
                  <th className="text-center px-3 py-3 font-semibold">Missing</th>
                  <th className="text-center px-3 py-3 font-semibold">Approved</th>
                  <th className="text-center px-3 py-3 font-semibold">Words</th>
                  <th className="text-center px-3 py-3 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.code} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium uppercase">{s.code}</td>
                    <td className="text-center px-3 py-3 text-green-600">
                      {s.translated}/{s.total}
                    </td>
                    <td className="text-center px-3 py-3 text-red-500">
                      {s.untranslated}
                    </td>
                    <td className="text-center px-3 py-3 text-blue-500">
                      {s.approved}
                    </td>
                    <td className="text-center px-3 py-3 text-muted-foreground">
                      {s.wordCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${s.percentComplete}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10 text-right">
                          {s.percentComplete}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog.Footer className="px-6 pb-6">
          <Button onClick={() => setStatisticsDialogOpen(false)}>Close</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

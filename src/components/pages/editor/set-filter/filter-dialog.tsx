import { Dialog } from "@/components/ui/retroui/dialog";
import { useEditorStore } from "@/lib/store/editor.store";
import { Button } from "@/components/ui/retroui/button";
import { Input } from "@/components/ui/retroui/input";
import { Label } from "@/components/ui/retroui/label";
import { Select } from "@/components/ui/retroui/select";
import { useProjectStore } from "@/lib/store/project.store";
import { ParsedProject } from "@/lib/types/project.types";


export const FilterDialog: React.FC = () => {
  const { setFilterDialogOpen, filterDialogOpen, setTranslationId, translationId, setTranslationText, translationText,
  } = useEditorStore();
  const { parsedProject, setParsedProject
  } = useProjectStore()

  const handleFilter = async () => {
    const obj = parsedProject.folder_structure.children[0].children;
    const filtered = obj.filter((filt) =>
      filt.name.toLowerCase().includes(translationText.toLowerCase())
    );

    const updatedFolder: ParsedProject = {
      ...parsedProject,
      folder_structure: {
        name: "main",
        children: parsedProject.folder_structure.children.map((pkg) => ({
          ...pkg,
          children: filtered
        }))
      }
    }

    setParsedProject(updatedFolder)
  }


  const handleReset = () => {
    setTranslationId("")
    setTranslationText("")
  }

  return (
    <Dialog
      open={filterDialogOpen}
      onOpenChange={(open) => setFilterDialogOpen(open)}
    >
      <Dialog.Content size="lg" className="max-w-2xl">
        <Dialog.Header className="px-6 pt-6 pb-4 bg-primary text-primary-foreground">
          <h2 className="text-lg font-semibold">Set Filter</h2>
        </Dialog.Header>

        <div className="bg-background px-6 py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
              Substring Search
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="translation-id" className="text-right">
                  Translation ID:
                </Label>
                <Input
                  value={translationId}
                  onChange={(event) => setTranslationId(event.target.value)}
                  id="translation-id"
                  placeholder=""
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="translation-text" className="text-right">
                  Translation text:
                </Label>
                <div className="col-span-3 flex gap-2 items-center">
                  <Input
                    value={translationText}
                    onChange={(e) => setTranslationText(e.target.value)}
                    id="translation-text"
                    placeholder=""
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
              Status
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="translation-text-status" className="text-right">
                  Translation text:
                </Label>
                <Select defaultValue="any">
                  <Select.Trigger id="translation-text-status" className="col-span-3">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="any">any</Select.Item>
                    <Select.Item value="translated">translated</Select.Item>
                    <Select.Item value="untranslated">untranslated</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="approval-state" className="text-right">
                  Approval state:
                </Label>
                <Select defaultValue="any">
                  <Select.Trigger id="approval-state" className="col-span-3">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="any">any</Select.Item>
                    <Select.Item value="approved">approved</Select.Item>
                    <Select.Item value="not-approved">not approved</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="usage" className="text-right">
                  Usage:
                </Label>
                <Select defaultValue="any">
                  <Select.Trigger id="usage" className="col-span-3">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="any">any</Select.Item>
                    <Select.Item value="used">used</Select.Item>
                    <Select.Item value="unused">unused</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Dialog.Footer className="flex justify-between px-6 py-4 bg-muted/30">
          <Button
            variant="outline"
            onClick={() => {
              handleReset()
            }}
          >
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleFilter()
                setFilterDialogOpen(false);
              }}
            >
              Filter
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

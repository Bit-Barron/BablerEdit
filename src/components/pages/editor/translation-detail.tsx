import React, { useEffect, useState } from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/lib/types/project.types";
import { TreeNodeType } from "@/lib/types/editor.types";
import { useTranslation } from "@/hooks/use-translation";
import { useTranslationStore } from "@/lib/store/translation.store";
import { Separator } from "@/components/ui/separator";
import { TranslationInput } from "@/components/elements/translation-input";
import { MessageSquareIcon } from "@/components/icons/message-square";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Textarea } from "@/components/ui/retroui/textarea";
import { PlaneIcon } from "lucide-react";
import { Button } from "@/components/ui/retroui/button";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNodeType>;
  project: ParsedProject;
}

export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const {
    translationForKey,
    setTranslationForKey,
    displayComment,
    setDisplayComment,
  } = useTranslationStore();
  const { toggleApproved, changeTranslationValue, addComment } =
    useTranslation();
  const [comment, setComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const findTranslationForKey = () => {
      const mainPackage = project.folder_structure.children[0];
      const conceptNode = mainPackage.children.find(
        (child) => child.name === selectedNode!.data.id
      );

      setTranslationForKey(conceptNode!.translations);
    };

    findTranslationForKey();
  }, [selectedNode]);

  useEffect(() => {
    const findTranslationComment = () => {
      const mainPackage = project.folder_structure.children[0];
      const conceptNode = mainPackage.children.find(
        (child) => child.name === selectedNode!.data.id
      );

      setDisplayComment(conceptNode?.comment as string);
    };

    findTranslationComment();
  }, [selectedNode, displayComment, comment]);

  return (
    <section className="flex flex-col bg-background h-full">
      <div className="px-6 py-4 bg-secondary/50 border-b-2 border-t-2 border-border flex justify-between items-center">
        <h2 className="font-bold text-base tracking-tight">Translations</h2>
        <div className="flex items-center gap-4 justify-between">
          {project.languages.map((lang, idx) => (
            <React.Fragment key={lang.code}>
              <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-md border border-primary/20">{`${
                lang.code
              }-${lang.code.toUpperCase()}`}</div>
              {idx < project.languages.length - 1 && (
                <Separator orientation="vertical" className="h-5" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 bg-muted/30 border-b border-border flex justify-between items-center">
        <h1 className="font-semibold text-sm text-muted-foreground tracking-wide">
          {selectedNode.data.id}
        </h1>
        <div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger>
              <button
                className="cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setDialogOpen(true)}
              >
                <MessageSquareIcon
                  size={20}
                  className="text-muted-foreground hover:bg-primary hover:text-white p-1 hover:rounded mt-1"
                />
              </button>
            </Dialog.Trigger>
            <Dialog.Content className="sm:max-w-150 max-h-[85vh] p-0 flex flex-col">
              <Dialog.Header className="px-6 pt-6 pb-3 shrink-0">
                Add a comment
              </Dialog.Header>
              <section className="px-6 pt-3 pb-6">
                <Textarea
                  onChange={(e: { target: { value: string } }) =>
                    setComment(e.target.value)
                  }
                  value={comment}
                  rows={6}
                  placeholder="type something..."
                  className="w-full border-2 shadow-md transition focus:outline-hidden focus:shadow-xs"
                />
              </section>
              <Dialog.Footer className="px-6 pb-6 gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setDialogOpen(false);
                    setComment("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="w-28 btn btn-primary"
                  onClick={() => {
                    addComment(comment);
                    setDialogOpen(false);
                  }}
                >
                  <PlaneIcon className="mr-2" size={16} />
                  Save
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
      </div>

      {displayComment && (
        <div className="px-4 py-2 bg-muted/20 border-b border-border">
          <p className="text-sm text-muted-foreground">{displayComment}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-4">
          {translationForKey.map((t) => {
            return (
              <TranslationInput
                key={t.language}
                translation={t}
                toggleApproved={toggleApproved}
                changeTranslationValue={changeTranslationValue}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

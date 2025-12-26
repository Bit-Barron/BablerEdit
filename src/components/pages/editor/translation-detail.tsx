import React, { useEffect } from "react";
import { NodeApi } from "react-arborist";
import { ParsedProject } from "@/lib/types/project.types";
import { TreeNodeType } from "@/lib/types/tree.types";
import { useTranslation } from "@/hooks/use-translation";
import { useTranslationStore } from "@/lib/store/translation.store";
import { Separator } from "@/components/ui/separator";
import { TranslationInput } from "@/components/elements/translation-input";
import { MessageSquareIcon } from "@/components/icons/message-square";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/elements/animated-modal";
import { PlaneIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/icons/x";

interface TranslationDetailProps {
  selectedNode: NodeApi<TreeNodeType>;
  project: ParsedProject;
}
export const TranslationDetail: React.FC<TranslationDetailProps> = ({
  selectedNode,
  project,
}) => {
  const { translationForKey, setTranslationForKey } = useTranslationStore();
  const { toggleApproved, changeTranslationValue } = useTranslation();

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
          <Modal>
            <ModalTrigger>
              <MessageSquareIcon size={20} className="text-muted-foreground" />
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Add a comment
                </h4>
                <section>
                  <Textarea
                    rows={4}
                    placeholder="type something..."
                    className="px-4 py-2 w-full border-2 shadow-md transition focus:outline-hidden focus:shadow-xs"
                  />
                </section>
              </ModalContent>
              <ModalFooter className="gap-4">
                <Button variant="outline" className="w-28">
                  <XIcon className="mr-2" size={16} />
                  close
                </Button>
                <Button className="w-28">
                  <PlaneIcon className="mr-2" size={16} />
                  Save
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      </div>

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

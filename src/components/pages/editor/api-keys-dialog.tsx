import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/retroui/dialog";
import { Button } from "@/components/ui/retroui/button";
import { Input } from "@/components/ui/retroui/input";
import { Label } from "@/components/ui/retroui/label";
import { useSettingsStore, ApiKeys } from "@/lib/store/setting.store";

interface ApiKeysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApiKeysDialog: React.FC<ApiKeysDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { apiKeys, setApiKey } = useSettingsStore();
  const [localKeys, setLocalKeys] = useState<ApiKeys>({ ...apiKeys });

  useEffect(() => {
    if (open) setLocalKeys({ ...apiKeys });
  }, [open, apiKeys]);

  const handleSave = () => {
    (Object.keys(localKeys) as (keyof ApiKeys)[]).forEach((key) => {
      if (localKeys[key] !== apiKeys[key]) {
        setApiKey(key, localKeys[key]);
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="md" className="max-h-[85vh] p-0 flex flex-col">
        <Dialog.Header className="px-6 pt-6 pb-3 bg-primary text-primary-foreground rounded-t-lg">
          API Keys Configuration
        </Dialog.Header>
        <section className="px-6 pt-4 pb-6 space-y-5">
          <p className="text-xs text-muted-foreground">
            Configure API keys for premium translation providers. LLM providers
            (NVIDIA, Fireworks, Mistral) work out of the box with free tiers.
          </p>

          <div className="space-y-2">
            <Label>Google Translate API Key</Label>
            <Input
              type="password"
              value={localKeys.googleTranslate}
              onChange={(e) =>
                setLocalKeys((k) => ({ ...k, googleTranslate: e.target.value }))
              }
              placeholder="Enter Google Cloud Translation API key..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>DeepL API Key</Label>
            <Input
              type="password"
              value={localKeys.deepl}
              onChange={(e) =>
                setLocalKeys((k) => ({ ...k, deepl: e.target.value }))
              }
              placeholder="Enter DeepL API key..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Microsoft Translator API Key</Label>
            <Input
              type="password"
              value={localKeys.microsoftTranslator}
              onChange={(e) =>
                setLocalKeys((k) => ({
                  ...k,
                  microsoftTranslator: e.target.value,
                }))
              }
              placeholder="Enter Azure Cognitive Services key..."
              className="w-full"
            />
          </div>
        </section>
        <Dialog.Footer className="px-6 pb-6 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Keys</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

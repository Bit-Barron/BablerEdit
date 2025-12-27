import { useModal } from "@/components/elements/animated-modal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { PlaneIcon } from "lucide-react";

interface SaveButtonProps {
  comment: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ comment }) => {
  const { setOpen } = useModal();
  const { addComment } = useTranslation();

  return (
    <Button
      className="w-28"
      onClick={() => {
        addComment(comment);
        setOpen(false);
      }}
    >
      <PlaneIcon className="mr-2" size={16} />
      Save
    </Button>
  );
};

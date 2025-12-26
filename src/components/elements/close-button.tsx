import { useModal } from "@/components/elements/animated-modal";
import { XIcon } from "@/components/icons/x";
import { Button } from "@/components/ui/button";

export const CloseButton = () => {
  const { setOpen } = useModal();
  return (
    <Button variant="outline" className="w-28" onClick={() => setOpen(false)}>
      <XIcon className="mr-2" size={16} />
      close
    </Button>
  );
};

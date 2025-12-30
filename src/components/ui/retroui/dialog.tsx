"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from "react";

const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;

const overlayVariants = cva(
  ` fixed bg-black/80 font-head
    data-[state=open]:fade-in-0
    data-[state=open]:animate-in
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
  `,
  {
    variants: {
      variant: {
        default: "inset-0 z-50 bg-black/85",
        none: "fixed bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface IDialogBackgroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof overlayVariants> {}

const DialogBackdrop = React.forwardRef<HTMLDivElement, IDialogBackgroupProps>(
  function DialogBackdrop(inputProps: IDialogBackgroupProps, forwardedRef) {
    const { variant = "default", className, ...props } = inputProps;

    return (
      <Dialog.Backdrop
        className={cn(overlayVariants({ variant }), className)}
        ref={forwardedRef}
        {...props}
      />
    );
  }
);
DialogBackdrop.displayName = "DialogBackdrop";

const dialogVariants = cva(
  `fixed left-[50%] top-[50%] z-50 grid rounded overflow-hidden w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-2 bg-background shadow-lg duration-200
  data-[state=open]:animate-in
  data-[state=open]:fade-in-0
  data-[state=open]:zoom-in-95
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=closed]:zoom-out-95`,
  {
    variants: {
      size: {
        auto: "max-w-fit",
        sm: "lg:max-w-[30%]",
        md: "lg:max-w-[40%]",
        lg: "lg:max-w-[50%]",
        xl: "lg:max-w-[60%]",
        "2xl": "lg:max-w-[70%]",
        "3xl": "lg:max-w-[80%]",
        "4xl": "lg:max-w-[90%]",
        screen: "max-w-[100%]",
      },
    },
    defaultVariants: {
      size: "auto",
    },
  }
);

interface IDialogContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants> {
  overlay?: IDialogBackgroupProps;
}

const DialogContent = React.forwardRef<HTMLDivElement, IDialogContentProps>(
  function DialogContent(inputProps: IDialogContentProps, forwardedRef) {
    const {
      children,
      size = "auto",
      className,
      overlay,
      ...props
    } = inputProps;

    return (
      <Dialog.Portal>
        <DialogBackdrop {...overlay} />
        <Dialog.Popup
          className={cn(dialogVariants({ size }), className)}
          ref={forwardedRef}
          {...props}
        >
          {/* No VisuallyHidden in baseui, so skip title visually hidden */}
          <div className="flex flex-col relative">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    );
  }
);
DialogContent.displayName = "DialogContent";

interface IDialogDescriptionProps extends HTMLAttributes<HTMLDivElement> {}
const DialogDescription = ({
  children,
  className,
  ...props
}: IDialogDescriptionProps) => {
  return (
    <Dialog.Description className={cn(className)} {...props}>
      {children}
    </Dialog.Description>
  );
};

const dialogFooterVariants = cva(
  "flex items-center justify-end border-t-2 min-h-12 gap-4 px-4 py-2",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
      },
      position: {
        fixed: "sticky bottom-0",
        static: "static",
      },
    },
    defaultVariants: {
      position: "fixed",
    },
  }
);

export interface IDialogFooterProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogFooterVariants> {}

const DialogFooter = ({
  children,
  className,
  position,
  variant,
  ...props
}: IDialogFooterProps) => {
  return (
    <div
      className={cn(dialogFooterVariants({ position, variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

const dialogHeaderVariants = cva(
  "flex items-center justify-between border-b-2 px-4 min-h-12",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
      },
      position: {
        fixed: "sticky top-0",
        static: "static",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "static",
    },
  }
);

interface IDialogHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogHeaderVariants> {}

const DialogHeader = ({
  children,
  className,
  position,
  variant,
  ...props
}: IDialogHeaderProps) => {
  return (
    <div
      className={cn(dialogHeaderVariants({ position, variant }), className)}
      {...props}
    >
      {/* asChild prop removed, always render children */}
      {children}
    </div>
  );
};

const DialogComponent = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Header: DialogHeader,
  Content: DialogContent,
  Description: DialogDescription,
  Footer: DialogFooter,
});

export { DialogComponent as Dialog };

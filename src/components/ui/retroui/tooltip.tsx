"use client";

import * as React from "react";
import { Tooltip } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const tooltipContentVariants = cva(
  "z-50 overflow-hidden border-2 border-border bg-background px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "bg-primary text-primary-foreground",
        solid: "bg-black text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TooltipProvider = Tooltip.Provider;

const TooltipRoot = Tooltip.Root;

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof Tooltip.Trigger>,
  React.ComponentPropsWithoutRef<typeof Tooltip.Trigger<any>>
>((props, ref) => {
  return <Tooltip.Trigger ref={ref} {...props} />;
});

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof Tooltip.Popup>,
  React.ComponentPropsWithoutRef<typeof Tooltip.Popup> &
    VariantProps<typeof tooltipContentVariants> & { sideOffset?: number }
>(({ className, variant, sideOffset, ...props }, ref) => {
  const resolvedSideOffset = sideOffset ?? 4;
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={resolvedSideOffset}>
        <Tooltip.Popup
          ref={ref}
          className={cn(
            tooltipContentVariants({
              variant,
              className,
            })
          )}
          {...props}
        />
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
});
TooltipContent.displayName = Tooltip.Popup.displayName;

const TooltipObject = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Provider: TooltipProvider,
});

export { TooltipObject as Tooltip };

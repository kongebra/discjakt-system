import { cn } from "@/lib";
import React from "react";

type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {};

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <p ref={ref} className={cn("text-gray-500 text-sm", className)} {...rest}>
        {children}
      </p>
    );
  }
);

Text.displayName = "Text";

export default Text;

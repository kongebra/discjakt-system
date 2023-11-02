import { cn } from "@/lib/utils";
import React from "react";

type Props = React.ComponentProps<"section">;

const Section = React.forwardRef<HTMLElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <section ref={ref} className={cn("lg:px-8 sm:px-6 px-4", className)}>
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export default Section;

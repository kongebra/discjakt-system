import { cn } from "@/lib";
import React from "react";

type MetricProps = React.HTMLAttributes<HTMLParagraphElement> & {};

const Metric = React.forwardRef<HTMLParagraphElement, MetricProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("font-semibold text-gray-700 text-3xl", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);

Metric.displayName = "Metric";

export default Metric;

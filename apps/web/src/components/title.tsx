import clsx from "clsx";
import React from "react";

type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  heading?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ children, heading: Component = "h1", className, ...rest }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          "text-gray-700 font-medium",
          {
            "text-xl": Component === "h1",
          },
          className
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Title.displayName = "Title";

export default Title;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { cn } from "@/lib";

type Props = {
  title: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  progress?: number;
};

const StatCard: React.FC<Props> = ({
  title,
  value,
  description,
  icon,
  progress,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {description && (
          <p
            className={cn("text-xs text-muted-foreground", {
              "mb-1": progress !== undefined,
            })}
          >
            {description}
          </p>
        )}

        {progress !== undefined && (
          <Progress value={Math.min(Math.max(progress, 0), 100)} />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

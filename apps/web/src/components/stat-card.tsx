import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  title: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
};

const StatCard: React.FC<Props> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

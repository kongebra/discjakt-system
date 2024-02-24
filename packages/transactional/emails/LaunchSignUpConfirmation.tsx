import { Button, Heading, Html, Text } from "@react-email/components";
import * as React from "react";

type Props = {
  id: string;
};

export const LaunchSignUpConfirmation = ({ id }: Props) => {
  return (
    <Html>
      <Heading>Confirm signup</Heading>

      <Text>Confirm signup for Discjakt launch notification</Text>

      <Button
        href="https://discjakt.no/confirm-signup?id=${id}"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Confirm signup
      </Button>
    </Html>
  );
};

export default LaunchSignUpConfirmation;


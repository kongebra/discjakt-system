"use server";

import { prisma, Prisma } from "@discjakt/db";

export async function signUpEmailAction(formData: FormData) {
  const emailValue = formData.get("email");
  if (!emailValue) {
    return {
      message: `Email is required`,
    };
  }

  try {
    await prisma.launchSignUp.create({
      data: {
        email: emailValue.toString(),
      },
      select: {
        id: true,
      },
    });

    return {
      message: `Sign up successful`,
    };
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError)?.code === "P2002") {
      return {
        message: `Sign up successful`,
      };
    }

    console.error("Unknown error", error);

    return {
      message: `Unknown error`,
    };
  }
}


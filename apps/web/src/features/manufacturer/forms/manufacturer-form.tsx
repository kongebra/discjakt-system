"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Manufacturer } from "database";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { ManufacturerFields, manufacturerSchema } from "..";

type Props = {
  onSubmit: (values: ManufacturerFields) => void;
  defaultValues?: Manufacturer;
  loading?: boolean;
};

const ManufacturerForm: React.FC<Props> = ({
  defaultValues,
  onSubmit,
  loading,
}) => {
  const form = useForm<ManufacturerFields>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      image_url: defaultValues?.image_url ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} disabled={loading} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Slug" {...field} disabled={loading} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Description"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} disabled={loading} />
              </FormControl>
              <FormDescription>
                Preview:
                {field.value && (
                  <Image
                    unoptimized
                    src={field.value}
                    alt={"Preivew"}
                    width={512}
                    height={512}
                  />
                )}
              </FormDescription>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ManufacturerForm;

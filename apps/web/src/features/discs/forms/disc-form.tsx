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
import { Disc, Manufacturer } from "database";
import React from "react";
import { useForm } from "react-hook-form";
import { DiscFields, discSchema } from "../schemas";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormStatus } from "react-dom";

type Props = {
  manufacturers: Manufacturer[];
  onSubmit: (data: DiscFields) => void;
  defaultValues?: Partial<Disc>;
  loading?: boolean;
};

const DiscForm: React.FC<Props> = ({
  manufacturers,
  onSubmit,
  defaultValues,
}) => {
  const { pending: loading } = useFormStatus();

  const form = useForm<DiscFields>({
    resolver: zodResolver(discSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      image_url: defaultValues?.image_url ?? "",

      speed: defaultValues?.speed ?? 0,
      glide: defaultValues?.glide ?? 0,
      turn: defaultValues?.turn ?? 0,
      fade: defaultValues?.fade ?? 0,

      type: defaultValues?.type ?? "PUTTER",

      manufacturer_slug: defaultValues?.manufacturer_slug,
    },
  });

  const handleOnSubmit = form.handleSubmit(async (data) => {
    const response = await fetch(`/api/database/discs/${data.slug}`);
    if (response.status === 200) {
      const existingDisc = await response.json();
      if (existingDisc.id !== defaultValues?.id) {
        form.setError("slug", {
          message: `Slug already exists`,
        });
        return;
      }
    }

    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleOnSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field: { onChange, ...field }, fieldState }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  autoComplete={"off"}
                  {...field}
                  onChange={(e) => {
                    const value = e.currentTarget.value;

                    form.setValue("slug", slugify(value));

                    onChange(e);
                  }}
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
          name="slug"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="Slug"
                  autoComplete={"off"}
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
          name="manufacturer_slug"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Manufacturer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {manufacturers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((manufacturer) => (
                      <SelectItem
                        key={manufacturer.slug}
                        value={manufacturer.slug}
                      >
                        {manufacturer.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3 mb-4">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PUTTER" />
                    </FormControl>
                    <FormLabel className="font-normal">Putter</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MIDRANGE" />
                    </FormControl>
                    <FormLabel className="font-normal">Midrange</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FAIRWAY" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Fairway Driver
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="DISTANCE" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Distance Driver
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-4 gap-2">
          <FormField
            control={form.control}
            name="speed"
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FormItem>
                <FormLabel>Speed</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.5}
                    autoComplete={"off"}
                    placeholder="Speed"
                    {...field}
                    onChange={(e) => {
                      const value = e.currentTarget.valueAsNumber;
                      onChange(value);
                    }}
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
            name="glide"
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FormItem>
                <FormLabel>Glide</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.5}
                    autoComplete={"off"}
                    placeholder="Glide"
                    {...field}
                    onChange={(e) => {
                      const value = e.currentTarget.valueAsNumber;
                      onChange(value);
                    }}
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
            name="turn"
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FormItem>
                <FormLabel>Turn</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.5}
                    autoComplete={"off"}
                    placeholder="Turn"
                    {...field}
                    onChange={(e) => {
                      const value = e.currentTarget.valueAsNumber;
                      onChange(value);
                    }}
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
            name="fade"
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FormItem>
                <FormLabel>Fade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.5}
                    autoComplete={"off"}
                    placeholder="Fade"
                    {...field}
                    onChange={(e) => {
                      const value = e.currentTarget.valueAsNumber;
                      onChange(value);
                    }}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

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

        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default DiscForm;

import z from "@/lib/zod";
import { getUrlFromString, isValidUrl, parseDateTime } from "@dub/utils";

export const parseUrlSchema = z
  .string()
  .transform((v) => getUrlFromString(v))
  .refine((v) => isValidUrl(v), { message: "Invalid URL" });

export const parseUrlSchemaAllowEmpty = ({
  maxLength,
  trim = false,
}: {
  maxLength?: number;
  trim?: boolean;
} = {}) => {
  let schema = z.string();

  if (trim) {
    schema = schema.trim();
  }

  if (maxLength) {
    schema = schema.max(maxLength, {
      message: `Must be ${maxLength} or fewer characters long`,
    });
  }

  return schema.transform((v) => getUrlFromString(v));
};

export const parseDateSchema = z
  .string()
  .transform((v) => parseDateTime(v))
  .refine((v) => !!v, { message: "Invalid date" });

export const deepRemoveDefaults = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  if (schema instanceof z.ZodDefault)
    return deepRemoveDefaults(schema.removeDefault());

  if (schema instanceof z.ZodObject) {
    const newShape: any = {};

    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = z.ZodOptional.create(deepRemoveDefaults(fieldSchema));
    }
    return new z.ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as any;
  }

  if (schema instanceof z.ZodArray)
    return z.ZodArray.create(deepRemoveDefaults(schema.element));

  if (schema instanceof z.ZodOptional)
    return z.ZodOptional.create(deepRemoveDefaults(schema.unwrap()));

  if (schema instanceof z.ZodNullable)
    return z.ZodNullable.create(deepRemoveDefaults(schema.unwrap()));

  if (schema instanceof z.ZodTuple)
    return z.ZodTuple.create(
      schema.items.map((item: any) => deepRemoveDefaults(item)),
    );

  return schema;
};

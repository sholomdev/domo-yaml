import { z } from 'zod';

export const yamlObjectSchema = z.object({
  DatasetID: z.string(),
  DatasetName: z.string(),
  ColumnName: z.string(),
  TestName: z.enum(['unique', 'not_null', 'none']),
});

export const yamlModelSchema = z.object({
  models: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      columns: z.array(
        z.object({
          name: z.string(),
          description: z.optional(z.string()),
          tests: z.optional(
            z
              .array(z.enum(['unique', 'not_null']))
              .refine((items) => new Set(items).size === items.length, {
                message: 'No duplicate tests please.',
              })
          ),
        })
      ),
    })
  ),
});

export const yamlObjectArraySchema = z.array(yamlObjectSchema);

export type YamlObject = z.infer<typeof yamlObjectSchema>;
export type YamlObjectArray = z.infer<typeof yamlObjectArraySchema>;
export type YamlModel = z.infer<typeof yamlModelSchema>;

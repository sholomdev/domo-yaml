import { z } from 'zod';

export const yamlObjectSchema = z.object({
  MartName: z.string(),
  MartDescription: z.string(),
  DatasetID: z.string(),
  DatasetName: z.string(),
  DatasetDescription: z.string(),
  ColumnName: z.string(),
  ColumnDescription: z.string(),
  TestName: z.enum(['unique', 'not_null', 'freshness', 'row_count_deviation']),
  TestParameter: z.string(),
});

export const yamlModelSchema = z.object({
  marts: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      datasets: z.array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          id: z.string(),
          columns: z.array(
            z.object({
              name: z.string(),
              description: z.string().optional(),
              tests: z
                .array(
                  z.object({
                    name: z.enum([
                      'unique',
                      'not_null',
                      'row_count_deviation',
                      'freshness'
                    ]),
                    parameter: z.string().optional()
                  }),
                )
                .refine((items) => new Set(items).size === items.length, {
                  message: 'No duplicate tests please.',
                }),
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

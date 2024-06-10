import { z } from 'zod';

export const yamlObjectSchema = z.object({
  FolderName: z.string(),
  FolderDescription: z.string(),
  DatasetID: z.string(),
  DatasetName: z.string(),
  DatasetDescription: z.string(),
  ColumnName: z.string(),
  ColumnDescription: z.string(),
  TestName: z.enum(['unique', 'not_null', 'freshness', 'none', 'deviation']),
  TestData: z.string(),
});

export const yamlModelSchema = z.object({
  folders: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      datasets: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          id: z.string(),
          columns: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
              tests: z
                .array(
                  z.object({
                    name: z.enum([
                      'unique',
                      'not_null',
                      'freshness',
                      'deviation',
                      'none',
                    ]),
                    data: z.string(),
                  })
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

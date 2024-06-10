import { z } from 'zod';

export const DatatsetSchema = z.map(
  z.string(),
  z.object({
    DatasetID: z.string(),
    Name: z.string(),
    RowCount: z.number(),
    ColumnArray: z.array(z.string()),
  })
);

export type Datasets = z.infer<typeof DatatsetSchema>;
export type DatasetsFromDomo = {
  DatasetID: string;
  Name: string;
  RowCount: number;
  ColumnName: string;
}[];

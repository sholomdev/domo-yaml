import { z } from 'zod';

export const TestResultSchema = z.object({
  DatasetID: z.string(),
  DatasetName: z.string(),
  ColumnName: z.string(),
  TestName: z.enum(['unique', 'not_null', 'none']),
  RowCount: z.number(),
  Result: z.string(),
  Date: z.number(),
  Error: z.string(),
});

export const TestResultsSchema = z.array(TestResultSchema);

export type TestResult = z.infer<typeof TestResultSchema>;
export type TestResults = z.infer<typeof TestResultsSchema>;

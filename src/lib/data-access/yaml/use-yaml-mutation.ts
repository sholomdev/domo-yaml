import { queryClient } from './../query-client';
import { useMutation } from '@tanstack/react-query';
import domo from 'ryuu.js';
import { toast } from 'sonner';
import { z } from 'zod';

const responseSchema = z.object({ response: z.object({ status: z.string() }) });
type Response = z.infer<typeof responseSchema>;

// {
//   "response": {
//     "dataSourceId": "e46ef616-47ed-4db8-9b7c-8dd196afde7e",
//     "uploadId": 9,
//     "status": "SUCCESS",
//     "size": {
//       "rowCount": 3,
//       "columnCount": 4,
//       "numberOfBytes": 181,
//       "partCount": 1
//     },
//     "indexing": {
//       "requested": true,
//       "requestedOn": 1717094273746,
//       "requestKey": "20240530183753.754"
//     }
//   }
// }

const mutationFn = async (csv: string): Promise<Response> => {
  let response: Response;
  if (import.meta.env.DEV) {
    response = { response: { status: 'SUCCESS' } };
  } else {
    response = await domo.post<Response>(
      `/domo/codeengine/v2/packages/uploadDataset`,
      {
        dataset: 'e46ef616-47ed-4db8-9b7c-8dd196afde7e',
        values: csv,
      }
    );
  }
  return responseSchema.parse(response);
};

const useSaveYamlMutation = () => {
  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['yaml'] });
      toast.success('Yaml saved.');
    },
  });
};

export default useSaveYamlMutation;

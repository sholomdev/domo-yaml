import { useMutation, useQueryClient } from '@tanstack/react-query';
import domo from 'ryuu.js';
import { z } from 'zod';
import type { ValidateSuccessState } from './validate-yaml';

const responseSchema = z.object({
  response: z.object({
    success: z.boolean(),
    data: z.optional(z.unknown()),
    message: z.optional(z.string()),
  }),
});
type Response = z.infer<typeof responseSchema>;

const mutationFn = async ({
  datasetsColumns,
  csv,
}: ValidateSuccessState['data']): Promise<Response['response']> => {
  let response: Response;
  // toast('Saving YAML Tests to Dataset...');
  if (import.meta.env.DEV) {
    response = { response: { success: true, data: '' } };
    console.log(datasetsColumns, csv)
  } else {
    response = await domo.post<Response>(
      `/domo/codeengine/v2/packages/saveYamlTests`,
      {
        datasetsColumns,
        csvObject: { data: csv },
      }
    );
  }
  if (!response.response.success) throw new Error(response.response.message);
  return response.response;
};

const useSaveYamlMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      // Invalidate and refetch
      console.log('Refreshing data...');
      await queryClient.removeQueries({ queryKey: ['yaml'] });
      // toast.success('Yaml saved.');
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // onError(error, _, __) {
    //   // toast.error('Failed to save yaml: ' + error.message);
    // },
  });
};

export default useSaveYamlMutation;

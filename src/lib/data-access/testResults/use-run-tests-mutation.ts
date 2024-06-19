// import { queryClient } from '../query-client';
import { useMutation } from '@tanstack/react-query';
import domo from 'ryuu.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  results: z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: z.object({ size: z.object({ rowCount: z.number() }) }),
    }),
    z.object({ success: z.literal(false), message: z.string() }),
  ]),
});
type Response = z.infer<typeof ResponseSchema>;

const mutationFn = async (): Promise<Response> => {
  if (import.meta.env.DEV) {
    return { results: { success: true, data: { size: { rowCount: 3 } } } };
    // response = { response: { status: 'SUCCESS' } };
  } else {
    return domo.post<Response>(`/domo/codeengine/v2/packages/runTests`, {});
  }
};

const useRunTestsMutation = () => {
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log('tests ran, data response:', data)
      if (data.results.success) {
        // toast.success(`Tests ran succesfully.`);
      } else {
        // toast.error(data.results.message);
      }
      // queryClient.invalidateQueries({ queryKey: ['yaml'] });
    },
  });
};

export default useRunTestsMutation;

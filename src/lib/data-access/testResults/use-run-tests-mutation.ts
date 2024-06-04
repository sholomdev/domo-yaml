import { queryClient } from '../query-client';
import { useMutation } from '@tanstack/react-query';
import domo from 'ryuu.js';
// import { z } from 'zod';

// const responseSchema = z.object({ response: z.object({ status: z.string() }) });
// type Response = z.infer<typeof responseSchema>;

const mutationFn = async () => {
  if (import.meta.env.DEV) {
    return;
    // response = { response: { status: 'SUCCESS' } };
  } else {
    domo.post(`/domo/codeengine/v2/packages/runTests`, {});
  }
};

const useRunTestsMutation = () => {
  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['yaml'] });
    },
  });
};

export default useRunTestsMutation;

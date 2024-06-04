import { useQuery } from '@tanstack/react-query';
import domo from 'ryuu.js';
import { type TestResults, TestResultsSchema } from './test-results-schema';
import { useEffect, useMemo } from 'react';
import { TestResultData } from '../data';
import { toast } from 'sonner';

let queryFn: () => Promise<TestResults>;

export type TestMapType = {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
};

if (import.meta.env.DEV) {
  queryFn = () => new Promise((resolve) => resolve(TestResultData));
} else {
  queryFn = (): Promise<TestResults> => {
    return domo.get<TestResults>('data/v1/TestResults').then((data) => {
      return TestResultsSchema.parse(data);
    });
  };
}

export function useTestResultsQuery() {
  const { data, error, isLoading, isSuccess, isError, refetch } = useQuery({
    queryKey: ['TestResults'],
    queryFn,
    staleTime: Infinity,
  });

  useEffect(() => {
    domo.onDataUpdate((alias) => {
      if (alias === 'TestResults') {
        console.log('refetching ' + alias);
        toast.success('Test results updated.  Refetching...');
        refetch();
      }
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const testMap = useMemo(() => {
    if (isSuccess) {
      const newMap: TestMapType = {};
      data.forEach((testResult) => {
        const { DatasetID, ColumnName, TestName, Date, Result } = testResult;
        newMap[DatasetID] ??= {};
        newMap[DatasetID][ColumnName] ??= {};
        newMap[DatasetID][ColumnName][TestName] ??= {};
        newMap[DatasetID][ColumnName][TestName][Date] = Result;

        newMap[DatasetID][ColumnName][TestName][Date.toString()] =
          testResult.Result;
      });
      return newMap;
    } else return null;
  }, [isSuccess, data]);

  return { error, isLoading, isError, isSuccess, data, testMap };
}

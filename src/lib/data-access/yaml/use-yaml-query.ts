import { useQuery } from '@tanstack/react-query';
import domo from 'ryuu.js';
import { yamlObjectArraySchema, YamlObjectArray } from './yaml-schema';
import { yamlDataset } from '../../../types';
import { yamlDatasetData } from '../data';
import { useEffect } from 'react';
import { objectsToYaml } from './objects-to-yaml';

const queryFn: () => Promise<YamlObjectArray> = async () => {
  let response: YamlObjectArray;
  if (import.meta.env.DEV) {
    response = yamlDatasetData; //yamlArraySchema.parse(data)
  } else {
    response = await domo.get<yamlDataset[]>('data/v1/yaml');
  }
  return yamlObjectArraySchema.parse(response);
};

export function useYamlQuery() {
  const yamlQuery = useQuery({
    queryKey: ['yaml'],
    queryFn,
    staleTime: Infinity,
    select: (data) => objectsToYaml(data),
  });

  useEffect(() => {
    domo.onDataUpdate((alias) => {
      if (alias === 'yaml') {
        console.log('refetching ' + alias);
        yamlQuery.refetch();
      }
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return yamlQuery;
}

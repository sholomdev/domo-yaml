import { useQuery } from '@tanstack/react-query';
import domo from 'ryuu.js';
import { yamlObjectArraySchema, YamlObjectArray } from './yaml-schema';
import { yamlDatasetData } from '../data';
import { objectArrayToObjectModel, objectModelToYamlString } from './objects-to-yaml';

const queryFn: () => Promise<YamlObjectArray> = async () => {
  let response: YamlObjectArray;
  if (import.meta.env.DEV) {
    response = yamlDatasetData; //yamlArraySchema.parse(data)
  } else {
    response = await domo.get<YamlObjectArray>('data/v1/yaml');
  }
  return yamlObjectArraySchema.parse(response);
};

export function useYamlQuery() {
  const yamlQuery = useQuery({
    queryKey: ['yaml'],
    queryFn,
    staleTime: Infinity,
    select: (data) =>{
      const model = objectArrayToObjectModel(data);
      return {model, yaml: objectModelToYamlString(model)}
      },
  });

  // useEffect(() => {
  //   domo.onDataUpdate((alias) => {
  //     if (alias === 'yaml') {
  //       console.log('refetching ' + alias);
  //       yamlQuery.refetch();
  //     }
  //   });
  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return yamlQuery;
}

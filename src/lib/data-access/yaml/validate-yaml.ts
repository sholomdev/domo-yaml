import YAML, { YAMLParseError } from 'yaml';
import { YamlModel, yamlModelSchema } from './yaml-schema';

type ValidateFailedState = {
  success: false;
  message: string;
};

export type ValidateSuccessState = {
  success: true;
  data: { datasetsColumns: Record<string, string[]>; csv: string };
};

type ValidateState = ValidateFailedState | ValidateSuccessState;

export const parsedYAMLtoCSV = (yml: YamlModel) => {
  const lines: string[] = [];

  yml.folders.forEach((folder) => {
    const {
      name: folderName,
      datasets,
      description: folderDescription,
    } = folder;
    // const folderDescription = folder.description ?? 'none';

    datasets.forEach((dataset) => {
      const {
        name: datasetName,
        id,
        columns,
        description: datasetDescription,
      } = dataset;
      // const datasetDescription = dataset.description ?? 'none';

      columns.forEach((column) => {
        const {
          name: columnName,
          description: columnDescription,
          tests,
        } = column;

        if (!tests) {
          lines.push(
            `${folderName},${folderDescription},${id},${datasetName},${datasetDescription},${columnName},${columnDescription},none,none`
          );
        } else {
          tests.forEach((test) => {
            const { name: testName } = test;
            // const testData = test.data ?? 'none';
            lines.push(
              `${folderName},${folderDescription},${id},${datasetName},${datasetDescription},${columnName},${columnDescription},${testName},${test.data}`
            );
          });
        }
      });
    });
  });
  return lines.join('\n');
};

const parseYAML = (yaml: string): ValidateState => {
  let yamlModel: YamlModel;
  try {
    yamlModel = YAML.parse(yaml);
  } catch (e) {
    if (e instanceof YAMLParseError) {
      return { success: false, message: e.message };
    } else {
      return { success: false, message: 'Yaml parsing did not work.' };
    }
  }
  const parsedYamlModel = yamlModelSchema.safeParse(yamlModel);
  if (!parsedYamlModel.success)
    return { success: false, message: parsedYamlModel.error.message };

  const datasets = new Map<string, string[]>();
  parsedYamlModel.data.folders.forEach((folder) => {
    folder.datasets.forEach((dataset) => {
      const datasetColumns = dataset.columns.map((column) => column.name);
      datasets.set(dataset.id, datasetColumns);
    });
  });
  const csv = parsedYAMLtoCSV(parsedYamlModel.data);
  return {
    success: true,
    data: { datasetsColumns: Object.fromEntries(datasets), csv },
  };
};

export default parseYAML;

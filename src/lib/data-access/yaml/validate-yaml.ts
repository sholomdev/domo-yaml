import YAML, { YAMLParseError } from 'yaml';
import { Datasets } from '../datasets/datasets-schema';
import { YamlModel, yamlModelSchema } from './yaml-schema';

type ValidateFailedState = {
  success: false;
  message: string;
};

type ValidateSuccessState = {
  success: true;
  data: string;
};

type ValidateState = ValidateFailedState | ValidateSuccessState;

const validateYMLcolumns = (
  parsedYaml: YamlModel,
  datasets: Datasets
): ValidateState => {
  let message = '';
  parsedYaml.models.every((model) => {
    const dataset = datasets.get(model.id);
    if (!dataset) {
      message = `Dataset with id ${model.id} not found.`;
      return false;
    }
    model.columns.every((column) => {
      if (!dataset?.ColumnArray?.includes(column.name)) {
        message = `Column ${column.name} not found in ${dataset.Name}.`;
        return false;
      }
    });
  });

  if (message !== '') return { success: false, message };
  return { success: true, data: '' };
};

export const parsedYAMLtoCSV = (yml: YamlModel) => {
  const lines: string[] = [];
  yml.models.forEach((model) => {
    const { id, name: datasetName } = model;
    model.columns.forEach((column) => {
      if (!column.tests) {
        lines.push(`${id},${datasetName},${column.name},none`);
      } else {
        column.tests.forEach((test) => {
          lines.push(`${id},${datasetName},${column.name},${test}`);
        });
      }
    });
  });
  return lines.join('\n');
};

const validateYaml = (yaml: string, datasets: Datasets): ValidateState => {
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

  const validated = validateYMLcolumns(parsedYamlModel.data, datasets);
  if (!validated.success) return { success: false, message: validated.message };
  const csv = parsedYAMLtoCSV(parsedYamlModel.data);
  return { success: true, data: csv };
};

export default validateYaml;

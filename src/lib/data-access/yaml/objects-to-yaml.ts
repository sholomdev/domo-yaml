import { YamlModel, YamlObjectArray } from './yaml-schema';
import YAML from 'yaml';
// import { Column } from '../../../types';

type hashObject = {
  [key in string]: YamlModel['folders'][0];
};

type Dataset = YamlModel['folders'][0]['datasets'][0];
// type Column = Dataset['columns'][0];

export const objectsToYaml = (data: YamlObjectArray) => {
  const obj: hashObject = {};

  data.forEach((row) => {
    obj[row.FolderName] = obj[row.FolderName] || {
      name: row.FolderName,
      description: row.FolderDescription,
      datasets: [],
    };

    let currentDataset = obj[row.FolderName].datasets.find(
      (dataset: Dataset) => dataset.id === row.DatasetID
    );

    if (!currentDataset) {
      currentDataset = {
        name: row.DatasetName,
        id: row.DatasetID,
        description: row.DatasetDescription,
        columns: [],
      };
      obj[row.FolderName].datasets.push(currentDataset);
    }

    let currentColumn = currentDataset.columns.find(
      (column) => column.name === row.ColumnName
    );

    if (!currentColumn) {
      currentColumn = {
        name: row.ColumnName,
        description: row.ColumnDescription,
        tests: [],
      };
      currentDataset.columns.push(currentColumn);
    }
    currentColumn.tests.push({ name: row.TestName, data: row.TestData });
  });

  return YAML.stringify({ folders: [...Object.values(obj)] });
};

import { YamlModel, YamlObjectArray } from './yaml-schema';
import YAML from 'yaml';
// import { Column } from '../../../types';

type hashObject = {
  [key in string]: YamlModel['marts'][0];
};

type Dataset = YamlModel['marts'][0]['datasets'][0];
// type Column = Dataset['columns'][0];

export const objectArrayToObjectModel = (data: YamlObjectArray) =>{
  const obj: hashObject = {};

  data.forEach((row) => {
    obj[row.MartName] = obj[row.MartName] || {
      name: row.MartName,
      description: row.MartName === 'none' ? undefined : row.MartName,
      datasets: [],
    };

    let currentDataset = obj[row.MartName].datasets.find(
      (dataset: Dataset) => dataset.id === row.DatasetID
    );

    if (!currentDataset) {
      currentDataset = {
        name: row.DatasetName,
        id: row.DatasetID,
        description: row.DatasetDescription === 'none' ? undefined :  row.DatasetDescription,
        columns: [],
      };
      obj[row.MartName].datasets.push(currentDataset);
    }

    let currentColumn = currentDataset.columns.find(
      (column) => column.name === row.ColumnName
    );

    if (!currentColumn) {
      currentColumn = {
        name: row.ColumnName,
        description: row.ColumnDescription === 'none' ? undefined : row.ColumnDescription,
        tests: [],
      }; 
      currentDataset.columns.push(currentColumn);
    }

    let currentTest = {name: row.TestName, parameter: row.TestParameter === 'none'? undefined : row.TestParameter }
    currentColumn.tests.push(currentTest);
  });

  return { marts: [...Object.values(obj)] };

}

export const objectModelToYamlString = (data: YamlModel) => {
 return YAML.stringify(data)
};

import { YamlObjectArray } from './yaml-schema';
import YAML from 'yaml';
import { Column } from '../../../types';

// export const dataToYaml = (data: yamlDataset[]) => {
//   const hashObj = {} as hashObject;

//   data.forEach((row) => {
//     if (!Object.prototype.hasOwnProperty.call(hashObj, row.DatasetID)) {
//       hashObj[row.DatasetID] = {
//         name: row.DatasetName,
//         id: row.DatasetID,
//         columns: [],
//       };
//     }
//     let currentColumn = hashObj[row.DatasetID].columns.find(
//       (column) => column.name === row.ColumnName
//     );
//     if (!currentColumn) {
//       currentColumn = { name: row.ColumnName };
//       hashObj[row.DatasetID].columns.push(currentColumn);
//     }
//     if (row.TestName !== 'none') {
//       (currentColumn.tests ??= []).push(row.TestName);
//     }
//   });

//   const sort = (a: Column, b: Column) => {
//     if (a.name < b.name) {
//       return -1;
//     }
//     if (a.name > b.name) {
//       return 1;
//     }
//     return 0;
//   };

//   return YAML.stringify({ models: [...Object.values(hashObj)].sort(sort) });
// };

// export const objectsToYaml = (data: yamlDataset[]) => {
//   const hashMap = new Map();

//   data.forEach((row) => {
//     const { DatasetID: id, ColumnName, TestName } = row;
//     if (!hashMap.has(id)) {
//       hashMap.set(id, {
//         name: row.DatasetName,
//         id: id,
//         columns: new Map(),
//       });
//     }
//     const columnsHash = hashMap.get(id).columns;
//     if (!columnsHash.has(ColumnName)) {
//       columnsHash.set(ColumnName, [TestName]);
//     } else {
//       columnsHash.get(ColumnName).push(TestName);
//     }
//   });

//   const sort = (a: Column, b: Column) => {
//     if (a.name < b.name) {
//       return -1;
//     }
//     if (a.name > b.name) {
//       return 1;
//     }
//     return 0;
//   };

//   return YAML.stringify({ models: [...hashMap.values()].sort(sort) });
// };

type hashObject = {
  [key in string]: Column;
};

export const objectsToYaml = (data: YamlObjectArray) => {
  const obj = {} as hashObject;

  data.forEach((row) => {
    if (!Object.prototype.hasOwnProperty.call(obj, row.DatasetID)) {
      obj[row.DatasetID] = {
        name: row.DatasetName,
        id: row.DatasetID,
        columns: [],
      };
    }
    let currentColumn = obj[row.DatasetID].columns.find(
      (column) => column.name === row.ColumnName
    );
    if (!currentColumn) {
      currentColumn = { name: row.ColumnName };
      obj[row.DatasetID].columns.push(currentColumn);
    }
    if (row.TestName !== 'none') {
      (currentColumn.tests ??= []).push(row.TestName);
    }
  });

  const sort = (a: Column, b: Column) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  return YAML.stringify({ models: [...Object.values(obj)].sort(sort) });
};

export type yamlDataset = {
  DatasetID: string;
  DatasetName: string;
  ColumnName: string;
  TestName: 'unique' | 'not_null' | 'none';
};

export type Column = {
  name: string;
  id: string;
  columns: {
    name: string;
    tests?: ('unique' | 'not_null')[];
  }[];
};

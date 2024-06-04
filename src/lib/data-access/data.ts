import type { YamlObjectArray } from './yaml/yaml-schema';
import type { TestResults } from './testResults/test-results-schema';
import type { DatasetsFromDomo } from './datasets/datasets-schema';
export const yamlDatasetData: YamlObjectArray = [
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    ColumnName: 'dimensions_stat_time_day',
    TestName: 'unique',
    DatasetName: 'Dataflow Input Datasources',
  },
];

export const TestResultData: TestResults = [
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    DatasetName: 'Dataflow Input Datasources',
    ColumnName: 'dimensions_stat_time_day',
    TestName: 'unique',
    Result: 'pass',
    RowCount: 34324,
    Date: 1716872832,
    Error: 'n/a',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    DatasetName: 'Datasources',
    ColumnName: 'dimensions_stat_time_day',
    TestName: 'not_null',
    Result: 'pass',
    Date: 1716872832,
    Error: 'n/a',
    RowCount: 34324,
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    DatasetName: ' Input',
    ColumnName: 'metrics_clicks',
    TestName: 'unique',
    Result: 'fail',
    Error: 'n/a',
    Date: 1716872832,
    RowCount: 34324,
  },
];

export const domoDatasetData: DatasetsFromDomo = [
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: 'dimensions_stat_time_day',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: 'dimensions_ad_id',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: 'metrics_clicks',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: 'metrics_spend',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: 'metrics_impressions',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: '_BATCH_ID_',
  },
  {
    DatasetID: '6f755524-eee0-4394-acd1-0d881b26d0d9',
    Name: '* DS | base-tiktok-ads ',
    RowCount: 2,
    ColumnName: '_BATCH_LAST_RUN_',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'subscription_id',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'plan_code',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'month',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'type',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'plan_segment_type',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'created_at',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'ended_at',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'last_invoice_id',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'total_payments',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'quantity',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'payment_status',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'new_quantity',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'ended_quantity',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'recurrent_quantity',
  },
  {
    DatasetID: '25f436c9-9981-4fcc-8528-e46cdb95d026',
    Name: '1-1-2023-copy-of-subscription-retention-monthly',
    RowCount: 266020,
    ColumnName: 'subscription_plan_cycle',
  },
];

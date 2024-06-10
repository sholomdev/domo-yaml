const codeengine = require('codeengine');

const QUERY_URL = 'api/query/v1/execute/:id';
const YAML_TESTS_ID = 'e46ef616-47ed-4db8-9b7c-8dd196afde7e';
const TEST_RESULTS_ID = '1c0c5cd0-a52d-4860-8560-dc74f59716b8';

/**
 * Query any dataset with sql and return success  response
 *
 * @param dataset string The dataset id
 * @param sql string The sql statement
 * @returns {success: boolean, data | message}
 */

async function queryWithSql(dataset, sql) {
  const convertResponseToList = ({ rows, columns }) => {
    return rows.map((row) => {
      return row.reduce((acc, curr, index) => {
        acc[columns[index]] = curr;
        return acc;
      }, {});
    });
  };

  try {
    const url = QUERY_URL.replace(':id', dataset);
    const body = { sql };
    const response = await codeengine.sendRequest('post', url, body);
    return { success: true, data: convertResponseToList(response) };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Get first row of a given dataset
 *
 * @param dataset string The dataset id
 * @returns {success: boolean, data | message}
 */

async function getDatasetColumns(dataset) {
  const sql = 'SELECT * FROM dataset LIMIT 1';
  const res = await queryWithSql(dataset, sql);
  if (!res.success)
    return { success: false, message: `${res.message} Dataset: ${dataset}` };

  const columns = Object.keys(res.data[0]);
  return { success: true, data: columns };
}

async function validateColumns(datasetsColumns) {
  const promises = await Promise.allSettled(
    Object.keys(datasetsColumns).map(async (dataset) => {
      const columnsResponse = await getDatasetColumns(dataset);
      if (!columnsResponse.success) return columnsResponse;
      return {
        success: true,
        data: { id: dataset, columns: columnsResponse.data },
      };
    })
  );

  const retrievedColumnsMap = new Map();
  for (const promise of promises) {
    if (promise.status !== 'fulfilled')
      return {
        success: false,
        message: 'Something went wrong retrieving datasets.' + promise.reason,
      };
    if (!promise.value.success)
      return {
        success: false,
        message:
          'Something went wrong retrieving datasets. ' + promise.value.message,
      };
    retrievedColumnsMap.set(promise.value.data.id, promise.value.data.columns);
  }

  for (const datasetId of Object.keys(datasetsColumns)) {
    const columnsToCheck = datasetsColumns[datasetId];
    const retrievedColumns = retrievedColumnsMap.get(datasetId);
    for (const columnToCheck of columnsToCheck) {
      if (!retrievedColumns.includes(columnToCheck))
        return {
          success: false,
          message: `${datasetId} does not seem to have a column named: ${columnToCheck}`,
        };
    }
  }
  return { success: true, data: 'all columns should be good to go.' };
}

/**
 * Validate Yaml dataset Ids and columns and save to the Yaml Tests dataset
 *
 * @param yml object The object produced by YAML.parse(yamlString)
 * @returns {success: boolean, data | message}
 */

async function saveYamlTests(csvObject, datasetsColumns) {
  const validateRes = await validateColumns(datasetsColumns);
  if (!validateRes.success)
    return {
      success: false,
      message: 'Error in saveYamlTests.  ' + validateRes.message,
    };

  //upload
  const uploadResponse = await uploadDataset(YAML_TESTS_ID, csvObject.data);
  return uploadResponse;
}

/**
 * Append a row of values to the specified dataset
 *
 * @param dataset string The dataset id
 * @param values string A comma delimited string of values to append to the dataset
 * @returns {} // TODO: Which object, I suspect one with rows/columns
 */

const DATASOURCE = {
  v2: 'api/data/v2/datasources',
  v3: 'api/data/v3/datasources',
};

const DATASET_URL = `${DATASOURCE.v3}/:id`;
const UPLOADS_URL = `${DATASET_URL}/uploads`;
const UPLOADS_PARTS_URL = `${UPLOADS_URL}/:uploadId/parts/1`;
const UPLOADS_COMMIT_URL = `${UPLOADS_URL}/:uploadId/commit`;

async function uploadDataset(dataset, values) {
  const uploadsUrl = UPLOADS_URL.replace(':id', dataset);
  const uploadsBody = {
    action: null,
    appendId: null,
  };

  try {
    const uploadsResponse = await codeengine.sendRequest(
      'post',
      uploadsUrl,
      uploadsBody
    );
    const partsUrl = UPLOADS_PARTS_URL.replace(':id', dataset).replace(
      ':uploadId',
      uploadsResponse.uploadId
    );

    await codeengine.sendRequest('put', partsUrl, values, null, 'text/plain');

    const commitUrl = UPLOADS_COMMIT_URL.replace(':id', dataset).replace(
      ':uploadId',
      uploadsResponse.uploadId
    );
    const commitBody = {
      index: true,
      action: 'REPLACE',
    };

    const response = await codeengine.sendRequest(
      'put',
      commitUrl,
      commitBody,
      null,
      'application/json'
    );

    if (response.status === 'SUCCESS') {
      return { success: true, data: response };
    } else {
      const message = response.message || 'Error uploading data.';
      return { success: false, message };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function appendToDataset(dataset, values) {
  const uploadsUrl = UPLOADS_URL.replace(':id', dataset);
  const uploadsBody = {
    action: 'APPEND',
    message: 'Uploading',
    appendId: 'latest',
  };

  try {
    const uploadsResponse = await codeengine.sendRequest(
      'post',
      uploadsUrl,
      uploadsBody
    );
    const partsUrl = UPLOADS_PARTS_URL.replace(':id', dataset).replace(
      ':uploadId',
      uploadsResponse.uploadId
    );

    await codeengine.sendRequest('put', partsUrl, values, null, 'text/plain');

    const commitUrl = UPLOADS_COMMIT_URL.replace(':id', dataset).replace(
      ':uploadId',
      uploadsResponse.uploadId
    );
    const commitBody = {
      index: true,
      appendId: 'latest',
      message: 'it worked',
    };

    const data = await codeengine.sendRequest(
      'put',
      commitUrl,
      commitBody,
      null,
      'application/json'
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Test a column in a dataset to have no null valuies
 *
 * @param
 * @param
 * @returns {success: boolean, data or message}
 */

async function testNotNullColumn(DatasetID, ColumnName) {
  const sql = `select count(*) FROM dataset WHERE "${ColumnName}" IS NULL`;
  const result = await queryWithSql(DatasetID, sql);

  if (result.success === true) {
    const passFail = result.data[0]['count(*)'] === 0 ? 'pass' : 'fail';
    return { success: true, data: passFail };
  } else {
    return { success: false, message: result.message };
  }
}

/**
 * Test a column in a dataset to have only unique values
 *
 * @param
 * @param
 * @returns {success: boolean, data or message}
 */

async function testUniqueColumn(DatasetID, ColumnName) {
  // testUniqueColumn(DatasetID, ColumnName, TestName, dataset['RowCount'], date );
  const sql = `SELECT count(\`${ColumnName}\`) as \`count\`, count(distinct \`${ColumnName}\`) as \`distinctCount\`, count(*) as \`rowsCount\` FROM dataset`;

  const response = await queryWithSql(DatasetID, sql);
  if (!response.success) return { success: false, message: response.message };

  const { count, distinctCount, rowsCount } = response.data[0];
  const passFail =
    count === distinctCount && (count === rowsCount || count === rowsCount - 1)
      ? 'pass'
      : 'fail';

  return { success: true, data: passFail };
}

/**
 * Test a column in a dataset for most recent date
 *
 * @param
 * @param
 * @returns {success: boolean, data or message}
 */

//new test: max date of a column,

async function testFreshness(DatasetID, ColumnName, TestData) {
  const sql = `SELECT MAX(\`${ColumnName}\`) as MAX FROM dataset`;
  const response = await queryWithSql(DatasetID, sql);
  if (!response.success)
    return {
      success: false,
      message: `Error retrieving date for freshness test on ${DatasetID} - ${ColumnName}: ${response.message}`,
    };

  const max = new Date(response.data[0].MAX);
  const ms = new Date() - max;
  const daysSinceMax = ms / (1000 * 60 * 60 * 24);
  console.log(max, ms, daysSinceMax);
  const passFail = TestData >= daysSinceMax ? 'pass' : 'fail';
  return { success: true, data: passFail };
}

/**
 * Get the most recent row counts for each dataset in Test Results
 *
 * @returns {success: true/false, data?: {datasetID: rowCount, deviationFactor}}
 */

/**
 * Get row counts
 *
 * @param
 * @param
 * @returns {success: boolean, data:  {rowCount, deviationFactor}   }
 */

async function getRowCounts(datasetIds) {
  const datasetIdsString = "'" + datasetIds.join("','") + "'";

  let sql =
    'SELECT `DatasetID`, AVG(`RowCount`) as AVG, STDDEV(`RowCount`) as `STD` FROM dataset';
  sql += ' WHERE DatasetID IN (' + datasetIdsString + ')';
  sql += ' GROUP BY `DatasetID`';

  const statsResponse = await queryWithSql(TEST_RESULTS_ID, sql);
  if (!statsResponse.success) {
    return statsResponse;
  }

  const promises = await Promise.allSettled(
    datasetIds.map(async (datasetID) => {
      const stats = statsResponse.data.find(
        (row) => row.DatasetID === datasetID
      );
      const query = `SELECT count(*) as \`rowCount\` FROM dataset`;
      const rowCountResponse = await queryWithSql(datasetID, query);

      if (!rowCountResponse.success)
        return {
          success: false,
          message: `${datasetID}: ${rowCountResponse.message} `,
        };
      const rowCount = rowCountResponse.data[0].rowCount;
      let deviationFactor;
      if (stats === undefined || stats.STD === 0) {
        deviationFactor = 0;
      } else {
        deviationFactor = ((rowCount - stats.AVG) / stats.STD).toFixed(2);
      }

      return { success: true, data: { datasetID, rowCount, deviationFactor } };
    })
  );
  const rowCountOBj = {};
  for (const promise of promises) {
    if (promise.status === 'fulfilled') {
      if (!promise.value.success) return promise.value;
      const { datasetID, rowCount, deviationFactor } = promise.value.data;
      rowCountOBj[datasetID] = { rowCount, deviationFactor };
    } else {
      console.log(promise);
    }
  }
  return { success: true, data: rowCountOBj };
}

/**
 * Run tests and append to the Test Results dataset
 *
 * @returns {success: true/false, data/message}
 */

async function runTests() {
  const date = new Date().toISOString();
  const query = "SELECT * FROM dataset WHERE TestName != 'None'";
  // if(triggeredDataset) {  query += " AND `DatasetName`='" + triggeredDataset + "'";}
  const testsResponse = await queryWithSql(YAML_TESTS_ID, query);
  if (!testsResponse.success) {
    return {
      success: false,
      message: `Error retrieving tests: ${testsResponse.message}`,
    };
  }
  const tests = testsResponse.data;
  const datasetIds = tests.map((test) => test.DatasetID);
  const uniqueDatasetIDs = [...new Set(datasetIds)];
  const rowCountResponse = await getRowCounts(uniqueDatasetIDs);

  if (!rowCountResponse.success) {
    return rowCountResponse;
  }
  const rowCounts = rowCountResponse.data;

  const promiseResults = await Promise.allSettled(
    tests.map(async (test) => {
      const { DatasetID, DatasetName, ColumnName, TestName, TestData } = test;
      const rowCount = rowCounts[DatasetID];
      let testResult;
      if (TestName === 'unique') {
        testResult = await testUniqueColumn(DatasetID, ColumnName);
      } else if (TestName === 'not_null') {
        testResult = await testNotNullColumn(DatasetID, ColumnName);
      } else if (TestName === 'deviation') {
        testResult = {
          success: true,
          data: rowCounts[DatasetID].deviationFactor,
        };
      } else if (TestName === 'freshness') {
        testResult = await testFreshness(DatasetID, ColumnName, TestData);
      } else {
        return `${DatasetID},${DatasetName},${ColumnName},${TestName},n/a,n/a,${date},${TestName} is an invalid test name.`;
      }
      //error
      if (!testResult.success) {
        return `${DatasetID},${DatasetName},${ColumnName},${TestName},n/a,${rowCount.rowCount},${date}, ${testResult.message}`;
      }
      return `${DatasetID},${DatasetName},${ColumnName},${TestName},${testResult.data},${rowCount.rowCount},${date}, n/a`;
    })
  );

  const resultData = promiseResults.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
  });
  const csv = resultData.join('\n');
  return appendToDataset(TEST_RESULTS_ID, csv);
}

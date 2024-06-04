import { YAMLEditor } from './components/YamlEditor';
// import { useDatasetsQuery } from './lib/data-access/datasets/use-dataset-query';
// import { useTestResultsQuery } from './lib/data-access/testResults/use-test-results-query';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
// import DataTable from './components/DataTable';
import { Toaster } from 'sonner';
import domo from 'ryuu.js';
import { useEffect, useState } from 'react';
import { useYamlQuery } from './lib/data-access/yaml/use-yaml-query';

function App() {
  // const testResultsQuery = useTestResultsQuery();
  const yamlQuery = useYamlQuery();
  // const datasetsQuery = useDatasetsQuery();
  const [code, setCode] = useState('');
  useEffect(() => {
    if (yamlQuery.data) {
      setCode(yamlQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yamlQuery.data]);
  useEffect(() => {
    domo.onFiltersUpdate(() => {});
  }, []);
  return (
    <>
      <Toaster expand={true} position="top-right" />
      {/* <Tabs defaultValue="table" className="w-full max-w-5xl m-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Test Results</TabsTrigger>
          <TabsTrigger value="editor">YAML Editor</TabsTrigger>
        </TabsList>
        <TabsContent
          className="mx-auto p-5 overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl"
          value="table"
        >
          {testResultsQuery.data &&
            datasetsQuery.data &&
            testResultsQuery.testMap && (
              <DataTable
                testResults={testResultsQuery.data}
                datasets={datasetsQuery.data}
                testMap={testResultsQuery.testMap}
              ></DataTable>
            )}
        </TabsContent>

        <TabsContent
          value="editor"
          className="p-5 overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl"
        > */}
      <YAMLEditor code={code} setCode={setCode} />
      {/* </TabsContent>
      </Tabs> */}
    </>
  );
}

export default App;

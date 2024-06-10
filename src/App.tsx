import { YAMLEditor } from './components/YamlEditor';
// import { useDatasetsQuery } from './lib/data-access/datasets/use-dataset-query';

// import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
// import DataTable from './components/DataTable';
import { Toaster } from 'sonner';
import domo from 'ryuu.js';
import { useEffect, useState } from 'react';
import { useYamlQuery } from './lib/data-access/yaml/use-yaml-query';

function App() {
  const yamlQuery = useYamlQuery();
  const [code, setCode] = useState('');
  useEffect(() => {
    console.log('yaml query status: ', yamlQuery.status);
    console.log('yaml query data: ', yamlQuery.data);
    if (yamlQuery.data) {
      setCode(yamlQuery.data);
    }
  }, [yamlQuery.status, yamlQuery.data]);

  useEffect(() => {
    domo.onFiltersUpdate(() => {});
  }, []);
  return (
    <>
      <Toaster expand={true} position="top-right" />

      <YAMLEditor code={code} setCode={setCode} />
    </>
  );
}

export default App;

import { YAMLEditor } from './components/YamlEditor';
// import { useDatasetsQuery } from './lib/data-access/datasets/use-dataset-query';

// import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
// import DataTable from './components/DataTable';
import domo from 'ryuu.js';
import { useEffect,  useState } from 'react';
import { useYamlQuery } from './lib/data-access/yaml/use-yaml-query';

import { Tree, TreeExpandedKeysType } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';


function App() {
  const yamlQuery = useYamlQuery();
  const [code, setCode] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({});
  const [highlighted, setHighlighted] = useState<{from: number, to: number}>({from: 0, to: 1});

  useEffect(() => {
    if (yamlQuery.data) {
      setCode(yamlQuery.data.yaml);
      const treeData = yamlQuery.data.model.marts.map(
        mart => (
          {
            key: mart.name,
            label: mart.name,
            data: mart.name,
            icon: 'pi pi-fw pi-warehouse',
            children: mart.datasets.map(dataset=>({
              key: `${mart.name}::${dataset.id}`,
              label: dataset.name,
              data: dataset.name,
              icon: 'pi pi-fw pi-database',
              children: dataset.columns.map(column=>({
                key: `${mart.name}::${dataset.id}::${column.name}`,
                label: column.name,
                data: column.name,
                icon: 'pi pi-fw pi-list',
                children: column.tests.map(test=>({
                  key: `${mart.name}::${dataset.id}::${column.name}::${test.name}`,
                  label: test.name,
                  data: test.name,
                  icon: 'pi pi-fw pi-check-square',
                }))
              }))
            }))
          }
        )
      )
      setTreeNodes(treeData);    
      expandAll(treeData)  
    }
  }, [yamlQuery.data]);

  const expandAll = (treeData: TreeNode[]) => {
    let _expandedKeys = {};

    for (let node of treeData) {
        expandNode(node, _expandedKeys);
    }

    setExpandedKeys(_expandedKeys);
};
 
const expandNode = (node: TreeNode, _expandedKeys: TreeExpandedKeysType) => {
  if (node.children && node.children.length) {
      if(node.key) {
        _expandedKeys[node.key] = true;

      for (let child of node.children) {
          expandNode(child, _expandedKeys);
      }
    }
  }
};



  useEffect(() => {
    domo.onFiltersUpdate(() => {});
  }, []);

  useEffect(()=>{
    const keys = selectedKey.split('::');
    let start = 0;
    let end = 0;
    for(const key of keys){
      start = code.indexOf(key, end);
      end = start + key.length;
    }
    console.log('start: ', start, 'end: ', end )
    setHighlighted({from: start, to: end})
  }, [selectedKey])

  return (
<div className="flex flex-row ">
  

      {yamlQuery.isSuccess && <Tree className='w-4 p-2 h-screen fixed top-0 overflow-scroll' filter filterMode="lenient" filterPlaceholder="Filter" value={treeNodes} onToggle={(e) => setExpandedKeys(e.value)} expandedKeys={expandedKeys}  selectionMode="single" selectionKeys={selectedKey} 
    onSelectionChange={(e) => {
      typeof e.value === 'string' && setSelectedKey(e.value);     
      }}/>}
     <div className='w-8 absolute right-0'>  <YAMLEditor code={code} setCode={setCode} highlighted={highlighted}/>
     </div>
    
      </div>
         
  );
}

export default App;

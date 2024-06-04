import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import YamlControls from './YamlControls';
import { useYamlQuery } from '@/lib/data-access/yaml/use-yaml-query';
import { useCallback, useEffect, useState } from 'react';
import { AlertDestructive } from './ui/alertDestructive';
import { Alert } from './ui/alert';
import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import useSaveYamlMutation from '@/lib/data-access/yaml/use-yaml-mutation';
import validateYaml from '@/lib/data-access/yaml/validate-yaml';
import { useDatasetsQuery } from '@/lib/data-access/datasets/use-dataset-query';
import { downloadText } from '@/lib/download-text';
import useRunTestsMutation from '@/lib/data-access/testResults/use-run-tests-mutation';
import { toast } from 'sonner';

const yaml = StreamLanguage.define(yamlMode.yaml);

const vsCodeDark = vscodeDarkInit({
  settings: { fontFamily: 'Monaco, Courier, monospace' },
});

type Props = {
  code: string;
  setCode: (code: string) => void;
};

export const YAMLEditor = function ({ code, setCode }: Props) {
  const yamlQuery = useYamlQuery();
  const datasetQuery = useDatasetsQuery();
  const saveYaml = useSaveYamlMutation();
  const runTests = useRunTestsMutation();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (saveYaml.isError) {
      console.log('save yaml error: ', saveYaml);
      setErrorMessage(saveYaml.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveYaml.isError]);

  const onChange = useCallback((val: string, _: ViewUpdate) => {
    setCode(val);
  }, []);

  const onReset = () => {
    setErrorMessage('');
    setCode(yamlQuery.data!);
  };

  const onDownload = () => {
    downloadText(code);
  };

  const onSave = () => {
    if (datasetQuery.data) {
      const validation = validateYaml(code, datasetQuery.data);
      if (validation.success) {
        setErrorMessage('');
        saveYaml.mutate(validation.data);
      } else {
        setErrorMessage(validation.message);
      }
    }
  };

  const onRunTests = () => {
    setErrorMessage('');
    toast.info('Tests running...');
    runTests.mutate();
  };

  if (yamlQuery.isError) {
    console.log(yamlQuery.error);
    return (
      <AlertDestructive>
        <p>
          Error. Could not retrieve YAML from dataset.{' '}
          <Button
            className="h-8"
            variant="outline"
            onClick={() => {
              yamlQuery.refetch();
            }}
          >
            Retry
          </Button>
        </p>
      </AlertDestructive>
    );
  }

  if (yamlQuery.isLoading)
    return (
      <Alert>
        <LoaderCircle className="w-4 h-4 animate-spin m-1"></LoaderCircle>{' '}
        <p>Loading YAML from dataset...</p>
      </Alert>
    );
  return (
    <div>
      {errorMessage !== '' && (
        <AlertDestructive>{errorMessage}</AlertDestructive>
      )}
      <div className="flex">
        <YamlControls
          onReset={onReset}
          onSave={onSave}
          yamlUnchanged={code === yamlQuery.data}
          setErrorMessage={setErrorMessage}
          onDownload={onDownload}
          onRunTests={onRunTests}
          isSaving={saveYaml.isPending}
          isRunning={runTests.isPending}
        ></YamlControls>
      </div>
      <CodeMirror
        className="h-full overflow-y-hidden"
        value={code}
        onChange={onChange}
        theme={vsCodeDark}
        extensions={[yaml]}
      />
    </div>
  );
};

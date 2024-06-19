import CodeMirror, {  Decoration, DecorationSet, EditorView, RangeSet, ReactCodeMirrorRef, StateEffect, StateField, ViewUpdate } from '@uiw/react-codemirror';
import * as yamlMode from '@codemirror/legacy-modes/mode/yaml';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { StreamLanguage } from '@codemirror/language';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import YamlControls from './YamlControls';
import { useYamlQuery } from '@/lib/data-access/yaml/use-yaml-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import useSaveYamlMutation from '@/lib/data-access/yaml/use-yaml-mutation';
import parseYAML from '@/lib/data-access/yaml/validate-yaml';
import { downloadText } from '@/lib/download-text';
import useRunTestsMutation from '@/lib/data-access/testResults/use-run-tests-mutation';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

const yaml = StreamLanguage.define(yamlMode.yaml);

const vsCodeDark = vscodeDarkInit({
  settings: { fontFamily: 'Monaco, Courier, monospace' },
});


const updateHighlightedStateEffect = StateEffect.define<{from: number, to: number}>({
  map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
});

const highlightedStateField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(currentValue, transaction) { 
    currentValue = currentValue.map(transaction.changes);
    for (const e of transaction.effects) {
      if (e.is(updateHighlightedStateEffect)) {
        const {from, to} = e.value;
        if(to > from) currentValue = RangeSet.of(highlightMark.range(from, to));
      }
    }
    return currentValue;
  },
  provide: f => EditorView.decorations.from(f)
});

const highlightMark = Decoration.mark({class: "cm-highlight"})
const highlightTheme = EditorView.baseTheme({
  ".cm-highlight": { backgroundColor: "#da4900", color: 'white', fontWeight: 'bold' }
})



type Props = {
  code: string;
  setCode: (code: string) => void;
  highlighted: {from: number, to: number};
  };

export const YAMLEditor = function ({ code, setCode, highlighted,  }: Props) {
  const toast = useRef<Toast>(null);
  const yamlQuery = useYamlQuery();
  // const datasetQuery = useDatasetsQuery();
  const saveYaml = useSaveYamlMutation();
  const runTests = useRunTestsMutation();
  const [errorMessage, setErrorMessage] = useState('');
  
  const codeEditorRef = useRef<ReactCodeMirrorRef | null>(null);

  useEffect(() => {
    if (yamlQuery.isError) setErrorMessage(yamlQuery.error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yamlQuery.isError]);

  useEffect(() => {
    console.log('save yaml status: ', saveYaml.status);

    if (saveYaml.isError) setErrorMessage(saveYaml.error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveYaml.isError]);

  const onChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (val: string, _: ViewUpdate) => {
      setCode(val);
    },
    [setCode]
  );

  const onReset = () => {
    setErrorMessage('');
    setCode(yamlQuery.data?.yaml!);
  };

  const onDownload = () => {
    downloadText(code);
  };

  const onSave = () => {
    const parsed = parseYAML(code);
    if (parsed.success) {
      setErrorMessage('');
      saveYaml.mutate(parsed.data);
    } else {
      setErrorMessage(parsed.message);
    }
  };

  const onRunTests = () => {
    setErrorMessage('');
    toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Running tests...' });
    runTests.mutate();
  };

  if (yamlQuery.isError) {
    return (
        <Message severity="error" text={`Error. Could not retrieve YAML from dataset. ${yamlQuery.error.message}`}>
          
      </Message>
    );
  }

  useEffect(() => {
    if (codeEditorRef.current?.view) {
      codeEditorRef.current.view.dispatch({
        effects: [updateHighlightedStateEffect.of(highlighted)],
        sequential: true,
        scrollIntoView: true
      });
    }
  }, [highlighted]);



  if (yamlQuery.isLoading)
    return (
      <div>
        <LoaderCircle className="w-4 h-4 animate-spin m-1"></LoaderCircle>{' '}
        <p>Loading YAML from dataset...</p>
      </div>
    );
  return (
    <>
      <Toast ref={toast} />
      {errorMessage !== '' && (
        <Message severity="error" text={errorMessage} />
      )}
      <div className="flex">
        <YamlControls
          onReset={onReset}
          onSave={onSave}
          yamlUnchanged={code === yamlQuery?.data?.yaml}
          setErrorMessage={setErrorMessage}
          onDownload={(onDownload)}
          onRunTests={onRunTests}
          isSaving={saveYaml.isPending}
          isRunning={runTests.isPending}
        ></YamlControls>
      </div>
      <CodeMirror
        className="h-full overflow-y-hidden"
        ref={codeEditorRef}
        value={code}
        onChange={onChange}
        theme={vsCodeDark}
        extensions={[yaml, indentationMarkers(), highlightTheme,highlightedStateField]}
      />
    </>
  );
};

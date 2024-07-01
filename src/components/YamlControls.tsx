import { Button } from 'primereact/button';
type Props = {
  yamlUnchanged: boolean;
  onReset: () => void;
  setErrorMessage: (message: string) => void;
  onSave: () => void;
  onDownload: () => void;
  isRunning: boolean;
  isSaving: boolean;
  onRunTests: () => void;
};

const YamlControls = ({
  yamlUnchanged,
  onReset,
  setErrorMessage,
  onSave,
  onDownload,
  isRunning,
  onRunTests,
  isSaving,
}: Props) => {
  return (
    <div className="align-items-start z-1 w-8 p-2 top-0 border-noround fixed card flex flex-wrap justify-content-center gap-2">
      <Button 
       severity="secondary"
        icon="pi pi-undo"
        size="small"
        outlined 
        onClick={() => {
          onReset();
          setErrorMessage('');
        }}
        disabled={yamlUnchanged}
      >
        Reset
      </Button>
      <Button
       severity="secondary"
       icon={isSaving? 'pi pi-spin pi-spinner' : "pi pi-save"}
      size="small"
      outlined
        onClick={onSave}
        disabled={yamlUnchanged || isSaving}
      >       
        Save Changes
      </Button>

      <Button
       severity="secondary"
      size="small"
        outlined
        icon="pi pi-download"
        onClick={onDownload}
      >
        Download
      </Button>
      <Button
       severity="secondary"
      size="small"
        // className={cn('h-8 px-2 lg:px-3', isRunning && 'cursor-wait')}
        icon={isRunning? 'pi pi-spin pi-spinner' : "pi pi-play-circle" }
        outlined
        onClick={onRunTests}
        disabled={isSaving}
      >
        {/* {isRunning ? (
          <LucideRotateCw />
        ) : (
          <pi-play-circle  />
        )} */}
        Run Tests
      </Button>
     
    </div>
  );
};

export default YamlControls;

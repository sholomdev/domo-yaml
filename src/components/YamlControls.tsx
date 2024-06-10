import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { FileDown, LucideRotateCw, Play, Save, Undo2 } from 'lucide-react';
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
    <div className="flex flex-1 items-center mt-6 space-x-2 mb-2 px-3">
      <Button
        variant="outline"
        className="h-8 px-2 lg:px-3"
        onClick={() => {
          onReset();
          setErrorMessage('');
        }}
        disabled={yamlUnchanged}
      >
        <Undo2 className="mr-2 h-4 w-4" />
        Reset
      </Button>
      <Button
        variant="outline"
        className="h-8 px-2 lg:px-3"
        onClick={onSave}
        disabled={yamlUnchanged || isSaving}
      >
        {isSaving ? (
          <LucideRotateCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Changes
      </Button>

      <Button
        className="h-8 px-2 lg:px-3"
        variant="outline"
        onClick={onDownload}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button
        className={cn('h-8 px-2 lg:px-3', isRunning && 'cursor-wait')}
        variant="outline"
        onClick={onRunTests}
        disabled={isSaving}
      >
        {isRunning ? (
          <LucideRotateCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Run Tests
      </Button>
      {/*
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn(code !== originalCode && ' cursor-not-allowed')}
          >
            <a
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-8 px-2 lg:px-3 ml-auto',
                (code !== originalCode || isLoading) &&
                  'pointer-events-none opacity-50'
              )}
              onClick={handleRunTests}
              //disabled={code !== originalCode}
            >
              Run Tests
              {isLoading ? (
                <LucideRotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="ml-2 h-4 w-4" />
              )}
            </a>
          </TooltipTrigger>
          <TooltipContent className={cn(code === originalCode && 'hidden')}>
            <p>Save changes first!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </div>
  );
};

export default YamlControls;

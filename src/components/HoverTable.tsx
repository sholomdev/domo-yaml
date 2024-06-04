import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface PropType {
  tests: { result: string; date: number }[];
}

const HoverTable = ({ tests }: PropType) => {
  return (
    <div className="flex flex-col space-y-4">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Result</TableHead>
            <TableHead className="text-center">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.date + test.result}>
              <TableCell
                className={cn(
                  test.result === 'pass' ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {test.result}
              </TableCell>
              <TableCell>{new Date(test.date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HoverTable;

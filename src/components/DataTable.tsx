// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from '@/components/ui/hover-card';
// import { cn } from '@/lib/utils';
// import domo from 'ryuu.js';
// import HoverTable from './HoverTable';
// import { Datasets } from '@/lib/data-access/datasets/datasets-schema';
// import { TestResults } from '@/lib/data-access/testResults/test-results-schema';
// import { TestMapType } from '@/lib/data-access/testResults/use-test-results-query';

// interface PropTypes {
//   datasets: Datasets;
//   testResults: TestResults;
//   testMap: TestMapType;
// }

// export default function DataTable({
//   datasets,
//   testResults,
//   testMap,
// }: PropTypes) {
//   return (
//     <div className="h-full flex-1 flex-col space-y-8 p-8 max-w-3xl">
//       <div className="rounded-md border">
//         <Table className="m-auto  text-left">
//           <TableHeader className="[&_tr]:border-b">
//             <TableRow className="">
//               <TableHead className="w-60">Dataset</TableHead>
//               <TableHead>Dataset Name</TableHead>
//               <TableHead>Column</TableHead>
//               <TableHead>Test</TableHead>
//               <TableHead>Result</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Error</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {testResults.map((row) => {
//               const keyDates = Object.keys(
//                 testMap[row.DatasetID][row.ColumnName][row.TestName]
//               );
//               const numberValues = keyDates.map(Number);
//               const max = Math.max(...numberValues);
//               if (row.Date !== max) return '';
//               const hoverTestData = keyDates.map((keyDate) => {
//                 return {
//                   result:
//                     testMap[row.DatasetID][row.ColumnName][row.TestName][
//                       keyDate
//                     ],
//                   date: Number(keyDate),
//                 };
//               });
//               return (
//                 <TableRow
//                   key={row.DatasetID + row.ColumnName + row.TestName + row.Date}
//                 >
//                   <TableCell
//                     onClick={() => {
//                       domo.navigate(
//                         `/datasources/${row.DatasetID}/details/data/table`,
//                         true
//                       );
//                     }}
//                     className="font-medium cursor-pointer"
//                   >
//                     {datasets.get(row.DatasetID)?.Name}
//                   </TableCell>
//                   <TableCell>{row.DatasetName}</TableCell>
//                   <TableCell>{row.ColumnName}</TableCell>
//                   <TableCell>{row.TestName}</TableCell>
//                   <TableCell
//                     className={cn(
//                       row.Result === 'pass'
//                         ? 'text-emerald-500'
//                         : 'text-rose-500'
//                     )}
//                   >
//                     <HoverCard openDelay={200}>
//                       <HoverCardTrigger className="cursor-zoom-in">
//                         {row.Result}
//                       </HoverCardTrigger>
//                       <HoverCardContent className="w-80">
//                         <HoverTable tests={hoverTestData} />
//                       </HoverCardContent>
//                     </HoverCard>
//                   </TableCell>
//                   <TableCell>{new Date(row.Date).toLocaleString()}</TableCell>
//                   <TableCell>{row.Error}</TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

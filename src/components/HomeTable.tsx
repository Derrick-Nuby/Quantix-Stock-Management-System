// 'use client';

// import { useMemo } from 'react';
// import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
// import { useQuery } from '@tanstack/react-query';

// export default function HomeTable() {

//   const { data: insurances = [], isLoading, error } =
//     useQuery<Insurance[], Error>({
//       queryKey: ['insurances'],
//       queryFn: fetchInsurances,
//     });

//   const columns = useMemo<MRT_ColumnDef>(
//     () => [
//       {
//         accessorKey: 'insuranceName',
//         header: 'Insurance Name',
//       },
//       {
//         accessorKey: 'coverageDetails',
//         header: 'Coverage Details',
//       },
//       {
//         accessorKey: 'insuranceCompany',
//         header: 'Insurance Company',
//       }
//     ],
//     [],
//   );

//   const table = useMantineReactTable({
//     columns,
//     data: insurances,
//     state: {
//       isLoading,
//     },
//     mantineTableBodyCellProps: {
//       style: {
//         whiteSpace: 'normal',
//       },
//     }
//   });

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return <MantineReactTable table={table} />;
// }
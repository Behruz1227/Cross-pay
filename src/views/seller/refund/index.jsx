
// Chakra imports
import { Box, Button, Progress, SimpleGrid, Td, Tr } from "@chakra-ui/react";
// import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
// import CheckTable from "views/admin/dataTables/components/CheckTable";
// import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
// import {
//   columnsDataDevelopment,
//   columnsDataCheck,
//   columnsDataColumns,
// } from "views/admin/dataTables/variables/columnsData";
// import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
// import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
// import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import React from "react";

export default function SellerRefund() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {/* <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        /> */}
        <ComplexTable name="Refund" thead={['T/r', 'Name', 'Status', 'Date', 'Progress']}>
          <Tr>
          <Td>1</Td>
          {/* <Td>{(page * 10) + i + 1}</Td> */}
            <Td>John Doe</Td>
            <Td>Approved</Td>
            <Td>2024-08-21</Td>
            <Td>
              <Progress variant="table" colorScheme="brandScheme" h="8px" w="108px" value={70} />
            </Td>
          </Tr>
          {/* Add more rows as needed */}
        </ComplexTable>
      </SimpleGrid>
    </Box>
  );
}

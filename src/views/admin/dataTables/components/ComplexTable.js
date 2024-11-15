/* eslint-disable */
import {
  Box,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
// Custom components
import Card from 'components/card/Card';    


export default function ComplexTable({thead, children, name, buttonChild }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={"scroll"}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          {name}
        </Text>
        {buttonChild}
      </Flex>
      <Box>
        <Table width={"100%"} variant="striped" color="gray.500" mt="12px">
          <Thead>
            <Tr>
              {thead.length > 0 && thead.map((header, index) => (
                <Th
                  key={index}
                  pe="10px"
                  // width={"200px"}
                  borderColor={borderColor}
                >
                  <Flex
                    justifyContent="space-between"
                    align="center"
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color="gray.400"
                  >
                    {header}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody width={"100%"} overflowX={"auto"}>
            {children}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}

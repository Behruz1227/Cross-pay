import React, { useEffect, useState } from 'react';
import { Box, Select, SimpleGrid, Td, Text, Tr } from '@chakra-ui/react';
import ComplexTable from '../dataTables/components/ComplexTable';
import { globalGetFunction } from '../../../contexts/logic-function/globalFunktion';
import { requestGetAdmin } from '../../../contexts/api';
import { Pagination } from 'antd';
import { updateRequestStatus } from '../../../contexts/logic-function';
import { useTranslation } from 'react-i18next';
import { LanguageStore } from 'contexts/state-management/language/languageStore';

const Request = () => {
  const { t } = useTranslation();
  const { wordsListData } = LanguageStore();
  const [requestList, setRequestList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalElement, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);

  const thead = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.FULL_NAME || 'Ф.И.О',
    wordsListData?.PHONE_NUMBER || 'Телефон',
    wordsListData?.EXCEL_MFO || 'МФО',
    wordsListData?.ACCOUNT || 'Счет',
    wordsListData?.INN || 'ИНН',
    wordsListData?.STATUS || 'Статус',
    wordsListData?.ACTION || 'Действие',
  ];

  const getFunctionRequest = async () => {
    await globalGetFunction({
      url: requestGetAdmin,
      setData: setRequestList,
      setLoading,
      setTotalElements,
      page,
    });
  };

  useEffect(() => {
    getFunctionRequest();
  }, [page]); // Combined the two useEffect hooks

  const bgGenerator = (status) => {
    if (status === 'WAIT')
      return ['orange', wordsListData?.STATUS_WAIT || 'Ожидание'];
    else if (status === 'CONFIRMED')
      return ['green', wordsListData?.STATUS_CONFIRMED || 'Подтвержден'];
    else if (status === 'CANCEL')
      return ['red', wordsListData?.STATUS_CANCELED || 'Отменен'];
    else return ['gray', wordsListData?.UNKNOWN || 'Неизвестно']; // Default case
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <ComplexTable
          name={`${wordsListData?.REQUEST_TABLE_TITLE || 'Таблица запросов'}`}
          thead={thead}
        >
          {loading ? (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.LOADING || 'Загрузка...'}
              </Td>
            </Tr>
          ) : requestList &&
            requestList.object &&
            requestList.object.length > 0 ? (
            requestList.object.map((item, i) => (
              <Tr key={item?.id || i}>
                <Td>{page * 10 + i + 1}</Td>
                <Td minWidth={'250px'}>{item?.fullName || '-'}</Td>
                <Td minWidth={'250px'}>
                  {item?.phone
                    ? `+998 (${item?.phone.slice(3, 5)}) ${item?.phone.slice(
                        5,
                        8,
                      )} ${item?.phone.slice(8, 10)} ${item?.phone.slice(10)}`
                    : '-'}
                </Td>
                <Td minWidth={'250px'}>{item?.filialCode || '-'}</Td>
                <Td minWidth={'250px'}>{item?.account || '-'}</Td>
                <Td minWidth={'250px'}>{item?.inn || '-'}</Td>
                <Td alignSelf="flex-start">
                  <Text
                    background={'#ECEFF8'}
                    color={bgGenerator(item?.status)[0]}
                    py="10px"
                    fontWeight="700"
                    borderRadius="10px"
                    textAlign={'center'}
                    width={'130px'}
                  >
                    {bgGenerator(item?.status)[1]}
                  </Text>
                </Td>
                <Td>
                  <Select
                    placeholder={
                      item?.status === 'WAIT' ? bgGenerator('WAIT')[1] : ''
                    }
                    onChange={async (e) => {
                      await updateRequestStatus({
                        reqID: item.id,
                        status: e.target.value,
                        getFunction: getFunctionRequest,
                      });
                    }}
                    width={'150px'}
                    value={item?.status}
                  >
                    <option value="CANCEL">{bgGenerator('CANCEL')[1]}</option>
                    <option value="CONFIRMED">
                      {bgGenerator('CONFIRMED')[1]}
                    </option>
                    <option value="WAIT">{bgGenerator('WAIT')[1]}</option>{' '}
                    {/* Added WAIT option for completeness */}
                  </Select>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.PANEL_REQUEST || 'Заявка'}{' '}
                {wordsListData?.NOT_FOUND || 'не найдена'}
              </Td>
            </Tr>
          )}
        </ComplexTable>
        <Pagination
          showSizeChanger={false}
          responsive={true}
          current={page + 1} // Ant Design's Pagination is 1-based
          total={totalElement}
          onChange={(newPage) => setPage(newPage - 1)} // Convert to 0-based
        />
      </SimpleGrid>
    </Box>
  );
};

export default Request;

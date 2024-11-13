import {
  Box,
  SimpleGrid,
  Td,
  Tr,
  Text,
  Input,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Button, Pagination, Select } from 'antd';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { PaymentStore } from 'contexts/state-management/payment/paymentStore';
import { setConfig } from 'contexts/token';
import React, { useEffect, useState } from 'react';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import { useTranslation } from 'react-i18next';
import { order_stats } from 'contexts/api';
import { Option } from 'antd/es/mentions';
import { downloadFile } from 'contexts/logic-function/DownLoadFile';
import { download_file } from 'contexts/api';
import { download_interval } from 'contexts/api';
import { order_stats_seller_and_terminal } from 'contexts/api';
import { LanguageStore } from 'contexts/state-management/language/languageStore';

export default function OrderStats() {
  const {
    setPaymentData,
    paymentData,
    setPage,
    totalPage,
    page,
    setTotalPages,
  } = PaymentStore();
  const { wordsListData } = LanguageStore();
  const role = sessionStorage.getItem('ROLE');
  const [createLoading, setCreateLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mfo, setMfo] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [intervalData, setIntervalData] = useState(null);
  const [downloadInterval, setDownloadInterval] = useState('');
  const thead = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.EXCEL_MERCHANT || 'Торговец',
    wordsListData?.EXCEL_AMOUNT || 'Количество',
    wordsListData?.EXCEL_TERMINAL_NAME || 'Терминал',
    wordsListData?.EXCEL_MFO || 'МФО',
    // wordsListData?.INN || 'INN', //
    // wordsListData?.MERCHANT_ACCOUNT || 'Merchant accaount',
    // wordsListData?.CLIENT_ACCOUNT || 'Client accaount',
    wordsListData?.EXCEL_RATE || 'Курс',
    wordsListData?.EXCEL_CREATED_AT || 'Дата создания',
    wordsListData?.EXCEL_PAYMENT_DATE || 'Дата оплаты',
    wordsListData?.STATUS || 'Статус',
  ];
  useEffect(() => {
    setConfig();
    getFunction();
  }, []);

  useEffect(() => {
    globalGetFunction({
      url: `${download_interval}`,
      setData: setIntervalData,
    });
  }, []);

  useEffect(() => {
    globalGetFunction({
      url: `${
        role === 'ROLE_SELLER' || role === 'ROLE_TERMINAL'
          ? order_stats_seller_and_terminal
          : order_stats
      }${
        fullName || mfo || createdAt || paymentDate || status || amount
          ? '?'
          : ''
      }${fullName ? `fullName=${fullName}` : ''}${mfo ? `&mfo=${mfo}` : ''}${
        createdAt ? `&createdAt=${createdAt}` : ''
      }${paymentDate ? `&paymentDate=${paymentDate}` : ''}${
        status ? `&status=${status}` : ''
      }${amount ? `&amount=${amount}` : ''}`,
      setLoading: setCreateLoading,
      setData: setPaymentData,
      setTotalElements: setTotalPages,
      page: page,
    });
  }, [page, fullName, mfo, createdAt, paymentDate, status, amount]);
  const getFunction = () => {
    globalGetFunction({
      url: `${
        role === 'ROLE_SELLER' || role === 'ROLE_TERMINAL'
          ? order_stats_seller_and_terminal
          : order_stats
      }`,
      setLoading: setCreateLoading,
      setData: setPaymentData,
      setTotalElements: setTotalPages,
      page: page,
    });
  };

  const handleDownloadFile = () => {
    downloadFile(`${download_file}?page=${downloadInterval}`);
  };

  // console.log(downloadInterval);
  const onChange = (page) => setPage(page - 1);
  const bgGenerator = (status) => {
    if (status === 'WAIT')
      return ['orange', wordsListData?.STATUS_WAIT || 'Ожидание'];
    else if (status === 'COMPLETED')
      return ['green', wordsListData?.STATUS_CONFIRMED || 'Подтвержден'];
    else if (status === 'CANCEL')
      return ['red', wordsListData?.STATUS_CANCEL || 'Отменен'];
    else if (status === 'NEW')
      return ['blue', wordsListData?.STATUS_NEW || 'Новый'];
    else return ['gray', wordsListData?.UNKNOWN || 'Неизвестно'];
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <ComplexTable
          name={
            <div>
              {wordsListData?.PAYMENT_STATS_TABLE || 'График отчета о платежах'}
              <Flex gap={5} mt={5}>
                {role !== 'ROLE_SELLER' && role !== 'ROLE_TERMINAL' && (
                  <Box>
                    <Text fontSize="15px">
                      {wordsListData?.EXCEL_MERCHANT || 'Торговец'}
                    </Text>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={wordsListData?.EXCEL_MERCHANT || 'Торговец'}
                    />
                  </Box>
                )}
                {role !== 'ROLE_TERMINAL' && (
                  <Box>
                    <Text fontSize="15px">
                      {wordsListData?.EXCEL_MFO || 'МФО'}
                    </Text>
                    <Input
                      type="text"
                      value={mfo}
                      onChange={(e) => setMfo(e.target.value)}
                      placeholder={wordsListData?.EXCEL_MFO || 'МФО'}
                    />
                  </Box>
                )}
                <Box>
                  <Text fontSize="15px">
                    {wordsListData?.EXCEL_CREATED_AT || 'Дата создания'}
                  </Text>
                  <Input
                    type="date"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    placeholder={
                      wordsListData?.EXCEL_CREATED_AT || 'Дата создания'
                    }
                  />
                </Box>
                <Box>
                  <Text fontSize="15px">
                    {wordsListData?.STATUS || 'Статус'}
                  </Text>
                  <Select
                    value={status}
                    style={{ width: '100%', height: '40px' }}
                    onChange={(value) => setStatus(value)}
                    placeholder={wordsListData?.STATUS || 'Статус'}
                  >
                    <Option value="">{wordsListData?.ALL || 'Все'}</Option>
                    <Option value="WAIT">
                      {wordsListData?.STATUS_WAIT || 'Ожидание'}
                    </Option>
                    <Option value="COMPLETED">
                      {wordsListData?.STATUS_CONFIRMED || 'Подтвержден'}
                    </Option>
                    <Option value="CANCEL">
                      {wordsListData?.STATUS_CANCELED || 'Отменен'}
                    </Option>
                  </Select>
                </Box>
                <Box>
                  <Text fontSize="15px">
                    {wordsListData?.EXCEL_AMOUNT || 'Количество'}
                  </Text>
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={wordsListData?.EXCEL_AMOUNT || 'Количество'}
                  />
                </Box>
                <Button
                  style={{ height: '40px', marginTop: '22px' }}
                  onClick={() => {
                    setFullName('');
                    setMfo('');
                    setCreatedAt('');
                    setPaymentDate('');
                    setStatus('');
                    setAmount('');
                  }}
                >
                  {wordsListData?.RESET || 'Сбросить'}
                </Button>
              </Flex>
            </div>
          }
          thead={thead}
        >
          {createLoading ? (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.LOADING || 'Загрузка...'}
              </Td>
            </Tr>
          ) : paymentData && paymentData?.object ? (
            paymentData.object.map((item, i) => (
              <Tr key={i}>
                <Td>{page * 10 + i + 1}</Td>
                <Td minWidth={'250px'}>
                  {item.merchant ? item.merchant : '-'}
                </Td>
                {/* <Td>{item.terminalName ? item.terminalName : "-"}</Td> */}
                <Td minWidth={'250px'}>
                  {item.amount
                    ? `${item.amount.toLocaleString('uz-UZ', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '-'}
                </Td>
                <Td minWidth={'250px'}>
                  {item.terminalName ? item.terminalName : '-'}
                </Td>
                <Td minWidth={'250px'}>
                  {item.filial_code ? item.filial_code : '-'}
                </Td>
                {/* <Td minWidth={'250px'}>{item.inn ? item.inn : '-'}</Td>
                <Td minWidth={'250px'}>
                  {item.toAccount ? item.toAccount : '-'}
                </Td>
                <Td minWidth={'250px'}>
                  {item.fromAccount ? item.filial_code : '-'}
                </Td> */}

                <Td>{item.rate ? item.rate : '-'}</Td>
                <Td minWidth={'250px'}>{item.createdAt || '-'}</Td>
                <Td minWidth={'250px'}>{item.paymentDate || '-'}</Td>
                <Td alignSelf="flex-start">
                  <Text
                    background={'#ECEFF8'}
                    color={bgGenerator(item.status)[0]}
                    py="10px"
                    fontWeight="700"
                    borderRadius="10px"
                    textAlign={'center'}
                    width={'130px'}
                  >
                    {item?.status ? bgGenerator(item?.status)[1] : ''}
                  </Text>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign={'center'} colSpan={9}>
                {wordsListData?.PANEL_PAYMENT_STATS || 'Отчеты о платежах'}
                {wordsListData?.NOT_FOUND || 'Не найдено'}
              </Td>
            </Tr>
          )}
        </ComplexTable>
      </SimpleGrid>
      <Flex alignItems={'center'} w={'full'} justifyContent="space-between">
        {paymentData && paymentData?.object && (
          <Pagination
            showSizeChanger={false}
            responsive={true}
            defaultCurrent={1}
            total={totalPage}
            onChange={onChange}
          />
        )}
        <Flex my={5} gap={5}>
          <Select
            placeholder={wordsListData?.INTERVAL || 'Интервал'}
            onChange={(value) => {
              setDownloadInterval(value);
            }}
            style={{ width: '200px', height: '40px' }}
          >
            <Option disabled value="">
              {wordsListData?.INTERVAL || 'Интервал'}
            </Option>
            {intervalData &&
              intervalData?.map((item) => (
                <Option key={item.page} value={item.page}>
                  {item.interval}
                </Option>
              ))}
          </Select>
          <Button
            style={{
              height: '40px',
              width: '130px',
              border: '1px solid #422AFB',
              borderRadius: '10px',
              background: '#422AFB',
              color: 'white',
            }}
            disabled={!downloadInterval}
            onClick={() => {
              handleDownloadFile();
              // setDownloadInterval('');
            }}
          >
            {wordsListData?.DOWNLOAD_FILE || 'Скачать файл'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

import {
  Box,
  Icon,
  SimpleGrid,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import IconBox from 'components/icons/IconBox';
import {
  get_payment_statistic_forSeller,
  get_admin_request_web,
  get_seller_statistic,
  get_year,
  get_admin_statistic,
} from 'contexts/api';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { DashboardStore } from 'contexts/state-management/dashboard/dashboardStore';
import { setConfig } from 'contexts/token';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCalculator } from 'react-icons/bs';
import { FaUsers, FaRegMoneyBillAlt } from 'react-icons/fa';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { PiUserListDuotone } from 'react-icons/pi';
import { MdAttachMoney } from 'react-icons/md';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import ComplexTable from '../dataTables/components/ComplexTable';
import { words_get_data } from 'contexts/api';
import { words_get_language } from 'contexts/api';
import io from 'socket.io-client';
import { SocketStore } from 'contexts/state-management/socket/socketStore';
import { consoleClear } from 'contexts/toast-message';

const socket = io('https://my.qrpay.uz', {
    transports: ['websocket'], // Faqat WebSocket transportini ishlatish
    secure: true
});

socket.on('connect', () => {
    console.log('Socket.IO ulanish o‘rnatildi.');
});

socket.on('message', (data) => {
    console.log('Serverdan xabar:', data);
});

socket.on('disconnect', () => {
    console.log('Ulanish yopildi.');
});

socket.on('connect_error', (error) => {
    console.error('Ulanishda xatolik:', error);
});


export default function Dashboard() {
  const { wordsListData, setLanguageData, setWordsListData } = LanguageStore();
  const {
    setStatisticData,
    statisticData,
    setStatisticLoading,
    setYearData,
    WebRequestData,
    setWebRequestloading,
    WebRequestloading,
    setWebRequestData,
    PaymentData,
    setPaymentData,
  } = DashboardStore();

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const thead = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.FULL_NAME || 'Ф.И.О',
    wordsListData?.PHONE_NUMBER || 'Телефон',
    wordsListData?.EXCEL_MFO || 'МФО',
    wordsListData?.ACCOUNT || 'Счет',
    wordsListData?.INN || 'ИНН',
    wordsListData?.STATUS || 'Статус',
  ];
  const theadPayment = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.PARTNER || 'Партнер',
    wordsListData?.DATE || 'Дата',
    wordsListData?.EXCEL_AMOUNT || 'Количество',
    wordsListData?.STATUS || 'Статус',
  ];

  const role = sessionStorage.getItem('ROLE');

  useEffect(() => {
    const getWords = () => {
      globalGetFunction({
        url: `${words_get_data}WEB`,
        setData: setWordsListData,
      });
      globalGetFunction({
        url: `${words_get_language}WEB`,
        setData: setLanguageData,
      });
    };
    getWords();
  }, []);

  const getStatistcs = () => {
    globalGetFunction({
      url:
        role === 'ROLE_SUPER_ADMIN'
          ? get_admin_statistic
          : role === 'ROLE_SELLER'
          ? get_seller_statistic
          : '',
      setLoading: setStatisticLoading,
      setData: setStatisticData,
    });
    globalGetFunction({
      url: get_year,
      setData: setYearData,
    });
    if (role === 'ROLE_SUPER_ADMIN') {
      globalGetFunction({
        url: get_admin_request_web,
        setLoading: setWebRequestloading,
        setData: setWebRequestData,
      });
    } else if (role === 'ROLE_SELLER') {
      globalGetFunction({
        url: get_payment_statistic_forSeller,
        setLoading: setWebRequestloading,
        setData: setPaymentData,
      });
    }
  };

  useEffect(() => {
    setConfig();
    getStatistcs();
  }, []);

  const bgGenerator = (status) => {
    if (status === 'WAIT')
      return ['orange', wordsListData?.STATUS_WAIT || 'Ожидание'];
    else if (status === 'COMPLATED')
      return ['green', wordsListData?.STATUS_CONFIRMED || 'Подтвержден'];
    else if (status === 'CANCEL')
      return ['red', wordsListData?.STATUS_CANCELED || 'Отменен'];
    else if (status === 'NEW')
      return ['blue', wordsListData?.STATUS_NEW || 'Новый'];
    else if (status === 'RETURNED')
      return ['purple', wordsListData?.STATUS_RETURNED || 'Возврат'];
    else return ['gray', wordsListData?.STATUS_UNKNOWN || 'Неизвестно']; // Default case
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, '2xl': 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={BsCalculator}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${wordsListData?.TERMINALS || 'Терминалы'}`}
            value={statisticData?.terminalCount || '0'}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={FaUsers} color={brandColor} />
                }
              />
            }
            name={`${
              wordsListData?.TERMINAL_USERS_COUNT ||
              'Количество пользователей терминала'
            }`}
            value={statisticData?.userCount || '0'}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={FaMoneyBillTransfer}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${
              wordsListData?.COMPLETED_TRANSACTIONS || 'Выполненные транзакции'
            }`}
            value={statisticData?.completedCount || '0'}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={FaRegMoneyBillAlt}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${
              wordsListData?.WAIT_TRANSACTIONS || 'Ожидающие транзакции'
            }`}
            value={statisticData?.waitCount || '0'}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={FaRegMoneyBillAlt}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${
              wordsListData?.CANCEL_TRANSACTIONS || 'Отмененные транзакции'
            }`}
            value={statisticData?.cancelCount || '0'}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${wordsListData?.COMPLETED_BALANCE || 'Выполненный баланс'}`}
            value={`${
              statisticData?.balanceCompleted
                ? statisticData.balanceCompleted.toLocaleString('uz-UZ', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '0'
            } UZS`}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${wordsListData?.WAIT_BALANCE || 'Ожидающий баланс'}`}
            value={`${
              statisticData?.balanceWait
                ? statisticData.balanceWait.toLocaleString('uz-UZ', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '0'
            } UZS`}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name={`${wordsListData?.CANCEL_BALANCE || 'Отмененный баланс'}`}
            value={`${
              statisticData?.balanceCancel
                ? statisticData.balanceCancel.toLocaleString('uz-UZ', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '0'
            } UZS`}
          />

          {role === 'ROLE_SUPER_ADMIN' && (
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={PiUserListDuotone}
                      color={brandColor}
                    />
                  }
                />
              }
              name={`${wordsListData?.WAIT_REQUEST || 'Запросы на ожидание'}`}
              value={statisticData?.requestWaitCount || '0'}
            />
          )}
        </SimpleGrid>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} mb="20px">
        <TotalSpent />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1 }} gap="20px" mb="20px">
        <Box gridColumn={{ lg: 'span 3' }}>
          {role === 'ROLE_SUPER_ADMIN' ? (
            <ComplexTable
              name={`${wordsListData?.REQUEST_TABLE_TITLE || 'Запрос таблица'}`}
              thead={thead}
            >
              {WebRequestloading ? (
                <Tr>
                  <Td textAlign="center" colSpan={thead.length}>
                    Loading...
                  </Td>
                </Tr>
              ) : WebRequestData && WebRequestData.length > 0 ? (
                WebRequestData.map((item, i) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td minWidth={'250px'}>{item?.fullName || '-'}</Td>
                    <Td minWidth={'300px'}>
                      {item?.phone
                        ? `+998 (${item?.phone.slice(
                            3,
                            5,
                          )}) ${item?.phone.slice(5, 8)} ${item?.phone.slice(
                            8,
                            10,
                          )} ${item?.phone.slice(10)}`
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
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td textAlign="center" colSpan={thead.length}>
                    {wordsListData?.PANEL_REQUEST || 'Запрос'}{' '}
                    {wordsListData?.NOT_FOUND || 'не найден'}
                  </Td>
                </Tr>
              )}
            </ComplexTable>
          ) : (
            <ComplexTable
              name={`${wordsListData?.PAYMENT_TABLE_TITLE || 'Платеж таблица'}`}
              thead={theadPayment}
            >
              {WebRequestloading ? (
                <Tr>
                  <Td textAlign="center" colSpan={theadPayment.length}>
                    {wordsListData?.LOADING || 'Загрузка...'}
                  </Td>
                </Tr>
              ) : PaymentData && PaymentData.length > 0 ? (
                PaymentData.map((item, i) => (
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{item?.partner}</Td>
                    <Td>{item?.date}</Td>
                    <Td>{`${
                      item?.amount ? item?.amount.toFixed(2) : '0'
                    } UZS`}</Td>
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
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td textAlign="center" colSpan={theadPayment.length}>
                    {wordsListData?.PANEL_PAYMENT || 'Платеж'}{' '}
                    {wordsListData?.NOT_FOUND || 'не найден'}
                  </Td>
                </Tr>
              )}
            </ComplexTable>
          )}
        </Box>
        {/* <SimpleGrid columns={{ base: 1 }}>
                    <Box display={{ base: "none", lg: "block" }}>
                        <MiniCalendar h="100%" minW="100%" selectRange={false} />
                    </Box>
                </SimpleGrid> */}
      </SimpleGrid>
    </Box>
  );
}

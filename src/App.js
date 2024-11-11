import './assets/css/App.css';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import ClientLayout from './layouts/seller';
import TerminalLayout from './layouts/terminal';
import {
  Button,
  ChakraProvider,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useEffect, useState } from 'react';
import { setConfig } from './contexts/token';

import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { words_get_data } from 'contexts/api';
import { siteSecurity } from 'contexts/allRequest';
import { consoleClear } from 'contexts/toast-message';
import { PaymentStore } from 'contexts/state-management/payment/paymentStore';
import { SocketStore } from 'contexts/state-management/socket/socketStore';
import { globalPostFunction } from 'contexts/logic-function/globalFunktion';
import { terminal_order_get } from 'contexts/api';
import { admin_order_get } from 'contexts/api';
import { order_confirm } from 'contexts/api';
import { seller_order_get } from 'contexts/api';
import { order_cancel } from 'contexts/api';

export default function Main() {
  const { languageData, setWordsListData, wordsListData } = LanguageStore();
  const {
    setSocketLoading,
    socketLoading,
    setSocketModal,
    socketModal,
    socketModalData,
    timer,
    setTimer,
    setSocketModalData,
  } = SocketStore();
  const { page, setPaymentData, setTotalPages, size, setCreateLoading } =
    PaymentStore();
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tokens = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('ROLE');
  const tokenExpiry = sessionStorage.getItem('tokenExpiry');

  // useEffect(() => {
  //   siteSecurity();
  // }, []);

  useEffect(() => {
    if (socketModalData) {
      setSocketModal(true);
      setTimer(60); // 60 senlik sanashni o'qishni bosqichga olish
    }
  }, [socketModalData]);

  useEffect(() => {
    let interval = null;

    if (socketModal && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1); // Har soniyada sanashni kamaytirish
      }, 900);
    } else if (timer === 0) {
      setSocketModal(false); // Sanash tugagach modalni yopish
      setTimer(0);
      setSocketModalData(null);
      consoleClear();
    }

    return () => clearInterval(interval); // Komponent o'chirilganda intervalni to'xtatish
  }, [socketModal, timer]);

  useEffect(() => {
    // i18n.changeLanguage(languageData);
    if (languageData) {
      globalGetFunction({
        url: `${words_get_data}WEB`,
        setData: setWordsListData,
      });
    }
  }, [languageData]);

  useEffect(() => {
    if (!wordsListData) {
      globalGetFunction({
        url: `${words_get_data}WEB`,
        setData: setWordsListData,
      });
    }
  }, [wordsListData]);

  useEffect(() => {
    setConfig();
    const refresh = sessionStorage.getItem('refreshes');

    if (!tokens) {
      sessionStorage.removeItem('refreshes');
      if (!pathname?.startsWith('/auth')) navigate('/auth/sign-in');
    } else if (!refresh) sessionStorage.setItem('refreshes', 'true');
  }, [tokens, pathname, navigate]);

  useEffect(() => {
    setConfig();
    window.scrollTo(0, 0);

    if (pathname === '/') {
      if (role === 'ROLE_SUPER_ADMIN') {
        if (!tokens) navigate('/auth/sign-in');
        else navigate('/admin/dashboard');
      } else if (role === 'ROLE_SELLER') {
        if (!tokens) navigate('/auth/sign-in');
        else navigate('/seller/dashboard');
      } else if (role === 'ROLE_TERMINAL') {
        if (!tokens) navigate('/auth/sign-in');
        else navigate('/terminal/payment');
      }
    }

    if (tokens && tokenExpiry) {
      const now = new Date().getTime();
      if (now > parseInt(tokenExpiry)) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('ROLE');
      }
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('ROLE');
    }

    if (!tokens && !pathname.startsWith('/auth')) navigate('/auth/sign-in');
    if (!tokens && pathname.startsWith('/auth'))
      sessionStorage.removeItem('refreshes');
    setTimeout(() => {
      consoleClear();
    }, 10000);
  }, [pathname, tokens, navigate]);

  return (
    <ChakraProvider theme={currentTheme}>
      <Modal
        isOpen={socketModal}
        size={'xl'}
        // onClose={() => {
        //   setSocketModal(false);
        // }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={'flex'}
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            {wordsListData?.COMPLATE_PAYMENT || 'Завершить платеж'}
            <Text
              color={useColorModeValue('green', 'yellow')}
              fontSize={20}
              fontWeight={700}
            >
              {timer}
            </Text>
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Grid
              overflow={'hidden'}
              templateColumns={{
                base: 'repeat(1, 1fr)',
              }}
              gap={6}
              px={5}
            >
              <Flex
                width={'100%'}
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent={'space-between'}
                pe={5}
              >
                <Text fontSize={'17px'} fontWeight={'700'}>
                  {wordsListData?.SELLER_NAME || 'Название компании'}:{' '}
                </Text>
                <Text fontSize={'17px'}>
                  {socketModalData?.merchant ? socketModalData.merchant : '-'}
                </Text>
              </Flex>
              <Flex
                width={'100%'}
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent={'space-between'}
                pe={5}
              >
                <Text fontSize={'17px'} fontWeight={'700'}>
                  {wordsListData?.CLIENT || 'Клиент'}:{' '}
                </Text>
                <Text fontSize={'17px'}>
                  {socketModalData?.client ? socketModalData.client : '-'}
                </Text>
              </Flex>
              <Flex
                width={'100%'}
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent={'space-between'}
                pe={5}
              >
                <Text fontSize={'17px'} fontWeight={'700'}>
                  {wordsListData?.EXCEL_AMOUNT || 'Количество'}:{' '}
                </Text>
                <Text fontSize={'17px'}>
                  {socketModalData?.amount ? socketModalData.amount : '-'}
                </Text>
              </Flex>
            </Grid>
          </ModalBody>

          <ModalFooter
            display={'flex'}
            width={'100%'}
            justifyContent={'center'}
            gap={'10px'}
          >
            <Button
              bg={'red'}
              color={'white'}
              _hover={{ bg: 'red.600' }}
              _active={{
                bg: 'red.600',
                transform: 'scale(0.98)',
              }}
              mr={3}
              onClick={() => {
                globalPostFunction({
                  url: `${order_cancel}${
                    socketModalData && socketModalData.id
                      ? socketModalData.id
                      : 0
                  }`,
                  postData: {},
                  setLoading: setSocketLoading,
                  getFunction: () => {
                    globalGetFunction({
                      url:
                        role === 'ROLE_TERMINAL'
                          ? `${terminal_order_get}?page=${page}&size=${size}`
                          : role === 'ROLE_SELLER'
                          ? `${seller_order_get}?page=${page}&size=${size}`
                          : role === 'ROLE_SUPER_ADMIN'
                          ? `${admin_order_get}?page=${page}&size=${size}`
                          : '',
                      setLoading: setCreateLoading,
                      setData: setPaymentData,
                      setTotalElements: setTotalPages,
                    });
                    setSocketModal(false); // Sanash tugagach modalni yopish
                    setTimer(0);
                    setSocketModalData(null);
                  },
                });
                setInterval(() => {
                  setSocketModal(false); // Sanash tugagach modalni yopish
                  setTimer(0);
                  setSocketModalData(null);
                }, 2000);
              }}
            >
              {socketLoading
                ? wordsListData?.LOADING || 'Загрузка...'
                : wordsListData?.CANCEL_MODAL || 'Отмена платежа'}
            </Button>
            <Button
              bg={'blue'}
              color={'white'}
              _hover={{ bg: 'blue.700' }}
              _active={{
                bg: 'blue.700',
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                globalPostFunction({
                  url: `${order_confirm}${
                    socketModalData && socketModalData.id
                      ? socketModalData.id
                      : 0
                  }`,
                  postData: {},
                  setLoading: setSocketLoading,
                  getFunction: () => {
                    globalGetFunction({
                      url:
                        role === 'ROLE_TERMINAL'
                          ? `${terminal_order_get}?page=${page}&size=${size}`
                          : role === 'ROLE_SELLER'
                          ? `${seller_order_get}?page=${page}&size=${size}`
                          : role === 'ROLE_SUPER_ADMIN'
                          ? `${admin_order_get}?page=${page}&size=${size}`
                          : '',
                      setLoading: setCreateLoading,
                      setData: setPaymentData,
                      setTotalElements: setTotalPages,
                    });
                    setSocketModal(false); // Sanash tugagach modalni yopish
                    setTimer(0);
                    setSocketModalData(null);
                  },
                });
                setInterval(() => {
                  setSocketModal(false); // Sanash tugagach modalni yopish
                  setTimer(0);
                  setSocketModalData(null);
                }, 2000);
              }}
            >
              {socketLoading
                ? wordsListData?.LOADING || 'Загрузка...'
                : wordsListData?.CONFIRM_MODAL || 'Подтверждение платежа'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="seller/*"
          element={
            <ClientLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="terminal/*"
          element={
            <TerminalLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </ChakraProvider>
  );
}

import "./assets/css/App.css";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import ClientLayout from "./layouts/seller";
import TerminalLayout from "./layouts/terminal";
import {
  ChakraProvider,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import { useEffect, useRef, useState } from "react";
import { setConfig } from "./contexts/token";
import { io } from "socket.io-client";

import { LanguageStore } from "contexts/state-management/language/languageStore";
import { globalGetFunction } from "contexts/logic-function/globalFunktion";
import { words_get_data } from "contexts/api";
import { consoleClear } from "contexts/toast-message";
import { SocketStore } from "contexts/state-management/socket/socketStore";
import { globalPostFunction } from "contexts/logic-function/globalFunktion";
import { siteSecurity } from "contexts/allRequest";
import { set_socket } from "contexts/api";
import { words_get_language } from "contexts/api";

export default function Main() {
  const { languageData, setWordsListData, wordsListData, setLanguageData } = LanguageStore();
  const {
    setSocketModal,
    socketModal,
    socketModalData,
    timer,
    setTimer,
    setSocketModalData,
    socketData,
    setNotificationSocket,
    setSocketData,
  } = SocketStore();
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0); // Ulanish urinishlari
  const tokens = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("ROLE");
  const tokenExpiry = sessionStorage.getItem("tokenExpiry");

  // useEffect(() => {
  //   siteSecurity();
  // }, []);

  useEffect(() => {
    if (
      (socketData?.id || pathname.split("/")[2] === "dashboard") &&
      pathname.split("/")[2] === "sign-in"
    ) {
      globalPostFunction({
        url: `${set_socket}${socketData?.id}`,
        postData: {},
        isToast: false,
      });
    }
  }, [socketData?.id, pathname]);

  useEffect(() => {
    if (socketModalData) {
      setSocketModal(true);
      setTimer(10); // 10 senlik sanashni o'qishni bosqichga olish
    }
  }, [socketModalData]);

  const connectSocket = () => {
    if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN") {
      if (socketRef.current) {
        socketRef?.current?.disconnect(); // Eskisini uzib tashlaymiz
      }
      socketRef.current = io("https://my.qrpay.uz", {
        transports: ["websocket"], // Faqat WebSocket transportini ishlatish
        secure: true,
      });

      socketRef?.current.on("connect", () => {
        // console.log(
        //   "Connected to Socket.IO server ID: " + socketRef?.current?.id
        // );
        setSocketData(socketRef.current);
      });

      socketRef.current.on("notification", (data) => {
        // console.log("Notification data:", data);
        setNotificationSocket(data);
      });

      socketRef.current.on("callback-web-or-app", (data) => {
        // console.log("calback data:", data);
        setSocketModalData(data);
      });

      socketRef.current.on("test", (data) => {
        // console.log("Received data:", data);
        setSocketModalData(data);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setConnectionAttempts((prev) => prev + 1); // Ulanish urinishini oshiramiz
        setTimeout(() => {
          // console.log("Retrying to connect socket...");
          connectSocket(); // Qayta ulanish
        }, 5000);
      });
    }
  };

  useEffect(() => {
    if (pathname.split("/")[2] === "dashboard") connectSocket(); // Ilk bor socketni ulaymiz
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Unmount qilinganda socketni uzamiz
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (connectionAttempts < 5 && role !== "ROLE_SUPER_ADMIN") {
      if (socketRef.current && !socketRef.current.connected) {
        connectSocket(); // Agar socket ulanmagan bo'lsa, qayta ulash
      }
    }
  }, [socketRef]); // Sahifa va o'lcham o'zgarsa qayta ulanish

  // console.log("socketData", socketData);
  // console.log("socketData id", socketData?.id);
  // console.log("socketData connected", socketData?.connected);
  // console.log("socket2", socketData);

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
    if (
      languageData &&
      pathname.split("/")[2] !== "sign-in" &&
      pathname.split("/")[2] !== "check-code" &&
      pathname.split("/")[2] !== "sign-up"
    ) {
      globalGetFunction({
        url: `${words_get_data}WEB`,
        setData: setWordsListData,
      });
      globalGetFunction({
        url: `${words_get_language}WEB`,
        setData: setLanguageData,
      });
    }
  }, [languageData]);

  useEffect(() => {
    if (
      !wordsListData &&
      pathname.split("/")[2] !== "sign-in" &&
      pathname.split("/")[2] !== "check-code" &&
      pathname.split("/")[2] !== "sign-up"
    ) {
      globalGetFunction({
        url: `${words_get_data}WEB`,
        setData: setWordsListData,
      });
      globalGetFunction({
        url: `${words_get_language}WEB`,
        setData: setLanguageData,
      });
    }
  }, [wordsListData]);

  useEffect(() => {
    setConfig();
    const refresh = sessionStorage.getItem("refreshes");

    if (!tokens) {
      sessionStorage.removeItem("refreshes");
      if (!pathname?.startsWith("/auth")) navigate("/auth/sign-in");
    } else if (!refresh) sessionStorage.setItem("refreshes", "true");
  }, [tokens, pathname, navigate]);

  useEffect(() => {
    setConfig();
    window.scrollTo(0, 0);

    if (pathname === "/") {
      if (role === "ROLE_SUPER_ADMIN") {
        if (!tokens) navigate("/auth/sign-in");
        else navigate("/admin/dashboard");
      } else if (role === "ROLE_SELLER") {
        if (!tokens) navigate("/auth/sign-in");
        else navigate("/seller/dashboard");
      } else if (role === "ROLE_TERMINAL") {
        if (!tokens) navigate("/auth/sign-in");
        else navigate("/terminal/payment");
      } else if (role === "ROLE_BANK") {
        if (!tokens) navigate("/auth/sign-in");
        else navigate("/bank/dashboard");
      }
    }

    if (tokens && tokenExpiry) {
      const now = new Date().getTime();
      if (now > parseInt(tokenExpiry)) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("tokenExpiry");
        sessionStorage.removeItem("ROLE");
      }
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenExpiry");
      sessionStorage.removeItem("ROLE");
    }

    if (!tokens && !pathname.startsWith("/auth")) navigate("/auth/sign-in");
    if (!tokens && pathname.startsWith("/auth"))
      sessionStorage.removeItem("refreshes");
    setTimeout(() => {
      consoleClear();
    }, 10000);
  }, [pathname, tokens, navigate]);

  const bgGenerator = (status) => {
    if (status === "WAIT")
      return ["orange", wordsListData?.STATUS_WAIT || "Ожидание"];
    else if (status === "COMPLETED")
      return ["green", wordsListData?.STATUS_CONFIRMED || "Подтвержден"];
    else if (status === "CANCEL")
      return ["red", wordsListData?.STATUS_CANCELED || "Отменен"];
    else if (status === "NEW")
      return ["blue", wordsListData?.STATUS_NEW || "Новый"];
    else if (status === "RETURNED")
      return ["purple", wordsListData?.STATUS_RETURNED || "Возврат"];
    else return ["gray", wordsListData?.STATUS_UNKNOWN || "Неизвестно"];
  };

  return (
    <ChakraProvider theme={currentTheme}>
      <Modal
        // isOpen={true}
        isOpen={socketModal}
        size={"xl"}
        onClose={() => {
          setSocketModal(false);
          setTimer(0);
          setSocketModalData(null);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {wordsListData?.COMPLATE_PAYMENT || "Завершить платеж"}
            <Text
              me={10}
              color={useColorModeValue("green", "yellow")}
              fontSize={20}
              fontWeight={700}
            >
              {timer}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid
              overflow={"hidden"}
              templateColumns={{
                base: "repeat(1, 1fr)",
              }}
              gap={6}
              px={5}
            >
              <Flex
                width={"100%"}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent={"space-between"}
                pe={5}
              >
                <Text fontSize={"17px"} fontWeight={"700"}>
                  {wordsListData?.EXT_ID || "Внешний ID"}:{" "}
                </Text>
                <Text fontSize={"17px"}>
                  {socketModalData?.ext_id ? socketModalData.ext_id : "-"}
                </Text>
              </Flex>
              <Flex
                width={"100%"}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent={"space-between"}
                pe={5}
              >
                <Text fontSize={"17px"} fontWeight={"700"}>
                  {wordsListData?.CHEQUE_AMOUNT_UZS || "Сумма чека (uzs)"}:{" "}
                </Text>
                <Text fontSize={"17px"}>
                  {socketModalData?.amountUZS ? socketModalData.amountUZS : "-"}
                </Text>
              </Flex>
              <Flex
                width={"100%"}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent={"space-between"}
                pe={5}
              >
                <Text fontSize={"17px"} fontWeight={"700"}>
                  {wordsListData?.CHEQUE_AMOUNT_RUB || "Сумма чека (rub)"}:{" "}
                </Text>
                <Text fontSize={"17px"}>
                  {socketModalData?.amountRUB ? socketModalData.amountRUB : "-"}
                </Text>
              </Flex>
              <Flex
                width={"100%"}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent={"space-between"}
                pe={5}
              >
                <Text fontSize={"17px"} fontWeight={"700"}>
                  {wordsListData?.STATUS || "Статус"}:{" "}
                </Text>
                <Text
                  background={"#ECEFF8"}
                  color={bgGenerator(socketModalData?.status)[0]}
                  py="10px"
                  fontSize={"17px"}
                  fontWeight="700"
                  borderRadius="10px"
                  textAlign={"center"}
                  width={"130px"}
                >
                  {bgGenerator(socketModalData?.status)[1]}
                </Text>
              </Flex>
              <Flex
                width={"100%"}
                flexDirection={{ base: "column", md: "row" }}
                justifyContent={"space-between"}
                pe={5}
              >
                <Text fontSize={"17px"} fontWeight={"700"}>
                  {wordsListData?.DATE || "Дата"}:{" "}
                </Text>
                <Text fontSize={"17px"}>
                  {socketModalData?.created_at
                    ? socketModalData.created_at
                    : "-"}
                </Text>
              </Flex>
            </Grid>
          </ModalBody>

          {/* <ModalFooter
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
          </ModalFooter> */}
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

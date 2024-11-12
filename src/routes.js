import {Icon} from '@chakra-ui/react';
import {MdHome, MdLock, MdOutlineShoppingCart,} from 'react-icons/md';
import {TbCashRegister} from 'react-icons/tb';
import {IoLogoUsd, IoQrCode, IoStatsChart, IoTerminal} from 'react-icons/io5';
import {RiFileList3Line, RiRefund2Line} from 'react-icons/ri';
import {SiContactlesspayment} from "react-icons/si";
import {FaCodePullRequest} from "react-icons/fa6";
import AdminDashboard from 'views/admin/default';
import Partner from 'views/admin/partner';
import SignInCentered from 'views/auth/signIn';
import SellerTerminal from 'views/seller/terminal';
import SellerOrder from 'views/seller/order';
// import SellerRefund from 'views/seller/refund';
import Notification from 'views/notification/notification';
import Request from "./views/admin/request";
import SignUp from 'views/auth/signUp';
import UserTerminal from "./views/seller/users-terminal";
import {FaUsersCog} from "react-icons/fa";
import CheckCode from 'views/auth/signIn/checkCode';
import PrivacyTermsPage from 'views/shartlar/PrivacyTermsPage';
import WordsPage from 'views/admin/words';
import OrderStats from 'views/admin/orderStats';
import Rate from 'views/admin/rate/rate';

export const generateRoutes = (wordsListData) => [
    // Admin panel route
    {
        name: wordsListData?.PANEL_CONTROL || "Панель управления",
        layout: '/admin',
        path: '/dashboard',
        icon: <Icon as={MdHome} width="20px" height="20px" color="inherit"/>,
        component: <AdminDashboard/>,
    },
    {
        name: wordsListData?.MERCHANT || "Торговец",
        layout: '/admin',
        path: '/partner',
        icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit"/>,
        component: <Partner/>,
        secondary: true,
    },
    {
        name: wordsListData?.PANEL_TERMINAL || "Терминал",
        layout: '/admin',
        path: '/terminal',
        icon: <Icon as={IoTerminal} width="20px" height="20px" color="inherit"/>,
        component: <SellerTerminal/>,
    },
    {
        name: wordsListData?.PANEL_PAYMENT || "Оплата",
        layout: '/admin',
        icon: <Icon as={SiContactlesspayment} width="20px" height="20px" color="inherit"/>,
        path: '/payment',
        component: <SellerOrder/>,
    },
    {
        name: wordsListData?.PANEL_REQUEST || "Запросы",
        layout: '/admin',
        path: '/request',
        icon: <Icon as={FaCodePullRequest} width="20px" height="20px" color="inherit"/>,
        component: <Request/>,
    },
    {
        name: wordsListData?.PANEL_PAYMENT_STATS || "Отчет о платежах",
        layout: '/admin',
        path: '/statistic',
        icon: <Icon as={IoStatsChart} width="20px" height="20px" color="inherit"/>,
        component: <OrderStats/>,
    },

    {
        name: wordsListData?.PANEL_WORD || "Настройка слов",
        layout: '/admin',
        path: '/words',
        icon: <Icon as={RiFileList3Line} width="20px" height="20px" color="inherit"/>,
        component: <WordsPage/>,
    },
    // {
    //     name: wordsListData?.PANEL_RATE || "Настройка курс",
    //     layout: '/admin',
    //     path: '/rate',
    //     icon: <Icon as={IoLogoUsd} width="20px" height="20px" color="inherit"/>,
    //     component: <Rate/>,
    // }, 
    {
        name: '',
        layout: '/admin',
        path: '/notification',
        icon: <Icon as={RiRefund2Line} width="20px" height="20px" color="inherit"/>,
        component: <Notification/>, 
    },
    // Seller panel route
    {
        name: wordsListData?.PANEL_CONTROL || "Панель управления",
        layout: '/seller',
        path: '/dashboard',
        icon: <Icon as={MdHome} width="20px" height="20px" color="inherit"/>,
        component: <AdminDashboard/>,
    },
    {
        name: wordsListData?.PANEL_TERMINAL || "Терминалы",
        layout: '/seller',
        path: '/terminal',
        icon: <Icon as={TbCashRegister} width="20px" height="20px" color="inherit"/>,
        component: <SellerTerminal/>,
    },
    {
        name: wordsListData?.TERMINAL_USERS_TABLE || "Пользователи терминалов",//
        layout: '/seller',
        path: '/users-terminal',
        icon: <Icon as={FaUsersCog} width="20px" height="20px" color="inherit"/>,
        component: <UserTerminal/>,
    },
    {
        name: wordsListData?.PANEL_PAYMENT || "Оплата",
        layout: '/seller',
        path: '/payment',
        icon: <Icon as={IoQrCode} width="20px" height="20px" color="inherit"/>,
        component: <SellerOrder/>,
    },
    {
        name: wordsListData?.PANEL_PAYMENT_STATS || "Отчет о платежах",//
        layout: '/seller',
        path: '/statistic',
        icon: <Icon as={IoStatsChart} width="20px" height="20px" color="inherit"/>,
        component: <OrderStats/>,
    },
    // {
    //     name: t('PANEL_REFUND'),
    //     layout: '/seller',
    //     path: '/refund',
    //     icon: <Icon as={RiRefund2Line} width="20px" height="20px" color="inherit"/>,
    //     component: <SellerRefund/>,
    // },
    {
        name: '',
        layout: '/seller',
        path: '/notification',
        icon: <Icon as={RiRefund2Line} width="20px" height="20px" color="inherit"/>,
        component: <Notification/>,
    },
    // Terminal panel route
    {
        name: wordsListData?.PANEL_PAYMENT || "Оплата",
        layout: '/terminal',
        path: '/payment',
        icon: <Icon as={RiRefund2Line} width="20px" height="20px" color="inherit"/>,
        component: <SellerOrder/>,
    },
    {
        name: wordsListData?.PANEL_PAYMENT_STATS || "Отчет о платежах",//
        layout: '/terminal',
        path: '/statistic',
        icon: <Icon as={IoStatsChart} width="20px" height="20px" color="inherit"/>,
        component: <OrderStats/>,
    },
    {
        name: '',
        layout: '/terminal',
        path: '/notification',
        icon: <Icon as={RiRefund2Line} width="20px" height="20px" color="inherit"/>,
        component: <Notification/>,
    },
    {
        name: wordsListData?.SIGN_IN || "Вход",//
        layout: '/auth',
        path: '/sign-in',
        icon: <Icon as={MdLock} width="20px" height="20px" color="inherit"/>,
        component: <SignInCentered/>,
    },
    {
        name: wordsListData?.CHECK_CODE || "Проверка кода",//
        layout: '/auth',
        path: '/check-code',
        icon: <Icon as={MdLock} width="20px" height="20px" color="inherit"/>,
        component: <CheckCode/>,
    },
    {
        name: wordsListData?.PRIVACY_POLICY || "Политика конфиденциальности",//
        layout: '/auth',
        path: '/privacy-policy',
        icon: <Icon as={MdLock} width="20px" height="20px" color="inherit"/>,
        component: <PrivacyTermsPage />,
    },
    {
        name: wordsListData?.SIGN_UP || "Регистрация",//
        layout: '/auth',
        path: '/sign-up',
        icon: <Icon as={MdLock} width="20px" height="20px" color="inherit"/>,
        component: <SignUp/>,
    },
];

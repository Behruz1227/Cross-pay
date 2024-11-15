import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  // Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth.png';
// import { FcGoogle } from "react-icons/fc";
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  admin_notification_count,
  seller_notification_count,
  terminal_notification_count,
  user_login,
  user_sendCode,
} from '../../../contexts/api';
import { consoleClear, toastMessage } from '../../../contexts/toast-message';
import { useNavigate } from 'react-router-dom';
import { userGetMe } from 'contexts/logic-function/globalFunktion';
import { AppStore } from 'contexts/state-management';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { NotificationStore } from 'contexts/state-management/notification/notificationStore';
import { useTranslation } from 'react-i18next';
// import { toastMessage } from "contexts/toast-message";

const defVal = { phone: '', password: '' };

function CheckCode() {
  const navigate = useNavigate();
  const { setCountData } = NotificationStore();
  const { setGetMeeData, phonenumber } = AppStore();
  const [auth, setAuth] = useState({ phone: '', password: '' });
  const [roles, setRoles] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const { t } = useTranslation();

  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');

  useEffect(() => {
    if (roles === 'ROLE_SUPER_ADMIN') {
      toast.success('Вы успешно вошли в систему');
      navigate('/admin/dashboard');
      sessionStorage.setItem('pathname', 'Dashboard');
      setAuth(defVal);
    } else if (roles === 'ROLE_SELLER') {
      toast.success('Вы успешно вошли в систему');
      navigate('/seller/dashboard');
      sessionStorage.setItem('pathname', 'Dashboard');
      setAuth(defVal);
    } else if (roles === 'ROLE_TERMINAL') {
      toast.success('Вы успешно вошли в систему');
      navigate('/terminal/payment');
      sessionStorage.setItem('pathname', 'Terminal dashboard');
      setAuth(defVal);
    }
  }, [roles]);

  const authLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(user_login, {
        phone: `${phonenumber.slice(1)}`,
        code: auth.password.replace(/\D/g, ''),
      });
      if (data?.error?.code) {
        setLoading(false);
        toastMessage(data.error.code);
        consoleClear();
      } else {
        setLoading(false);
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        sessionStorage.setItem('tokenExpiry', expiryTime.toString());
        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('ROLE', data.data.role);
        setRoles(data.data.role);
        await userGetMe({ setData: setGetMeeData, token: data.data.token });
        await globalGetFunction({
          url:
            data.data.role === 'ROLE_TERMINAL'
              ? terminal_notification_count
              : data.data.role === 'ROLE_SELLER'
              ? seller_notification_count
              : data.data.role === 'ROLE_SUPER_ADMIN'
              ? admin_notification_count
              : '',
          setData: setCountData,
          token: data.data.token,
        });
        consoleClear();
      }
    } catch (err) {
      setLoading(false);
      consoleClear();
    }
  };

  const reSend = async () => {
    toast.success('Код отправлен повторно!');
    setLoading(true);
    try {
      const { data } = await axios.post(user_sendCode, {
        phone: `${phonenumber.slice(1)}`,
      });
      if (data?.error?.code) {
        setLoading(false);
        toastMessage(data.error.code);
        consoleClear();
      } else {
        setLoading(false);

        consoleClear();
      }
    } catch (err) {
      setLoading(false);
      consoleClear();
    }
  };

  const handleAuth = (name, val) => {
    let cleanedValue = val.replace(/\D/g, '');

    if (cleanedValue.length > 4) {
      cleanedValue = cleanedValue.slice(0, 4);
    }

    const formattedValue = cleanedValue.split('').join(' ');

    setAuth({
      ...auth,
      [name]: formattedValue,
    });
  };

  function checkKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.querySelector('button[type="submit"]').click();
    }
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            {'Вход'}
          </Heading>
          <Text
            mb="10px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            {'Код'}
            {` +${phonenumber.slice(1)}`}
            {' отправлен на номер.'}
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '500px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <Flex align="center" mb="30px">
            <HSeparator />

            <HSeparator />
          </Flex>
          <FormControl>
            {/* <FormLabel
                            display='flex'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            mb='8px'>
                            {t('enterYourPhoneNumber')}<Text color={brandStars}>*</Text>
                        </FormLabel> */}
            {/* <InputGroup display={"flex"} alignItems={"center"}>

                            <Input
                                isRequired={true}
                                variant='auth'
                                fontSize='sm'
                                ms={{ base: "0px", md: "0px" }}
                                type='number'
                                placeholder='-- --- -- --'
                                mb='24px'
                                fontWeight='500'
                                size='lg'
                                value={auth.phone}
                                onKeyDown={checkKeyPress}
                                onChange={e => handleAuth('phone', e.target.value)}
                            /> */}






            {/* </InputGroup> */}
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              {'Введите код'}
              <Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder={'- - - -'}
                mb="24px"
                size="lg"
                variant="auth"
                onKeyDown={checkKeyPress}
                value={auth.password}
                onChange={(e) => handleAuth('password', e.target.value)}
              />
            </InputGroup>

            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              onClick={async () => {
                if (auth.password) await authLogin();
                else toast.error('Проверьте правильность данных');
              }}
            >
              {loading ? `загрузка...` : `Войти`}
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              {'Не получили код?'}
              <NavLink
                onClick={() => {
                  reSend();
                }}
              >
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  {'Отправить код повторно'}
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default CheckCode;

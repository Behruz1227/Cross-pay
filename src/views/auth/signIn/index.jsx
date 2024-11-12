import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  // Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
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
import { checkPhoneUrl, user_sendCode } from '../../../contexts/api';
import { consoleClear, toastMessage } from '../../../contexts/toast-message';
import { useNavigate } from 'react-router-dom';
import { AppStore } from 'contexts/state-management';
import { PhoneInput } from 'react-international-phone';
import _ from 'lodash';

function SignIn() {
  const navigate = useNavigate();
  const { setPhonenumber, phonenumber } = AppStore();
  const [policy, setPolicy] = useState(false);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');


  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');

  // console.log(phonenumber.slice(1));

  const authLogin = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post(user_sendCode, {
          phone: `${phonenumber.slice(1)}`,
        });
        if (data?.error?.code) {
          setLoading(false);
          toastMessage(data.error.code);
          consoleClear()
        } else {
          setLoading(false);
          navigate('/auth/check-code');
          consoleClear()
        }
      } catch (err) {
        consoleClear()
        toast.error('Ошибка при отправке кода');
        setLoading(false);
      }
};

function checkKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('button[type="submit"]').click();
  }
}

useEffect(() => {
  console.log(phonenumber.slice(1));
  if (phonenumber.slice(1).length === 12) {
    setLoading(true)
    _.delay(() => {
      try {
        axios.post(`${checkPhoneUrl}${phonenumber.slice(1)}`, {})
          .then(response => {
            if (response?.error?.code) {
              setShowPassword(true)
              setLoading(false)
            } else {
              setShowPassword(response?.data?.data)
              setLoading(false)
              consoleClear()
            }
          })
          .catch(() => {
            setLoading(false)
            setShowPassword(true)
          })
      } catch (err) {
        consoleClear()
        setLoading(false)
        setShowPassword(true)
      }
    }, 2000);
  }
}, [phonenumber])

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
          {
            'Введите свой номер телефона для входа, и вам будет отправлен SMS-код.'
          }
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
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
          >
            {'Введите номер телефона'} <Text color={brandStars}>*</Text>
          </FormLabel>
          <PhoneInput
            required
            defaultCountry="uz"
            value={phonenumber}
            onChange={(phone) => setPhonenumber(phone)}
            onKeyDown={checkKeyPress}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '16px',
              border: '1px solid #E0E5F2',
              fontSize: '16px',
              padding: '0 15px',
              display: 'flex',
              alignItems: 'center',
              color: textColor
            }}
            inputStyle={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              color: textColor
            }}
            inputClass="phone-input"
            containerClass="phone-input-container"
            textClass="phone-input-text"
          />
          {/* {
              showPassword &&
              <>
                <FormLabel
                  ms='4px'
                  fontSize='sm'
                  fontWeight='500'
                  color={textColor}
                  display='flex'>
                  {"Введите код"}<Text color={brandStars}>*</Text>
                </FormLabel>
                <InputGroup size='md'>
                  <Input
                    isRequired={true}
                    fontSize='sm'
                    placeholder={"-- --"}
                    mb='24px'
                    size='lg'
                    variant='auth'
                    onKeyDown={checkKeyPress}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </>
            } */}
          {/* <InputGroup display={'flex'} alignItems={'center'}>
              <InputLeftElement mt={1}>
                <Text fontSize="sm" fontWeight="500">
                  +998
                </Text>
              </InputLeftElement>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                placeholder="-- --- -- --"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={phonenumber}
                onKeyDown={checkKeyPress}
                onChange={(e) => {
                  const input = e.target.value;
                  const numbers = input.replace(/[^\d]/g, '').slice(0, 9);
                  setRawPhoneNumber(numbers);
                }}
              />
            </InputGroup> */}
          <Flex
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            gap={3}
            mb="20px"
          >
            <Checkbox
              value={policy}
              onChange={(e) => {
                setPolicy(e.target.checked);
              }}
              border={'#000'}
            />
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              {'Авторизуясь, вы соглашаетесь с '}
              <NavLink to="/auth/privacy-policy">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  {'Условиями использования и Политикой конфиденциальности.а'}
                </Text>
              </NavLink>{' '}
            </Text>
          </Flex>
          <NavLink
            onClick={() => {
              if (policy) {
                if (phonenumber.slice(1).length === 12)
                  if (!showPassword) authLogin();
                  else navigate("/auth/check-password")
                else toast.error('Проверьте правильность данных');
              } else {
                toast.error(
                  'Вы еще не согласились с Условиями использования и Политикой конфиденциальности.',
                );
              }
            }}
            to={(showPassword && policy) && '/auth/check-password'}
          >
            <Button
              disabled={!policy}
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
            >
              {loading ? 'Загрузка...' : showPassword ? "Продолжить" : 'Отправить СМС-код'}
            </Button>
          </NavLink>
        </FormControl>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          maxW="100%"
          mt="0px"
        >
          <Text color={textColorDetails} fontWeight="400" fontSize="14px">
            {'Вы еще не зарегистрированы?'}
            <NavLink to="/auth/sign-up">
              <Text
                color={textColorBrand}
                as="span"
                ms="5px"
                fontWeight="500"
              >
                {'Оставьте заявку на регистрацию.'}
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  </DefaultAuth>
);
}

export default SignIn;

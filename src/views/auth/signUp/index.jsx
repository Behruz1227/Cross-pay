import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
// Custom components
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import axios from 'axios';
import { user_request } from '../../../contexts/api';
import { toastMessage } from '../../../contexts/toast-message';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from 'react-international-phone';

function SignUp() {
  const [auth, setAuth] = useState({
    fullName: '',
    phone: '',
    filialCode: '',
    inn: '',
    account: '',
  });
  const [errors, setErrors] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');

  const authLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const { data } = await axios.post(user_request, {
          fullName: auth.fullName,
          phone: `${auth.phone.slice(1)}`,
          filialCode: auth.filialCode,
          inn: auth.inn,
          account: auth.account,
        });
        setLoading(false);
        if (data?.error?.code) {
          toastMessage(data.error.code);
        } else {
          setAuth({
            fullName: '',
            phone: '',
            filialCode: '',
            inn: '',
            account: '',
          });
          onOpen();
        }
      } catch (err) {
        setLoading(false);
      }
    }
  };

  const handleAuth = (name, val) => {
    setAuth({
      ...auth,
      [name]: val,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!auth.fullName.trim())
      newErrors.fullName = 'Пожалуйста, введите полное имя.';
    if (!auth.phone.trim())
      newErrors.phone = 'Пожалуйста, введите номер телефона.';
    else if (auth.phone.slice(1).length < 12)
      newErrors.phone = 'Номер телефона должен содержать 9 цифр.';
    if (!auth.filialCode.trim())
      newErrors.filialCode = 'Пожалуйста, введите МФО';
    else if (auth.filialCode.length < 8)
      newErrors.filialCode = 'МФО должен быть больше 8 цифр';
    if (!auth.inn.trim()) newErrors.inn = 'Пожалуйста, введите ИНН.';
    else if (auth.inn.length < 8)
      newErrors.inn = 'ИНН должен быть больше 8 цифр';
    if (!auth.account.trim())
      newErrors.account = 'Пожалуйста, введите номер счета.';
    else if (auth.account.length < 20)
      newErrors.account = 'Пусть число больше 20 цифр';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            Оставьте заявку
          </Heading>
          <Text
            mb="10px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Администратор свяжется с вами после проверки ваших данных.
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '700px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <FormControl>
            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              gap={{ base: 0, md: 6 }}
            >
              <GridItem>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Имя фамилия<Text color={brandStars}>*</Text>
                </FormLabel>

                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder={'Введите ваше полное имя'}
                  mb="24px"
                  size="lg"
                  onKeyDown={checkKeyPress}
                  value={auth.fullName}
                  onChange={(e) => handleAuth('fullName', e.target.value)}
                />
                {errors.fullName && (
                  <Text color="red.500" fontSize="xs">
                    {errors.fullName}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Номер телефона<Text color={brandStars}>*</Text>
                </FormLabel>
                <PhoneInput
                  required
                  defaultCountry="uz"
                  value={auth.phone}
                  onChange={(phone) => handleAuth('phone', phone)}
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
                    color: textColor,
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    color: textColor,
                  }}
                  inputClass="phone-input"
                  containerClass="phone-input-container"
                  textClass="phone-input-text"
                />
                {errors.phone && (
                  <Text color="red.500" fontSize="xs">
                    {errors.phone}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  МФО<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  fontSize="sm"
                  ms={{ base: '0px', md: '0px' }}
                  placeholder={'Введите ваш МФО'}
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  value={auth.filialCode}
                  onKeyDown={checkKeyPress}
                  onChange={(e) => handleAuth('filialCode', e.target.value)}
                />
                {errors.filialCode && (
                  <Text color="red.500" fontSize="xs">
                    {errors.filialCode}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  ИНН<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  fontSize="sm"
                  ms={{ base: '0px', md: '0px' }}
                  placeholder={'Введите ваш ИНН'}
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  value={auth.inn}
                  onKeyDown={checkKeyPress}
                  onChange={(e) => handleAuth('inn', e.target.value)}
                />
                {errors.inn && (
                  <Text color="red.500" fontSize="xs">
                    {errors.inn}
                  </Text>
                )}
              </GridItem>

              <GridItem>
                <FormLabel
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  display="flex"
                >
                  Банковский счет<Text color={brandStars}>*</Text>
                </FormLabel>

                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder={'Введите свой счет'}
                  mb="24px"
                  size="lg"
                  onKeyDown={checkKeyPress}
                  value={auth.account}
                  onChange={(e) => handleAuth('account', e.target.value)}
                />
                {errors.account && (
                  <Text color="red.500" fontSize="xs">
                    {errors.account}
                  </Text>
                )}
              </GridItem>
            </Grid>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColorDetails} fontWeight="400" fontSize="14px">
                У меня уже есть аккаунт.
                <NavLink to="/auth/sign-in">
                  <Text
                    color={textColorBrand}
                    as="span"
                    ms="5px" 
                    fontWeight="500"
                  >
                    Войти в систему
                  </Text>
                </NavLink>
              </Text>
            </Flex>
            <Flex
              width={'100%'}
              mt={3}
              justifyContent={{ base: 'start', md: 'end' }}
            >
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="30%"
                h="50"
                mb="24px"
                type="submit"
                onClick={() => {
                  authLogin();
                }}
              >
                {loading ? `загрузка...` : `Отправить`}
              </Button>
            </Flex>
          </FormControl>
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={22} fontWeight={'800'} textAlign={'center'}>
            Ваша заявка успешно получена. Наши администраторы скоро свяжутся с
            вами!
          </ModalBody>

          <ModalFooter display={'flex'} justifyContent={'center'}>
            <Button
              px="40px"
              bg={'red'}
              color={'white'}
              _hover={{ bg: 'red.600' }}
              _active={{
                bg: 'red.600',
                transform: 'scale(0.98)',
              }}
              onClick={onClose}
            >
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultAuth>
  );
}

export default SignUp;

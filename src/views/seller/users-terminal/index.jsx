import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import {
  globaldeleteFunction,
  globalGetFunction,
  globalPostFunction,
} from '../../../contexts/logic-function/globalFunktion';
import {
  user_terminal,
  terminals_api,
  terminal_get,
  terminal_get_list,
  user_terminal_add,
  user_terminal_delete,
} from '../../../contexts/api';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { MdDeleteForever } from 'react-icons/md';
// import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { TerminalStore } from 'contexts/state-management/terminal/terminalStory';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { PhoneInput } from 'react-international-phone';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const UserTerminal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wordsListData } = LanguageStore();
  const {
    isOpen: isDelete,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [usersTerminal, setUsersTerminal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalElement, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [id, setId] = useState('');
  const { terminalData, setTerminalData } = TerminalStore();

  const [formValues, setFormValues] = useState({
    terminalId: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '12345',
  });
  const [formErrors, setFormErrors] = useState({});
  // const [showPassword, setShowPassword] = useState(false);

  const inputTextColor = useColorModeValue('gray.800', 'white');
  // const navbarIcon = useColorModeValue('#1B255A', 'white');
  const bgColor = useColorModeValue('#422AFB', '#7551FF');
  const hoverBgColor = useColorModeValue('blue.600', 'purple.600');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const thead = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.NAME || 'Имя',
    wordsListData?.EXCEL_TERMINAL_NAME || 'Название терминала',
    wordsListData?.PHONE_NUMBER || 'Телефон',
    wordsListData?.EMAIL || 'Электронная почта',
    // wordsListData?.INN_WEB || 'ИНН',
    // wordsListData?.EXCEL_MFO || 'МФО',
    wordsListData?.ACTION || 'Действия',
  ];

  const getFunctionUsersTerm = async () => {
    await globalGetFunction({
      url: `${user_terminal}?page=${page}&size=${size}`,
      setData: setUsersTerminal,
      setLoading,
      setTotalElements,
    });
    await globalGetFunction({
      url: terminal_get_list,
      setData: setTerminalData,
      setTotalElements,
    });
  };

  useEffect(() => {
    getFunctionUsersTerm();
  }, []);

  useEffect(() => {
    getFunctionUsersTerm();
  }, [page, size]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetValue = () => {
    setFormValues({
      terminalId: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '12345',
    });
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formValues?.terminalId)
      errors.terminalId = `${wordsListData?.PANEL_TERMINAL || 'Терминал'}${
        wordsListData?.IS_REQUIRED || '  требуется '
      }`;
    if (!formValues?.firstName.trim(''))
      errors.managerFio = `${wordsListData?.NAME || 'Имя'}${
        wordsListData?.IS_REQUIRED || '  требуется '
      }`;
    if (!formValues?.lastName.trim(''))
      errors.managerFio = `${wordsListData?.SURNAME || 'Имя'}${
        wordsListData?.IS_REQUIRED || '  требуется '
      }`;
    if (!formValues?.phone.trim('')) {
      errors.phone = `${wordsListData?.PHONE_NUMBER || 'Телефон'}${
        wordsListData?.IS_REQUIRED || '  требуется '
      }`;
    } else if (formValues?.phone.slice(1).length !== 12) {
      errors.phone = `${
        wordsListData?.PHONE_ERROR ||
        'Номер телефона должен состоять ровно из 9 символов и содержать только цифры.'
      }`;
    }
    if (!formValues?.password.trim(''))
      errors.password = `${wordsListData?.PASSWORD || 'Пароль'}${
        wordsListData?.IS_REQUIRED || '  требуется '
      }`;
    else if (formValues?.password.length < 4) {
      errors.password = `${
        wordsListData?.PASSWORD_ERROR_TERMINAL ||
        'Пароль должен содержать не менее 4 символов.'
      }`;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const data = {
        terminalId: parseInt(formValues?.terminalId, 10),
        firstName: formValues?.firstName,
        lastName: formValues?.lastName,
        phone: `${formValues?.phone.slice(1)}`,
        password: formValues?.password,
      };
      globalPostFunction({
        url: user_terminal_add,
        postData: data,
        setLoading,
        getFunction: getFunctionUsersTerm,
      });
      onClose();
      resetValue();
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <ComplexTable
          buttonChild={
            <Button
              bg={bgColor}
              color={'white'}
              _hover={{ bg: hoverBgColor }}
              _active={{
                bg: hoverBgColor,
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                onOpen();
              }}
            >
              {wordsListData?.CREATE_USER || 'Создать пользователя'}
            </Button>
          }
          name={`${
            wordsListData?.TERMINAL_USERS_TABLE || 'Пользователи терминалов'
          }`}
          thead={thead}
        >
          {loading ? (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.LOADING || 'Загрузка...'}
              </Td>
            </Tr>
          ) : usersTerminal ? (
            usersTerminal.object.map((item, i) => (
              <Tr key={item.id}>
                <Td>{i + 1}</Td>
                <Td minWidth="250px">
                  {item.firstName + ' ' + item.lastName || '-'}
                </Td>
                <Td minWidth="250px">{item.terminalName || '-'}</Td>
                <Td minWidth="250px">
                  {item.phone
                    ? `+998 (${item.phone.slice(3, 5)}) ${item.phone.slice(
                        5,
                        8,
                      )} ${item.phone.slice(8, 10)} ${item.phone.slice(10)}`
                    : '-'}
                </Td>
                <Td minWidth="250px">{item.email || '-'}</Td>
                {/* <Td minWidth="250px">{item.filialCode || '-'}</Td> */}
                {/* <Td minWidth="250px">{item.inn || '-'}</Td> */}
                <Td>
                  <Box ms={3}>
                    <IconButton
                      icon={<MdDeleteForever size={25} />}
                      color="red.500"
                      variant="ghost"
                      onClick={() => {
                        setId(item.id);
                        openDelete();
                      }}
                      aria-label="Удалить"
                    />
                  </Box>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.PAYMENT_NOTFOUND || 'не найдено'}
              </Td>
            </Tr>
          )}
        </ComplexTable>
        <Pagination
          showSizeChanger
          responsive={true}
          defaultCurrent={1}
          total={totalElement}
          onChange={(page, size) => {
            setPage(page - 1);
          }}
          onShowSizeChange={(current, pageSize) => {
            setSize(pageSize);
            setPage(0);
          }}
        />
      </SimpleGrid>

      {/* Create/Edit Modal */}
      <Modal
        size={'3xl'}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetValue();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {wordsListData?.CREATE_USER || 'Создать пользователя'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} px={5}>
              {/* Terminal Selection */}
              <FormControl
                mt={4}
                isInvalid={!!formErrors.terminalId}
                isRequired
              >
                <FormLabel>{wordsListData?.PANEL_TERMINAL || 'Терминал'}</FormLabel>
                <Select
                  name="terminalId"
                  //   placeholder={t("selectTerminal")}
                  //   _placeholder={"thh"}
                  value={formValues.terminalId}
                  onChange={handleChange}
                  ref={initialRef}
                  color={inputTextColor}
                >
                  <option selected disabled value={''}>
                    {wordsListData?.SELECT_TERMINAL || 'Выберите терминал'}
                  </option>
                  {terminalData && terminalData.length > 0 ? (
                    terminalData?.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {wordsListData?.TERMINALPANEL_TERMINAL || 'Терминал'}
                      {wordsListData?.NOT_FOUND || 'не найдено'}
                    </option>
                  )}
                </Select>
                {formErrors.terminalId && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.terminalId}
                  </Text>
                )}
              </FormControl>

              {/* First Name */}
              <FormControl mt={4} isInvalid={!!formErrors.firstName} isRequired>
                <FormLabel>{wordsListData?.NAME || 'Имя'}</FormLabel>
                <Input
                  name="firstName"
                  placeholder={
                    wordsListData?.NAME_PLACEHOLDER || 'Введите ваше имя'
                  }
                  // value={formValues.firstName}
                  onChange={handleChange}
                  color={inputTextColor}
                />
                {formErrors.firstName && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.firstName}
                  </Text>
                )}
              </FormControl>

              <FormControl mt={4} isInvalid={!!formErrors?.lastName} isRequired>
                <FormLabel>{wordsListData?.SURNAME || 'Фамилия'}</FormLabel>
                <Input
                  name="lastName"
                  type="text"
                  placeholder={
                    wordsListData?.SURNAME_PLACEHOLDER || 'Введите фамилию'
                  }
                  value={formValues.lastName}
                  onChange={handleChange}
                  color={inputTextColor}
                />
                {formErrors.lastName && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.lastName}
                  </Text>
                )}
              </FormControl>
              {/* Phone */}
              <FormControl mt={4} isInvalid={!!formErrors.phone} isRequired>
                <FormLabel>
                  {wordsListData?.PHONE_NUMBER || 'Телефон'}
                </FormLabel>
                {/* <InputGroup>
                  <InputLeftElement>
                    <Text fontSize="sm" fontWeight="500">
                      +998
                    </Text>
                  </InputLeftElement>
                  <Input
                    name="phone"
                    placeholder={
                      wordsListData?.PHONE_NUMBER_PLACEHOLDER ||
                      'Введите ваш номер телефона'
                    }
                    value={formValues.phone}
                    onChange={handleChange}
                    color={inputTextColor}
                    type="tel"
                  />
                </InputGroup> */}
                <PhoneInput
                disableCountryCodeEdit
                  required
                  defaultCountry="uz"
                  value={formValues.phone}
                  onChange={(phone) =>
                    handleChange({ target: { name: 'phone', value: phone } })
                  }
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
                {formErrors.phone && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.phone}
                  </Text>
                )}
              </FormControl>

              {/* Password */}
              {/* <FormControl mt={4} isInvalid={!!formErrors.password} isRequired>
                <FormLabel>{wordsListData?.PASSWORD || 'Пароль'}</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={
                      wordsListData?.PASSWORD_PLACEHOLDER ||
                      'Введите ваш пароль'
                    }
                    value={formValues.password}
                    onChange={handleChange}
                    color={inputTextColor}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      aria-label={
                        wordsListData?.TOGGLE_PASSWORD_VISIBILITY || 
                        'Переключить видимость пароля'
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                {formErrors.password && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.password}
                  </Text>
                )}
              </FormControl> */}
            </Grid>
          </ModalBody>
          <ModalFooter display={'flex'} gap={'10px'}>
            <Button
              bg={'red'}
              color={'white'}
              _hover={{ bg: 'red.600' }}
              _active={{
                bg: 'red.600',
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                onClose();
                resetValue();
              }}
            >
              {wordsListData?.CANCEL || 'Отмена'}
            </Button>
            <Button
              bg={'blue'}
              color={'white'}
              _hover={{ bg: 'blue.600' }}
              _active={{
                bg: 'blue.600',
                transform: 'scale(0.98)',
              }}
              onClick={handleSave}
            >
              {wordsListData?.SAVE || 'Сохранить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isDelete}
        onClose={() => {
          closeDelete();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {wordsListData?.DELETE_USER || 'Удалить пользователя'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {wordsListData?.DELETE_USER_CONFIRMATION ||
              'Вы действительно хотите удалить этого пользователя?'}
          </ModalBody>
          <ModalFooter display={'flex'} gap={'10px'}>
            <Button
              bg={'red'}
              color={'white'}
              _hover={{ bg: 'red.600' }}
              _active={{
                bg: 'red.600',
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                closeDelete();
              }}
            >
              {wordsListData?.CLOSE || 'Закрыть'}
            </Button>
            <Button
              bg={'blue'}
              color={'white'}
              _hover={{ bg: 'blue.600' }}
              _active={{
                bg: 'blue.600',
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                globaldeleteFunction({
                  url: `${user_terminal_delete}?userId=${id}`,
                  setLoading,
                  getFunction: getFunctionUsersTerm,
                });
                closeDelete();
              }}
            >
              {wordsListData?.CONTINUE || 'Продолжить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Delete Confirmation Modal */}
      {/* You can implement the delete confirmation modal similarly */}
    </Box>
  );
};

export default UserTerminal;

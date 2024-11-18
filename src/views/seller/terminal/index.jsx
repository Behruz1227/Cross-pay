import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Td,
  Tr,
  useDisclosure,
  useColorModeValue,
  Text,
  Switch,
  Grid,
  Select,
} from '@chakra-ui/react';
import { debounce } from 'lodash';
import { Pagination } from 'antd';
import {
  terminal_create,
  terminal_update,
  terminal_isActive,
  terminal_get,
} from 'contexts/api';
import {
  globalPostFunction,
  globalPutFunction,
  globalGetFunction,
} from 'contexts/logic-function/globalFunktion';
import { TerminalStore } from 'contexts/state-management/terminal/terminalStory';
import { setConfig } from 'contexts/token';
import React, { useEffect, useState } from 'react';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { terminal_search } from 'contexts/api';
import { PhoneInput } from 'react-international-phone';
import { FaDeleteLeft } from 'react-icons/fa6';

export default function SellerTerminal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    setTerminalData,
    terminalData,
    isEdit,
    setIsEdit,
    setPage,
    totalPage,
    page,
    setSize,
    size,
    setTotalPages,
  } = TerminalStore();
  const [createLoading, setCreateLoading] = useState(false);
  const [detailData, setdetailData] = useState({});
  const [selectData, setSelectData] = useState([]);
  const [terminalSerialCodeInitial, setTerminalSerialCodeInitial] =
    useState(null);
  const [terminalSerialCode, setTerminalSerialCode] = useState(null);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const role = sessionStorage.getItem('ROLE');
  const [search, setSearch] = useState('');
  const inputTextColor = useColorModeValue('gray.800', 'white');
  const navbarIcon = useColorModeValue('#1B255A', 'white');
  const bgColor = useColorModeValue('#422AFB', '#7551FF');
  const textColor = useColorModeValue('white', 'white');
  const hoverBgColor = useColorModeValue('blue.600', 'purple.600');
  const { wordsListData } = LanguageStore();
  const thead = [
    wordsListData?.TABLE_TR || '№',
    wordsListData?.NAME || 'ИМЯ',
    wordsListData?.SERIAL_CODE || 'Серийный код',
    wordsListData?.ACCOUNT_WEB || 'Счет',
    wordsListData?.PHONE_NUMBER || 'Телефон',

    role === 'ROLE_TERMINAL' || wordsListData?.ACTIVE || 'АКТИВНЫЙ',
    // wordsListData?.POS_ID || 'ПОС ИД',
    // wordsListData?.ACTIVE || 'АКТИВНЫЙ',
  ];

  useEffect(() => {
    setConfig();
    getFunction();
    role === 'ROLE_SELLER' &&
      thead.splice(thead.length - 1, 0, wordsListData?.UPDATE || 'АКТИВНЫЙ');
  }, []);

  useEffect(() => {
    globalGetFunction({
      url: `${terminal_search}${search ? `?name=${search}` : ''}`,
      setData: setSelectData,
      setTotalElements: setTotalPages,
      page: page,
      size: size,
    });
  }, [search, page, size]);

  useEffect(() => {
    globalGetFunction({
      url: `${terminal_get}?page=${page}&size=${size}`,
      setLoading: setCreateLoading,
      setData: setTerminalData,
      setTotalElements: setTotalPages,
      page: page,
      size: size,
    });
  }, [page, size]);

  const getFunction = () => {
    globalGetFunction({
      url: `${terminal_get}?page=${page}&size=${size}`,
      setLoading: setCreateLoading,
      setData: setTerminalData,
      setTotalElements: setTotalPages,
    });
  };

  const initialValue = {
    name: '',
    terminalSerialCode: '',
    account: '',
    inn: '',
    filialCode: '',
    phone: '',
    password: '12345',
  };

  const [formValues, setFormValues] = useState(initialValue);
  // const [terminalNewUsers, setTerminalNewUsers] = useState([terminalNewUsersInitial]);
  const [formErrors, setFormErrors] = useState({});

  const resetValue = () => {
    setFormValues(initialValue);
    setFormErrors({});
    setTerminalSerialCodeInitial(null);
    setTerminalSerialCode(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const debouncedPostFunction = debounce((item) => {
    globalPostFunction({
      url: `${terminal_isActive}${item.id}`,
      data: {},
      setLoading: setCreateLoading,
      getFunction: getFunction,
    });
  }, 300);

  const validate = () => {
    const errors = {};
    if (!formValues.name.trim(''))
      errors.name = `${wordsListData?.NAME || 'Имя'}${wordsListData?.IS_REQUIRED || '  требуется '
        }`;
    if (!formValues.terminalSerialCode.trim(''))
      errors.terminalSerialCode = `${wordsListData?.SURNAME || 'Имя'}${wordsListData?.IS_REQUIRED || '  требуется '
        }`;
    if (!formValues.inn.trim(''))
      errors.inn = `${wordsListData?.SURNAME || 'Имя'}${wordsListData?.IS_REQUIRED || '  требуется '
        }`;
    if (!formValues.filialCode.trim(''))
      errors.filialCode = `${wordsListData?.SURNAME || 'Имя'}${wordsListData?.IS_REQUIRED || '  требуется '
        }`;
    if (!formValues.account.trim(''))
          errors.account = `${wordsListData?.SURNAME || 'Имя'}${
            wordsListData?.IS_REQUIRED || '  требуется '
          }`;
    if (!formValues.phone.trim('')) {
      errors.phone = `${wordsListData?.PHONE_NUMBER || 'Телефон'}${wordsListData?.IS_REQUIRED || '  требуется '
        }`;
    } else if (formValues?.phone.slice(1).length !== 12) {
      errors.phone = `${wordsListData?.PHONE_ERROR ||
        'Номер телефона должен состоять ровно из 9 символов и содержать только цифры.'
        }`;
    }
    // if (!formValues.account.trim(''))
    //   errors.password = `${wordsListData?.PASSWORD || 'Пароль'}${wordsListData?.IS_REQUIRED || '  требуется '}`;
    // else if (formValues.password.length < 4) {
    //   errors.password = `${
    //     wordsListData?.PASSWORD_ERROR_TERMINAL ||
    //     'Пароль должен содержать не менее 4 символов.'
    //   }`;
  // }
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSave = () => {

  if (validate()) {
    if (isEdit) {
      globalPutFunction({
        url: `${terminal_update}${detailData && detailData.id ? detailData.id : 0}`,
        putData: {
          name: formValues?.name,
          account: formValues.account,
          inn: formValues.inn,
          phone: `${formValues.phone.slice(1)}`,
          password: formValues.password,
          terminalSerialCode: formValues.terminalSerialCode,
          filialCode: formValues.filialCode,
        },
        setLoading: setCreateLoading,
        getFunction: () => {
          getFunction();
          onClose();
          resetValue();
        },
      });
    } else {
      globalPostFunction({
        url: `${terminal_create}`,
        postData: {
          name: formValues?.name,
          account: formValues.account,
          inn: formValues.inn,
          phone: `${formValues.phone.slice(1)}`,
          password: formValues.password,
          terminalSerialCode: formValues.terminalSerialCode,
          filialCode: formValues.filialCode,
        },
        setLoading: setCreateLoading,
        getFunction: () => {
          getFunction();
          onClose();
          resetValue();
        },
      });
    }
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
        name={`${wordsListData?.TERMINAL_TABLE_TITLE || 'Терминальный стол'}`}
        buttonChild={
          role === 'ROLE_SUPER_ADMIN' && (
            <Button
              bg={bgColor}
              color={textColor}
              _hover={{ bg: hoverBgColor }}
              _active={{
                bg: hoverBgColor,
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                setIsEdit(false);
                onOpen();
              }}
            >
              {wordsListData?.CREATE_TERMINAL || 'Создать терминал'}
            </Button>
          )
        }
        thead={thead}
      >
        {createLoading ? (
          <Tr>
            <Td textAlign="center" colSpan={thead.length}>
              {wordsListData?.LOADING || 'Загрузка'}...
            </Td>
          </Tr>
        ) : terminalData && terminalData?.object?.length > 0 ? (
          terminalData?.object?.map((item, i) => (
            <Tr key={i}>
              <Td>{page * 10 + i + 1}</Td>
              <Td minWidth={'250px'}>{item?.name ? item?.name : '-'}</Td>

              <Td minWidth={'250px'}>
                {item?.terminalSerialCode ? item?.terminalSerialCode : '-'}
              </Td>
              <Td minWidth={'250px'}>{item?.account || '-'}</Td>
              <Td minWidth={'250px'}>
                {item?.phones && item.phones.length > 0
                  ? item.phones?.map((phone, index) => (
                    <div key={index}>
                      {`+998 (${phone.slice(3, 5)}) ${phone.slice(
                        5,
                        8,
                      )} ${phone.slice(8, 10)} ${phone.slice(10, 12)}`}
                    </div>
                  ))
                  : '-'}
              </Td>

              {/* <Td alignSelf="flex-start">
                  <Text
                    background={'#ECEFF8'}
                    color={'blue'}
                    py="10px"
                    fontWeight="700"
                    borderRadius="10px"
                    textAlign={'center'}
                    width={'130px'}
                  >
                    {item?.status === 1
                      ? wordsListData.BUTTON_ACTIVE
                      : wordsListData.BUTTON_NOT_ACTIVE}
                  </Text>
                </Td> */}
              {/* <Td>{item?.posId ? item?.posId : '-'}</Td> */}
              {/* <Td>{item?.filial_code ? item?.filial_code : '-'}</Td> */}
              {role === 'ROLE_SELLER' && (
                <Td>
                  <Box ms={3}>
                    <button
                      onClick={() => {
                        setFormValues({
                          name: item?.name,
                          terminalSerialCode: item?.terminalSerialCode,
                        });
                        setTerminalSerialCode(item.terminalSerialCode);
                        setTerminalSerialCodeInitial(item.terminalSerialCode);
                        setdetailData(item);
                        setIsEdit(true);
                        onOpen();
                      }}
                    >
                      {/* <FaEdit color={navbarIcon} size={23} /> */}
                    </button>
                  </Box>
                </Td>
              )}
              {role === 'ROLE_TERMINAL' || role === 'ROLE_BANK' || (
                <Td>
                  <Box
                    onClick={() => {
                      if (item.status === 0) {
                        debouncedPostFunction(item);
                      }
                    }}
                  >
                    {/* <Switch
                      disabled={item.status === 1}
                      isChecked={item.status === 0}
                      colorScheme="teal"
                      size="lg" 
                    /> */}
                    <Button
                      disabled={item.status === 1}
                      // isChecked={item.status === 0}
                    >
                      <FaDeleteLeft color={navbarIcon} size={23} /> 
                    </Button>
                  </Box>
                </Td>
              )}
            </Tr>
          ))
        ) : (
          <Tr>
            <Td textAlign={'center'} colSpan={thead.length}>
              {wordsListData?.PANEL_TERMINAL || 'Терминал'}{' '}
              {wordsListData?.NOT_FOUND || 'не найден'}
            </Td>
          </Tr>
        )}
      </ComplexTable>
      {role === 'ROLE_TERMINAL' || (
        <Pagination
          showSizeChanger
          responsive={true}
          defaultCurrent={1}
          total={totalPage}
          onChange={(page, size) => {
            setPage(page - 1);
          }}
          onShowSizeChange={(current, pageSize) => {
            setSize(pageSize);
            setPage(0);
          }}
        />
      )}
    </SimpleGrid>
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
          {isEdit
            ? wordsListData?.EDIT_TERMINAL || 'Редактирование терминала'
            : wordsListData?.CREATE_TERMINAL || 'Создать терминал'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} px={5}>
            {/* {!isEdit && (
                <FormControl mt={4}>
                  <FormLabel>
                    {wordsListData?.SELECT_TERMINAL_TYPE || 'Выберите терминал'}
                  </FormLabel>
                  <Select
                    value={formValues.status}
                    onChange={(e) =>
                      setFormValues({ ...formValues, status: e.target.value })
                    }
                    color={inputTextColor}
                  >
                    <option disabled selected>
                      {wordsListData?.SELECT_TERMINAL_TYPE ||
                        'Выберите терминал'}
                    </option>
                    <option value="POS">{wordsListData?.POS || 'ПОС'}</option>
                    <option value="CASH">
                      {wordsListData?.CASH || 'Касса'}
                    </option>
                    <option value="WEB">{wordsListData?.WEB || 'Веб'}</option>
                    <option value="MOBILE">
                      {wordsListData?.MOBILE || 'Мобильное приложение'}
                    </option>
                  </Select>
                </FormControl>
              )} */}

            {/* Terminal Name */}
            <FormControl mt={4} isInvalid={!!formErrors.name}>
              <FormLabel>
                {wordsListData?.EXCEL_TERMINAL_NAME || 'Название терминала'}
              </FormLabel>
              <Input
                name="name"
                ref={initialRef}
                placeholder={
                  wordsListData?.ENTER_THE_TERMINAL_NAME ||
                  'Введите название терминала'
                }
                value={formValues.name}
                onChange={handleChange}
                color={inputTextColor}
              />
            </FormControl>

            {/* Account */}
            <FormControl mt={4} isInvalid={!!formErrors.account}>
              <FormLabel>{wordsListData?.ACCOUNT_WEB || 'Аккаунт'}</FormLabel>
              <Input
                name="account"
                placeholder={wordsListData?.ACCOUNT_WEB || 'Аккаунт'}
                value={formValues.account}
                onChange={handleChange}
                color={inputTextColor}
              />
            </FormControl>

            {/* Filial Code */}
            <FormControl mt={4} isInvalid={!!formErrors.filialCode}>
              <FormLabel>{wordsListData?.EXCEL_MFO || 'Код филиала'}</FormLabel>
              <Input
                name="filialCode"
                placeholder={wordsListData?.EXCEL_MFO || 'Код филиала'}
                value={formValues.filialCode}
                onChange={handleChange}
                color={inputTextColor}
              />
            </FormControl>

            {/* INN */}
            <FormControl mt={4} isInvalid={!!formErrors.inn}>
              <FormLabel>{wordsListData?.INN_WEB || 'ИНН'}</FormLabel>
              <Input
                name="inn"
                placeholder={wordsListData?.INN_WEB || 'ИНН'}
                value={formValues.inn}
                onChange={handleChange}
                color={inputTextColor}
              />
            </FormControl>

            {/* Phone */}
            <FormControl mt={4} isInvalid={!!formErrors.phone}>
              <FormLabel>
                {wordsListData?.PHONE_NUMBER || 'Номер телефона'}
              </FormLabel>
              <PhoneInput
              disableCountryCodeEdit
                required
                defaultCountry="uz"
                value={formValues.phone}
                onChange={(phone) => handleChange({ target: { name: 'phone', value: phone } })}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '16px',
                  border: '1px solid #E0E5F2',
                  fontSize: '16px',
                  padding: '0 15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: inputTextColor
                }}
                inputStyle={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  color: inputTextColor
                }}
                inputClass="phone-input"
                containerClass="phone-input-container"
                textClass="phone-input-text"
              />
              {/* <PhoneInput
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
                /> */}
            </FormControl>
            <FormControl mt={4} isInvalid={!!formErrors.terminalSerialCode}>
              <FormLabel>
                {wordsListData?.SERIAL_CODE || 'Серийный код'}
              </FormLabel>
              <Input
                name="terminalSerialCode"
                placeholder={wordsListData?.SERIAL_CODE || 'Серийный код'}
                value={formValues.terminalSerialCode}
                onChange={handleChange}
                color={inputTextColor}
              />
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter display={'flex'} gap={'10px'}>
          <Button
            bg={'red'}
            color={'white'}
            _hover={{ bg: 'red.600' }}
            _active={{ bg: 'red.600', transform: 'scale(0.98)' }}
            onClick={() => {
              onClose();
              resetValue();
            }}
          >
            {wordsListData?.CANCEL || 'Отмена'}
          </Button>
          <Button
            bg={'green'}
            color={'white'}
            _hover={{ bg: 'green.600' }}
            _active={{ bg: 'green.600', transform: 'scale(0.98)' }}
            onClick={() => {
              handleSave();
            }}
          >
            {createLoading
              ? wordsListData?.LOADING || 'Загрузка...'
              : wordsListData?.SAVE || 'Сохранить'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
);
}

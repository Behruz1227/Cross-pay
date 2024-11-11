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
  InputGroup,
  InputRightElement,
  IconButton,
  Grid,
  Flex,
  InputLeftElement,
  GridItem,
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
import { useTranslation } from 'react-i18next';
import { FaEdit } from 'react-icons/fa';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { terminal_search } from 'contexts/api';

export default function SellerTerminal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
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
  const [showPassword, setShowPassword] = useState(false);
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
    wordsListData?.TERMINAL_CODE || 'ТЕРМИНАЛЬНЫЙ КОД',
    wordsListData?.MERCHANT || 'МЕРЧАНТ',
    wordsListData?.PHONE_NUMBER || 'ТЕЛЕФОН',

    wordsListData?.TYPE || 'ТИП',
    wordsListData?.POS_ID || 'ПОС ИД',
    wordsListData?.ACTIVE || 'АКТИВНЫЙ',
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
      url: `${terminal_get}`,
      setLoading: setCreateLoading,
      setData: setTerminalData,
      setTotalElements: setTotalPages,
      page: page,
      size: size,
    });
  }, [page, size]);

  const getFunction = () => {
    globalGetFunction({
      url: `${terminal_get}`,
      setLoading: setCreateLoading,
      setData: setTerminalData,
      setTotalElements: setTotalPages,
      page: page,
      size: size,
    });
  };

  const initialValue = {
    name: '',
    terminalSerialCode: '',
    status: null,
  };

  const [formValues, setFormValues] = useState(initialValue);
  // const [terminalNewUsers, setTerminalNewUsers] = useState([terminalNewUsersInitial]); 
  const [formErrors, setFormErrors] = useState(initialValue);
  const resetValue = () => {
    setFormValues(initialValue);
    setFormErrors(initialValue);
    setTerminalSerialCodeInitial(null);
    setTerminalSerialCode(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const errors = {};
    if (formValues?.status && formValues?.status === "POS" && name === 'terminalSerialCode') {
      if (formValues?.terminalSerialCode?.trim() === '') {
        errors[name] = `${name} ${wordsListData?.REQUIRED || ' требуется'}`;
      }
    }
    else if (name !== 'status' && name !== 'terminalSerialCode' && formValues[name].trim() === '')
      errors[name] = `${name} ${wordsListData?.REQUIRED || ' требуется'}`;
    setFormErrors({ ...formErrors, ...errors });
  };
  const debouncedPostFunction = debounce((item) => {
    globalPostFunction({
      url: `${terminal_isActive}${item.id}`,
      data: {},
      setLoading: setCreateLoading,
      getFunction: getFunction,
    });
  }, 300);

  const handleSave = () => {
    const errors = {};
    if (isEdit === true) {
      if (Object.keys(errors).length === 0) {
        globalPutFunction({
          url: `${terminal_update}${detailData && detailData.id ? detailData.id : 0}`,
          putData: {
            name: formValues?.name,
            terminalSerialCode: formValues?.terminalSerialCode || null,
          },
          setLoading: setCreateLoading,
          getFunction: () => {
            getFunction();
            onClose();
            resetValue();
          },
        });
      } else setFormErrors(errors);
    } else {
      Object.keys(formValues).forEach((key) => {
        if (formValues?.status && formValues?.status === "POS" && key === 'terminalSerialCode') {
          if (formValues?.terminalSerialCode?.trim() === '') {
            errors[key] = `${key} ${wordsListData?.REQUIRED || ' требуется'}`;
          }
        }
        else if (key !== 'status' && formValues[key].trim() === '')
          errors[key] = `${key} ${wordsListData?.REQUIRED || ' требуется'}`;
      });
      if (Object.keys(errors).length === 0) {
        globalPostFunction({
          url: `${terminal_create}`,
          postData: {
            name: formValues?.name,
            terminalSerialCode: formValues?.status === "POS" ? formValues?.terminalSerialCode : null,
            status: formValues?.status,
          },
          setLoading: setCreateLoading,
          getFunction: () => {
            getFunction();
            onClose();
            resetValue();
          },
        });
      } else setFormErrors(errors);
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
            role === 'ROLE_SELLER' && (
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
                <Td minWidth={"250px"}>{item?.name ? item?.name : '-'}</Td>

                <Td minWidth={"250px"}>
                  {item?.terminalSerialCode ? item?.terminalSerialCode : '-'}
                </Td>
                <Td minWidth={"250px"}>{item?.merchant ? item?.merchant : '-'}</Td>
                <Td minWidth={"250px"}>{item?.phone ? `+998 (${item?.phone.slice(3, 5)}) ${item?.phone.slice(5, 8)} ${item?.phone.slice(8, 10)} ${item?.phone.slice(10)}` : '-'}</Td>

                <Td alignSelf="flex-start">
                  <Text
                    background={'#ECEFF8'}
                    color={'blue'}
                    py="10px"
                    fontWeight="700"
                    borderRadius="10px"
                    textAlign={'center'}
                    width={'130px'}
                  >
                    {item?.status ? item?.status : '-'}
                  </Text>
                </Td>
                <Td>{item?.posId ? item?.posId : '-'}</Td>
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
                        <FaEdit color={navbarIcon} size={23} />
                      </button>
                    </Box>
                  </Td>
                )}
                <Td>
                  <Box
                    onClick={() => {
                      if (item.status === 0) {
                        debouncedPostFunction(item);
                      }
                    }}
                  >
                    <Switch
                      disabled={item.status !== 0}
                      isChecked={item.status === 0}
                      colorScheme="teal"
                      size="lg"
                    />
                  </Box>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign={'center'} colSpan={thead.length}>
                {wordsListData?.TERMINAL || 'Терминал'}{' '}
                {wordsListData?.NOT_FOUND || 'не найден'}
              </Td>
            </Tr>
          )}
        </ComplexTable>
        {/*{Array.isArray(terminalData.object) && terminalData.object.length > 0 &&*/}
        <Pagination
          showSizeChanger
          responsive={true}
          defaultCurrent={1}
          total={totalPage}
          onChange={(page, size) => {
            setPage(page - 1);
          }}
          onShowSizeChange={(current, pageSize) => {
            setSize(pageSize)
            setPage(0)
          }}
        />
        {/*}*/}
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
              {!isEdit && (
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
                      {wordsListData?.SELECT_TERMINAL_TYPE || 'Выберите терминал'}
                    </option>
                    <option value="POS">
                      {wordsListData?.POS || 'ПОС'}
                    </option>
                    <option value="CASH">
                      {wordsListData?.CASH || 'Касса'}
                    </option>
                    <option value="WEB">{wordsListData?.WEB || 'Веб'}</option>
                    <option value="MOBILE">
                      {wordsListData?.MOBILE || 'Мобильное приложение'}
                    </option>
                  </Select>
                </FormControl>
              )}
              <FormControl mt={4} isInvalid={!!formErrors.name}>
                <FormLabel>{wordsListData?.TERMINAL_NAME || 'Название терминала'}</FormLabel>
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
                {/* {formErrors.name && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.name}
                  </Text>
                )} */}
              </FormControl>
              {formValues.status === 'POS' && (
                <FormControl mt={4}>
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
                  {/* {formErrors.terminalSerialCode && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.terminalSerialCode}
                  </Text>
                )} */}
                </FormControl>
              )}
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
              bg={'green'}
              color={'white'}
              _hover={{ bg: 'green.600' }}
              _active={{
                bg: 'green.600',
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                handleSave();
              }}
            >
              {createLoading ? wordsListData?.LOADING || "Загрузка..." : wordsListData?.SAVE || 'Сохранить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

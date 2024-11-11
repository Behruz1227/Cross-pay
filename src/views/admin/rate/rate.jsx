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
  Grid,
  Flex,
  GridItem,
  Select,
} from '@chakra-ui/react';
import { globalPostFunction } from 'contexts/logic-function/globalFunktion';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { setConfig } from 'contexts/token';
import React, { useEffect, useState } from 'react';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { rate_get } from 'contexts/api';
import { RateStore } from 'contexts/state-management/rateStore/rateStore';
import { rate_post } from 'contexts/api';
import { rate_put } from 'contexts/api';
import { rate_delete } from 'contexts/api';
import { globaldeleteFunction } from 'contexts/logic-function/globalFunktion';
import { globalPutFunction } from 'contexts/logic-function/globalFunktion';
import { MdDeleteForever } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

export default function Rate() {
  const { rateData, setRateData, isEdit, setIsEdit } = RateStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModal,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const [postData, setPostData] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { wordsListData } = LanguageStore();
  // Setting input text color based on color mode
  const inputTextColor = useColorModeValue('gray.800', 'white');
  const bgColor = useColorModeValue('#422AFB', '#7551FF');
  const textColor = useColorModeValue('white', 'white');
  const hoverBgColor = useColorModeValue('blue.600', 'purple.600');
  const thead = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.REWARD || 'Вознаграждение',
    wordsListData?.SERVICE_FEE || 'Сервисный сбор',
    wordsListData?.STATUS || 'Статус',
    wordsListData?.ACTION || 'Движение',
  ];
  const initialFormValues = {
    id: '',
    reward: '',
    serviceFee: '',
  };
  const [status, setStatus] = useState('');
  const [formValues, setFormValues] = useState(initialFormValues);

  const [formErrors, setFormErrors] = useState(initialFormValues);

  const resetValue = () => {
    setFormValues(initialFormValues);
    setFormErrors(initialFormValues);
  };

  useEffect(() => {
    setConfig();
    getFunction();
  }, []);

  const getFunction = async () => {
    await globalGetFunction({
      url: `${rate_get}`,
      setLoading: setGetLoading,
      setData: setRateData,
    });
  };

  useEffect(() => {
    getFunction();
  }, []);

  useEffect(() => {
    if (postData) {
      getFunction();
      setIsEdit(false);
      resetValue();
    }
  }, [postData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const errors = {};
    if (value.trim() === '') {
      errors[name] = `${name} ${wordsListData?.ERROR || 'Ошибка'}`;
    } else {
      errors[name] = '';
    }
    setFormErrors({ ...formErrors, ...errors });
    // Simple validation example
  };

  const handleSave = () => {
    const errors = {};
    Object.keys(formValues).forEach((key) => {
      if (key !== 'id' && formValues[key].trim() === '') {
        errors[key] = `${key} ${wordsListData?.ERROR || 'Ошибка'}`;
      }
    });
    if (Object.keys(errors).length === 0) {
      if (isEdit) {
        globalPutFunction({
          url: `${rate_put}${formValues.id}?status=${status}`,
          putData: {
            reward: +formValues.reward,
            serviceFee: +formValues.serviceFee,
          },
          setLoading: setCreateLoading,
          getFunction: () => {
            getFunction();
            onClose();
          },
        });
      } else {
        globalPostFunction({
          url: `${rate_post}${status}`,
          postData: {
            reward: +formValues.reward,
            serviceFee: +formValues.serviceFee,
          },
          setData: setPostData,
          getFunction: () => {
            getFunction();
            onClose();
          },
          setLoading: setCreateLoading,
        });
      }
    } else {
      setFormErrors(errors);
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
          name={`${wordsListData?.TABLE_RATE_TITLE || 'Таблица курсов'}`}
          buttonChild={
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
                resetValue();
                onOpen();
              }}
              disabled={status === ''}
            >
              {wordsListData?.CREATE_RATE || 'Создать курс'}
            </Button>
          }
          thead={thead}
        >
          {getLoading ? (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.LOADING || 'Загрузка'}...
              </Td>
            </Tr>
          ) : rateData && rateData?.length > 0 ? (
            rateData.map((item, i) => (
              <Tr key={item.id}>
                <Td>{i + 1}</Td>
                <Td>{item.reward || '-'}</Td>
                <Td>{item.serviceFee || '-'}</Td>
                <Td>
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
                <Td>
                  <Box ms={3}>
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        resetValue();
                        setFormValues({
                          id: `${item.id}`,
                          rate: `${item.rate}`,
                          reward: `${item.reward}`,
                          serviceFee: `${item.serviceFee}`,
                        });
                        onOpen();
                      }}
                    >
                      <FaEdit color={'orange'} size={23} />
                    </button>
                  </Box>
                  {/* <Box ms={3}>
                                    <button
                                        onClick={() => {
                                            openDeleteModal();

                                        }}
                                    >
                                        <MdDeleteForever color={'red'} size={23} />
                                    </button>
                                </Box> */}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign="center" colSpan={thead.length}>
                {wordsListData?.RATE || 'Курс'}
                {wordsListData?.NOT_FOUND || 'Не найдено'}
              </Td>
            </Tr>
          )}
        </ComplexTable>
      </SimpleGrid>

      <Modal
        size={'2xl'}
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
              ? wordsListData?.UPDATE_RATE || 'Редактирование курса'
              : wordsListData?.CREATE_RATE || 'Создать курс'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <>
              <Select
                name="status"
                id="status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option
                  style={{ color: useColorModeValue('black', 'white') }}
                  value="TERMINAL"
                >
                  {wordsListData?.PANEL_TERMINAL || 'Терминал'}
                </option>
                <option
                  style={{ color: useColorModeValue('black', 'white') }}
                  value="CASH"
                >
                  {wordsListData?.CASH || 'НАЛИЧНЫЕ'}
                </option>
                <option
                  style={{ color: useColorModeValue('black', 'white') }}
                  value="WEB"
                >
                  {wordsListData?.WEB || 'Веб'}
                </option>
                <option
                  style={{ color: useColorModeValue('black', 'white') }}
                  value="MOBILE"
                >
                  {wordsListData?.MOBILE || 'Мобильный'}
                </option>
              </Select>
              <FormControl mt={4} isInvalid={!!formErrors.reward}>
                <FormLabel>
                  {wordsListData?.REWARD || 'Вознаграждение'}
                </FormLabel>
                <Input
                  name="reward"
                  maxLength={3}
                  color={inputTextColor}
                  placeholder={
                    wordsListData?.ENTER_THE_REWARD || 'Введите вознаграждение'
                  }
                  value={formValues.reward || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleChange({
                      target: {
                        name: 'reward',
                        value,
                      },
                    });
                  }}
                />
                {formErrors.reward && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.reward}
                  </Text>
                )}
              </FormControl>
              <FormControl mt={4} isInvalid={!!formErrors.serviceFee}>
                <FormLabel>
                  {wordsListData?.SERVICE_FEE || 'Сервисный сбор'}
                </FormLabel>
                <Input
                  name="serviceFee"
                  maxLength={3}
                  placeholder={
                    wordsListData?.ENTER_THE_SERVICE_FEE ||
                    'Введите сервисный сбор'
                  }
                  color={inputTextColor}
                  value={formValues.serviceFee || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleChange({
                      target: {
                        name: 'serviceFee',
                        value,
                      },
                    });
                  }}
                />
                {formErrors.serviceFee && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.serviceFee}
                  </Text>
                )}
              </FormControl>
            </>
          </ModalBody>

          <ModalFooter display={'flex'} gap={'10px'}>
            <>
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
                {createLoading
                  ? wordsListData?.LOADING || 'Загрузка'
                  : wordsListData?.SAVE || 'Сохранить'}
              </Button>
            </>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModal} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {wordsListData?.DELETE_RATE_MODAL || 'Удаление курса'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {wordsListData?.DELETE_RATE_MODAL_TEXT ||
              'Вы уверены, что хотите удалить курс?'}
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
              onClick={closeDeleteModal}
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
                  url: `${rate_delete}${formValues.id}`,
                  setLoading: setCreateLoading,
                  getFunction: () => {
                    getFunction();
                    closeDeleteModal();
                  },
                });
              }}
            >
              {createLoading
                ? wordsListData?.LOADING || 'Загрузка'
                : wordsListData?.CONTINUE || 'Продолжить'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

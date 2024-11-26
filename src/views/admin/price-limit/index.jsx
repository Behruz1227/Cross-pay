import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Grid,
  Input,
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
import ComplexTable from '../dataTables/components/ComplexTable';
import {
  globalGetFunction,
  globalPostFunction,
} from '../../../contexts/logic-function/globalFunktion';
import {
  limit_price,
  limit_price_save_or_edit,
  user_merchant_search,
} from '../../../contexts/api';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';

const initialData = {
  min: '',
  max: '',
  userId: '',
};

const PriceLimit = () => {
  const { t } = useTranslation();
  const { wordsListData } = LanguageStore();
  const [limitPrice, setLimitPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalElement, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [merchantData, setMerchantData] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');

  const [formValues, setFormValues] = useState(initialData);
  const [formErrors, setFormErrors] = useState(initialData);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('#422AFB', '#7551FF');
  const textColor = useColorModeValue('white', 'white');
  const hoverBgColor = useColorModeValue('blue.600', 'purple.600');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const inputTextColor = useColorModeValue('gray.800', 'white');
  const navbarIcon = useColorModeValue('#1B255A', 'white');

  const thead = [
    wordsListData?.TABLE_TR || 'Т/р',
    wordsListData?.MANAGER_FIO || 'Ф.И.О',
    wordsListData?.PHONE_NUMBER || 'Телефон',
    wordsListData?.LIMIT_PRICE_MIN_THEAD || 'Минимальная сумма',
    wordsListData?.LIMIT_PRICE_MAX_THEAD || 'Максимальная сумма',
    wordsListData?.ACTION || 'Действие',
  ];

  const getLimitUrl = () => {
    const queryParams = [
      owner ? `owner=${owner}` : '',
      phone ? `phone=${phone}` : '',
    ]
      .filter(Boolean)
      .join('&');

    return `${limit_price}?page=${page}&size=${size}${
      queryParams ? `&${queryParams}` : ''
    }`;
  };

  const getFunctionLimitPrice = async () => {
    await globalGetFunction({
      url: getLimitUrl(),
      setData: setLimitPrice,
      setLoading,
      setTotalElements,
    });
  };

  const getFunctionUserSearch = async () => {
    await globalGetFunction({
      url: `${user_merchant_search}${
        merchantSearch
          ? !isNaN(+merchantSearch)
            ? `?phone=${merchantSearch}`
            : `?fullName=${merchantSearch}`
          : ''
      }`,
      setData: setMerchantData,
    });
  };

  useEffect(() => {
    getFunctionLimitPrice().then(() => '');
  }, [page, size, owner, phone]);

  useEffect(() => {
    getFunctionUserSearch().then(() => '');
  }, []);

  useEffect(() => {
    getFunctionUserSearch().then(() => '');
  }, [merchantSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const errors = {};
    if (value.trim() === '')
      errors[name] = `${name} ${wordsListData?.IS_REQUIRED}`;
    else errors[name] = '';
    setFormErrors({ ...formErrors, ...errors });
  };

  const handleSave = () => {
    const errors = {};
    Object.keys(formValues).forEach((key) => {
      if (formValues[key]?.trim() === '')
        errors[key] = `${key} ${wordsListData?.IS_REQUIRED}`;
    });
    if (Object.keys(errors).length === 0) {
      if (!formValues.userId)
        return toast.error(
          wordsListData?.ERROR_MERCHANT || 'Выбор продавца обязателен',
        );
      if (+formValues.min < 1000 || +formValues.min > 150000000)
        return toast.error(
          wordsListData?.ERROR_LIMIT || 'Сумма должна быть не менее 1000 сум.',
        );
      if (+formValues.max < 1000 || +formValues.max > 150000000)
        return toast.error(
          wordsListData?.ERROR_LIMIT || 'Сумма должна быть не менее 1000 сум.',
        );
      if (+formValues.min >= +formValues.max)
        return toast.error(
          wordsListData?.ERROR_MIN_MAX ||
            'Минимальная сумма не может быть больше максимальной суммы',
        );
      setLoading(true);
      globalPostFunction({
        url: limit_price_save_or_edit,
        postData: {
          userId: formValues.userId,
          min: formValues.min,
          max: formValues.max,
        },
        getFunction: () => {
          getFunctionLimitPrice().then(() => '');
          onClose();
          resetValue();
        },
      });
    } else setFormErrors(errors);
  };

  const resetValue = () => {
    setFormValues(initialData);
    setFormErrors(initialData);
    setMerchantSearch('');
    setEditStatus('');
  };

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <SimpleGrid
          mb="20px"
          columns={{ sm: 1 }}
          spacing={{ base: '20px', xl: '20px' }}
        >
          <Card
            flexDirection={{ base: 'column', md: 'row' }}
            gap={'10px'}
            borderRadius={'15px'}
            w="100%"
            p="10px"
          >
            <Box flex="1">
              <Input
                color={textColorPrimary}
                isRequired
                variant="outline"
                fontSize="sm"
                placeholder={`${wordsListData?.MANAGER_FIO}..` || 'Ф.И.О...'}
                fontWeight="500"
                size="lg"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </Box>
            <Box flex="1">
              <Input
                color={textColorPrimary}
                isRequired
                variant="outline"
                fontSize="sm"
                placeholder={`${wordsListData?.SELLER_SEARCH_PHONE}...` || 'Поиск по номеру телефона...'}
                fontWeight="500"
                size="lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Box>
          </Card>
          <ComplexTable
            name={`${wordsListData?.LIMIT_TABLE || 'Таблица лимитов'}`}
            thead={thead}
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
                  onOpen();
                }}
              >
                {`${wordsListData?.LIMIT_CREATE || 'Создать лимит'}`}
              </Button>
            }
          >
            {loading ? (
              <Tr>
                <Td textAlign="center" colSpan={thead.length}>
                  {wordsListData?.LOADING || 'Загрузка...'}
                </Td>
              </Tr>
            ) : limitPrice &&
              limitPrice.object &&
              limitPrice.object.length > 0 ? (
              limitPrice.object.map((item, i) => (
                <Tr key={item?.id || i}>
                  <Td>{page * 10 + i + 1}</Td>
                  <Td minWidth={'250px'}>{item?.owner || '-'}</Td>
                  <Td minWidth={'250px'}>
                    {item?.phone
                      ? `+998 (${item?.phone.slice(3, 5)}) ${item?.phone.slice(
                          5,
                          8,
                        )} ${item?.phone.slice(8, 10)} ${item?.phone.slice(10)}`
                      : '-'}
                  </Td>
                  <Td minWidth={'250px'}>{item?.min || '-'}</Td>
                  <Td minWidth={'250px'}>{item?.max || '-'}</Td>
                  <Td minWidth={'250px'}>
                    <Button
                      onClick={() => {
                        onOpen();
                        setFormValues({
                          min: `${item.min}`,
                          max: `${item.max}`,
                          userId: item.ownerId,
                        });
                        setEditStatus('EDIT');
                      }}
                      variant="no-hover"
                      bg="transparent"
                    >
                      <FaEdit color={navbarIcon} size={23} />
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td textAlign="center" colSpan={thead.length}>
                  {wordsListData?.PANEL_REQUEST || 'Заявка'}{' '}
                  {wordsListData?.NOT_FOUND || 'не найдена'}
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
      </Box>

      {/*save or edit modal*/}
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
            {editStatus === 'EDIT'
              ? wordsListData?.LIMIT_EDIT || 'Редактирование лимита'
              : wordsListData?.LIMIT_CREATE || 'Создать лимит'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} px={5}>
              <FormControl mt={4} isInvalid={!!formErrors.userId}>
                <FormLabel>
                  {wordsListData?.MERCHANT_SELECT || 'Выберите продавца'}
                </FormLabel>
                <Select
                  name={'userId'}
                  placeholder={
                    wordsListData?.MERCHANT_SELECT || 'Выберите продавца'
                  }
                  onChange={handleChange}
                  width={'100'}
                  value={formValues.userId}
                >
                  {/* {merchantData?.length > 0 && merchantData.map(item => (
                                        <option value={item.id} key={item.id}>{item.firstName} {item.lastName}</option>
                                    ))} */}
                  {merchantData?.length > 0 &&
                    merchantData.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.firstName || item.lastName  ? `${item.firstName || '--'} ${item.lastName || '--'}`: '--'}
                      </option>
                    ))}
                </Select>
                {formErrors.userId && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.userId}
                  </Text>
                )}
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>
                  {wordsListData?.MERCHANT_SEARCH || 'Поиск продавца'}
                </FormLabel>
                <Input
                  placeholder={
                    wordsListData?.MERCHANT_SEARCH || 'Поиск продавца'
                  }
                  value={merchantSearch}
                  onChange={(e) => setMerchantSearch(e.target.value)}
                  color={inputTextColor}
                />
              </FormControl>
              <FormControl mt={4} isInvalid={!!formErrors.min}>
                <FormLabel>
                  {wordsListData?.LIMIT_PRICE_MIN || 'Минимальная сумма'}
                </FormLabel>
                <Input
                  name="min"
                  placeholder={
                    wordsListData?.LIMIT_PRICE_MIN || 'Минимальная сумма'
                  }
                  value={formValues.min}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!isNaN(+val) && +val >= 0 && +val <= 150000000)
                      handleChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '+' && e.key === '-') e.preventDefault();
                  }}
                  color={inputTextColor}
                />
                {formErrors.min && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.min}
                  </Text>
                )}
              </FormControl>
              <FormControl mt={4} isInvalid={!!formErrors.max}>
                <FormLabel>
                  {wordsListData?.LIMIT_PRICE_MAX || 'Максимальная сумма'}
                </FormLabel>
                <Input
                  name="max"
                  placeholder={
                    wordsListData?.LIMIT_PRICE_MAX || 'Максимальная сумма'
                  }
                  value={formValues.max}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!isNaN(+val) && +val >= 0 && +val <= 150000000)
                      handleChange(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '+' && e.key === '-') e.preventDefault();
                  }}
                  color={inputTextColor}
                />
                {formErrors.max && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.max}
                  </Text>
                )}
              </FormControl>
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
              colorScheme="red"
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
    </>
  );
};

export default PriceLimit;

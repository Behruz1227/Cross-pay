import {
  Box,
  SimpleGrid,
  Tr,
  Td,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  Button,
  ModalBody,
  useColorModeValue,
  Grid,
  FormControl,
  FormLabel,
  ModalFooter,
  Input,
} from '@chakra-ui/react';
import ComplexTable from '../dataTables/components/ComplexTable';
import { Pagination } from 'antd';
import { TerminalStore } from '../../../contexts/state-management/terminal/terminalStory';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  globalGetFunction,
  globalPostFunction,
} from '../../../contexts/logic-function/globalFunktion';
import { user_merchant, user_merchant_update } from '../../../contexts/api';
import { updateUserStatus } from 'contexts/logic-function';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { PhoneInput } from 'react-international-phone';

export default function Partner() {
  const { t } = useTranslation();
  const { page, setPage, totalPage, setTotalPages } = TerminalStore();
  const { wordsListData } = LanguageStore();
  const [size, setSize] = useState(10);
  const [merchantData, setMerchantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [tin, setInn] = useState('');
  const [filialCode, setFilialCode] = useState('');
  const [phone, setPhone] = useState('');
  const [data, setData] = useState({
    legalName: '',
    legalAddress: '',
    tin: '',
    managerFio: '',
    bankName: '',
    bankBik: '',
    bankAccount: '',
    phone: '',
    password: '12345',
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    getMerchant();
  }, []);

  const inputTextColor = useColorModeValue('gray.800', 'white');
  const tableRowColor = useColorModeValue('gray.500', 'gray.300');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const bgColor = useColorModeValue('#422AFB', '#7551FF');
  const hoverBgColor = useColorModeValue('blue.600', 'purple.600');

  useEffect(() => {
    getMerchant();
  }, [page, fullName, tin, filialCode, phone, size]);

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const bgGenerator = (status) => {
    if (status === 'ACTIVE')
      return ['green', wordsListData?.BUTTON_ACTIVE || 'АКТИВНЫЙ'];
    else if (status === 'INACTIVE')
      return ['red', wordsListData?.BUTTON_NOT_ACTIVE || 'НЕ АКТИВНЫЙ'];
    else return ['gray', wordsListData?.UNKNOWN || 'НЕИЗВЕСТНЫЙ'];
  };
  const getTestUrl = () => {
    const queryParams = [
      fullName ? `fullName=${fullName}` : '',
      tin ? `tin=${tin}` : '',
      filialCode ? `filialCode=${filialCode}` : '',
      phone ? `phone=${phone.slice(1)}` : '',
    ]
      .filter(Boolean)
      .join('&');
    return `${user_merchant}?${
      queryParams ? `${queryParams}&` : ''
    }page=${page}&size=${size}`;
  };
  const getMerchant = async () => {
    await globalGetFunction({
      url: getTestUrl(),
      setLoading,
      setTotalElements: setTotalPages,
      setData: setMerchantData,
    });
  };
  const role = localStorage.getItem('role');
  const validateFields = () => {
    const newErrors = {};

    if (!data.legalName) newErrors.legalName = 'Legal Name is required';
    if (!data.legalAddress)
      newErrors.legalAddress = 'Legal Address is required';
    if (!data.tin) newErrors.tin = 'TIN is required';
    if (!data.managerFio) newErrors.managerFio = 'Manager FIO is required';
    if (!data.bankName) newErrors.bankName = 'Bank Name is required';
    if (!data.bankBik) newErrors.bankBik = 'Bank BIK is required';
    if (!data.bankAccount) newErrors.bankAccount = 'Bank Account is required';
    if (!data.phone || data.phone.slice(1).length !== 12)
      newErrors.phone = 'Phone must be 9 digits';
    if (!data.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateFields()) return;
    await globalPostFunction({
      url: user_merchant_update,
      postData: {
        legalName: data.legalName,
        legalAddress: data.legalAddress,
        tin: data.tin,
        managerFio: data.managerFio,
        bankName: data.bankName,
        bankBik: data.bankBik,
        bankAccount: data.bankAccount,
        phone: data.phone.replace(/[\s+a-z]/g, ''),
        password: data.password,
      },
      getFunction: () => {
        setData({
          legalName: '',
          legalAddress: '',
          tin: '',
          managerFio: '',
          bankName: '',
          bankBik: '',
          bankAccount: '',
          phone: '',
          password: '12345',
        });
        setErrors({});
        onClose();
        getMerchant();
      },
    });
  };
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '90px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          gap={5}
        >
          <Input
            style={{ padding: '10px' }}
            placeholder={`${
              wordsListData?.SELLER_SEARCH_FULL_NAME || 'Поиск по имени'
            }`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            allowClear
            color={inputTextColor}
          />
          <Input
            style={{ padding: '10px' }}
            placeholder={`${
              wordsListData?.SELLER_SEARCH_INN || 'Поиск по ИНН'
            }`}
            value={tin}
            onChange={(e) => setInn(e.target.value)}
            allowClear
            color={inputTextColor}
          />
          <Input
            style={{ padding: '10px' }}
            placeholder={`${
              wordsListData?.SELLER_SEARCH_FILIAL_CODE ||
              'Поиск по коду филиала'
            }`}
            value={filialCode}
            onChange={(e) => setFilialCode(e.target.value)}
            allowClear
            color={inputTextColor}
          />
          <PhoneInput
            required
            defaultCountry="uz"
            placeholder={`${
              wordsListData?.SELLER_SEARCH_PHONE || 'Поиск по телефону'
            }`}
            value={phone}
            onChange={(phone) => setPhone(phone)}
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
          {/* <Input
            style={{ padding: '10px' }}
            // placeholder={`${wordsListData?.SELLER_SEARCH_PHONE || 'Поиск по телефону'
              }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            allowClear
            color={inputTextColor}
          /> */}
        </Box>
        <ComplexTable
          name={`${wordsListData?.TABLE_TITLE_PARTNER || 'Таблица торговцев'}`}
          thead={[
            wordsListData?.TABLE_TR || '№',
            wordsListData?.NAME || 'ИМЯ',
            wordsListData?.PHONE_NUMBER || 'ТЕЛЕФОН',
            // wordsListData?.ADDRESS || 'АДРЕС',
            wordsListData?.INN || 'ИНН',
            // wordsListData?.DATE || 'ДАТА',
            wordsListData?.EXCEL_MFO || 'МФО',
            // wordsListData?.BANK_ACCOUNT || 'БАНК СЧЕТ',
            role === 'ROLE_BANK' || wordsListData?.ACTIVE || 'АКТИВНЫЙ',
          ]}
          // buttonChild={
          //   <Button
          //     bg={bgColor}
          //     color={'white'}
          //     _hover={{ bg: hoverBgColor }}
          //     _active={{
          //       bg: hoverBgColor,
          //       transform: 'scale(0.98)',
          //     }}
          //     onClick={() => {
          //       setIsOpen(true);
          //     }}
          //   >
          //     {wordsListData?.ADD_PARTNER || 'Добавить торговца'}
          //   </Button>
          // }
        >
          {loading ? (
            <Tr>
              <Td textAlign={'center'} colSpan={8}>
                {wordsListData?.LOADING || 'Загрузка'}...
              </Td>
            </Tr>
          ) : merchantData && merchantData?.object ? (
            merchantData?.object.map((item, i) => (
              <Tr color={tableRowColor} key={i}>
                <Td>{page * 10 + i + 1}</Td>
                <Td minWidth={'250px'}>
                  {item.firstName} {item.lastName || '-'}
                </Td>
                <Td minWidth={'250px'}>
                  {item.phone
                    ? `+998 (${item.phone.slice(3, 5)}) ${item.phone.slice(
                        5,
                        8,
                      )} ${item.phone.slice(8, 10)} ${item.phone.slice(10)}`
                    : '-'}
                </Td>
                {/* <Td minWidth={'250px'}>{item.address ? item.address : '-'}</Td> */}
                <Td minWidth={'250px'}>{item.inn || '-'}</Td>
                {/* <Td minWidth={'250px'}>
                  {item.agreementDate ? item.agreementDate : '-'}
                </Td> */}
                <Td minWidth={'250px'}>{item.filial_code || '-'}</Td>
                {/* <Td minWidth={'250px'}>
                  {item.bankAccount ? item.bankAccount : '-'} 
                </Td> */}
                {role === 'ROLE_BANK' || ( 
                  <Td>
                    <Select
                      onChange={async (e) => {
                        await updateUserStatus({
                          userId: item.id,
                          status: e.target.value,
                          getFunction: getMerchant,
                        });
                      }}
                      width={'150px'}
                      value={item.status}
                    >
                      <option value="ACTIVE">{bgGenerator('ACTIVE')[1]}</option>
                      <option value="INACTIVE">
                        {bgGenerator('INACTIVE')[1]}
                      </option>
                    </Select>
                  </Td>
                )}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign={'center'} colSpan={10}>
                {wordsListData?.EXCEL_MERCHANT || ' '}{' '}
                {wordsListData?.NOT_FOUND || 'Не найдено'}
              </Td>
            </Tr>
          )}
        </ComplexTable>
        <Pagination
          showSizeChanger
          responsive={true}
          defaultCurrent={1}
          total={totalPage}
          onChange={(page, size) => {
            setPage(page - 1);
            setSize(size);
          }}
        />
      </SimpleGrid>
      <Modal
        size={'2xl'}
        isOpen={isOpen}
        onClose={() => {
          setData({
            legalName: '',
            legalAddress: '',
            tin: '',
            managerFio: '',
            bankName: '',
            bankBik: '',
            bankAccount: '',
            phone: '',
            password: '12345',
          });
          setErrors({});
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>{wordsListData?.ADD_PARTNER || 'Добавить торговца'}</Text>
          </ModalHeader>
          <ModalBody>
            <Grid
              gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
            >
              <FormControl isInvalid={!!errors?.legalName}>
                <FormLabel>
                  {wordsListData?.LEGAL_NAME || 'Юридическое имя'}
                </FormLabel>
                <Input
                  // placeholder="Legal Name"
                  value={data?.legalName || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, legalName: e.target.value }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.legalName}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.legalAddress}>
                <FormLabel>
                  {wordsListData?.LEGAL_ADDRESS || 'Юридический адрес'}
                </FormLabel>
                <Input
                  // placeholder="Legal Address"
                  value={data?.legalAddress || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      legalAddress: e.target.value,
                    }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.legalAddress}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.tin}>
                <FormLabel>{wordsListData?.INN || 'ИНН'}</FormLabel>
                <Input
                  // placeholder="INN"
                  maxLength={20}
                  value={data?.tin || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, tin: e.target.value }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.tin}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.managerFio}>
                <FormLabel>
                  {wordsListData?.MANAGER_FIO || 'ФИО менеджера'}
                </FormLabel>
                <Input
                  // placeholder="Manager FIO"
                  value={data?.managerFio || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, managerFio: e.target.value }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.managerFio}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.bankName}>
                <FormLabel>
                  {wordsListData?.BANK_NAME || 'Название банка'}
                </FormLabel>
                <Input
                  // placeholder="Bank Name"
                  value={data?.bankName || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, bankName: e.target.value }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.bankName}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.bankBik}>
                <FormLabel>{wordsListData?.EXCEL_MFO || 'МФО'}</FormLabel>
                <Input
                  maxLength={20}
                  // placeholder="Bank BIK"
                  value={data?.bankBik || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, bankBik: e.target.value }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.bankBik}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.bankAccount}>
                <FormLabel>
                  {wordsListData?.BANK_ACCOUNT || 'Банковский счёт'}
                </FormLabel>
                <Input
                  maxLength={40}
                  // placeholder="Bank Account"
                  value={data?.bankAccount || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bankAccount: e.target.value,
                    }))
                  }
                  color={inputTextColor}
                />
                {/* <FormErrorMessage>{errors?.bankAccount}</FormErrorMessage> */}
              </FormControl>
              <FormControl mb={4} isInvalid={!!errors?.phone}>
                <FormLabel>
                  {wordsListData?.PHONE_NUMBER || 'НОМЕР ТЕЛЕФОНА'}
                </FormLabel>
                {/* <InputGroup display={'flex'} alignItems={'center'}>
                  <InputLeftElement>
                    <Text fontSize="sm" fontWeight="500">
                      +998
                    </Text>
                  </InputLeftElement>
                  <Input
                    name="phone"
                    // placeholder={
                      // wordsListData?.PHONE_NUMBER_PLACEHOLDER ||
                      'Введите ваш телефон'
                    }
                    value={data?.phone || ''}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        phone: formatPhoneNumber(e.target.value),
                      }))
                    }
                    color={inputTextColor}
                  />
                </InputGroup> */}
                <PhoneInput
                  required
                  defaultCountry="uz"
                  value={data?.phone}
                  onChange={(phone) => {
                    setData((prev) => ({
                      ...prev,
                      phone: phone,
                    }));
                  }}
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
                {/* <FormErrorMessage>{errors?.phone}</FormErrorMessage> */}
              </FormControl>
              {/* <FormControl mb={4} isInvalid={!!errors?.password}>
                <FormLabel>{wordsListData?.PASSWORD || 'Пароль'}</FormLabel>
                <Input
                  // placeholder="Password"
                  type="password"
                  value={data?.password || ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  color={inputTextColor}
                />
                <FormErrorMessage>{errors?.password}</FormErrorMessage>
              </FormControl> */}
            </Grid>
          </ModalBody>
          {/* <ModalFooter>
            <Button
              mr={4}
              bg={'red'}
              color={'white'}
              _hover={{ bg: 'red.600' }}
              _active={{
                bg: 'red.600',
                transform: 'scale(0.98)',
              }}
              onClick={() => {
                setData({
                  legalName: '',
                  legalAddress: '',
                  tin: '',
                  managerFio: '',
                  bankName: '',
                  bankBik: '',
                  bankAccount: '',
                  phone: '',
                  password: '12345',
                });
                setErrors({});
                onClose();
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
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  );
}

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
import {Pagination} from 'antd';
import {limit_price_seller, seller_order_get} from 'contexts/api';
import {admin_notification_count} from 'contexts/api';
import {order_cancel} from 'contexts/api';
import {terminal_order_get} from 'contexts/api';
import {admin_order_get} from 'contexts/api';
import {seller_notification_count} from 'contexts/api';
import {terminal_notification_count} from 'contexts/api';
import {order_create} from 'contexts/api';
import {globalPostFunction} from 'contexts/logic-function/globalFunktion';
import {globalGetFunction} from 'contexts/logic-function/globalFunktion';
import {NotificationStore} from 'contexts/state-management/notification/notificationStore';
import {PaymentStore} from 'contexts/state-management/payment/paymentStore';
import {setConfig} from 'contexts/token';
import {QRCodeSVG} from 'qrcode.react';
import React, {useEffect, useRef, useState} from 'react';
import {FaEye} from 'react-icons/fa';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import {useTranslation} from 'react-i18next';
import {LanguageStore} from 'contexts/state-management/language/languageStore';
import {order_confirm} from 'contexts/api';
import {terminal_get_list} from 'contexts/api';
import {SocketStore} from 'contexts/state-management/socket/socketStore';
import {consoleClear} from 'contexts/toast-message';
import {io} from 'socket.io-client';

// const socket = io('https://socket.qrpay.uz', {
//   secure: true,
//   transports: ['websocket', 'polling'], // WebSocket va Pollingni qo'llash
// });

export default function SellerOrder() {
    const {
        setPaymentData,
        paymentData,
        setPage,
        totalPage,
        page,
        setTotalPages,
        modalOpen,
        setModalOpen,
        terminalData,
        setTerminalData,
        size,
        setSize,
        createLoading,
        setCreateLoading,
    } = PaymentStore();

    const {isOpen, onOpen, onClose} = useDisclosure();
    const {
        isOpen: isCancelModal,
        onOpen: openCancelModal,
        onClose: closeCancelModal,
    } = useDisclosure();
    const {
        isOpen: isConfirmModal,
        onOpen: openConfirmModal,
        onClose: closeConfirmModal,
    } = useDisclosure();
    const {setCountData} = NotificationStore();

    const [detailData, setDetailData] = useState(null);
    // const [postData, setPostData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreate, setIsCreate] = useState(true);
    const [sellerLimitData, setSellerLimitData] = useState(null);

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const {wordsListData} = LanguageStore();

    const role = sessionStorage.getItem('ROLE');
    const inputTextColor = useColorModeValue('gray.800', 'white');
    const bgColor = useColorModeValue('#422AFB', '#7551FF');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const navbarIcon = useColorModeValue('#1B255A', 'white');

    const hoverBgColor = useColorModeValue('blue.600', 'purple.600');

    const thead = [
        wordsListData?.TABLE_TR || 'T/r',
        // wordsListData?.SELLER_NAME || 'Название компании',
        wordsListData?.QR_AMOUNT || 'QR - сумма',
        wordsListData?.EXCEL_RATE || 'Валюта',
        // wordsListData?.POS_ID || 'ИД терминала',
        wordsListData?.DATE_CREATED || 'Дата создания',
        // wordsListData?.VALID_TILL || 'Срок действия',
        wordsListData?.STATUS || 'Статус',
        wordsListData?.ACTION || 'Действия',
    ];

    const [formValues, setFormValues] = useState({
        amount: '',
        terminalId:
            terminalData && terminalData.length > 0 ? terminalData[0].id : 0,
    });

    const [formErrors, setFormErrors] = useState({
        amount: '',
        terminalId: 0,
    });

    const resetValue = () => {
        setFormValues({
            amount: '',
            terminalId:
                terminalData && terminalData.length > 0 ? terminalData[0].id : 0,
        });
        setFormErrors({
            amount: '',
            terminalId: 0,
        });
    };

    useEffect(() => {
        setConfig();
        getFunction().then(() => '');
        globalGetFunction({
            url: terminal_get_list,
            setData: setTerminalData,
            setTotalElements: setTotalPages,
        }).then(() => '');
    }, []);

    useEffect(() => {
        if (modalOpen) {
            globalGetFunction({url: limit_price_seller, setData: setSellerLimitData})
            openModal();
        }
    }, [modalOpen]);

    const openModal = () => onOpen();

    useEffect(() => {
        globalGetFunction({
            url:
                role === 'ROLE_TERMINAL'
                    ? `${terminal_order_get}?page=${page}&size=${size}`
                    : role === 'ROLE_SELLER'
                        ? `${seller_order_get}?page=${page}&size=${size}`
                        : role === 'ROLE_SUPER_ADMIN'
                            ? `${admin_order_get}?page=${page}&size=${size}`
                            : '',
            setLoading: setCreateLoading,
            setData: setPaymentData,
            setTotalElements: setTotalPages,
        });
    }, [page, size]);

    useEffect(() => {
        if (detailData) {
            setIsCreate(false);
            resetValue();
        }
        // console.log('detailData ishladi', detailData);
    }, [detailData]);

    useEffect(() => {
        if (terminalData?.length > 0) {
            setFormValues((prevValues) => ({
                ...prevValues,
                terminalId: terminalData[0].id,
            }));
            // console.log("terminalData[0].id", terminalData[0].id);
        }
    }, [terminalData]);

    const getFunction = async () => {
        await globalGetFunction({
            url:
                role === 'ROLE_TERMINAL'
                    ? `${terminal_order_get}?page=${page}&size=${size}`
                    : role === 'ROLE_SELLER'
                        ? `${seller_order_get}?page=${page}&size=${size}`
                        : role === 'ROLE_SUPER_ADMIN'
                            ? `${admin_order_get}?page=${page}&size=${size}`
                            : '',
            setLoading: setCreateLoading,
            setData: setPaymentData,
            setTotalElements: setTotalPages,
        });
        await globalGetFunction({
            url:
                role === 'ROLE_TERMINAL'
                    ? terminal_notification_count
                    : role === 'ROLE_SELLER'
                        ? seller_notification_count
                        : role === 'ROLE_SUPER_ADMIN'
                            ? admin_notification_count
                            : '',
            setData: setCountData,
        });
    };

    const bgGenerator = (status) => {
        if (status === 'WAIT')
            return ['orange', wordsListData?.STATUS_WAIT || 'Ожидание'];
        else if (status === 'COMPLETED')
            return ['green', wordsListData?.STATUS_CONFIRMED || 'Подтвержден'];
        else if (status === 'CANCEL')
            return ['red', wordsListData?.STATUS_CANCELED || 'Отменен'];
        else if (status === 'NEW')
            return ['blue', wordsListData?.STATUS_NEW || 'Новый'];
        else if (status === 'RETURNED')
            return ['purple', wordsListData?.STATUS_RETURNED || 'Возврат'];
        else return ['gray', wordsListData?.STATUS_UNKNOWN || 'Неизвестно'];
    };

    const formatNumber = (value) => {
        return value.replace(/[^0-9]/g, "")
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        // Format the value for display (for 'amount' field only)
        const formattedValue = name === 'amount' ? formatNumber(value) : value;

        // Update form values
        setFormValues({
            ...formValues,
            [name]: formattedValue,
        });

        // Validate input and handle errors
        const errors = {...formErrors};

        if (name === 'terminalId') {
            const numericValue = Number(value); // Raqamga aylantirish
            if (!numericValue || numericValue <= 0) {
                errors[name] = wordsListData?.RECUIRED_AMOUNT || "Необходимо указать значение больше 0";
            } else {
                delete errors[name];
            }
        } else if (name === 'amount') {
            if (!value.trim()) {
                errors[name] = wordsListData?.RECUIRED_AMOUNT || "Необходимо указать значение";
            } else {
                const numericValue = parseInt(value.replace(/,/g, ''), 10);

                if (numericValue < sellerLimitData?.min) {
                    errors[name] = `${wordsListData?.LIMIT_PRICE_MIN_THEAD} ${sellerLimitData?.min?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}` || `Минимальная стоимость ${sellerLimitData?.min?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
                } else if (numericValue > sellerLimitData?.max) {
                    errors[name] = `${wordsListData?.LIMIT_PRICE_MAX_THEAD} ${sellerLimitData?.max?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}` || `Максимальная стоимость ${sellerLimitData?.max?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
                } else {
                    delete errors[name];
                }
            }
        }

        setFormErrors(errors);
    };

    const handleSave = () => {
        const errors = {};

        Object.keys(formValues).forEach((key) => {
            const value = String(formValues[key] || '').trim(); // terminalId qiymatini stringga aylantirish

            if (key === 'terminalId') {
                // terminalId faqat raqam bo'lishi va 0 dan katta bo'lishi kerak
                const numericValue = Number(value);
                if (!numericValue || numericValue < 1) {
                    errors[key] = wordsListData?.RECUIRED_AMOUNT || "Необходимо указать значение больше 0";
                }
            } else if (key === 'amount') {
                if (!value) {
                    errors[key] = wordsListData?.RECUIRED_AMOUNT || "Необходимо указать значение";
                } else {
                    const numericValue = parseInt(value.replace(/,/g, ''), 10); // "," belgilarini olib tashlash va raqamga aylantirish
                    if (numericValue < sellerLimitData?.min) {
                        errors[key] = `${wordsListData?.LIMIT_PRICE_MIN_THEAD} ${sellerLimitData?.min?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}` || `Минимальная стоимость ${sellerLimitData?.min?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
                    } else if (numericValue > sellerLimitData?.max) {
                        errors[key] = `${wordsListData?.LIMIT_PRICE_MAX_THEAD} ${sellerLimitData?.max?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}` || `Максимальная стоимость ${sellerLimitData?.max?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
                    }
                }
            } else if (!value) {
                // Boshqa barcha maydonlar uchun umumiy tekshirish
                errors[key] = wordsListData?.RECUIRED_AMOUNT || "Необходимо указать значение";
            }
        });

        // Agar hech qanday xatolik bo'lmasa, post qilish jarayoni
        if (Object.keys(errors).length === 0) {
            globalPostFunction({
                url: `${order_create}`,
                postData: {
                    amount: +formValues.amount.replace(/,/g, ''), // Numberga aylantirish va "," belgilarini olib tashlash
                    terminalId: String(formValues.terminalId || '').trim(), // String format va bosh joylarni olib tashlash
                },
                setLoading: setIsLoading,
                getFunction: getFunction,
                setData: setDetailData,
            });
        } else setFormErrors(errors); // Xatoliklarni yangilash
    };

    return (
        <Box pt={{base: '130px', md: '80px', xl: '80px'}}>
            <SimpleGrid
                mb="20px"
                columns={{sm: 1}}
                spacing={{base: '20px', xl: '20px'}}
            >
                <ComplexTable
                    name={`${wordsListData?.PAYMENT_TABLE_TITLE || 'Таблица платежей'}`}
                    thead={thead}
                    buttonChild={
                        role !== 'ROLE_SUPER_ADMIN' && (
                            <Button
                                bg={bgColor}
                                color={'white'}
                                _hover={{bg: hoverBgColor}}
                                _active={{
                                    bg: hoverBgColor,
                                    transform: 'scale(0.98)',
                                }}
                                onClick={() => {
                                    setIsCreate(true);
                                    onOpen();
                                }}
                            >
                                {wordsListData?.CREATE_PAYMENT || 'Создать платеж'}
                            </Button>
                        )
                    }
                >
                    {createLoading ? (
                        <Tr>
                            <Td textAlign="center" colSpan={thead.length}>
                                {wordsListData?.LOADING || 'Загрузка'}...
                            </Td>
                        </Tr>
                    ) : paymentData && paymentData?.object ? (
                        paymentData.object.map((item, i) => (
                            <Tr key={item.id}>
                                <Td>{(page * 10) + i + 1}</Td>
                                {/* <Td>
                  {item.dateCreate
                    ? moment(item.dateCreate).format('DD.MM.YYYY HH:mm:ss')
                    : '-'}
                </Td> */}
                                <Td minWidth={'250px'}>{item.chequeAmount || '-'}</Td>
                                <Td minWidth={'250px'}>{item.rate || '-'}</Td>
                                {/* <Td>
                  {item.datePin
                    ? moment(item.datePin).format('DD.MM.YYYY HH:mm:ss')
                    : '-'}
                </Td> */}
                                {/* <Td minWidth={'250px'}>{item.posId || '-'}</Td> */}
                                <Td minWidth={'250px'}>
                                    {item.cheque_created_at
                                        ? item.cheque_created_at.slice(0, 10) +
                                        ' ' +
                                        item.cheque_created_at.slice(11, 16)
                                        : '-'}
                                </Td>
                                {/* <Td minWidth={'250px'}>
                  {item.validtil
                    ? item.validtil.slice(0, 10) +
                      ' ' +
                      item.validtil.slice(11, 16)
                    : '-'}
                </Td> */}
                                <Td alignSelf="flex-start">
                                    <Text
                                        background={'#ECEFF8'}
                                        color={bgGenerator(item?.status)[0]}
                                        py="10px"
                                        fontWeight="700"
                                        borderRadius="10px"
                                        textAlign={'center'}
                                        width={'130px'}
                                    >
                                        {bgGenerator(item?.status)[1]}
                                    </Text>
                                </Td>
                                <Td
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'flex-start'}
                                    minHeight={'90px'}
                                    gap={'10px'}
                                >
                                    <Box ms={3}>
                                        <button
                                            onClick={() => {
                                                setIsCreate(false);
                                                setDetailData(item);
                                                onOpen();
                                            }}
                                        >
                                            <FaEye color={navbarIcon} size={23}/>
                                        </button>
                                    </Box>
                                    {/* {role !== 'ROLE_SUPER_ADMIN' && (
                    <>
                      <Box ms={3}>
                        <button
                          onClick={() => {
                            setDetailData(item);
                            openCancelModal();
                          }}
                        >
                          <RiRefund2Line color={'red'} size={23} />
                        </button>
                      </Box>
                      <Box ms={3}>
                        <button
                          onClick={() => {
                            setDetailData(item);
                            openConfirmModal();
                          }}
                        >
                          <IoCheckmarkDoneSharp color={'green'} size={23} />
                        </button>
                      </Box>
                    </>
                  )} */}
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td textAlign="center" colSpan={thead.length}>
                                {wordsListData?.PAYMENT_NOTFOUND || 'Платеж не найден'}
                            </Td>
                        </Tr>
                    )}
                </ComplexTable>
            </SimpleGrid>
            {paymentData && paymentData?.object && (
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
            <Modal
                size={isCreate ? 'lg' : '3xl'}
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setModalOpen(false);
                    resetValue();
                    setIsCreate(true);
                    setDetailData(null);
                }}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        {isCreate ? wordsListData?.CREATE_PAYMENT || 'Создать платеж' : ''}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        {isCreate ? (
                            <>
                                <FormControl mt={4} isInvalid={!!formErrors.terminalId}>
                                    <FormLabel>
                                        {wordsListData?.SELECT_TERMINAL || 'Выберите терминал'}
                                    </FormLabel>
                                    <Select
                                        name="terminalId"
                                        value={terminalData?.length > 0 ? terminalData[0].id : formValues.terminalId}
                                        onChange={handleChange}
                                    >
                                        {terminalData && terminalData?.length > 0 ? terminalData?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        )) : (
                                            <option disabled value={0}>
                                                {wordsListData?.NOT_FOUND || 'Не найдено'}
                                            </option>
                                        )}
                                    </Select>
                                    {/* {formErrors.terminalId && formValues.terminalId !== 0 && (
                    <Text color="red.500" fontSize="sm">   
                      {formErrors.terminalId}   
                    </Text>       
                  )} */}
                                </FormControl>
                                <FormControl mt={4} isInvalid={!!formErrors.amount}>
                                    <FormLabel>
                                        {wordsListData?.EXCEL_AMOUNT || 'Сумма'}
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        name="amount"
                                        placeholder={
                                            wordsListData?.ENTER_THE_AMOUNT || 'Введите сумму'
                                        }
                                        value={formValues.amount ? formValues.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value.replace(/\D/g, '');
                                            if (newValue.length <= 9) {
                                                handleChange({target: {name: 'amount', value: newValue}});
                                            }
                                        }}
                                        color={inputTextColor}
                                    />
                                    {formErrors.amount && (
                                        <Text color="red.500" fontSize="sm">
                                            {formErrors.amount}
                                        </Text>
                                    )}
                                </FormControl>

                                {/* <FormControl mt={4} isInvalid={!!formErrors.phone}>
                  <FormLabel>
                    {wordsListData?.PHONE_NUMBER || 'Телефон'}
                  </FormLabel>
                  <PhoneInput
                  disableCountryCodeEdit
                    required
                    defaultCountry="ru"
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
                </FormControl> */}
                            </>
                        ) : (
                            <Grid
                                overflow={'hidden'}
                                templateColumns={{
                                    base: 'repeat(1, 1fr)',
                                    md: 'repeat(2, 1fr)',
                                }}
                                gap={6}
                                px={5}
                            >
                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    gap={20}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.QR_AMOUNT || 'QR - сумма'}:{' '}
                                    </Text>
                                    <Flex gap={20} fontSize={'17px'}>
                                        <Box>{detailData?.chequeAmount + ' UZS  ' || '-'},</Box>
                                        <Box>{detailData?.qrAmount + '  RUB ' || '-'}</Box>
                                    </Flex>
                                </GridItem>
                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    gap={20}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.EXCEL_RATE || 'Курс'}:{' '}
                                    </Text>
                                    <Text fontSize={'17px'}>
                                        {detailData?.rate || detailData?.rate === 0
                                            ? detailData.rate
                                            : '-'}
                                    </Text>
                                </GridItem>
                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.PARTNER || 'Партнер'}:
                                    </Text>
                                    <Text fontSize={'17px'}>{detailData?.partner || '-'}</Text>
                                </GridItem>
                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    pe={5}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={2}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.STATUS || 'Статус'}:
                                    </Text>
                                    <Text
                                        background={'#ECEFF8'}
                                        color={bgGenerator(detailData?.status)[0]}
                                        py="10px"
                                        fontWeight="700"
                                        borderRadius="10px"
                                        textAlign={'center'}
                                        width={'130px'}
                                    >
                                        {bgGenerator(detailData?.status)[1]}
                                    </Text>
                                </GridItem>
                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.DATE_CREATED || 'Дата создания'}:
                                    </Text>
                                    <Text fontSize={'17px'}>
                                        {detailData?.cheque_created_at ||
                                        detailData?.cheque_created_at === 0
                                            ? `${detailData?.cheque_created_at.slice(
                                                0,
                                                10,
                                            )} ${detailData?.cheque_created_at.slice(11, 16)}`
                                            : '-'}
                                    </Text>
                                </GridItem>
                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'}>
                                        {wordsListData?.PURPOSE || 'Цель'}:
                                    </Text>
                                    <Text ml={5} fontSize={'17px'}>
                                        {detailData?.purpose || '-'}
                                    </Text>
                                </GridItem>

                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.EXIT_ID || 'EXIT ID'}:
                                    </Text>
                                    <Text fontSize={'17px'}>{detailData?.ext_id || '-'}</Text>
                                </GridItem>

                                <GridItem
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    flexDirection={{base: 'column', md: 'row'}}
                                    justifyContent={'space-between'}
                                    pe={5}
                                    borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <Text fontSize={'17px'} fontWeight={'700'}>
                                        {wordsListData?.REDIRECTED_URL || 'Redirect URL'}:
                                    </Text>
                                    <Text fontSize={'17px'}>
                                        {detailData?.redirect_url || '-'}
                                    </Text>
                                </GridItem>
                                <GridItem
                                    width={'100%'}
                                    colSpan={{base: 1, md: 2}}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    // borderBottom="1px solid #E0E5F2"
                                    pb={1}
                                >
                                    <QRCodeSVG
                                        value={detailData && detailData?.url ? detailData?.url : ''}
                                        renderAs="canvas"
                                    />
                                </GridItem>
                            </Grid>
                        )}
                    </ModalBody>

                    <ModalFooter display={'flex'} gap={'10px'}>
                        {isCreate && (
                            <>
                                <Button
                                    bg={'red'}
                                    color={'white'}
                                    _hover={{bg: 'red.600'}}
                                    _active={{
                                        bg: 'red.600',
                                        transform: 'scale(0.98)',
                                    }}
                                    onClick={() => {
                                        onClose();
                                        setModalOpen(false);
                                        resetValue();
                                        setIsCreate(true);
                                        setDetailData(null);
                                    }}
                                >
                                    {wordsListData?.CANCEL || 'Отмена'}
                                </Button>
                                <Button
                                    bg={'blue'}
                                    color={'white'}
                                    _hover={{bg: 'blue.600'}}
                                    _active={{
                                        bg: 'blue.600',
                                        transform: 'scale(0.98)',
                                    }}
                                    onClick={() => {
                                        handleSave()
                                        console.log("xfguiogfxfghjhg jghjohgghihhjojhhd jiojjcoihrr ", formValues.terminalId);
                                        console.log("xfguiogfxfghjhg jghjohgghihhjojhhd ", formValues.amount);

                                    }}
                                    isLoading={isLoading}
                                >
                                    {wordsListData?.SAVE || 'Сохранить'}
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isCancelModal}
                onClose={() => {
                    closeCancelModal();
                }}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        {wordsListData?.CANCEL_MODAL || 'Отмена платежа'}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {wordsListData?.REFUND_MODAL_TEXT ||
                            'Вы уверены, что хотите отменить платеж?'}
                    </ModalBody>

                    <ModalFooter display={'flex'} gap={'10px'}>
                        <Button
                            bg={'red'}
                            color={'white'}
                            _hover={{bg: 'red.600'}}
                            _active={{
                                bg: 'red.600',
                                transform: 'scale(0.98)',
                            }}
                            mr={3}
                            onClick={closeCancelModal}
                        >
                            {wordsListData?.CLOSE || 'Закрыть'}
                        </Button>
                        <Button
                            bg={'blue'}
                            color={'white'}
                            _hover={{bg: 'blue.600'}}
                            _active={{
                                bg: 'blue.600',
                                transform: 'scale(0.98)',
                            }}
                            onClick={() => {
                                globalPostFunction({
                                    url: `${order_cancel}?ext_id=${detailData && detailData.ext_id ? detailData.ext_id : 0
                                    }`,
                                    postData: {},
                                    getFunction: () => {
                                        getFunction();
                                        closeCancelModal();
                                        onClose();
                                    },
                                });
                            }}
                        >
                            {wordsListData?.CONTINUE || 'Продолжить'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isConfirmModal}
                onClose={() => {
                    closeConfirmModal();
                }}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        {wordsListData?.CONFIRM_MODAL || 'Подтверждение платежа'}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {wordsListData?.CONFIRM_MODAL_TEXT ||
                            'Вы уверены, что хотите подтвердить платеж?'}
                    </ModalBody>

                    <ModalFooter display={'flex'} gap={'10px'}>
                        <Button
                            bg={'red'}
                            color={'white'}
                            _hover={{bg: 'red.600'}}
                            _active={{
                                bg: 'red.600',
                                transform: 'scale(0.98)',
                            }}
                            mr={3}
                            onClick={closeConfirmModal}
                        >
                            {wordsListData?.CLOSE || 'Закрыть'}
                        </Button>
                        <Button
                            bg={'blue'}
                            color={'white'}
                            _hover={{bg: 'blue.600'}}
                            _active={{
                                bg: 'blue.600',
                                transform: 'scale(0.98)',
                            }}
                            onClick={() => {
                                globalPostFunction({
                                    url: `${order_confirm}${detailData && detailData.id ? detailData.id : 0
                                    }`,
                                    postData: {},
                                    getFunction: () => {
                                        getFunction();
                                        closeConfirmModal();
                                        onClose();
                                    },
                                });
                            }}
                        >
                            {wordsListData?.CONTINUE || 'Продолжить'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

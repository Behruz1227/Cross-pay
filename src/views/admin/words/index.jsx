// src/pages/PrivacyTermsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Text,
  useColorModeValue,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Grid,
  FormLabel,
  Input,
  ModalFooter,
  Flex,
} from '@chakra-ui/react';
import WebWords from './web';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { words_get } from 'contexts/api';
import { globalPostFunction } from 'contexts/logic-function/globalFunktion';
import { words_post } from 'contexts/api';
import toast from 'react-hot-toast';
import { words_get_data } from 'contexts/api';
import { Pagination } from 'antd';
import { debounce } from 'lodash';

const WordsPage = () => {
  const [wordsWebData, setWordsWeb] = useState(null)
  const { wordsListData, setLanguageData, setWordsListData } = LanguageStore();
  const [status, setStatus] = useState("WEB")
  const [loading, setLoading] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputTextColor = useColorModeValue('gray.800', 'white');
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const initialData = {
    key: '',
    tavsif: '',
    uz: '',
    ru: '',
  };

  // console.log("totalPage", totalPage)

  const [formValues, setFormValues] = useState(initialData);
  // const [terminalNewUsers, setTerminalNewUsers] = useState([terminalNewUsersInitial]);

  const [formErrors, setFormErrors] = useState(initialData);

  const bgColor = useColorModeValue('#422AFB', '#7551FF');
  const textColor = useColorModeValue('white', 'white');
  const hoverBgColor = useColorModeValue('blue.600', 'purple.600');

  useEffect(() => {
    globalGetFunction({
      url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
      setData: setWordsWeb,
      setLoading: setLoading,
      setTotalElements: setTotalPage,
    });
  }, []);

  useEffect(() => {
    if (status) { 
      globalGetFunction({
        url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
        setData: setWordsWeb,
        setLoading: setLoading,
        setTotalElements: setTotalPage,
      });
    }
  }, [status, page, size, search]);

  const resetValue = () => {
    setFormValues(initialData);
    setFormErrors(initialData);
  };

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
      if (formValues[key].trim() === '')
        errors[key] = `${key} ${wordsListData?.IS_REQUIRED}`;
    });
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      globalPostFunction({
        url: `${words_post}${status}`,
        postData: {
          id: 1,
          key: formValues.key,
          uz: formValues.uz,
          ru: formValues.ru,
          description: formValues.tavsif,
        },
        getFunction: () => {
          globalGetFunction({
            url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
            setData: setWordsWeb,
            setLoading: setLoading,
            setTotalElements: setTotalPage,
          });
          globalGetFunction({
            url: `${words_get_data}WEB`,
            setData: setWordsListData,
          });
          onClose();
          resetValue();
        },
      });
    } else setFormErrors(errors);
  };

  const onChange = (page) => {
    setPage(page - 1);
  };

  return (
    <Container maxW="container.xl" pt={20}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={10}
        mt={15}
      >
        <Heading as="h1" size="xl">
          {wordsListData?.PANEL_WORD || 'Слова'}
        </Heading>
        <Button
          bg={bgColor}
          color={textColor}
          _hover={{ bg: hoverBgColor }}
          _active={{
            bg: hoverBgColor,
            transform: 'scale(0.98)',
          }}
          onClick={() => {
            if (status === 'BOT') {
              toast.error("Siz botga so'z qo'sha olmaysiz.");
            } else {
              setWordsWeb(null);
              onOpen();
            }
          }}
        >
          {wordsListData?.ADD_WORD || 'Добавить слово'}
        </Button>
      </Box>
      <Flex gap={'10px'} alignItems={'center'} flexDirection={'column'} width={'100%'} justifyContent={'center'}>
        <Text fontWeight={'800'} fontSize={16}>{wordsListData?.SEARCH_WORD || 'Поиск по слову'}</Text>
        <Input
          placeholder={wordsListData?.SEARCH_WORD || 'Поиск по слову'}
          borderColor={inputTextColor}
          textColor={inputTextColor}
          maxW={'300px'}
          type='text'
          onChange={debounce((e) => {
            setSearch(e.target.value);
          }, 2000)}
        />
      </Flex>
      <Tabs variant="line" colorScheme="teal">
        <TabList display={'flex'} justifyContent={'center'}>
          <Tab
            onClick={() => {
              setWordsWeb(null);
              setStatus('WEB');
            }}
            color="#422AFB"
            fontWeight={'800'}
            fontSize={20}
          >
            {wordsListData?.WEB || 'Веб'}
          </Tab>
          <Tab
            onClick={() => {
              setWordsWeb(null);
              setStatus('BOT');
            }}
            color="#422AFB"
            fontWeight={'800'}
            fontSize={20}
          >
            {wordsListData?.BOT || 'Бот'}
          </Tab>
          <Tab
            onClick={() => {
              setWordsWeb(null);
              setStatus('MOBILE');
            }}
            color="#422AFB"
            fontWeight={'800'}
            fontSize={20}
          >
            {wordsListData?.MOBILE || 'Мобильный'}
          </Tab>
        </TabList>

        <TabPanels justifyContent={'center'}>
          <TabPanel>
            {loading ? (
              <Box>
                <Text textAlign={'center'}>
                  {wordsListData?.LOADING || 'Загрузка...'}
                </Text>
              </Box>
            ) : wordsWebData && wordsWebData?.object?.length > 0 ? (
              wordsWebData?.object?.map((word, i) => (
                <WebWords
                  getFunction={() => {
                    globalGetFunction({
                      url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
                      setData: setWordsWeb,
                      setLoading: setLoading,
                      setTotalElements: setTotalPage,
                    });
                  }}
                  key={i}
                  item={word}
                />
              ))
            ) : (
              <Box>
                <Text textAlign={'center'}>
                  {wordsListData?.WORDS || 'Слова'}{' '}
                  {wordsListData?.NOT_FOUND || 'Данные не найдены'}
                </Text>
              </Box>
            )}
          </TabPanel>
          <TabPanel>
            {loading ? (
              <Box>
                <Text textAlign={'center'}>
                  {wordsListData?.LOADING || 'Загрузка...'}
                </Text>
              </Box>
            ) : wordsWebData && wordsWebData?.object?.length > 0 ? (
              wordsWebData?.object?.map((word, i) => (
                <WebWords
                  getFunction={() => {
                    globalGetFunction({
                      url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
                      setData: setWordsWeb,
                      setLoading: setLoading,
                      setTotalElements: setTotalPage,
                    });
                  }}
                  key={i}
                  item={word}
                />
              ))
            ) : (
              <Box>
                <Text textAlign={'center'}>
                  {wordsListData?.WORDS || 'Слова'}{' '}
                  {wordsListData?.NOT_FOUND || 'Данные не найдены'}
                </Text>
              </Box>
            )}
          </TabPanel>
          <TabPanel>
            {loading ? (
              <Box>
                <Text textAlign={'center'}>
                  {wordsListData?.LOADING || 'Загрузка...'}
                </Text>
              </Box>
            ) : wordsWebData && wordsWebData.object?.length > 0 ? (
              wordsWebData.object?.map((word, i) => (
                <WebWords
                  getFunction={() => {
                    globalGetFunction({
                      url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
                      setData: setWordsWeb,
                      setLoading: setLoading,
                      setTotalElements: setTotalPage,
                    });
                  }}
                  key={i}
                  item={word}
                />
              ))
            ) : (
              <Box>
                <Text textAlign={'center'}>
                  {wordsListData?.WORDS || 'Слова'}{' '}
                  {wordsListData?.NOT_FOUND || 'Данные не найдены'}
                </Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Pagination
        showSizeChanger={true}
        responsive={true}
        defaultCurrent={1}
        total={totalPage}
        onChange={onChange}
        onShowSizeChange={(current, pageSize) => {
          setSize(pageSize)
          setPage(0)
          console.log("current", current)
          console.log("pageSize", pageSize)
        }}
      />
      <>

        <Modal
          size={'3xl'}
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            globalGetFunction({
              url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
              setData: setWordsWeb,
              setLoading: setLoading,
              setTotalElements: setTotalPage,
            });
            resetValue();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {wordsListData?.ADD_WORD || 'Добавить слово'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} px={5}>
                <FormControl mt={4} isInvalid={!!formErrors.key}>
                  <FormLabel>{wordsListData?.KEY || 'Ключ'}</FormLabel>
                  <Input
                    name="key"
                    ref={initialRef}
                    placeholder={
                      wordsListData?.KEY_PLACEHOLDER || 'Введите ключ'
                    }
                    value={formValues.key}
                    onChange={handleChange}
                    color={inputTextColor}
                  />
                  {formErrors.key && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.key}
                    </Text>
                  )}
                </FormControl>
                <FormControl mt={4} isInvalid={!!formErrors.tavsif}>
                  <FormLabel>
                    {wordsListData?.DESCRIPTION || 'Описание'}
                  </FormLabel>
                  <Input
                    name="tavsif"
                    placeholder={
                      wordsListData?.DESCRIPTION_PLACEHOLDER ||
                      'Введите Описание'
                    }
                    value={formValues.tavsif}
                    onChange={handleChange}
                    color={inputTextColor}
                  />
                  {formErrors.tavsif && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.tavsif}
                    </Text>
                  )}
                </FormControl>
                <FormControl mt={4} isInvalid={!!formErrors.uz}>
                  <FormLabel>{wordsListData?.UZBEK || 'Уз'}</FormLabel>
                  <Input
                    name="uz"
                    placeholder={
                      wordsListData?.UZBEK_PLACEHOLDER ||
                      'Введите узбекский текст'
                    }
                    value={formValues.uz}
                    onChange={handleChange}
                    color={inputTextColor}
                  />
                  {formErrors.uz && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.uz}
                    </Text>
                  )}
                </FormControl>
                <FormControl mt={4} isInvalid={!!formErrors.ru}>
                  <FormLabel>{wordsListData?.RUSSIAN || 'Ру'}</FormLabel>
                  <Input
                    name="ru"
                    placeholder={
                      wordsListData?.RUSSIAN_PLACEHOLDER ||
                      'Введите русский текст'
                    }
                    value={formValues.ru}
                    onChange={handleChange}
                    color={inputTextColor}
                  />
                  {formErrors.ru && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.ru}
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
                  globalGetFunction({
                    url: `${words_get}${status}${search ? `&nameUzOrRU=${search}` : ''}&page=${page}&size=${size}`,
                    setData: setWordsWeb,
                    setLoading: setLoading,
                    setTotalElements: setTotalPage,
                  });
                  resetValue();
                }}>{wordsListData?.CANCEL || "Отмена"}</Button>
              <Button
                bg={'blue'}
                color={'white'}
                _hover={{ bg: 'blue.600' }}
                _active={{
                  bg: 'blue.600',
                  transform: 'scale(0.98)',
                }}
                onClick={handleSave}>
                {wordsListData?.SAVE || "Сохранить"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Container>
  );
};

export default WordsPage;

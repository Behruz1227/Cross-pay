// Chakra imports
import {
  Button,
  Flex,
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
import { Pagination } from 'antd';
// Assets
import Project1 from 'assets/img/profile/notification.png';
// Custom components
import Card from 'components/card/Card.js';
import {
  seller_notification_count,
  terminal_notification,
  delete_notification,
  isRead_notification,
  admin_notification_count,
  terminal_notification_count,
  admin_notification,
  seller_notification,
} from 'contexts/api';
import { globalPostFunction } from 'contexts/logic-function/globalFunktion';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { NotificationStore } from 'contexts/state-management/notification/notificationStore';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { MdDeleteSweep } from 'react-icons/md';
import Project from './Project';
import { LanguageStore } from 'contexts/state-management/language/languageStore';

export default function Projects() {
  const {
    setNotificationData,
    notificationData,
    loading,
    setLoading,
    setCountData,
    setPage,
    totalPage,
    page,
    setTotalPages,
  } = NotificationStore();

  const [selectedIds, setSelectedIds] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wordsListData } = LanguageStore();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const navbarIcon = useColorModeValue('#1B255A', 'white');
  const role = sessionStorage.getItem('ROLE');
  const bg = useColorModeValue('white', 'navy.700');


  useEffect(() => {
    getFunction();
  }, []);

  useEffect(() => {
    globalGetFunction({
      url:
        role === 'ROLE_TERMINAL'
          ? terminal_notification
          : role === 'ROLE_SELLER'
          ? seller_notification
          : role === 'ROLE_SUPER_ADMIN'
          ? admin_notification
          : '',
      setData: setNotificationData,
      setLoading: setLoading,
      setTotalElements: setTotalPages,
      page: page,
    });
  }, [page]);

  // console.log("notificationData", notificationData);

  const getFunction = async () => {
    await globalGetFunction({
      url:
        role === 'ROLE_TERMINAL'
          ? terminal_notification
          : role === 'ROLE_SELLER'
          ? seller_notification
          : role === 'ROLE_SUPER_ADMIN'
          ? admin_notification
          : '',
      setData: setNotificationData,
      setLoading: setLoading,
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
      setLoading: setLoading,
    });
  };

  const handleSelectIsReadIds = async () => {
    if (notificationData.object) {
      const ids = await notificationData.object
        .filter((item) => !item.isRead)
        .map((item) => item.id);

      globalPostFunction({
        url: isRead_notification,
        postData: ids.length > 0 ? { ids: ids } : { ids: [] },
        setLoading: setLoading,
        getFunction: getFunction,
      });
    }
  };

  const handleSelectAllIds = () => {
    if (notificationData.object) {
      const ids = notificationData.object.map((item) => item.id);
      setSelectedIds(ids);
    }
  };

  const itemRender = (_, type, originalElement) => {
    if (type === 'page') {
      return (
        <a className="shadow-none dark:bg-[#9c0a36] dark:text-white border dark:border-[#9c0a36] border-black rounded no-underline">
          {originalElement}
        </a>
      );
    }
    return originalElement;
  };

  const onChange = (page, size) => setPage(page - 1);

  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  // console.log(notificationData);
  return (
    <>
      <Card mb={{ base: '0px', '2xl': '20px' }}>
        <Flex
          w={{ sm: '100%', md: 'auto' }}
          mb={'10px'}
          alignItems="center"
          flexDirection="row"
          justifyContent={'space-between'}
        >
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="10px"
            mb="4px"
          >
            {wordsListData?.ALL_NOTIFICATION || 'Все уведомления'}
          </Text>
          <Flex
            w={{ sm: '100%', md: 'auto' }}
            alignItems="center"
            flexDirection="row"
          >
            <Button
              variant="no-hover"
              bg="transparent"
              onClick={async () => {
                if (notificationData) {
                  await handleSelectIsReadIds();
                } else {
                  toast.error("Sizda bildirishnoma yo'q");
                }
              }}
            >
              <IoCheckmarkDoneSharp color={navbarIcon} size={23} />
            </Button>
            <Button
              onClick={() => {
                if (notificationData) {
                  onOpen();
                  handleSelectAllIds();
                } else {
                  toast.error("Sizda bildirishnoma yo'q");
                }
              }}
              variant="no-hover"
              bg="transparent"
            >
              <MdDeleteSweep color={navbarIcon} size={23} />
            </Button>
          </Flex>
        </Flex>
        {notificationData && notificationData?.object ? (
          notificationData.object.map((item) => (
            <Project
              key={item.id}
              boxShadow={cardShadow}
              mb="20px"
              item={item}
              image={Project1}
              getFunction={getFunction}
            />
          ))
        ) : (
          <Card bg={bg} p="14px">
            <Flex width={'100%'} justifyContent={'center'}>
              <Text
                color={textColorPrimary}
                fontWeight="500"
                fontSize="md"
                mb="4px"
              >
                {wordsListData?.NOTIFICATION_NOT_FOUND ||
                  'Уведомление не найдено'}
              </Text>
            </Flex>
          </Card>
        )}
        {notificationData && notificationData?.object ? (
          <Pagination
            showSizeChanger={false}
            responsive={true}
            defaultCurrent={1}
            total={totalPage}
            onChange={onChange}
            rootClassName={`mt-10 mb-5 ms-5`}
            itemRender={itemRender}
          />
        ) : (
          ''
        )}
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {wordsListData?.NOTIFICATION_DELETE || 'Уведомление удалено'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {wordsListData?.NOTIFICATION_DELETE_MESSAGE ||
              'Вы хотите удалить все уведомления?'}
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
              onClick={onClose}
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
              onClick={async () => {
                await globalPostFunction({
                  url: delete_notification,
                  postData:
                    selectedIds.length > 0 ? { ids: selectedIds } : { ids: [] },
                  setLoading: setLoading,
                  getFunction: () => {
                    globalGetFunction({
                      url:
                        role === 'ROLE_TERMINAL'
                          ? terminal_notification
                          : role === 'ROLE_SELLER'
                          ? seller_notification
                          : role === 'ROLE_SUPER_ADMIN'
                          ? admin_notification
                          : '',
                      setData: setNotificationData,
                      setLoading: setLoading,
                    });
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
    </>
  );
}

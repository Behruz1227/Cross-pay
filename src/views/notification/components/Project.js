// Chakra imports
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { delete_notification } from 'contexts/api';
import { isRead_notification } from 'contexts/api';
import { globalPostFunction } from 'contexts/logic-function/globalFunktion';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import React, { useState } from 'react';
import { IoCheckmarkSharp } from 'react-icons/io5';
// Assets
import { MdDelete, MdDoneAll } from 'react-icons/md';
import { MdNotificationsActive } from 'react-icons/md';
import { MdNotifications } from 'react-icons/md';

export default function Project(props) {
  const { item, image, getFunction } = props;
  const { wordsListData } = LanguageStore();
  const [loading, setLoading] = useState(false);
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const navbarIcon = useColorModeValue('#1B255A', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('black', 'white');
  console.log(item);

  return (
    <Accordion
      border={item.isRead ? '1px solid #f8f8f8' : '1px solid #00c675'}
      outline={'none'}
      allowToggle
      borderRadius={item.isRead ? '20px' : '20px'}
      overflow={'hidden'}
      mb={'20px'}
    >
      <AccordionItem>
        <AccordionButton>
          {item.isRead ? (
            <MdNotifications size={30} color="#686868" />
          ) : (
            <MdNotificationsActive size={30} />
          )}
          <Box
            flex="1"
            p={'10px'}
            color={item.isRead ? '#686868' : textColor}
            textAlign="left"
          >
            {item.title
              ? item.title
              : wordsListData?.NOTIFICATION_TITLE || 'Сообщение для вас!'}
          </Box>
          <AccordionIcon />
          <Button
            onClick={() =>
              globalPostFunction({
                url: delete_notification,
                postData: { ids: [item.id] },
                setLoading: setLoading,
                getFunction: getFunction,
              })
            }
            color={item.isRead ? '#686868' : textColor}
            variant="no-hover"
            bg="transparent"
          >
            <MdDelete color={item.isRead ? '#686868' : navbarIcon} size={23} />
          </Button>
          <Button
            onClick={() =>
              globalPostFunction({
                url: isRead_notification,
                postData: { ids: [item.id] },
                setLoading: setLoading,
                getFunction: getFunction,
              })
            }
            variant="no-hover"
            bg="transparent"
          >
            {item.isRead ? (
              <MdDoneAll
                color={item.isRead ? '#686868' : navbarIcon}
                size={23}
              />
            ) : (
              <IoCheckmarkSharp color={navbarIcon} size={23} />
            )}
          </Button>
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex
            align="center"
            justifyContent={'space-between'}
            alignItems={'center'}
            direction={{ base: 'column', md: 'row' }}
          >
            <Flex alignItems={'center'} p={'20px'}>
              <Box mt={{ base: '10px', md: '0' }}>
                <Text
                  color={textColorPrimary}
                  fontWeight="500"
                  fontSize="md"
                  mb="4px"
                >
                  {item?.title || '-'}
                </Text>
                {/* <Text
                  color={textColorPrimary}
                  fontWeight="500"
                  fontSize="md"
                  mb="4px"
                >
                  {wordsListData?.EXCEL_MERCHANT || 'Торговец'} :{' '}
                  {item?.partner || '0'}
                </Text> */}
                <Box>
                  
                  <Text
                    color={textColorPrimary}
                    fontWeight="500"
                    fontSize="md"
                    mb="4px"
                  >
                    {item?.priceUz || '0'} {wordsListData?.UZS || 'сум'}
                  </Text>
                  <Text
                    color={textColorPrimary}
                    fontWeight="500"
                    fontSize="md"
                    mb="4px"
                  >
                    {item?.priceRu || '0'} {wordsListData?.RUB || ''}
                  </Text>
                </Box>
                <Text
                  color={textColorPrimary}
                  fontWeight="500"
                  fontSize="md"
                  mb="4px"
                >
                  {wordsListData?.CLIENT || 'Клиент'} : {item?.partner || '-'}
                </Text>

                <Text
                  fontWeight="500"
                  color={brandColor}
                  fontSize="sm"
                  me="4px"
                >
                  {wordsListData?.EXCEL_CREATED_AT || 'Дата'} •{' '}
                  {item.createdAt.slice(0, 10)}
                  <Link fontWeight="500" fontSize="sm" ms={'7px'}>
                    {item.createdAt.slice(11, 16)}
                  </Link>
                </Text>
              </Box>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

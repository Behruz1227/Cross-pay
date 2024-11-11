// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PaymentStore } from 'contexts/state-management/payment/paymentStore';
import { LanguageStore } from 'contexts/state-management/language/languageStore';
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';
import { globalGetFunction } from 'contexts/logic-function/globalFunktion';
import { rate_rating } from 'contexts/api';
export default function AdminNavbar(props) {
  const { secondary, message, brandText } = props;
  const { wordsListData } = LanguageStore();
  const { setModalOpen } = PaymentStore();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const pathName = sessionStorage.getItem('pathname');
  const role = sessionStorage.getItem('ROLE');
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener('scroll', changeNavbar);
    return () => window.removeEventListener('scroll', changeNavbar);
  });

  // let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarPosition = 'fixed';
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = 'none';
  let navbarBg = useColorModeValue(
    'rgba(244, 247, 254, 0.2)',
    'rgba(11,20,55,0.5)',
  );
  const [RateData, setRateData] = useState(null)
  let navbarBorder = 'transparent';
  let secondaryMargin = '0px';
  let paddingX = '15px';
  let gap = '0px';
  const changeNavbar = () => {
    if (window.scrollY > 1) setScrolled(true);
    else setScrolled(false);
  };
  useEffect(() => {
    globalGetFunction({
        url: `${rate_rating}`,
        setData: setRateData,
      })
  }, [])
  // console.log(RateData);
  
  return (
    <Box
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
      px={{
        sm: paddingX,
        md: '10px',
      }}
      ps={{
        xl: '12px',
      }}
      pt="8px"
      top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
      w={{
        base: 'calc(100vw - 6%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        xl: 'calc(100vw - 350px)',
        '2xl': 'calc(100vw - 365px)',
      }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: 'column',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
        mb={gap}
      >
        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb>
            <BreadcrumbItem
              color={secondaryText}
              fontSize="md"
              fontWeight={`700`}
            >
              <BreadcrumbLink
                href={pathname}
                color={secondaryText}
                onClick={(e) => e.preventDefault()}
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem
              color={secondaryText}
              fontSize="md"
              fontWeight={`400`}
            >
              <BreadcrumbLink href="#" color={secondaryText}>
                {pathName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {/* Here we create navbar brand, based on route name */}
          {/*<Link*/}
          {/*    color={mainText}*/}
          {/*    href='#'*/}
          {/*    bg='inherit'*/}
          {/*    borderRadius='inherit'*/}
          {/*    fontWeight='bold'*/}
          {/*    fontSize='34px'*/}
          {/*    _hover={{color: {mainText}}}*/}
          {/*    _active={{*/}
          {/*        bg: 'inherit',*/}
          {/*        transform: 'none',*/}
          {/*        borderColor: 'transparent'*/}
          {/*    }}*/}
          {/*    _focus={{*/}
          {/*        boxShadow: 'none'*/}
          {/*    }}>*/}
          {/*    {brandText}*/}
          {/*</Link>*/}
        </Box>
        {role === 'ROLE_SELLER' ? (
          <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
            <Link to={`/seller/payment`}>
              <Button
                bg={'blue'}
                color={'white'}
                _hover={{ bg: 'blue.600' }}
                _active={{
                  bg: 'blue.600',
                  transform: 'scale(0.98)',
                }}
                onClick={() => setModalOpen(true)}
                px={15}
                size="md"
                mb={3}
              >
                {wordsListData?.CREATE_PAYMENT || 'Создать платеж'}
              </Button>
            </Link>
          </Box>
        ) : (
          role === 'ROLE_SUPER_ADMIN' && (
            <Box
              ms="auto"
              backgroundColor={'gray.100'}
              paddingX={4}
              paddingY={2}
              borderRadius={10}
              display={{ base: 'none', lg: 'flex' }}
              gap={10}
              w={{ sm: '100%', md: 'unset' }}
            >
              <Box color={'green'} display={'flex'} gap={7}>
                <Text>{wordsListData?.BUYING || 'Покупка'} : </Text>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  gap={3}
                >
                  <Text>{RateData && RateData?.buying} UZS</Text>
                  <FaArrowTrendUp size={19} color="green" />
                </Box>
              </Box>
              <Box height={7} border={'1px solid blue'}></Box>
              <Box color={'red'} display={'flex'} gap={7}>
                <Text>{wordsListData?.SELLING || 'Продажа'} : </Text>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  gap={3}
                >
                  <Text>{RateData && RateData.selling} UZS</Text>
                  <FaArrowTrendDown size={19} color="red" />
                </Box>
              </Box>
            </Box>
          )
        )}
        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
      {secondary ? <Text color="white">{message}</Text> : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};

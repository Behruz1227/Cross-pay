// src/pages/PrivacyTermsPage.jsx
import React from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
} from '@chakra-ui/react';
import TermsAndConditions from './TermsAndConditions';
import PrivacyPolicy from './PrivacyPolicy';
const PrivacyTermsPage = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        Siyosatlar
      </Heading>
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Shartlar (T&C)</Tab>
          <Tab>Maxfiylik siyosati</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TermsAndConditions />
          </TabPanel>
          <TabPanel>
            <PrivacyPolicy />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default PrivacyTermsPage;

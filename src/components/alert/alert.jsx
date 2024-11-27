import {Alert, AlertTitle} from "@chakra-ui/icons";
import {AlertIcon, Box} from "@chakra-ui/react";

export const Alerts = ({title}) => {
  return (
    <Alert status="error" mb={4} borderRadius={'10px'}>
      <AlertIcon/>
      <Box>
        <AlertTitle>{title}</AlertTitle>
      </Box>
    </Alert>
  );
};

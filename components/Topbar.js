import { Flex, Heading } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';

const Topbar = ({ email }) => {
  return (
    <Flex h='81px' w='100%' align='center' p={5}>
      <Avatar src='' marginEnd={3} />
      <Heading size='lg'>{email}</Heading>
    </Flex>
  );
};

export default Topbar;

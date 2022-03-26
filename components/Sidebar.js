import { Flex, Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/button';
import { Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseconfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc } from '@firebase/firestore';
import getOtherEmail from '../utils/getOtherEmail';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [snapshot, loading, error] = useCollection(collection(db, 'chats'));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const router = useRouter();

  const redirect = (id) => {
    router.push(`/chat/${id}`);
  };

  const chatExists = (email) =>
    chats?.find(
      (chat) => chat.users.includes(user.email) && chat.users.includes(email)
    );

  const newChat = async () => {
    const input = prompt('Enter a name for your chat recipient');
    if (!chatExists(input) && input !== user.email)
      await addDoc(collection(db, 'chats'), { users: [user.email, input] });
  };
  const chatList = () => {
    return chats
      ?.filter((chat) => chat.users.includes(user.email))
      .map((chat) => (
        <Flex
          p={3}
          key={Math.random()}
          align='center'
          _hover={{ bg: 'gray.100', cursor: 'pointer' }}
          onClick={() => {
            redirect(chat.id);
          }}
        >
          <Avatar src='' marginEnd={3} />
          <Text>{getOtherEmail(chat.users, user)}</Text>
        </Flex>
      ));
  };

  return (
    <>
      <Flex
        // bg='blue.100'
        w='300px'
        borderEnd='1px solid'
        borderColor='gray.200'
        direction='column'
        h='100%'
      >
        <Flex
          //   bg='red.100'
          h='81px'
          w='100%'
          align='center'
          justifyContent='space-between'
          p={3}
          borderBottom='1px solid'
          borderColor='gray.200'
        >
          <Flex align='center'>
            <Avatar src={user.photoURL} marginEnd={3} />
            <Text> {user.displayName}</Text>
          </Flex>
          <IconButton
            size='sm'
            isRound
            icon={<ArrowLeftIcon />}
            onClick={() => signOut(auth)}
          />
        </Flex>
        <Button
          m={5}
          p={4}
          onClick={() => {
            newChat();
          }}
        >
          New Chat
        </Button>
        <Flex
          overflowY='scroll'
          direction='column'
          sx={{ scrollbarWidth: 'none' }}
          flex={1}
        >
          {chatList()}
        </Flex>
      </Flex>
    </>
  );
}

import React, { useRef } from 'react'
import { Link as RouterLink } from "react-router-dom"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Link,
  useDisclosure,
  VStack
} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'

import Logout from './Logout'

const MobileNav = ({ setToken }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      <IconButton icon={<HamburgerIcon />} colorScheme="red.400" size="lg" ref={btnRef} onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="blue.900">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="red.400">yawmee</DrawerHeader>

          <DrawerBody color="white" fontSize={24}>
            <VStack>
              <Link as={RouterLink} to="/" onClick={onClose}>Home</Link>
              <Link as={RouterLink} to="/balances" onClick={onClose}>Balances</Link>
              <Link as={RouterLink} to="/add" onClick={onClose}>Add Loan</Link>
              <Link as={RouterLink} to="/friends" onClick={onClose}>Friends</Link>
              <Link as={RouterLink} to="/faq" onClick={onClose}>FAQ</Link>
              <Logout setToken={setToken} onClick={onClose}/>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MobileNav
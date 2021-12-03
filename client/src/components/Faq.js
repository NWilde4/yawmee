import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react"

import faqList from '../faqList'

const Faq = () => {
  return (
    <Box w="100%">
      <Center pb={4}>
        <Heading>FAQ</Heading>
      </Center>
      <Accordion allowMultiple>
        {faqList.map((faq) => {
          return(
            <AccordionItem key={faq.id}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text as="b" fontSize="xl">{faq.question}</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
export default Faq
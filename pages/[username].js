import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, IconButton, SimpleGrid, Spinner } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useFetch } from '@refetty/react';
import { format, addDays, subDays } from 'date-fns';

import { Logo, formatDate, TimeBlock } from "../components"

const getSchedule = async ({when, username}) => axios({
  method: "get",
  url: "/api/schedule",
  params: { 
    username,
    date: format(when, 'yyyy-MM-dd'),
  }
});

const Header = ({ children }) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
)

export default function Schedule() {
    const router = useRouter();
    const [when, setWhen] = useState(() => new Date());
    const [data, { loading, }, fetch] = useFetch(getSchedule,  { lazy: true });

    const addDay = () => setWhen(prevState => addDays(prevState, 1));
    const subDay = () => setWhen(prevState => subDays(prevState, 1));

    const refresh = () => {
      router.query.username && fetch({ when, username: router.query.username });
    }

    useEffect(() => {
      refresh();
    }, [when, router.query.username]);
    
    return (
      <div>
        <Container>
          <Header>
              <Logo size={150} />              
          </Header>

          <Box mt={8} display="flex" alignItems="center">
            <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={subDay}></IconButton>
            <Box flex={1} textAlign="center">{formatDate(when, 'PPPP')}</Box>
            <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay}></IconButton>
          </Box>

          <SimpleGrid p={4} columns={2} spacing={4}>
              {loading && <Spinner thickness="4px" speed="0.65" emptyColor="gray.200" color="blue.500" size="xl" />}
              {data?.map(({ time, isBlocked }) => <TimeBlock key={time} time={time} date={when} disabled={isBlocked} onSuccess={refresh} />)}
          </SimpleGrid>
        </Container>
        
      </div>
    )
  }
  
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Box, Input, Button, Text, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Logo, useAuth } from '../components';

let validationSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required("Preenchimento obrigatório"),
  password: yup.string().required("Preenchimento obrigatório"),
});

export default function Login() {
    const [auth, { login }] = useAuth();
    const router = useRouter();    
        
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormik({
        onSubmit: login,
        validationSchema,
        initialValues: {
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        auth.user && router.push("/agenda");
    }, [auth.user]);

  return (
    <Container p={4} centerContent>
      <Logo size={200} />
      <Box p={4} mt={8}>
        <Text>Cria sua agenda compartilhada</Text>
      </Box>

      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {touched.email && <FormHelperText textColor='#e74c3c'>{errors.email}</FormHelperText> }
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Senha</FormLabel>
          <Input type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
          {touched.password && <FormHelperText textColor='#e74c3c'>{errors.password}</FormHelperText> }
        </FormControl>

        <Box p={4}>
          <Button width="100%" onClick={handleSubmit} isLoading={isSubmitting} colorScheme="blue">Entrar</Button>
        </Box>        
      </Box>

      <Link href="/signup">Ainda não tem uma conta? Cadastre-se!</Link>
    </Container>
  )
}

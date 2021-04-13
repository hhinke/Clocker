import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react"
import { useState } from "react"
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import { Input } from '../Input';
import { format } from "date-fns";

const setSchedule = async ({ date, ...data }) => axios({
    method: "post",
    url: "/api/schedule",
    data: { 
        ...data,
        date: format(date, 'yyyy-MM-dd'),
        username: window.location.pathname.replace('/', ''),
    }
  });

let validationSchema = yup.object().shape({
    name: yup.string().required("Preenchimento obrigatório"),    
    phone: yup.string().required("Preenchimento obrigatório"),
  });

const ModalTimeBlock = ({ isOpen, onClose, onComplete, isSubmitting, children }) => (    
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Faça sua reserva</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            {children}
        </ModalBody>

        <ModalFooter>
            { !isSubmitting && <Button variant="ghost" onClick={onClose}>Cancelar</Button> }
            <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting}>
            Reservar Horário
            </Button>                
        </ModalFooter>
        </ModalContent>
    </Modal>
)

export const TimeBlock = ({ time, date, disabled, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);

    const { values, handleSubmit, handleChange, handleBlur, errors, touched, isSubmitting } = useFormik({
        onSubmit: async (values) => { 
            try  {                
                await setSchedule({ ...values, time, date });
                toggle();
                onSuccess && onSuccess();
            } catch(error) {
                console.log('ERROR:', error);
            }            
        },
        validationSchema,
        initialValues: {
            name: "",
            phone: "",            
        }
    });

    return (
        <Button p={8} bg="blue.500" color="white" onClick={toggle} disabled={disabled}>
            {time}
            { !disabled && <ModalTimeBlock isOpen={isOpen} onClose={toggle} onComplete={handleSubmit} isSubmitting={isSubmitting}>            
                <>
                <Input 
                    label="Nome:"
                    touched={touched.name}
                    placeholder="Digite seu nome" 
                    error={errors.name}
                    size="lg" 
                    name="name" 
                    value={values.name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                />
                <Input 
                    label="Telefone:"
                    touched={touched.phone}
                    placeholder="(99) 9 9999-9999" 
                    error={errors.phone}
                    size="lg" 
                    name="phone" 
                    mt={4} 
                    value={values.phone} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    mask={['(99) 9999-9999', '(99) 9 9999-9999']}
                />
                </>                
            </ModalTimeBlock> }
        </Button>
    )
}
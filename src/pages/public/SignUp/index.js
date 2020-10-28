import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';

import { Form as Unform } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../../utils/getValidationErrors';

import {
  Container, Content, Footer, DotsContainer, Dots,
} from './styles';

import Form1 from './Forms/Form1';
import Form2 from './Forms/Form2';
import Form3 from './Forms/Form3';
import Form4 from './Forms/Form4';
import Form5 from './Forms/Form5';
import Form6 from './Forms/Form6';
import Form7 from './Forms/Form7';

const SignUp = () => {
  const formRef = useRef(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Cadastro';
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        console.log(data);

        if (step === 1) {
          const schema = Yup.object().shape({
            type_personal: Yup.string().required('Campo obrigatório'),
            name: Yup.string().required('Campo obrigatório'),
            rg: Yup.string().required('Campo obrigatório'),
            orger_emitter: Yup.string().required('Campo obrigatório'),
            uf: Yup.string().required('Campo obrigatório'),
            date_emitter: Yup.string().required('Campo obrigatório'),
            email: Yup.string().required('Campo obrigatório'),
            perfil: Yup.string().required('Campo obrigatório'),
            birthday: Yup.string().required('Campo obrigatório'),
            race: Yup.string().required('Campo obrigatório'),
            mother_name: Yup.string().required('Campo obrigatório'),
            father_name: Yup.string().required('Campo obrigatório'),
            curriculum: Yup.string().required('Campo obrigatório'),
            school: Yup.string().required('Campo obrigatório'),
            area_knowledge: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setStep(2);
        } else if (step === 2) {
          const schema = Yup.object().shape({
            zipcode: Yup.string().required('Campo obrigatório'),
            street: Yup.string().required('Campo obrigatório'),
            number_street: Yup.string().required('Campo obrigatório'),
            complete_street: Yup.string().required('Campo obrigatório'),
            neighborhood: Yup.string().required('Campo obrigatório'),
            country: Yup.string().required('Campo obrigatório'),
            state: Yup.string().required('Campo obrigatório'),
            municipality: Yup.string().required('Campo obrigatório'),
            phone: Yup.string().required('Campo obrigatório'),
            phone_cell: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setStep(3);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [step],
  );

  return (
    <Container>
      <Content>
        <Unform ref={formRef} onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 40 }}>
            <label style={{ fontSize: 21, fontWeight: 'bold', color: '#626262' }}>Cadastro de Pesquisador</label>
            <label style={{ fontSize: 14, color: '#626262' }}>
              Preencha corretamente os campos abaixo para fazer parte da
              comunidade de pesquisadores da FAPEAP.
            </label>
          </div>

          {step === 0 && <Form3 formRef={formRef} />}

          {step === 1 && <Form1 formRef={formRef} />}
          {step === 2 && <Form2 formRef={formRef} />}
          {step === 3 && <Form3 formRef={formRef} />}
          {step === 4 && <Form4 formRef={formRef} />}
          {step === 5 && <Form5 formRef={formRef} />}
          {step === 6 && <Form6 formRef={formRef} />}
          {step === 7 && <Form7 formRef={formRef} />}

          <Footer>
            <DotsContainer>
              <Dots isFilled={step === 1} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 2} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 3} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 4} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 5} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 6} />
            </DotsContainer>
            <DotsContainer>
              <Dots isFilled={step === 7} />
            </DotsContainer>
          </Footer>

          <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
            <button type="submit" className="submit">
              Continuar
            </button>
          </div>

        </Unform>
      </Content>
    </Container>
  );
};

export default SignUp;

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

const Recaptcha = require('react-recaptcha');

const SignUp = () => {
  const formRef = useRef(null);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({});

  useEffect(() => {
    document.title = 'SIGFAPEAP - Cadastro';
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        console.log(data);

        if (step === 1) {
          let schema;
          if (data.type_personal == 'Pesquisador') {
            schema = Yup.object().shape({
              type_personal: Yup.string().required('Campo obrigatório'),
              name: Yup.string().required('Campo obrigatório'),
              rg: Yup.string().required('Campo obrigatório'),
              orger_emitter: Yup.string().required('Campo obrigatório'),
              uf: Yup.string().required('Campo obrigatório'),
              date_emitter: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              birthday: Yup.string().required('Campo obrigatório'),
              mother_name: Yup.string().required('Campo obrigatório'),
              curriculum: Yup.string().required('Campo obrigatório'),
              school: Yup.string().required('Campo obrigatório'),
            });
          } else {
            schema = Yup.object().shape({
              type_personal: Yup.string().required('Campo obrigatório'),
              name: Yup.string().required('Campo obrigatório'),
              rg: Yup.string().required('Campo obrigatório'),
              orger_emitter: Yup.string().required('Campo obrigatório'),
              uf: Yup.string().required('Campo obrigatório'),
              date_emitter: Yup.string().required('Campo obrigatório'),
              email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
              perfil: Yup.string().required('Campo obrigatório'),
              birthday: Yup.string().required('Campo obrigatório'),
              mother_name: Yup.string().required('Campo obrigatório'),
              curriculum: Yup.string().required('Campo obrigatório'),
              school: Yup.string().required('Campo obrigatório'),
              rg_foreign: Yup.string().required('Campo obrigatório'),
            });
          }

          await schema.validate(data, {
            abortEarly: false,
          });

          setForm({ ...form, data });

          setStep(2);
        } else if (step === 2) {
          const schema = Yup.object().shape({
            zipcode: Yup.string().required('Campo obrigatório'),
            street: Yup.string().required('Campo obrigatório'),
            number_street: Yup.string().required('Campo obrigatório'),
            neighborhood: Yup.string().required('Campo obrigatório'),
            country: Yup.string().required('Campo obrigatório'),
            state: Yup.string().required('Campo obrigatório'),
            municipality: Yup.string().required('Campo obrigatório'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setForm({ ...form, data });

          setStep(3);
        } else if (step === 3) {
          let schema;

          if (data.connection == 'Sim' && data.generate_connection == 'Sim') {
            schema = Yup.object().shape({
              institution: Yup.string().required('Campo obrigatório'),
              service_time: Yup.string().required('Campo obrigatório'),
              office: Yup.string().required('Campo obrigatório'),
              office_time: Yup.string().required('Campo obrigatório'),
            });
          } else if (data.connection == 'Sim' && data.generate_connection == 'Não') {
            schema = Yup.object().shape({
              institution: Yup.string().required('Campo obrigatório'),
            });
          }

          await schema.validate(data, {
            abortEarly: false,
          });

          setForm({ ...form, data });

          setStep(4);
        } else if (step === 4) {
          setForm({ ...form, data });
          setStep(5);
        } else if (step === 5) {
          setForm({ ...form, data });
          setStep(6);
        } else if (step === 6) {
          setForm({ ...form, data });
          setStep(7);
        } else if (step === 7) {
          const schema = Yup.object().shape({
            cpf: Yup.string().required('Campo obrigatório'),
            password: Yup.string()
              .min(6, 'Mínimo de 6 caracteres')
              .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
            confirmation_password: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')], 'Senhas não coincidem') : field)),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setForm({ ...form, data });

          alert('Submeter formulário');
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [step, form],
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

          {step === 7 && (
          <Recaptcha
            sitekey="fmewkrifgjnoierjngoruetg"
            render="explicit"
          />
          )}

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

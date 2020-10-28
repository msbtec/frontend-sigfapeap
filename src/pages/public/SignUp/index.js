import React, {
  useEffect, useRef, useCallback,
} from 'react';

import { Form as Unform } from '@unform/web';
import * as Yup from 'yup';
import { Form } from '../../../components/Form';
import getValidationErrors from '../../../utils/getValidationErrors';
import Input from '../../../components/Input';

import Logo from '../../../assets/img/logo.jpg';

import { Container, Content } from './styles';

const SignUp = () => {
  const formRef = useRef(null);

  useEffect(() => {
    document.title = 'SIGFAPEAP - Cadastro';
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          name_mini: Yup.string().required('Campo obrigatório'),
          cpf: Yup.string().required('Campo obrigatório'),
          email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
          office: Yup.string().required('Campo obrigatório'),
          perfil: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [],
  );

  return (
    <Container>
      <Content>
        <Unform ref={formRef} onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 40 }}>
            <label>Cadastro de Pesquisador</label>
            <label>Preencha corretamente os campos abaixo para fazer parte da comunidade de pesquisadores da FAPEAP.</label>
          </div>

          <Form>
            <Input formRef={formRef} name="name" required original title="Nome completo" />

            <Input formRef={formRef} name="name_mini" required original title="Nome reduzido" />

            <Input formRef={formRef} name="cpf" required original title="CPF" />

            <Input formRef={formRef} name="email" required original title="E-mail" />

            <Input formRef={formRef} name="office" select={["Servidor", "Bolsista", "Pesquisador"]} required original title="Selecione seu cargo/função" />

            <Input formRef={formRef} name="perfil" select={["Administrador", "Servidor"]} required original title="Perfil" />

            <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
              <button type="submit" className="submit">
                Enviar cadastro
              </button>
            </div>
          </Form>

        </Unform>
      </Content>
    </Container>
  );
};

export default SignUp;

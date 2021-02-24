import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';

import * as Yup from 'yup';

import ReactLoading from "react-loading";

import { Form as Unform } from '@unform/web';
import { store } from 'react-notifications-component';
import { Button } from '../../../components/Button';

import { Form } from '../../../components/Form';
import Input from '../../../components/Input';
import { Card } from '../../../components/Card';

import { useOffice } from '../../../hooks/office';
import { useAuth } from '../../../hooks/auth';

import getValidationErrors from '../../../utils/getValidationErrors';

import api from '../../../services/api';

export default function Cargos() {
  const formRef = useRef(null);
  const reference = useRef(null);

  const [loading, setLoading] = useState(false);

  const { user, token, setAuth } = useAuth();
  const { offices } = useOffice();

  useEffect(() => {
    document.title = 'SIGFAPEAP - perfil';
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        let schema = {};
        const formData = new FormData();

        if (data.password !== '') {
          schema = Yup.object().shape({
            name: Yup.string().required('Campo obrigatório'),
            email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
            office_id: Yup.string().required('Campo obrigatório'),
            phone: Yup.string().required('Campo obrigatório'),

            password: Yup.string()
              .min(6, 'Mínimo de 6 caracteres')
              .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
            confirmation_password: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')], 'Senhas não coincidem') : field)),
          });

          formData.append("name", String(data.name).toUpperCase());
          formData.append("email", data.email);
          formData.append("address", data.address);
          formData.append("phone", data.phone);
          formData.append("office_id", data.office_id);
          formData.append("password", data.password);
        } else {
          schema = Yup.object().shape({
            name: Yup.string().required('Campo obrigatório'),
            email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
            office_id: Yup.string().required('Campo obrigatório'),
            phone: Yup.string().required('Campo obrigatório'),
          });

          formData.append("name", String(data.name).toUpperCase());
          formData.append("email", data.email);
          formData.append("address", data.address);
          formData.append("phone", data.phone);
          formData.append("office_id", data.office_id);
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        api.put(`users/${user.id}`, formData).then(({ data: user_updated }) => {
          setAuth({ token, user: user_updated });

          setLoading(false);

          store.addNotification({
            message: `Perfil atualizado com sucesso!`,
            type: 'success',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        }).finally(() => {});
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [setAuth, token, user],
  );

  return (
    <>
      <div className="col-12 title">
        <h1>Perfil</h1>
      </div>
      <div className="col-12 px-0">
        <Card className="red">
          <div className="card-body">
            <Unform initialData={user} ref={formRef} onSubmit={handleSubmit}>

              <Form>
                <div className="modal-body" style={{ marginBottom: 20 }} ref={reference}>
                  <Input formRef={formRef} name="name" required original title="Nome" />

                  <Input formRef={formRef} name="email" required original title="E-mail" />

                  <Input formRef={formRef} name="address" original title="Endereço" />

                  <Input formRef={formRef} maxLength={15} required name="phone" original title="Telefone/WhatsApp" />

                  <Input formRef={formRef} name="office_id" select={offices} required original title="Cargo/função" />

                  <Input formRef={formRef} name="password" required password original title="Senha" />

                  <Input formRef={formRef} name="confirmation_password" password required original title="Confirmar senha" />
                </div>

                <div className="modal-footer">
                  {loading ? (<ReactLoading type="spin" height="5%" width="5%" color="#3699ff" />) : (
                    <Button
                      className="primary"
                    >
                      Salvar
                    </Button>
                  )}
                </div>
              </Form>
            </Unform>
          </div>

        </Card>
      </div>
    </>
  );
}

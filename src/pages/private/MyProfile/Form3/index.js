import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { store } from 'react-notifications-component';

import Axios from 'axios';

import * as Yup from 'yup';
import api from '../../../../services/api';

import { useAuth } from '../../../../hooks/auth';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const { user, token, setAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  function handleCEP(cep) {
    if (cep.length === 9) {
      Axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          const {
            logradouro, bairro, uf, localidade, pais,
          } = response.data;
          formRef.current.setFieldValue('professional_street', logradouro);
          formRef.current.setFieldValue('professional_neighborhood', bairro);
          formRef.current.setFieldValue('professional_state', pais);
          formRef.current.setFieldValue('professional_state', uf);
          formRef.current.setFieldValue('professional_municipality', localidade);
        })
        .catch(() => {});
    }
  }

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const formData = new FormData();

        formData.append("professional_zipcode", data.professional_zipcode != "" ? data.professional_zipcode : "");
        formData.append("professional_street", data.professional_street != "" ? data.professional_street : "");
        formData.append("professional_number_street", data.professional_number_street != "" ? data.professional_street : "");
        formData.append("professional_complete_street", data.professional_complete_street != "" ? data.professional_complete_street : "");
        formData.append("professional_neighborhood", data.professional_neighborhood != "" ? data.professional_neighborhood : "");
        formData.append("professional_country", data.professional_country != "" ? data.professional_country : "");
        formData.append("professional_state", data.professional_state != "" ? data.professional_state : "");
        formData.append("professional_municipality", data.professional_municipality != "" ? data.professional_municipality : "");
        formData.append("professional_phone", data.professional_phone != "" ? data.professional_phone : "");
        formData.append("professional_phone_cell", data.professional_phone_cell != "" ? data.professional_phone_cell : "");
        formData.append("professional_fax", data.professional_fax != "" ? data.professional_fax : "");

        setLoading(true);

        api.put(`users/${user.id}`, formData).then(({ data: user_updated }) => {
          setAuth({ token, user: user_updated });

          localStorage.setItem('@sigfapeap:user', JSON.stringify(user_updated));
          localStorage.setItem('@sigfapeap:token', token);

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

          submit();
        }).finally(() => {});
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [submit, setAuth, token, user],
  );

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar programa' : 'Atualizar programa'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="professional_zipcode" handleCEP={handleCEP} maxLength={9} original title="CEP" />

            <Input formRef={formRef} name="professional_street" disabled original title="Logradouro" />

            <Input formRef={formRef} name="professional_number_street" type="number" original title="Número" />

            <Input formRef={formRef} name="professional_complete_street" original title="Complemento" />

            <Input formRef={formRef} name="professional_neighborhood" disabled original title="Bairro" />

            <Input formRef={formRef} name="professional_country" select={[{ id: "Brasil", name: "Brasil" }]} original title="País" />

            <Input formRef={formRef} name="professional_state" disabled original title="Estado" />

            <Input formRef={formRef} name="professional_municipality" disabled original title="Município" />

            <Input formRef={formRef} name="professional_phone" maxLength={15} original title="Telefone" />

            <Input formRef={formRef} name="professional_phone_cell" maxLength={15} original title="Celular" />

            <Input formRef={formRef} name="professional_fax" original title="Fax" />
          </div>

          <div className="modal-footer">
            <button type="button" className="close" onClick={toggleModal}>
              <FiX />
              {' '}
              Fechar
            </button>
            <button type="submit" className="submit">
              <FiCheckCircle />
              {' '}
              Salvar
            </button>
          </div>
        </Form>
      </Unform>

    </StyledModal>
  );
}

export default memo(ModalForm);

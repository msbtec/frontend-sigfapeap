import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { store } from 'react-notifications-component';
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

  const [isConnection, setIsConnection] = useState(true);
  const [isGenerate_connection, setIsGenerate_connection] = useState(true);

  const { user, token, setAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (item.connection == 'Não') {
      setIsConnection(false);
    }
  }, [item]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const formData = new FormData();
        let schema;

        if (data.connection == 'Sim' && data.generate_connection == 'Sim') {
          schema = Yup.object().shape({
            institution: Yup.string().required('Campo obrigatório'),
            service_time: Yup.string().required('Campo obrigatório'),
            office_name: Yup.string().required('Campo obrigatório'),
            office_time: Yup.string().required('Campo obrigatório'),
          });
        } else if (data.connection == 'Sim' && data.generate_connection == 'Não') {
          schema = Yup.object().shape({
            institution: Yup.string().required('Campo obrigatório'),
          });
        } else {
          schema = Yup.object().shape({
            connection: Yup.string().required('Campo obrigatório'),
          });
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        formData.append("connection", data.connection || '');
        formData.append("generate_connection", data.generate_connection || '');
        formData.append("connection_institution", data.connection_institution || '');
        formData.append("institution", data.institution || '');
        formData.append("service_time", data.service_time || '');
        formData.append("office_name", data.office_name || '');
        formData.append("office_time", data.office_time || '');
        formData.append("regime_work", data.regime_work || '');

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
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar vínculo institucional' : 'Atualizar vínculo institucional'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="connection" setIsConnection={setIsConnection} select={[{ id: "Sim", name: "Sim" }, { id: "Não", name: "Não" }]} required original title="Tem Vínculo Institucional?" />

            {isConnection && (
            <>
              <Input formRef={formRef} name="institution" required original title="Instituição/Empresa" />

              <Input formRef={formRef} name="connection_institution" select={[{ id: "CLT", name: "CLT" }, { id: "Cooperativo", name: "Cooperativo" }, { id: "Bolsista", name: "Bolsista" }, { id: "Estagiário", name: "Estagiário" }]} required original title="Vínculo Institucional" />

              <Input formRef={formRef} name="generate_connection" setIsGenerate_connection={setIsGenerate_connection} select={[{ id: "Sim", name: "Sim" }, { id: "Não", name: "Não" }]} required original title="Gera Vínculo Empregatício?" />

              <Input formRef={formRef} name="service_time" required={isGenerate_connection} original title="Tempo de Serviço" />

              <Input formRef={formRef} name="regime_work" select={[{ id: "Dedicação exclusiva", name: "Dedicação exclusiva" }, { id: "Tempo integral", name: "Tempo integral" }, { id: "Outro", name: "Outro" }]} required={isGenerate_connection} original title="Regime de Trabalho" />

              <Input formRef={formRef} name="office_name" required={isGenerate_connection} original title="Função/Cargo Atual" />

              <Input formRef={formRef} name="office_time" required={isGenerate_connection} original title="Tempo na Função" />
            </>
            )}
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

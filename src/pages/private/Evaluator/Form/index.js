import React, {
  useEffect, useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import * as Yup from 'yup';
import { store } from 'react-notifications-component';
import { Form } from '../../../../components/Form';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { useEvaluator } from '../../../../hooks/evaluators';

import { StyledModal } from './styles';
import api from '../../../../services/api';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);

  const [programs, setPrograms] = useState([]);

  const { loadEvaluators } = useEvaluator();

  useEffect(() => {
    api.get(`programs`).then(({ data }) => {
      const result = data.map((program) => ({
        label: program.title,
        value: program.id,
        evaluators: program.evaluators,
      }));

      setPrograms(result);
    });
  }, [item]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldValue('programs', programs);
    }
  }, [formRef, programs, item]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          programs: Yup.string().required('Campo obrigatório').nullable(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const ids = data.programs.map((item) => String(item.value));

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < ids.length; i++) {
          const program = programs.filter((item) => item.value == ids[i]);
          const temp = program[0].evaluators.map((item) => String(item.id));
          temp.push(String(item.id));

          // eslint-disable-next-line no-loop-func
          const novaArr = temp.filter((este, i) => temp.indexOf(este) === i);

          const evaluators = novaArr.map((item) => String(item)).join(",");

          const formData = new FormData();
          formData.append("evaluators", evaluators);
          formData.append("name", item.name);
          formData.append("email", item.email);

          // eslint-disable-next-line no-await-in-loop
          await api.put(`programs/${ids[i]}`, formData);
        }

        loadEvaluators();

        store.addNotification({
          message: `Programa(s) adicionado(s) com sucesso!`,
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
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [programs, loadEvaluators, item, submit],
  );

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{!item ? 'Cadastrar avaliador' : 'Adicionar programa'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>
        <Form>
          <div className="modal-body" style={{ height: 400 }} ref={reference}>
            <Input
              formRef={formRef}
              name="programs"
              required
              multi
              access={programs}
              title="Programas"
            />
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

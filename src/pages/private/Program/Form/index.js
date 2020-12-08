import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useProgram } from '../../../../hooks/program';
import { useEvaluator } from '../../../../hooks/evaluators';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, item, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { create, update } = useProgram();
  const { evaluators } = useEvaluator();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState('');

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        if (String(data.evaluators) == "undefined") {
          data = { ...data, evaluators: item.evaluators };
        } else if (String(data.evaluators) == "null") {
          data = { ...data, evaluators: "" };
        }

        const schema = Yup.object().shape({
          title: Yup.string().required('Campo obrigatório'),
          description: Yup.string().required('Campo obrigatório'),
          avaliation: Yup.string().required('Campo obrigatório'),
          evaluators: Yup.string().required('Pelo menos um avaliador deve ser submetido'),
        });

        if (!selectedFile && !item) {
          setErrorFile('Campo obrigatório');
        } else {
          setErrorFile('');
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedFile || item) {
          if (item) {
            update({ id: item.id, url: item.url, ...data });
          } else {
            create({ url: window.URL.createObjectURL(selectedFile), ...data });
          }
          submit();
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [create, selectedFile, update, item, submit],
  );

  React.useEffect(() => {
    console.log(evaluators);
  }, [evaluators]);

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
            <Input formRef={formRef} name="title" maxLength={18} required original title="Título" />

            <Input formRef={formRef} name="description" required original title="Descrição" />

            <div className="input-block">
              <label htmlFor="email">
                PDF
                {' '}
                <sup style={{ color: "#f00" }}>*</sup>
              </label>
              <div style={{ marginBottom: 5 }} />
              <label style={{ borderColor: errorFile ? "#f00" : "#dee2e6" }} className="file-input">
                <input
                  type="file"
                  placeholder="Arquivo"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <div className="text">
                  { selectedFile ? selectedFile.name : 'Selecione um arquivo PDF' }
                </div>
                <div className="icon">
                  <FiFile />
                </div>
              </label>
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errorFile}
              </sup>
            </div>

            <Input formRef={formRef} name="avaliation" required original title="Critério de avaliação" />

            <Input formRef={formRef} name="evaluators" required multi access={evaluators.map((user) => ({ label: user.name, value: user.name }))} title="Avaliadores" />
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

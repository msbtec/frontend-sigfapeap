import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import * as Yup from 'yup';
import { store } from 'react-notifications-component';
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

  const [description, setDescription] = useState(item ? item.description : '');

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        // if (item) {
        //   if (String(data.evaluators) == "undefined") {
        //     data = { ...data, evaluators: item.evaluators };
        //   } else if (String(data.evaluators) == "null") {
        //     data = { ...data, evaluators: [] };
        //   }
        // } else if (String(data.evaluators) == "undefined") {
        //   data = { ...data, evaluators: [] };
        // } else if (String(data.evaluators) == "null") {
        //   data = { ...data, evaluators: [] };
        // }

        const schema = Yup.object().shape({
          title: Yup.string().required('Campo obrigatório'),
          // description: Yup.string().required('Campo obrigatório'),
        });

        // if (!selectedFile && !item) {
        //   setErrorFile('Campo obrigatório');
        // } else {
        //   setErrorFile('');
        // }

        await schema.validate(data, {
          abortEarly: false,
        });

        if (item) {
          update({ id: item.id, description, ...data });
        } else {
          create({ ...data, description });
        }

        submit();

        // if (selectedFile || item) {
        //   if (item) {
        //     update({ id: item.id, ...data }, selectedFile);
        //   } else {
        //     create(data, selectedFile);
        //   }
        //   submit();
        // }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [create, description, update, item, submit],
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
            <Input formRef={formRef} name="title" required original title="Título" />

            {/* <Input formRef={formRef} name="description" required original title="Descrição" /> */}

            <div className="input-block">
              <label>
                Descrição
              </label>
              {/* <CKEditor
                editor={ClassicEditor}
                data={description}
                onReady={(editor) => {
                  setDescription(item ? item.description : '');
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              /> */}

              <textarea
                rows={5}
                style={{ borderColor: "rgb(153, 153, 153)", padding: 10 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
              />
              <span style={{
                display: "flex", color: '#626262', justifyContent: 'flex-end', fontSize: 11, marginBottom: -10,
              }}
              >
                {`${description.length}/255 caracteres`}
              </span>
            </div>

            {/* <div style={{ marginBottom: 10 }} className="input-block">
              <label htmlFor="email">
                PDF
                {' '}
                <sup style={{ color: "#f00" }}>* Tamanho máximo 3MB</sup>
              </label>
              <div style={{ marginBottom: 5 }} />
              <label style={{ borderColor: errorFile ? "#f00" : "#dee2e6" }} className="file-input">
                <input
                  type="file"
                  placeholder="Arquivo"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      if (e.target.files[0].size / 1000000 > 3) {
                        store.addNotification({
                          message: `Seu arquivo: ${e.target.files[0].name} é muito grande! Max:${3}MB`,
                          type: 'danger',
                          insert: 'top',
                          container: 'top-right',
                          animationIn: ['animate__animated', 'animate__fadeIn'],
                          animationOut: ['animate__animated', 'animate__fadeOut'],
                          dismiss: {
                            duration: 5000,
                            onScreen: true,
                          },
                        });
                      } else {
                        setSelectedFile(e.target.files[0]);
                      }
                    }
                  }}
                />
                <div className="text">
                  { selectedFile ? selectedFile.name : 'Selecione um arquivo' }
                </div>
                <div className="icon">
                  <FiFile />
                </div>
              </label>
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errorFile}
              </sup>
            </div> */}

            {/* <Input formRef={formRef} name="avaliation"
            required original title="Critério de avaliação" /> */}

            {/* <Input formRef={formRef} name="evaluators" required multi access={evaluators.map((user) => ({ label: user.name, value: user.name }))} title="Avaliadores" /> */}
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

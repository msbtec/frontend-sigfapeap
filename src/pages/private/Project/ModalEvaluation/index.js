import React, {
  memo, useRef, useState, useCallback,
} from 'react';

import { store } from 'react-notifications-component';

import * as Yup from 'yup';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import SelectMultiple from "react-select";
import getValidationErrors from '../../../../utils/getValidationErrors';
import Input from '../../../../components/Input';
import api from '../../../../services/api';

import { Form } from '../../../../components/Form';

import { StyledModal, Content } from './styles';

function ModalForm({
  formRef, isOpen, project, getProject, toggleModal, submit,
}) {
  const reference = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [recomendacoes, setRecomendacoes] = useState([
    {
      value: true,
      label: 'RECOMENDADO',
    },
    {
      value: false,
      label: 'NÃO RECOMENDADO',
    },
  ]);

  const [recomendado, setRecomendado] = useState({
    value: true,
    label: 'RECOMENDADO',
  });

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          note: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        let params = {};
        if (project.avaliacao.avaliador2_id == null) {
          params = {
            id: project.avaliacao.id,
            analise1: description == "" ? "<p>SEM DESCRIÇÃO</p>" : description,
            nota1: data.note,
            recomendado1: recomendado.value,
            responsavel_id: null,
          };
        } else {
          params = {
            id: project.avaliacao.id,
            analise2: description == "" ? "<p>SEM DESCRIÇÃO</p>" : description,
            nota2: data.note,
            recomendado2: recomendado.value,
            responsavel_id: null,
          };
        }

        api.post(`evaluations`, params).then(({ data }) => {
          store.addNotification({
            message: `Atualizado com sucesso!`,
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

          getProject();

          submit();
        }).catch((error) => {
          store.addNotification({
            message: `Erro ao atualizar!`,
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
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, recomendado, description],
  );

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Avaliar projeto</h5>
      </div>

      <Form>
        <Unform ref={formRef} onSubmit={handleSubmit}>
          <div className="modal-body" ref={reference}>
            <div>
              <div style={{ marginBottom: 10 }} className="input-block">
                <label style={{ marginBottom: 10 }}>
                  Avaliação
                </label>
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onReady={(editor) => {}}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                />
              </div>

              <Input formRef={formRef} name="note" required original title="Nota" />

              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#626262',
                }}
                className="required"
              >
                Recomendação
              </label>
              <div style={{ marginTop: 5 }} />
              <SelectMultiple
                maxMenuHeight={150}
                onMenuOpen={() => setMenuOpen(true)}
                onMenuClose={() => setMenuOpen(false)}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Recomendado"
                value={recomendado}
                noOptionsMessage={({ inputValue }) => "Sem opções"}
                options={recomendacoes}
                onChange={(values) => setRecomendado(values)}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    primary25: "#080",
                    primary: "#dee2e6",
                  },
                })}
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isSelected ? "#fff" : "rgb(102,102,102)",
                    backgroundColor: state.isSelected ? "rgb(102,102,102)" : "#fff",

                    ":active": {
                      ...provided[":active"],
                      backgroundColor: !state.isDisabled && "#dee2e6",
                    },
                  }),
                }}
              />

              {menuOpen && <div style={{ marginTop: 100 }} />}
            </div>
          </div>

          <Content>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="modal-footer">
              <button style={{ margin: 20 }} type="button" onClick={toggleModal}>
                <FiX />
                {' '}
                Fechar
              </button>
              <button
                style={{ margin: 20 }}
                type="submit"
              >
                <FiCheckCircle />
                {' '}
                Salvar
              </button>
            </div>
          </Content>
        </Unform>
      </Form>

    </StyledModal>
  );
}

export default memo(ModalForm);

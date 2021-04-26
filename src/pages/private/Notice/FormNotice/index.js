import React, {
  useState, memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX, FiFile } from 'react-icons/fi';
import { store } from 'react-notifications-component';

import SelectMultiple from "react-select";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import * as Yup from 'yup';
import { Form } from '../../../../components/Form';

import { useProgram } from '../../../../hooks/program';
import { useDocument } from '../../../../hooks/document';

import getValidationErrors from '../../../../utils/getValidationErrors';

import Input from '../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  item, isOpen, toggleModal, id, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { addNotice, updateNotice } = useProgram();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState('');

  const { documents } = useDocument();

  const [documentos, setDocumentos] = React.useState(item ? item.documents : []);

  const [description, setDescription] = useState(item ? item.description : "");

  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        // if (item) {
        //   if (String(data.documents) == "undefined") {
        //     data = { ...data, documents: item.documents };
        //   } else if (String(data.documents) == "null") {
        //     data = { ...data, documents: [] };
        //   }
        // } else if (String(data.documents) == "undefined") {
        //   data = { ...data, documents: [] };
        // } else if (String(data.documents) == "null") {
        //   data = { ...data, documents: [] };
        // }

        const schema = Yup.object().shape({
          title: Yup.string().required('Campo obrigatório'),
          beggin: Yup.date().required('Campo obrigatório').nullable().typeError('Campo obrigatório'),
          end: Yup.date().required('Campo obrigatório').min(Yup.ref('beggin'), "A data de término não pode ser anterior à data de início").nullable()
            .typeError('Campo obrigatório'),
        });

        if (!selectedFile && !item) {
          setErrorFile('Campo obrigatório');
        } else {
          setErrorFile('');
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        // if (selectedFile) {
        //   addNotice({
        //     id, description, documents: JSON.stringify(documentos), ...data,
        //   }, selectedFile);
        //   submit();
        // }

        if (selectedFile || item) {
          if (item) {
            updateNotice({
              id: item.id, description, documents: JSON.stringify(documentos), ...data,
            }, selectedFile);
          } else {
            addNotice({
              id, description, documents: JSON.stringify(documentos), ...data,
            }, selectedFile);
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
    [id, addNotice, description, item, updateNotice, documentos, selectedFile, submit],
  );

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{item ? 'Editar edital' : 'Cadastrar edital'}</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Unform initialData={item} ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="title" required original title="Título" />

            <Input formRef={formRef} name="beggin" type="date" required original title="Início" />

            <Input formRef={formRef} name="end" type="date" required original title="Fim" />

            {/* <Input formRef={formRef} name="documents" required original title="Documentos necessários" /> */}

            {/* <Input formRef={formRef} name="documents" required multi access={documents.map((item) => ({ value: item.id, label: item.name }))} title="Documentos necessários" /> */}

            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#626262',
              }}
              className="required"
            >
              Documentos necessários
            </label>

            <div style={{ marginTop: 5 }} />
            <SelectMultiple
              maxMenuHeight={150}
              isMulti
              onMenuOpen={() => setMenuOpen(true)}
              onMenuClose={() => setMenuOpen(false)}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Documentos"
              value={documentos}
              noOptionsMessage={({ inputValue }) => "Sem opções"}
              options={documents.map((item) => ({ value: item.id, label: item.title }))}
              onChange={(values) => setDocumentos(values)}
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

            {menuOpen && <div style={{ marginTop: 200 }} />}

            <div className="input-block">
              <label style={{ marginBottom: 10 }}>
                Descrição
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onReady={(editor) => { }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }} className="input-block">
              <label htmlFor="email">
                Anexo
                {' '}
                <sup style={{ color: "#f00" }}>* Tamanho máximo 3MB</sup>
              </label>
              <div style={{ marginBottom: 5 }} />
              <label style={{ borderColor: errorFile ? "#f00" : "#dee2e6" }} className="file-input">
                <input
                  type="file"
                  placeholder="Arquivo"
                  accept=".pdf, .doc, .docx"
                  // onChange={(e) => setSelectedFile(e.target.files[0])}
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

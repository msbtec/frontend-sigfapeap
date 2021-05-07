import React, {
  memo, useRef, useState, useCallback, useEffect,
} from 'react';

import { store } from 'react-notifications-component';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';

import SelectMultiple from "react-select";
import api from '../../../../services/api';

import { Form } from '../../../../components/Form';

import { StyledModal, Content } from './styles';

function ModalForm({
  isOpen, project, getProject, toggleModal, submit,
}) {
  const reference = useRef(null);

  const history = useHistory();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);

  const [enquadrados, setEnquadrados] = useState([
    {
      value: true,
      label: 'ENQUADRADO',
    },
    {
      value: false,
      label: 'NÃO ENQUADRADO',
    },
  ]);

  const [users, setUsers] = useState([]);

  const [enquadrado, setEnquadrado] = useState({
    value: true,
    label: 'ENQUADRADO',
  });

  const [avaliador, setAvaliador] = useState({
    value: null,
    label: 'SEM AVALIADOR',
  });

  const [nameOrCpf, setNameOrCpf] = useState(null);

  const handleSubmit = useCallback(
    async (data) => {
      if (enquadrado.value == true && avaliador.value == null) {
        store.addNotification({
          message: `É necessário selecionar um avaliador!`,
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

        return null;
      }

      let params = {};
      if (!project?.avaliacao?.responsavel_id && !project?.avaliacao?.recomendado1) {
        params = {
          id: project.avaliacao.id,
          enquadrado: enquadrado.value,
          avaliador1_id: enquadrado.value == false ? null : avaliador.value ? JSON.parse(avaliador.value).id : null,
          responsavel_id: enquadrado.value == false ? null : avaliador.value ? JSON.parse(avaliador.value).id : null,
        };
      } else {
        params = {
          id: project.avaliacao.id,
          avaliador2_id: avaliador.value ? JSON.parse(avaliador.value).id : null,
          responsavel_id: avaliador.value ? JSON.parse(avaliador.value).id : null,
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

        if (enquadrado.value == false) {
          history.goBack();
        } else {
          getProject();
        }

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, enquadrado, avaliador],
  );

  useEffect(() => {
    if (project?.edital_id) {
      api.get(`/evaluators/program/${project.edital_id}`).then(({ data }) => {
        if (data.length > 0) {
          setUsers(data);
          setAvaliador({ label: data[0].name, value: JSON.stringify(data[0]) });
        }
      });
    }
  }, [nameOrCpf, project, setUsers]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Enquadrar projeto</h5>
      </div>

      <Form>
        <div className="modal-body" ref={reference}>

          {!project?.avaliacao?.responsavel_id && !project?.avaliacao?.recomendado1
            && (
            <>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#626262',
                  }}
                  className="required"
                >
                  Enquadramento
                </label>
                <div style={{ marginTop: 5 }} />
                <SelectMultiple
                  maxMenuHeight={150}
                  onMenuOpen={() => setMenuOpen(true)}
                  onMenuClose={() => setMenuOpen(false)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Enquadrado"
                  value={enquadrado}
                  noOptionsMessage={({ inputValue }) => "Sem opções"}
                  options={enquadrados}
                  onChange={(values) => setEnquadrado(values)}
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
              <div style={{ marginTop: 15 }} />
            </>
            )}

          {enquadrado.value == true
        && (
        <>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#626262',
            }}
            className="required"
          >
            {!project?.avaliacao?.responsavel_id && project?.avaliacao?.recomendado1 ? 'Avaliador Especialista' : 'Avaliador ad hoc'}
          </label>
          <div style={{ marginTop: 5 }} />
          <SelectMultiple
            maxMenuHeight={150}
            onMenuOpen={() => setMenuOpen2(true)}
            onMenuClose={() => setMenuOpen2(false)}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Avaliador"
            value={avaliador}
            noOptionsMessage={({ inputValue }) => "Sem opções"}
            options={users.map((item) => ({ label: item.name, value: item.name == 'SEM AVALIADOR' ? null : JSON.stringify(item) }))}
            onInputChange={(value) => (String(value) == "" ? setNameOrCpf(null) : setNameOrCpf(value))}
            onChange={(values) => {
              setAvaliador(values);
            }}
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

          {menuOpen2 && <div style={{ marginTop: 200 }} />}
        </>
        )}
        </div>

        <Content>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="modal-footer">
            <button style={{ margin: 20 }} type="button" onClick={toggleModal}>
              <FiX />
              {' '}
              Fechar
            </button>
            <button
              onClick={handleSubmit}
              style={{ margin: 20 }}
              type="button"
            >
              <FiCheckCircle />
              {' '}
              Salvar
            </button>
          </div>
        </Content>
      </Form>
    </StyledModal>
  );
}

export default memo(ModalForm);

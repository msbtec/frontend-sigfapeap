import React, {
  memo, useRef,
} from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import SelectMultiple from "react-select";

import * as Yup from 'yup';
import uuid from 'react-uuid';
import { Form } from '../../../../../../components/Form';

import {
  data as time,
} from '../../../../../../utils/validations';

import { useAuth } from '../../../../../../hooks/auth';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, membros, atividades, setAtividades, toggleModal, submit,
}) {
  const reference = useRef(null);
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [participantes, setParticipantes] = React.useState(membros);

  const [data, setData] = React.useState({
    title: '',
    beggin: '',
    end: '',
    time: '',
  });

  const [errors, setErrors] = React.useState({
    title: '',
    beggin: '',
    end: '',
    time: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        title: '',
        beggin: '',
        end: '',
        time: '',
      };
      if (data.title == "") {
        temp.title = 'Campo obrigatório';
      } else {
        temp.title = '';
      }
      if (data.beggin == "") {
        temp.beggin = 'Campo obrigatório';
      } else {
        temp.beggin = '';
      }
      if (data.end == "") {
        temp.end = 'Campo obrigatório';
      } else {
        temp.end = '';
      }
      if (data.time == "") {
        temp.time = 'Campo obrigatório';
      } else {
        temp.time = '';
      }

      if (data.title == "" || data.beggin == "" || data.end == "" || data.time == "") {
        setErrors(temp);

        throw 'Error';
      }

      setAtividades([...atividades, { id: uuid(), ...data, participantes }]);

      submit();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Adicionar Atividade</h5>
      </div>

      <Form>
        <div className="modal-body" ref={reference}>
          <div className="input-block">
            <label className="required">
              Atividade
              {' '}
              <sup>
                *
              </sup>
            </label>
            <input
              style={{ borderColor: errors.title ? '#c53030' : '#999' }}
              value={data.title}
              onChange={(value) => {
                setData({ ...data, title: value.target.value });
              }}
              type="text"
            />
            <sup style={{ color: '#c53030', marginTop: 5 }}>
              {errors.title && errors.title}
            </sup>
          </div>

          <div className="input-block">
            <label className="required">
              Início
              {' '}
              <sup>
                *
              </sup>
            </label>
            <input
              style={{ borderColor: errors.beggin ? '#c53030' : '#999' }}
              type="date"
              value={data.beggin}
              onChange={(value) => {
                setData({ ...data, beggin: value.target.value });
              }}
            />
            <sup style={{ color: '#c53030', marginTop: 5 }}>
              {errors.beggin && errors.beggin}
            </sup>
          </div>

          <div className="input-block">
            <label className="required">
              Duração (em meses)
              {' '}
              <sup>
                *
              </sup>
            </label>
            <input
              style={{ borderColor: errors.end ? '#c53030' : '#999' }}
              min={1}
              type="number"
              value={data.end}
              onChange={(value) => {
                setData({ ...data, end: value.target.value });
              }}
            />
            <sup style={{ color: '#c53030', marginTop: 5 }}>
              {errors.end && errors.end}
            </sup>
          </div>

          <div style={{ marginBottom: 10 }} className="input-block">
            <label className="required">
              Carga horária semanal
              {' '}
              <sup>
                *
              </sup>
            </label>
            <input
              style={{ borderColor: errors.time ? '#c53030' : '#999' }}
              maxLength={5}
              type="text"
              value={data.time}
              onChange={(value) => {
                const formatted = time(value.target.value);
                setData({ ...data, time: formatted });
              }}
            />
            <sup style={{ color: '#c53030', marginTop: 5 }}>
              {errors.time && errors.time}
            </sup>
          </div>

          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#626262',
            }}
            className="required"
          >
            Participantes
          </label>
          <div style={{ marginTop: 5 }} />
          <SelectMultiple
            maxMenuHeight={150}
            isMulti
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Pesquisadores"
            value={participantes}
            noOptionsMessage={({ inputValue }) => "Sem opções"}
            options={membros}
            onChange={(values) => {
              if (values != null) {
                const filter = values.filter((item) => JSON.parse(item.value).id == user.id);

                if (filter.length != 0) {
                  setParticipantes(values);
                }
              } else {
                setParticipantes(participantes);
              }
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

          {menuOpen && <div style={{ marginTop: 200 }} />}
        </div>

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
      </Form>

    </StyledModal>
  );
}

export default memo(ModalForm);

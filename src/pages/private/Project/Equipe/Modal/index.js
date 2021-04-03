import React, {
  memo, useRef, useCallback,
} from 'react';
import { Form as Unform } from '@unform/web';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import SelectMultiple from "react-select";

import * as Yup from 'yup';
import uuid from 'react-uuid';
import { Form } from '../../../../../components/Form';

import { useResearcher } from '../../../../../hooks/researcher';
import { useAuth } from '../../../../../hooks/auth';

import getValidationErrors from '../../../../../utils/getValidationErrors';

import Input from '../../../../../components/Input';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, membros, atividades, setAtividades, toggleModal, submit,
}) {
  const reference = useRef(null);
  const formRef = useRef(null);
  const { users } = useResearcher();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [minDate, setMinDate] = React.useState(new Date());

  const [participantes, setParticipantes] = React.useState(membros);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Campo obrigatório'),
          beggin: Yup.string().required('Campo obrigatório'),
          end: Yup.string().required('Campo obrigatório'),
          time: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setAtividades([...atividades, { id: uuid(), ...data, participantes }]);

        submit();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current.setErrors(errors);
        }
      }
    },
    [atividades, setAtividades, participantes, submit],
  );

  return (

    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >

      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Adicionar Atividade</h5>
      </div>

      <Unform ref={formRef} onSubmit={handleSubmit}>

        <Form>
          <div className="modal-body" ref={reference}>
            <Input formRef={formRef} name="title" required original title="Atividade" />

            <Input formRef={formRef} name="beggin" setMinDate={setMinDate} type="date" required original title="Início" />

            <Input formRef={formRef} name="end" type="number" min={1} required original title="Duração (em meses)" />

            {/* <Input formRef={formRef} name="end" min={minDate} type="date" required original title="Fim" /> */}

            <Input formRef={formRef} name="time" maxLength={5} required original title="Carga horária semanal" />

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
              style={{ margin: 20 }}
              type="submit"
            >
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

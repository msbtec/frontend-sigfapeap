import React, { useEffect, memo, useRef } from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import { uuid } from 'uuidv4';
import { Form } from '../../../../../../components/Form';
import {
  money_mask,
} from '../../../../../../utils/validations';

import { useProject } from '../../../../../../hooks/project';

import { soma, getValue } from '../../../../../../utils/soma';

import { StyledModal } from './styles';

function Hospedagens({
  orcamentos, setOrcamentos, isOpen, toggleModal, despesas, setDespesas,
}) {
  const reference = useRef(null);

  const { project } = useProject();

  const [hospedagem, setHospedagem] = React.useState({
    id: uuid(),
    localidade: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
  });

  const [errors, setErrors] = React.useState({
    localidade: '',
    quantidade: '',
    custo_unitario: '',
    custo_total: '',
    mes: '',
  });

  async function handleSubmit() {
    try {
      const temp = {
        localidade: '',
        quantidade: '',
        custo_unitario: '',
        custo_total: '',
        mes: '',
      };

      if (hospedagem.localidade == "") {
        temp.localidade = 'Campo obrigatório';
      } else {
        temp.localidade = '';
      }

      if (hospedagem.quantidade == "") {
        temp.quantidade = 'Campo obrigatório';
      } else if (Number(hospedagem.quantidade) <= 0) {
        temp.quantidade = 'Campo deve ser maior que 0';
      } else {
        temp.quantidade = '';
      }

      if (hospedagem.custo_unitario == "") {
        temp.custo_unitario = 'Campo obrigatório';
      } else {
        temp.custo_unitario = '';
      }

      if (hospedagem.mes == "") {
        temp.mes = 'Campo obrigatório';
      } else if (Number(hospedagem.mes) <= 0) {
        temp.mes = 'Campo deve ser maior que 0';
      } else if (Number(hospedagem.mes) > Number(project.duration)) {
        temp.mes = `Campo não deve ultrapassar a duração máxima de ${project.duration} mês(es)`;
      } else {
        temp.mes = '';
      }

      if (temp.localidade != "" || temp.quantidade != "" || temp.custo_unitario != "" || temp.mes != "") {
        setErrors(temp);

        throw 'Error';
      }

      setDespesas(despesas.map((item) => ((item.titulo == 'Hospedagem/Alimentação') ? ({ ...item, valor: money_mask(String(soma([...orcamentos.hospedagem_alimentacao, hospedagem]))) }) : item)));

      setOrcamentos({ ...orcamentos, hospedagem_alimentacao: [...orcamentos.hospedagem_alimentacao, hospedagem] });

      setHospedagem({
        id: uuid(),
        localidade: '',
        quantidade: 0,
        custo_unitario: '',
        custo_total: '',
        mes: '',
      });

      toggleModal();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (hospedagem.custo_unitario.length > 0) {
      setHospedagem({ ...hospedagem, custo_total: money_mask(String((getValue(hospedagem.custo_unitario) * hospedagem.quantidade).toFixed(2))) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospedagem.quantidade, hospedagem.custo_unitario]);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Hospedagem/Alimentação</h5>
      </div>
      <Form>
        <div className="modal-body" ref={reference}>
          <div>
            <div className="input-block">
              <label className="required">Localidade</label>
              <input style={{ borderColor: errors.localidade ? '#c53030' : '#999' }} value={hospedagem.localidade} type="text" onChange={(value) => setHospedagem({ ...hospedagem, localidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.localidade && errors.localidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Quantidade</label>
              <input style={{ borderColor: errors.quantidade ? '#c53030' : '#999' }} value={hospedagem.quantidade} type="number" onChange={(value) => setHospedagem({ ...hospedagem, quantidade: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.quantidade && errors.quantidade}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo unitário</label>
              <input
                style={{ borderColor: errors.custo_unitario ? '#c53030' : '#999' }}
                value={hospedagem.custo_unitario}
                type="text"
                onChange={(value) => {
                  setHospedagem({ ...hospedagem, custo_unitario: money_mask(value.target.value) });
                }}
              />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.custo_unitario && errors.custo_unitario}
              </sup>
            </div>

            <div className="input-block">
              <label className="required">Custo total</label>
              <input value={hospedagem.custo_total} disabled type="text" />
            </div>

            <div className="input-block">
              <label className="required">Mês</label>
              <input style={{ borderColor: errors.mes ? '#c53030' : '#999' }} value={hospedagem.mes} type="number" onChange={(value) => setHospedagem({ ...hospedagem, mes: value.target.value })} />
              <sup style={{ color: '#c53030', marginTop: 5 }}>
                {errors.mes && errors.mes}
              </sup>
            </div>
          </div>
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

export default memo(Hospedagens);

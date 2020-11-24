import React, {
  memo, useRef, useState,
} from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';

import { Form } from '../../../../../components/Form';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, knowledgesArea, setKnowledgesArea,
}) {
  const reference = useRef(null);

  const [sub1, setSub1] = useState(false);
  const [sub2, setSub2] = useState(false);
  const [sub3, setSub3] = useState(false);

  const [knoledges_areas, setKnoledges_areas] = useState({
    main: '',
    sub1: '',
    sub2: '',
    sub3: '',
  });

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Adicionar área de conhecimento</h5>
        <button type="button" className="close" onClick={toggleModal}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <Form>
        <div className="modal-body" ref={reference}>

          <div className="input-block">
            <label>
              Área de conhecimento
            </label>
            <select onChange={(e) => {
              if (e.target.value !== 'Selecionar área') {
                setSub1(true);
                setKnoledges_areas({ ...knoledges_areas, main: e.target.value });
              } else {
                setSub1(false);
                setKnoledges_areas({ ...knoledges_areas, main: '' });
              }
            }}
            >
              {["Selecionar área", "Ciências sociais", "Ciências exatas"].map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>

          {sub1 && (
          <div className="input-block">
            <label>
              Área de conhecimento
            </label>
            <select onChange={(e) => {
              if (e.target.value !== 'Selecionar área') {
                setSub2(true);
                setKnoledges_areas({ ...knoledges_areas, sub1: e.target.value });
              } else {
                setSub2(false);
                setKnoledges_areas({ ...knoledges_areas, sub1: '' });
              }
            }}
            >
              {["Selecionar área", "Ciências sociais", "Ciências exatas"].map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
          )}

          {sub2 && (
          <div className="input-block">
            <label>
              Área de conhecimento
            </label>
            <select onChange={(e) => {
              if (e.target.value !== 'Selecionar área') {
                setSub3(true);
                setKnoledges_areas({ ...knoledges_areas, sub2: e.target.value });
              } else {
                setSub3(false);
                setKnoledges_areas({ ...knoledges_areas, sub2: '' });
              }
            }}
            >
              {["Selecionar área", "Ciências sociais", "Ciências exatas"].map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
          )}

          {sub3 && (
          <div className="input-block">
            <label>
              Área de conhecimento
            </label>
            <select onChange={(e) => {
              if (e.target.value !== 'Selecionar área') {
                setKnoledges_areas({ ...knoledges_areas, sub3: e.target.value });
              } else {
                setKnoledges_areas({ ...knoledges_areas, sub3: '' });
              }
            }}
            >
              {["Selecionar área", "Ciências sociais", "Ciências exatas"].map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
          )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="modal-footer">
          <button style={{ margin: 20 }} type="button" onClick={toggleModal}>
            <FiX />
            {' '}
            Fechar
          </button>
          <button
            style={{ margin: 20 }}
            type="button"
            onClick={() => {
              setKnowledgesArea({ ...knoledges_areas, one: knoledges_areas });
            }}
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

import React, {
  useEffect, memo, useRef, useState,
} from 'react';

import { FiCheckCircle, FiX } from 'react-icons/fi';
import api from '~/services/api';

import { Form } from '../../../../../components/Form';

import { StyledModal } from './styles';

function ModalForm({
  isOpen, toggleModal, knowledgesArea, setKnowledgesArea, type,
}) {
  const reference = useRef(null);

  const [sub1, setSub1] = useState(false);
  const [sub2, setSub2] = useState(false);
  const [sub3, setSub3] = useState(false);

  const [searchareas, setSearchareas] = useState([]);

  useEffect(() => {
    api.get(`searchareas`).then(({ data }) => {
      setSearchareas([{ name: "Selecionar área" }, ...data]);
    });
  }, []);

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
              {searchareas.map((item) => (
                <option value={item.name}>{item.name}</option>
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
              {searchareas.map((item) => (
                <option value={item.name}>{item.name}</option>
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
              {searchareas.map((item) => (
                <option value={item.name}>{item.name}</option>
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
              {searchareas.map((item) => (
                <option value={item.name}>{item.name}</option>
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
              toggleModal();
              if (type == 1) {
                setKnowledgesArea({ ...knowledgesArea, one: knoledges_areas });
              } else if (type == 2) {
                setKnowledgesArea({ ...knowledgesArea, two: knoledges_areas });
              } else {
                setKnowledgesArea({ ...knowledgesArea, three: knoledges_areas });
              }
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

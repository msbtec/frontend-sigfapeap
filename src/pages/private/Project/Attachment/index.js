import React from 'react';

import { FiFile } from 'react-icons/fi';
import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

export default function Attachment({ formRef }) {
  return (
    <Form>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Input formRef={formRef} name="title" title="Título" original />
        <div className="input-block" style={{ marginLeft: 10, marginBottom: 30 }}>
          <label htmlFor="email">
            Anexo
          </label>
          <div style={{ marginBottom: 5 }} />
          <label className="file-input">
            <input
              type="file"
              placeholder="Arquivo"
              accept="image/*"
              onChange={(e) => console.log(e.target.files[0])}
            />
            <div className="text">
              Selecione anexo
            </div>
            <div className="icon">
              <FiFile />
            </div>
          </label>
        </div>
      </div>
    </Form>
  );
}

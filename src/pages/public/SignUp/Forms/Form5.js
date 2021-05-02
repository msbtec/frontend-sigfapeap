import React from 'react';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const SignUp = ({ formRef, institutions, setInstitutions }) => (
  <Form>
    <Input formRef={formRef} name="another_institutions" institutions={institutions} setInstitutions={setInstitutions} original title="Vincular Outras Instituições" />

    {institutions.map((item, key) => (
      <h3>
        {`Instituição/Empresa (${key + 1}): `}
        <span style={{ fontWeight: 'normal' }}>{item}</span>
      </h3>
    ))}
  </Form>
);

export default SignUp;

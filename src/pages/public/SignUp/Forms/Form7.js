import React from 'react';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const SignUp = ({ formRef }) => (
  <Form>
    <Input formRef={formRef} name="cpf" required original title="CPF" />
    <Input formRef={formRef} name="password" required password original title="Senha" />
    <Input formRef={formRef} name="confirmation_password" password required original title="Confirmar senha" />
  </Form>
);

export default SignUp;

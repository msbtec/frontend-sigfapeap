import React from 'react';

import { Form } from '../../../../components/Form';
import Input from '../../../../components/Input';

const SignUp = ({ formRef }) => (
  <Form>
    <Input formRef={formRef} name="address_mail" select={["Residencial", "Profissional"]} required original title="Endereço preferencial para correspondência" />

    <Input formRef={formRef} name="received_informations" select={["Sim", "Não"]} required original title="Deseja receber Informativo da Fundação?" />
  </Form>
);

export default SignUp;

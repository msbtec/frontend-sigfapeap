import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';

import { uuid } from 'uuidv4';
import { store } from 'react-notifications-component';

const ResearcherContext = createContext({});

export const ResearcherProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([
    {
      id: uuid(),
      address_mail: "Residencial",
      avatar: "https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/user/12.jpg",
      birthday: "1998-10-18",
      complete_street: "casa",
      confirmation_password: "password",
      connection: "Sim",
      connection_institution: "CLT",
      country: "Brasil",
      cpf: "094.384.098-50",
      curriculum: "https://github.com/typicode/json-server",
      date_emitter: "2008-10-21",
      email: "math.cs.ceil@gmail.com",
      father_name: "Rosilvado Ribeiro da Silva Filho",
      generate_connection: "Sim",
      institution: "MSB",
      knowledgesArea: {
        one: {
          main: "Ciências sociais",
          sub1: "Ciências exatas",
          sub2: "Ciências sociais",
          sub3: "Ciências exatas",
        },
        two: {
          main: "Ciências sociais",
          sub1: "Ciências exatas",
          sub2: "Ciências sociais",
          sub3: "Ciências exatas",
        },
        three: {
          main: "Ciências sociais",
          sub1: "Ciências exatas",
          sub2: "Ciências sociais",
          sub3: "Ciências exatas",
        },
      },
      mother_name: "Neusa Reis da Costa",
      municipality: "Macapá",
      name: "Matheus Costa Silva",
      neighborhood: "Araxá",
      number_street: "89979",
      office: "Dev",
      office_time: "1 ano",
      orger_emitter: "POLITEC",
      password: "password",
      phone: "(96) 99999-9999",
      phone_cell: "(96) 88888-8888",
      professional_complete_street: "casa",
      professional_country: "Brasil",
      professional_fax: "",
      professional_municipality: "",
      professional_neighborhood: "Araxá",
      professional_number_street: "48035",
      professional_phone: "",
      professional_phone_cell: "",
      professional_state: "AP",
      professional_street: "Travessa Oitava da Setentrional",
      professional_zipcode: "68903-777",
      race: "Amarela",
      received_informations: "Sim",
      regime_work: "Tempo integral",
      rg: "488009",
      school: "Ensino Superior",
      service_time: "1 ano",
      sex: "Masculino",
      state: "AP",
      street: "Travessa Oitava da Setentrional",
      type_personal: "Pesquisador",
      uf: "AP",
      zipcode: "68903-777",
      evaluator: true,
    },
  ]);

  React.useEffect(() => {
    console.log(users);
  }, [users]);

  const create = useCallback(async (data) => {
    setLoading(true);
    setUsers([...users, { id: uuid(), ...data }]);

    // console.log(users);
    // console.log(data);

    store.addNotification({
      message: `Pesquisador cadastrado com sucesso!`,
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
    setLoading(false);
  }, [users]);

  const update = useCallback(async (data) => {
    setLoading(true);
    setUsers(users.map((item) => (item.id === data.id ? data : item)));
    store.addNotification({
      message: `Pesquisador atualizado com sucesso!`,
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
    setLoading(false);
  }, [users]);

  const erase = useCallback(async (data) => {
    setLoading(true);
    setUsers(users.filter((item) => (item.id !== data.id)));
    store.addNotification({
      message: `Pesquisador deletado com sucesso!`,
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
    setLoading(false);
  }, [users]);

  return (
    <ResearcherContext.Provider
      value={{
        users,
        loading,
        create,
        update,
        erase,
      }}
    >
      {children}
    </ResearcherContext.Provider>
  );
};

export function useResearcher() {
  const context = useContext(ResearcherContext);

  if (!context) {
    throw Error('useResearcher must be used within an ResearcherProvider');
  }

  return context;
}

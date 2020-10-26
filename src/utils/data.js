const servidores = [
  {
    cpf: '03323456798',
    email: 'mail@mail.com',
    name: 'Adolfo Oliveira Colares',
    name_mini: 'Adolfo Colares',
    office: 'Bolsista',
    perfil: 'Servidor',
  },
];

const cargos = [
  {
    name: "Professor",
  },
  {
    name: "Engenheiro",
  },
];

const access = [
  {
    label: 'Dashboard',
    value: 'Dashboard',
  },
  {
    label: 'Servidores',
    value: 'Servidores',
  },
  {
    label: 'Cargos',
    value: 'Cargos',
  },
  {
    label: 'Perfis de acesso',
    value: 'Perfis de acesso',
  },
  {
    label: 'Área de pesquisa',
    value: 'Área de pesquisa',
  },
  {
    label: 'Instituição de pesquisa',
    value: 'Instituição de pesquisa',
  },
  {
    label: 'Programas',
    value: 'Programas',
  },
  {
    label: 'Avaliadores',
    value: 'Avaliadores',
  },
  {
    label: 'Pesquisadores',
    value: 'Pesquisadores',
  },
];

const perfis = [
  {
    name: 'Administrador',
    access,
  },
  {
    name: 'Servidor',
    access: [
      {
        label: 'Área de pesquisa',
        value: 'Área de pesquisa',
      },
      {
        label: 'Instituição de pesquisa',
        value: 'Instituição de pesquisa',
      },
      {
        label: 'Programas',
        value: 'Programas',
      },
      {
        label: 'Avaliadores',
        value: 'Avaliadores',
      },
      {
        label: 'Pesquisadores',
        value: 'Pesquisadores',
      },
    ],
  },
];

export {
  servidores, cargos, access, perfis,
};

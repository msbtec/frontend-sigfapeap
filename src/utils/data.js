const servidores = [
  {
    cpf: '041.746.580-72',
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

const areas = [
  {
    name: "Filosofia",
    connection: "Ciências Sociais",
  },
  {
    name: "Matemática",
    connection: "Ciências Exatas",
  },
];

const instituicoes = [
  {
    cnpj: '10.533.202/0001-52',
    name: 'Universidade Federal do Amapá',
    social_name: 'UNIFAP',
    address: 'Rod. Juscelino Kubitschek, km 02 - Jardim Marco Zero, Macapá - AP, 68903-419',
    site: 'www.unifap.br',
    phone: '(96) 3312-1700',
    email: 'suporte@unifap.br',
    observation: 'The Federal University of Amapá is a Brazilian public institution which is located in Macapá, Brazil.',
  },
];

const evaluators = [
  {
    label: 'Adolfo Colares',
    value: 'Adolfo Colares',
  },
  {
    label: 'Fred Amaro',
    value: 'Fred Amaro',
  },
];

const programas = [
  {
    title: 'Quero Açaí',
    description: 'O calor deu uma leve pausa, o clima ficou um pouco mais fresquinho e a gente já pensa em tomar aquele caldo 😋 Vem pra Quero Açaí que temos caldos quentinhos te esperando ❤🍵',
    url: 'https://cdnimg.webstaurantstore.com/images/products/large/542714/1977986.jpg',
    avaliation: '4.5',
    evaluators,
  },
];

const usuarios = [
  {
    cpf: '041.746.580-72',
    email: 'mail@mail.com',
    name: 'Adolfo Oliveira Colares',
    name_mini: 'Adolfo Colares',
    avaliador: true,
  },
  {
    cpf: '041.746.580-72',
    email: 'mail@mail.com',
    name: 'Leonardo Oliverira',
    name_mini: 'Leozartino',
    avaliador: false,
  },
];

export {
  servidores, cargos, access, perfis, areas, instituicoes, evaluators, programas, usuarios,
};

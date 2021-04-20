import React from 'react';

export default function App({ screen, setScreen, setPageLoading }) {
  return (
    <ul className="breadcrumb" style={{ marginBottom: 20 }}>
      <li style={{
        backgroundColor: screen.header ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => {
          setPageLoading(true);

          setTimeout(() => {
            setScreen({
              ...screen, header: true, appresentation: false, abrangencia: false, equipe: false, recursos: false, orcamento: false,
            });
          }, 1000);

          setTimeout(() => {
            setPageLoading(false);
          }, 2000);
        }}
        >
          Plano de Trabalho
        </a>
      </li>
      <li style={{
        backgroundColor: screen.appresentation ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => {
          setPageLoading(true);

          setTimeout(() => {
            setScreen({
              ...screen, header: false, abrangencia: false, recursos: false, equipe: false, appresentation: true, orcamento: false,
            });
          }, 1000);

          setTimeout(() => {
            setPageLoading(false);
          }, 3000);
        }}
        >
          Plano de apresentação
        </a>
      </li>
      <li style={{
        backgroundColor: screen.abrangencia ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => {
          setPageLoading(true);

          setTimeout(() => {
            setScreen({
              ...screen, header: false, appresentation: false, abrangencia: true, equipe: false, recursos: false, orcamento: false,
            });
          }, 1000);

          setTimeout(() => {
            setPageLoading(false);
          }, 2000);
        }}
        >
          Abrangência
        </a>
      </li>
      <li style={{
        backgroundColor: screen.equipe ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => {
          setPageLoading(true);

          setTimeout(() => {
            setScreen({
              ...screen, header: false, appresentation: false, abrangencia: false, equipe: true, recursos: false, orcamento: false,
            });
          }, 1000);

          setTimeout(() => {
            setPageLoading(false);
          }, 2000);
        }}
        >
          Equipe
        </a>
      </li>
      <li style={{
        backgroundColor: screen.orcamento ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => {
          setPageLoading(true);

          setTimeout(() => {
            setScreen({
              ...screen, header: false, appresentation: false, abrangencia: false, equipe: false, orcamento: true, recursos: false,
            });
          }, 1000);

          setTimeout(() => {
            setPageLoading(false);
          }, 2000);
        }}
        >
          Orçamentos
        </a>
      </li>
      <li style={{
        backgroundColor: screen.recursos ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => {
          setPageLoading(true);

          setTimeout(() => {
            setScreen({
              ...screen, header: false, appresentation: false, abrangencia: false, equipe: false, recursos: true, orcamento: false,
            });
          }, 1000);

          setTimeout(() => {
            setPageLoading(false);
          }, 2000);
        }}
        >
          Recursos
        </a>
      </li>
    </ul>
  );
}

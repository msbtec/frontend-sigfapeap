import React from 'react';

export default function App({ screen, setScreen }) {
  return (
    <ul className="breadcrumb" style={{ marginBottom: 20 }}>
      <li style={{
        backgroundColor: screen.header ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => setScreen({
          ...screen, header: true, appresentation: false, abrangencia: false, equipe: false, recursos: false,
        })}
        >
          Plano de Trabalho
        </a>
      </li>
      <li style={{
        backgroundColor: screen.appresentation ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => setScreen({
          ...screen, header: false, abrangencia: false, recursos: false, equipe: false, appresentation: true,
        })}
        >
          Plano de apresentação
        </a>
      </li>
      <li style={{
        backgroundColor: screen.abrangencia ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => setScreen({
          ...screen, header: false, appresentation: false, abrangencia: true, equipe: false, recursos: false,
        })}
        >
          Abrangência
        </a>
      </li>
      <li style={{
        backgroundColor: screen.recursos ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => setScreen({
          ...screen, header: false, appresentation: false, abrangencia: false, equipe: false, recursos: true,
        })}
        >
          Recursos
        </a>
      </li>
      <li style={{
        backgroundColor: screen.equipe ? '#b20710' : '#ccc', padding: 10, borderRadius: 10, marginRight: 5,
      }}
      >
        <a onClick={() => setScreen({
          ...screen, header: false, appresentation: false, abrangencia: false, equipe: true, recursos: false,
        })}
        >
          Equipe
        </a>
      </li>
    </ul>
  );
}

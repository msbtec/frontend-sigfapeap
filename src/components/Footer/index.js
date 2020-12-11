import React from 'react';

export default function Footer() {
  return (
    <div style={{
      display: "flex", width: '100%', paddingRight: 20, paddingLeft: 20, justifyContent: "space-between", height: 90, backgroundColor: "#b20710", alignItems: 'center',
    }}
    >
      <div style={{ flexDirection: 'column' }}>
        <h1 style={{ fontSize: 11, color: '#fff' }}>Atendimento: 08:00 ÀS 14:00</h1>
        <h1 style={{ fontSize: 11, color: '#fff' }}>Contato: (96) 3222-0595</h1>
        <h1 style={{ fontSize: 11, color: '#fff' }}>E-mail: fapeap@fapeap.ap.gov.br</h1>
        <h1 style={{ fontSize: 11, color: '#fff' }}>Site: www.fapeap.ap.gov.br</h1>
      </div>
      <div style={{ flexDirection: 'column' }}>
        <h1 style={{ fontSize: 11, color: '#fff' }}>
          Centro de Incubação de Empresas, Ramal da Unifap, KM 02 s/n da Rodovia JK,
        </h1>
        <h1 style={{ fontSize: 11, color: '#fff' }}>Marco Zero, CEP:68903-329 - Macapá-AP</h1>
      </div>
    </div>
  );
}

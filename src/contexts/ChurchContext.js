import React, { createContext, useState, useContext } from 'react';

// 1. Cria o Contexto, que é o nosso "quadro de avisos" em si.
const ChurchContext = createContext();

// 2. Cria o componente "Provedor" que vai gerenciar e fornecer os dados.
//    Ele vai "envelopar" nosso aplicativo.
export const ChurchProvider = ({ children }) => {
  const [selectedChurch, setSelectedChurch] = useState(null);

  // O valor que será compartilhado com todos os componentes filhos.
  const value = { selectedChurch, setSelectedChurch };

  return (
    <ChurchContext.Provider value={value}>
      {children}
    </ChurchContext.Provider>
  );
};

// 3. Cria um "hook" personalizado para facilitar o uso do Contexto.
//    Isso é uma convenção para não precisarmos importar 'useContext' e 'ChurchContext'
//    em todos os arquivos, apenas nosso 'useChurch'.
export const useChurch = () => {
  return useContext(ChurchContext);
};
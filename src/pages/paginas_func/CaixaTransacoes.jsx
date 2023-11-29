
import styled from "styled-components";

import Form from "../../componentes/transacoes/FormsTrans";
import TableTrans from "../../componentes/transacoes/TableTrans";
import { toast, ToastContainer } from "react-toastify";
import GlobalStyle from "../../styles/global";
import React, { useEffect, useState } from "react";
import axios from "axios";


const Container = styled.div`
  width: auto;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

function CaixaTransacoes() {
    const [users, setUsers] = useState([]);
    const [onEdit, setOnEdit] = useState(null);
  
    const getUsers = async () => {
      try {
        const matriculaCaixa = '00003';

// Fetch transacoes data
        const transacoesResponse = await axios.get("http://localhost:8800/transacoes/");
        const transacoesData = transacoesResponse.data;

        // Fetch funcionarios data
        const funcionariosResponse = await axios.get("http://localhost:8800/func/");
        const funcionariosData = funcionariosResponse.data;

        // Find the caixa (employee) with the specified matriculaCaixa
        const caixa = funcionariosData.find((funcionario) => funcionario.mat === matriculaCaixa);

        if (caixa) {
            // Filter transacoes based on conta_principal belonging to the same agencia as caixa
            const transacoesDoCaixa = transacoesData.filter(
              (transacao) => transacao.conta_principal.num_agencia === caixa.agencia
            );
          
            // Now transacoesDoCaixa contains all transactions with conta_principal in the same agencia as the caixa
            setUsers(transacoesDoCaixa);
          } else {
            console.error('Caixa not found');
          }
        
      } catch (error) {
        toast.error(error);
      }
    };
  
    useEffect(() => {
      getUsers();
    }, []); 

  return (
    <>
     <Container>
        <Title>Transações</Title>
        <Form  onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers}/>
        <TableTrans setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
      </Container>
      <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_LEFT} />
      <GlobalStyle />
    </>
  );
}

export default CaixaTransacoes;
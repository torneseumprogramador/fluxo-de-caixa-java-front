import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [dadosAPI, setDadosAPI] = useState(null);
  const [showAdicionarForm, setShowAdicionarForm] = useState(false);

  async function handleExcluirCaixa(id) {
    if (window.confirm('Confirma?')) { 
      try {
        const response = await fetch(`${API_URL}/api/caixa/excluir/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Erro ao excluir caixa');
        }

        fetchData();
      } catch (error) {
        console.error('Error ao excluir caixa:', error);
      }
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const tipo = formData.get('tipo');
    try {
      const response = await fetch(`${API_URL}/api/caixa?tipo=${tipo}`);
      const data = await response.json();
      setDadosAPI(data);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  }

  async function fetchData() {
    try {
      const response = await fetch(`${API_URL}/api/caixa`);
      const data = await response.json();
      setDadosAPI(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleAdicionarCaixa(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const tipo = formData.get('tipo');
    const valor = parseFloat(formData.get('valor'));
    const status = parseInt(formData.get('status'));
    try {
      const response = await fetch(`${API_URL}/api/caixa/adicionar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo, valor, status }),
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar caixa');
      }
      setShowAdicionarForm(false);
      fetchData();
    } catch (error) {
      console.error('Error ao adicionar caixa:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!dadosAPI) {
    return <div>Loading...</div>;
  }

  const { valorTotal, receitas, despesas, lista } = dadosAPI;

  return (
    <div className="App">
      <div className="container">
        <main role="main" className="pb-3">

          <div className="text-center">
            <h1 className="display-4">Sistema de Fluxo de caixa</h1>
            <hr />

            <div>
              <div className="div-inline-block">
                <b>Valor Total</b><br />
                R$ {valorTotal.toFixed(2)}
              </div>
              <div className="div-inline-block">
                <b>Receitas</b><br />
                R$ {receitas.toFixed(2)}
              </div>
              <div className="div-inline-block despesas">
                <b>Despesas</b><br />
                R$ {despesas.toFixed(2)}
              </div>
            </div>

            <div className="pesquisa">
              <div className="div-inline-block-pesquisa input-adicionar">
                <form onSubmit={handleSearch}>
                  <input name="tipo" type="text" placeholder="Digite algo" />
                  <button className="btn btn-primary">
                    Buscar
                  </button>
                </form>
              </div>
              <div className="div-inline-block-pesquisa btn-adicionar">
                <button className="btn btn-primary" onClick={() => setShowAdicionarForm(true)}>Adicionar</button>
              </div>
            </div>

            {showAdicionarForm && (
              <form onSubmit={handleAdicionarCaixa} className="cadastrar">
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">Tipo</label>
                  <input type="text" className="form-control" id="tipo" name="tipo" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="valor" className="form-label">Valor</label>
                  <input type="number" className="form-control" id="valor" name="valor" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select className="form-select" id="status" name="status" required>
                    <option value="0">Entrada</option>
                    <option value="1">Saída</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Cadastrar</button>
              </form>
            )}

            <table className="table tabela">
              <thead>
                <tr>
                  <th>TIPO</th>
                  <th>VALOR</th>
                  <th>STATUS</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lista.map(caixa => (
                  <tr key={caixa.id}>
                    <td>{caixa.tipo}</td>
                    <td>
                      <span>{caixa.status === 1 ? '- ' : ''}R$ {caixa.valor.toFixed(2)}</span>
                    </td>
                    <td>{caixa.status === 1 ? "Saída" : "Entrada"}</td>
                    <td>
                      <div className={caixa.status === 1 ? "despesa-legenda" : "receita-legenda"}></div>
                    </td>
                    <td style={{ width: "20px" }}>
                      <a href="#"onClick={() => handleExcluirCaixa(caixa.id)}>X</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;

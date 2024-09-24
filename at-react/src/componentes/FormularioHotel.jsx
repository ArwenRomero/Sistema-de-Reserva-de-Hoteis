import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function FormularioHotel() {
  const { id } = useParams();
  const [hotel, setHotel] = useState({
    nome: '',
    imagem: '',
    classificacao: '',
    cidade: '',
    estado: '',
    precoDiaria: '',
    descricao: '',
    imagens: []
  });
  const [error, setError] = useState({});
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const hoteis = JSON.parse(localStorage.getItem('hoteis')) || [];
      const hotelExistente = hoteis.find(hotel => hotel.id === id);
      if (hotelExistente) setHotel(hotelExistente);
    }
  }, [id]);

  const validarFormulario = () => {
    const erros = {};
    if (!hotel.nome) erros.nome = 'O nome do hotel é obrigatório.';
    if (!hotel.imagem) erros.imagem = 'A imagem do hotel é obrigatória.';
    if (!hotel.classificacao) erros.classificacao = 'A classificação é obrigatória.';
    if (!hotel.cidade) erros.cidade = 'A cidade é obrigatória.';
    if (!hotel.estado) erros.estado = 'O estado é obrigatório.';
    if (!hotel.precoDiaria || hotel.precoDiaria < 0) erros.precoDiaria = 'O preço da diária deve ser um valor positivo.';
    if (!hotel.descricao) erros.descricao = 'A descrição é obrigatória.';

    setError(erros);
    return Object.keys(erros).length === 0; // retorna true se não houver erros
  };

  const salvarHotel = () => {
    if (validarFormulario()) {
      const hoteis = JSON.parse(localStorage.getItem('hoteis')) || [];
      try {
        if (id) {
          const indice = hoteis.findIndex(hotel => hotel.id === id);
          hoteis[indice] = hotel;
          setMensagem('Hotel editado com sucesso!');
        } else {
          hotel.id = Date.now().toString();
          hoteis.push(hotel);
          setMensagem('Hotel cadastrado com sucesso!');
        }
        localStorage.setItem('hoteis', JSON.stringify(hoteis));
        navigate('/');
      } catch (error) {
        setMensagem('Erro ao salvar o hotel. Tente novamente.');
        setError({ geral: 'Erro ao salvar. Tente novamente.' });
      }
      
      // Limpa a mensagem após 3 segundos
      setTimeout(() => {
        setMensagem('');
      }, 3000);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h1 style={styles.title}>{id ? 'Editar Hotel' : 'Cadastrar Hotel'}</h1>

      {mensagem && <div style={styles.mensagem}>{mensagem}</div>}

      <input
        type="text"
        placeholder="Nome do hotel"
        value={hotel.nome}
        onChange={(e) => setHotel({ ...hotel, nome: e.target.value })}
        style={styles.input}
      />
      {error.nome && <p style={styles.error}>{error.nome}</p>}

      <input
        type="text"
        placeholder="Link da imagem"
        value={hotel.imagem}
        onChange={(e) => setHotel({ ...hotel, imagem: e.target.value })}
        style={styles.input}
      />
      {error.imagem && <p style={styles.error}>{error.imagem}</p>}

      <input
        type="text"
        placeholder="Classificação (1-5)"
        value={hotel.classificacao}
        onChange={(e) => setHotel({ ...hotel, classificacao: e.target.value })}
        style={styles.input}
      />
      {error.classificacao && <p style={styles.error}>{error.classificacao}</p>}

      <input
        type="text"
        placeholder="Cidade"
        value={hotel.cidade}
        onChange={(e) => setHotel({ ...hotel, cidade: e.target.value })}
        style={styles.input}
      />
      {error.cidade && <p style={styles.error}>{error.cidade}</p>}

      <input
        type="text"
        placeholder="Estado"
        value={hotel.estado}
        onChange={(e) => setHotel({ ...hotel, estado: e.target.value })}
        style={styles.input}
      />
      {error.estado && <p style={styles.error}>{error.estado}</p>}

      <input
        type="number"
        placeholder="Preço da diária"
        value={hotel.precoDiaria}
        onChange={(e) => setHotel({ ...hotel, precoDiaria: e.target.value })}
        style={styles.input}
      />
      {error.precoDiaria && <p style={styles.error}>{error.precoDiaria}</p>}

      <textarea
        placeholder="Descrição dos serviços"
        value={hotel.descricao}
        onChange={(e) => setHotel({ ...hotel, descricao: e.target.value })}
        style={styles.textarea}
      />
      {error.descricao && <p style={styles.error}>{error.descricao}</p>}

      <button onClick={salvarHotel} style={styles.button}>
        {id ? 'Salvar Alterações' : 'Cadastrar Hotel'}
      </button>
    </div>
  );
}

const styles = {
  formContainer: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    resize: 'none',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },
  mensagem: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
    textAlign: 'center',
    transition: 'opacity 0.5s',
  },
};

export default FormularioHotel;

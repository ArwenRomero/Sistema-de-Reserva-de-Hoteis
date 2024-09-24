import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSun, faMoon, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

function ListaHoteis() {
  const [hoteis, setHoteis] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [modoEscuro, setModoEscuro] = useState(false);
  const [ordenacao, setOrdenacao] = useState('preco');
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [detalhesVisible, setDetalhesVisible] = useState(false);
  const [hotel, setHotel] = useState({
    nome: '',
    imagem: '',
    classificacao: '',
    cidade: '',
    estado: '',
    precoDiaria: '',
    descricao: '',
  });
  const [hotelEditando, setHotelEditando] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const [tipoNotificacao, setTipoNotificacao] = useState('');

  useEffect(() => {
    const dadosHoteis = JSON.parse(localStorage.getItem('hoteis')) || [];
    const dadosFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const temaSalvo = localStorage.getItem('modoEscuro') === 'true';
    setHoteis(dadosHoteis);
    setFavoritos(dadosFavoritos);
    setModoEscuro(temaSalvo);
  }, []);

  const mostrarNotificacao = (mensagem, tipo = 'sucesso') => {
    setTipoNotificacao(tipo);
    setNotificacao(mensagem);
    setTimeout(() => {
      setNotificacao(null);
    }, 3000);
  };

  const filtrarHoteis = hoteis
    .filter(hotel => hotel.nome.toLowerCase().includes(pesquisa.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === 'preco') {
        return a.precoDiaria - b.precoDiaria;
      } else {
        return a.classificacao - b.classificacao;
      }
    });

    const alternarModo = () => {
      const novoModo = !modoEscuro;
      setModoEscuro(novoModo);
      localStorage.setItem('modoEscuro', novoModo);
    };

  const renderizarEstrelas = (classificacao) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= classificacao ? faStarSolid : faStarRegular}
          style={{ color: '#FFD700', margin: '0 2px' }}
        />
      );
    }
    return estrelas;
  };

  const salvarHotel = () => {
    const hoteisLocalStorage = JSON.parse(localStorage.getItem('hoteis')) || [];

    if (!hotel.nome || !hotel.imagem || !hotel.classificacao || !hotel.cidade || !hotel.estado || !hotel.precoDiaria || !hotel.descricao) {
      mostrarNotificacao('Por favor, preencha todos os campos antes de salvar.', 'erro');
      return;
    }

    if (hotelEditando) {
      const index = hoteisLocalStorage.findIndex(h => h.id === hotelEditando);
      hoteisLocalStorage[index] = { ...hotel, id: hotelEditando };
      mostrarNotificacao('Hotel atualizado com sucesso!');
    } else {
      hotel.id = Date.now().toString();
      hoteisLocalStorage.push(hotel);
      mostrarNotificacao('Hotel adicionado com sucesso!');
    }
    localStorage.setItem('hoteis', JSON.stringify(hoteisLocalStorage));
    setHoteis(hoteisLocalStorage);
    setHotel({ nome: '', imagem: '', classificacao: '', cidade: '', estado: '', precoDiaria: '', descricao: '' });
    setFormularioVisible(false);
    setHotelEditando(null);
  };

  const toggleFavorito = (hotelId) => {
    const novosFavoritos = favoritos.includes(hotelId)
      ? favoritos.filter(id => id !== hotelId)
      : [...favoritos, hotelId];
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
    mostrarNotificacao(novosFavoritos.includes(hotelId) ? 'Hotel adicionado aos favoritos!' : 'Hotel removido dos favoritos!');
  };

  const verDetalhes = (hotel) => {
    setHotel(hotel);
    setDetalhesVisible(true);
  };

  const editarHotel = (hotel) => {
    setHotel(hotel);
    setFormularioVisible(true);
    setHotelEditando(hotel.id);
  };

  const apagarHotel = (hotelId) => {
    const novosHoteis = hoteis.filter(hotel => hotel.id !== hotelId);
    setHoteis(novosHoteis);
    localStorage.setItem('hoteis', JSON.stringify(novosHoteis));
    mostrarNotificacao('Hotel excluído com sucesso!');
  };

  return (
    <div style={modoEscuro ? styles.containerDark : styles.containerLight}>
      <header style={styles.header(modoEscuro)}>
        <h1 style={styles.titulo}>ArwenVago</h1>
        <div style={styles.menu}>
          <Link to="/" style={styles.link(modoEscuro)}>Home</Link>
          <Link to="/favoritos" style={styles.link(modoEscuro)}>Favoritos</Link>
        </div>
        <button 
          onClick={alternarModo} 
          style={{
            ...styles.botaoModo,
            ...(hovered ? styles.botaoModoHover : {})
          }}
          onMouseEnter={() => setHovered(true)} 
          onMouseLeave={() => setHovered(false)}
        >
          <FontAwesomeIcon icon={modoEscuro ? faSun : faMoon} size="1x" />
        </button>
      </header>

      <h2 style={styles.subtitulo(modoEscuro)}>Top Hotéis somente no ArwenVago</h2>

      {notificacao && (
        <div style={tipoNotificacao === 'sucesso' ? styles.notificacaoSucesso : styles.notificacaoErro}>
          {notificacao}
        </div>
      )}

      <div style={styles.filtroContainer}>
        <input
          type="text"
          placeholder="Pesquisar hotéis..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          style={styles.input(modoEscuro)}
        />
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          style={styles.select(modoEscuro)}
        >
          <option value="preco">Ordenar por Preço</option>
          <option value="classificacao">Ordenar por Classificação</option>
        </select>
      </div>

      <div style={styles.listaHoteis}>
        {filtrarHoteis.map(hotel => (
          <div key={hotel.id} style={styles.card(modoEscuro)}>
            <img src={hotel.imagem} alt={hotel.nome} style={styles.imagem} />
            <h2 style={styles.nome(modoEscuro)}>{hotel.nome}</h2>
            <p>{hotel.cidade}, {hotel.estado}</p>
            <p>R$ {hotel.precoDiaria} por noite</p>
            <div style={styles.classificacao}>
              {renderizarEstrelas(hotel.classificacao)}
              <button onClick={() => toggleFavorito(hotel.id)} style={styles.favoritoBotao}>
                <FontAwesomeIcon icon={favoritos.includes(hotel.id) ? faStarSolid : faStarRegular} />
              </button>
            </div>
            <div style={styles.botoesContainer}>
              <button onClick={() => verDetalhes(hotel)} style={styles.botaoVerDetalhes}>Ver Detalhes</button>
              <button onClick={() => editarHotel(hotel)} style={styles.botaoEditar}>Editar</button>
              <button onClick={() => apagarHotel(hotel.id)} style={styles.botaoApagar}>Apagar</button>
            </div>
          </div>
        ))}
      </div>

      {formularioVisible && (
  <div style={styles.overlay}>
    <div style={styles.modal}>
      <h3>{hotelEditando ? 'Editar Hotel' : 'Cadastrar Novo Hotel'}</h3>
      <input
        type="text"
        placeholder="Nome do hotel"
        value={hotel.nome}
        onChange={(e) => setHotel({ ...hotel, nome: e.target.value })}
        style={styles.input(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <input
        type="text"
        placeholder="Link da imagem"
        value={hotel.imagem}
        onChange={(e) => setHotel({ ...hotel, imagem: e.target.value })}
        style={styles.input(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <input
        type="number"
        placeholder="Classificação (1 a 5)"
        value={hotel.classificacao}
        onChange={(e) => setHotel({ ...hotel, classificacao: e.target.value })}
        style={styles.input(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <input
        type="text"
        placeholder="Cidade"
        value={hotel.cidade}
        onChange={(e) => setHotel({ ...hotel, cidade: e.target.value })}
        style={styles.input(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <input
        type="text"
        placeholder="Estado"
        value={hotel.estado}
        onChange={(e) => setHotel({ ...hotel, estado: e.target.value })}
        style={styles.input(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <input
        type="text"
        placeholder="Preço da diária"
        value={hotel.precoDiaria}
        onChange={(e) => setHotel({ ...hotel, precoDiaria: e.target.value })}
        style={styles.input(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <textarea
        placeholder="Descrição"
        value={hotel.descricao}
        onChange={(e) => setHotel({ ...hotel, descricao: e.target.value })}
        style={styles.textarea(modoEscuro)}
        required
        title="Preencha este campo"
      />
      <div style={styles.botoesModal}>
        <button onClick={salvarHotel} style={styles.botaoSalvar}>Salvar</button>
        <button onClick={() => setFormularioVisible(false)} style={styles.botaoCancelar}>Cancelar</button>
      </div>
    </div>
  </div>
)}

      {detalhesVisible && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{hotel.nome}</h3>
            <img src={hotel.imagem} alt={hotel.nome} style={styles.imagemDetalhes} />
            <p><strong>Classificação:</strong> {renderizarEstrelas(hotel.classificacao)}</p>
            <p><strong>Cidade:</strong> {hotel.cidade}</p>
            <p><strong>Estado:</strong> {hotel.estado}</p>
            <p><strong>Preço da diária:</strong> R$ {hotel.precoDiaria}</p>
            <p><strong>Descrição:</strong> {hotel.descricao}</p>
            <button onClick={() => setDetalhesVisible(false)} style={styles.botaoFechar}>Fechar</button>
          </div>
        </div>
      )}

      <button onClick={() => setFormularioVisible(true)} style={styles.botaoAdicionar}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}

const styles = {
  botaoSalvar: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '10px',
  },
  botaoCancelar: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '10px',
  },
  notificacaoSucesso: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  notificacaoErro: {
    backgroundColor: '#F44336',
    color: 'white',
    padding: '10px',
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  },
  imagemDetalhes: {
    width: '100%',
    borderRadius: '8px',
  },
  botaoFechar: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  favoritoBotao: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: '#FFD700',
    transition: 'transform 0.3s ease, color 0.3s ease',
    marginLeft: '10px',
  },
  favoritoBotaoHover: {
    transform: 'scale(1.2)',
    color: '#FFA500',
  },
  botaoVerDetalhes: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background-color 0.3s',
  },
  botaoVerDetalhesHover: {
    backgroundColor: '#2980b9',
  },
  botaoEditar: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background-color 0.3s',
  },
  botaoEditarHover: {
    backgroundColor: '#e67e22',
  },
  botaoApagar: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background-color 0.3s',
  },
  botaoApagarHover: {
    backgroundColor: '#c0392b',
  },
  containerLight: {
    padding: '0 20px',
    backgroundColor: '#ffffff',
    color: '#000000',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  containerDark: {
    padding: '0 20px',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  header: (modoEscuro) => ({
    width: '100%',
    backgroundColor: modoEscuro ? '#007bff' : '#0056b3',
    color: 'white',
    padding: '20px',
    borderRadius: '0 0 8px 8px',
    textAlign: 'center',
    marginBottom: '20px',
    position: 'relative',
    boxSizing: 'border-box',
  }),
  titulo: {
    margin: '0',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  link: (modoEscuro) => ({
    color: modoEscuro ? 'white' : 'white',
    textDecoration: 'none',
  }),
  botaoModo: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
    padding: '10px',
    borderRadius: '50%',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  botaoModoHover: {
    backgroundColor: '#007bff',
    transform: 'scale(1.1)',
  },
  subtitulo: (modoEscuro) => ({
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
    color: modoEscuro ? 'white' : 'black',
  }),
  filtroContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  input: (modoEscuro) => ({
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    borderRadius: '4px',
    border: modoEscuro ? '1px solid white' : '1px solid #ccc',
    background: modoEscuro ? '#444' : '#fff',
    color: modoEscuro ? 'white' : 'black',
  }),
  select: (modoEscuro) => ({
    padding: '10px',
    borderRadius: '4px',
    border: modoEscuro ? '1px solid white' : '1px solid #ccc',
    background: modoEscuro ? '#444' : '#fff',
    color: modoEscuro ? 'white' : 'black',
  }),
  listaHoteis: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: (modoEscuro) => ({
    width: '30%',
    backgroundColor: modoEscuro ? '#2b2b2b' : '#f9f9f9',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px',
    boxShadow: modoEscuro ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
  }),
  imagem: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  nome: (modoEscuro) => ({
    fontSize: '20px',
    margin: '10px 0',
    color: modoEscuro ? 'white' : 'black',
  }),
  classificacao: {
    margin: '10px 0',
  },
  formContainer: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f1f1f1',
  },
  textarea: (modoEscuro) => ({
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: modoEscuro ? '1px solid white' : '1px solid #ccc',
    background: modoEscuro ? '#444' : '#fff',
    color: modoEscuro ? 'white' : 'black',
    marginBottom: '10px',
  }),
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '5px 0',
  },
  botaoAdicionar: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    padding: '15px',
    cursor: 'pointer',
  },
  
};

export default ListaHoteis;

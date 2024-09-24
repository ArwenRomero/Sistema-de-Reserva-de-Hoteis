import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

function Favoritos() {
  const [hoteis, setHoteis] = useState([]);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const dadosHoteis = JSON.parse(localStorage.getItem('hoteis')) || [];
    setHoteis(dadosHoteis);

    const hoteisFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(hoteisFavoritos);
  }, []);

  const alternarModo = () => {
    setModoEscuro(!modoEscuro);
  };

  const verDetalhes = (hotel) => {
    alert(`Detalhes:\nNome: ${hotel.nome}\nDescrição: ${hotel.descricao}`);
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

  const hoteisFavoritosListados = hoteis.filter(hotel => favoritos.includes(hotel.id));

  return (
    <div style={modoEscuro ? styles.containerDark : styles.containerLight}>
      <header style={styles.header(modoEscuro)}>
        <h1 style={styles.titulo}>Favoritos</h1>
        <div style={styles.menu}>
          <Link to="/" style={styles.link(modoEscuro)}>Home</Link>
          <Link to="/favoritos" style={styles.link(modoEscuro)}>Favoritos</Link>
        </div>
        <button onClick={alternarModo} style={styles.botaoModo}>
          <FontAwesomeIcon icon={modoEscuro ? faSun : faMoon} size="1x" />
        </button>
      </header>

      <h2 style={styles.subtitulo(modoEscuro)}>Seus Hotéis Favoritos</h2>

      <div style={styles.listaHoteis}>
        {hoteisFavoritosListados.length > 0 ? (
          hoteisFavoritosListados.map(hotel => (
            <div key={hotel.id} style={styles.card(modoEscuro)}>
              <img src={hotel.imagem} alt={hotel.nome} style={styles.imagem} />
              <h2 style={styles.nome(modoEscuro)}>{hotel.nome}</h2>
              <p>{hotel.cidade}, {hotel.estado}</p>
              <p>R$ {hotel.precoDiaria} por noite</p>
              <div style={styles.classificacao}>
                {renderizarEstrelas(hotel.classificacao)}
              </div>
              <div style={styles.botoes}>
              <button onClick={() => verDetalhes(hotel)} style={styles.botaoVerDetalhes}>Ver Detalhes</button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.mensagem}>Você ainda não tem hotéis favoritos.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
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
    color: modoEscuro ? 'white' : 'black',
    textDecoration: 'none',
  }),
  botaoModo: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
  },
  subtitulo: (modoEscuro) => ({
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
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
  mensagem: {
    textAlign: 'center',
    fontSize: '18px',
  },
  botoes: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  botao: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  botaoHover: {
    backgroundColor: '#0056b3',
  },
};

export default Favoritos;

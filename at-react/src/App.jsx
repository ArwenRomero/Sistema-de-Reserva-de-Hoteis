import { Routes, Route } from 'react-router-dom';
import ListaHoteis from './componentes/ListaHoteis';
import FormularioHotel from './componentes/FormularioHotel';
import Favoritos from './componentes/Favoritos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListaHoteis />} />
      <Route path="/novo-hotel" element={<FormularioHotel />} />
      <Route path="/favoritos" element={<Favoritos />} />
    </Routes>
  );
}

export default App;

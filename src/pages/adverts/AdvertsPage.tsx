import React from 'react';
import Layout from '../../components/Layout/Layout'; 
import { Link } from 'react-router-dom';

const AdvertsPage: React.FC = () => {
  // TODO: Fetch y mostrar anuncios, implementar filtros
  const adverts = []; // Placeholder
  return (
    <Layout title="Listado de Anuncios">
      {adverts.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No hay anuncios disponibles.</p>
          <Link to="/adverts/new" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md">
            Crear Nuevo Anuncio
          </Link>
        </div>
      ) : (
        <ul>
          {/* TODO: Mapear y mostrar anuncios */}
          <li>Anuncio 1</li>
          <li>Anuncio 2</li>
        </ul>
      )}
    </Layout>
  );
};
export default AdvertsPage;
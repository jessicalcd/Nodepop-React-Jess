import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'; 

const NotFoundPage: React.FC = () => {
  return (
    <Layout title="Página No Encontrada (404)">
      <div className="text-center py-10">
        <h1 className="text-6xl font-bold text-slate-700 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8">
          Oops! La página que estás buscando no existe o no se pudo encontrar.
        </p>
        <Link
          to="/adverts"
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-md transition duration-150 text-lg"
        >
          Volver al Listado de Anuncios
        </Link>
      </div>
    </Layout>
  );
};
export default NotFoundPage;
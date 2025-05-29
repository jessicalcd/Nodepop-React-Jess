import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'; 

const AdvertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // TODO: Fetch y mostrar detalle del anuncio con id
  return (
    <Layout title={`Detalle del Anuncio ${id}`}>
      <p>Información detallada del anuncio con ID: {id} irá aquí.</p>
      {/* TODO: Botón de borrado con confirmación */}
    </Layout>
  );
};
export default AdvertDetailPage;
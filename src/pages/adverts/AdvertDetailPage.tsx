
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'; 
import { getAdvertDetail, deleteAdvert } from '../../services/advertsService'; 
import { Ad } from '../../types';


const AdvertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [advert, setAdvert] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/404', { replace: true });
      return;
    }

    let isActive = true; 

    const fetchAdvert = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedAdvert = await getAdvertDetail(id);
        if (isActive) {
          setAdvert(fetchedAdvert);
        }
      } catch (err: any) {
        if (isActive) {
          if (err.response && err.response.status === 404) {
            navigate('/404', { replace: true });
          } else {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar el detalle del anuncio.';
            setError(errorMessage);
            console.error("Error fetching advert detail:", err);
          }
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchAdvert();

    return () => {
      isActive = false; 
    };
  }, [id, navigate]);

  const handleDeleteInitiate = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAdvert(id);
      alert('Anuncio borrado con éxito.'); 
      navigate('/adverts');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al borrar el anuncio.';
      setError(errorMessage);
      console.error("Error deleting advert:", err);
      setIsDeleting(false); 
    }
    setShowConfirmDeleteModal(false); 
  };

  
  let finalPhotoUrl: string | null = null;

  if (advert && advert.photo) {
    const photoPathFromApi = advert.photo;

    if (photoPathFromApi.startsWith('http://') || photoPathFromApi.startsWith('https://')) {
      finalPhotoUrl = photoPathFromApi;
    } else {
      const photoBaseServerUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', ''); 
      finalPhotoUrl = `${photoBaseServerUrl}${photoPathFromApi}`;
    }
  }
  



  if (isLoading) {
    return (
      <Layout title="Cargando Anuncio...">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando detalle del anuncio...</p>
        </div>
      </Layout>
    );
  }

  if (error) { 
    return (
      <Layout title="Error">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md max-w-2xl mx-auto my-8">
          <p className="font-bold text-lg mb-2">Error al cargar el anuncio</p>
          <p className="mb-4">{error}</p>
          <Link to="/adverts" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
            &larr; Volver al listado de anuncios
          </Link>
        </div>
      </Layout>
    );
  }
  
  if (!advert) {
    return (
        <Layout title="Anuncio no encontrado">
            <p className="text-center text-red-500 py-10">El anuncio que buscas no existe o no se pudo cargar.</p>
        </Layout>
    );
  }

  return (
    <Layout title={advert.name || "Detalle del Anuncio"}>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        {finalPhotoUrl ? (
          <img 
            src={finalPhotoUrl} 
            alt={advert.name} 
            className="w-full max-h-[500px] object-contain rounded-md mb-6 shadow-md bg-slate-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = 'https://placehold.co/800x600/e2e8f0/94a3b8?text=Imagen+no+disponible';
              console.error('Error al cargar la imagen desde la URL (onError en img):', finalPhotoUrl);
            }} 
          />
        ) : (
          <div className="w-full h-72 sm:h-96 flex items-center justify-center bg-slate-200 rounded-md mb-6 shadow-md">
            <p className="text-slate-500">Sin Imagen Disponible</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-6 items-start">
          <div className="md:col-span-2">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${advert.sale ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {advert.sale ? 'En Venta' : 'Se Busca'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{advert.name}</h1>
            <p className="text-3xl sm:text-4xl font-bold text-slate-700 my-3">
              {advert.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
            {Array.isArray(advert.tags) && advert.tags.length > 0 && (
              <div className="my-4">
                <h4 className="font-semibold text-slate-700 mb-1 text-sm uppercase tracking-wider">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {advert.tags.map(tag => (
                    <span key={tag} className="inline-block bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-1 md:pt-10">
              <button 
                onClick={handleDeleteInitiate}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={isDeleting}
              >
                {isDeleting ? 'Borrando...' : 'Borrar Anuncio'}
              </button>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200">
            <Link to="/adverts" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Volver al listado de anuncios
            </Link>
        </div>
      </div>

      
      {showConfirmDeleteModal && advert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all sm:my-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Confirmar Borrado</h3>
            <p className="text-slate-600 mb-6 text-sm">
              ¿Estás realmente seguro de que quieres borrar el anuncio "<strong>{advert.name}</strong>"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition duration-150 text-sm font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isDeleting ? 'Borrando...' : 'Sí, Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdvertDetailPage;


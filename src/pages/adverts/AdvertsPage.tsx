// src/pages/adverts/AdvertsPage.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'; 
import { getAdverts, getTags } from '../../services/advertsService'; 
import { Ad, AdFilters } from '../../types';

const AdvertsPage: React.FC = () => {
  const [adverts, setAdverts] = useState<Ad[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterNameInput, setFilterNameInput] = useState('');
  const [filterSaleInput, setFilterSaleInput] = useState<'all' | 'true' | 'false'>('all'); // Mantiene los strings "true"/"false"
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [selectedTagsInput, setSelectedTagsInput] = useState<string[]>([]);

  const fetchAdvertsAndInitialTags = async (currentFilters?: AdFilters) => {
    console.log('[AdvertsPage] PASO 1: fetchAdvertsAndInitialTags INICIO con filtros:', JSON.stringify(currentFilters));
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AdvertsPage] PASO 2: Llamando a getAdverts con:', JSON.stringify(currentFilters));
      const advertsPromise = getAdverts(currentFilters); 
      
      const tagsPromise = availableTags.length === 0 
        ? getTags() 
        : Promise.resolve(availableTags);

      const [fetchedAdverts, fetchedTags] = await Promise.all([
        advertsPromise,
        tagsPromise
      ]);
      
      console.log('[AdvertsPage] PASO 4: Anuncios recibidos en AdvertsPage:', fetchedAdverts);
      console.log('[AdvertsPage] Tags recibidos/existentes en AdvertsPage:', fetchedTags);
      setAdverts(fetchedAdverts);
      if (availableTags.length === 0 && Array.isArray(fetchedTags)) { 
        setAvailableTags(fetchedTags);
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar datos de anuncios.';
      setError(errorMessage);
      console.error("[AdvertsPage] Error en fetchAdvertsAndInitialTags:", err);
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    fetchAdvertsAndInitialTags(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('[AdvertsPage] handleApplyFilters llamado');
    
    let priceFilterValue = '';
    if (priceMinInput && priceMaxInput) {
      priceFilterValue = `${priceMinInput}-${priceMaxInput}`;
    } else if (priceMinInput) {
      priceFilterValue = `${priceMinInput}-`;
    } else if (priceMaxInput) {
      priceFilterValue = `-${priceMaxInput}`;
    }

    const activeFilters: AdFilters = {
      name: filterNameInput || undefined,
      // El valor de filterSaleInput ya es "true", "false" o "all".
      // Si es "all", lo queremos como undefined para no enviar el filtro.
      // Si es "true" o "false", esos son strings válidos para query params.
      sale: filterSaleInput === 'all' ? undefined : filterSaleInput,
      price: priceFilterValue || undefined,
      tags: selectedTagsInput.length > 0 ? selectedTagsInput.join(',') : undefined,
    };
    
    Object.keys(activeFilters).forEach(keyStr => {
      const key = keyStr as keyof AdFilters;
      if (activeFilters[key] === undefined || activeFilters[key] === '') {
        delete activeFilters[key];
      }
    });

    console.log('[AdvertsPage] Filtros activos a enviar:', JSON.stringify(activeFilters));

    fetchAdvertsAndInitialTags(activeFilters);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTagsInput(prevSelectedTags => 
      prevSelectedTags.includes(tag) 
        ? prevSelectedTags.filter(t => t !== tag) 
        : [...prevSelectedTags, tag]
    );
  };
 
  if (isLoading && adverts.length === 0) { 
    return (
      <Layout title="Listado de Anuncios">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando anuncios...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Listado de Anuncios en Nodepop">
      {/* --- Sección de Filtros --- */}
      <form onSubmit={handleApplyFilters} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
        {/* ... (resto del formulario de filtros como lo tenías, es visualmente igual) ... */}
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Filtrar Anuncios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Filtro por Nombre */}
          <div>
            <label htmlFor="filterNameInput" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              id="filterNameInput"
              name="name"
              value={filterNameInput}
              onChange={e => setFilterNameInput(e.target.value)}
              placeholder="Ej: Bicicleta, iPhone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Filtro Compra/Venta */}
          <div>
            <label htmlFor="filterSaleInput" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              id="filterSaleInput"
              name="sale"
              value={filterSaleInput}
              onChange={e => setFilterSaleInput(e.target.value as 'all' | 'true' | 'false')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">Todos</option>
              <option value="true">Venta</option>
              <option value="false">Compra</option>
            </select>
          </div>

          {/* Filtro por Precio */}
          <div className="sm:col-span-2 lg:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Precio (€)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="priceMin"
                value={priceMinInput}
                onChange={e => setPriceMinInput(e.target.value)}
                placeholder="Mín."
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <input
                type="number"
                name="priceMax"
                value={priceMaxInput}
                onChange={e => setPriceMaxInput(e.target.value)}
                placeholder="Máx."
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Filtro por Tags */}
          <div className="sm:col-span-full lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            {availableTags.length > 0 ? (
              <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border border-gray-300 p-3 rounded-md max-h-32 overflow-y-auto bg-white">
                {availableTags.map(tag => (
                  <label key={tag} className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTagsInput.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic mt-1">{isLoading ? 'Cargando tags...' : 'No hay tags disponibles.'}</p>
            )}
          </div>

          <div className="sm:col-span-full lg:col-auto flex items-end"> 
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-md transition duration-150 disabled:opacity-50"
            >
              {isLoading && adverts.length > 0 ? 'Actualizando...' : 'Aplicar Filtros'}
            </button>
          </div>
        </div>
      </form>
      {/* --- Fin Sección de Filtros --- */}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error al cargar anuncios</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && adverts.length === 0 && !error && (
        <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md">
          <p className="text-slate-600 text-lg mb-4">No se encontraron anuncios con los filtros actuales o no hay anuncios creados.</p>
          <Link 
            to="/adverts/new" 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
          >
            Crear un Anuncio
          </Link>
        </div>
      )}

      {adverts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adverts.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 duration-200">
              <Link to={`/adverts/${ad.id}`} className="block">
                {ad.photo ? (
                  <img 
                    src={ad.photo.startsWith('http') ? ad.photo : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${ad.photo}`} 
                    alt={ad.name} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Sin+Imagen'; 
                    }}
                  />
                ) : (
                   <img 
                    src="https://placehold.co/400x300/e2e8f0/94a3b8?text=Sin+Imagen" 
                    alt="Placeholder Sin Imagen" 
                    className="w-full h-48 object-cover bg-slate-200"
                   />
                )}
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-slate-800 mb-1 truncate" title={ad.name}>
                  <Link to={`/adverts/${ad.id}`} className="hover:text-indigo-600">{ad.name}</Link>
                </h3>
                <p className="text-lg font-bold text-slate-700 mb-2">
                  {ad.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
                <p className={`text-xs font-semibold mb-2 uppercase tracking-wider ${ad.sale ? 'text-green-600' : 'text-blue-600'}`}>
                  {ad.sale ? 'En Venta' : 'Se Busca'}
                </p>
                {Array.isArray(ad.tags) && ad.tags.length > 0 && ( // Verificación Array.isArray para ad.tags
                  <div className="mb-3 flex flex-wrap gap-1">
                    {ad.tags.map(tag => (
                      <span key={tag} className="inline-block bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-2"> 
                  <Link
                    to={`/adverts/${ad.id}`}
                    className="block w-full text-center bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-3 rounded-md text-sm transition duration-150"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};
export default AdvertsPage;
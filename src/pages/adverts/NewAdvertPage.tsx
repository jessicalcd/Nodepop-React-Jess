import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout'; 
import { createAdvert, getTags } from '../../services/advertsService'; 
import { Ad } from '../../types'; 

const NewAdvertPage: React.FC = () => {
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [sale, setSale] = useState(true); 
  const [price, setPrice] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  
  useEffect(() => {
    const fetchTags = async () => {
      setIsTagsLoading(true);
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch (err: any) {
        console.error("Error al cargar tags:", err);
        setError("No se pudieron cargar los tags disponibles para la selección.");
      } finally {
        setIsTagsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter(t => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    } else {
      setPhoto(null);
    }
  };

  
  const canSubmit = 
    name.trim() !== '' &&
    price.trim() !== '' &&
    parseFloat(price) >= 0 &&
    selectedTags.length > 0 &&
    !isLoading;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError('Por favor, completa todos los campos requeridos correctamente (nombre, precio >= 0, y al menos un tag).');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('sale', String(sale)); 
    formData.append('price', price);
    selectedTags.forEach(tag => formData.append('tags', tag)); 
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const newAdvert: Ad = await createAdvert(formData);
      navigate(`/adverts/${newAdvert.id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el anuncio.';
      setError(errorMessage);
      console.error("Error creando anuncio:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="Crear Nuevo Anuncio">
      <div className="max-w-2xl mx-auto mt-6 mb-8 bg-white p-6 sm:p-8 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Anuncio <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              disabled={isLoading}
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Anuncio <span className="text-red-500">*</span></label>
            <div className="mt-2 flex space-x-4 rounded-md border border-gray-300 p-2 bg-slate-50">
              <label className="flex-1 inline-flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors duration-150 ease-in-out"
                     style={sale ? { backgroundColor: '#10B981', color: 'white' } : {backgroundColor: '#EFF6FF', color: '#374151'}}>
                <input 
                  type="radio" 
                  name="sale" 
                  value="true" 
                  checked={sale === true} 
                  onChange={() => setSale(true)}
                  className="sr-only" 
                  disabled={isLoading}
                />
                <span className="text-sm font-medium">Venta</span>
              </label>
              <label className="flex-1 inline-flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors duration-150 ease-in-out"
                     style={!sale ? { backgroundColor: '#3B82F6', color: 'white' } : {backgroundColor: '#EFF6FF', color: '#374151'}}>
                <input 
                  type="radio" 
                  name="sale" 
                  value="false" 
                  checked={sale === false} 
                  onChange={() => setSale(false)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium">Compra (Búsqueda)</span>
              </label>
            </div>
          </div>

          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio (€) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              id="price" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required 
              min="0" 
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              disabled={isLoading}
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (selecciona al menos uno) <span className="text-red-500">*</span></label>
            {isTagsLoading ? (
              <p className="text-sm text-gray-500 italic mt-1">Cargando tags disponibles...</p>
            ) : availableTags.length > 0 ? (
              <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border border-gray-300 p-3 rounded-md max-h-40 overflow-y-auto bg-slate-50">
                {availableTags.map(tag => (
                  <label key={tag} className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out border-2 ${selectedTags.includes(tag) ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'}`}>
                    <input 
                      type="checkbox" 
                      value={tag} 
                      checked={selectedTags.includes(tag)} 
                      onChange={() => handleTagToggle(tag)}
                      className="sr-only" 
                      disabled={isLoading}
                    />
                    <span className="text-sm font-medium capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-500 italic mt-1">No hay tags disponibles o no se pudieron cargar.</p>
            )}
          </div>

        
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Foto del Anuncio (opcional)</label>
            <input 
              type="file" 
              id="photo" 
              onChange={handlePhotoChange} 
              accept="image/png, image/jpeg, image/gif, image/webp"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 disabled:opacity-50"
              disabled={isLoading}
            />
            {photo && <p className="text-xs text-gray-500 mt-1">Archivo seleccionado: {photo.name}</p>}
          </div>
          
          
          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">
              {error}
            </p>
          )}

          
          
          <div>
            <button 
              type="submit" 
              disabled={!canSubmit}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando anuncio...
                </>
              ) : (
                'Crear Anuncio'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewAdvertPage;
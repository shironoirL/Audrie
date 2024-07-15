import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchSearchResults = async (query) => {
  const response = await axios.get(`/api/drugs/?search=${query}`);
  return response.data.results;
};

const DrugCategories = ({ categories }) => {
  const [showAll, setShowAll] = useState(false);

  const categoriesArray = categories.split('|');
  const categoriesToShow = showAll ? categoriesArray : categoriesArray.slice(0, 3);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {categoriesToShow.map((category, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {category}
        </span>
      ))}
      {categoriesArray.length > 3 && (
        <button
          onClick={toggleShowAll}
          className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

const removeSquareBrackets = (text) => {
  return text.replace(/\[.*?\]/g, '');
};

const removeSubTags = (text) => {
  return text.replace(/<sub>/g, '').replace(/<\/sub>/g, '');
};

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => fetchSearchResults(query),
  });

  const groupColors = {
    approved: 'bg-green-100 text-green-800',
    experimental: 'bg-yellow-100 text-yellow-800',
    investigational: 'bg-yellow-100 text-yellow-800',
    withdrawn: 'bg-red-100 text-red-800',
    nutraceutical: 'bg-teal-100 text-teal-800',
    vet_approved: 'bg-green-100 text-green-800',
    illicit: 'bg-red-100 text-red-800',
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">Compounds matching '{query}'</h1>
      <ul className="space-y-4">
        {data.map(drug => {
          const cleanedDescription = removeSubTags(removeSquareBrackets(drug.description));

          return (
            <li key={drug.dbid} className="p-4 border rounded shadow hover:bg-gray-100">
              <h1 className="text-blue-700 font-bold hover:text-purple-800">
                <Link to={`/drugs/${drug.name}`}>
                  {drug.name}
                </Link>
              </h1>
              <p><strong>Description:</strong> {cleanedDescription}</p>
              <p><strong>Group:</strong></p>
              <div className="flex flex-wrap gap-2 mt-2">
                {drug.group.split('|').map((group, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${groupColors[group] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {group}
                  </span>
                ))}
              </div>
              <p><strong>Categories:</strong></p>
              <DrugCategories categories={drug.categories} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;

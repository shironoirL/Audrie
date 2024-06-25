import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchSearchResults = async (query) => {
  const response = await axios.get(`/api/drugs/?search=${query}`);
  return response.data.results;
};

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => fetchSearchResults(query),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
      <ul className="space-y-4">
        {data.map(drug => (
          <li key={drug.dbid} className="p-4 border rounded shadow hover:bg-gray-100">
            <h2 className="text-lg font-semibold">
              <Link to={`/drugs/${drug.name}`}>
                {drug.name}
              </Link>
            </h2>
            <p><strong>Description:</strong> {drug.description}</p>
            <p><strong>Mechanism:</strong> {drug.mechanism_large}</p>
            <p><strong>Group:</strong> {drug.group}</p>
            <p><strong>Categories:</strong></p>
            <div className="flex flex-wrap gap-2 mt-2">
              {drug.categories.split('|').map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;

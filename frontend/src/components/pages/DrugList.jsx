import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const fetchDrugs = async ({ queryKey }) => {
  const [, page] = queryKey;
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/drugs/?page=${page}`, { headers });
  return response.data;
};

const removeSquareBrackets = (text) => {
  return text.replace(/\[.*?\]/g, '');
};

const removeSubTags = (text) => {
  return text.replace(/<sub>/g, '').replace(/<\/sub>/g, '');
};

const DrugList = () => {
  const [page, setPage] = useState(1);
  const [expandedDrug, setExpandedDrug] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['drugs', page],
    queryFn: fetchDrugs,
    keepPreviousData: true
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  const handleNextPage = () => {
    if (data.next) {
      setPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data.previous && page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const toggleExpand = (dbid) => {
    setExpandedDrug(expandedDrug === dbid ? null : dbid);
  };

  const groupColors = {
    approved: 'bg-green-100 text-green-800',
    experimental: 'bg-yellow-100 text-yellow-800',
    investigational: 'bg-yellow-100 text-yellow-800',
    withdrawn: 'bg-red-100 text-red-800',
    nutraceutical: 'bg-teal-100 text-teal-800',
    vet_approved: 'bg-green-100 text-green-800',
    illicit: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available compounds for potential repurposing</h1>
      <ul className="space-y-4">
        {data.results.map(drug => {
          const cleanedDescription = removeSubTags(removeSquareBrackets(drug.description));
          const categories = drug.categories.split('|');
          const isExpanded = expandedDrug === drug.dbid;

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
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.slice(0, isExpanded ? categories.length : 5).map((category, index) => (
                      <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                    {category}
                  </span>
                  ))}
                  {categories.length > 5 && (
                      <button
                          onClick={() => toggleExpand(drug.dbid)}
                          className="px-3 py-1 bg-blue-300 text-blue-800 rounded-full text-sm"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                  )}
                </div>
              </li>
          );
        })}
      </ul>
      <div className="flex justify-between mt-4 max-w-md mx-auto">
        <button
          onClick={handlePreviousPage}
          disabled={!data.previous}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={!data.next}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DrugList;

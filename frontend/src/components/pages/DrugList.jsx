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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Drug List</h1>
      <ul className="space-y-4">
        {data.results.map(drug => {
          const categories = drug.categories.split('|');
          const isExpanded = expandedDrug === drug.dbid;

          return (
            <li key={drug.dbid} className="p-4 border rounded shadow hover:bg-gray-100">
              <h2 className="text-lg text-blue-700 font-semibold">
                <Link to={`/drugs/${drug.name}`}>
                  {drug.name}
                </Link>
              </h2>
              <p><strong>Description:</strong> {drug.description}</p>
              <p><strong>Mechanism:</strong> {drug.mechanism_large}</p>
              <p><strong>Group:</strong> {drug.group}</p>
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
              {/*<p><strong>Indication:</strong> {drug.indication}</p>*/}
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

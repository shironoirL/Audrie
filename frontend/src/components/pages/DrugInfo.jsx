import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const fetchDrugDetail = async (drugName) => {
  const drugNameEncoded = encodeURIComponent(drugName);
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/drugs/${drugNameEncoded}`, { headers });
  return response.data;
};

const removeSquareBrackets = (text) => {
  return text.replace(/\[.*?\]/g, '');
};

const removeHTMLTags = (text) => {
  return text.replace(/<\/?[^>]+(>|$)/g, '');
};

const fixEncoding = (text) => {
  const misencodedChars = {
    'â': '’',
    'â': '“',
    'â': '”',
    'â¢': '•',
    'â¢': '•',
    'â¢': '•',
    'â¬': '€',
    'â': '∂',
    'â': '∑',
    'â': '∏',
    'â': '≈',
    'â ': '≠',
    'â': '∞',
    'â¤': '≤',
    'â¥': '≥',
    'Î±': 'α',
    'Î²': 'β',
    'Î³': 'γ',
    'Î´': 'δ',
    'Îµ': 'ε',
    'Î¶': 'ζ',
    'Î·': 'η',
    'Î¸': 'θ',
    'Î¹': 'ι',
    'Îº': 'κ',
    'Î»': 'λ',
    'Î¼': 'μ',
    'Î½': 'ν',
    'Î¾': 'ξ',
    'Î¿': 'ο',
    'Îπ': 'π',
    'Î¿Ï': 'ρ',
    'Ï': 'σ',
    'Ï': 'τ',
    'Ï': 'υ',
    'Ï': 'φ',
    'Ï': 'χ',
    'Ï': 'ψ',
    'Ï': 'ω',
    'Â': ' ',
  };

  return text.replace(/â|â|â|â¢|â¢|â¬|â|â|â|â|â |â|â¤|â¥|Î±|Î²|Î³|Î´|Îµ|Î¶|Î·|Î¸|Î¹|Îº|Î»|Î¼|Î½|Î¾|Î¿|Îπ|Î¿Ï|Ï|Ï|Ï|Ï|Ï|Ï|Ï|Â/g, match => misencodedChars[match] || match);
};

const cleanText = (text) => {
  return fixEncoding(removeHTMLTags(removeSquareBrackets(text)));
};

const DrugInfo = ({ drugName }) => {
  const { data: drugData, isLoading, error } = useQuery({
    queryKey: ['drugDetail', drugName],
    queryFn: () => fetchDrugDetail(drugName),
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  const categories = drugData.categories.split('|');
  const atcCodes = drugData.atc_code.split('|');
  const groups = drugData.group.split('|');

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
    <div className="p-4 border rounded shadow">
      <p><strong>Description:</strong> {cleanText(drugData.description)}</p>
      <p className="mt-4"><strong>Mechanism:</strong> {cleanText(drugData.mechanism_large)}</p>
      <p className="mt-4"><strong>Group:</strong></p>
      <div className="flex flex-wrap gap-2 mt-2">
        {groups.map((group, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm ${groupColors[group] || 'bg-gray-100 text-gray-800'} whitespace-nowrap`}
          >
            {group}
          </span>
        ))}
      </div>
      <p className="mt-4"><strong>Categories:</strong></p>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.slice(0, isExpanded ? categories.length : 3).map((category, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap"
          >
            {category}
          </span>
        ))}
        {categories.length > 3 && (
          <button
            onClick={toggleExpand}
            className="px-3 py-1 bg-blue-300 text-blue-800 rounded-full text-sm whitespace-nowrap"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      <p className="mt-4"><strong>Type:</strong></p>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm whitespace-nowrap">
          {drugData.type}
        </span>
      </div>
      <p className="mt-4"><strong>ATC Code:</strong></p>
      <div className="flex flex-wrap gap-2 mt-2">
        {atcCodes.map((code, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm whitespace-nowrap"
          >
            {code}
          </span>
        ))}
      </div>
      <p className="mt-4"><strong>Inchikey:</strong> {drugData.inchikey}</p>
      <p className="mt-4"><strong>Pharmacodynamics:</strong> {cleanText(drugData.pharmacodynamics)}</p>
      <p className="mt-4"><strong>Toxicity:</strong> {cleanText(drugData.toxicity)}</p>
      <p className="mt-4"><strong>Clearance:</strong> {cleanText(drugData.clearance)}</p>
      <p className="mt-4"><strong>Route of elimination:</strong> {cleanText(drugData.route_of_elimination)}</p>
      <p className="mt-4"><strong>Metabolism:</strong> {cleanText(drugData.metabolism)}</p>
      <p className="mt-4"><strong>smiles:</strong> {drugData.smiles}</p>
    </div>
  );
};

export default DrugInfo;

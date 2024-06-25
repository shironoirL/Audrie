import React, { useEffect } from 'react';
import $ from 'jquery';
import '../css/datatables.min.css';
import 'datatables.net-dt';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const MetapathPredictionTable = ({ data }) => {
  const token = getAuthToken();

  useEffect(() => {
    if (!token) return;

    if (data && data.results.length > 0) {
      console.log('Data received for Metapath Prediction Table:', data); // Debugging line

      const formattedData = data.results.map(item => ({
        metapath: item.metapath || 'Unknown', // Default to 'Unknown' if metapath is undefined
        percent_of_prediction: item.percent_of_prediction ? item.percent_of_prediction.toFixed(2) : 'N/A',
        path_count: item.path_count ? item.path_count : 'N/A',
        length: item.length ? item.length : 'N/A',
        verbose: item.verbose || 'Unknown',
      }));

      console.log('Formatted data for DataTables:', formattedData); // Debugging line

      $('#metapathPredictionTable').DataTable({
        destroy: true,
        data: formattedData,
        columns: [
          { data: 'metapath', title: 'Metapath' },
          { data: 'percent_of_prediction', title: 'Percent of Prediction' },
          { data: 'path_count', title: 'Path Count' },
          { data: 'length', title: 'Length' },
          { data: 'verbose', title: 'Verbose Path' },
        ],
        paging: true,
        pageLength: 5,
        lengthChange: true,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      });
    }
  }, [data, token]);

  if (!token) {
    return <p className="text-center">Log in to inspect drug repurposing details</p>;
  }

  if (!data || data.results.length === 0) return <p className="text-center">No metapath predictions available.</p>;

  return (
    <div className="overflow-x-auto">
      <table id="metapathPredictionTable" className="min-w-full bg-white border border-gray-200 display">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Metapath</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Percent of Prediction</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Path Count</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Length</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Verbose Path</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default MetapathPredictionTable;

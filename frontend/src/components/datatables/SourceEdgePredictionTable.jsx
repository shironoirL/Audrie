import React, { useEffect } from 'react';
import $ from 'jquery';
import '../css/datatables.min.css';
import 'datatables.net-dt';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const SourceEdgePredictionTable = ({ data }) => {
  const token = getAuthToken();

  useEffect(() => {
    if (!token) return;

    if (data && data.results.length > 0) {
      console.log('Data received for Source Edge Prediction Table:', data);

      const formattedData = data.results.map(item => ({
        source_edge: item.source_edge || 'Unknown',
        percent_of_prediction: item.percent_of_prediction ? item.percent_of_prediction.toFixed(2) : 'N/A',
        path_count: item.path_count ? item.path_count : 'N/A',
        distinct_metapaths: item.distinct_metapaths ? item.distinct_metapaths : 'N/A',
      }));

      console.log('Formatted data for DataTables:', formattedData);

      $('#sourceEdgePredictionTable').DataTable({
        destroy: true,
        data: formattedData,
        columns: [
          { data: 'source_edge', title: 'Source Edge' },
          { data: 'percent_of_prediction', title: 'Percent of Prediction' },
          { data: 'path_count', title: 'Path Count' },
          { data: 'distinct_metapaths', title: 'Distinct Metapaths' },
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

  if (!data || data.results.length === 0) return <p className="text-center">No source edge predictions available.</p>;

  return (
    <div className="overflow-x-auto">
      <table id="sourceEdgePredictionTable" className="min-w-full bg-white border border-gray-200 display">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Source Edge</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Percent of Prediction</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Path Count</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Distinct Metapaths</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default SourceEdgePredictionTable;

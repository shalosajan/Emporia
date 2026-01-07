import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAlert } from '../../context/AlertContext';

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/api/auth/admin/audit-logs/');
                setLogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching audit logs:", error);
                showAlert("Failed to load audit logs.", 'error');
                setLoading(false);
            }
        };

        fetchLogs();
    }, [showAlert]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading audit trail...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Audit Logs</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {log.actor_email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${log.action.includes('IMPERSONATE') ? 'bg-purple-100 text-purple-800' :
                                            log.action.includes('DELETED') ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.target}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.details}>
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No audit logs recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditLogs;

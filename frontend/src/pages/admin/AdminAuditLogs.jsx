import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAlert } from '../../context/AlertContext';
import { ShieldAlert, User, Activity, Target, AlignLeft, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

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

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Security Audit Trail</h2>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:block bg-glass-surface backdrop-blur-xl border border-glass-border rounded-xl overflow-hidden shadow-2xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Actor</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Target</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-transparent">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                    {log.actor_email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge variant={
                                        log.action.includes('IMPERSONATE') ? 'warning' :
                                            log.action.includes('DELETED') || log.action.includes('BLOCK') ? 'error' :
                                                'primary'
                                    }>
                                        {log.action}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {log.target}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate font-mono" title={log.details}>
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No security events recorded.
                    </div>
                )}
            </div>

            {/* --- MOBILE VIEW (CARDS) --- */}
            <div className="md:hidden space-y-4">
                {logs.map((log) => (
                    <Card key={log.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <Badge variant={
                                log.action.includes('IMPERSONATE') ? 'warning' :
                                    log.action.includes('DELETED') || log.action.includes('BLOCK') ? 'error' :
                                        'primary'
                            } className="text-xs">
                                {log.action}
                            </Badge>
                            <span className="text-xs text-gray-500 font-mono">
                                {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-indigo-400" />
                                <span className="text-white font-medium">{log.actor_email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target size={14} className="text-gray-500" />
                                <span className="text-gray-300">{log.target}</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded text-xs text-gray-400 font-mono break-all">
                                {log.details}
                            </div>
                        </div>
                    </Card>
                ))}
                {logs.length === 0 && (
                    <div className="p-8 text-center text-gray-500 bg-white/5 rounded-lg border border-white/10">
                        No security events recorded.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditLogs;

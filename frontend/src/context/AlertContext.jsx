import React, { createContext, useState, useContext } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import Button from '../components/ui/Button';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            {alert && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-obsidian border border-glass-border p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-all scale-100 flex flex-col items-center text-center">
                        <div className={`
                            mb-4 p-3 rounded-full 
                            ${alert.type === 'error' ? 'bg-red-500/20 text-red-500' :
                                alert.type === 'success' ? 'bg-green-500/20 text-green-500' :
                                    'bg-indigo-500/20 text-indigo-400'}
                        `}>
                            {alert.type === 'error' ? <AlertCircle size={32} /> :
                                alert.type === 'success' ? <CheckCircle size={32} /> :
                                    <Info size={32} />}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 capitalize">{alert.type}</h3>
                        <p className="text-gray-300 mb-6 text-sm">{alert.message}</p>

                        <div className="w-full">
                            <Button
                                onClick={closeAlert}
                                variant={alert.type === 'error' ? 'danger' : 'primary'}
                                className="w-full"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};

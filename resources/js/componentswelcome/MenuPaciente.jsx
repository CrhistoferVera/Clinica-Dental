import { useState } from 'react';

export default function MenuPaciente({ activeTab, setActiveTab }) {
    const tabs = [
        {
            id: 'reservar',
            label: 'Reservar Cita',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            id: 'confirmar',
            label: 'Confirmar Cita',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            id: 'historial',
            label: 'Historial de Citas',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
    ];

    return (
        <div className="w-full bg-white shadow-md rounded-xl mt-16 mb-6">
            <div className="flex flex-col sm:flex-row">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-cyan-600 text-white'
                                : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                        } ${
                            tab.id === 'reservar' ? 'rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none' : ''
                        } ${
                            tab.id === 'historial' ? 'rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none' : ''
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import api from '../config/api';
import './App.css';

export default function ClienteQueue() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [clientId, setClientId] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        try {

            const response = await api.post('/queue', {
                client_id: clientId,
                first_name: firstName,
                last_name: lastName
            });

            setMensaje({ texto: '¡Registrado con éxito! Esperá tu turno.', tipo: 'success' });
            setFirstName('');
            setLastName('');
            setClientId('');

        } catch (error) {

            const msgError = error.response?.data?.error || 'No se pudo registrar';
            setMensaje({ texto: `Error: ${msgError}`, tipo: 'error' });
        }
    };

    return (
        <div className="container" style={{ fontFamily: 'system-ui, sans-serif', color: '#333', backgroundColor: '#f8f9fa', padding: '40px 20px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '30px', maxWidth: '450px', width: '100%', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>

                <h2 style={{ color: '#111111', fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                    Ingreso a la Fila
                </h2>
                <p style={{ color: '#666666', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
                    Ingresá tus datos para pedir un turno en la caja.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="inputForm"
                    />

                    <input
                        type="text"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="inputForm"
                    />

                    <input
                        type="text"
                        placeholder="Identificación / DNI"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                        className="inputForm"
                    />

                    <button type="submit" className="btnSuccess">
                        Pedir Turno
                    </button>
                </form>

                {mensaje.texto && (
                    <div
                        className="messageStatus"
                        style={{
                            marginTop: '20px',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: mensaje.tipo === 'success' ? '#f8fafc' : '#fef2f2',
                            border: mensaje.tipo === 'success' ? '1px solid #e2e8f0' : '1px solid #fecaca',
                            color: mensaje.tipo === 'success' ? '#0f172a' : '#991b1b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {/* Indicador sutil de color para éxito o error */}
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: mensaje.tipo === 'success' ? '#10b981' : '#ef4444',
                            flexShrink: 0
                        }}></div>
                        <p style={{ margin: 0, fontWeight: '500' }}>{mensaje.texto}</p>
                    </div>
                )}

            </div>
        </div>
    );
}
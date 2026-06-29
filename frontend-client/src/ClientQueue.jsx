import React, { useState } from 'react';
import api from '../config/api';

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
        <div className="container">
            <div className="card">
                <h2>Ingreso a la Fila</h2>
                <p>Ingresá tus datos para pedir un turno en la caja.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="input" 
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="input" 
                    />
                    <input
                        type="text"
                        placeholder="Identificación / DNI"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                        className="input" 
                    />
                    <button type="submit" className="btnSuccess">Pedir Turno</button>
                </form>

                {mensaje.texto && (
                    <p style={{ color: mensaje.tipo === 'success' ? '#28a745' : '#dc3545' }} className="message">
                        {mensaje.texto}
                    </p>
                )}
            </div>
        </div>
    );
}
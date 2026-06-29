import React, { useState } from 'react';
import api from '../config/api';

export default function AdminQueue() {
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const llamarSiguiente = async () => {
    setError('');
    setInfo('');
    try {
      
      const response = await api.patch('/queue/next');

      setInfo(response.data.message || 'Next client called successfully!');
    } catch (err) {
      
      const msgError = err.response?.data?.error || 'Could not call the next client.';
      setError(msgError);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Counter Control (Admin)</h2>
        <p>Press the button to call the next client in line.</p>
        
        <button onClick={llamarSiguiente} className="btnPrimary">
          Call Next Client ➔
        </button>

        {/* --- CAMBIO ESTÉTICO AQUÍ --- */}
        <div className="display" style={{ marginTop: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '15px' }}>
            Counter Status
          </h3>
          
          {info && (
            <div style={{ padding: '15px', backgroundColor: '#e9f7ef', borderRadius: '6px', border: '1px solid #28a745', textAlign: 'center' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>🗣️</span>
              <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                {info}
              </p>
            </div>
          )}
          
          {error && (
            <div style={{ padding: '15px', backgroundColor: '#fdf2f2', borderRadius: '6px', border: '1px solid #dc3545', textAlign: 'center' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>⚠️</span>
              <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                {error}
              </p>
            </div>
          )}
          
          {!info && !error && (
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #ced4da', textAlign: 'center' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>💤</span>
              <p style={{ color: '#6c757d', fontWeight: '500', margin: 0 }}>
                Ready to serve (Standing by)...
              </p>
            </div>
          )}
        </div>
        {/* ---------------------------- */}
      </div>
    </div>
  );
}
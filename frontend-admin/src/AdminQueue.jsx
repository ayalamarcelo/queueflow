import React, { useState } from 'react';
import api from '../config/api';
import './App.css';

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
    <div className="container" style={{ fontFamily: 'system-ui, sans-serif', color: '#333', backgroundColor: '#f8f9fa', padding: '40px 20px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '30px', maxWidth: '450px', width: '100%', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>

        <h2 style={{ color: '#111111', fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          Counter Control (Admin)
        </h2>
        <p style={{ color: '#666666', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          Press the button to call the next client in line.
        </p>

        <button
          onClick={llamarSiguiente}
          className="btnPrimary"
        >
          Call Next Client
        </button>

        <div className="display" style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888888', fontWeight: '600', borderBottom: '1px solid #eaeaea', paddingBottom: '8px', marginBottom: '16px' }}>
            Counter Status
          </h3>

          {info && (
            <div style={{ padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <p style={{ color: '#0f172a', fontSize: '14px', margin: 0, fontWeight: '500' }}>
                {info}
              </p>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
              <p style={{ color: '#991b1b', fontSize: '14px', margin: 0, fontWeight: '500' }}>
                {error}
              </p>
            </div>
          )}

          {!info && !error && (
            <div style={{ padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></div>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                Ready to serve (Standing by)...
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
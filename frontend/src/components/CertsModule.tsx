import React, { useState } from 'react';
import { GenerateRSAKeyPair, CreateSelfSignedCert, ParseCertificateInfo } from '../../wailsjs/go/services/CryptoService';

export const CertsModule: React.FC = () => {
    const [subTab, setSubTab] = useState<'rsa' | 'create-p12' | 'info'>('rsa');
    
    const [rsaPriv, setRsaPriv] = useState('');
    const [rsaPub, setRsaPub] = useState('');

    const [cn, setCn] = useState('localhost');
    const [password, setPassword] = useState('password');
    const [p12Hex, setP12Hex] = useState('');
    const [p12Cert, setP12Cert] = useState('');

    const [pemInput, setPemInput] = useState('');
    const [parsedInfo, setParsedInfo] = useState('');

    const handleGenRSA = async () => {
        try {
            const res = await GenerateRSAKeyPair();
            setRsaPriv(res.privateKey || '');
            setRsaPub(res.publicKey || '');
        } catch (err) {
            alert(`Ошибка: ${err}`);
        }
    };

    const handleCreateP12 = async () => {
        try {
            const res = await CreateSelfSignedCert(cn, password);
            setP12Cert(res.certificate || '');
            setP12Hex(res.p12Base64 || '');
            alert('Сертификат и контейнер P12 успешно сгенерированы!');
        } catch (err) {
            alert(`Ошибка: ${err}`);
        }
    };

const downloadP12File = () => {
    if (!p12Hex) return;
    
    const binaryString = window.atob(p12Hex);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: "application/x-pkcs12" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${cn || 'cert'}.p12`;
    link.click();
};


    const handleParseCert = async () => {
        try {
            const res = await ParseCertificateInfo(pemInput);
            setParsedInfo(res.info || '');
        } catch (err) {
            setParsedInfo(`Не удалось прочитать сертификат.\nОшибка: ${err}`);
        }
    };

    return (
        <div className="module-card">
            <div className="actions-bar" style={{ borderBottom: '1px solid #2b323f', paddingBottom: '12px', marginBottom: '20px' }}>
                <button onClick={() => setSubTab('rsa')} className={`btn ${subTab === 'rsa' ? 'primary' : 'text-btn'}`}>Генерация RSA</button>
                <button onClick={() => setSubTab('create-p12')} className={`btn ${subTab === 'create-p12' ? 'primary' : 'text-btn'}`}>Создать P12 & Cert</button>
                <button onClick={() => setSubTab('info')} className={`btn ${subTab === 'info' ? 'primary' : 'text-btn'}`}>Инфо о Сертификате</button>
            </div>

            {subTab === 'rsa' && (
                <div>
                    <button onClick={handleGenRSA} className="btn primary" style={{ marginBottom: '16px' }}>Сгенерировать пару RSA (2048 бит)</button>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Закрытый ключ (Private Key PEM)</label>
                            <textarea value={rsaPriv} readOnly rows={8} placeholder="Здесь появится приватный ключ..." />
                        </div>
                        <div className="form-group">
                            <label>Открытый ключ (Public Key PEM)</label>
                            <textarea value={rsaPub} readOnly rows={8} placeholder="Здесь появится публичный ключ..." />
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'create-p12' && (
                <div>
                    <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
                        <div className="form-group">
                            <label>Common Name (CN / Домен)</label>
                            <input type="text" className="custom-input" value={cn} onChange={e => setCn(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Пароль для контейнера P12</label>
                            <input type="password" className="custom-input" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={handleCreateP12} className="btn success" style={{ marginBottom: '20px' }}>Создать Сертификат</button>
                    
                    {p12Cert && (
                        <div className="form-group">
                            <label>Созданный PEM Сертификат</label>
                            <textarea value={p12Cert} readOnly rows={6} />
                            {p12Hex && (
                                <button onClick={downloadP12File} className="btn primary" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>
                                    Скачать готовый .p12 файл 📥
                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {subTab === 'info' && (
                <div className="form-row">
                    <div className="form-group">
                        <label>Вставьте текст Сертификата (PEM формат)</label>
                        <textarea 
                            value={pemInput} 
                            onChange={e => setPemInput(e.target.value)} 
                            placeholder="-----BEGIN CERTIFICATE-----\nMII..." 
                        />
                        <button onClick={handleParseCert} className="btn primary" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>Анализировать</button>
                    </div>
                    <div className="form-group">
                        <label>Доступные метаданные</label>
                        <textarea value={parsedInfo} readOnly placeholder="Информация из метаданных X509..." />
                    </div>
                </div>
            )}
        </div>
    );
};

import { useState } from 'react';
import { Base64Module } from './components/Base64Module';
import { HexModule } from './components/HexModule';
import { CertsModule } from './components/CertsModule';
import { TokensModule } from './components/TokensModule';

import './App.css';

type Tab = 'base64' | 'hex' | 'tokens' | 'certs';

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('base64');

    return (
        <div className="layout">
            <aside className="sidebar">
                <h3>Утилиты</h3>
                <ul>
                    <li 
                        className={activeTab === 'base64' ? 'active' : ''} 
                        onClick={() => setActiveTab('base64')}
                    >
                        Base64
                    </li>
                    <li 
                        className={activeTab === 'hex' ? 'active' : ''} 
                        onClick={() => setActiveTab('hex')}
                    >
                        Hex
                    </li>
                    <li 
                        className={activeTab === 'tokens' ? 'active' : ''} 
                        onClick={() => setActiveTab('tokens')}
                    >
                        JWT/JWS/JWE
                    </li>
                    <li 
                        className={activeTab === 'certs' ? 'active' : ''} 
                        onClick={() => setActiveTab('certs')}
                    >
                        P12/PEM
                    </li>
                </ul>
            </aside>
            <main className="content">
                {activeTab === 'base64' && <Base64Module />}
                {activeTab === 'hex' && <HexModule />}
                {activeTab === 'tokens' && <TokensModule />}
                {activeTab === 'certs' && <CertsModule />}
            </main>
        </div>
    );
}

export default App;

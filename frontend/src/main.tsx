import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NavbarLateral from './Assets/Sidebar/Sidebar';
import Registro from './Assets/Registro/registro';
import './mainStyle.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className='side'>
        <NavbarLateral/>
        </div>
        <div className='content'>
        <Registro />
        </div>
    </React.StrictMode>
);
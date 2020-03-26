import React, { useState } from 'react';
//importação do logo criando uma variavel
import logo from '../assets/logo.svg';
//importação do css sem a necessidade de uma variavel
import './Login.css';
import api from '../services/api';

//exporta o componente
//history propriedade passada pelo Route
export default function Login({ history }) {
    //valor do input(username) e valor que a ser atribuido ao input(setUsername)
    //useState estado do componente
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {

        e.preventDefault();
        const response = await api.post('/devs', {
            username
        });

        const { _id } = response.data;

        //redireciona
        history.push(`/dev/${_id}`);

    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input
                    placeholder="Digite seu usuario no Github"
                    value={username}
                    onChange={e => { setUsername(e.target.value); }}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
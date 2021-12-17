import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
// import googleImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'

import { Button } from '../components/Button'
import '../styles/button.scss'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

export function NewRoom() {
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if (newRoom.trim() === '') {
            return;
        }
        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        });

        history.push(`/rooms/${firebaseRoom.key}`);
    }

    return (
        <div id="page-auth">

            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo </strong>
                <p>tire as duvidas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                        <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link></p>
                    </form>
                </div>
            </main>
        </div>
    )
}
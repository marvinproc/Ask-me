import { FormEvent, useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss'

type FirebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type RoomParams = {
    id: string
}

type Question = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    // exe
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestion: FirebaseQuestion = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions)

        })
    }, [roomId]);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() == '') {
            return;
        }
        if (!user) {
            throw new Error('Please, you should sign in to send a question!');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to="/"><img src={logoImg} alt="LetMeAsk" /></Link>
                    {/* <img src={logoImg} alt="LetMeAsk" /> */}
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Room - {title}</h1>
                    {questions.length > 0 && <span>{questions.length} question(s)</span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="What do you want to ask?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span> For send a question, <button>click here to Login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Send question</Button>
                    </div>
                </form>
            </main>
        </div>

    )
}
import logoImg from "../../assets/images/logo.svg";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";

import { useParams } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";

import { Question } from "../../components/Question";

import "./styles.scss";

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { questions, title } = useRoom(roomId);

    const [newQuestion, setNewQuestion] = useState("");

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error("Você deve estar logado");
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion("");
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id} />
                        <Button isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span> }
                </div>

                <div className="question-list">
                    { questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
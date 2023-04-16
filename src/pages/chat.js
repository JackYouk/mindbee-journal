import Navbar from "@/components/Navbar";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Message from "@/components/Message";

export default function Chat() {
    const { currentUser } = UserAuth();
    const router = useRouter();

    const messagesEndRef = useRef();


    const [hasPaid, setHasPaid] = useState(false);

    const [messages, setMessages] = useState([{ 
        role: 'assistant', 
        content: `Hey there, I'm your ai therapist. 
        Everything we talk about here is confidential and only saved on your computer. How can I help?` 
    }]);
    const [messangeInput, setMessageInput] = useState('');
    const [generating, setGenerating] = useState(false);
    const sendMessenge = async () => {
        setMessageInput('');
        if(messangeInput.trim() === "" || !currentUser){
            return;
        }
        const newMessages = messages;
        newMessages.push({ role: 'user', content: `${messangeInput}` })        
        // openai api call
        setGenerating(true);
        const response = await fetch('/api/ai_generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages
            })
        }).then(response => response.json());
        if (response.res) {
            newMessages.push({ role: 'assistant', content: `${response.res}` })
            setMessages(newMessages);
            setGenerating(false);
        }
    }



    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [currentUser]);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            setHasPaid(true);
        }
        if (query.get('canceled')) {
            setHasPaid(false);
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="pt-16 min-h-[100dvh] bg-gray-700 w-full flex flex-col items-center">
                <div className="p-3 mt-4 w-5/6 md:2/3 text-gray-400 bg-gray-800 rounded">
                    {hasPaid ? (<>
                        <h1 className="text-gray-400 text-xl font-bold">Ai Therapist Chatbot</h1>
                        <div className="w-full">
                            <div className="mt-3 max-h-[50dvh] overflow-y-scroll">
                                {messages.map((message, index) => <Message generating={false} message={message} key={index} />)}
                                {generating ? <Message generating={true} message={{role: 'assistant', content: ''}} /> : <></>}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="w-full p-5">
                                <div className=" flex flex-col items-end">
                                    <textarea
                                        type="text"
                                        placeholder="Type here"
                                        value={messangeInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        className="textarea w-full focus:outline-none bg-gray-300 text-gray-700"
                                    ></textarea>
                                    <button
                                        className="btn mt-2"
                                        onClick={() => sendMessenge()}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>) : (<>
                        <div className="bg-green-950 text-gray-300 p-3 rounded border border-gray-400 flex items-center"><span className="badge badge-primary mr-3">$</span>Paid Service</div>
                        <h1 className="text-gray-400 text-xl font-bold mt-3">Ai Therapist Chatbot</h1>
                        <h2 className="text-gray-400 text-sm mt-0.5">Chat with an Ai therapist at any time for only $1 per session.</h2>
                        <div className="flex flex-col">
                            <a onClick={() => router.push('/tos')} className="text-gray-400 w-fit text-sm underline mt-1 cursor-pointer">Terms of Service</a>
                            <a onClick={() => router.push('/privacy-policy')} className="text-gray-400 w-fit text-sm underline mt-1 cursor-pointer">Privacy Policy</a>
                        </div>
                        <form action='/api/checkout_sessions' method="POST">
                            <section>
                                <button type="submit" role="link" className="btn btn-sm normal-case text-gray-300 mt-4 rounded">
                                    Start a session
                                </button>
                            </section>
                        </form>
                    </>)}
                </div>
            </div>
        </>
    );
}
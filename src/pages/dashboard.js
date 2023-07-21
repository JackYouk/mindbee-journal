import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, where, serverTimestamp, deleteDoc, addDoc, doc, setDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { db } from "@/firebase";

export default function Dashboard() {
    const { currentUser } = UserAuth();
    const router = useRouter();

    function formatUTCDate(timestamp) {
        console.log(timestamp)
        const date = new Date(timestamp * 1000);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([]);
    const getEntries = async () => {
        if (!currentUser) {
            return;
        }
        setLoading(true);
        if (currentUser === 'guest') {
            const jsonGuestEntries = localStorage.getItem('guestEntries');

            const guestEntries = JSON.parse(jsonGuestEntries);
            console.log(guestEntries)
            setEntries(guestEntries);
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, "entries"),
            where("uid", "==", currentUser.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const entries = [];
        querySnapshot.forEach((doc) => {
            entries.push({ ...doc.data(), id: doc.id });
        });
        setEntries(entries);
        setLoading(false);
    }

    const [viewEntryActive, setViewEntryActive] = useState(false);
    const [activeEntry, setActiveEntry] = useState({});
    const viewEntry = ({ id, title, content, createdAt, aiSuggestion }) => {
        setActiveEntry({ id, title, content, createdAt, aiSuggestion });
        setViewEntryActive(true);
    }

    const [addEntryActive, setAddEntryActive] = useState(false);
    const [addEntryTitle, setAddEntryTitle] = useState('');
    const [addEntryContent, setAddEntryContent] = useState('');
    const submitEntry = async () => {
        if (!currentUser) {
            return;
        }
        if (addEntryTitle.trim() === "" || addEntryContent.trim() === "") {
            alert("Enter valid message");
            return;
        }
        if (currentUser === 'guest') {
            const guestEntryData = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                title: addEntryTitle,
                content: addEntryContent,
                createdAt: { seconds: Math.floor(Date.now() / 1000) },
            }
            const rawCurrentGuestEntries = localStorage.getItem('guestEntries');
            const currentGuestEntries = JSON.parse(rawCurrentGuestEntries);
            if (!currentGuestEntries || currentGuestEntries.length === 0) {
                localStorage.setItem('guestEntries', JSON.stringify([guestEntryData]));
            } else {
                currentGuestEntries.push(guestEntryData);
                localStorage.setItem('guestEntries', JSON.stringify(currentGuestEntries));
            }
            setAddEntryActive(false);
            router.reload(window.location.pathname);
            return;
        }
        try {
            await addDoc(collection(db, "entries"), {
                uid: currentUser.uid,
                title: addEntryTitle,
                content: addEntryContent,
                createdAt: serverTimestamp(),
            });
            setAddEntryActive(false);
            router.reload(window.location.pathname);
        } catch (error) {
            console.log(error);
        }
    }

    const [generating, setGenerating] = useState(false);
    const generateSuggestion = async () => {
        if (!currentUser || !activeEntry) {
            return;
        }
        setGenerating(true);
        const { id, title, content, createdAt } = activeEntry
        const response = await fetch('/api/ai_generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: 'user', content: `You are a therapist. 
                You read your client's journal entry: ${content}. 
                What suggestions or feedback do you have for your client based on the journal entry?
                Please keep the response concise.`}]
            })
        }).then(response => response.json());
        if (response.res) {
            if (currentUser === 'guest') {
                const rawGuestEntries = localStorage.getItem('guestEntries');
                const guestEntries = JSON.parse(rawGuestEntries);
                const entryIndex = guestEntries.findIndex(entry => entry.id === id);
                if (entryIndex !== -1) {
                    guestEntries[entryIndex] = { ...guestEntries[entryIndex], aiSuggestion: response.res };
                    localStorage.setItem('guestEntries', JSON.stringify(guestEntries));
                } else {
                    console.error(`No entry found with ID: ${entryId}`);
                }
                setActiveEntry({ ...activeEntry, aiSuggestion: response.res });
                setGenerating(false);
                return;
            }
            await setDoc(doc(db, "entries", id), {
                aiSuggestion: response.res
            }, { merge: true });
            setActiveEntry({ ...activeEntry, aiSuggestion: response.res });
            setGenerating(false);
        }
    }

    const deleteEntry = async ({ id }) => {
        if (currentUser === 'guest') {
            const rawGuestEntries = localStorage.getItem('guestEntries');
            const guestEntries = JSON.parse(rawGuestEntries);
            const filteredEntries = guestEntries.filter(entry => entry.id !== id);
            localStorage.setItem('guestEntries', JSON.stringify(filteredEntries));
            router.reload(window.location.pathname);
            return;
        }
        await deleteDoc(doc(db, "entries", id));
        router.reload(window.location.pathname);
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
        getEntries();
    }, [currentUser]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-bold">
                <div className="dot-flashing ml-4 mt-2" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="pt-16 min-h-[100dvh] bg-gray-700 w-full flex flex-col items-center">
                <div className="w-full p-4 grid gap-3 auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="w-full h-full p-2 bg-gray-200 rounded border-gray-500 border-2 flex justify-between items-center drop-shadow z-8">
                        <h3 className="text-md font-bold">New Entry</h3>
                        <a onClick={() => setAddEntryActive(true)} className="btn btn-sm btn-primary text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-journal-plus" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z" />
                                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                            </svg>
                        </a>
                    </div>

                    {entries?.map(entry => {
                        return (
                            <div
                                key={entry.id}
                                onClick={() => viewEntry({
                                    id: entry.id,
                                    title: entry.title,
                                    createdAt: entry.createdAt,
                                    content: entry.content,
                                    aiSuggestion: entry.aiSuggestion
                                })}
                                className="w-full h-full p-2 bg-gray-200 rounded border-gray-500 border-2 hover:bg-gray-400 cursor-pointer drop-shadow"
                            >
                                <h3 className="text-md font-bold flex justify-between items-center">
                                    {entry.title.slice(0, 25)}
                                    <a
                                        onClick={e => {
                                            e.stopPropagation();
                                            deleteEntry({ id: entry.id });
                                        }}
                                        className="btn btn-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                        </svg>
                                    </a>
                                </h3>
                                <h3 className="text-xs">{formatUTCDate(entry.createdAt.seconds)}</h3>
                                <p className="text-sm mt-3">{entry.content.slice(0, 100)}...</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {addEntryActive ? (
                <div onClick={() => setAddEntryActive(false)} className="absolute w-full h-screen bg-gray-400/80 top-0 right-0 flex justify-center z-5">
                    <div onClick={e => e.stopPropagation()} className="h-[80dvh] w-5/6 md:w-2/3 mt-20 p-2 bg-gray-200 rounded border-gray-500 border-2 flex flex-col z-7">
                        <h3 className="text-md font-bold">New Entry</h3>
                        <label className="text-left text-xs m-1">Title</label>
                        <input
                            type="text"
                            placeholder="Entry #1"
                            value={addEntryTitle}
                            onChange={e => setAddEntryTitle(e.target.value)}
                            className="input input-xs w-full m-0 w-40 focus:outline-none bg-white rounded text-gray-500"
                        />
                        <label className="text-left text-xs m-1">Entry</label>
                        <textarea
                            placeholder="Today was mid"
                            value={addEntryContent}
                            onChange={e => setAddEntryContent(e.target.value)}
                            className="textarea textarea-xs w-full m-0 w-40 focus:outline-none bg-white rounded text-gray-500"
                        ></textarea>
                        <a onClick={() => submitEntry()} className="btn btn-xs w-28 btn-primary text-white mt-4">Add Entry</a>
                    </div>
                </div>
            ) : <></>}

            {viewEntryActive ? (
                <div onClick={() => setViewEntryActive(false)} className="absolute w-full h-screen bg-gray-800/80 top-0 right-0 flex justify-center z-5">
                    <div onClick={e => e.stopPropagation()} className="h-[80dvh] w-5/6 md:w-2/3 mt-20 p-2 bg-gray-200 rounded border-gray-500 border-2 flex flex-col z-7 overflow-y-scroll">
                        <h3 className="text-md font-bold">{activeEntry.title}</h3>
                        <h3 className="text-xs">{formatUTCDate(activeEntry.createdAt.seconds)}</h3>
                        <p className="text-sm mt-3">{activeEntry.content}</p>

                        {!generating && !activeEntry.aiSuggestion ? (
                            <a onClick={() => generateSuggestion()} className="btn btn-xs w-52 bg-blue-400 text-white mt-4 normal-case">Generate ai therapist feedback</a>
                        ) : <></>}

                        {generating ? (<div className="dot-flashing ml-4 mt-2" />) : (<></>)}

                        {activeEntry.aiSuggestion ? (
                            <div className="mt-2 text-sm text-gray-500 w-full bg-gray-300 rounded p-2">
                                <h4 className="font-bold">Ai Therapist Feedback:</h4>
                                {activeEntry.aiSuggestion}
                                <br />
                                <a onClick={() => router.push('/chat')} className="btn btn-xs w-52 bg-blue-400 text-white mt-4 normal-case">Continue this conversation</a>
                            </div>
                        ) : <></>}
                    </div>
                </div>
            ) : <></>}
        </>
    );
}
import { UserAuth } from "../context/AuthContext"


export default function Message({ message, generating }) {
    const {currentUser} = UserAuth();
    return (
        <div className="p-5">
            <div className={`chat ${message.role === 'user' ? "chat-end" : "chat-start"}`}>
                <div className="chat-header">
                    {message.role === 'user' ? currentUser.displayName : 'Ai Therapist'}
                </div>
                <div className="chat-bubble">
                    {generating ? <div className="dot-flashing ml-4 mr-4 mt-2" /> : message.content }
                </div>
            </div>
            
        </div>
    )
}
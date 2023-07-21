import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();
    const { currentUser, logout } = UserAuth();

    return(
        <>
        <div className="navbar bg-green-800 text-white fixed z-10 drop-shadow">
            {/* LOGO */}
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl text-gray-200" onClick={() => router.push('/')}>
                    {/* <img src="./logo.png" alt="vortex logo" className="max-h-8" /> */}
                    MindBee Journal
                </a>
            </div>
            {!currentUser ? (
                    <a className="btn btn-ghost normal-case" onClick={() => router.push('/')}>Login</a>
                ) : (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                {currentUser.photoURL ? <img src={currentUser.photoURL} /> : <div className="bg-gray-400 flex justify-center items-center"><img src="./guestIcon.png" style={{width: '40px', padding: '10px'}}/></div>}
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-gray-800 rounded-box w-52">
                            <li onClick={() => router.push('/chat')} >
                                <a className="justify-between text-gray-200 hover:bg-gray-200 hover:text-gray-700">
                                    Journal
                                </a>
                            </li>
                            <li onClick={() => router.push('/chat')} >
                                <a className="justify-between text-gray-200 hover:bg-gray-200 hover:text-gray-700">
                                    Chat with ai therapist
                                    <span className="badge badge-primary">$</span>
                                </a>
                            </li>
                            <li onClick={() => logout()}><a className="text-gray-200 hover:bg-gray-200 hover:text-gray-700">Logout</a></li>
                        </ul>
                    </div>
                )}
        </div>
        </>
    );
}
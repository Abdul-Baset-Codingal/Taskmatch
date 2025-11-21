/* eslint-disable @typescript-eslint/no-explicit-any */
// MessengerInbox.tsx - FINAL FIXED VERSION (Unread badge now works perfectly)
import Image from "next/image";
import { useMemo, useState } from "react";
import { FiMaximize2, FiMessageCircle, FiMinimize2, FiSearch, FiX } from "react-icons/fi";

interface MessengerInboxProps {
    user: any;
    allTasks: any[];
    onOpenChat: (userId: string) => void;
    seenConversations: Set<string>; // ← NEW PROP
}

const MessengerInbox: React.FC<MessengerInboxProps> = ({
    user,
    allTasks,
    onOpenChat,
    seenConversations
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const conversations = useMemo(() => {
        if (!user || !allTasks) return [];

        const convMap = new Map<string, any>();

        allTasks.forEach((task: any) => {
            if (!task.comments || task.comments.length === 0) return;

            let otherUserId: string | null = null;
            let otherUserInfo: any = null;

            if (user.currentRole === "client") {
                // Find any tasker who messaged
                const msg = task.comments.find((c: any) => c.userId?._id !== user._id);
                if (msg?.userId) {
                    otherUserId = msg.userId._id;
                    otherUserInfo = {
                        _id: msg.userId._id,
                        firstName: msg.userId.firstName || "Tasker",
                        lastName: msg.userId.lastName || "",
                        profilePicture: msg.userId.profilePicture
                    };
                } else if (task.acceptedBy?._id) {
                    otherUserId = task.acceptedBy._id;
                    otherUserInfo = task.acceptedBy;
                }
            } else {
                // Tasker → always client
                if (task.client?._id) {
                    otherUserId = task.client._id;
                    otherUserInfo = task.client;
                }
            }

            if (!otherUserId || !otherUserInfo) return;

            // Only private messages between these two
            const privateMessages = task.comments.filter((c: any) =>
                c.userId?._id === user._id || c.userId?._id === otherUserId
            );

            if (privateMessages.length === 0) return;

            const lastMessage = privateMessages[privateMessages.length - 1];
            const lastTime = new Date(lastMessage.createdAt).getTime();

            const existing = convMap.get(otherUserId);

            // Find the index of last message sent BY CURRENT USER
            const lastOwnMessageIndex = privateMessages
                .map((m: any) => m.userId?._id)
                .lastIndexOf(user._id);

            // Unread = messages received AFTER your last message
            const unreadCount = lastOwnMessageIndex === -1
                ? privateMessages.length
                : privateMessages.slice(lastOwnMessageIndex + 1).filter((m: any) => m.userId?._id !== user._id).length;

            const finalUnread = seenConversations.has(otherUserId) ? 0 : unreadCount;

            if (!existing || lastTime > new Date(existing.lastMessageTime).getTime()) {
                convMap.set(otherUserId, {
                    user: otherUserInfo,
                    lastMessage: lastMessage.message,
                    lastMessageTime: lastMessage.createdAt,
                    unreadCount: finalUnread,
                });
            }
        });

        return Array.from(convMap.values())
            .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
    }, [allTasks, user, seenConversations]);

    const filtered = conversations.filter(c =>
        `${c.user.firstName} ${c.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) {
        const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] text-white rounded-full shadow-2xl hover:scale-110 transition z-50 flex items-center justify-center"
            >
                <FiMessageCircle size={28} />
                {totalUnread > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse">
                        {totalUnread}
                    </span>
                )}
            </button>
        );
    }

    return (
        // ... rest of UI stays exactly the same (only logic above changed)
        <div className={`fixed bottom-0 right-6 w-96 bg-white rounded-t-2xl shadow-2xl border-t-4 border-[#109C3D] flex flex-col z-50 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            <div className="bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h3 className="font-bold text-lg">Messages</h3>
                <div className="flex gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/20 rounded">
                        {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded">
                        <FiX size={20} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className="p-4 border-b">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border focus:border-[#109C3D] outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <FiMessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            filtered.map((conv) => (
                                <div
                                    key={conv.user._id}
                                    onClick={() => {
                                        onOpenChat(conv.user._id);
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b"
                                >
                                    {conv.user.profilePicture ? (
                                        <Image src={conv.user.profilePicture} width={48} height={48} alt="" className="rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {conv.user.firstName[0]}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-800">
                                                {conv.user.firstName} {conv.user.lastName}
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-6 h-6 flex items-center justify-center">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MessengerInbox;
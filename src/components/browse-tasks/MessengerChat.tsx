/* eslint-disable @typescript-eslint/no-explicit-any */
// MessengerChat.tsx - WITH BLOCKED MESSAGE SUPPORT
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiSend, FiX, FiMinimize2, FiMaximize2 } from "react-icons/fi";

const MessengerChat = ({ isOpen, onClose, otherUserId, allTasks = [], user, onSendMessage, isCommenting }: any) => {
    const [message, setMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { otherUser, messages, taskOptions } = React.useMemo(() => {
        let otherUser: any = null;
        const messages: any[] = [];
        const taskMap = new Map<string, string>();

        allTasks.forEach((task: any) => {
            if (!task.comments) return;

            let participant: any = null;
            if (user.currentRole === "client") {
                participant = task.acceptedBy?._id === otherUserId ? task.acceptedBy :
                    task.comments.find((c: any) => c.userId?._id === otherUserId)?.userId;
            } else {
                participant = task.client?._id === otherUserId ? task.client : null;
            }

            if (participant) {
                if (!otherUser) otherUser = participant;
                taskMap.set(task._id, String(task.taskTitle));

                task.comments
                    .filter((c: any) => [user._id, otherUserId].includes(c.userId?._id))
                    .forEach((c: any) => messages.push({ ...c, taskId: task._id }));
            }
        });

        messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const taskOptions = Object.fromEntries(taskMap) as Record<string, string>;
        return { otherUser, messages, taskOptions };
    }, [allTasks, otherUserId, user]);

    const [selectedTaskId, setSelectedTaskId] = useState(Object.keys(taskOptions)[0] || "");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!isOpen || !otherUser) return null;

    const handleSend = () => {
        if (!message.trim() || !selectedTaskId) return;
        onSendMessage(selectedTaskId, message);
        setMessage("");
    };

    return (
        <div className={`fixed bottom-0 right-6 w-96 bg-white rounded-t-2xl shadow-2xl border-t-4 border-[#109C3D] flex flex-col z-50 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {otherUser.profilePicture ? (
                        <Image src={otherUser.profilePicture} width={40} height={40} alt="" className="rounded-full" />
                    ) : (
                        <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold">
                            {otherUser.firstName[0]}
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold">{otherUser.firstName} {otherUser.lastName}</h3>
                        <p className="text-xs opacity-90">Active</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/20 rounded">
                        {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded"><FiX /></button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.map((msg: any, i: number) => {
                            const isMe = msg.userId?._id === user._id;

                            // Check if message or any reply is blocked
                            const isMessageBlocked = msg.isBlocked === true;
                            const hasBlockedReply = msg.replies?.some((r: any) => r.isBlocked === true);

                            return (
                                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isMessageBlocked ? 'opacity-70' : ''}`}>
                                    <div className="max-w-[80%]">

                                        {/* Main Message */}
                                        {isMessageBlocked ? (
                                            <div className="bg-gray-100 border border-red-300 text-red-500 italic px-4 py-3 rounded-2xl text-sm">
                                                This message was removed for violating our community guidelines.
                                            </div>
                                        ) : (
                                            <div className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-[#109C3D] text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                <p className="text-sm">{msg.message}</p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        )}

                                        {/* Replies (if any) */}
                                        {msg.replies?.length > 0 && (
                                            <div className="mt-2 ml-8 space-y-2">
                                                {msg.replies.map((reply: any, idx: number) => {
                                                    const isReplyFromMe = reply.userId?._id === user._id;

                                                    if (reply.isBlocked) {
                                                        return (
                                                            <div key={idx} className="bg-gray-100 border border-gray-300 text-gray-500 italic text-xs px-3 py-2 rounded-xl">
                                                                This reply was removed.
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={idx} className={`px-3 py-2 rounded-xl text-xs ${isReplyFromMe ? 'bg-[#109C3D]/20 text-[#063A41]' : 'bg-gray-100 text-gray-700'}`}>
                                                            <p>{reply.message}</p>
                                                            <span className="text-[10px] opacity-70">
                                                                {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Optional: Show if message has blocked replies */}
                                        {hasBlockedReply && !isMessageBlocked && (
                                            <div className="text-xs text-gray-500 italic mt-1 ml-1">
                                                Some replies were removed by moderators.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-white">
                        {Object.keys(taskOptions).length > 1 && (
                            <select
                                value={selectedTaskId}
                                onChange={(e) => setSelectedTaskId(e.target.value)}
                                className="w-full mb-3 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#109C3D]"
                            >
                                <option value="">Select a task...</option>
                                {Object.entries(taskOptions).map(([id, title]) => (
                                    <option key={id} value={id}>Task: {title}</option>
                                ))}
                            </select>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || !selectedTaskId || isCommenting}
                                className={`
                                    relative p-3.5 rounded-full transition-all duration-200 shadow-md
                                    flex items-center justify-center group overflow-hidden
                                    ${!message.trim() || !selectedTaskId || isCommenting
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#109C3D] to-[#0d8a35] hover:from-[#0d8a35] hover:to-[#0a6d2a] active:scale-95 shadow-lg hover:shadow-xl'
                                    }
                                `}
                            >
                                {(message.trim() && selectedTaskId && !isCommenting) && (
                                    <span className="absolute inset-0 rounded-full bg-white opacity-20 group-hover:opacity-30 transition-opacity" />
                                )}

                                <FiSend
                                    size={22}
                                    className={`
                                        relative z-10 transition-colors duration-200
                                        ${!message.trim() || !selectedTaskId || isCommenting
                                            ? 'text-gray-500'
                                            : 'text-white drop-shadow-sm'
                                        }
                                    `}
                                />

                                {(message.trim() && selectedTaskId && !isCommenting) && (
                                    <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-25 -z-10" />
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MessengerChat;
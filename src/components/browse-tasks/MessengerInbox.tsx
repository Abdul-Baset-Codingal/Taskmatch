/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// MessengerInbox.tsx - Simplified unread logic

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { FiMaximize2, FiMessageCircle, FiMinimize2, FiSearch, FiX, FiRefreshCw } from "react-icons/fi";

interface MessengerInboxProps {
    user: any;
    allTasks: any[];
    onOpenChat: (userId: string, taskId?: string) => void;
    refetchTasks?: () => void;
}

interface ConversationItem {
    id: string;
    otherUserId: string;
    otherUser: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture: string | null;
        role: string;
    };
    taskId: string;
    taskTitle: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    isMyLastMessage: boolean;
}

const MessengerInbox: React.FC<MessengerInboxProps> = ({
    user,
    allTasks,
    onOpenChat,
    refetchTasks
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh when inbox is open
    useEffect(() => {
        if (!isOpen || !refetchTasks) return;
        const interval = setInterval(refetchTasks, 5000);
        return () => clearInterval(interval);
    }, [isOpen, refetchTasks]);

    // Build conversations from tasks
    const conversations = useMemo((): ConversationItem[] => {
        if (!user?._id || !allTasks?.length) return [];

        const conversationMap = new Map<string, ConversationItem>();
        const userIdStr = user._id.toString();

        allTasks.forEach((task: any) => {
            if (!task.messages || task.messages.length === 0) return;

            // Determine who the "other" person is
            const clientId = (task.client?._id || task.client)?.toString();
            const taskerId = (task.acceptedBy?._id || task.acceptedBy)?.toString();
            const isClient = clientId === userIdStr;
            const isTasker = taskerId === userIdStr;

            let otherUserId: string | null = null;
            let otherUserInfo: any = null;
            let otherUserRole = '';

            if (isClient && taskerId) {
                otherUserId = taskerId;
                otherUserInfo = task.acceptedBy;
                otherUserRole = 'tasker';
            } else if (isTasker) {
                otherUserId = clientId;
                otherUserInfo = task.client;
                otherUserRole = 'client';
            } else {
                // Check if user has sent messages to this task
                const userSentMessage = task.messages.some((m: any) => {
                    const senderId = (m.sender?._id || m.sender)?.toString();
                    return senderId === userIdStr;
                });
                if (userSentMessage) {
                    otherUserId = clientId;
                    otherUserInfo = task.client;
                    otherUserRole = 'client';
                }
            }

            if (!otherUserId) return;

            // Filter messages between user and other person
            const relevantMessages = task.messages.filter((m: any) => {
                const senderId = (m.sender?._id || m.sender)?.toString();
                return senderId === userIdStr || senderId === otherUserId;
            });

            if (relevantMessages.length === 0) return;

            // Sort by time
            const sortedMessages = [...relevantMessages].sort((a: any, b: any) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            const lastMsg = sortedMessages[sortedMessages.length - 1];
            const lastMsgSenderId = (lastMsg.sender?._id || lastMsg.sender)?.toString();

            // Count unread from other user (isRead === false)
            const unreadCount = sortedMessages.filter((m: any) => {
                const senderId = (m.sender?._id || m.sender)?.toString();
                return senderId === otherUserId && m.isRead === false;
            }).length;

            // Build other user info
            let otherUser: ConversationItem['otherUser'];
            if (otherUserInfo && typeof otherUserInfo === 'object' && otherUserInfo._id) {
                otherUser = {
                    _id: otherUserInfo._id,
                    firstName: otherUserInfo.firstName || 'User',
                    lastName: otherUserInfo.lastName || '',
                    profilePicture: otherUserInfo.profilePicture || null,
                    role: otherUserRole
                };
            } else {
                // Try to find from messages
                const otherUserMsg = task.messages.find((m: any) => {
                    const senderId = (m.sender?._id || m.sender)?.toString();
                    return senderId === otherUserId && m.sender && typeof m.sender === 'object';
                });

                otherUser = {
                    _id: otherUserId,
                    firstName: otherUserMsg?.sender?.firstName || (otherUserRole === 'client' ? 'Client' : 'Tasker'),
                    lastName: otherUserMsg?.sender?.lastName || '',
                    profilePicture: otherUserMsg?.sender?.profilePicture || null,
                    role: otherUserRole
                };
            }

            const convKey = `${task._id}-${otherUserId}`;

            conversationMap.set(convKey, {
                id: convKey,
                otherUserId,
                otherUser,
                taskId: task._id,
                taskTitle: task.taskTitle || task.serviceTitle || 'Task',
                lastMessage: lastMsg.message,
                lastMessageTime: new Date(lastMsg.createdAt),
                unreadCount,
                isMyLastMessage: lastMsgSenderId === userIdStr
            });
        });

        return Array.from(conversationMap.values())
            .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
    }, [allTasks, user]);

    const filtered = conversations.filter(c =>
        `${c.otherUser.firstName} ${c.otherUser.lastName} ${c.taskTitle}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    const handleOpenChat = (conv: ConversationItem) => {
        onOpenChat(conv.otherUserId, conv.taskId);
        setIsOpen(false);
    };

    const handleRefresh = async () => {
        if (!refetchTasks) return;
        setIsRefreshing(true);
        await refetchTasks();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const formatTime = (date: Date): string => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] text-white rounded-full shadow-2xl hover:scale-110 transition z-50 flex items-center justify-center"
            >
                <FiMessageCircle size={28} />
                {totalUnread > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse">
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className={`fixed bottom-0 right-6 w-96 bg-white rounded-t-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h3 className="font-bold text-lg">
                    Messages
                    {totalUnread > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {totalUnread}
                        </span>
                    )}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                    >
                        <FiRefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/20 rounded">
                        {isMinimized ? <FiMaximize2 size={16} /> : <FiMinimize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded">
                        <FiX size={20} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Search */}
                    <div className="p-4 border-b">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border focus:border-[#109C3D] outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <FiMessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="font-medium">No conversations yet</p>
                            </div>
                        ) : (
                            filtered.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => handleOpenChat(conv)}
                                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${conv.unreadCount > 0 ? 'bg-green-50 border-l-4 border-l-[#109C3D]' : ''
                                        }`}
                                >
                                    {conv.otherUser.profilePicture ? (
                                        <Image
                                            src={conv.otherUser.profilePicture}
                                            width={52}
                                            height={52}
                                            alt={conv.otherUser.firstName}
                                            className="rounded-full object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-[52px] h-[52px] bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {conv.otherUser.firstName?.[0] || 'U'}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="min-w-0 flex-1">
                                                <h4 className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-black' : 'text-gray-800'}`}>
                                                    {conv.otherUser.firstName} {conv.otherUser.lastName}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">{conv.taskTitle}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                {formatTime(conv.lastMessageTime)}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            {conv.isMyLastMessage && <span className="text-gray-400">You: </span>}
                                            {conv.lastMessage}
                                        </p>
                                    </div>

                                    {conv.unreadCount > 0 && (
                                        <span className="bg-[#109C3D] text-white text-xs font-bold rounded-full min-w-6 h-6 flex items-center justify-center flex-shrink-0 px-2">
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
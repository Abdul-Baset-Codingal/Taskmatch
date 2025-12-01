/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// // MessengerChat.tsx - FIXED VERSION
// import Image from "next/image";
// import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { FiSend, FiX, FiMinimize2, FiMaximize2, FiRefreshCw, FiCheck, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
// import { useSendMessageMutation, useMarkMessagesAsReadMutation } from '@/features/api/taskApi';

// interface MessengerChatProps {
//     isOpen: boolean;
//     onClose: () => void;
//     otherUserId: string;
//     initialTaskId?: string;
//     allTasks: any[];
//     user: any;
//     onSendMessage?: (taskId: string, message: string) => Promise<void>;
//     isCommenting?: boolean;
//     refetchTasks?: () => void;
// }

// interface LocalMessage {
//     _id: string;
//     sender: any;
//     senderRole: string;
//     message: string;
//     isRead: boolean;
//     createdAt: string;
//     isOptimistic?: boolean;
//     isSending?: boolean;
//     isFailed?: boolean;
// }

// const MessengerChat: React.FC<MessengerChatProps> = ({
//     isOpen,
//     onClose,
//     otherUserId,
//     initialTaskId,
//     allTasks = [],
//     user,
//     onSendMessage,
//     isCommenting,
//     refetchTasks
// }) => {
//     const [message, setMessage] = useState("");
//     const [isMinimized, setIsMinimized] = useState(false);
//     const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null);
//     const hasMarkedAsRead = useRef(false);
//     const prevConvKey = useRef<string | null>(null);

//     const [sendMessageMutation, { isLoading: isSendingMutation }] = useSendMessageMutation();
//     const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

//     // Find the task for this conversation
//     const currentTask = useMemo(() => {
//         // First try to find by initialTaskId
//         if (initialTaskId) {
//             const task = allTasks.find(t => t._id === initialTaskId);
//             if (task) return task;
//         }

//         // Find task where both users have exchanged messages
//         for (const task of allTasks) {
//             if (!task.messages || task.messages.length === 0) continue;

//             const clientId = task.client?._id || task.client;
//             const taskerId = task.acceptedBy?._id || task.acceptedBy;

//             // Check if this task involves both the current user and the other user
//             const userIsClient = clientId === user?._id;
//             const userIsTasker = taskerId === user?._id;
//             const otherIsClient = clientId === otherUserId;
//             const otherIsTasker = taskerId === otherUserId;

//             // Direct match
//             if ((userIsClient && otherIsTasker) || (userIsTasker && otherIsClient)) {
//                 return task;
//             }

//             // Check if both users have messages in this task
//             const userHasMessages = task.messages.some((m: any) => {
//                 const senderId = m.sender?._id || m.sender;
//                 return senderId === user?._id;
//             });

//             const otherHasMessages = task.messages.some((m: any) => {
//                 const senderId = m.sender?._id || m.sender;
//                 return senderId === otherUserId;
//             });

//             if (userHasMessages && otherHasMessages) {
//                 return task;
//             }

//             // Check if user is client and other user sent a message
//             if (userIsClient && otherHasMessages) {
//                 return task;
//             }

//             // Check if other user is client and user sent a message
//             if (otherIsClient && userHasMessages) {
//                 return task;
//             }
//         }

//         return null;
//     }, [allTasks, initialTaskId, user?._id, otherUserId]);

//     // Get other user info
//     const otherUser = useMemo(() => {
//         // First try to get from current task
//         if (currentTask) {
//             const clientId = currentTask.client?._id || currentTask.client;

//             if (clientId === otherUserId && currentTask.client && typeof currentTask.client === 'object') {
//                 return {
//                     _id: currentTask.client._id,
//                     firstName: currentTask.client.firstName || 'Client',
//                     lastName: currentTask.client.lastName || '',
//                     profilePicture: currentTask.client.profilePicture || null,
//                     role: 'client'
//                 };
//             }

//             if (currentTask.acceptedBy && typeof currentTask.acceptedBy === 'object' &&
//                 (currentTask.acceptedBy._id === otherUserId || currentTask.acceptedBy === otherUserId)) {
//                 return {
//                     _id: currentTask.acceptedBy._id,
//                     firstName: currentTask.acceptedBy.firstName || 'Tasker',
//                     lastName: currentTask.acceptedBy.lastName || '',
//                     profilePicture: currentTask.acceptedBy.profilePicture || null,
//                     role: 'tasker'
//                 };
//             }
//         }

//         // Try to find from any message across all tasks
//         for (const task of allTasks) {
//             if (task.messages) {
//                 const msg = task.messages.find((m: any) => {
//                     const senderId = m.sender?._id || m.sender;
//                     return senderId === otherUserId && m.sender && typeof m.sender === 'object';
//                 });
//                 if (msg?.sender) {
//                     return {
//                         _id: otherUserId,
//                         firstName: msg.sender.firstName || 'User',
//                         lastName: msg.sender.lastName || '',
//                         profilePicture: msg.sender.profilePicture || null,
//                         role: msg.senderRole || 'user'
//                     };
//                 }
//             }
//         }

//         return {
//             _id: otherUserId,
//             firstName: 'User',
//             lastName: '',
//             profilePicture: null,
//             role: 'user'
//         };
//     }, [currentTask, otherUserId, allTasks]);

//     // Get private messages between current user and other user
//     const serverMessages = useMemo(() => {
//         if (!currentTask?.messages || !user?._id) return [];

//         return currentTask.messages
//             .filter((msg: any) => {
//                 const senderId = msg.sender?._id || msg.sender;
//                 // Only messages between me and the other person
//                 return senderId === user._id || senderId === otherUserId;
//             })
//             .map((msg: any) => {
//                 // Ensure sender info is populated
//                 let senderInfo = msg.sender;
//                 if (!senderInfo || typeof senderInfo !== 'object') {
//                     const senderId = msg.sender;
//                     if (senderId === user._id) {
//                         senderInfo = {
//                             _id: user._id,
//                             firstName: user.firstName,
//                             lastName: user.lastName,
//                             profilePicture: user.profilePicture
//                         };
//                     } else {
//                         senderInfo = {
//                             _id: otherUserId,
//                             firstName: otherUser.firstName,
//                             lastName: otherUser.lastName,
//                             profilePicture: otherUser.profilePicture
//                         };
//                     }
//                 }

//                 return {
//                     ...msg,
//                     sender: senderInfo,
//                     taskId: currentTask._id
//                 };
//             })
//             .sort((a: any, b: any) =>
//                 new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//             );
//     }, [currentTask, user, otherUserId, otherUser]);

//     // Combine server messages with local optimistic messages
//     const allMessages = useMemo(() => {
//         const combined = [...serverMessages];

//         // Add local messages that don't exist in server messages
//         localMessages.forEach(localMsg => {
//             const exists = serverMessages.some((m: any) =>
//                 m._id === localMsg._id ||
//                 (!localMsg.isOptimistic && m.message === localMsg.message &&
//                     Math.abs(new Date(m.createdAt).getTime() - new Date(localMsg.createdAt).getTime()) < 10000)
//             );
//             if (!exists) {
//                 combined.push(localMsg);
//             }
//         });

//         return combined.sort((a, b) =>
//             new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//         );
//     }, [serverMessages, localMessages]);

//     // Reset state when conversation changes
//     useEffect(() => {
//         const convKey = `${currentTask?._id}-${otherUserId}`;
//         if (convKey !== prevConvKey.current) {
//             setLocalMessages([]);
//             hasMarkedAsRead.current = false;
//             prevConvKey.current = convKey;
//         }
//     }, [currentTask?._id, otherUserId]);

//     // Mark messages as read
//     const markAsRead = useCallback(async () => {
//         if (!isOpen || !currentTask || hasMarkedAsRead.current) return;

//         const unreadFromOther = allMessages.filter(msg => {
//             const senderId = msg.sender?._id || msg.sender;
//             return senderId === otherUserId && !msg.isRead && !msg.isOptimistic;
//         });

//         if (unreadFromOther.length > 0) {
//             hasMarkedAsRead.current = true;

//             try {
//                 await markMessagesAsRead(currentTask._id).unwrap();
//                 if (refetchTasks) {
//                     setTimeout(() => refetchTasks(), 500);
//                 }
//             } catch (error) {
//                 console.error('Failed to mark messages as read:', error);
//                 hasMarkedAsRead.current = false;
//             }
//         }
//     }, [isOpen, currentTask, allMessages, otherUserId, markMessagesAsRead, refetchTasks]);

//     useEffect(() => {
//         if (isOpen && currentTask) {
//             markAsRead();
//         }
//     }, [isOpen, currentTask, markAsRead]);

//     // Scroll to bottom
//     useEffect(() => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [allMessages]);

//     // Focus input when chat opens
//     useEffect(() => {
//         if (isOpen && !isMinimized && inputRef.current) {
//             setTimeout(() => inputRef.current?.focus(), 100);
//         }
//     }, [isOpen, isMinimized]);

//     // Auto-refresh
//     useEffect(() => {
//         if (!isOpen || !refetchTasks) return;

//         const interval = setInterval(() => {
//             refetchTasks();
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [isOpen, refetchTasks]);

//     const handleSend = async () => {
//         if (!message.trim() || !currentTask) return;

//         const messageText = message.trim();
//         const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

//         // Create optimistic message
//         const optimisticMessage: LocalMessage = {
//             _id: optimisticId,
//             sender: {
//                 _id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 profilePicture: user.profilePicture
//             },
//             senderRole: user.currentRole || 'tasker',
//             message: messageText,
//             isRead: false,
//             createdAt: new Date().toISOString(),
//             isOptimistic: true,
//             isSending: true
//         };

//         // Add optimistic message immediately
//         setLocalMessages(prev => [...prev, optimisticMessage]);
//         setMessage("");

//         try {
//             // Use the passed onSendMessage if available, otherwise use mutation
//             if (onSendMessage) {
//                 await onSendMessage(currentTask._id, messageText);
//             } else {
//                 await sendMessageMutation({
//                     taskId: currentTask._id,
//                     message: messageText
//                 }).unwrap();
//             }

//             // Update message status
//             setLocalMessages(prev =>
//                 prev.map(msg =>
//                     msg._id === optimisticId
//                         ? { ...msg, isSending: false }
//                         : msg
//                 )
//             );

//             // Refetch to get real message
//             if (refetchTasks) {
//                 setTimeout(() => {
//                     refetchTasks();
//                     // Remove optimistic message after server message arrives
//                     setTimeout(() => {
//                         setLocalMessages(prev => prev.filter(msg => msg._id !== optimisticId));
//                     }, 2000);
//                 }, 500);
//             }

//         } catch (error) {
//             console.error('Failed to send message:', error);

//             setLocalMessages(prev =>
//                 prev.map(msg =>
//                     msg._id === optimisticId
//                         ? { ...msg, isSending: false, isFailed: true }
//                         : msg
//                 )
//             );
//         }
//     };

//     const handleRetry = (failedMsg: LocalMessage) => {
//         setLocalMessages(prev => prev.filter(msg => msg._id !== failedMsg._id));
//         setMessage(failedMsg.message);
//         inputRef.current?.focus();
//     };

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     };

//     const handleRefresh = async () => {
//         if (!refetchTasks) return;
//         setIsRefreshing(true);
//         await refetchTasks();
//         setTimeout(() => setIsRefreshing(false), 500);
//     };

//     if (!isOpen) return null;

//     const isSending = isSendingMutation || isCommenting;

//     return (
//         <div className={`fixed bottom-0 lg:right-6 right-2 w-96 bg-white rounded-t-2xl shadow-2xl border-t-4 border-[#109C3D] flex flex-col z-[60] transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
//                 <div className="flex items-center gap-3 flex-1 min-w-0">
//                     {otherUser.profilePicture ? (
//                         <Image
//                             src={otherUser.profilePicture}
//                             width={40}
//                             height={40}
//                             alt={otherUser.firstName}
//                             className="rounded-full object-cover flex-shrink-0"
//                         />
//                     ) : (
//                         <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold flex-shrink-0">
//                             {otherUser.firstName?.[0] || 'U'}
//                         </div>
//                     )}
//                     <div className="min-w-0 flex-1">
//                         <h3 className="font-bold text-sm truncate">
//                             {otherUser.firstName} {otherUser.lastName}
//                         </h3>
//                         <p className="text-xs opacity-80 truncate">
//                             {currentTask?.taskTitle || currentTask?.serviceTitle || 'Chat'} • {otherUser.role === 'client' ? 'Client' : 'Tasker'}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex gap-1 flex-shrink-0">
//                     <button
//                         onClick={handleRefresh}
//                         disabled={isRefreshing}
//                         className="p-2 hover:bg-white/20 rounded transition-colors"
//                         title="Refresh"
//                     >
//                         <FiRefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
//                     </button>
//                     <button
//                         onClick={() => setIsMinimized(!isMinimized)}
//                         className="p-2 hover:bg-white/20 rounded transition-colors"
//                     >
//                         {isMinimized ? <FiMaximize2 size={14} /> : <FiMinimize2 size={14} />}
//                     </button>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-white/20 rounded transition-colors"
//                     >
//                         <FiX size={16} />
//                     </button>
//                 </div>
//             </div>

//             {!isMinimized && (
//                 <>
//                     {/* Messages Area */}
//                     <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
//                         {!currentTask ? (
//                             <div className="flex flex-col justify-center items-center h-full text-gray-500">
//                                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                                     <FiMessageCircle size={32} className="text-gray-400" />
//                                 </div>
//                                 <p className="font-medium">No conversation found</p>
//                                 <p className="text-sm text-center mt-1">
//                                     Start by messaging from a task
//                                 </p>
//                             </div>
//                         ) : allMessages.length === 0 ? (
//                             <div className="flex flex-col justify-center items-center h-full text-gray-500">
//                                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                                     <FiMessageCircle size={32} className="text-gray-400" />
//                                 </div>
//                                 <p className="font-medium">No messages yet</p>
//                                 <p className="text-sm text-center mt-1">
//                                     Send a message to {otherUser.firstName}
//                                 </p>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Task info banner */}
//                                 <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg text-center mb-4">
//                                     Task: <span className="font-medium">{currentTask.taskTitle || currentTask.serviceTitle}</span>
//                                 </div>

//                                 {allMessages.map((msg, index) => {
//                                     const senderId = msg.sender?._id || msg.sender;
//                                     const isMe = senderId === user._id;

//                                     return (
//                                         <div
//                                             key={msg._id || index}
//                                             className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
//                                         >
//                                             {/* Avatar for other user */}
//                                             {!isMe && (
//                                                 <div className="flex-shrink-0 mr-2">
//                                                     {otherUser.profilePicture ? (
//                                                         <Image
//                                                             src={otherUser.profilePicture}
//                                                             width={32}
//                                                             height={32}
//                                                             alt={otherUser.firstName}
//                                                             className="rounded-full object-cover"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-8 h-8 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center text-white text-xs font-bold">
//                                                             {otherUser.firstName?.[0] || 'U'}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             <div className={`max-w-[75%]`}>
//                                                 <div
//                                                     className={`rounded-2xl px-4 py-2 ${isMe
//                                                             ? msg.isFailed
//                                                                 ? 'bg-red-100 text-red-800 rounded-br-sm'
//                                                                 : 'bg-[#109C3D] text-white rounded-br-sm'
//                                                             : 'bg-white border border-gray-200 shadow-sm rounded-bl-sm'
//                                                         } ${msg.isSending ? 'opacity-70' : ''}`}
//                                                 >
//                                                     <p className="text-sm whitespace-pre-wrap break-words">
//                                                         {msg.message}
//                                                     </p>
//                                                 </div>

//                                                 {/* Message metadata */}
//                                                 <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
//                                                     <span className="text-xs text-gray-400">
//                                                         {new Date(msg.createdAt).toLocaleTimeString([], {
//                                                             hour: '2-digit',
//                                                             minute: '2-digit'
//                                                         })}
//                                                     </span>

//                                                     {isMe && (
//                                                         <>
//                                                             {msg.isSending && (
//                                                                 <span className="text-xs text-gray-400">Sending...</span>
//                                                             )}
//                                                             {msg.isFailed && (
//                                                                 <button
//                                                                     onClick={() => handleRetry(msg)}
//                                                                     className="text-xs text-red-500 underline ml-1"
//                                                                 >
//                                                                     Failed - Retry
//                                                                 </button>
//                                                             )}
//                                                             {!msg.isSending && !msg.isFailed && (
//                                                                 <span className="text-gray-400">
//                                                                     {msg.isRead ? (
//                                                                         <FiCheckCircle size={12} className="text-[#109C3D]" />
//                                                                     ) : (
//                                                                         <FiCheck size={12} />
//                                                                     )}
//                                                                 </span>
//                                                             )}
//                                                         </>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                                 <div ref={messagesEndRef} />
//                             </>
//                         )}
//                     </div>

//                     {/* Input Area */}
//                     <div className="p-4 border-t bg-white">
//                         {!currentTask ? (
//                             <p className="text-center text-gray-500 text-sm">
//                                 No task found for this conversation
//                             </p>
//                         ) : (
//                             <div className="flex gap-2">
//                                 <input
//                                     ref={inputRef}
//                                     type="text"
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     onKeyPress={handleKeyPress}
//                                     placeholder={`Message ${otherUser.firstName}...`}
//                                     disabled={isSending}
//                                     className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 disabled:bg-gray-100 text-sm"
//                                     maxLength={5000}
//                                 />
//                                 <button
//                                     onClick={handleSend}
//                                     disabled={!message.trim() || isSending}
//                                     className={`p-3 rounded-full transition-all duration-200 ${!message.trim() || isSending
//                                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                             : 'bg-[#109C3D] text-white hover:bg-[#0d8a35] active:scale-95'
//                                         }`}
//                                 >
//                                     <FiSend size={18} />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default MessengerChat;


// MessengerChat.tsx - Updated mark as read logic
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
    FiSend, FiX, FiMinimize2, FiMaximize2,
    FiRefreshCw, FiCheck, FiCheckCircle, FiMessageCircle
} from "react-icons/fi";
import {
    useSendMessageMutation,
    useMarkMessagesAsReadMutation
} from '@/features/api/taskApi';

interface MessengerChatProps {
    isOpen: boolean;
    onClose: () => void;
    otherUserId: string;
    initialTaskId?: string;
    allTasks: any[];
    user: any;
    onSendMessage?: (taskId: string, message: string) => Promise<void>;
    isCommenting?: boolean;
    refetchTasks?: () => void;
}

interface LocalMessage {
    _id: string;
    sender: any;
    senderRole: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    isOptimistic?: boolean;
    isSending?: boolean;
    isFailed?: boolean;
}

const MessengerChat: React.FC<MessengerChatProps> = ({
    isOpen,
    onClose,
    otherUserId,
    initialTaskId,
    allTasks = [],
    user,
    onSendMessage,
    isCommenting,
    refetchTasks
}) => {
    const [message, setMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastMarkReadTime = useRef<number>(0);
    const prevTaskId = useRef<string | null>(null);

    const [sendMessageMutation, { isLoading: isSendingMutation }] = useSendMessageMutation();
    const [markMessagesAsRead] = useMarkMessagesAsReadMutation();

    // Find the current task
    const currentTask = useMemo(() => {
        if (initialTaskId) {
            const task = allTasks.find(t => t._id === initialTaskId);
            if (task) return task;
        }

        for (const task of allTasks) {
            if (!task.messages || task.messages.length === 0) continue;

            const clientId = task.client?._id || task.client;
            const taskerId = task.acceptedBy?._id || task.acceptedBy;
            const userIsClient = clientId === user?._id;
            const userIsTasker = taskerId === user?._id;
            const otherIsClient = clientId === otherUserId;
            const otherIsTasker = taskerId === otherUserId;

            if ((userIsClient && otherIsTasker) || (userIsTasker && otherIsClient)) {
                return task;
            }

            const userHasMessages = task.messages.some((m: any) => {
                const senderId = m.sender?._id || m.sender;
                return senderId === user?._id;
            });

            const otherHasMessages = task.messages.some((m: any) => {
                const senderId = m.sender?._id || m.sender;
                return senderId === otherUserId;
            });

            if (userHasMessages && otherHasMessages) return task;
            if (userIsClient && otherHasMessages) return task;
            if (otherIsClient && userHasMessages) return task;
        }

        return null;
    }, [allTasks, initialTaskId, user?._id, otherUserId]);

    // Get other user info
    const otherUser = useMemo(() => {
        if (currentTask) {
            const clientId = currentTask.client?._id || currentTask.client;

            if (clientId === otherUserId && currentTask.client && typeof currentTask.client === 'object') {
                return {
                    _id: currentTask.client._id,
                    firstName: currentTask.client.firstName || 'Client',
                    lastName: currentTask.client.lastName || '',
                    profilePicture: currentTask.client.profilePicture || null,
                    role: 'client'
                };
            }

            if (currentTask.acceptedBy && typeof currentTask.acceptedBy === 'object') {
                const acceptedById = currentTask.acceptedBy._id || currentTask.acceptedBy;
                if (acceptedById === otherUserId) {
                    return {
                        _id: currentTask.acceptedBy._id,
                        firstName: currentTask.acceptedBy.firstName || 'Tasker',
                        lastName: currentTask.acceptedBy.lastName || '',
                        profilePicture: currentTask.acceptedBy.profilePicture || null,
                        role: 'tasker'
                    };
                }
            }
        }

        for (const task of allTasks) {
            if (task.messages) {
                const msg = task.messages.find((m: any) => {
                    const senderId = m.sender?._id || m.sender;
                    return senderId === otherUserId && m.sender && typeof m.sender === 'object';
                });
                if (msg?.sender) {
                    return {
                        _id: otherUserId,
                        firstName: msg.sender.firstName || 'User',
                        lastName: msg.sender.lastName || '',
                        profilePicture: msg.sender.profilePicture || null,
                        role: msg.senderRole || 'user'
                    };
                }
            }
        }

        return {
            _id: otherUserId,
            firstName: 'User',
            lastName: '',
            profilePicture: null,
            role: 'user'
        };
    }, [currentTask, otherUserId, allTasks]);

    // Get messages for this conversation
    const serverMessages = useMemo(() => {
        if (!currentTask?.messages || !user?._id) return [];

        return currentTask.messages
            .filter((msg: any) => {
                const senderId = msg.sender?._id || msg.sender;
                return senderId === user._id || senderId === otherUserId;
            })
            .map((msg: any) => {
                let senderInfo = msg.sender;
                if (!senderInfo || typeof senderInfo !== 'object') {
                    const senderId = msg.sender;
                    if (senderId === user._id) {
                        senderInfo = {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            profilePicture: user.profilePicture
                        };
                    } else {
                        senderInfo = {
                            _id: otherUserId,
                            firstName: otherUser.firstName,
                            lastName: otherUser.lastName,
                            profilePicture: otherUser.profilePicture
                        };
                    }
                }

                return {
                    ...msg,
                    sender: senderInfo,
                    taskId: currentTask._id
                };
            })
            .sort((a: any, b: any) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
    }, [currentTask, user, otherUserId, otherUser]);

    // Count unread messages from the other user
    const unreadCount = useMemo(() => {
        return serverMessages.filter(msg => {
            const senderId = msg.sender?._id || msg.sender;
            return senderId === otherUserId && msg.isRead === false;
        }).length;
    }, [serverMessages, otherUserId]);

    // Combine with optimistic messages
    const allMessages = useMemo(() => {
        const combined = [...serverMessages];

        localMessages.forEach(localMsg => {
            const exists = serverMessages.some((m: any) =>
                m._id === localMsg._id ||
                (m.message === localMsg.message &&
                    Math.abs(new Date(m.createdAt).getTime() - new Date(localMsg.createdAt).getTime()) < 10000)
            );
            if (!exists) {
                combined.push(localMsg);
            }
        });

        return combined.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [serverMessages, localMessages]);

    // Reset local messages when task changes
    useEffect(() => {
        if (currentTask?._id !== prevTaskId.current) {
            setLocalMessages([]);
            lastMarkReadTime.current = 0;
            prevTaskId.current = currentTask?._id || null;
        }
    }, [currentTask?._id]);

    // Mark messages as read when chat opens or receives new messages
    const markAsRead = useCallback(async () => {
        if (!currentTask?._id || !isOpen || unreadCount === 0) {
            return;
        }

        // Debounce - don't call more than once per 2 seconds
        const now = Date.now();
        if (now - lastMarkReadTime.current < 2000) {
            return;
        }
        lastMarkReadTime.current = now;

        try {
            console.log(`Marking ${unreadCount} messages as read for task ${currentTask._id}`);

            const result = await markMessagesAsRead(currentTask._id).unwrap();
            console.log('Mark as read result:', result);

            // Refetch to get updated data
            if (refetchTasks) {
                setTimeout(() => refetchTasks(), 500);
            }
        } catch (error) {
            console.error('Failed to mark messages as read:', error);
            // Reset debounce on error so it can retry
            lastMarkReadTime.current = 0;
        }
    }, [currentTask?._id, isOpen, unreadCount, markMessagesAsRead, refetchTasks]);

    // Auto mark as read when chat opens with unread messages
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            const timer = setTimeout(markAsRead, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, unreadCount, markAsRead]);

    // Also mark as read when new messages arrive while chat is open
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markAsRead();
        }
    }, [serverMessages.length]); // Trigger when message count changes

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        if (!isOpen || !refetchTasks) return;

        const interval = setInterval(refetchTasks, 5000);
        return () => clearInterval(interval);
    }, [isOpen, refetchTasks]);

    // Send message handler
    const handleSend = async () => {
        if (!message.trim() || !currentTask) return;

        const messageText = message.trim();
        const optimisticId = `optimistic-${Date.now()}`;

        const optimisticMessage: LocalMessage = {
            _id: optimisticId,
            sender: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
            },
            senderRole: user.currentRole || 'tasker',
            message: messageText,
            isRead: false,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
            isSending: true
        };

        setLocalMessages(prev => [...prev, optimisticMessage]);
        setMessage("");

        try {
            if (onSendMessage) {
                await onSendMessage(currentTask._id, messageText);
            } else {
                await sendMessageMutation({
                    taskId: currentTask._id,
                    message: messageText
                }).unwrap();
            }

            setLocalMessages(prev =>
                prev.map(msg =>
                    msg._id === optimisticId ? { ...msg, isSending: false } : msg
                )
            );

            if (refetchTasks) {
                setTimeout(() => {
                    refetchTasks();
                    setTimeout(() => {
                        setLocalMessages(prev => prev.filter(msg => msg._id !== optimisticId));
                    }, 2000);
                }, 500);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setLocalMessages(prev =>
                prev.map(msg =>
                    msg._id === optimisticId ? { ...msg, isSending: false, isFailed: true } : msg
                )
            );
        }
    };

    const handleRetry = (failedMsg: LocalMessage) => {
        setLocalMessages(prev => prev.filter(msg => msg._id !== failedMsg._id));
        setMessage(failedMsg.message);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRefresh = async () => {
        if (!refetchTasks) return;
        setIsRefreshing(true);
        await refetchTasks();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (!isOpen) return null;

    const isSending = isSendingMutation || isCommenting;

    return (
        <div className={`fixed bottom-0 lg:right-6 right-2 w-96 bg-white rounded-t-2xl shadow-2xl border-t-4 border-[#109C3D] flex flex-col z-[60] transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {otherUser.profilePicture ? (
                        <Image
                            src={otherUser.profilePicture}
                            width={40}
                            height={40}
                            alt={otherUser.firstName}
                            className="rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {otherUser.firstName?.[0] || 'U'}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm truncate">
                            {otherUser.firstName} {otherUser.lastName}
                            {unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </h3>
                        <p className="text-xs opacity-80 truncate">
                            {currentTask?.taskTitle || currentTask?.serviceTitle || 'Chat'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Refresh"
                    >
                        <FiRefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                    >
                        {isMinimized ? <FiMaximize2 size={14} /> : <FiMinimize2 size={14} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                    >
                        <FiX size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                        {!currentTask ? (
                            <div className="flex flex-col justify-center items-center h-full text-gray-500">
                                <FiMessageCircle size={48} className="mb-4 opacity-30" />
                                <p className="font-medium">No conversation found</p>
                                <p className="text-sm text-center mt-1">Start by messaging from a task</p>
                            </div>
                        ) : allMessages.length === 0 ? (
                            <div className="flex flex-col justify-center items-center h-full text-gray-500">
                                <FiMessageCircle size={48} className="mb-4 opacity-30" />
                                <p className="font-medium">No messages yet</p>
                                <p className="text-sm text-center mt-1">Send a message to {otherUser.firstName}</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg text-center mb-4">
                                    Task: <span className="font-medium">{currentTask.taskTitle || currentTask.serviceTitle}</span>
                                </div>

                                {allMessages.map((msg, index) => {
                                    const senderId = msg.sender?._id || msg.sender;
                                    const isMe = senderId === user._id;

                                    return (
                                        <div
                                            key={msg._id || index}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {!isMe && (
                                                <div className="flex-shrink-0 mr-2">
                                                    {otherUser.profilePicture ? (
                                                        <Image
                                                            src={otherUser.profilePicture}
                                                            width={32}
                                                            height={32}
                                                            alt={otherUser.firstName}
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                            {otherUser.firstName?.[0] || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="max-w-[75%]">
                                                <div
                                                    className={`rounded-2xl px-4 py-2 ${isMe
                                                            ? msg.isFailed
                                                                ? 'bg-red-100 text-red-800 rounded-br-sm'
                                                                : 'bg-[#109C3D] text-white rounded-br-sm'
                                                            : 'bg-white border border-gray-200 shadow-sm rounded-bl-sm'
                                                        } ${msg.isSending ? 'opacity-70' : ''}`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap break-words">
                                                        {msg.message}
                                                    </p>
                                                </div>

                                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>

                                                    {isMe && (
                                                        <>
                                                            {msg.isSending && (
                                                                <span className="text-xs text-gray-400">Sending...</span>
                                                            )}
                                                            {msg.isFailed && (
                                                                <button
                                                                    onClick={() => handleRetry(msg)}
                                                                    className="text-xs text-red-500 underline ml-1"
                                                                >
                                                                    Retry
                                                                </button>
                                                            )}
                                                            {!msg.isSending && !msg.isFailed && (
                                                                <span className="text-gray-400">
                                                                    {msg.isRead ? (
                                                                        <FiCheckCircle size={12} className="text-blue-400" />
                                                                    ) : (
                                                                        <FiCheck size={12} />
                                                                    )}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-white">
                        {!currentTask ? (
                            <p className="text-center text-gray-500 text-sm">
                                No task found for this conversation
                            </p>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={`Message ${otherUser.firstName}...`}
                                    disabled={isSending}
                                    className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 disabled:bg-gray-100 text-sm"
                                    maxLength={5000}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim() || isSending}
                                    className={`p-3 rounded-full transition-all duration-200 ${!message.trim() || isSending
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#109C3D] text-white hover:bg-[#0d8a35] active:scale-95'
                                        }`}
                                >
                                    <FiSend size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MessengerChat;



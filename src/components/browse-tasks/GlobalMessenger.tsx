/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useGetScheduleTasksQuery, useGetFlexibleTasksQuery, useSendMessageMutation } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import MessengerInbox from './MessengerInbox';
import MessengerChat from './MessengerChat';
import { toast } from 'react-toastify';

const GlobalMessenger = () => {
    const [user, setUser] = useState<any>(null);
    const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
    const [activeInitialTaskId, setActiveInitialTaskId] = useState<string | null>(null);
    const [seenConversations, setSeenConversations] = useState<Set<string>>(new Set());

    // Tasks data
    const { data: scheduleTasks = [] } = useGetScheduleTasksQuery({});
    const { data: flexibleTasks = [] } = useGetFlexibleTasksQuery({});
    const allTasks = [...scheduleTasks, ...flexibleTasks];

    const [sendMessage] = useSendMessageMutation();

    // Refetch handler
    const refetchAll = useCallback(() => {
        // Add refetch logic if needed
    }, []);

    // Chat handlers
    const handleOpenChat = useCallback((userId: string, taskId: string | null = null) => {
        setActiveChatUserId(userId);
        setActiveInitialTaskId(taskId);

        if (taskId) {
            const convKey = `${taskId}-${userId}`;
            setSeenConversations(prev => new Set([...prev, convKey]));
        } else {
            setSeenConversations(prev => new Set([...prev, userId]));
        }
    }, []);

    const handleCloseChat = useCallback(() => {
        setActiveChatUserId(null);
        setActiveInitialTaskId(null);
    }, []);

    const handleSendMessage = useCallback(async (taskId: string, message: string) => {
        try {
            await sendMessage({ taskId, message }).unwrap();
            refetchAll();
        } catch (err) {
            toast.error("Failed to send message");
            console.error(err);
            throw err;
        }
    }, [sendMessage, refetchAll]);

    // Fetch user
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user: fetchedUser } = await checkLoginStatus();
            setUser(isLoggedIn ? fetchedUser : null);
        };
        fetchUser();
    }, []);

    if (!user) return null;

    return (
        <>
            <MessengerInbox
                user={user}
                allTasks={allTasks}
                onOpenChat={handleOpenChat}
                seenConversations={seenConversations}
                refetchTasks={refetchAll}
            />

            {activeChatUserId && (
                <MessengerChat
                    isOpen={true}
                    onClose={handleCloseChat}
                    otherUserId={activeChatUserId}
                    initialTaskId={activeInitialTaskId || undefined}
                    allTasks={allTasks}
                    user={user}
                    onSendMessage={handleSendMessage}
                    refetchTasks={refetchAll}
                />
            )}
        </>
    );
};

export default GlobalMessenger;
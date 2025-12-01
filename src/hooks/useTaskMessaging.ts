/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// hooks/useTaskMessaging.js
import { useState, useEffect } from 'react';
import {
    useGetTaskMessagesQuery,
    useMarkMessagesAsReadMutation,
    useSendMessageMutation
} from '@/features/api/taskApi';

export const useTaskMessaging = (taskId, userId) => {
    const [messages, setMessages] = useState([]);

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [markAsRead] = useMarkMessagesAsReadMutation();

    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        refetch: refetchMessages
    } = useGetTaskMessagesQuery(taskId, {
        skip: !taskId,
        pollingInterval: 3000, // Real-time updates every 3 seconds
    });

    useEffect(() => {
        if (messagesData) {
            setMessages(messagesData);

            // Mark messages as read when we load them
            if (userId && taskId) {
                const hasUnread = messagesData.some(
                    msg => msg.sender._id !== userId && !msg.isRead
                );
                if (hasUnread) {
                    markAsRead(taskId);
                }
            }
        }
    }, [messagesData, userId, taskId, markAsRead]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() || !taskId) return;

        try {
            await sendMessage({
                taskId,
                message: messageText.trim()
            }).unwrap();
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    };

    return {
        messages,
        isLoadingMessages,
        isSending,
        sendMessage: handleSendMessage,
        refetchMessages
    };
};
// hooks/useSeenConversations.ts
import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'messenger_seen_conversations';
const LAST_READ_KEY = 'messenger_last_read_times';

export const useSeenConversations = (userId: string | undefined) => {
    const [seenConversations, setSeenConversations] = useState<Set<string>>(new Set());
    const [lastReadTimes, setLastReadTimes] = useState<Record<string, number>>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const initialLoadDone = useRef(false);

    // Load from localStorage on mount
    useEffect(() => {
        if (!userId || initialLoadDone.current) return;

        try {
            // Load seen conversations
            const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                setSeenConversations(new Set(parsed));
            }

            // Load last read times
            const storedTimes = localStorage.getItem(`${LAST_READ_KEY}_${userId}`);
            if (storedTimes) {
                setLastReadTimes(JSON.parse(storedTimes));
            }
        } catch (error) {
            console.error('Failed to load seen conversations:', error);
        }

        initialLoadDone.current = true;
        setIsLoaded(true);
    }, [userId]);

    // Save to localStorage whenever seenConversations changes
    useEffect(() => {
        if (!userId || !isLoaded) return;

        try {
            localStorage.setItem(
                `${STORAGE_KEY}_${userId}`,
                JSON.stringify([...seenConversations])
            );
            localStorage.setItem(
                `${LAST_READ_KEY}_${userId}`,
                JSON.stringify(lastReadTimes)
            );
        } catch (error) {
            console.error('Failed to save seen conversations:', error);
        }
    }, [seenConversations, lastReadTimes, userId, isLoaded]);

    const markConversationAsSeen = useCallback((conversationKey: string) => {
        const now = Date.now();
        setSeenConversations(prev => {
            const newSet = new Set(prev);
            newSet.add(conversationKey);
            return newSet;
        });
        setLastReadTimes(prev => ({
            ...prev,
            [conversationKey]: now
        }));
    }, []);

    const getLastReadTime = useCallback((conversationKey: string): number => {
        return lastReadTimes[conversationKey] || 0;
    }, [lastReadTimes]);

    const clearSeenConversation = useCallback((conversationKey: string) => {
        setSeenConversations(prev => {
            const newSet = new Set(prev);
            newSet.delete(conversationKey);
            return newSet;
        });
    }, []);

    return {
        seenConversations,
        lastReadTimes,
        markConversationAsSeen,
        getLastReadTime,
        clearSeenConversation,
        isLoaded
    };
};
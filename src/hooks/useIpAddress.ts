// hooks/useIpAddress.ts
'use client'

import { useState, useEffect } from 'react';

export function useIpAddress() {
    const [ipAddress, setIpAddress] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getIpAddress() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIpAddress(data.ip);
            } catch (error) {
                console.error('Error fetching IP:', error);
                setIpAddress('Unable to fetch IP');
            } finally {
                setLoading(false);
            }
        }

        getIpAddress();
    }, []);

    return { ipAddress, loading };
}
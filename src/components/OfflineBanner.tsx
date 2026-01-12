import React, { useEffect, useState } from 'react';
import { OfflineManager } from '../services/OfflineManager';
import { WifiOff, Save } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
    const [isOffline, setIsOffline] = useState(OfflineManager.isOffline);
    const [queueSize, setQueueSize] = useState(OfflineManager.queue.length);

    useEffect(() => {
        return OfflineManager.subscribe((offline: boolean, size: number) => {
            setIsOffline(offline);
            setQueueSize(size);
        });
    }, []);

    if (!isOffline && queueSize === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black font-bold px-6 py-3 z-[100] flex justify-between items-center shadow-[0_-5px_20px_rgba(234,179,8,0.3)]">
            <div className="flex items-center gap-3">
                <div className="bg-black/10 p-2 rounded-full animate-pulse">
                    <WifiOff className="w-5 h-5" />
                </div>
                <div>
                    <div className="uppercase tracking-blacker text-sm">OFFLINE MODE</div>
                    <div className="text-xs font-mono opacity-80">CONNECTION INTERRUPTED</div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {queueSize > 0 && (
                    <div className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded text-xs font-mono">
                        <Save className="w-3 h-3" />
                        <span>SAVED {queueSize} LOCALLY</span>
                    </div>
                )}
            </div>
        </div>
    );
};

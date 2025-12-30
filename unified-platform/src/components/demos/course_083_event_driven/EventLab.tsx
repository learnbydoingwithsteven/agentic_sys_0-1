'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Radio,
    Package,
    UserPlus,
    Mail,
    Truck,
    Box,
    Megaphone,
    Database
} from 'lucide-react';
import { publishMockEvent, EventLog } from '@/actions/course_083_event_driven/event_backend';

export function EventLab() {
    const [events, setEvents] = useState<EventLog[]>([]);
    const [animating, setAnimating] = useState(false);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    const handleTrigger = async (topic: string) => {
        if (animating) return;
        setAnimating(true);
        setActiveTopic(topic);
        const res = await publishMockEvent(topic);

        // Stagger the "processing"
        setTimeout(() => {
            setEvents(res);
            setAnimating(false);
            setActiveTopic(null);
        }, 1500);
    };

    const EventBus = () => (
        <div className="w-full h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full my-8 relative flex items-center justify-center">
            <div className="text-xs font-bold text-white uppercase tracking-widest absolute -top-6">Event Bus (Kafka)</div>
            {animating && activeTopic && (
                <motion.div
                    layoutId="payload"
                    className="w-8 h-8 bg-white rounded-full border-4 border-indigo-600 z-20 shadow-xl"
                />
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-8 h-[700px]">
            {/* Triggers */}
            <div className="flex justify-center gap-8">
                <button
                    onClick={() => handleTrigger('ORDER_PLACED')}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                    <Package className="w-8 h-8 text-blue-500" />
                    <span className="font-bold">Place Order</span>
                </button>
                <button
                    onClick={() => handleTrigger('USER_SIGNUP')}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col items-center gap-2 hover:border-purple-500 hover:shadow-lg transition-all"
                >
                    <UserPlus className="w-8 h-8 text-purple-500" />
                    <span className="font-bold">New User</span>
                </button>
            </div>

            {/* Bus Visualization */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 rounded-3xl p-12 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
                <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                            <Radio className={`w-8 h-8 ${animating ? 'animate-pulse text-indigo-500' : 'text-zinc-400'}`} />
                        </div>
                        <div className="text-xs font-bold uppercase text-zinc-400">Publisher</div>
                    </div>
                </div>

                <EventBus />

                <div className="flex justify-between px-12 mt-8">
                    {/* Subscribers */}
                    {['ShippingAgent', 'EmailAgent', 'InventoryAgent'].map((agent, i) => {
                        const isActive = events.some(e => e.consumer === agent);

                        let Icon = Box;
                        if (agent.includes('Shipping')) Icon = Truck;
                        if (agent.includes('Email')) Icon = Mail;
                        if (agent.includes('Inventory')) Icon = Database;

                        return (
                            <div key={agent} className="flex flex-col items-center group">
                                <motion.div
                                    animate={{
                                        scale: isActive ? [1, 1.2, 1] : 1,
                                        borderColor: isActive ? '#10b981' : 'transparent'
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`
                                        w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 border-2 shadow-sm flex items-center justify-center mb-2
                                        ${isActive ? 'border-emerald-500 text-emerald-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'}
                                    `}
                                >
                                    <Icon className="w-8 h-8" />
                                </motion.div>
                                <div className={`text-xs font-bold ${isActive ? 'text-emerald-600' : 'text-zinc-500'}`}>{agent}</div>
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-[10px] font-mono text-emerald-500 mt-1"
                                        >
                                            RECEIVED
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { styled } from 'nativewind';
import { orderStore, MobileTicket } from '../../store/orderStore';
import { DigitalHandshake } from '../../components/Commerce/DigitalHandshake';
import { BlurView } from 'expo-blur';
import { Clock, CheckCircle, ChefHat, Beer } from 'lucide-react-native';
import { useHaptic } from '../../hooks/useHaptic';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function OrdersScreen() {
    const { trigger } = useHaptic();
    const [tickets, setTickets] = useState<MobileTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<MobileTicket | null>(null);

    useEffect(() => {
        setTickets(orderStore.getTickets());
        return orderStore.subscribe(() => {
            setTickets(orderStore.getTickets());
        });
    }, []);

    const handleHandshakeComplete = () => {
        trigger('success'); // Confirm 
        if (selectedTicket) {
            orderStore.updateTicketStatus(selectedTicket.id, 'delivered');
            setSelectedTicket(null);
        }
    };

    if (selectedTicket) {
        return (
            <DigitalHandshake
                orderId={selectedTicket.id}
                customerName="You"
                onConfirmed={handleHandshakeComplete}
            />
        );
    }

    return (
        <ScreenLayout className="px-6 pt-12">
            <StyledText className="text-white text-2xl font-bold mb-6 tracking-tight">MY ORDERS</StyledText>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {tickets.length === 0 ? (
                    <StyledView className="items-center justify-center py-20 opacity-50">
                        <StyledText className="text-zinc-500 font-mono mb-2">NO ACTIVE ORDERS</StyledText>
                        <StyledText className="text-zinc-700 text-xs text-center px-10">
                            Visit the Menu to place your first order.
                        </StyledText>
                    </StyledView>
                ) : (
                    tickets.map(ticket => (
                        <TouchableOpacity
                            key={ticket.id}
                            disabled={ticket.status !== 'ready'}
                            onPress={() => {
                                trigger('selection'); // Haptic
                                setSelectedTicket(ticket);
                            }}
                            className={`mb-4 rounded-2xl overflow-hidden border ${ticket.status === 'ready'
                                ? 'border-emerald-500/50 bg-emerald-900/10'
                                : ticket.status === 'delivered'
                                    ? 'border-zinc-800 bg-zinc-900/50 opacity-50'
                                    : 'border-zinc-700 bg-zinc-900'
                                }`}
                        >
                            <BlurView intensity={20} tint="dark" className="p-4">
                                <StyledView className="flex-row justify-between items-start mb-3">
                                    <StyledView className="flex-row items-center gap-2">
                                        <StyledView className={`w-8 h-8 rounded-full items-center justify-center ${ticket.station === 'bar' ? 'bg-purple-500/20' : 'bg-amber-500/20'
                                            }`}>
                                            {ticket.station === 'bar' ? <Beer size={14} color="#d8b4fe" /> : <ChefHat size={14} color="#fcd34d" />}
                                        </StyledView>
                                        <StyledView>
                                            <StyledText className="text-white font-bold text-lg">{ticket.station === 'bar' ? 'BAR' : 'KITCHEN'}</StyledText>
                                            <StyledText className="text-zinc-500 text-[10px] font-mono">#{ticket.id}</StyledText>
                                        </StyledView>
                                    </StyledView>

                                    <StyledView className={`px-2 py-1 rounded-full border ${ticket.status === 'ready' ? 'bg-emerald-500/20 border-emerald-500/50' :
                                        ticket.status === 'delivered' ? 'bg-zinc-800 border-zinc-700' :
                                            'bg-blue-500/20 border-blue-500/50'
                                        }`}>
                                        <StyledText className={`text-[10px] font-bold uppercase ${ticket.status === 'ready' ? 'text-emerald-400' :
                                            ticket.status === 'delivered' ? 'text-zinc-500' :
                                                'text-blue-400'
                                            }`}>
                                            {ticket.status === 'ready' ? 'READY TO PICKUP' : ticket.status}
                                        </StyledText>
                                    </StyledView>
                                </StyledView>

                                {/* Items List */}
                                <StyledView className="space-y-1 mb-3 pl-10">
                                    {ticket.items.map((item, idx) => (
                                        <StyledText key={idx} className="text-zinc-300 text-sm">
                                            <StyledText className="font-bold text-white">{item.qty}x</StyledText> {item.name}
                                        </StyledText>
                                    ))}
                                </StyledView>

                                {ticket.status === 'ready' && (
                                    <StyledView className="mt-2 bg-emerald-500 py-3 rounded-xl items-center">
                                        <StyledText className="text-black font-bold uppercase tracking-widest text-xs">Tap to Collect</StyledText>
                                    </StyledView>
                                )}
                            </BlurView>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </ScreenLayout>
    );
}

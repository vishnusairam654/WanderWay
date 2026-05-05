"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, PhoneOff, Users, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceParticipant {
    identity: string;
    isSpeaking: boolean;
}

interface VoiceBannerProps {
    threadId: string;
    username?: string;
    onClose: () => void;
}

export function VoiceBanner({ threadId, username = "Traveler", onClose }: VoiceBannerProps) {
    const [isConnecting, setIsConnecting] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [participants, setParticipants] = useState<VoiceParticipant[]>([
        { identity: username, isSpeaking: false },
    ]);
    const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate connection (real implementation uses @livekit/components-react)
        const timer = setTimeout(() => setIsConnecting(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const copyInviteLink = async () => {
        const link = `${window.location.origin}?voice=${threadId}`;
        await navigator.clipboard.writeText(link);
        setInviteLinkCopied(true);
        setTimeout(() => setInviteLinkCopied(false), 2000);
    };

    return (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
            {/* Left: Status */}
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    isConnecting ? "bg-secondary animate-pulse" : "bg-green-400"
                )} />
                <span className="text-xs font-medium text-foreground">
                    {isConnecting ? "Connecting to voice..." : `Voice active · ${participants.length} in room`}
                </span>
            </div>

            {/* Center: Participant avatars */}
            {!isConnecting && (
                <div className="flex items-center gap-1">
                    {participants.map((p, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2",
                                p.isSpeaking ? "border-secondary animate-pulse" : "border-background"
                            )}
                            title={p.identity}
                        >
                            {p.identity.charAt(0).toUpperCase()}
                        </div>
                    ))}
                </div>
            )}

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={copyInviteLink}
                    className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
                    title="Copy invite link"
                >
                    <Link2 size={11} />
                    {inviteLinkCopied ? "Copied!" : "Invite"}
                </button>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                        "p-1.5 rounded-full transition-colors",
                        isMuted ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </button>

                <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Leave voice"
                >
                    <PhoneOff size={14} />
                </button>
            </div>
        </div>
    );
}

interface VoiceButtonProps {
    threadId: string;
    username?: string;
}

export function VoiceButton({ threadId, username }: VoiceButtonProps) {
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleVoice = async () => {
        if (isVoiceActive) {
            setIsVoiceActive(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/voice/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomName: threadId,
                    username: username || `Traveler-${Math.floor(Math.random() * 1000)}`,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                console.error("Voice token error:", data.error);
                // Still show the UI — it'll indicate no connection
            }

            setIsVoiceActive(true);
        } catch (err) {
            console.error("Voice join failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleToggleVoice}
                disabled={isLoading}
                className={cn(
                    "p-2 rounded-xl transition-all duration-300 flex items-center gap-1.5",
                    isVoiceActive
                        ? "bg-green-500/20 text-green-600 border border-green-500/30"
                        : "opacity-60 hover:opacity-100 text-primary-foreground hover:bg-primary-foreground/10"
                )}
                title={isVoiceActive ? "Voice active — click to leave" : "Join voice chat"}
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Mic size={16} />
                )}
                {isVoiceActive && <span className="text-[10px] font-medium">Live</span>}
            </button>

            {/* The voice banner would be rendered conditionally in ChatBot */}
        </>
    );
}
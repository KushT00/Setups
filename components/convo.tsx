/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback } from 'react';
import { useConversation } from '@11labs/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: any) => console.log('Message:', message),
    onError: (error: any) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'v9y2YgI94Ohhke67c1tp',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const getStatusColor = () => {
    switch (conversation.status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Conversation</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
            <span className="text-sm font-normal capitalize">
              {conversation.status}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {conversation.status === 'connected' && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center justify-between">
              <span>
                Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}
              </span>
              {conversation.isSpeaking ? (
                <Volume2 className="w-5 h-5 text-blue-500 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5 text-blue-500 animate-pulse" />
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            variant={conversation.status === 'connected' ? 'secondary' : 'default'}
            onClick={startConversation}
            disabled={conversation.status === 'connected'}
            className="w-40"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={stopConversation}
            disabled={conversation.status !== 'connected'}
            className="w-40"
          >
            <MicOff className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Conversation;
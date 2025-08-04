/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Mic, MicOff, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export function Conversation() {
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [messages, setMessages] = useState<{text: string, type: 'agent' | 'user'}[]>([]);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: any) => {
      console.log('Message:', message);
      if (message.type === 'agent_response' || message.type === 'transcript') {
        const messageType = message.type === 'agent_response' ? 'agent' : 'user';
        const messageText = message.text || message.transcript || '';
        
        if (messageText.trim()) {
          setMessages(prev => [...prev, { text: messageText, type: messageType }]);
        }
      }
    },
    onError: (error: any) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'rwYq3d2Qd3wOirs5rd9P',
      });
      // Clear previous messages when starting a new conversation
      setMessages([]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleVolumeChange = useCallback(
    async (value: number[]) => {
      const newVolume = value[0];
      setVolume(newVolume);
      if (conversation.status === 'connected') {
        await conversation.setVolume({ volume: newVolume });
      }
    },
    [conversation]
  );

  useEffect(() => {
    // Set initial volume when connected
    if (conversation.status === 'connected') {
      conversation.setVolume({ volume });
    }
  }, [conversation.status, conversation, volume]);

  const getStatusColor = () => {
    switch (conversation.status) {
      case 'connected':
        return 'bg-green-400';
      case 'connecting':
        return 'bg-amber-400';
      case 'disconnected':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 500 
      }
    }
  };

  return (
    <motion.div 
      className="w-full px-4 sm:px-6 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100">
          <CardTitle className="flex items-center justify-between text-lg md:text-xl">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Voice Assistant</span>
              <Badge variant="outline" className="text-xs font-normal m-1 capitalize bg-gray-50">
                {conversation.status}
              </Badge>
            </div>
            <div 
              className={`w-4 h-3 rounded-full  ${getStatusColor()} relative`}
              style={{
                boxShadow: `0 0 10px ${getStatusColor().replace('bg-', '')}`
              }}
            >
              <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{backgroundColor: 'inherit'}}></span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 pb-4 px-6">
          <div className="space-y-4">
            {conversation.status === 'connected' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Alert className="bg-blue-50/70 border-blue-200 backdrop-blur-sm">
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      {conversation.isSpeaking ? 'Assistant is speaking...' : 'Listening to you...'}
                    </span>
                    <AnimatePresence mode="wait">
                      {conversation.isSpeaking ? (
                        <motion.div
                          key="speaking"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Volume2 className="w-5 h-5 text-blue-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="listening"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          <Mic className="w-5 h-5 text-blue-500" />
                          <span className="absolute inset-0 rounded-full animate-ping opacity-50 bg-blue-200"></span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Conversation messages */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-2">
              <AnimatePresence initial={false}>
                {messages.length === 0 && conversation.status !== 'connected' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    className="text-center py-8 text-gray-500 italic text-sm"
                  >
                    Start a conversation to see messages here
                  </motion.div>
                )}

                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`p-3 rounded-xl max-w-[85%] ${
                      msg.type === 'agent' 
                        ? 'bg-blue-50 border border-blue-100 ml-auto' 
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 px-6 border-t border-gray-100">
          <div className="flex justify-center gap-3 w-full">
            <Button
              size="lg"
              variant={conversation.status === 'connected' ? 'secondary' : 'default'}
              onClick={startConversation}
              disabled={conversation.status === 'connected'}
              className="w-full sm:w-40 transition-all duration-300 ease-in-out"
            >
              <Mic className="w-4 h-4 mr-2" />
              <span>Start</span>
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={stopConversation}
              disabled={conversation.status !== 'connected'}
              className="w-full sm:w-40 transition-all duration-300 ease-in-out"
            >
              <MicOff className="w-4 h-4 mr-2" />
              <span>Stop</span>
            </Button>
          </div>

          <div className="w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVolumeControls(!showVolumeControls)}
              className="w-full flex items-center justify-center text-gray-500 text-xs"
            >
              <span>Volume Controls</span>
              {showVolumeControls ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
            </Button>
            
            <AnimatePresence>
              {showVolumeControls && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleVolumeChange([0])}
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleVolumeChange([1])}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default Conversation;
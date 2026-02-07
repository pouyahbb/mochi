import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatWindow } from '@/hooks/use-canvas';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/redux/slice/chat';
import { Loader2, RefreshCcw, Send, Trash2, X } from 'lucide-react';
import React from 'react'

type Props= {generatedUIId : string; isOpen : boolean; onClose: () => void}

const ChatWindow = ({generatedUIId , isOpen ,onClose} : Props) => {

    const {inputValue , setInputValue , scrollAreaRef, inputRef , handleSendMessage, handleKeyPress , handleClearChat,chatState}  = useChatWindow(generatedUIId , isOpen)


    if(!isOpen) return null

  return (
    <div className={cn(
      "fixed right-0 md:right-5 top-0 md:top-1/2 md:-translate-y-1/2 w-full md:w-96 h-full md:h-[600px] backdrop-blur-xl bg-white/8 border border-white/12 rounded-none md:rounded-lg z-50 transition-all duration-300 flex flex-col shadow-2xl",
      isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/12 shrink-0">
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-5 h-5 text-white/80" />
          <Label className="text-white/80 font-medium">Design Chat</Label>
        </div>
        <div className="flex items-center gap-1">
          {chatState?.messages && chatState.messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white/60 hover:bg-white/10 hover:text-white/80" 
              onClick={handleClearChat}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant="ghost"
            size="sm" 
            className="h-8 w-8 p-0 text-white/60 hover:bg-white/10 hover:text-white/80" 
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div ref={scrollAreaRef} className="p-4 space-y-3">
          {!chatState?.messages || chatState.messages.length === 0 ? (
            <div className="text-center text-white/60 py-12">
              <RefreshCcw className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium mb-1">
                Ask me to redesign this UI!
              </p>
              <p className="text-xs opacity-50">
                I can change colors, layouts, style, content and more.
              </p>
            </div>
          ) : (
            chatState.messages.map((message: ChatMessage) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] rounded-lg px-4 py-2.5 text-sm shadow-sm",
                  message.role === "user" 
                    ? "bg-blue-500 text-white" 
                    : "bg-white/10 text-white/90 border border-white/20"
                )}>
                  <div className="whitespace-pre-wrap wrap-break-word">
                    {message.content}
                  </div>
                  <div className={cn(
                    "text-xs mt-2 flex items-center gap-1.5",
                    message.role === "user" ? "text-blue-100" : "text-white/60"
                  )}>
                    {message.isStreaming && (
                      <Loader2 size={10} className="animate-spin" />
                    )}
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/12 shrink-0">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input 
              ref={inputRef} 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onKeyDown={handleKeyPress} 
              placeholder="Describe how you want to redesign this UI..." 
              disabled={chatState?.isStreaming} 
              className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-1 focus:ring-white/20" 
            />
            <Button 
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 disabled:opacity-50"
              disabled={chatState?.isStreaming || !inputValue.trim()}
              onClick={handleSendMessage}
            >
              {chatState?.isStreaming ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
          <div className="text-xs text-white/50 text-center">
            Type your redesign request and press Enter
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow 
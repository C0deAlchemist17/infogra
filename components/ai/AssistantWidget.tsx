'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { useAIAssistant } from '@/providers/AIAssistantProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Send, Sparkles, Trash2, Keyboard } from 'lucide-react'

const RobotMascot = dynamic(() => import('./RobotMascot'), {
  ssr: false,
  loading: () => (
    <div className="w-[100px] h-[100px] bg-accent-primary/20 rounded-full animate-pulse" />
  )
})

export default function AssistantWidget() {
  const { isOpen, setIsOpen, isTyping, messages, suggestions, sendMessage, clearChat } = useAIAssistant()
  const [isHovered, setIsHovered] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Show tooltip periodically when not opened, stop after first open
  useEffect(() => {
    if (isOpen) return
    // Check if user has already opened the assistant before
    const hasOpened = localStorage.getItem('infogra-assistant-opened')
    if (hasOpened) return

    let showCount = 0
    let tooltipVisible = false
    let mounted = true

    const intervalId = setInterval(() => {
      if (!mounted || showCount >= 3) {
        clearInterval(intervalId)
        return
      }
      if (!tooltipVisible) {
        setShowTooltip(true)
        tooltipVisible = true
        showCount++
        // Auto-hide after 3 seconds
        setTimeout(() => {
          if (mounted) {
            setShowTooltip(false)
            tooltipVisible = false
          }
        }, 3000)
      }
    }, 10000)

    // Show first tooltip after 5 seconds
    const initialTimeout = setTimeout(() => {
      if (mounted && showCount === 0) {
        setShowTooltip(true)
        tooltipVisible = true
        showCount++
        setTimeout(() => {
          if (mounted) {
            setShowTooltip(false)
            tooltipVisible = false
          }
        }, 4000)
      }
    }, 5000)

    return () => {
      mounted = false
      clearInterval(intervalId)
      clearTimeout(initialTimeout)
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const panel = panelRef.current
    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) return

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    panel.addEventListener('keydown', handleTab)
    return () => panel.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Return focus to trigger on close
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [isOpen])

  // Listen for custom event to toggle from other components
  useEffect(() => {
    const handleToggle = () => setIsOpen(!isOpen)
    window.addEventListener('toggle-ai-assistant', handleToggle as EventListener)
    return () => window.removeEventListener('toggle-ai-assistant', handleToggle as EventListener)
  }, [setIsOpen, isOpen])

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleNavigation = (href: string) => {
    window.location.href = href
  }

  return (
    <>
      {/* Floating Assistant Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 1 }}
      >
        <div className="relative">
          {/* Keyboard shortcut tooltip */}
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 glass-dark rounded-xl shadow-lg whitespace-nowrap"
              >                  <div className="flex items-center gap-2 text-small text-white/70">
                  <Keyboard className="w-4 h-4 text-white/70" />
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-caption font-mono text-white">Ctrl+/</kbd> to toggle</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 glass-dark border-r border-b border-white/10 transform rotate-45 -mt-1" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            ref={triggerRef}
            onClick={() => {
              setIsOpen(!isOpen)
              if (!isOpen) {
                localStorage.setItem('infogra-assistant-opened', 'true')
                setShowTooltip(false)
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI Assistant"
            aria-expanded={isOpen}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-accent-primary/30 blur-xl"
              animate={{
                scale: isHovered ? 1.3 : 1,
                opacity: isHovered ? 0.8 : 0.4
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Robot mascot */}
            <div className="relative w-[120px] h-[120px]">
              <RobotMascot isHovered={isHovered} isActive={isOpen} size={120} />
            </div>

            {/* Notification dot */}
            {!isOpen && messages.length === 0 && (
              <motion.div
                className="absolute top-2 right-2 w-4 h-4 bg-accent-success rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Conversation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-28 left-6 z-50 w-[400px] max-w-[calc(100vw-48px)]"
          >
            <Card className="glass-dark shadow-2xl overflow-hidden" role="dialog" aria-label="AI Assistant Chat">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent-primary to-accent-secondary border-b border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-body font-semibold text-white">INFOGRA Assistant</h3>
                      <p className="text-caption text-white/70">AI-Powered Helper</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearChat}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      title="Clear chat"
                    >
                      <Trash2 className="w-4 h-4 text-white/60" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      aria-label="Close assistant"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-5 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-5 ${
                        message.role === 'user'
                          ? 'bg-accent-primary text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {/* Markdown rendered content */}
                      <div className="text-body prose prose-sm max-w-none [&_*]:text-inherit prose-headings:text-white prose-p:text-white prose-strong:text-white prose-li:text-white prose-a:text-accent-highlight">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>

                      {/* Product suggestions */}
                      {message.products && message.products.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {message.products.map((product) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors"
                              onClick={() => handleNavigation(`/store/product/${product.slug}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/10 rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-small font-medium text-white truncate">{product.name}</p>
                                  <p className="text-accent-primary font-semibold">EGP {product.price.toLocaleString()}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Service suggestions */}
                      {message.services && message.services.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {message.services.map((service) => (
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors"
                              onClick={() => handleNavigation(service.href)}
                            >
                              <p className="text-small font-medium text-white">{service.name}</p>
                              <p className="text-caption text-white/70">{service.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Navigation actions */}
                      {message.navigation && message.navigation.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.navigation.map((nav, i) => (
                            <button
                              key={i}
                              onClick={() => handleNavigation(nav.href)}
                              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-small text-white transition-colors"
                            >
                              {nav.label} →
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div                    className="bg-white/5 rounded-2xl p-5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-accent-primary rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-accent-primary rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-accent-primary rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-small text-white/60">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="px-5 py-3 border-t border-white/10 overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full text-small text-white/80 hover:text-white transition-all whitespace-nowrap"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-5 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-body text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

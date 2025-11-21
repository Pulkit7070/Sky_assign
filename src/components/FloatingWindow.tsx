import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TransparentInput } from './TransparentInput';
import { ChatMessage } from './ChatMessage';
import { AttachmentModal } from './AttachmentModal';
import { SettingsModal } from './SettingsModal';
import { CalendarConfirmModal } from './CalendarConfirmModal';
import { ImagePreviewModal } from './ImagePreviewModal';
import { EnhancedMessage } from './EnhancedMessage';
import { NLPParser, ParsedEvent } from '../services/nlp-parser';
import { sendMessageToGemini, isGeminiAvailable } from '../services/gemini-service';

export const FloatingWindow: React.FC = () => {
  const {
    getCurrentConversation,
    addConversation,
    addMessage,
    updateMessage,
    currentConversationId,
    windowMode,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [currentPairIndex, setCurrentPairIndex] = React.useState(0);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = React.useState(false);
  const [parsedCalendarEvent, setParsedCalendarEvent] = React.useState<ParsedEvent | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = React.useState(false);
  const [isCalendarInitialized, setIsCalendarInitialized] = React.useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = React.useState(false);
  const [showImageActions, setShowImageActions] = React.useState(false);
  const [selectedImageAction, setSelectedImageAction] = React.useState<string | null>(null);
  const currentConversation = getCurrentConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (!window.electronAPI?.onRefresh) return;
    
    return window.electronAPI.onRefresh(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        addConversation();
        setTimeout(() => setIsRefreshing(false), 300);
      }, 200);
    });
  }, [addConversation]);

  // Initialize Google Calendar on mount
  useEffect(() => {
    const initCalendar = async () => {
      try {
        if (!window.electronAPI?.calendar) {
          // Still enable detection to allow fallback
          setIsCalendarInitialized(true);
          return;
        }
        
        const result = await window.electronAPI.calendar.initialize();
        
        if (result.success) {
          setIsCalendarInitialized(true);
        } else {
          // Enable detection anyway - auth will happen on first create
          setIsCalendarInitialized(true);
        }
      } catch (error) {
        // Still enable detection
        setIsCalendarInitialized(true);
      }
    };
    
    initCalendar();

    // Listen for auth success
    const handleAuthSuccess = () => {
      addMessage(currentConversationId || '', {
        role: 'assistant',
        content: 'Successfully connected to Google Calendar. You can now create events.',
        status: 'sent',
      });
      
      // Retry creating the event if we have a parsed event
      if (parsedCalendarEvent && isCalendarModalOpen) {
        handleCalendarConfirm();
      }
    };

    const handleAuthError = (error: any) => {
      addMessage(currentConversationId || '', {
        role: 'assistant',
        content: `Authentication failed: ${error.message || 'Unknown error'}`,
        status: 'sent',
      });
    };

    // Add event listeners if available
    if (window.electronAPI?.onCalendarAuthSuccess) {
      const unsubSuccess = window.electronAPI.onCalendarAuthSuccess(handleAuthSuccess);
      const unsubError = window.electronAPI.onCalendarAuthError?.(handleAuthError);
      
      return () => {
        unsubSuccess?.();
        unsubError?.();
      };
    }
  }, [parsedCalendarEvent, isCalendarModalOpen]);

  const handleFileAttach = (file: File) => {
    setAttachedFile(file);
    setSelectedImageAction(null);
    setShowImageActions(false);
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
    setIsAttachmentModalOpen(false);
  };

  const handleCalendarConfirm = async () => {
    if (!parsedCalendarEvent) {
      return;
    }

    setIsCreatingEvent(true);

    try {
      // Check authentication
      const authCheck = await window.electronAPI.calendar.checkAuth();
      
      if (!authCheck.authenticated) {
        // Need to authenticate first
        const authResult = await window.electronAPI.calendar.authenticate();
        
        if (!authResult.success) {
          throw new Error(authResult.error || 'Authentication failed');
        }

        // Show message to user about authentication
        addMessage(currentConversationId!, {
          role: 'assistant',
          content: 'Authentication window opened. Please complete the login and try creating the event again.',
          status: 'sent',
        });

        setIsCalendarModalOpen(false);
        setIsCreatingEvent(false);
        return;
      }

      // Create the event
      const result = await window.electronAPI.calendar.createEvent({
        summary: parsedCalendarEvent.title,
        startDateTime: parsedCalendarEvent.startDateTime.toISOString(),
        endDateTime: parsedCalendarEvent.endDateTime.toISOString(),
      });

      if (result.success) {
        // Success message with enhanced calendar display
        const startDate = parsedCalendarEvent.startDateTime.toLocaleDateString();
        const startTime = parsedCalendarEvent.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = parsedCalendarEvent.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        addMessage(currentConversationId!, {
          role: 'assistant',
          content: result.eventLink ? `[View in Google Calendar](${result.eventLink})` : 'Event created successfully',
          status: 'sent',
          messageType: 'calendar',
          calendarEvent: {
            title: parsedCalendarEvent.title,
            location: parsedCalendarEvent.location,
            startDate,
            startTime,
            endTime,
            invitees: [],
          },
        } as any);
      } else {
        throw new Error(result.error || 'Failed to create event');
      }
    } catch (error: any) {
      // Error message
      addMessage(currentConversationId!, {
        role: 'assistant',
        content: `Failed to create event: ${error.message}`,
        status: 'sent',
      });
    } finally {
      setIsCalendarModalOpen(false);
      setIsCreatingEvent(false);
      setParsedCalendarEvent(null);
    }
  };

  const handleCalendarCancel = () => {
    setIsCalendarModalOpen(false);
    setParsedCalendarEvent(null);
    
    // Restore compact window size
    if (window.electronAPI?.requestResize && windowMode === 'compact') {
      setTimeout(() => {
        window.electronAPI.requestResize({ 
          width: 650, 
          height: 120, 
          anchor: 'bottom' 
        });
      }, 300); // Small delay to let modal close animation complete
    }
  };

  const handleActionSelect = (optionId: string) => {
    console.log('Action selected:', optionId);
    
    const actionLabels = {
      describe: 'Describe this image',
      extract: 'Extract text from image',
      analyze: 'Analyze image content'
    };
    
    // Set the selected action and trigger sending with the action label as content
    setSelectedImageAction(optionId);
    handleSendMessage(actionLabels[optionId as keyof typeof actionLabels] || 'Process image');
  };

  const handleSendMessage = async (content: string) => {
    let conversationId = currentConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = addConversation();
    }

    // PRIORITY 0: Check if image is attached - show action options
    if (attachedFile && attachedFile.type.startsWith('image/')) {
      // If no action selected yet, show action tabs
      if (!selectedImageAction) {
        // Add user message with image
        addMessage(conversationId, {
          role: 'user',
          content: content || 'Image attached',
          status: 'sent',
        });

        // Add action options message
        addMessage(conversationId, {
          role: 'assistant',
          content: 'Image uploaded successfully! What would you like me to do with this image?',
          status: 'sent',
          messageType: 'action',
          actionOptions: [
            {
              id: 'describe',
              label: 'Describe this image',
              description: 'Get a detailed description of what\'s in the image'
            },
            {
              id: 'extract',
              label: 'Extract text from image',
              description: 'Read and extract any text visible in the image'
            },
            {
              id: 'analyze',
              label: 'Analyze image content',
              description: 'Analyze objects, colors, and composition'
            }
          ]
        });
        
        setShowImageActions(true);
        return;
      }

      // Action selected - process accordingly
      const processingLabels = {
        describe: 'Describing image...',
        extract: 'Extracting text from image...',
        analyze: 'Analyzing image content...'
      };

      // Add user's selected action as a message (content already contains the action label)
      addMessage(conversationId, {
        role: 'user',
        content: content,
        status: 'sent',
      });

      // Add loading message
      addMessage(conversationId, {
        role: 'assistant',
        content: processingLabels[selectedImageAction as keyof typeof processingLabels] || 'Processing...',
        status: 'sending',
      } as any);

      const messages = getCurrentConversation()?.messages || [];
      const loadingMessage = messages[messages.length - 1];
      const loadingMessageId = loadingMessage?.id;

      // Simulate processing and provide response
      setTimeout(() => {
        const responses = {
          describe: `Based on the uploaded image "${attachedFile.name}":\n\nThis appears to be an image file (${attachedFile.type}). \n\n*Note: Full image analysis requires Vision API integration. This is a placeholder response based on your selected action.*`,
          extract: `Analyzing "${attachedFile.name}" for text content...\n\n*Note: OCR and text extraction require Vision API integration. This is a placeholder response.*`,
          analyze: `Image Analysis for "${attachedFile.name}":\n\nFile type: ${attachedFile.type}\nFile size: ${(attachedFile.size / 1024).toFixed(2)} KB\n\n*Note: Detailed image analysis requires Vision API integration. This is a placeholder response.*`
        };

        updateMessage(conversationId, loadingMessageId, {
          content: responses[selectedImageAction as keyof typeof responses] || 'Processing complete.',
          status: 'sent',
        });

        // Clear attachment and action state
        setAttachedFile(null);
        setSelectedImageAction(null);
        setShowImageActions(false);
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
          setImagePreviewUrl(null);
        }
      }, 1500);
      
      return;
    }

    // PRIORITY 1: Check if message is a location/places intent (check BEFORE calendar and Gemini)
    const isLocationMessage = NLPParser.isLocationIntent(content);
    
    if (isLocationMessage && window.electronAPI?.places) {
      const locationQuery = NLPParser.parseLocationQuery(content);
      
      if (locationQuery.isValid) {
        // Add user message
        addMessage(conversationId, {
          role: 'user',
          content,
          status: 'sent',
        });

        // Add loading message
        addMessage(conversationId, {
          role: 'assistant',
          content: 'Searching for nearby places...',
          status: 'sending',
        } as any);

        const messages = getCurrentConversation()?.messages || [];
        const loadingMessage = messages[messages.length - 1];
        const loadingMessageId = loadingMessage?.id;

        try {
          let placesResult;
          
          if (locationQuery.type === 'nearby' && locationQuery.useCurrentLocation) {
            // Get current location - try browser geolocation first, then IP fallback
            let location: { lat: number; lng: number } | null = null;
            
            try {
              // Try browser geolocation first (will fail in Electron without proper setup)
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                  resolve,
                  reject,
                  {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000 // 5 minutes cache
                  }
                );
              });

              location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
            } catch (geoError: any) {
              // Fallback to IP-based geolocation (free, no API key)
              const ipLocation = await window.electronAPI.places.getLocationFromIP();
              
              if (ipLocation.success && ipLocation.location) {
                location = {
                  lat: ipLocation.location.lat,
                  lng: ipLocation.location.lng,
                };
                
                // Update loading message to show we're using approximate location
                updateMessage(conversationId, loadingMessageId, {
                  content: `Using approximate location (${ipLocation.location.city}, ${ipLocation.location.country})...\nSearching for nearby places...`,
                  status: 'sending',
                });
              } else {
                // Both methods failed
                updateMessage(conversationId, loadingMessageId, {
                  content: `Unable to determine your location.\n\n` +
                    `**Try searching with a specific location instead:**\n` +
                    `For example: "Find restaurants in New York" or "Coffee shops in Delhi"`,
                  status: 'sent',
                });
                return;
              }
            }

            if (location) {
              placesResult = await window.electronAPI.places.searchNearby({
                location,
                radius: 5000, // 5km default
                type: locationQuery.placeType,
                keyword: locationQuery.keyword,
              });
            }
          } else if (locationQuery.type === 'text') {
            // Text search with location name
            placesResult = await window.electronAPI.places.searchText({
              query: locationQuery.location 
                ? `${locationQuery.keyword || locationQuery.placeType} in ${locationQuery.location}`
                : content,
            });
          }

          if (placesResult?.success && placesResult.results && placesResult.results.length > 0) {
            // Format OSM results for enhanced display
            const mapPlaces = placesResult.results.slice(0, 5).map((place: any) => ({
              name: place.name,
              description: place.address || place.type || '',
              rating: place.rating || 4.0 + Math.random(), // OSM doesn't provide ratings, use placeholder
              distance: place.distance ? `${Math.round(place.distance / 1000)}km away` : undefined,
            }));

            updateMessage(conversationId, loadingMessageId, {
              content: `I found ${placesResult.results.length} places nearby:`,
              status: 'sent',
              messageType: 'maps',
              mapPlaces,
            } as any);
          } else {
            updateMessage(conversationId, loadingMessageId, {
              content: placesResult?.error || 'No places found matching your criteria.',
              status: 'sent',
            });
          }
        } catch (error: any) {
          updateMessage(conversationId, loadingMessageId, {
            content: error.message === 'User denied Geolocation'
              ? 'Location access denied. Please enable location permissions to search nearby places.'
              : `Failed to search places: ${error.message}`,
            status: 'error',
          });
        }
        
        return;
      }
    }

    // PRIORITY 2: Check if message is a calendar intent
    const isCalendarMessage = NLPParser.isCalendarIntent(content);
    
    if (isCalendarInitialized && isCalendarMessage) {
      const parsedEvent = NLPParser.parseEventFromText(content);
      
      if (parsedEvent.isValid) {
        
        // Add user message
        addMessage(conversationId, {
          role: 'user',
          content,
          status: 'sent',
        });

        // Resize window BEFORE showing modal to prevent positioning issues
        if (window.electronAPI?.requestResize) {
          await window.electronAPI.requestResize({ 
            width: 650, 
            height: 720, 
            anchor: 'center' 
          });
        }

        // Show calendar confirmation modal after resize
        setParsedCalendarEvent(parsedEvent);
        setIsCalendarModalOpen(true);
        return;
      }
    }

    // PRIORITY 3: Send to Gemini (if not location or calendar)
    // Store file reference before clearing
    const fileToProcess = attachedFile;

    // Add user message with attachment info if present
    let messageContent = content;
    if (fileToProcess) {
      const fileType = fileToProcess.type.startsWith('image/') ? 'Image' : 'PDF';
      messageContent = `${fileType}: ${fileToProcess.name}\n\n${content}`;
    }

    addMessage(conversationId, {
      role: 'user',
      content: messageContent,
      status: 'sent',
    });

    // Clear attachment
    setAttachedFile(null);

    // Get AI response using Gemini
    const getAIResponse = async () => {
      let response = '';
      
      if (fileToProcess) {
        const fileType = fileToProcess.type;
        if (fileType.startsWith('image/')) {
          response = `I can see you've attached an image (${fileToProcess.name}). While I can't process images yet, I can help you with text-based questions about it.`;
        } else if (fileType === 'application/pdf') {
          response = `I've received your PDF (${fileToProcess.name}). I can't read PDFs yet, but I can help answer questions about documents in general.`;
        }
        
        addMessage(conversationId!, {
          role: 'assistant',
          content: response,
          status: 'sent',
        });
      } else {
        // Add placeholder assistant message
        addMessage(conversationId!, {
          role: 'assistant',
          content: 'Thinking...',
          status: 'sending',
        } as any);

        // Get the actual ID of the just-added message
        const messages = getCurrentConversation()?.messages || [];
        const placeholderMessage = messages[messages.length - 1];
        const placeholderId = placeholderMessage?.id;

        // Check if Gemini is available
        if (!isGeminiAvailable()) {
          updateMessage(conversationId!, placeholderId, {
            content: 'Gemini API is not configured. Please add your GEMINI_API_KEY to the .env file.',
            status: 'error',
          });
          return;
        }

        try {
          // Get conversation history for context (last 6 messages)
          const currentMessages = getCurrentConversation()?.messages || [];
          const history = currentMessages.slice(-6).map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          }));

          // Call Gemini API
          const geminiResponse = await sendMessageToGemini(content, history);
          
          if (geminiResponse.error) {
            updateMessage(conversationId!, placeholderId, {
              content: `Error: ${geminiResponse.error}`,
              status: 'error',
            });
            return;
          }

          if (!geminiResponse.text || geminiResponse.text.trim() === '') {
            updateMessage(conversationId!, placeholderId, {
              content: 'Received an empty response from the AI. Please try again.',
              status: 'error',
            });
            return;
          }

          // Success - update placeholder with actual response
          updateMessage(conversationId!, placeholderId, {
            content: geminiResponse.text,
            status: 'sent',
          });
        } catch (error: any) {
          updateMessage(conversationId!, placeholderId, {
            content: `Failed to get AI response: ${error.message || 'Unknown error'}`,
            status: 'error',
          });
        }
      }
    };

    // Execute async function
    getAIResponse();
  };

  const handleExpand = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.toggleWindowMode('expanded');
      } catch (error) {
        console.error('Failed to toggle window mode:', error);
      }
    }
  };

  const messages = currentConversation?.messages || [];
  const isEmpty = messages.length === 0;
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Group messages into user-assistant pairs
  const messagePairs = React.useMemo(() => {
    const pairs: any[][] = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        const pair = [messages[i]];
        if (messages[i + 1] && messages[i + 1].role === 'assistant') {
          pair.push(messages[i + 1]);
          i++; // Skip the assistant message in next iteration
        }
        pairs.push(pair);
      }
    }
    return pairs;
  }, [messages]);

  // Reset to last pair when new messages arrive
  useEffect(() => {
    if (messagePairs.length > 0) {
      setCurrentPairIndex(messagePairs.length - 1);
    }
  }, [messagePairs.length]);

  const currentPair = messagePairs[currentPairIndex] || [];
  const canScrollPrev = currentPairIndex > 0;
  const canScrollNext = currentPairIndex < messagePairs.length - 1;

  const handlePrevPair = () => {
    if (canScrollPrev) {
      setCurrentPairIndex(prev => prev - 1);
    }
  };

  const handleNextPair = () => {
    if (canScrollNext) {
      setCurrentPairIndex(prev => prev + 1);
    }
  };

  // Handle mouse wheel scroll for navigation (only when not scrolling content)
  const handleWheel = (e: React.WheelEvent) => {
    // Disable scrolling when modals are open
    if (isAttachmentModalOpen || isSettingsModalOpen) {
      e.preventDefault();
      return;
    }

    if (messagePairs.length <= 1) return;
    
    // Check if the wheel event is from the scrollable content area
    const target = e.target as HTMLElement;
    const scrollableContainer = messagesContainerRef.current?.parentElement;
    
    if (scrollableContainer && scrollableContainer.contains(target)) {
      // If scrolling inside content area, check if we're at scroll boundaries
      const atTop = scrollableContainer.scrollTop === 0;
      const atBottom = scrollableContainer.scrollTop + scrollableContainer.clientHeight >= scrollableContainer.scrollHeight - 1;
      
      // Only navigate if at boundaries
      if ((e.deltaY < 0 && atTop && canScrollPrev) || (e.deltaY > 0 && atBottom && canScrollNext)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          handleNextPair();
        } else {
          handlePrevPair();
        }
      }
    } else {
      // Scrolling outside content area - navigate between pairs
      e.preventDefault();
      if (e.deltaY > 0 && canScrollNext) {
        handleNextPair();
      } else if (e.deltaY < 0 && canScrollPrev) {
        handlePrevPair();
      }
    }
  };

  // Calculate dynamic height based on actual content of current pair
  useEffect(() => {
    // When modals are open, expand window to accommodate them
    if (isCalendarModalOpen || isSettingsModalOpen || isAttachmentModalOpen) {
      if (window.electronAPI?.requestResize && windowMode === 'compact') {
        window.electronAPI.requestResize({ width: 650, height: 450, anchor: 'bottom' });
      }
      return;
    }
    
    if (!window.electronAPI?.requestResize || windowMode !== 'compact') return;
    
    const baseHeight = 120; // Height for input bar
    const imagePreviewHeight = 0; // No extra height for image preview
    const maxWindowHeight = 700; // Maximum total window height
    const maxMessageHeight = 600; // Maximum height for messages
    
    // Use timeout to ensure content is fully rendered and measured
    const timer = setTimeout(() => {
      let messageHeight = 0;
      
      if (currentPair.length > 0 && messagesContainerRef.current) {
        // Get actual scrollHeight of messages container
        const actualHeight = messagesContainerRef.current.scrollHeight;
        // Cap message height - if content is taller, user will scroll within the container
        messageHeight = Math.min(actualHeight + 40, maxMessageHeight);
      }
      
      const totalHeight = Math.min(baseHeight + messageHeight + imagePreviewHeight, maxWindowHeight);
      
      window.electronAPI.requestResize({ width: 650, height: totalHeight, anchor: 'bottom' });
    }, 100); // Small delay to ensure content is rendered
    
    return () => clearTimeout(timer);
  }, [currentPair, currentPairIndex, windowMode, isCalendarModalOpen, isSettingsModalOpen, isAttachmentModalOpen, attachedFile, showImageActions]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle wheel for navigation between pairs
  const handleWheelNavigation = (e: React.WheelEvent) => {
    // Prevent scrolling when any modal is open
    if (isCalendarModalOpen || isSettingsModalOpen || isAttachmentModalOpen) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (messagePairs.length <= 1) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    // Check if we're at scroll boundaries
    const atTop = scrollContainer.scrollTop <= 1;
    const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1;
    const hasScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
    
    // Only navigate if no scroll or at boundaries
    if (!hasScroll || (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      if (e.deltaY > 0 && canScrollNext) {
        handleNextPair();
      } else if (e.deltaY < 0 && canScrollPrev) {
        handlePrevPair();
      }
    }
  };

  return (
    <>
      <motion.div
        key={currentConversationId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="h-full flex flex-col pb-6 px-6 bg-transparent"
        style={{ 
          WebkitAppRegion: (isCalendarModalOpen || isSettingsModalOpen || isAttachmentModalOpen) ? 'no-drag' : 'drag',
          pointerEvents: (isCalendarModalOpen || isSettingsModalOpen || isAttachmentModalOpen) ? 'none' : 'auto'
        } as any}
        onWheel={handleWheelNavigation}
      >
      
      {/* Messages Container - shows current pair with navigation */}
      {!isEmpty && currentPair.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 max-w-full relative flex-1 flex flex-col min-h-0"
        >
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            style={{ 
              WebkitAppRegion: 'no-drag',
              overflow: (isCalendarModalOpen || isSettingsModalOpen || isAttachmentModalOpen) ? 'hidden' : 'auto'
            } as any}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPairIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div ref={messagesContainerRef} className="space-y-3 px-2">
                  {currentPair.map((message: any) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      onActionSelect={handleActionSelect}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Bottom Bar with Logo, Input, and Actions - with draggable wrapper */}
      <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'drag' } as any}>
        {/* Brand Section - Clickable to expand */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={handleExpand}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Click to expand"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          {/* Globe Logo */}
          <div className="relative w-7 h-7 rounded-full theme-logo shadow-lg flex items-center justify-center">
            <div className="absolute inset-0 rounded-full theme-logo-border" 
                 style={{ 
                   clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                   transform: 'rotate(-45deg)'
                 }}
            />
          </div>
          {/* Brand Name */}
          <span className="text-xl font-light tracking-wider theme-text" style={{ letterSpacing: '1.5px' }}>
            SKY
          </span>
        </motion.div>

        {/* Input Field - Inline with logo */}
        <div style={{ WebkitAppRegion: 'no-drag' } as any} className="flex-1 relative">
          <TransparentInput onSend={handleSendMessage} autoFocus={windowMode === 'compact'} />
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-5 left-0 right-0 text-center"
            >
              
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAttachmentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full theme-button backdrop-blur-sm text-xs font-medium shadow-sm hover:shadow-md transition-all"
          >
            {attachedFile && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"
              />
            )}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Attach
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              // Resize window BEFORE opening modal to ensure it fits
              if (window.electronAPI?.requestResize) {
                await window.electronAPI.requestResize({ 
                  width: 650, 
                  height: 500, 
                  anchor: 'center' 
                });
                // Small delay to ensure resize completes
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              setIsSettingsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full theme-button backdrop-blur-sm text-xs font-medium shadow-sm hover:shadow-md transition-all"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addConversation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full theme-button backdrop-blur-sm text-xs font-medium shadow-sm hover:shadow-md transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </motion.button>
        </div>
      </div>
      </motion.div>

      {/* Modals - Rendered outside draggable container */}
      <AttachmentModal 
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onAttach={handleFileAttach}
      />
      
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        imageUrl={imagePreviewUrl}
        fileName={attachedFile?.name || ''}
        fileSize={attachedFile?.size || 0}
        onClose={() => setIsImagePreviewOpen(false)}
        onRemove={() => {
          setAttachedFile(null);
          if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
          }
          setIsImagePreviewOpen(false);
        }}
      />
      
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <CalendarConfirmModal 
        isOpen={isCalendarModalOpen}
        parsedEvent={parsedCalendarEvent}
        onConfirm={handleCalendarConfirm}
        onCancel={handleCalendarCancel}
        isCreating={isCreatingEvent}
      />
    </>
  );
};

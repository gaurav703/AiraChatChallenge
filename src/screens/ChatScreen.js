import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
  Animated,
  Alert,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getAIResponse } from '../constants/getAIResponse';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm AiRA, your intelligent assistant. I'm here to help you with anything you need. What would you like to talk about today?",
      isUser: false,
      timestamp: new Date(),
      memory: null,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const { logout } = useAuth();
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const [showBasicHeader, setShowBasicHeader] = useState(false);



  useEffect(() => {
    // Animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);



  const simulateStreaming = (response, onProgress, onComplete) => {
    const characters = response.text.split('');
    let currentText = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < characters.length) {
        currentText += characters[index];
        onProgress(currentText);
        index++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 30);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    if (messages.length === 1) {
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowBasicHeader(true); // show small header after fade-out
      });
    }



    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Get AI response
    const aiResponse = getAIResponse(inputText);

    // Add AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
      memory: aiResponse.memory,
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate streaming response with slight delay
    setTimeout(() => {
      simulateStreaming(
        aiResponse,
        (streamedText) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: streamedText }
                : msg
            )
          );
        },
        () => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setIsTyping(false);

          // Scroll to bottom after completion
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      );
    }, 800);
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }) => (
    <Animated.View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="sparkles" size={20} color="#007AFF" />
          </View>
        </View>
      )}

      <View style={styles.messageContent}>
        {!item.isUser && (
          <Text style={styles.senderName}>AiRA</Text>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {item.text}
          </Text>

          {item.memory && !item.isStreaming && (
            <View style={styles.memoryTag}>
              <Ionicons name="bookmark" size={12} color="#007AFF" />
              <Text style={styles.memoryTagText}>Memory saved</Text>
            </View>
          )}
        </View>

        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {formatTime(item.timestamp)}
          </Text>
          {item.isUser && (
            <Ionicons
              name="checkmark-done"
              size={14}
              color="#007AFF"
              style={styles.readIndicator}
            />
          )}
        </View>

        {item.isStreaming && (
          <View style={styles.typingContainer}>
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, { backgroundColor: '#007AFF' }]} />
              <View style={[styles.typingDot, { backgroundColor: '#007AFF' }]} />
              <View style={[styles.typingDot, { backgroundColor: '#007AFF' }]} />
            </View>
            <Text style={styles.typingText}>AiRA is typing...</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const ListHeader = () => (
    <Animated.View style={{ opacity: headerOpacity }}>
      <View style={styles.welcomeHeader}>
        <Animated.View
          style={[
            styles.welcomeAvatar,
            { transform: [{ scale: fadeAnim }] }
          ]}
        >
          <Ionicons name="sparkles" size={40} color="#007AFF" />
        </Animated.View>
        <Text style={styles.welcomeTitle}>Welcome to AiRA</Text>
        <Text style={styles.welcomeSubtitle}>
          Your intelligent assistant with memory. I learn from our conversations to provide you with personalized help.
        </Text>
        <View style={styles.welcomeFeatures}>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={16} color="#34C759" />
            <Text style={styles.featureText}>Smart Responses</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="bookmark" size={16} color="#007AFF" />
            <Text style={styles.featureText}>Memory Aware</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="lock-closed" size={16} color="#FF9500" />
            <Text style={styles.featureText}>Private & Secure</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const handleReload = () => {
    Alert.alert(
      'Reload Chat',
      'Do you want to clear the chat and start fresh?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: () => setMessages([
            {
              id: '1',
              text: "Hello! I'm AiRA, your intelligent assistant. How can I help you today?",
              isUser: false,
              timestamp: new Date(),
              memory: null,
            }
          ])
        }
      ]
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={24} color="#007AFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AiRA</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? 'Typing...' : 'Online • Ready to help'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={messages.length === 1 ? ListHeader : null}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="add-circle-outline" size={24} color="#666" />
            </TouchableOpacity>

            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message AiRA..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              onFocus={handleInputFocus}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />

            {inputText.trim() ? (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={isTyping}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic-outline" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputFooter}>
            <Text style={styles.inputHint}>
              💡 AiRA remembers conversations and provides personalized responses
            </Text>
            <Text style={styles.charCount}>
              {inputText.length}/1000
            </Text>
          </View>
        </View>


        {/* Overlay for logout menu */}
        {showLogoutMenu && (
          <TouchableWithoutFeedback onPress={() => setShowLogoutMenu(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  headerActions: {
    position: 'relative',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  logoutMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1001,
    minWidth: 120,
  },
  logoutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reloadButton: {
    padding: 8,
    borderRadius: 8,
  },
  logoutMenuText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingVertical: 20
  },
  welcomeHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  welcomeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  welcomeFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginLeft: 6,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageContent: {
    flex: 1,
    maxWidth: '80%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    marginLeft: 12,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#1a1a1a',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 12,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  readIndicator: {
    marginLeft: 6,
  },
  memoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  memoryTagText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 12,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  attachmentButton: {
    padding: 4,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    maxHeight: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  charCount: {
    fontSize: 11,
    color: '#ccc',
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
});

export default ChatScreen;
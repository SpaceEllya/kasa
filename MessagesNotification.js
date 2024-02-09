import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';

const MessagesNotification = ({ isVisible, onClose, users, onUserSelect, onSendMessage, notifications }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef();
  const [unreadCount, setUnreadCount] = useState(0);

  

  useEffect(() => {
    // Scroll to bottom when messages are updated
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') {
      return;
    }

    const newMessage = {
      _id: messages.length + 1,
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 }, // Замените на реальный идентификатор пользователя
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    onSendMessage(newMessage.text);

    // Очистка поля ввода после отправки сообщения
    setInputMessage('');
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
  };

  const handleKeyPress = (e) => {
    // Проверка, что нажата клавиша Enter без Shift
    if (e.nativeEvent.key === 'Enter' && !e.shiftKey) {
      // Отправка сообщения и предотвращение перевода строки в поле ввода
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.notificationContent}>
          <View style={styles.centeredContainer}>
            <Text style={styles.notificationHeaderText}>New Messages</Text>
          </View>
          <ScrollView
            style={styles.messageContainer}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
            {messages.map((message) => (
              <View key={message._id} style={styles.messageItem}>
                <View style={styles.messageRow}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.senderName}>
                      {message.user._id === 1 ? 'You' : 'Sender'}
                      <View style={styles.rightContainer}>
                        <Text style={styles.timestampText}>
                          {formatMessageTimestamp(message.createdAt)}
                        </Text>
                      </View>
                    </Text>
                    <Text style={styles.messageText}>{message.text}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMessage(message._id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.divider} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.centeredContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Type your message here..."
              value={inputMessage}
              onChangeText={(text) => setInputMessage(text)}
              multiline
              onKeyPress={handleKeyPress}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <Text style={styles.sendMessageButton}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.notificationCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  notificationContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '40%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1,
    width: '100%',
  },
  messageItem: {
    marginBottom: 10,
    width: '100%',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  rightContainer: {
    flex: 0,
    alignSelf: 'flex-end',
    marginRight: 5,
    marginLeft: 5,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    maxHeight: '90%',
  },
  timestampText: {
    fontSize: 12,
    color: '#777',
    width: 100,
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  inputField: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
    minWidth: 500,
    minHeight: 100,
    textAlignVertical: 'center',
  },
  sendMessageButton: {
    backgroundColor: '#FA8E4D',
    color: '#fff',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    textAlign: 'center',
  },
  notificationCloseButton: {
    color: 'blue',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#C40000',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default MessagesNotification;

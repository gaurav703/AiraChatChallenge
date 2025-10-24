import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MemoryScreen = () => {
  const { logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutPress = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    setShowModal(false);
    logout();
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const memoryData = [
    {
      id: '1',
      category: 'About You',
      items: [
        {
          id: '1-1',
          text: 'Building AiRA startup',
          icon: 'business',
          date: '2024-01-15',
          color: '#007AFF',
        },
      ],
    },
    {
      id: '2',
      category: 'Preferences',
      items: [
        {
          id: '2-1',
          text: 'Interested in AI technology',
          icon: 'hardware-chip',
          date: '2024-01-10',
          color: '#34C759',
        },
        {
          id: '2-2',
          text: 'Prefers detailed explanations',
          icon: 'options',
          date: '2024-01-08',
          color: '#34C759',
        },
      ],
    },
    {
      id: '3',
      category: 'Conversations',
      items: [
        {
          id: '3-1',
          text: 'Discussed startup challenges',
          icon: 'chatbubbles',
          date: '2024-01-15',
          color: '#FF9500',
        },
        {
          id: '3-2',
          text: 'Talked about AI ethics',
          icon: 'chatbubbles',
          date: '2024-01-12',
          color: '#FF9500',
        },
      ],
    },
  ];

  const renderMemoryItem = ({ item }) => (
    <View style={styles.memoryItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.memoryContent}>
        <Text style={styles.memoryText}>{item.text}</Text>
        <Text style={styles.memoryDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.category}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.items}
        renderItem={renderMemoryItem}
        keyExtractor={memoryItem => memoryItem.id}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>AiRA Memory</Text>
            <Text style={styles.subtitle}>
              What I remember about our conversations
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* User info */}
        {user && <Text style={styles.userInfo}>Signed in as {user.email}</Text>}

        {/* Memory list */}
        <FlatList
          data={memoryData}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          style={styles.memoryList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#FF3B30" />
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  userInfo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  memoryList: {
    flex: 1,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  memoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memoryContent: {
    flex: 1,
  },
  memoryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  memoryDate: {
    fontSize: 12,
    color: '#666',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelText: {
    color: '#333',
    fontSize: 16,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MemoryScreen;

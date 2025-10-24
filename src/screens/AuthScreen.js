import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      const result = await login(email, password, rememberMe);
      if (!result.success) {
        Alert.alert('Login Failed', result.error);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to AiRA</Text>
        <Text style={styles.subtitle}>Your Personal AI, Made Effortless</Text>
      </View>

      <View style={styles.form}>
        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me */}
        <View style={styles.rememberContainer}>
          <Text style={styles.rememberText}>Remember Me</Text>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
        </View>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.demoText}>Demo: test@aira.ai / password</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rememberText: { fontSize: 16, color: '#666' },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: { backgroundColor: '#ccc' },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  demoText: { textAlign: 'center', marginTop: 20, color: '#666', fontStyle: 'italic' },
});

export default AuthScreen;

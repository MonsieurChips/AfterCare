import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createEvent } from '../lib/database-helpers';
import { getCurrentUser } from '../lib/supabase';
import { initializeUser } from '../lib/user-helpers';
import type { Importance } from '../types/supabase';

// Conditionally import DateTimePicker only on native platforms
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function EventsScreen() {
  const [eventType, setEventType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [importance, setImportance] = useState<Importance>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize user on mount
    const init = async () => {
      try {
        // Check if Supabase is configured
        const { data: { user }, error } = await getCurrentUser();
        if (error) {
          console.log('Supabase not configured or user not authenticated:', error.message);
          setIsInitialized(true); // Allow form to work anyway
          return;
        }
        if (!user) {
          await initializeUser();
        }
        setIsInitialized(true);
      } catch (error: any) {
        // Silently handle errors - don't break the app
        console.log('User initialization skipped:', error?.message || 'Unknown error');
        setIsInitialized(true); // Continue anyway - form can still be used
      }
    };
    init();
  }, []);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = async () => {
    if (!eventType.trim()) {
      if (Platform.OS === 'web') {
        alert('Event Type Required\nPlease enter an event type.');
      } else {
        Alert.alert('Event Type Required', 'Please enter an event type.');
      }
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await getCurrentUser();
      
      if (userError || !user) {
        const message = 'Supabase is not configured. Please set up your environment variables.';
        if (Platform.OS === 'web') {
          alert(message);
        } else {
          Alert.alert('Configuration Required', message);
        }
        setIsLoading(false);
        return;
      }

      const { data, error } = await createEvent({
        user_id: user.id,
        type: eventType.trim(),
        time: selectedDate ? selectedDate.toISOString() : null,
        importance: importance,
      });

      if (error) {
        const message = 'Failed to save event. Please check your Supabase configuration.';
        if (Platform.OS === 'web') {
          alert(message);
        } else {
          Alert.alert('Error', message);
        }
        console.error('Error creating event:', error);
      } else {
        const message = 'Event saved successfully.';
        if (Platform.OS === 'web') {
          alert(message);
          // Reset form
          setEventType('');
          setSelectedDate(null);
          setImportance('medium');
        } else {
          Alert.alert('Success', message, [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setEventType('');
                setSelectedDate(null);
                setImportance('medium');
              },
            },
          ]);
        }
      }
    } catch (error: any) {
      const message = 'An unexpected error occurred. Please check your configuration.';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
      console.error('Failed to save event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Simply reset the form - user can skip by not filling it
    setEventType('');
    setSelectedDate(null);
    setImportance('medium');
  };

  const getImportanceLabel = (value: Importance) => {
    switch (value) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return 'Medium';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        <Text style={styles.label}>Event Type</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Meeting, Appointment, Activity"
          placeholderTextColor="#999"
          value={eventType}
          onChangeText={setEventType}
        />

        <Text style={styles.label}>Date & Time (Optional)</Text>
        
        {Platform.OS === 'web' ? (
          <TextInput
            style={styles.input}
            placeholder="Leave empty or enter date (e.g., 2024-01-15 14:30)"
            placeholderTextColor="#999"
            value={
              selectedDate
                ? selectedDate.toLocaleString()
                : ''
            }
            onChangeText={(text) => {
              if (!text.trim()) {
                setSelectedDate(null);
                return;
              }
              try {
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                  setSelectedDate(date);
                }
              } catch (e) {
                // Invalid date, user can continue typing
              }
            }}
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {selectedDate
                  ? selectedDate.toLocaleString()
                  : 'Select date and time'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && DateTimePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {Platform.OS === 'ios' && showDatePicker && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <Text style={styles.label}>Importance</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderOptions}>
            {(['low', 'medium', 'high'] as Importance[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.importanceOption,
                  importance === option && styles.importanceOptionActive,
                ]}
                onPress={() => setImportance(option)}
              >
                <Text
                  style={[
                    styles.importanceText,
                    importance === option && styles.importanceTextActive,
                  ]}
                >
                  {getImportanceLabel(option)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Event</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  doneButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  sliderContainer: {
    marginTop: 10,
  },
  sliderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  importanceOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  importanceOptionActive: {
    borderColor: '#4a90e2',
    backgroundColor: '#e8f4fd',
  },
  importanceText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  importanceTextActive: {
    color: '#4a90e2',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4a90e2',
  },
  skipButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '400',
  },
});

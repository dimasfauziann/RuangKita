import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import SlotCard from '../components/SlotCard';
import { generateSlots } from '../utils/slotGenerator';
import rooms from '../data/rooms.json';

import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  HomeScreen: undefined;
  FormReservasiScreen: { selectedRoom: string; selectedDate: Date };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const minDate = addDays(startOfDay(new Date()), 1);

  const fetchBookings = useCallback(async () => {
    if (!selectedRoom || !selectedDate) return;

    const data = await AsyncStorage.getItem('bookings');
    const parsed = data ? JSON.parse(data) : [];

    const filtered = parsed.filter(
      (item: { ruangan: string; tanggal: string }) =>
        item.ruangan === selectedRoom && item.tanggal === formattedDate
    );

    setBookings(filtered);
  }, [selectedRoom, selectedDate]);

  useEffect(() => {
    if (selectedRoom && selectedDate) {
      setShowSchedule(true);
      fetchBookings();
    } else {
      setShowSchedule(false);
      setBookings([]);
    }
  }, [selectedRoom, selectedDate, fetchBookings]);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings])
  );

  const slotData = showSchedule ? generateSlots('07:00', '18:00', bookings) : [];

  const onChangeDate = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date && !isBefore(date, minDate)) {
      setSelectedDate(date);
    } else {
      Alert.alert('Tanggal tidak valid', 'Pilih tanggal mulai dari besok.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Bagian Atas */}
      <View style={styles.topSection}>
        <Text style={styles.header}>Jadwal Ruang Rapat</Text>

        <Text style={styles.label}>Pilih Ruangan</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedRoom}
            onValueChange={(value) => setSelectedRoom(value)}
            style={Platform.OS === 'ios' ? { height: 200 } : { width: '100%' }}
          >
            <Picker.Item label="-- Pilih Ruangan --" value="" />
            {rooms.map((room: string) => (
              <Picker.Item key={room} label={room} value={room} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Tanggal</Text>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text>
            {selectedDate ? format(selectedDate, 'yyyy MMMM dd') : 'Pilih tanggal'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate || minDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={minDate}
          />
        )}
      </View>

      {/* Bagian Bawah */}
      {showSchedule && (
        <View style={styles.bottomCard}>
          <Text style={styles.scheduleTitle}>Jadwal Tersedia</Text>

          <View style={styles.slotScrollContainer}>
            <FlatList
              data={slotData}
              keyExtractor={(item) => item.time}
              renderItem={({ item }) => <SlotCard slot={item} />}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginVertical: 16 }}>
                  Tidak ada slot tersedia
                </Text>
              }
            />
          </View>

          <TouchableOpacity
            style={styles.reserveBtn}
            onPress={() => {
              if (!selectedRoom || !selectedDate) {
                Alert.alert('Pilih ruangan dan tanggal terlebih dahulu!');
                return;
              }
              navigation.navigate('FormReservasiScreen', {
                selectedRoom,
                selectedDate,
              });
            }}
          >
            <Text style={styles.reserveBtnText}>Reservasi Sekarang!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  topSection: {
    padding: 16,
    backgroundColor: '#F2F4F7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007bff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 12,
  },
  slotScrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  reserveBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  reserveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

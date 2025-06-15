import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Slot = {
  time: string;
  isBooked: boolean;
};

type SlotCardProps = {
  slot: Slot;
};

const SlotCard: React.FC<SlotCardProps> = ({ slot }) => {
  const isBooked = slot.isBooked;

  const icon = isBooked
    ? require('../assets/images/close.png')
    : require('../assets/images/check.png');

  const backgroundColor = isBooked ? '#FEE2E2' : '#DCFCE7'; 
  const textColor = isBooked ? '#B91C1C' : '#166534'; 

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.left}>
        <Text style={[styles.time, { color: textColor }]}>{slot.time}</Text>
        <Text style={[styles.statusText, { color: textColor }]}>
          {isBooked ? 'Penuh' : 'Tersedia'}
        </Text>
      </View>
      <Image source={icon} style={styles.icon} />
    </View>
  );
};

export default SlotCard;

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flexDirection: 'column',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

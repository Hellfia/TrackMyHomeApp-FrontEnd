import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import avatar from '../assets/avatar.png';
import { normalize } from '../utils/scale';

export default function ClientContainer({ firstname, lastname, address, zip, city, profilePicture, onPress, variant = 'orange' }) {
  const profileImage = profilePicture ? { uri: profilePicture } : avatar;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        variant === 'violet' ? styles.violetShadow : styles.orangeShadow
      ]}
    >
      <Image
        source={profileImage}
        style={styles.avatar}
        accessibilityLabel="Photo de profil de l'utilisateur"
      />

      <Text style={styles.name} numberOfLines={1}>
        {firstname} {lastname}
      </Text>
      <Text style={styles.address} numberOfLines={1}>
        {address}
      </Text>
      <Text style={styles.city}>
        {zip} {city}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: normalize(170),
    height: normalize(160),
    backgroundColor: '#fff',
    borderRadius: normalize(16),
    padding: normalize(12),
    alignItems: 'center',
    elevation: 4,
  },
  avatar: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    marginBottom: normalize(8),
  },
  name: {
    fontWeight: '700',
    fontSize: normalize(14),
    color: '#673ED9',
    textAlign: 'center',
    marginBottom: normalize(4),
  },
  address: {
    fontSize: normalize(12),
    color: '#444',
    textAlign: 'center',
  },
  city: {
    fontSize: normalize(12),
    color: '#444',
    textAlign: 'center',
  },
  orangeShadow: {
    shadowColor: '#FF5900',
    shadowOffset: { width: normalize(2), height: normalize(4) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(5),
  },
  violetShadow: {
    shadowColor: '#673ED9',
    shadowOffset: { width: normalize(2), height: normalize(4) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(5),
  },
});

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import avatar from '../assets/avatar.png';
import { wp, hp, rfs } from '../utils/scale';

export default function ClientContainer({
  firstname,
  lastname,
  address,
  zip,
  city,
  profilePicture,
  onPress,
  variant = 'orange',
}) {
  const profileImage = profilePicture ? { uri: profilePicture } : avatar;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        variant === 'violet' ? styles.violetShadow : styles.orangeShadow,
      ]}
    >
      <Image
        source={profileImage}
        style={styles.avatar}
        accessibilityLabel="Photo de profil de l'utilisateur"
      />

      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {firstname} {lastname}
      </Text>
      <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
        {address}
      </Text>
      <Text style={styles.city} numberOfLines={1} ellipsizeMode="tail">
        {zip} {city}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp(45),         // 45% de la largeur de l'écran
    aspectRatio: 170 / 160,
    backgroundColor: '#fff',
    borderRadius: wp(4),   // 4% de la largeur
    padding: wp(3),        // 3% de la largeur
    alignItems: 'center',
    elevation: 4,
  },
  avatar: {
    width: wp(20),         // 20% de la largeur de l'écran
    aspectRatio: 1,        // image carrée
    borderRadius: wp(10),  // cercle complet
    marginBottom: hp(1),   // 1% de la hauteur de l'écran
  },
  name: {
    fontWeight: '700',
    fontSize: rfs(13),     // taille responsive
    color: '#673ED9',
    textAlign: 'center',
    marginBottom: hp(0.5), // 0.5% de la hauteur
  },
  address: {
    fontSize: rfs(11),     // taille responsive
    color: '#444',
    textAlign: 'center',
  },
  city: {
    fontSize: rfs(11),     // taille responsive
    color: '#444',
    textAlign: 'center',
  },
  orangeShadow: {
    shadowColor: '#FF5900',
    shadowOffset: { width: wp(0.5), height: hp(0.5) },
    shadowOpacity: 0.15,
    shadowRadius: wp(1),    // 1% de la largeur
  },
  violetShadow: {
    shadowColor: '#673ED9',
    shadowOffset: { width: wp(0.5), height: hp(0.5) },
    shadowOpacity: 0.15,
    shadowRadius: wp(1),
  },
});
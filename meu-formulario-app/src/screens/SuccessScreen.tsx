import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SuccessScreenProps {
  nome: string;
  email: string;
  onVoltar: () => void;
}

// ── Confetti Particle ──────────────────────────────────────────────────────
function Particle({ delay, x }: { delay: number; x: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const colors = ['#C9A84C', '#4CAF50', '#2196F3', '#FF5722', '#E91E63', '#FFD700'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 6 + Math.random() * 6;
  const isCircle = Math.random() > 0.5;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, height * 0.7] });
  const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${360 * (Math.random() > 0.5 ? 1 : -1) * 3}deg`] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: size,
        height: size,
        borderRadius: isCircle ? size / 2 : 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

// ── Ticket Card ────────────────────────────────────────────────────────────
function TicketCard({ nome, email }: { nome: string; email: string }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: 600,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const ticketCode = `CWC26-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const seat = `Setor ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 99) + 1}`;

  return (
    <Animated.View style={[ticketStyles.wrapper, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      {/* Top half */}
      <View style={ticketStyles.top}>
        <View style={ticketStyles.topLeft}>
          <Text style={ticketStyles.eventLabel}>EVENTO</Text>
          <Text style={ticketStyles.eventName}>Copa do Mundo{'\n'}FIFA 2026™</Text>
          <Text style={ticketStyles.matchInfo}>🏟️ Estádio Nacional · Grupo A</Text>
        </View>
        <View style={ticketStyles.badge}>
          <Text style={ticketStyles.badgeEmoji}>⚽</Text>
        </View>
      </View>

      {/* Dotted divider */}
      <View style={ticketStyles.dividerRow}>
        <View style={ticketStyles.semiCircleLeft} />
        <View style={ticketStyles.dots} />
        <View style={ticketStyles.semiCircleRight} />
      </View>

      {/* Bottom half */}
      <View style={ticketStyles.bottom}>
        <View style={ticketStyles.infoCol}>
          <Text style={ticketStyles.infoLabel}>NOME</Text>
          <Text style={ticketStyles.infoValue} numberOfLines={1}>{nome}</Text>
        </View>
        <View style={ticketStyles.infoCol}>
          <Text style={ticketStyles.infoLabel}>ASSENTO</Text>
          <Text style={ticketStyles.infoValue}>{seat}</Text>
        </View>
        <View style={ticketStyles.infoCol}>
          <Text style={ticketStyles.infoLabel}>CÓDIGO</Text>
          <Text style={[ticketStyles.infoValue, { color: '#C9A84C' }]}>{ticketCode}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const ticketStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  top: {
    backgroundColor: '#0d1f0d',
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#1e3a1e',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  topLeft: { flex: 1 },
  eventLabel: { color: '#4CAF50', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  eventName: { color: '#e8edf2', fontSize: 20, fontWeight: '900', lineHeight: 24, marginBottom: 8 },
  matchInfo: { color: '#7a8a99', fontSize: 12 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C9A84C22',
    borderWidth: 2,
    borderColor: '#C9A84C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: { fontSize: 26 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#050d14',
    zIndex: 10,
  },
  semiCircleLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#050d14',
    marginLeft: -9,
  },
  dots: {
    flex: 1,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#1e3a1e',
    marginHorizontal: 4,
  },
  semiCircleRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#050d14',
    marginRight: -9,
  },
  bottom: {
    backgroundColor: '#0a1a0a',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#1e3a1e',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  infoCol: { flex: 1 },
  infoLabel: { color: '#556', fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  infoValue: { color: '#e8edf2', fontSize: 13, fontWeight: '700' },
});

// ── Main Success Screen ────────────────────────────────────────────────────
export function SuccessScreen({ nome, email, onVoltar }: SuccessScreenProps) {
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      delay: Math.random() * 1500,
    }))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 1, tension: 70, friction: 6, useNativeDriver: true }),
      Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(titleY, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={successStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050d14" />

      {/* Confetti */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} delay={p.delay} />
        ))}
      </View>

      {/* Check Icon */}
      <Animated.View style={[successStyles.checkWrapper, { transform: [{ scale: checkScale }], opacity: checkOpacity }]}>
        <View style={successStyles.checkRing}>
          <View style={successStyles.checkInner}>
            <Text style={successStyles.checkMark}>✓</Text>
          </View>
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View style={{ transform: [{ translateY: titleY }], opacity: titleOpacity, alignItems: 'center', paddingHorizontal: 24, marginBottom: 32 }}>
        <Text style={successStyles.title}>Inscrição{'\n'}Confirmada! 🏆</Text>
        <Text style={successStyles.subtitle}>
          Você está oficialmente na lista,{'\n'}
          <Text style={successStyles.highlight}>{nome.split(' ')[0]}</Text>! Prepare o coração.
        </Text>
        <View style={successStyles.emailPill}>
          <Text style={successStyles.emailText}>✉️  Confirmação enviada para {email}</Text>
        </View>
      </Animated.View>

      {/* Ticket */}
      <TicketCard nome={nome} email={email} />

      {/* Button */}
      <Animated.View style={[{ opacity: btnOpacity }, successStyles.btnArea]}>
        <TouchableOpacity style={successStyles.btnHome} onPress={onVoltar}>
          <Text style={successStyles.btnHomeText}>← Voltar ao início</Text>
        </TouchableOpacity>
        <Text style={successStyles.hint}>Guarde o código do seu ingresso 🎟️</Text>
      </Animated.View>
    </View>
  );
}

const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050d14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  checkWrapper: { marginBottom: 28 },
  checkRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4CAF5055',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#0d2014',
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#4CAF50', fontSize: 36, fontWeight: '900' },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#e8edf2',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: { color: '#7a8a99', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 14 },
  highlight: { color: '#C9A84C', fontWeight: '800' },
  emailPill: {
    backgroundColor: '#0d1b2a',
    borderWidth: 1,
    borderColor: '#1e2d3d',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  emailText: { color: '#556', fontSize: 11 },
  btnArea: { alignItems: 'center', marginTop: 28, paddingHorizontal: 24, width: '100%' },
  btnHome: {
    borderWidth: 1.5,
    borderColor: '#1e2d3d',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  btnHomeText: { color: '#7a8a99', fontSize: 15, fontWeight: '600' },
  hint: { color: '#334', fontSize: 11 },
});

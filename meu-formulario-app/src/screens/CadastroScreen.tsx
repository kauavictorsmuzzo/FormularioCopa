import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Animated, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroSchema, CadastroFormData } from '../schemas/cadastroSchema';
import { SuccessScreen } from './SuccessScreen';

// ── Floating Label Input ──────────────────────────────────────────────────────
interface FloatingInputProps {
  label: string; error?: string; secureTextEntry?: boolean;
  keyboardType?: any; autoCapitalize?: any;
  value: string; onChangeText: (v: string) => void; icon: string;
}

function FloatingInput({ label, error, value, onChangeText, icon, secureTextEntry, keyboardType, autoCapitalize }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => { setFocused(true); Animated.timing(labelAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start(); };
  const handleBlur = () => { setFocused(false); if (!value) Animated.timing(labelAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start(); };

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, -8] });
  const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = labelAnim.interpolate({ inputRange: [0, 1], outputRange: ['#556', error ? '#ff4d4d' : focused ? '#C9A84C' : '#7a8a99'] });
  const borderColor = error ? '#ff4d4d' : focused ? '#C9A84C' : '#1e2d3d';

  return (
    <View style={floatStyles.wrapper}>
      <View style={[floatStyles.box, { borderColor }]}>
        <Text style={floatStyles.icon}>{icon}</Text>
        <View style={floatStyles.inputArea}>
          <Animated.Text style={[floatStyles.label, { top: labelTop, fontSize: labelSize, color: labelColor }]}>{label}</Animated.Text>
          <TextInput style={floatStyles.input} value={value} onChangeText={onChangeText} onFocus={handleFocus} onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword} keyboardType={keyboardType} autoCapitalize={autoCapitalize ?? 'sentences'}
            placeholderTextColor="transparent" selectionColor="#C9A84C" />
        </View>
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={floatStyles.eye}>
            <Text style={floatStyles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <View style={floatStyles.errorRow}><Text style={floatStyles.errorDot}>●</Text><Text style={floatStyles.errorText}>{error}</Text></View>}
    </View>
  );
}

const floatStyles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, backgroundColor: '#0d1b2a', paddingHorizontal: 14, paddingTop: 18, paddingBottom: 10, minHeight: 64 },
  icon: { fontSize: 18, marginRight: 10, marginTop: 2 },
  inputArea: { flex: 1, position: 'relative', justifyContent: 'center' },
  label: { position: 'absolute', left: 0, backgroundColor: '#0d1b2a', paddingHorizontal: 2 },
  input: { color: '#e8edf2', fontSize: 15, paddingTop: 8, paddingBottom: 0, height: 30 },
  eye: { padding: 4 }, eyeIcon: { fontSize: 18 },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 4 },
  errorDot: { color: '#ff4d4d', fontSize: 8, marginRight: 6 },
  errorText: { color: '#ff4d4d', fontSize: 12, fontWeight: '500' },
});

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={stepStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <View style={[stepStyles.dot, i < current && stepStyles.dotDone, i === current - 1 && stepStyles.dotActive]}>
            {i < current - 1 && <Text style={stepStyles.check}>✓</Text>}
            {i === current - 1 && <View style={stepStyles.pulse} />}
          </View>
          {i < total - 1 && <View style={[stepStyles.line, i < current - 1 && stepStyles.lineDone]} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#1e2d3d', backgroundColor: '#0d1b2a', alignItems: 'center', justifyContent: 'center' },
  dotActive: { borderColor: '#C9A84C', backgroundColor: '#1a2a1a' },
  dotDone: { borderColor: '#4CAF50', backgroundColor: '#0d2014' },
  pulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C9A84C' },
  check: { color: '#4CAF50', fontSize: 13, fontWeight: 'bold' },
  line: { flex: 1, height: 2, backgroundColor: '#1e2d3d', marginHorizontal: 4 },
  lineDone: { backgroundColor: '#4CAF50' },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export function CadastroScreen() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState<{ nome: string; email: string } | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { control, handleSubmit, trigger, formState: { errors } } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: 'onChange',
  });

  const transitionTo = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(next), 150);
  };

  const goNext = async () => {
    const fields: (keyof CadastroFormData)[] = step === 1 ? ['nome', 'email'] : ['idade', 'senha', 'confirmarSenha'];
    const valid = await trigger(fields);
    if (valid) transitionTo(step + 1);
  };

  const onSubmit = (data: CadastroFormData) => {
    setUserData({ nome: data.nome, email: data.email });
    setSubmitted(true);
  };

  if (submitted && userData) {
    return (
      <SuccessScreen
        nome={userData.nome}
        email={userData.email}
        onVoltar={() => { setSubmitted(false); setStep(1); setUserData(null); }}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#050d14" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <View style={styles.badgeRow}><Text style={styles.badgeText}>⚽  COPA DO MUNDO 2026</Text></View>
          <Text style={styles.title}>Garanta seu{'\n'}ingresso agora</Text>
          <Text style={styles.subtitle}>Preencha o cadastro e faça parte da maior festa do futebol</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.card}>
          <StepIndicator current={step} total={2} />
          <Text style={styles.stepLabel}>{step === 1 ? 'Identificação' : 'Segurança & Acesso'}</Text>
          <Text style={styles.stepSub}>{step === 1 ? 'Passo 1 de 2 — Dados pessoais' : 'Passo 2 de 2 — Senha e verificação'}</Text>

          <Animated.View style={{ opacity: fadeAnim }}>
            {step === 1 && (
              <>
                <Controller control={control} name="nome" render={({ field: { onChange, value } }) => (
                  <FloatingInput label="Nome completo" icon="👤" value={value ?? ''} onChangeText={onChange} error={errors.nome?.message} />
                )} />
                <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                  <FloatingInput label="E-mail" icon="✉️" value={value ?? ''} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
                )} />
              </>
            )}
            {step === 2 && (
              <>
                <Controller control={control} name="idade" render={({ field: { onChange, value } }) => (
                  <FloatingInput label="Idade" icon="🎂" value={value ?? ''} onChangeText={onChange} keyboardType="numeric" error={errors.idade?.message} />
                )} />
                <Controller control={control} name="senha" render={({ field: { onChange, value } }) => (
                  <FloatingInput label="Senha" icon="🔐" value={value ?? ''} onChangeText={onChange} secureTextEntry error={errors.senha?.message} />
                )} />
                <Controller control={control} name="confirmarSenha" render={({ field: { onChange, value } }) => (
                  <FloatingInput label="Confirmar senha" icon="🔑" value={value ?? ''} onChangeText={onChange} secureTextEntry error={errors.confirmarSenha?.message} />
                )} />
              </>
            )}
          </Animated.View>

          <View style={styles.btnRow}>
            {step === 2 && (
              <TouchableOpacity style={styles.btnBack} onPress={() => transitionTo(1)}>
                <Text style={styles.btnBackText}>← Voltar</Text>
              </TouchableOpacity>
            )}
            {step === 1 ? (
              <TouchableOpacity style={styles.btnPrimary} onPress={goNext}>
                <Text style={styles.btnPrimaryText}>Continuar →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.btnPrimaryText}>🏆  Inscrever-se</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.trustRow}>
            {['🔒 Dados seguros', '⚡ Rápido', '🎟️ Garantido'].map(item => (
              <View key={item} style={styles.trustItem}><Text style={styles.trustText}>{item}</Text></View>
            ))}
          </View>
          <Text style={styles.footerNote}>Ao se inscrever você concorda com os Termos de Uso e Política de Privacidade</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#050d14' },
  container: { paddingBottom: 40 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  badgeRow: { alignSelf: 'flex-start', backgroundColor: '#1a2a14', borderWidth: 1, borderColor: '#4CAF50', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16 },
  badgeText: { color: '#4CAF50', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { fontSize: 36, fontWeight: '900', color: '#e8edf2', lineHeight: 42, marginBottom: 10, letterSpacing: -0.5 },
  subtitle: { color: '#7a8a99', fontSize: 14, lineHeight: 21 },
  divider: { height: 2, marginHorizontal: 24, marginBottom: 28, backgroundColor: '#C9A84C', opacity: 0.5, borderRadius: 1 },
  card: { marginHorizontal: 16, backgroundColor: '#0a1520', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1e2d3d', shadowColor: '#C9A84C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8 },
  stepLabel: { color: '#C9A84C', fontSize: 18, fontWeight: '800', marginBottom: 2, letterSpacing: 0.2 },
  stepSub: { color: '#556', fontSize: 12, marginBottom: 24 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnBack: { flex: 1, borderWidth: 1.5, borderColor: '#1e2d3d', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  btnBackText: { color: '#7a8a99', fontSize: 15, fontWeight: '600' },
  btnPrimary: { flex: 2, backgroundColor: '#C9A84C', borderRadius: 12, paddingVertical: 15, alignItems: 'center', shadowColor: '#C9A84C', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { color: '#050d14', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  footer: { paddingHorizontal: 24, paddingTop: 28, alignItems: 'center' },
  trustRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  trustItem: { backgroundColor: '#0d1b2a', borderWidth: 1, borderColor: '#1e2d3d', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  trustText: { color: '#7a8a99', fontSize: 11, fontWeight: '600' },
  footerNote: { color: '#334', fontSize: 11, textAlign: 'center', lineHeight: 18 },
});

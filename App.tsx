import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';

export default function App() {
  const [borderColor, setBorderColor] = useState<'lightgrey'| 'lightgreen'>('lightgrey');

  const {
    state, 
    startRecognizing, 
    stopRecognizing, 
    destroyRecognizer
  } = useVoiceRecognition();

  return (
    <View style={styles.container}>
        <Text style={{fontSize: 32, fontWeight:"bold", marginBottom: 13}}>Talk GPT</Text>
        <Text style={{
            fontSize: 12,
            marginBottom: 5,
            textAlign: 'center',
            color: '#333333',
          }}
        >
          Press and hold this button to record your voice. Release the button to send the recording.
          You will receive a response as audio. 
        </Text>
        <Text style={{marginVertical: 10, fontSize:17}}>
          Your Message: 
        </Text>
        <Pressable
          style={{
            padding: 30,
            width: "90%",
            gap: 10,
            borderWidth: 3,
            alignItems: 'center',
            borderRadius: 10,
            borderColor: borderColor,
          }}
          onPressIn={() => {
            setBorderColor('lightgreen')
            startRecognizing();
          }}
          onPressOut={() => {
            setBorderColor('lightgrey')
            stopRecognizing();

            // handleSubmit();
          }}
        >
          <Text>Hold to Speak</Text>
        </Pressable>
        <Text style={{marginVertical: 10, fontSize:17}}>
          {JSON.stringify(state, null, 2)}
        </Text>
        <Button
          title='Replay the last message'
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

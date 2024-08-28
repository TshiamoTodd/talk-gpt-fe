import Voice, {
    SpeechErrorEvent,
    SpeechResultsEvent,
} from '@react-native-voice/voice';
import { useCallback, useEffect, useState } from 'react';

interface IState {
    recognized: string;
    pitch: string;
    error: string;
    end: string;
    started: string;
    results: string[];
    partialResults: string[];
    isRecording: boolean;
}

export const useVoiceRecognition = () => {
    const [state, setState] = useState<IState>({
        recognized: '',
        pitch: '',
        error: '',
        end: '',
        started: '',
        results: [],
        partialResults: [],
        isRecording: false,
    });

    const resetState = useCallback(() => {
        setState({
            recognized: '',
            pitch: '',
            error: '',
            end: '',
            started: '',
            results: [],
            partialResults: [],
            isRecording: false,
        });
    }, [setState]);

    const startRecognizing = useCallback(async () => {
        resetState();
        try {
            console.log("Starting voice recognition");
            await Voice.start('en-US');
        } catch (error) {
            console.error(error);
        }
    }, [resetState]);

    const stopRecognizing = useCallback(async () => {
        try {
            await Voice.stop();
        } catch (error) {
            console.error(error);
        }
    }, []);

    const cancelRecognizing = useCallback(async () => {
        try {
            await Voice.cancel();
        } catch (error) {
            console.error(error);
        }
    }, []);

    const destroyRecognizer = useCallback(async () => {
        try {
            await Voice.destroy();
        } catch (error) {
            console.error(error);
        }
        resetState();
    }, [resetState]);

    useEffect(() => {
        Voice.onSpeechStart = (e: any) => {
            setState((prev) => ({
                ...prev, 
                started: '✅',
                isRecording: true, 
            }));
        }

        Voice.onSpeechRecognized = (e: any) => {
            setState((prev) => ({
                ...prev, 
                recognized: '✅',
            }));
        }

        Voice.onSpeechEnd = (e: any) => {
            setState((prev) => ({
                ...prev, 
                end: '✅',
                isRecording: false, 
            }));
        }

        Voice.onSpeechError = (e: SpeechErrorEvent) => {
            setState((prev) => ({
                ...prev, 
                error: JSON.stringify(e.error),
                isRecording: false, 
            }));
        }

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
            if (e.value){
                setState((prev) => ({
                    ...prev, 
                    results: e.value!,
                }));
            }
        }

        Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
            if (e.value){
                setState((prev) => ({
                    ...prev, 
                    partialResults: e.value!,
                }));
            }
        }

        Voice.onSpeechVolumeChanged = (e: any) => {
            setState((prev) => ({
                ...prev, 
                pitch: e.value,
            }));
        }

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }

    }, []);

    return {
        state, 
        setState, 
        resetState,
        startRecognizing, 
        stopRecognizing, 
        destroyRecognizer, 
        cancelRecognizing
    };


}
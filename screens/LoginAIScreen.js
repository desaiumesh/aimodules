import { View, ImageBackground, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Text, IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { PreferencesContext } from '../components/PreferencesContext';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import useAsyncStorage from '../storage/useAsyncStorage';


const LoginAIScreen = ({ color }) => {

    const { isLoggedIn } = React.useContext(PreferencesContext);
    const biometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useAsyncStorage('isBiometricsEnabled', true);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    const login = async () => {

        if(!isBiometricsEnabled)
        {
            isLoggedIn();
            return;
        }

        const { success } = await biometrics.simplePrompt({
            promptMessage: 'Confirmation',
        });

        if (success) {
            isLoggedIn();
        }
    };


    return (
        <ImageBackground style={styles.container} source={require('../assets/text.jpg')}>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>Login</Text>
                <IconButton size={50} icon="login" mode="contained" onPress={() => { login() }}>Publish</IconButton>

            </View>
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginTop: 600,
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10,
    }
});

export default LoginAIScreen;
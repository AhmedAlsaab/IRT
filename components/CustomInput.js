import { TextInput, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = props => {
    return (
        <View style={styles.inputContainer}>
            <Ionicons name={props.icon} size={32} style={styles.inputIcons}></Ionicons>
            <TextInput placeholder={props.placeholder} style={styles.input}></TextInput>
        </View>
    )
}

const width = '80%';
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ff0000',
        alignItems: 'center',
        width,
        marginBottom: 10
    },
    input: {
        margin: 10
    },
    inputIcons: {
        width: 50,
        padding: 10,
        textAlign: 'center'
    }
})

export default CustomInput;
import { showMessage } from 'react-native-flash-message';

const showError = (title, message, icon) => {
    showMessage({
        message: title,
        description: message,
        type: icon,
        icon: icon,
        duration: 15000,
    });
}

export default showError;
import NetInfo from "@react-native-community/netinfo";

const isOnline = async () => {
    await NetInfo.addEventListener(state => {
        let status = false;
        if (state.isConnected && state.isInternetReachable) {
            status = true;
        }
        console.log(status);

        return status;
    });
};

export default isOnline;
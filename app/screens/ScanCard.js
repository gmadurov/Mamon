import { Button } from 'galio-framework';
import { View, Text, TouchableOpacityComponent } from 'react-native'
// import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// NfcManager.start();


const ScanCard = () => {
    // async function readNdef() {
    //     try {
    //       // register for the NFC tag with NDEF in it
    //       await NfcManager.requestTechnology(NfcTech.Ndef);
    //       // the resolved tag object will contain `ndefMessage` property
    //       const tag = await NfcManager.getTag();
    //       console.warn('Tag found', tag);
    //     } catch (ex) {
    //       console.warn('Oops!', ex);
    //     } finally {
    //       // stop the nfc scanning
    //       NfcManager.cancelTechnologyRequest();
    //     }
    //   }onPress={readNdef}
  return (
    <View>
      <Button >
        <Text>Scan a Tag</Text>
      </Button>
    </View>
  )
}

export default ScanCard
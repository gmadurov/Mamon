import { Alert, Platform } from "react-native";
import NfcManager, { NdefStatus, NfcError, NfcEvents, NfcTech, TagEvent } from "react-native-nfc-manager";
import React, { createContext, useEffect, useState } from "react";

import { showMessage } from "react-native-flash-message";

export interface TagEventLocal extends TagEvent {
  ndefStatus?: {
    status?: NdefStatus;
    capacity?: number;
  };
}
export type NFCContextType = {
  supported: boolean;
  setSupported: React.Dispatch<React.SetStateAction<boolean>>;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  init: () => Promise<boolean>;
  isEnabled: () => Promise<boolean>;
  goToNfcSetting: () => Promise<boolean>;
  readNdefOnce: () => Promise<TagEventLocal>;
  readTag: () => Promise<TagEventLocal>;
  stopReading(): Promise<void>;
};

const NFCContext = createContext({} as NFCContextType);
export default NFCContext;

export const NFCProvider = ({ children }: { children: React.ReactNode }) => {
  const [supported, setSupported] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const withAndroidPrompt = (fn: Function) => {
    async function wrapper() {
      if (supported && enabled) {
        try {
          const resp = await fn.apply(null, arguments)
          return resp;
        } catch (ex) {
          throw ex;
        } finally {
          console.log('finished scanning');
        }
      }
    }

    return wrapper;
  };

  const handleException = (ex: Error) => {
    if (ex instanceof NfcError.UserCancel) {
      // bypass
    } else if (ex instanceof NfcError.Timeout) {
      Alert.alert("NFC Session Timeout");
    } else {
      console.warn(ex);

      if (Platform.OS === "ios") {
        NfcManager.invalidateSessionWithErrorIOS(`${ex}`);
      } else {
        Alert.alert("NFC Error", `${ex}`);
      }
    }
  };

  async function init() {
    try {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
      return true;
    } catch (ex) {
      // console.warn(ex);
      return false;
    }
  }

  async function isEnabled() {
    try {
      return NfcManager.isEnabled();
    } catch (ex) {
      // console.warn(ex);
      return false;
    }
  }

  async function goToNfcSetting() {
    return NfcManager.goToNfcSetting();
  }

  const readNdefOnce = withAndroidPrompt(() => {
    const cleanUp = () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    };

    return new Promise<TagEventLocal | void>((resolve) => {
      let tagFound: TagEventLocal | null = null;

      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
        tagFound = tag as TagEventLocal;
        resolve(tagFound);

        if (Platform.OS === "ios") {
          NfcManager.setAlertMessageIOS("NDEF tag found");
        }

        NfcManager.unregisterTagEvent().catch(() => 0);
      });

      NfcManager.setEventListener(NfcEvents.SessionClosed, (error: any) => {
        if (error) {
          handleException(error);
        }

        cleanUp();
        if (!tagFound) {
          resolve({} as TagEventLocal);
        }
      });

      NfcManager.registerTagEvent();
    });
  }) as () => Promise<TagEventLocal>;

  const readTag = withAndroidPrompt(async () => {
    let tag: TagEventLocal;
    try {
      await NfcManager.requestTechnology([NfcTech.Ndef]);

      tag = (await NfcManager.getTag()) as TagEventLocal;
      tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();

      if (Platform.OS === "ios") {
        await NfcManager.setAlertMessageIOS("Success");
      }
    } catch (ex) {
      // for tag reading, we don't actually need to show any error
      // console.log(ex);
      // showMessage({
      //   message: "Error reading tag",
      //   description: `${ex}`,
      //   type: "danger",
      // });
      tag = {} as TagEventLocal;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return tag;
  }) as () => Promise<TagEventLocal>;

  async function stopReading() {
    await NfcManager.cancelTechnologyRequest();
  }

  useEffect(() => {
    async function initNfc() {
      try {
        const success = await init();
        setSupported(success);
        setEnabled(await isEnabled());

        if (success) {
          // listen to the NFC on/off state on Android device
          if (Platform.OS === "android") {
            NfcManager.setEventListener(NfcEvents.StateChanged, ({ state }: { state: string }) => {

              NfcManager.cancelTechnologyRequest().catch(() => 0);
              if (state === "off") {
                setEnabled(false);
              } else if (state === "on") {
                setEnabled(true);
              }
            });
          }
        }
      } catch (ex: any) {
        Alert.alert("NFC init error 2041", ex.message);
      }
    }

    initNfc();
  }, []);
  const data = {
    init,
    isEnabled,
    goToNfcSetting,
    readNdefOnce,
    readTag,
    supported,
    setSupported,
    enabled,
    setEnabled,
    stopReading,
  };
  return <NFCContext.Provider value={data}>{children}</NFCContext.Provider>;
};

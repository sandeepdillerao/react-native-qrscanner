import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import type { CodeType } from 'react-native-vision-camera/lib/typescript/CodeScanner';
import useSound from '../hooks/useSound';
import FooterWrapper from './component/FooterWrapper';
import MarkerWrapper from './component/MarkerWrapper';
import TopWrapper from './component/TopWrapper';
import TorchWrapper from './component/TorchWrapper';

interface OptionsProps {
  showLastScannedCode: true;
  enableScanSound: true;
}

interface QRScannerProps {
  onScan?: (code: string) => void;
  cameraProps?: any;
  options?: OptionsProps;
  topContent?: any;
  footerContent?: any;
  markerContent?: any;
  showMarker?: boolean;
  customMarker?: any;
  codeTypes?: CodeType[];
  ignoreLastScanCheck?: boolean;
  showTorch?: boolean;
  reactivateTime?: number;
}

const QRScanner = (props: QRScannerProps) => {
  const {
    onScan = () => {},
    cameraProps,
    options = {},
    topContent = null,
    footerContent = null,
    markerContent = null,
    showMarker = true,
    customMarker = null,
    codeTypes = ['qr'],
    ignoreLastScanCheck = false,
    showTorch = true,
    reactivateTime = 2000,
  } = props;
  const { playSoundWithVibration } = useSound();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [lastScan, setLastScan] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [torchOn, setTorchOff] = useState(false);
  const [isScanAllowed, setIsScanAllowed] = useState(true);

  /**
   * A function to trigger highlighting and then revert back after a delay.
   * @return {void} This function does not return a value.
   */
  const _triggerHighlight = (): void => {
    setShowCode(true);
    setTimeout(() => {
      setShowCode(false);
    }, 500);
  };
  /**
   * A function to reactivate the scanner after a scan.
   * @return {void} This function does not return a value.
   */
  const reactivateTimeout = (): void => {
    setIsScanAllowed(false);
    setTimeout(() => {
      setIsScanAllowed(true);
    }, reactivateTime);
  };

  /**
   * Handles the event when a code is scanned.
   * @param {any[]} codes - An array of scanned codes.
   * @return {void} This function does not return a value.
   */
  const onCodeScanned = (codes: any): void => {
    if (!isScanAllowed) return;
    const code = codes.shift();
    if (ignoreLastScanCheck || code.value !== lastScan) {
      playSoundWithVibration();
      setLastScan(code.value);
      console.log(code.value);
      _triggerHighlight();
      onScan && onScan(code.value);
      reactivateTimeout();
    }
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned,
  });

  if (device == null) return <NoCameraDeviceError />;
  console.log('🚀 ~ QRScanner ~ showCode:', lastScan, showCode);

  return (
    <View style={styles.cameraContainer}>
      <Camera
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
        device={device}
        torch={torchOn ? 'on' : 'off'}
        {...cameraProps}
      />
      {cameraProps?.isActive && showMarker && (
        <MarkerWrapper
          customMarker={customMarker}
          showCode={showCode}
          lastCode={lastScan}
          options={options}
        >
          {markerContent}
        </MarkerWrapper>
      )}
      <TopWrapper>{topContent}</TopWrapper>
      {showTorch && (
        <TorchWrapper torchOn={torchOn} setTorchOff={setTorchOff} />
      )}
      <FooterWrapper>{footerContent}</FooterWrapper>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  cameraContainer: {
    // height: 600,
    flex: 1,
    width: '100%',
  },
  cameraView: {
    flex: 1,
    width: '100%',
  },
  overlayCorner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
  },
  codeLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  overlayLogo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    height: 250,
    marginTop: 140,
    borderRadius: 200,
  },
  code: {
    color: 'black',
    fontSize: 14,
  },
});

const NoCameraDeviceError = () => <Text>No Camera Device</Text>;

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const TorchWrapper = (props: any) => {
  const TORCH_ICON = require('../../assets/TorchIcon.png');
  const { torchOn, setTorchOff, style, ...restProps } = props;
  const getImageStyle = (isTorchOn: boolean) => {
    return {
      tintColor: isTorchOn ? 'yellow' : 'white',
    };
  };
  return (
    <View style={[styles.header, style]} {...restProps}>
      <View style={styles.endOptions}>
        <TouchableOpacity
          onPress={() => setTorchOff(!torchOn)}
          style={styles.endFeature}
        >
          <Image style={getImageStyle(torchOn)} source={TORCH_ICON} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: -20,
  },
  endOptions: {
    alignSelf: 'flex-end',
  },
  endFeature: {
    marginHorizontal: 25,
    marginTop: 12,
  },
});

export default TorchWrapper;

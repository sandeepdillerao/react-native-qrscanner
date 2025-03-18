import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const MarkerWrapper = (props: any) => {
  const { customMarker, options, children, ...restProps } = props;
  console.log('🚀 ~ ======props:', restProps);
  if (customMarker) {
    const customMarkerWithProps = React.Children.map(customMarker, (child) => {
      // Ensure the child is a valid React element
      if (React.isValidElement(child)) {
        return React.cloneElement(child, restProps);
      }
      return child;
    });

    return (
      <View style={styles.overlay}>
        {customMarkerWithProps}
        {children}
      </View>
    );
  }
  const getCodeLabelStyle = (showCode: boolean) => {
    return {
      opacity: showCode ? 1 : 0.5,
    };
  };

  return (
    <DefaultMarker {...restProps}>
      {options?.showLastScannedCode && restProps?.lastCode && (
        <View
          style={[styles.codeLabel, getCodeLabelStyle(restProps?.showCode)]}
        >
          <Text style={styles.code}>{restProps?.lastCode}</Text>
        </View>
      )}
      {children}
    </DefaultMarker>
  );
};
const DefaultMarker = ({ children, ...props }: any) => {
  console.log('🚀 ~ DefaultMarker ~ props:', props);

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.topOverlay} />
      <View style={styles.middleContainer}>
        <View style={styles.sideOverlay} />
        <View style={styles.markerContainer}>
          <View style={styles.topLeftCorner} />
          <View style={styles.topRightCorner} />
          <View style={styles.bottomLeftCorner} />
          <View style={styles.bottomRightCorner} />
        </View>
        <View style={styles.sideOverlay} />
      </View>
      <View style={styles.extraContainer}>{children}</View>
      <View style={styles.bottomOverlay} />
    </View>
  );
};

const markerSize = width * 0.8;
const cornerSize = 40;
const cornerBorderWidth = 6;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  topOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: '-50%',
  },
  middleContainer: {
    flexDirection: 'row',
    zIndex: 1,
  },
  sideOverlay: {
    flex: 1,
    zIndex: -1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  markerContainer: {
    width: markerSize,
    height: markerSize,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topLeftCorner: {
    position: 'absolute',
    top: -cornerBorderWidth,
    left: -cornerBorderWidth,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: cornerBorderWidth,
    borderLeftWidth: cornerBorderWidth,
    borderColor: 'white',
    borderTopLeftRadius: 10,
  },
  topRightCorner: {
    position: 'absolute',
    top: -cornerBorderWidth,
    right: -cornerBorderWidth,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: cornerBorderWidth,
    borderRightWidth: cornerBorderWidth,
    borderColor: 'white',
    borderTopRightRadius: 10,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: -cornerBorderWidth,
    left: -cornerBorderWidth,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: cornerBorderWidth,
    borderLeftWidth: cornerBorderWidth,
    borderColor: 'white',
    borderBottomLeftRadius: 10,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: -cornerBorderWidth,
    right: -cornerBorderWidth,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: cornerBorderWidth,
    borderRightWidth: cornerBorderWidth,
    borderColor: 'white',
    borderBottomRightRadius: 10,
  },
  extraContainer: {
    position: 'absolute',
    top: height * 0.6 + 20, // Adjust the top value to position text below the marker
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  codeLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  code: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MarkerWrapper;

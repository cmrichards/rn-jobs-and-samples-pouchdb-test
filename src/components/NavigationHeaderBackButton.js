'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

type Props = {
  onPress: Function,
};

const NavigationHeaderBackButton = (props: Props) => (
  <TouchableOpacity style={styles.buttonContainer} onPress={props.onPress}>
    <Image style={styles.button} source={require('react-native/assets/back-icon.png')} />
  </TouchableOpacity>
);

NavigationHeaderBackButton.propTypes = {
  onPress: React.PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 24,
    width: 24,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    color: "#FFF",
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  }
});

module.exports = NavigationHeaderBackButton;

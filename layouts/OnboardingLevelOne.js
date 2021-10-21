import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinsusLoading from 'components/ui/modals/FinsusLoading';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const OnboardingLevelOne = ({
  title,
  titleBox,
  isBackPress,
  onBackPress,
  children,
  loading,
  messageLoading,
  navigation,
  noHeader = false,
  hideHelp = false,
  helpStyle = {},
}) => {
  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: 'transparent'}}
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
      enableOnAndroid={true}
      automaticallyAdjustContentInsets={false}>
      <StatusBar barStyle="light-content" hidden={true} />
      {isBackPress && (
        <Icon
          name="keyboard-arrow-left"
          size={36}
          style={{position: 'absolute', top: 8, left: 8, zIndex: 2}}
          color={'black'}
          onPress={onBackPress}
        />
      )}
      <View style={noHeader ? null : styles.headerContainer}>

      </View>
      <View style={noHeader ? null : styles.titleContainer}>
        {titleBox ? titleBox : <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.childrenContainer}>{children}</View>
      <FinsusLoading loading={loading} text={messageLoading} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  headerContainer: {
    width: Dimensions.get('window').width + 48,
    height: '35%',
    position: 'absolute',
    top: -12,
    right: -24,
    display: 'flex',
    justifyContent: 'center',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    flex: 1,
  },
  titleContainer: {
    height: Dimensions.get('window').height * 0.35 - 24,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  childrenContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'left',
    paddingTop:40,
    paddingLeft:15,
    fontSize: 25,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
  helpContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 3,
  },
  helpIcon: {
    width: 40,
    height: 40,
  },
});

export default OnboardingLevelOne;

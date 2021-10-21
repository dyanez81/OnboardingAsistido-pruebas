import React from 'react';
import {View, StatusBar, Platform, StyleSheet, Dimensions} from 'react-native';

import FinsusTitle from 'components/base/FinsusTitle';
import FinsusLoading from 'components/ui/modals/FinsusLoading';

import {PRIMARY_COLOR} from 'utils/colors';
import FinsusErrorModal from 'components/ui/modals/FinsusErrorModal';

const BaseLayout = ({
  showError,
  messageError,
  loading,
  title,
  message,
  children,
  doneErrorModal,
  customStyles,
}) => {
  return (
    <View style={[customStyles]}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <View style={styles.headerForm} />
        <FinsusTitle
          title={title}
          customStyles={{marginBottom: Platform.OS === 'android' ? 24 : 0}}
        />
        {children}
      </View>
      <FinsusLoading loading={loading} text={message} />
      <FinsusErrorModal
        done={doneErrorModal}
        visible={showError}
        text={messageError}
      />
    </View>
  );
};

const widthWindow = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fefefe',
    marginTop: Platform.OS === 'ios' ? 36 : 36,
  },
  headerForm: {
    height: widthWindow,
    width: widthWindow,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: widthWindow / 2,
    borderWidth: 0,
    position: 'absolute',
    top: -60 - widthWindow / 2,
    transform: [{scaleX: 1.8}],
    left: 0,
  },
});

export default BaseLayout;

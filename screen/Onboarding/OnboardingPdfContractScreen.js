import React from 'react';
import { StyleSheet, Dimensions, View, Share } from 'react-native';
import {useSelector} from 'react-redux';
import Pdf from 'react-native-pdf';
import OnboardingLevelOne from 'layouts/OnboardingLevelOne';
import FinsusButtonSecondary from 'components/base/FinsusButtonSecondary';

const OnboardingPdfContract = ({navigation}) => {
  const loading = useSelector(state => state.onboarding.loading);
  const pdfUrl = navigation.getParam('pdf', true);
  const path = navigation.getParam('path', true);
  const source = {uri: `data:application/pdf;base64,${pdfUrl}`};
  const onBackPress = () => {
    navigation.goBack();
  };

  const sharePdf = async() => {
    Share.share({
      url: path,
      title: 'Descargar Contrato'
    })
  };

  return (
    <OnboardingLevelOne
      noHeader={true}
      isBackPress
      onBackPress={onBackPress}
      loading={loading && navigation.isFocused()}
      navigation={navigation}>
      <Pdf
        source={source}
        style={styles.pdf}/>
      <FinsusButtonSecondary
        text={'Compartir'}
        onPress={sharePdf}
      />
    </OnboardingLevelOne>
  )
}

export default OnboardingPdfContract;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height * 0.85,
    }
});
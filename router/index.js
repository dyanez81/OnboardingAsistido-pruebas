import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import SplashScreen from 'screen/SplashScreen';
import LoginScreen from 'screen/Login/loginOnboarding';
import RegisterForm from 'screen/Login/registerForm';

import HelpScreen from 'screen/Indication/HelpScreen';
import IndicationsScreen from 'screen/Indication/IndicationsScreen';
import SendDataHelpScreen from 'screen/Indication/SendDataHelpScreen';
import FinsusWebViewScreen from 'screen/Indication/FinsusWebViewScreen';

import OnboardingPickLevelScreen from 'screen/Onboarding/OnboardingPickLevelScreen';
import OnboardingLevelDetailScreen from 'screen/Onboarding/OnboardingLevelDetailScreen';
import OnboardingCreateUserScreen from 'screen/Onboarding/OnboardingCreateUser';
import OnboardingSetPasswordScreen from 'screen/Onboarding/OnboardingSetPasswordScreen';
import OnboardingSelfieScreen from 'screen/Onboarding/OnboardingSelfieScreen';
import OnboardingConfirmNumberScreen from 'screen/Onboarding/OnboardingConfirmNumberScreen';
import OnboardingWarningScreen from 'screen/Onboarding/OnboardingWarningScreen';
import OnboardingCustomerInfoScreen from 'screen/Onboarding/OnboardingCustomerInfoScreen';
import OnboardingConfirmAddressScreen from 'screen/Onboarding/OnboardingConfirmAddressScreen';
import OnboardingUseAccountScreen from 'screen/Onboarding/OnboardingUseAccountScreen';
import OnboardingResourceProviderScreen from 'screen/Onboarding/OnboardingResourceProviderScreen';
import OnboardingCheckAddressScreen from 'screen/Onboarding/OnboardingCheckAddressScreen';
import OnboardingBeneficiaryScreen from 'screen/Onboarding/OnboardingBeneficiaryScreen';
import OnboardingAddBeneficiaryScreen from 'screen/Onboarding/OnboardingAddBeneficiaryScreen';
import OnboardingLegalListScreen from 'screen/Onboarding/OnboardingLegalListScreen';
import OnboardingReadLegalScreen from 'screen/Onboarding/OnboardingReadLegalScreen';
import OnboardingPdfContract from 'screen/Onboarding/OnboardingPdfContractScreen';
import OnboardingSignScreen from 'screen/Onboarding/OnboardingSignScreen';
import OnboardingUpgradeScreen from 'screen/Onboarding/OnboardingUpgradeScreen';
import OnboardingVideoScreen from 'screen/Onboarding/OnboardingVideoScreen';
import OnboardingVideoIndicationScreen from 'screen/Onboarding/OnboardingVideoIndicationScreen';
import OnboardingUpIndicationsScreen from 'screen/Onboarding/OnboardingUpIndicationsScreen';
import OnboardingCongratsScreen from 'screen/Onboarding/OnboardingCongratsScreen';
import OnboardingCongratsUpScreen from 'screen/Onboarding/OnboardingCongratsUpScreen';
import OnboardingWelcomeScreen from 'screen/Onboarding/OnboardingWelcomeScreen';
import OnboardingManttoScreen from 'screen/Onboarding/OnboardingManttoScreen';
import OnboardingConfirmCurpScreen from 'screen/Onboarding/OnboardingConfirmCurpScreen';
import OnboardingValidateCurpScreen from 'screen/Onboarding/OnboardingValidateCurpScreen';
import OnboardingCheckNewAddressScreen from 'screen/Onboarding/OnboardingCheckNewAddressScreen';
import OnboardingSecurityCheckScreen from 'screen/Onboarding/OnboardingSecurityCheckScreen';
import OnboardingVideoResultScreen from 'screen/Onboarding/OnboardingVideoResultScreen';
import OnboardingLocationInfoScreen from 'screen/Onboarding/OnboardingLocationInfoScreen';
import OnboardingVideocallIndicationScreen from 'screen/Onboarding/OnboardingVideocallIndicationScreen';
import OnboardingVideocallScheduleScreen from 'screen/Onboarding/OnboardingVideocallScheduleScreen';
import OnboardingVideocallWaitScreen from 'screen/Onboarding/OnboardingVideocallWaitScreen';
import OnboardingVideoCallScreen from 'screen/Onboarding/OnboardingVideoCallScreen';
import OnboardingVideocallSavedScreen from 'screen/Onboarding/OnboardingVideocallSavedScreen';
import OnboardingBackLaterScreen from 'screen/Onboarding/OnboardingBackLaterScreen';
import OnboardingAccountValidationScreen from 'screen/Onboarding/OnboardingAccountValidationScreen';
import OnboardingAcceptUpgradeScreen from 'screen/Onboarding/OnboardingAcceptUpgradeScreen';
import OnboardingCompleteFileScreen from 'screen/Onboarding/OnboardingCompleteFileScreen';
import OnboardingContractScreen from 'screen/Onboarding/OnboardingContractScreen';
import OnboardingContractSingScreen from 'screen/Onboarding/OnboardingContractSingScreen';
import OnboardingInfoUserUpLevel from 'screen/Onboarding/OnboardingInfoUserUpLevel';
import loginForm from 'screen/Login/loginForm';

const RootScreenNavigator = createStackNavigator(
  {
    splash: SplashScreen,
    loginScreen: LoginScreen,
    registerScreen: RegisterForm,
    indicator: IndicationsScreen,
    webview: FinsusWebViewScreen,

    onboardPickLevel: OnboardingPickLevelScreen,
    onboardLevelDetail: OnboardingLevelDetailScreen,
    onboardingCreateUser: OnboardingCreateUserScreen,
    onboardingSetPassword: OnboardingSetPasswordScreen,
    onboardingConfirmNumber: OnboardingConfirmNumberScreen,
    onboardingSelfie: OnboardingSelfieScreen,
    onboardingWarning: OnboardingWarningScreen,
    onboardingUserInfo: OnboardingCustomerInfoScreen,
    onboardingConfirmAddress: OnboardingConfirmAddressScreen,
    onboardUseAccount: OnboardingUseAccountScreen,
    onboardResProvider: OnboardingResourceProviderScreen,
    onboardingCheckAddress: OnboardingCheckAddressScreen,
    onboardingBeneficiary: OnboardingBeneficiaryScreen,
    onboardingAddBeneficiary: OnboardingAddBeneficiaryScreen,
    onboardingLegalList: OnboardingLegalListScreen,
    onboardingReadLegal: OnboardingReadLegalScreen,
    onboardingPdfContract: OnboardingPdfContract,
    onboardingSignature: OnboardingSignScreen,
    onboardingUpgrade: OnboardingUpgradeScreen,
    onboardingVideo: OnboardingVideoScreen,
    onboardingVideoIndication: OnboardingVideoIndicationScreen,
    onboardingUpInstructions: OnboardingUpIndicationsScreen,
    onboardingCongrats: OnboardingCongratsScreen,
    onboardingCongratsUp: OnboardingCongratsUpScreen,
    onboardingWelcome: OnboardingWelcomeScreen,
    onboardMantto: OnboardingManttoScreen,
    onboardConfirmCurp: OnboardingConfirmCurpScreen,
    onboardValidCurp: OnboardingValidateCurpScreen,
    onboardCheckNewAddress: OnboardingCheckNewAddressScreen,
    onboardQuestions: OnboardingSecurityCheckScreen,
    onboardVideoResult: OnboardingVideoResultScreen,
    onboardLocation: OnboardingLocationInfoScreen,
    onboardVideocallInfo: OnboardingVideocallIndicationScreen,
    onboardVCallSchedulle: OnboardingVideocallScheduleScreen,
    onboardVCallWait: OnboardingVideocallWaitScreen,
    onboardVCall: OnboardingVideoCallScreen,
    onboardVideocallSaved: OnboardingVideocallSavedScreen,
    onboardBackLater: OnboardingBackLaterScreen,
    onboardAccountValidation: OnboardingAccountValidationScreen,
    onboardAcceptUpgrade: OnboardingAcceptUpgradeScreen,
    onboardCompleteFile: OnboardingCompleteFileScreen,
    onboardingContractScreen: OnboardingContractScreen,
    onboardingContractSignScreen: OnboardingContractSingScreen,
    onboardingInfoUserUpLevel: OnboardingInfoUserUpLevel,

    help: HelpScreen,
    sendDataHelp: SendDataHelpScreen,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const FinsusNavigator = createDrawerNavigator(
  {
    splash: RootScreenNavigator,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
    edgeWidth: 0,
    drawerBackgroundColor: 'transparent',
  },
);

export default createAppContainer(FinsusNavigator);

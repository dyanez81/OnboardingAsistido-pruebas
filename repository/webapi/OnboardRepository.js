import WebApiService from './WebApiService';
import {
  WEB_API_DEMO_IDMISSION,
  API_IDM_LOGINID,
  API_IDM_APPCODE,
  API_IDM_PASSWORD,
  API_IDM_MERCHANTID,
} from 'utils/env';
import moment from 'moment';

const WebApiDimmer = WebApiService();
const WebApiIDMDemo = WebApiService(WEB_API_DEMO_IDMISSION);
const resource = '/BackEndStart/Back/PreIn';
const resourceIDM = '/IDS/service/ids/';
const xmlConfig = {
  headers: {'Content-Type': 'text/xml'},
};

export default {
  /**
   * @Author: AZozaya
   * @Date: 2020-02-28 10:09:31
   * @Desc:  Registra un cliente en el servidor de IDMission
   * @param {obj} data Datos del Cliente a registrar
   */
  CreateUser({phone, email, password, name, imgSelfie}) {
    const xmlRequest = `
    <?xml version="1.0" encoding="utf-8"?>
    <Interface>
      <Customer_Interface>
        <CreateRQ>
          <Security_Data>
            <Unique_Data>
              <Login_Data>
                <Login_Id>${API_IDM_LOGINID}</Login_Id>
                <Application_Code>${API_IDM_APPCODE}</Application_Code>
              </Login_Data>
            </Unique_Data>
            <Password>${API_IDM_PASSWORD}</Password>
            <Merchant_Id>${API_IDM_MERCHANTID}</Merchant_Id>
          </Security_Data>
          <Customer_Data>
            <Type>
              <Person>
                <Name>${name}</Name>
                <Phone_Data>
                  <Type>CELL</Type>
                  <Number>${phone}</Number>
                </Phone_Data>
                <Email_Data>
                  <Email>${email}</Email>
                  <Type>CONTACT</Type>
                  <Primary>Y</Primary>
                </Email_Data>
                <Login_Data>
                  <Login_Id>${phone}</Login_Id>
                  <Password>${password}</Password>
                  <Is_Salting_Required>Y</Is_Salting_Required>
                </Login_Data>
                <Image>
                      <Type>FACE</Type>
                      <Format>JPEG</Format>
                      <Data>${imgSelfie}</Data>
                    </Image>
                    <Social_Media_Data>
                        <Social_Media_Name>Facebook</Social_Media_Name>
                        <Social_Media_ID>Facebook email id</Social_Media_ID>
                        <Update_Flag>ADD</Update_Flag>
                      </Social_Media_Data>
              </Person>
            </Type>
            <Client_Customer_Number>${phone}</Client_Customer_Number>
                  <Financial_Data>
                    <Other_Account_Data>
                      <Account_Type>KHATA</Account_Type>
                      <Account_Number>${phone}</Account_Number>
                      <Update_Flag>ADD</Update_Flag>
                    </Other_Account_Data>
                  </Financial_Data>
                  <Customer_Rating>
                    <Rating_Name>FIRST_LEVEL</Rating_Name>
                  </Customer_Rating>
          </Customer_Data>
        </CreateRQ>
      </Customer_Interface>
    </Interface>`;

    return WebApiIDMDemo.post(resourceIDM, xmlRequest, xmlConfig);
  },
  /**
   * javascript comment
   * @Author: AZozaya
   * @Date: 2020-04-03 12:59:27
   * @Desc: Actualiza la información del cliente agregandoi vídeo
   */
  updateCustomerVideo({requestDate, phone, videoData, uid}) {
    const xmlRequest = `
    <ThirdPartyFormUpdateRQ>
      <Security_Data>
        <Unique_Data>
          <Login_Data>
            <Login_Id>${API_IDM_LOGINID}</Login_Id>
            <Application_Code>${API_IDM_APPCODE}</Application_Code>
          </Login_Data>
        </Unique_Data>
        <Password>${API_IDM_PASSWORD}</Password>
        <Merchant_Id>${API_IDM_MERCHANTID}</Merchant_Id>
      </Security_Data>
      <FormDetails>
        <FormKey>IDMTPIA_${requestDate}_${uid}</FormKey>
        <ProductId>920</ProductId>
        <Identity_Validation_and_Face_Matching>
          <IDmission_Image_Processing>
            <Additional_Data>
              <Service_ID>70</Service_ID>
              <Unique_Customer_Number>${phone}</Unique_Customer_Number>
              <Old_Client_Customer_Number>${phone}</Old_Client_Customer_Number>
              <Customer_Phone>${phone}</Customer_Phone>
              <Manual_Review_Required>N</Manual_Review_Required>
              <Bypass_Age_Validation>N</Bypass_Age_Validation>
              <Bypass_Name_Matching>N</Bypass_Name_Matching>
              <Deduplication_Required>N</Deduplication_Required>
              <Need_Immediate_Response>N</Need_Immediate_Response>
            </Additional_Data>
            <Biometric_Information>
              <Video_Data>{"fileContent":"data:video\/mp4;base64,${videoData}","type":"video","name":"Video_Recording_file0","imageQuality":0.92,"fileUploadType":"Y","formKey":"IDMTPIA_${requestDate}_${uid}","isWatermarked":"N","suspectedTampering":"N","DateDiscrepancy":"N","isImageControlData":"Y"}
              </Video_Data>
				    </Biometric_Information>
          </IDmission_Image_Processing>
        </Identity_Validation_and_Face_Matching>
        <Transition>
          <Name>Draft</Name>
        </Transition>
        <SearchName>IDS_FINAL_SUBMIT</SearchName>
      </FormDetails>
    </ThirdPartyFormUpdateRQ>`;

    return WebApiIDMDemo.post(
      `/IDS/service/integ/idm/thirdparty/upsert`,
      xmlRequest,
      xmlConfig,
    );
  },
  /**
   * @Desc: Envía a Mesa de Control el expediente del cliente
   */
  updateFileControlDesk(date, uid, obData, scoreData, level, pld) {
    const fc = moment().format('DD/MM/YYYY');

    const xmlRequest = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ThirdPartyFormUpdateRQ>
	<Security_Data>
		<Unique_Data>
			<Login_Data>
				<Login_Id>${API_IDM_LOGINID}</Login_Id>
				<Application_Code>${API_IDM_APPCODE}</Application_Code>
			</Login_Data>
		</Unique_Data>
		<Password>${API_IDM_PASSWORD}</Password>
		<Merchant_Id>${API_IDM_MERCHANTID}</Merchant_Id>
	</Security_Data>
	<FormDetails>
		<FormKey>IDMTPIA_${date}_${uid}</FormKey>
		<ProductId>1869</ProductId>
		<Sustainable_financial>
			<General_Information>
				<Previous_Score>
					<name>${scoreData.name ?? 'amarillo'}</name>
					<paternal>${scoreData.paternal ?? 'amarillo'}</paternal>
					<maternal>${scoreData.maternal ?? 'amarillo'}</maternal>
					<curp>${scoreData.curp ?? 'amarillo'}</curp>
					<birthdate>${scoreData.birthdate ?? 'amarillo'}</birthdate>
					<birthEntity>${scoreData.birthEntity ?? 'amarillo'}</birthEntity>
					<gender>${scoreData.gender ?? 'amarillo'}</gender>
					<street>${scoreData.street ?? 'amarillo'}</street>
					<externalNumber>${scoreData.number ?? 'amarillo'}</externalNumber>
					<cp>${scoreData.cp ?? 'amarillo'}</cp>
					<colony>${scoreData.colony ?? 'amarillo'}</colony>
					<municipality>${scoreData.municipality ?? 'amarillo'}</municipality>
					<entity>${scoreData.entity ?? 'amarillo'}</entity>
					<country>${scoreData.country ?? 'amarillo'}</country>
					<imageIdFront>${scoreData.ineFront ?? 'amarillo'}</imageIdFront>
					<imageIdBack>${scoreData.ineBack ?? 'amarillo'}</imageIdBack>
					<imageSelfie>${scoreData.selfie ?? 'amarillo'}</imageSelfie>
					<rfc>${scoreData.rfc ?? 'amarillo'}</rfc>
					<Video>${scoreData.video ?? 'amarillo'}</Video>
          <File_Upload_Domicile_Comprobant>${scoreData.domicile ??
            'amarillo'}</File_Upload_Domicile_Comprobant>
					<Total_score_preview>${scoreData.total ?? '50'}</Total_score_preview>
				</Previous_Score>
				<Personal_Information>
					<Creation_date>${fc}</Creation_date>
					<fechaDeRegistro/>
					<idCliente>${obData.userData.customerCode}</idCliente>
					<ValidacionRegistroPrevio/>
					<name>${obData.userData.name}</name>
					<paternal>${obData.userData.paternal}</paternal>
					<maternal>${obData.userData.maternal}</maternal>
					<gender>${obData.userData.gender === '0' ? 'H' : 'M'}</gender>
					<Full_name>${obData.userData.fullName}</Full_name>
					<birthdate>${obData.userData.birthdate}</birthdate>
					<birthCountry>${obData.curpData.birthCountry ?? 'MEXICO'}</birthCountry>
					<birthEntity>${obData.userData.birthEntity}</birthEntity>
					<nationality>${obData.userData.nationality}</nationality>
					<street>${obData.addressData.street}</street>
					<externalNumber>${obData.addressData.externalNumber}</externalNumber>
					<entity>${obData.addressData.federalEntity}</entity>
					<country>${obData.addressData.country}</country>
					<phone>${obData.userData.phone}</phone>
					<cp>${obData.addressData.cp}</cp>
					<colony>${obData.addressData.suburb}</colony>
					<municipality>${obData.addressData.municipality}</municipality>
					<curp>${obData.userData.curp}</curp>
					<email>${obData.userData.email}</email>
					<occupation>${obData.userData.occupation}</occupation>
					<rfc>${obData.videoData.items[1].data ?? ''}</rfc>
					<Account_Level>${level}</Account_Level>
					<imageIdFront>
					{
						"type": "data:image/jpeg;base64",
						"preservedValue": "true",
						"name": "idFront.jpg",
						"fileContent": "${obData.ineSelfieData.items[1].data}",
						"fieldId": "P5258_S9442_G24247_F209477_BLOB"
					}
					</imageIdFront>
					<Submit_a_PLD>${pld ? '1' : '0'}</Submit_a_PLD>
					<imageIdBack>
					{
						"type": "data:image/jpeg;base64",
						"preservedValue": "true",
						"name": "idBack.jpg",
						"fileContent": "${obData.ineSelfieData.items[2].data}",
						"fieldId": "P5258_S9442_G24247_F209478_BLOB"
					}
					</imageIdBack>
					<Video>
					${obData.videoData.items[0].data &&
            `{
						"type": "video",
						"fileContent": "data:video/webm;base64,${obData.videoData.items[2].data}",
						"fieldId": "P5258_S9442_G24247_F209479_BLOB"
					}`}
					</Video>
					<imageSignature>
					{
						"time_simple": [["Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:20 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)", "Thu Nov 12 2020 11:48:21 GMT-0600 (hora estándar central)"]],
						"clickX_simple": [[55.352264404296875, 59.352264404296875, 60.352264404296875, 65.35226440429688, 78.35226440429688, 101.35226440429688, 131.35226440429688, 175.35226440429688, 225.35226440429688, 266.3522644042969, 288.3522644042969, 293.3522644042969, 294.3522644042969, 289.3522644042969, 287.3522644042969, 281.3522644042969, 266.3522644042969, 260.3522644042969, 242.35226440429688, 239.35226440429688, 244.35226440429688, 265.3522644042969, 303.3522644042969, 360.3522644042969, 423.3522644042969, 483.3522644042969, 536.3522644042969, 570.3522644042969, 584.3522644042969, 588.3522644042969, 587.3522644042969, 572.3522644042969, 566.3522644042969, 560.3522644042969, 555.3522644042969, 552.3522644042969, 551.3522644042969, 557.3522644042969, 560.3522644042969]],
						"pressure": "",
						"clickY_simple": [[217.70458984375, 227.70458984375, 229.70458984375, 232.70458984375, 239.70458984375, 244.70458984375, 245.70458984375, 236.70458984375, 208.70458984375, 178.70458984375, 149.70458984375, 127.70458984375, 110.70458984375, 99.70458984375, 98.70458984375, 98.70458984375, 108.70458984375, 117.70458984375, 164.70458984375, 198.70458984375, 229.70458984375, 257.70458984375, 281.70458984375, 295.70458984375, 296.70458984375, 277.70458984375, 247.70458984375, 216.70458984375, 194.70458984375, 175.70458984375, 158.70458984375, 146.70458984375, 148.70458984375, 160.70458984375, 181.70458984375, 201.70458984375, 217.70458984375, 225.70458984375, 226.70458984375]],
						"fileContent": "${obData.termsConditions.items[0].data}"
					}
					</imageSignature>
          <File_Upload_Domicile_Comprobant>
          ${obData.videoData.items[0].data &&
            `{
						"isImageControlData": "Y",
						"name": "Form5710261.jpeg",
						"fileUploadType": "Y",
						"preservedValue": "true",
						"isFileData": "Y",
						"type": "data:image/jpeg;base64",
						"fileContent": "${obData.videoData.items[0].data}",
						"fieldId": "P5258_S9442_G24247_F209481_BLOB"
          }`}
          </File_Upload_Domicile_Comprobant>
					<imageSelfie>
					{
						"type": "data:image/jpg;base64",
						"fileContent": "${obData.ineSelfieData.items[0].data}",
						"fieldId": "P5258_S9442_G24247_F209480_BLOB"
					}
					</imageSelfie>
					<acceptance>${obData.termsConditions.items[2].data ? '1' : '0'}</acceptance>
					${
            !obData.curpData.documentCurp
              ? ''
              : `<File_upload_CURP>
					{
						"isImageControlData": "N",
						"formKey": "MTU3NDQ1OTkyNDI2NGNhcmxvcw",
						"name": "CurpDocument.pdf",
						"isFileData": "Y",
						"fileUploadType": "Y",
						"type": "application/pdf",
						"preservedValue": "true",
						"fieldId": "P5258_S9442_G24247_F209482_BLOB",
						"fileContent": "${obData.curpData.documentCurp}"
					}
					</File_upload_CURP>`
          }
					<manifest>${obData.userData.manifest ? '1' : '0'}</manifest>
					<documento/>
					<pdf_name/>
					<Script_del_video/>
				</Personal_Information>
			</General_Information>
			<Beneficiaries>
				<Beneficiary_data_1>
					<name>${obData.userData.phone}</name>
					<domicile>${obData.userData.phone}</domicile>
					<phone>${obData.userData.phone}</phone>
					<percent>${obData.userData.phone}</percent>
					<birthdate>${obData.userData.phone}</birthdate>
				</Beneficiary_data_1>
				<Beneficiary_data_2>
					<name>${obData.userData.phone}</name>
					<domicile>${obData.userData.phone}</domicile>
					<phone>${obData.userData.phone}</phone>
					<percent>${obData.userData.phone}</percent>
					<birthdate>${obData.userData.phone}</birthdate>
				</Beneficiary_data_2>
				<Beneficiary_data_3>
					<name>${obData.userData.phone}</name>
					<domicile>${obData.userData.phone}</domicile>
					<phone>${obData.userData.phone}</phone>
					<percent>${obData.userData.phone}</percent>
					<birthdate>${obData.userData.phone}</birthdate>
				</Beneficiary_data_3>
			</Beneficiaries>
			<RENAPO_Validation>
				<RENAPO_Response>
					<HostTried/>
					<Status/>
					<Message/>
					<Code_Validation/>
					<Curp>${obData.userData.curp ?? ''}</Curp>
					<Name>${obData.curpData.name ?? ''}</Name>
					<Paternal>${obData.curpData.paternal ?? ''}</Paternal>
					<Maternal>${obData.curpData.maternal ?? ''}</Maternal>
					<Gender>${
            obData.curpData.gender === '0'
              ? 'H'
              : obData.curpData.gender === '1'
              ? 'M'
              : ''
          }</Gender>
					<DOB>${obData.curpData.birthdate ?? ''}</DOB>
					<Birth_Country>${obData.curpData.birthCountry ?? ''}</Birth_Country>
					<Birth_Entity>${obData.curpData.birthEntity ?? ''}</Birth_Entity>
					<docProbatorio/>
					<Entity_Registry/>
					<Tomo/>
					<Key_Municipy_Registry/>
					<YofR/>
					<Registry_Entity_Key/>
					<foja/>
					<numActa/>
					<libro/>
					<municipioRegistro/>
					<estatusCurp/>
					<codigoMensaje/>
				</RENAPO_Response>
			</RENAPO_Validation>
			<Available_score>
				<Calculating_score/>
			</Available_score>
		</Sustainable_financial>
		<Transition>
			<Name>Draft</Name>
		</Transition>
		<Language>es_ES</Language>
		<SearchName>IDS_FINAL_SUBMIT</SearchName>
		<GeoLocationDetail>
			<Latitude>${obData.userData.phone}</Latitude>
			<Longitude>${obData.userData.phone}</Longitude>
		</GeoLocationDetail>
	</FormDetails>
</ThirdPartyFormUpdateRQ>`;

    return WebApiIDMDemo.post(
      '/IDS/service/integ/idm/thirdparty/upsert',
      xmlRequest,
      xmlConfig,
    );
  },

  RegisterCreateUser(request) {
    return WebApiDimmer.post(`${resource}/startRegistration`, request);
  },
  RegisterSaveImages(request) {
    return WebApiDimmer.post(`${resource}/SaveStepOne`, request);
  },
  RegisterValidateCurp(request) {
    return WebApiDimmer.post(`${resource}/PreStepTwo`, request);
  },
  GetCountryCatalog() {
    return WebApiDimmer.get('/BackEndStart/Tools/cat/BirthCountry');
  },
  RegisterSaveAddress(request) {
    return WebApiDimmer.post(`${resource}/SaveStepTwo`, request);
  },
  GetUseAccountCatalog() {
    return WebApiDimmer.get('/CatAccount/Service/Json');
  },
  RegisterUseAccount(request) {
    return WebApiDimmer.post('/CatAccount/Service/PreAccountUsage', request);
  },
  RegisterResourceProvider(request) {
    return WebApiDimmer.post(
      '/CatAccount/Service/PreResourceProvider',
      request,
    );
  },
  RegisterSaveBeneficiaries(request) {
    return WebApiDimmer.post(`${resource}/SaveStepTree`, request);
  },
  RegisterSaveAcceptances(request) {
    return WebApiDimmer.post(`${resource}/SaveStepFour`, request);
  },
  RegisterUserFinal(request) {
    return WebApiDimmer.post(
      '/BackEndClientOne/core/Service/registerUser',
      request,
    );
  },
  RegisterSignatures(request) {
    return WebApiDimmer.post(
      '/FinalSignature/RegisterFinal/Signature',
      request,
    );
  },
  RegisterValidateRfc(request) {
    return WebApiDimmer.post(
      '/BackEndStart/Back/PreIn/StepTwoValidRfc', 
      request
    );
  },
  RegisterDomicileProof(request) {
    return WebApiDimmer.post(
      '/UpdateLevel/UpdateCustomer/setLevelTwo',
      request,
    );
  },
  
  RegisterGetAddress({phone, password}) {
    const request = {phone, password};
    return WebApiDimmer.post('/UpdateLevel/findData/getDirection', request);
  },

  RegisterUpgradeLevelTwo({phone, video64}) {
    const request = {
      phone,
      video: video64,
    };
    return WebApiDimmer.post(
      '/UpdateLevel/UpdateCustomer/ActivateLevelTwo', 
      request,
    );
  },
  UpdateFile(request) {
    return WebApiDimmer.put('/UpdateCustomer/AdminUser/Update', request);
  },
  CreateScore(request) {
    return WebApiDimmer.post('/SemaphoreScore/PreScore/create', request);
  },
  GetScoring({phone}) {
    const request = {phone};

    return WebApiDimmer.post(
      '/SemaphoreScore/PreScore/consultingScore',
      request,
    );
  },
  UpdateScoring(request) {
    return WebApiDimmer.put('/SemaphoreScore/PreScore/updateScore', request);
  },
  ScheduleVideocall(request) {
    return WebApiDimmer.post('/Onboard/service/registercback', request);
  },
  SendControlDesk({idAsociado}) {
    const request = {
      idAsociado,
    };
    return WebApiDimmer.post('/ShotMission/send/idAsociado', request);
  },
  UpdateLevelNto3(request) {
    return WebApiDimmer.put('/UpdateCustomer/AdminUser/UpdateNXtoN3', request);
  },
  ActivateNewAccountLevel3(request) {
    return WebApiDimmer.post(
      '/FinalSignature/RegisterFinal/SignatureN3',request);
  },
  SearchUserApi(request){
    return WebApiDimmer.post(
      '/QueryDev/core/Service/QueryUser', 
      request);
  },
  UpdateContract(request) {
    return WebApiDimmer.post(
      '/UpdateContrato/core/Update/Contrato',
      request
    )
  }
};

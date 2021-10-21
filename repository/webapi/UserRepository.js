import WebApiService from './WebApiService';
import {
  WEB_API_DEMO_IDMISSION,
  API_IDM_LOGINID,
  API_IDM_APPCODE,
  API_IDM_PASSWORD,
  API_IDM_MERCHANTID,
  WEB_API_KYC_IDMISSION,
  API_IDM_KYC_LOGINID,
  API_IDM_KYC_APPCODE,
  API_IDM_KYC_PASSWORD,
  API_IDM_KYC_MERCHANTID,
  API_DIMMER_LOGIN,
  API_DIMMER_APPCODE,
  API_DIMMER_PASS,
  WEB_API_DIMMER,
} from 'utils/env';

const Repository = WebApiService();
const DimmApi = WebApiService();
const MiddlewareDimerAppDemo = WebApiService(WEB_API_DEMO_IDMISSION);
const MiddlewareDimerAppKYC = WebApiService(WEB_API_KYC_IDMISSION);
//const resource = '/IDS/service';
const resource = '/SendSoap/FaceMatch';
//const rscSDK = '/integ/idm/thirdparty';
/*const xmlConfig = {
  headers: {'Content-Type': 'text/xml'},
};*/
const xmlConfig = {
  headers: {'Content-Type':'application/xml'},
};

export default {
  queryUser({phone}) {
    const request = {
      requestCredentials: {
        loginId: API_DIMMER_LOGIN,
        applicationCode: API_DIMMER_APPCODE,
        password: API_DIMMER_PASS,
      },
      phone,
    };

    return Repository.post('/QueryDev/core/Service/QueryUser', request);
  },
  /**
   * @Author: JuanDeDios
   * @Date: 2020-02-07 15:15:30
   * @Desc:  Obtener los datos de un cliente ya registrado
   */
  getProfileData({phone, email}) {
    const xmlRequest = `
    <?xml version="1.0" encoding="utf-8"?>
      <Interface>
        <Customer_Interface>
          <SearchRQ>
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
                  <Phone_Data>
                    <Type>CELL</Type>
                    <Number>${phone}</Number>
                  </Phone_Data>
                </Person>
              </Type>
            </Customer_Data>
            <Search_Data>
                <Additional_Data>
                  <Parameter_Name></Parameter_Name>
                  <Parameter_Value>${email}</Parameter_Value>
                </Additional_Data>
              </Search_Data>
          </SearchRQ>
        </Customer_Interface>
      </Interface>`;

    return MiddlewareDimerAppDemo.post(
      `${resource}/ids`,
      xmlRequest,
      xmlConfig,
    );
  },

  /**
   * @Author: AZozaya
   * @Date: 2020-02-07 15:21:33
   * @Desc: Obtiene los datos de un documento por OCR
   */
  getINEData({requestDate, uid, imgSelfie, imgFrontINE, imgBackINE}) {
    const request = `
    <ThirdPartyFormUpdateRQ>
      <security_Data>
        <unique_Data>
          <login_Data>
            <login_Id/>
            <application_Code/>
          </login_Data>
        </unique_Data>
        <password/>
        <merchant_Id/>
      </security_Data>
      <formDetails>
        <formKey>IDMTPIA_${requestDate}_${uid}</formKey>
        <productId>920</productId>
        <identity_Validation_and_Face_Matching>
          <idmission_Image_Processing>
            <id_Image_Processing>
              <id_Type>VID</id_Type>
              <id_Country>MEX</id_Country>
              <id_State/>
              <id_Image_Front>{"fileContent":"${imgFrontINE}","type":"data:image/jpeg;base64","name":"FrontId.jpg","isImageControlData":"Y"}</id_Image_Front>
              <id_Image_Back>{"fileContent":"${imgBackINE}","type":"data:image/jpeg;base64","name":"BackId.jpg","isImageControlData":"Y"}</id_Image_Back>
            </id_Image_Processing>
            <customer_Photo_Processing>
              <live_Customer_Photo>{"fileContent":"${imgSelfie}","type":"data:image/jpeg;base64","name":"Live.jpg","isImageControlData":"Y"}</live_Customer_Photo>
              <customer_Photo_for_Face_Matching>{"fileContent":"${imgSelfie}","type":"data:image/jpeg;base64","name":"Facematch.jpg","isImageControlData":"Y"}</customer_Photo_for_Face_Matching>
            </customer_Photo_Processing>
            <employee_Information>
              <company_ID>52283</company_ID>
            </employee_Information>
            <additional_Data>
              <service_ID>10</service_ID>
              <manual_Review_Required>N</manual_Review_Required>
              <bypass_Age_Validation>N</bypass_Age_Validation>
              <bypass_Name_Matching>N</bypass_Name_Matching>
              <deduplication_Required>N</deduplication_Required>
              <need_Immediate_Response>N</need_Immediate_Response>
              <customer_Gender>M</customer_Gender>
              <company_Name>Dimmer_Finsus</company_Name>
              <company_ID_For_Customer>52283</company_ID_For_Customer>
              <intrinsicLoginID>ev_integ_52283</intrinsicLoginID>
              <intrinsicMerchantID>31867</intrinsicMerchantID>
            </additional_Data>
            <biometric_Information/>
          </idmission_Image_Processing>
        </identity_Validation_and_Face_Matching>
        <transition>
          <name>Draft</name>
        </transition>
        <searchName>IDS_FINAL_SUBMIT</searchName>
      </formDetails>
    </ThirdPartyFormUpdateRQ>`;
    /*return MiddlewareDimerAppKYC.post(
      `${resource}${rscSDK}/upsert`,
      xmlRequest,
      xmlConfig,
    );*/
    return DimmApi.post('/SendSoap/FaceMatch', request, xmlConfig);
  },

  getDomicileProofData({requestDate, uid, imgFront}) {
    const xmlRequest = `
    <ThirdPartyFormUpdateRQ>
      <Security_Data>
        <Unique_Data>
          <Login_Data>
            <Login_Id>${API_IDM_KYC_LOGINID}</Login_Id>
            <Application_Code>${API_IDM_KYC_APPCODE}</Application_Code>
          </Login_Data>
        </Unique_Data>
        <Password>${API_IDM_KYC_PASSWORD}</Password>
        <Merchant_Id>${API_IDM_KYC_MERCHANTID}</Merchant_Id>
      </Security_Data>
      <FormDetails>
        <FormKey>IDMTPIA_${requestDate}_${uid}</FormKey>
        <ProductId>920</ProductId>
        <Identity_Validation_and_Face_Matching>
          <IDmission_Image_Processing>
            <ID_Image_Processing>
              <ID_Type>OTH</ID_Type>
              <ID_Country>MEX</ID_Country>
              <ID_State/>
              <ID_Image_Front>{"isImageControlData":"Y","type":"data:image\/jpeg;base64","name":"Dummy.png","imageQuality":"0.92","fileUploadType":"Y","formKey":"IDMTPIA_${requestDate}_${uid}","fieldId":"","isWatermarked":"N","suspectedTampering":"N","fileContent":"${imgFront}"}</ID_Image_Front>
            </ID_Image_Processing>
            <Employee_Information>
              <Company_ID>52283</Company_ID>
            </Employee_Information>
            <Additional_Data>
              <Service_ID>20</Service_ID>
              <Manual_Review_Required>N</Manual_Review_Required>
              <Bypass_Age_Validation>N</Bypass_Age_Validation>
              <Bypass_Name_Matching>N</Bypass_Name_Matching>
              <Deduplication_Required>N</Deduplication_Required>
              <Need_Immediate_Response>N</Need_Immediate_Response>
              <Customer_Gender>M</Customer_Gender>
              <Company_Name>Dimmer_SandBox</Company_Name>
              <Company_ID_For_Customer>52283</Company_ID_For_Customer>
              <IntrinsicLoginID>ev_integ_52283</IntrinsicLoginID>
              <IntrinsicMerchantID>31867</IntrinsicMerchantID>
            </Additional_Data>
            <Biometric_Information/>
          </IDmission_Image_Processing>
        </Identity_Validation_and_Face_Matching>
        <Transition>
          <Name>Draft</Name>
        </Transition>
        <SearchName>IDS_FINAL_SUBMIT</SearchName>
      </FormDetails>
    </ThirdPartyFormUpdateRQ>`;

    return MiddlewareDimerAppKYC.post(
      `${resource}${rscSDK}/upsert`,
      xmlRequest,
      xmlConfig,
    );
  },
};

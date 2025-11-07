from django.urls import path, re_path
from . import views
from Screening.views import *
urlpatterns = [
    


# ---------------------------Registration, Login, Logout ------------------------------------------------------

    path('register/', UserRegistrationView.as_view(), name='register'),#Added Authuntication & Authorization Token
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),#Added Authuntication & Authorization Token
    path('User_GET/', views.register_user_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('User_PUT/<int:pk>/', views.register_user_put_info_ViewSet1),#Added Authuntication & Authorization Token
    path('User_DELETE/<int:pk>/<int:user_id>/', views.register_user_delete_info_ViewSet1),#Added Authuntication & Authorization Token
    path('User_GET_ID/<int:pk>/', views.register_user_get_info_ViewSet1_id_wise),#Added Authuntication & Authorization Token 
    
    
    
    
    
    
    
    
    
    
    path('pro_login/',views.ProfessionalOTPLogin.as_view()),
    path('pro_otp_chk/',views.OTPCHECK.as_view(),name="OTPCHECK"),
    

    
    # ________________ Age_GET __________________
    path('Age_GET/', views.agg_age_ViewSet_GET),#Added Authuntication & Authorization Token 
    path('Gender_GET/', views.agg_gender_ViewSet_GET),#Added Authuntication & Authorization Token 
    
    path('Age_GET/<int:source_id>/<int:source_name_id>/', views.agg_age_ViewSet_GET),#Added Authuntication & Authorization Token 
    # ________________ End Gender_GET __________________

    #______________________________ DISEASE _____________________________________________
    path('child_disease_info_get/',views.agg_sc_get_disease_info_ViewSet1),#Added Authuntication & Authorization Token      
    #______________________________ End DISEASE _____________________________________________
   
    # __________________ Source Name __________________
    path('Source_Get/', views.source_name_ViewSet_GET),

    # _________________ source GET PUT POST DELETE ____________________
    path('source_GET/', views.agg_source_ViewSet_GET),  
 

    path('calculate/<int:height>/<int:weight>/', views.calculate_bmi, name='calculate-bmi'),

    
    
    path('get_role/',views.role_get_info_ViewSet1),
   
    path('get_auditory/',views.auditory_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_eye_checkbox/',views.eye_checkbox_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_checkbox/',views.checkbox_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('get_immunisation/',views.immunisation_get_info_ViewSet1),#Added Authuntication & Authorization Token 

    


#-------------------------------Basic Information (Genral Examination)---------------------------------#
    path('head_scalp/',views.head_scalp_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('hair_color/',views.hair_color_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('hair_density/',views.hair_density_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('hair_texture/',views.hair_texture_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('alopecia/',views.alopecia_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('neck/',views.neck_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('nose/',views.nose_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('skin_color/',views.skin_color_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('skin_texture/',views.skin_texture_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('skin_lension/',views.skin_lension_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('lips/',views.lips_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('gums/',views.gums_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('dentition/',views.dentition_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('oral_mucosa/',views.oral_mucosa_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('tounge/',views.tounge_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('chest/',views.chest_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('abdomen/',views.abdomen_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('extremity/',views.extremity_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Systemic Exam)---------------------------------#
    path('rs_right/',views.rs_right_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('rs_left/',views.rs_left_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('cvs/',views.cvs_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('varicose_veins/',views.varicose_veins_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('lmp/',views.lmp_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('cns/',views.cns_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('reflexes/',views.reflexes_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('rombergs/',views.rombergs_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('pupils/',views.pupils_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('pa/',views.pa_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('tendernes/',views.tenderness_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('ascitis/',views.ascitis_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('guarding/',views.guarding_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('joints/',views.joints_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('swollen_joints/',views.swollen_joints_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('spine_posture/',views.spine_posture_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information ( Disability Screening )---------------------------------#
    path('language_delay/',views.language_delay_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('behavioural_disorder/',views.behavioural_disorder_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('speech_screening/',views.speech_screening_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Birth Defects )---------------------------------#
    path('birth_defect/',views.birth_defect_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Childhood disease )---------------------------------#
    path('childhood_disease/',views.childhood_disease_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Deficiencies )---------------------------------#
    path('deficiencies/',views.deficiencies_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Skin Condition )---------------------------------#
    path('skin_conditions/',views.skin_conditions_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Check Box if Normal )---------------------------------#
    path('check_box/',views.check_box_if_normal_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Diagnosis )---------------------------------#
    path('diagnosis/',views.diagnosis_get_info_ViewSet1),#Added Authuntication & Authorization Token 
#-------------------------------Basic Information (Treatment )---------------------------------#
    path('referral/',views.referral_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('place_referral/',views.place_referral_get_info_ViewSet1), #Added Authuntication & Authorization Token 
    
    path('calculate_days/<str:dob>/<int:immunisation_pk_id>/', CalculateDaysView.as_view(), name='calculate_days'),#Added Authuntication & Authorization Token
    
    
    path('follow_up_dropdown_list/', views. followup_dropdown_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow_up_for/', views. followup_for_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow_status/', views. follow_up_status_citizen_info_ViewSet1),#Added Authuntication & Authorization Token
    
    #-------------kirti----------

    path('followupdropdown_get/', views.followup_dropdown_get.as_view(), name='followup_get'),
    path('followupfor_get/', views.followup_for_get.as_view(), name='followupfor_get'),
    path('Workshop_name_get/', views.Workshop_get_APi2.as_view(), name='Workshop_name_get'),
    # path('follow_up_refer_citizen/', views.follow_up_refer_citizen.as_view(), name='follow_up_refer_citizen_get'),
    # path('follow_up_get_citizen/<str:citizen_id>/', views.follow_up_get_citizen.as_view(), name='follow_up_get_citizen'),
    path('follow_up_status_citizen/', views.follow_up_status_citizen.as_view(), name='follow_up_status_citizen'),
    path('follow_up_citizen_info/<str:citizen_id>/', views.follow_up_citizen_info.as_view(), name='follow_up_citizen_info'),
    path('followup_save/<int:follow_up_pk_id>/', views.FollowupPOST.as_view(), name='followup_save'),
    path('follow_up_citizen_info2/<str:citizen_id>/<int:screening_citizen_id>/', views.follow_up_citizen_info2.as_view(), name='follow_up_citizen_info'),
    


    
    path('citizen_medical_history/', views. medical_history_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_past_operative_history/', views. past_operative_history_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('bad_habbits/', views. bad_habbits_get_info_ViewSet1),#Added Authuntication & Authorization Token

    path('audio_reading/<int:reading>/',views.audio_reading_get_api.as_view()),#Added Authuntication & Authorization Token  
    path('left_reading/<int:hz_500_left>/<int:hz_1000_left>/<int:hz_2000_left>/', views.LeftReading.as_view()),#Added Authuntication & Authorization Token  
    path('right_reading/<int:hz_500_right>/<int:hz_1000_right>/<int:hz_2000_right>/', views.RightReading.as_view()),#Added Authuntication & Authorization Token  

    
    path('Hospital_List/', Hospital_list_GET_API_APIView.as_view(), name='Hospital_List'),
    
    
    
    
    #_________________________Source-Wise Role GET API_____________________________
    path('agg_role_info_get/<str:source>',views.agg_sc_role_from_source_api.as_view()),#Added Authuntication & Authorization Token
    path('permission/', views.permission_get),#Added Authuntication & Authorization Token
    

    #----------------mayank permission model and Dashboard and Healthcard and search and filters and followup-------------------------------
    path('modules/<int:source_id>/', PermissionModuleAPIView.as_view(), name='permission-modules'),#Added Authuntication & Authorization Token
    path('submodules/<int:source_id>/', PermissionSUBAPIView.as_view(), name='permission-modules'),#Added Authuntication & Authorization Token
    path('combined/', CombinedAPIView.as_view(), name='combined-api'),#Added Authuntication & Authorization Token
    path('permissions/<source>/<role>/', GetPermissionAPIView.as_view(), name='get_permissions'),#Added Authuntication & Authorization Token
    path('permissions/', CreatePermissionAPIView.as_view(), name='create_permission'),#Added Authuntication & Authorization Token
    path('permissions/<int:id>/', UpdatePermissionAPIView.as_view(), name='update_permission'),#Added Authuntication & Authorization Token
   
    path('filter-User/', UserDataFilterAPIView.as_view(), name='filter_citizens_api'),#Added Authuntication & Authorization Token
    
    
    

    
    path('video_anaysis/', VideoAnalysisLinkAPI.as_view(), name='video_anaysis'),
    path('image_to_text/', views.image_to_text, name='image_to_text'),
    
    path('Saved_image/', Saved_image_api.as_view(), name='Saved_image'),
    path('saved_image_get/', saved_image_get_api.as_view(), name='saved_image_get'),
    
    
    path('upload_360_image/', UploadAndGenerate360ImageView.as_view(), name='upload_360_image'),
    
    path('QRCode/', QRCodeGenerateAPIView.as_view(), name='QRCode'),
    path('dental_image_analyse/', DentalScreeningAPIView.as_view(), name='dental_image_analyse'),
       
    
    #-----------------------Location API-----------------------
    
    path('location_get_api/', location_get_APIView.as_view(), name='location_get_api'),

    




    # _________________ SAM MAM ___________________________
   path('SAM_MAM_BMI/<int:year>/<int:month>/<str:gender>/<str:height>/<str:weight>/', SAM_MAM_BMI_Serializer_ViewSet.as_view(), name='weight-comparison'),
#    path('SAM_MAM_BMI/<int:year>/<int:month>/<str:gender>/<str:height>/<str:weight>/', SAM_MAM_BMI_Serializer_ViewSet.as_view(), name='weight-comparison'),
#    path('SAM_MAM_BMI/<int:year>/<int:month>/<str:gender>/<str:height>/<str:weight>/', SAM_MAM_BMI_Serializer_ViewSet.as_view(), name='weight-comparison'),

    # path('SAM_MAM_BMI/<str:sour>', views.SAM_MAM_BMI_Serializer_ViewSet.as_view()),
    
    
    
    
    
    
    
    
    
    
    
    
    
    #--------------------------------Tata Screening Project API's -------------------------------------#
    
    path('State_Get/',State_Get_Api.as_view(),name='State_Get'),
    path('District_Get/<int:state_name>/',District_Get_Api.as_view(),name='District_Get'),
    path('Tehsil_Get/<int:dist_name>/',Tehsil_Get_Api.as_view(),name='Tehsil_Get'),
    
    path('GET_Screening_List/', GET_Screening_List_View.as_view(), name='GET_Screening_List'),
    path('Screening_sub_list/', Screening_sub_list_Viewset.as_view(), name='Screening_sub_list'),
    
    path('Citizen_Post/', Citizen_Post_Api.as_view(), name='Citizen_Post'),
    path('Citizen_Get/', Citizen_Get_Api.as_view(), name='Citizen_Get'),
    path('Citizen_Get_Idwise/<int:citizens_pk_id>/', Citizen_idwise_data_Get_Api.as_view(), name='Citizen_Get_idwise'),
    path('Citizen_Put_api/<int:citizens_pk_id>/', Citizen_Update_API.as_view(), name='Citizen_Put_api'),
    
    path('Workshop_Post/', Workshop_Post_Api.as_view(), name='Workshop_Post'),
    path('Workshop_Get/', Workshop_Get_Api.as_view(), name='Workshop_Get'),
    path('Workshop_Update/<int:ws_pk_id>/', Workshop_Update_API.as_view(), name='Workshop_Get'),
    path('Category_Get/', Category_Get_Api.as_view(), name='Category_Get'),
    
    
    
    path('Start_Screening/<int:citizen_pk_id>/', CheckCitizenScreening.as_view(), name='Start_Screening'),   
    path('SaveBasicInfo/<int:pk_id>/', BasicInfoSaveAPI.as_view(), name='save_basic_info'), 
    path('SaveEmergencyInfo/<int:pk_id>/', EmergencyInfoSaveAPI.as_view(), name='SaveEmergencyInfo'),
    path('SaveGrowthMonitoringInfo/<int:pk_id>/', GrowthMonitoringInfoSaveAPI.as_view(), name='SaveGrowthMonitoringInfo'),  
    
    path('CitizenBasicInfo/<int:citizen_pk_id>/', Citizen_BasicInfo_Update_API.as_view(), name='CitizenBasicInfo'),
    path('Citizen_emergency_put/<int:citizen_pk_id>/', Emergency_Info_Update_API.as_view(), name='Citizen_emergency_put'),
    path('Citizen_growth_monitoring_put/<int:growth_pk_id>/', GrowthMonitoringInfoUpdateAPI.as_view(), name='Citizen_growth_monitoring_put'),
    
    
    path('pulse_get_api/<int:year>/<int:pulse>/',views.pulse_get_api.as_view()), 
    path('rr_get_api/<int:year>/<int:rr>/',views.rr_get_api.as_view()),
    path('temp_get_api/<int:year>/<int:temp>/',views.temp_get_api.as_view()), 
    # path('hb_get_api/<int:gender>/<int:year>/<path:hb>/',views.hb_get_api.as_view()), 
    path('sys_get_api/<int:year>/<int:sys>/',views.sys_get_api.as_view()), 
    path('dys_get_api/<int:year>/<int:dys>/',views.dys_get_api.as_view()),
    path('o2sat_get_api/<int:year>/<int:o2sat>/',views.o2sat_get_api.as_view()),
    
    path('Vital_Info_Post/<int:pk_id>/', Vital_Post_Api.as_view(), name='Vital_Info_Post'),
    path('Vital_Info_Get/<int:pk_id>/', Vital_info_Get_api.as_view(), name='Vital_Info_Get'),
    path('device_data/', DeviceDataView.as_view(), name='device_data'),
    
    
    
    path('genral_examination_post_api/<int:pk_id>/', Genral_Examination_Post_API.as_view(), name='genral_examination_post_api'),
    path('genral_examination_get_api/<int:pk_id>/', Genral_Examination_Get_Api.as_view(), name='genral_examination_post_api'),
    
    
    path('systemic_examination_post_api/<int:pk_id>/', Systemic_Examination_Post_API.as_view(), name='systemic_examination_post_api'),
    path('systemic_examination_get_api/<int:pk_id>/', Systemic_Examination_Get_API.as_view(), name='systemic_examination_get_api'),

    path('female_screening_post_api/<int:pk_id>/', Female_Screening_Post_API.as_view(), name='female_screening_post_api'),
    path('female_screening_get_api/<int:pk_id>/', Female_Screening_Get_API.as_view(), name='female_screening_get_api'),
    
    path('disability_screening_post_api/<int:pk_id>/', Disability_Screening_Post_API.as_view(), name='disability_screening_post_api'),
    path('disability_screening_get_api/<int:pk_id>/', Disability_Screening_Get_API.as_view(), name='disability_screening_get_api'),
    
    path('birth_defect_post_api/<int:pk_id>/', Birth_Defect_Post_API.as_view(), name='birth_defect_post_api'),
    path('birth_defect_get_api/<int:pk_id>/', Birth_Defect_Get_API.as_view(), name='birth_defect_get_api'),
    
    path('childhood_disease_post_api/<int:pk_id>/', Childhood_Diseases_Post_API.as_view(), name='childhood_disease_post_api'),
    path('childhood_disease_get_api/<int:pk_id>/', Childhood_Disease_Get_API.as_view(), name='childhood_disease_get_api'),
    
    path('deficiencies_post_api/<int:pk_id>/', Deficiencies_Post_API.as_view(), name='deficiencies_post_api'),
    path('deficiencies_get_api/<int:pk_id>/', Deficiencies_Get_API.as_view(), name='deficiencies_get_api'),
    
    path('skincondition_post_api/<int:pk_id>/', SkinCondition_Post_API.as_view(), name='skincondition_post_api'),
    path('skincondition_get_api/<int:pk_id>/', SkinCondition_Get_API.as_view(), name='skincondition_get_api'),
    
    path('checkboxifnormal_post_api/<int:pk_id>/', CheckBoxIfNormal_Post_API.as_view(), name='checkboxifnormal_post_api'),
    path('checkboxifnormal_get_api/<int:pk_id>/', CheckBoxIfNormal_Get_API.as_view(), name='checkboxifnormal_get_api'),
    
    path('diagnosis_post_api/<int:pk_id>/', Diagnosis_Post_API.as_view(), name='diagnosis_post_api'),
    path('diagnosis_get_api/<int:pk_id>/', Diagnosis_Get_API.as_view(), name='diagnosis_get_api'),
    
    path('treatment_post_api/<int:pk_id>/', Treatment_Post_API.as_view(), name='treatment_post_api'),
    path('treatment_get_api/<int:pk_id>/', Treatment_Get_API.as_view(), name='treatment_get_api'),
    
    path('auditory_post_api/<int:pk_id>/', Auditory_Post_API.as_view(), name='auditory_post_api'),
    path('auditory_get_api/<int:pk_id>/', Auditory_Get_API.as_view(), name='auditory_get_api'),
    
    path('vision_post_api/<int:pk_id>/', Vision_Info_Post_Api.as_view(), name='vision_post_api'),
    path('vision_get_api/<int:pk_id>/', Vision_Info_Get_API.as_view(), name='vision_get_api'),
    
    path('medical_post_api/<int:pk_id>/', Medical_history_info_Post_API.as_view(), name='medical_post_api'),
    path('medical_get_api/<int:pk_id>/', Medical_history_info_Get_API.as_view(), name='medical_get_api'),
    
    
    path('pft/<int:reading>/',views.pft_get_api.as_view()),
    path('pft_post_api/<int:pk_id>/', PFT_Post_info_Post_API.as_view(), name='pft_post_api'),
    path('pft_get_api/<int:pk_id>/', PFT_Info_Get_API.as_view(), name='pft_get_api'),
    
    
    path('dental_post_api/<int:pk_id>/', Dental_Info_Post_Api.as_view(), name='dental_post_api'),
    path('dental_get_api/<int:pk_id>/', Dental_Info_Get_API.as_view(), name='dental_get_api'),
    
    path('immunisation_post_api/<int:pk_id>/', Immunisation_Info_Post_Api.as_view(), name='immunisation_post_api'),
    path('immunisation_get_api/<int:pk_id>/', Immunisation_Info_Get_API.as_view(), name='immunisation_get_api'),
    
    path('investigation_post_api/<int:pk_id>/', Investigation_Info_Post_Api.as_view(), name='investigation_post_api'),
    path('investigation_get_api/<int:pk_id>/', Investigation_Info_Get_API.as_view(), name='investigation_get_api'),
    
    
    # *******************************************Dashboard APIs******************************************
    path('total_driver_count/', TotalDriverReg_Dashboard_API.as_view(), name='TotalDriverReg_Dashboard_API'),
    path('health_score_count/', Health_Score_API.as_view(), name='Health_Score_API'),
    path('bmi_vitals_count/', BMI_Vitals_dashboard_API.as_view(), name='BMI_Vitals_dashboard_API'),

    
    path('healthcard_citizen_list/', Healthcard_Citizen_List.as_view(), name='healthcard_citizen_list'),
    path('screening_count_api/',Screening_Count_API.as_view(),name='screening_count_api'),
    
    path('healthcard_download/<str:citizen_id>/<int:screening_count>/', Healthcard_Download_API.as_view(), name='healthcard_download'),
    
                 
]
    


from django.urls import path, re_path
# from Com.views import BookViewSet,
from . import views
from Screening.views import *
# from Screening.views import   agg_ind_state_List_ViewSet,agg_ind_state_List_ViewSet1
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
    path('Source_Get/', views.source_name_ViewSet_GET),#Added Authuntication & Authorization Token                                                  # Get Source    [Soure]
    path('Source_SourceName_Get/<str:SourceN>', views.Source_SourceName_ViewSet_GET.as_view()), #Added Authuntication & Authorization Token          # Get Source - Form Source Name     [Source To Source Name]
    path('Source_state_Get/<str:sour>', views.Source_state_ViewSet_GET.as_view()),#Added Authuntication & Authorization Token                       # Get form Source - Source Name, State      [Source To state]
    path('Source_district_Get/<str:stat>', views.Source_state_district_ViewSet_GET.as_view()),#Added Authuntication & Authorization Token           # Get Add New Source under State - Source, Source Name, State, District     [Souece State To District]

    path('district_SourceName_Get/<str:sour_dis>', views.district_Source_name_and_ViewSet_GET.as_view()),#Added Authuntication & Authorization Token       # Get Add New Source under District - Source, Source Name, State, District   [District To Source Name]

    path('Source_state_district_taluka_sourceName_Get/<str:sour>', views.Source_name_and_district_and_source_ViewSet_GET.as_view()),#Added Authuntication & Authorization Token     # Get Add New Source - Source, Source Name, State, District, Taluka  [Source to District]
    path('district_taluka_SourceName_Get/<str:So>/<str:sour_dis>', views.district_taluka_Source_name_and_ViewSet_GET.as_view()),#Added Authuntication & Authorization Token     # Get Add New Source District- Source, Source Name, State, Taluka  [District to Source Name ]
    path('taluka_SourceName_Get/<str:So>/<str:St>/<str:Di>/<str:Tal>', views.taluka_Source_name_and_ViewSet_GET.as_view()),#Added Authuntication & Authorization Token           # Get Add New Source Taluka- Source, Source Name, State, District,   [Taluka to Source Name ]

    # path('taluka_SourceName_Get/<str:So>/<str:SoN>/', views.Source_SourName_Shedule_id_Views.as_view()),    # Get Add New Source , Source Name, SheduleID,   [Source -> Source Name -> SheduleID ]
    path('Schedule_id_GET/',views.Schedule_id_get_viewset.as_view()),
    

    path('source_and_pass_state_Get/<str:STid>', views.source_from_id_state_api.as_view()),#Added Authuntication & Authorization Token                      # Get form Source - State      [Source To state]
    path('state_and_pass_district_Get/<str:So>/<str:DIid>/', views.state_from_id_district_api.as_view()),#Added Authuntication & Authorization Token                      # Get form state - District      [state To District]
    path('district_and_pass_taluka_Get/<str:So>/<str:TLid>/', views.district_from_id_taluka_api.as_view()),#Added Authuntication & Authorization Token                           # Get form District - Taluka        [District To Taluka]
    # path('taluka_and_pass_SourceName_Get/<str:So>/<str:SNid>/<str:source_pk_id>/', views.taluka_from_id_SourceName_api.as_view()),#Added Authuntication & Authorization Token                            # Get form Taluka - SourceName      [Taluka To SourceName]
    path('district_and_SourceName_Get/<str:DSid>', views.district_from_id_SourceName_api.as_view()),#Added Authuntication & Authorization Token # Get form District - SourceName      [District To SourceName]
    path('taluka_and_pass_SourceName_Get/', source_name_from_taluka_api.as_view(), name='taluka_and_pass_SourceName_Get'),
    path('source_name_from_tahsil/', views.source_name_from_taluka_api.as_view(),name='source_name_from_tahasil'),#Added Authuntication
    
    # __________________ Source Name __________________


    # _________________ source GET PUT POST DELETE ____________________
    path('source_GET/', views.agg_source_ViewSet_GET),  #Added Authuntication & Authorization Token                                    # Get Source
    
    # # path('source_POST/', views.agg_source_ViewSet_POST),
    # # path('source_PUT/<int:pk>/', views.agg_source_ViewSet_PUT),
    # # path('source_DELETE/<int:pk>/', views.agg_source_ViewSet_DELETE),
    # path('Source_Source_name_Get/', views.agg_sc_source_source_name_ViewSet_GET),
    # _________________________ End source GET PUT POST DELETE _______________________________

    # _________________ Add New Source GET PUT POST DELETE ____________________
    path('add_new_source_GET/', views. agg_sc_add_new_source_ViewSet_GET),   #Added Authuntication & Authorization Token
    # path('add_new_source_GET/', views. agg_sc_add_new_source_ViewSet_GET),                       # Add New Source View data
    path('add_new_source_POST/', views. agg_sc_add_new_source_ViewSet_POST),                        # New Source View data    #Added Authuntication & Authorization Token
    path('add_new_source_PUT/<int:pk>/', views. agg_sc_add_new_source_ViewSet_PUT),                 # Edit new Source View data    #Added Authuntication & Authorization Token
    path('add_new_source_DELETE/<int:pk>/<int:user_id>/', views. agg_sc_add_new_source_ViewSet_DELETE),           # Delete New Source View data   #Added Authuntication & Authorization Token
    path('add_new_source_GET_ID_WISE/<int:pk>/', views. agg_sc_add_new_source_ViewSet_GET_ID_WISE),  #Added Authuntication & Authorization Token
    
    # _________________________ End Add New Source GET PUT POST DELETE _______________________________
    
    # _________________ Add New Schedule GET PUT POST DELETE ____________________
    # path('add_schedule_screening_GET/', views.  agg_sc_schedule_screening_ViewSet_GET),
    path('add_schedule_screening_GET/', agg_sc_schedule_screening_ViewSet_GET.as_view(), name='add_schedule_screening_GET'),# Schedule Screening View Get         #Added Authuntication & Authorization Token
    path('add_schedule_screening_POST/', views.  agg_sc_schedule_screening_ViewSet_POST),                   # Schedule Screening Post             #Added Authuntication & Authorization Token
    path('add_schedule_screening_PUT/<int:pk>/', views.  agg_sc_schedule_screening_ViewSet_PUT),            # Schedule Screening Edit             #Added Authuntication & Authorization Token
    path('add_schedule_screening_DELETE/<int:pk>/', views.  agg_sc_schedule_screening_ViewSet_DELETE),      # Schedule Screening Delete
    path('add_schedule_screening_GET_ID/<int:pk>/', views.  agg_sc_schedule_screening_ViewSet_GET_ID_WISE), # Schedule Screening View Get ID WISE #Added Authuntication & Authorization Token
    path('close_schedule_screening/<int:pk>/<int:user_id>/', schedule_screening_close, name='close_schedule_screening'),#Added Authuntication & Authorization Token
    # _________________________ End Add New Schedule GET PUT POST DELETE _______________________________

    #______________________________ADD NEW CITIZENS___________________________________
    path('add_citizen_get/',views.agg_sc_add_new_citizen_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('add_citizen_post/',views.agg_sc_add_new_citizen_post_info_ViewSet1),#Added Authuntication & Authorization Token
    path('add_citizen_put/<int:pk>/',views.agg_sc_add_new_citizen_put_info_ViewSet1),#Added Authuntication & Authorization Token
    path('add_citizen_delete/<int:pk>/<int:user_id>/',views.agg_sc_add_new_citizen_delete_info_ViewSet1),#Added Authuntication & Authorization Token
    path('add_citizen_get/<int:pk>/', views.agg_sc_add_new_citizen_get_id_info_ViewSet1),#Added Authuntication & Authorization Token
    #______________________________END ADD NEW CITIZENS________________________________
    
    #______________________________ADD NEW EMPLOYEE___________________________________
    # path('add_citizen_get/',views.agg_sc_add_new_citizen_get_info_ViewSet1),
    path('add_employee_post/',views.agg_sc_add_new_employee_post_info_ViewSet1),#Added Authuntication & Authorization Token
    path('add_employee_get/<int:pk>/',views.agg_sc_add_new_employee_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('add_employee_put/<int:pk>/',views.agg_sc_add_new_employee_put_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_department/<int:source_id>/<int:source_name_id>/',views.agg_sc_department_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_designation/<int:department_id>/<int:source_id>/<int:source_name_id>/',views.agg_sc_designation_get_info_ViewSet1),#Added Authuntication & Authorization Token
    
    
    
    
    #______________________________END ADD NEW EMPLOYEE________________________________
    

    #______________________________Start Screening____________________________________________________
    # path('citizen_start_screening_info_get/',views.start_screening_info_ViewSet1), Mohin
    # path('citizen_growth_monitoring_info_get/<float:height>/<float:weight>/',views.agg_sc_get_growth_monitoring_info_ViewSet1),




    # ________________________________ Final __________________________________________________
    
    path('combined_data/', CombinedDataView.as_view(), name='combined_data'),
    
    path('citizen_growth_monitoring_info_get/',views.agg_sc_get_growth_monitoring_info_ViewSet1),
    # path('add_citizen_id_get/<int:pk>',views.agg_sc_add_new_citizen_get_id_info_ViewSet1),

    
    
    
    path('calculate/<int:height>/<int:weight>/', views.calculate_bmi, name='calculate-bmi'),

    
    
    path('get_role/',views.role_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('scrstart/<str:source_name>', views.startscr.as_view()),#Added Authuntication & Authorization Token
    path('start_screening_info/',views.agg_sc_get_start_screening_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('start_screening_info/<int:source_id>/',views.agg_sc_get_start_screening_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('start_screening_info/<int:source_id>/<int:type_id>/',views.agg_sc_get_start_screening_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('start_screening_info/<int:source_id>/<int:type_id>/<int:class_id>/',views.agg_sc_get_start_screening_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('start_screening_info/<int:source_id>/<int:type_id>/<int:class_id>/<int:schedule_count>/',views.agg_sc_get_start_screening_info_ViewSet1), #Added Authuntication & Authorization Token       
    path('citizen_basic_info_get/<int:pk>/',views.agg_sc_get_citizen_basic_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_family_info_get/<int:pk>/',views.agg_sc_get_citizen_family_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_growth_info_get/<int:pk>/',views.agg_sc_get_citizen_growthmonitring_info_ViewSet1),#Added Authuntication & Authorization Token
    # path('citizen_vital_info_post/',views.agg_sc_post_citizen_vital_info_ViewSet1),
    # path('Screening_for_type_get/<int:pk>/',views.agg_sc_screening_for_type_ViewSet1),
    path('screening_for_type_get/<str:sourtype>',views.agg_sc_screening_for_type_ViewSet1.as_view()),#Added Authuntication & Authorization Token
    path('get_class/',views.class_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_division/',views.division_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_auditory/',views.auditory_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_audit_info_post/<int:schedule_pk>', CitizenauditInfoPost.as_view(), name='CitizenauditInfoPost'),#Added Authuntication & Authorization Token
    path('citizen_dental_info_post/<int:schedule_pk>', CitizenDentalInfoPost.as_view(), name='CitizenDentalInfoPost'),#Added Authuntication & Authorization Token
    path('citizen_pycho_info_post/<int:schedule_pk>', CitizenPychoInfoPost.as_view(), name='CitizenPychoInfoPost'),#Added Authuntication & Authorization Token
    path('get_eye_checkbox/',views.eye_checkbox_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('get_checkbox/',views.checkbox_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('citizen_vision_info_post/<int:schedule_pk>', CitizenVisionInfoPost.as_view(), name='CitizenVisionInfoPost'),#Added Authuntication & Authorization Token 
    path('citizen_vital_info_post/<int:schedule_pk>', CitizenVitalInfoPost.as_view(), name='citizen_vital_info_post'),#Added Authuntication & Authorization Token 
    path('citizen_basic_screening_info_post/<int:schedule_pk>', CitizenBasicScreeningInfoPost.as_view(), name='CitizenBasicScreeningInfoPost'),
    path('get_immunisation/',views.immunisation_get_info_ViewSet1),#Added Authuntication & Authorization Token 
    path('citizen_immunisation_info_post/<int:schedule_pk>', CitizenImmunisationInfoPost.as_view(), name='CitizenImmunisationInfoPost'),#Added Authuntication & Authorization Token 
    path('citizen_other_info_post/<int:schedule_pk>', CitizenOtherInfoPost.as_view(), name='CitizenOtherInfoPost'),#Added Authuntication & Authorization Token 
    
    


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
    
    
    path('symmetric_exam/<int:basic_screening_pk_id>/',views.Symmetric_exam_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('disability_screening/<int:basic_screening_pk_id>/',views.disability_screening_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('birth_defect/<int:basic_screening_pk_id>/',views.birth_defect_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('childhood_disease/<int:basic_screening_pk_id>/',views.childhood_disease_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('deficiencies/<int:basic_screening_pk_id>/',views.deficiencies_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('skincondition/<int:basic_screening_pk_id>/',views.skincondition_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('checkboxifnormal/<int:basic_screening_pk_id>/',views.checkboxifnormal_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('diagnosis/<int:basic_screening_pk_id>/',views.diagnosis_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('treatment/<int:basic_screening_pk_id>/',views.treatment_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    path('female_screening/<int:basic_screening_pk_id>/',views.Female_screening_put_info_ViewSet1),#Added Authuntication & Authorization Token  
    
    

    
    
    path('calculate_days/<str:dob>/<int:immunisation_pk_id>/', CalculateDaysView.as_view(), name='calculate_days'),#Added Authuntication & Authorization Token
    path('citizen_basic_info_put/<str:citizen_id>/', views. agg_sc_put_citizen_basic_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_family_info_put/<str:citizen_id>/', views. agg_sc_put_citizen_family_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_growth_info_put/<str:citizen_id>/', views. agg_sc_put_citizen_growth_info_ViewSet1),#Added Authuntication & Authorization Token
    # path('citizen_basic_info_put/<int:pk>/', views. agg_sc_put_citizen_basic_info_ViewSet1),
    # path('citizen_family_info_put/<int:pk>/', views. agg_sc_put_citizen_family_info_ViewSet1),
    # path('citizen_growth_info_put/<int:pk>/', views. agg_sc_put_citizen_growth_info_ViewSet1),
    path('citizen_vital_info_put/<int:pk>/', views. agg_sc_put_citizen_vital_info_ViewSet1),#Added Authuntication & Authorization Token
    
    
    # path('citizen_vital_info_get/<int:schedule_pk>',views.agg_sc_get_vital_info_ViewSet1),
    path('citizen_vital_info_get/<int:schedule_pk>/', agg_sc_get_vital_info_ViewSet1.as_view(), name='citizen_vital_info_get'),#Added Authuntication & Authorization Token
    path('citizen_basic_screening_info_get/<int:schedule_pk>/', CitizenBasicScreeninginfoViewSet.as_view(), name='citizen_basic_screening_info_get'),#Added Authuntication & Authorization Token
    path('citizen_immunisation_info_get/<int:schedule_pk>/', CitizenImmunizationInfoViewSet.as_view(), name='citizen_immunisation_info_get'),#Added Authuntication & Authorization Token
    path('citizen_auditory_info_get/<int:schedule_pk>/', AuditoryInfoViewSet.as_view(), name='citizen_auditory_info_get'),#Added Authuntication & Authorization Token
    path('citizen_dental_info_get/<int:schedule_pk>/', CitizenDentalInfoViewSet.as_view(), name='citizen_dental_info_get'),#Added Authuntication & Authorization Token
    path('citizen_vision_info_get/<int:schedule_pk>/', CitizenVisionInfoViewSet.as_view(), name='citizen_vision_info_get'),#Added Authuntication & Authorization Token
    path('citizen_pycho_info_get/<int:schedule_pk>/', CitizenPychoInfoViewSet.as_view(), name='citizen_pycho_info_get'),#Added Authuntication & Authorization Token
    path('citizen_medical_event_info_get/<int:schedule_pk>/', CitizenmedicalevenInfoViewSet.as_view(), name='citizen_medical_event_info_get'),#Added Authuntication & Authorization Token
    
    path('follow_up_dropdown_list/', views. followup_dropdown_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow_up_for/', views. followup_for_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('source_name_get/', views. source_name_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('refered_citizen_get/', views. follow_up_refer_citizen_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow_up/', views. agg_followup_ViewSet_POST),
    path('followup/<int:follow_up_ctzn_pk>/', agg_followup_ViewSet_POST, name='followup'),#Added Authuntication & Authorization Token
    path('follow_up_citizen_get/<str:citizen_id>/<str:schedule_id>/', views. follow_up_get_citizen_info_ViewSet1),
    path('follow_status/', views. follow_up_status_citizen_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow_up_citizen_get_idwise/<str:citizen_id>/<str:schedule_id>/', views. follow_up_citizen_get_idwise_info_ViewSet1),#Added Authuntication & Authorization Token
    path('followup_citizen_info_get/<str:citizen_id>/', views. follow_up_citizen_get_info_ViewSet1),#Added Authuntication & Authorization Token
    
    #-------------kirti----------

    path('followupdropdown_get/', views.followup_dropdown_get.as_view(), name='followup_get'),
    path('followupfor_get/', views.followup_for_get.as_view(), name='followupfor_get'),
    path('source_name_get/', views.source_name_get.as_view(), name='source_name_get'),
    path('follow_up_refer_citizen/', views.follow_up_refer_citizen.as_view(), name='follow_up_refer_citizen_get'),
    # path('follow_up_get_citizen/<str:citizen_id>/', views.follow_up_get_citizen.as_view(), name='follow_up_get_citizen'),
    path('follow_up_status_citizen/', views.follow_up_status_citizen.as_view(), name='follow_up_status_citizen'),
    path('follow_up_citizen_info/<str:citizen_id>/', views.follow_up_citizen_info.as_view(), name='follow_up_citizen_info'),
    path('followup_save/<int:follow_up_pk_id>/', views.FollowupPOST.as_view(), name='followup_save'),
    path('follow_up_citizen_info2/<str:citizen_id>/<int:screening_citizen_id>', views.follow_up_citizen_info.as_view(), name='follow_up_citizen_info'),








    
    path('citizen_other_info_get/<int:schedule_pk>/', agg_sc_get_other_info_ViewSet1.as_view(), name='citizen_other_info_get'),#Added Authuntication & Authorization Token
    
    path('citizen_medical_history/', views. medical_history_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_past_operative_history/', views. past_operative_history_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_investigation/<int:schedule_pk>', CitizeninvestigationInfoPost.as_view(), name='citizen_investigation'),#Added Authuntication & Authorization Token
    path('report/', views. report_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('bad_habbits/', views. bad_habbits_get_info_ViewSet1),#Added Authuntication & Authorization Token
    path('citizen_investigation_info_get/<int:schedule_pk>/', agg_sc_get_investigation_info_ViewSet1.as_view(), name='citizen_investigation_info_get'),#Added Authuntication & Authorization Token
    path('medical_history/<int:schedule_pk>', CitizenmedicalhistoryInfoPost.as_view(), name='citizen_medical_history'),#Added Authuntication & Authorization Token
    path('medical_history_get/<int:schedule_pk>', agg_sc_get_medical_history_info_ViewSet1.as_view(), name='medical_history_get'),#Added Authuntication & Authorization Token
    path('citizen_pft_info/<int:schedule_pk>', CitizenpftInfoPost.as_view(), name='citizen_pft_info'),#Added Authuntication & Authorization Token
    path('pft_info_get/<int:schedule_pk>', agg_sc_get_pft_info_ViewSet1.as_view(), name='pft_info_get'),#Added Authuntication & Authorization Token
     
    path('form_submit_counts/<str:citizen_id>/<str:schedule_id>/', form_submit_counts, name='form_submit_counts'),

    path('audio_reading/<int:reading>/',views.audio_reading_get_api.as_view()),#Added Authuntication & Authorization Token  
    path('left_reading/<int:hz_500_left>/<int:hz_1000_left>/<int:hz_2000_left>/', views.LeftReading.as_view()),#Added Authuntication & Authorization Token  
    path('right_reading/<int:hz_500_right>/<int:hz_1000_right>/<int:hz_2000_right>/', views.RightReading.as_view()),#Added Authuntication & Authorization Token  

    
    
    path('Report_fields/', CheckAllFieldsFilled.as_view(), name='Report_fields'),
    path('check-fields/<str:citizen_id>/<str:schedule_id>/', CheckAllFieldsFilledValues.as_view(), name='check_all_fields_filled'),

    path('Hospital_List/', Hospital_list_GET_API_APIView.as_view(), name='Hospital_List'),
    
    
    
    
    #_________________________Source-Wise Role GET API_____________________________
    path('agg_role_info_get/<str:source>',views.agg_sc_role_from_source_api.as_view()),#Added Authuntication & Authorization Token
    path('permission/', views.permission_get),#Added Authuntication & Authorization Token
    path('permission_citizen/', views.citizen_permission_get),#Added Authuntication & Authorization Token
    

    #----------------mayank permission model and Dashboard and Healthcard and search and filters and followup-------------------------------
    path('modules/<int:source_id>/', PermissionModuleAPIView.as_view(), name='permission-modules'),#Added Authuntication & Authorization Token
    path('submodules/<int:source_id>/', PermissionSUBAPIView.as_view(), name='permission-modules'),#Added Authuntication & Authorization Token
    path('combined/', CombinedAPIView.as_view(), name='combined-api'),#Added Authuntication & Authorization Token
    path('permissions/<source>/<role>/', GetPermissionAPIView.as_view(), name='get_permissions'),#Added Authuntication & Authorization Token
    path('permissions/', CreatePermissionAPIView.as_view(), name='create_permission'),#Added Authuntication & Authorization Token
    path('permissions/<int:id>/', UpdatePermissionAPIView.as_view(), name='update_permission'),#Added Authuntication & Authorization Token
    # path('Role/<int:source_pk_id>/', GroupOrRoleAPIView.as_view(), name='group-api'),
    path('age-counts/<int:source_id>/<int:type_id>/', AgeCountAPIView.as_view(), name='age_counts'),#Added Authuntication & Authorization Token
    path('age-counts/<int:source_id>/<int:type_id>/<int:class_id>/', AgeCountAPIView.as_view(), name='age_counts_with_class'),#Added Authuntication & Authorization Token
    path('age-count/', AgeCountAPIView.as_view(), name='age_count_api'),#Added Authuntication & Authorization Token
    path('gender-count/<int:source_id>/<int:type_id>/<int:class_id>/', GenderCountAPIView.as_view(), name='gender-count'),#Added Authuntication & Authorization Token
    path('gender-count/<int:source_id>/<int:type_id>/', GenderCountAPIView.as_view(), name='gender-count'),#Added Authuntication & Authorization Token
    path('citizens-count/<int:source_id>/<int:type_id>/', CitizensCountAPIView.as_view(), name='citizens_count_api'),#Added Authuntication & Authorization Token
    path('citizens-count/<int:source_id>/<int:type_id>/<int:class_id>/', CitizensCountAPIView.as_view(), name='citizens_count_api'),#Added Authuntication & Authorization Token
    path('schedule-count/<int:source_id>/<int:type_id>/', screening_scheduleAPIView.as_view(), name='citizens_count_api'),#Added Authuntication & Authorization Token
    path('schedule-count/<int:source_id>/<int:type_id>/<int:class_id>/', screening_scheduleAPIView.as_view(), name='citizens_count_api'),#Added Authuntication & Authorization Token
    path('dental-count/<int:source_id>/<int:type_id>/<int:class_id>/', StudentConditionAPIView.as_view(), name='dental_count_api'),#Added Authuntication & Authorization Token
    path('dental-count/<int:source_id>/<int:type_id>/', StudentConditionAPIView.as_view(), name='dental_count_api'),#Added Authuntication & Authorization Token
    path('vision-count/<int:source_id>/<int:type_id>/<int:class_id>/', VisionCountAPIView.as_view(), name='dental_count_api'),#Added Authuntication & Authorization Token
    path('vision-count/<int:source_id>/<int:type_id>/', VisionCountAPIView.as_view(), name='dental_count_api'),#Added Authuntication & Authorization Token
    path('psyco-count/<int:source_id>/<int:type_id>/<int:class_id>/', PsycoCountAPIView.as_view(), name='dental_count_api'),#Added Authuntication & Authorization Token
    path('psyco-count/<int:source_id>/<int:type_id>/', PsycoCountAPIView.as_view(), name='dental_count_api'),#Added Authuntication & Authorization Token
    path('filter-citizens/', CitizenDataFilterAPIView.as_view(), name='filter_citizens_api'),#Added Authuntication & Authorization Token
    path('filter-Schedule/', ScheduleDataFilterAPIView.as_view(), name='filter_citizens_api'),#Added Authuntication & Authorization Token
    path('filter-Source/', SourceDataFilterAPIView.as_view(), name='filter_citizens_api'),#Added Authuntication & Authorization Token
    path('filter-User/', UserDataFilterAPIView.as_view(), name='filter_citizens_api'),#Added Authuntication & Authorization Token
    path('bmi_count/<source_id>/<type_id>/', BMICategories.as_view(), name='bmi-categories'),#Added Authuntication & Authorization Token
    path('bmi_count/<source_id>/<type_id>/<class_id>/', BMICategories.as_view(), name='bmi-categories-with-class'),#Added Authuntication & Authorization Token
    path('birth-defects/count/<str:source_id>/<str:type_id>/', BirthDefectCountAPIView.as_view(), name='birth_defects_count_api'),#Added Authuntication & Authorization Token
    path('birth-defects/count/<str:source_id>/<str:type_id>/<str:class_id>/', BirthDefectCountAPIView.as_view(),name='birth_defects_count_api_with_class'),#Added Authuntication & Authorization Token
    path('healthcards/', HealthcardAPIView.as_view(), name='healthcard-list'),#Added Authuntication & Authorization Token
    # path('healthcards_source_source_name/<int:source_id_id>/<int:source_name_id>/', HealthcardAPIView.as_view(), name='healthcard-list'),#Added Authuntication & Authorization Token
    path('healthcards/<int:source_id>/', HealthcardAPIView.as_view(), name='healthcard-filtered'),#Added Authuntication & Authorization Token
    path('healthcards/<int:source_id>/<int:state_id>/', HealthcardAPIView.as_view(), name='healthcard-filtered'),#Added Authuntication & Authorization Token
    path('healthcards/<int:source_id>/<int:state_id>/<int:district_id>/', HealthcardAPIView.as_view(), name='healthcard-filtered'),#Added Authuntication & Authorization Token
    path('healthcards/<int:source_id>/<int:state_id>/<int:district_id>/<int:tehsil_id>/', HealthcardAPIView.as_view(), name='healthcard-filtered'),#Added Authuntication & Authorization Token
    path('healthcards/<int:source_id>/<int:state_id>/<int:district_id>/<int:tehsil_id>/<int:source_name>/', HealthcardAPIView.as_view(), name='healthcard-filtered'),#Added Authuntication & Authorization Token
    path('schedule-count/', ScheduleCountAPIView.as_view(), name='schedule-count'),#Added Authuntication & Authorization Token
    path('citizen-info/<str:citizen_id>/<int:schedule_count>/', CitizenInfoAPIView.as_view(), name='citizen-info'),#Added Authuntication & Authorization Token
    path('filter_card/', Card_filter_APIView.as_view(), name='filter'),#Added Authuntication & Authorization Token
    path('filter_card/<int:source_id>/', Card_filter_APIView.as_view(), name='filter'),#Added Authuntication & Authorization Token
    path('filter_card/<int:source_id>/<int:type_id>/', Card_filter_APIView.as_view(), name='filter'),#Added Authuntication & Authorization Token
    path('filter_card/<int:source_id>/<int:type_id>/<int:class_id>/', Card_filter_APIView.as_view(), name='filter'),#Added Authuntication & Authorization Token
    path('filter_card/<int:source_id>/<int:type_id>/<int:schedule_count>/', Card_filter_APIView.as_view(), name='filter'),#Added Authuntication & Authorization Token
    path('filter_card/<int:source_id>/<int:type_id>/<int:class_id>/<int:schedule_count>/', Card_filter_APIView.as_view(), name='filter'),#Added Authuntication & Authorization Token
    path('citizen-vital-status/<str:citizen_id>/<int:schedule_count>/', CitizenVitalinfoCompleateStatusViewSet.as_view(), name='citizen-vital-info'),#Added Authuntication & Authorization Token
    path('citizen-download/<str:citizen_id>/<int:schedule_count>/', Healt_card_DownloadAPIView.as_view(), name='citizen-vital-info'),#Added Authuntication & Authorization Token
    path('combined-api-download/<int:source_id>/<int:type_id>/', CombinedAPI_Download.as_view(), name='combined_api_download'),#Added Authuntication & Authorization Token
    path('combined-api-download/<int:source_id>/<int:type_id>/<int:class_id>/', CombinedAPI_Download.as_view(), name='combined_api_download_optional_class'),#Added Authuntication & Authorization Token
    path('follow-up/<int:follow_up>/', follow_up_get_citizen_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow-up/', follow_up_get_citizen_info_ViewSet1),#Mohin #Added Authuntication & Authorization Token
    path('follow-up/<int:follow_up>/<int:follow_up_id>/', follow_up_get_citizen_info_ViewSet1),#Added Authuntication & Authorization Token
    path('follow-up/<int:follow_up>/<int:follow_up_id>/<int:source_name>/', follow_up_get_citizen_info_ViewSet1),#Added Authuntication & Authorization Token
    path('refer-count/<int:source_id>/<int:type_id>/', refer_to_count.as_view(), name='count_api'),#Added Authuntication & Authorization Token
    path('refer-count/<int:source_id>/<int:type_id>/<int:class_id>/', refer_to_count.as_view(), name='count_api'),#Added Authuntication & Authorization Token

    #-------------Mohin-----------------
    path('pft_counts/<source_id>/<type_id>/', PFTCountsAPIView.as_view(), name='pft_counts'),#Added Authuntication & Authorization Token
    path('pft_counts/<source_id>/<type_id>/<class_id>/', PFTCountsAPIView.as_view(), name='pft_counts'),#Added Authuntication & Authorization Token
    
    path('NEW_gender_count/', NEWGenderCountAPIView.as_view(), name='gender_count'),
    path('NEW_vision_count/', NEWVisionCountAPIView.as_view(), name='NEW_vision_count'),
    path('NEW_dental_count/', NewStudentDentalConditionAPIView.as_view(), name='NEW_dental_count'),
    path('NEW_pft_count/', NEWPFTCountsAPIView.as_view(), name='NEW_pft_count'),
    path('NEW_citizens_count/', NEWCitizensCountAPIView.as_view(), name='NEW_citizensCount_count'),
    path('NEW_age_count/', NEWAgeCountAPIView.as_view(), name='NEW_ageCount_count'),
    path('NEW_bmi_count/', NEWBMICategories.as_view(), name='NEW_bmiCount_count'),
    path('reffered_to_specialist_count/', ReferredToSpecialistCountAPIView.as_view(), name='reffered_to_specialist_count'),
    path('NEW_PsycoCount/', NEWPsycoCountAPIView.as_view(), name='NEW_bmiCount_count'),
    path('gender_count/', gender_count_viewset.as_view(), name='gender_count_viewset'),
    path('age_count/', Age_Count_Get_viewset.as_view(), name='age_count'),
    path('Bmi_count/', BMI_Count_GET_Api_Viewset.as_view(), name='Bmi_count'),
    path('Birth_defect_count/', Birth_Defect_Count_APIView.as_view(), name='Birth_defect_count'),
    path('other_count/', OtherInfoCount.as_view(), name='other_count'),
    
    
    
    
    
    
    
    path('video_anaysis/', VideoAnalysisLinkAPI.as_view(), name='video_anaysis'),
    path('image_to_text/', views.image_to_text, name='image_to_text'),
    
    path('Saved_image/', Saved_image_api.as_view(), name='Saved_image'),
    path('saved_image_get/', saved_image_get_api.as_view(), name='saved_image_get'),
    
    
    path('upload_360_image/', UploadAndGenerate360ImageView.as_view(), name='upload_360_image'),
    
    path('QRCode/', QRCodeGenerateAPIView.as_view(), name='QRCode'),
    path('dental_image_analyse/', DentalScreeningAPIView.as_view(), name='dental_image_analyse'),
    
    path('img_analyse_data_save/', img_analyse_data_save_api.as_view(), name='img_analyse_data_save'),
    
    
    
    
    
    #-----------------------Location API-----------------------
    
    path('location_get_api/', location_get_APIView.as_view(), name='location_get_api'),
    
    # path('location_get_api/<int:source_name_id>/', location_get_api.as_view(), name='location_get_api'),
    path('route_get_api/<int:source_name_id>/', route_get_api.as_view(), name='route_get_api'),
    
    path('amb_get_api/', ambulance_get_api.as_view(), name='ambulance_get_api'),
    path('doctor_get_api/', doctor_get_api.as_view(), name='doctor_get_api'),
    path('pilot_get_api/', pilot_get_api.as_view(), name='pilot_get_api'),
    
    path('schedule_get_api/',Schedule_list_APIView.as_view(),name='schedule_get_api'),
    
    path('citizen_schedule_create/', CitizenScheduleCreateAPIView.as_view(), name='citizen_schedule_create'),
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    path('download_csv/', DownloadCSVView.as_view(), name='download_csv'),
    # path('upload_csv/', UploadCSVView.as_view(), name='upload_csv'),

    path('upload_csv/', UploadImportedDataView.as_view(), name='upload_csv'),
    path('GET_Import_data/', GET_Imported_data_from_csv_and_excel.as_view(), name='GET_Import_data'),
    path('GET_ID_Wise_Import_data/<int:id>/', GET_ID_Wise_Imported_data_from_csv_and_excel.as_view(), name='GET_ID_Wise_Import_data'),
    




    # _________________ SAM MAM ___________________________
   path('SAM_MAM_BMI/<int:year>/<int:month>/<str:gender>/<str:height>/<str:weight>/', SAM_MAM_BMI_Serializer_ViewSet.as_view(), name='weight-comparison'),
#    path('SAM_MAM_BMI/<int:year>/<int:month>/<str:gender>/<str:height>/<str:weight>/', SAM_MAM_BMI_Serializer_ViewSet.as_view(), name='weight-comparison'),
#    path('SAM_MAM_BMI/<int:year>/<int:month>/<str:gender>/<str:height>/<str:weight>/', SAM_MAM_BMI_Serializer_ViewSet.as_view(), name='weight-comparison'),

    # path('SAM_MAM_BMI/<str:sour>', views.SAM_MAM_BMI_Serializer_ViewSet.as_view()),
    
    
    
    
    
    
    
    
    
    
    
    
    
    #--------------------------------Tata Screening Project API's -------------------------------------#
    
    path('State_Get/',State_Get_Api.as_view(),name='State_Get'),
    path('District_Get/<int:state_name>/',District_Get_Api.as_view(),name='District_Get'),
    path('Tehsil_Get/<int:dist_name>/',District_Get_Api.as_view(),name='Tehsil_Get'),
    
    path('GET_Screening_List/', GET_Screening_List_View.as_view(), name='GET_Screening_List'),
    path('Screening_sub_list/', Screening_sub_list_Viewset.as_view(), name='Screening_sub_list'),
    
    path('Citizen_Post/', Citizen_Post_Api.as_view(), name='Citizen_Post'),
    path('Citizen_Get/', Citizen_Get_Api.as_view(), name='Citizen_Get'),
    path('Citizen_Get_Idwise/<int:citizens_pk_id>/', Citizen_idwise_data_Get_Api.as_view(), name='Citizen_Get_idwise'),
    path('Citizen_Put_api/<int:citizens_pk_id>/', Citizen_Update_API.as_view(), name='Citizen_Put_api'),
    
    path('Workshop_Post/', Workshop_Post_Api.as_view(), name='Workshop_Post'),
    path('Workshop_Get/', Workshop_Get_Api.as_view(), name='Workshop_Get'),
    
    
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
    
    
    
    path('healthcard_citizen_list/', Healthcard_Citizen_List.as_view(), name='healthcard_citizen_list'),
    path('screening_count_api/',Screening_Count_API.as_view(),name='screening_count_api'),
    
    path('healthcard_download/<str:citizen_id>/<int:screening_count>/', Healthcard_Download_API.as_view(), name='healthcard_download'),
    
                 
]
    


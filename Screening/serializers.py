from rest_framework import serializers
from Screening.models import *
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password

from rest_framework.response import Response

class agg_com_colleague_Serializer(serializers.ModelSerializer):    # User name 
     class Meta:
        model = agg_com_colleague
        fields = ['id', 'clg_ref_id']


# We are writing this because we need confirm password field in our Registration Request
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    grp_id = serializers.PrimaryKeyRelatedField(queryset=agg_mas_group.objects.all(),many=False)
    



    class Meta:
        model  = agg_com_colleague
        # fields = ['pk','clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' , 'clg_state', 'clg_district' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' , 'clg_otp', 'clg_otp_count', 'clg_otp_expire_time','clg_source','clg_tahsil','clg_source_name', 'password','password2']
        fields = ['pk', 'clg_ref_id', 'grp_id', 'clg_email', 'clg_mobile_no', 'clg_gender', 'clg_address', 'clg_state', 'clg_district', 'clg_Date_of_birth', 'clg_source', 'clg_tahsil', 'clg_source_name', 'password', 'password2', 'clg_added_by']
        #,'clg_source','clg_tahsil','clg_source_name']
        # fields = ['pk','clg_ref_id' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address','clg_state','clg_district', 'clg_designation' , 'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status', 'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_division' ,'clg_Date_of_birth','clg_work_email_id','clg_source','clg_tahsil','clg_source_name','password','password2']#,'clg_source','clg_tahsil','clg_source_name']
        extra_kwargs = {
            'password':{'write_only':True}
        }
        
    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError('Password and Confirm Password does not match')
        return data
    
    def create(self, validated_data):
        group_data = validated_data.pop('grp_id')
        validated_data['grp_id'] = group_data
        user = agg_com_colleague.objects.create_user(**validated_data)
        user.save()
        return user        


# class UserLoginSerializer(serializers.ModelSerializer):
#     clg_ref_id = serializers.CharField(required=False, allow_blank=True)
#     clg_mobile_no = serializers.IntegerField(required=False)
#     password = serializers.CharField(style={'input_type': 'password'})
#     class Meta:
#         model = agg_com_colleague
#         fields = ['clg_ref_id','clg_mobile_no', 'password']

class UserLoginSerializer(serializers.ModelSerializer):
    clg_ref_id = serializers.CharField(required=False, allow_blank=True)
    clg_mobile_no = serializers.IntegerField(required=False)
    password = serializers.CharField(style={'input_type': 'password'})
    registration_details = serializers.CharField(source='clg_source_name.Registration_details', allow_null=True,read_only=True)
    class Meta:
        model = agg_com_colleague
        fields = ['clg_ref_id', 'clg_mobile_no', 'password', 'registration_details']


class UserRegistrationPUTSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_com_colleague
                fields = ['pk', 'clg_ref_id', 'grp_id', 'clg_email', 'clg_mobile_no', 'clg_gender', 'clg_address', 'clg_state', 'clg_district', 'clg_Date_of_birth', 'clg_source', 'clg_tahsil', 'clg_source_name', 'clg_modify_by']


class UserRegistrationGETSerializer(serializers.ModelSerializer):
    clg_source = serializers.CharField(source='clg_source.source',allow_null=True)  
    clg_source_name = serializers.CharField(source='clg_source_name.source_names', allow_null=True)  
    clg_state = serializers.CharField(source='clg_state.state_name', allow_null=True)  
    clg_district = serializers.CharField(source='clg_district.dist_name', allow_null=True)  
    clg_tahsil = serializers.CharField(source='clg_tahsil.tahsil_name', allow_null=True)
    clg_gender = serializers.CharField(source='clg_gender.gender', allow_null=True)
    
    source_id = serializers.IntegerField(source='clg_source.source_pk_id', allow_null=True)
    source_name_id = serializers.IntegerField(source='clg_source_name.source_pk_id', allow_null=True) 
    state_id = serializers.IntegerField(source='clg_state.state_id', allow_null=True)
    district_id = serializers.IntegerField(source='clg_district.dist_id', allow_null=True)
    tehsil_id = serializers.IntegerField(source='clg_tahsil.tal_id', allow_null=True)  
    gender_id = serializers.IntegerField(source='clg_gender.gender_pk_id', allow_null=True)
    clg_source = serializers.CharField(source='clg_source.source',allow_null=True)  
    clg_source_name = serializers.CharField(source='clg_source_name.source_names',allow_null=True)  
    clg_state = serializers.CharField(source='clg_state.state_name',allow_null=True)  
    clg_district = serializers.CharField(source='clg_district.dist_name',allow_null=True)  
    clg_tahsil = serializers.CharField(source='clg_tahsil.tahsil_name',allow_null=True)
    clg_gender = serializers.CharField(source='clg_gender.gender',allow_null=True)
    grp_id = serializers.CharField(source='grp_id.grp_name',allow_null=True)
    
    source_id = serializers.IntegerField(source='clg_source.source_pk_id',allow_null=True)
    source_name_id = serializers.IntegerField(source='clg_source_name.source_pk_id',allow_null=True) 
    state_id = serializers.IntegerField(source='clg_state.state_id',allow_null=True)
    district_id = serializers.IntegerField(source='clg_district.dist_id',allow_null=True)
    tehsil_id = serializers.IntegerField(source='clg_tahsil.tal_id',allow_null=True)  
    gender_id = serializers.IntegerField(source='clg_gender.gender_pk_id',allow_null=True)
    group_id = serializers.IntegerField(source='grp_id.grp_id',allow_null=True) 

    clg_modify_by = agg_com_colleague_Serializer() #Amit
    clg_added_by = agg_com_colleague_Serializer() #Amit
    
    class Meta:
        model = agg_com_colleague
        fields = ['pk', 'clg_ref_id', 'grp_id', 'clg_email', 'clg_mobile_no', 'clg_gender', 'clg_address', 'clg_state', 'clg_district', 'clg_Date_of_birth', 'clg_source', 'clg_tahsil', 'clg_source_name','gender_id','source_id','state_id','district_id','tehsil_id','source_name_id','clg_gender','group_id', 'clg_added_by', 'clg_modify_by']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data 

        

class agg_sc_state_info_Serializer(serializers.ModelSerializer):
   class Meta:
      model = agg_sc_state
      fields = '__all__'

class agg_sc_district_serializer(serializers.ModelSerializer):
    class Meta:
        model= agg_sc_district
        fields='__all__'

class agg_sc_tahsil_serializer(serializers.ModelSerializer):
    class Meta:
        model= agg_sc_tahsil
        fields='__all__'


class agg_sc_district_name_id_serializer(serializers.ModelSerializer):
    class Meta:
        model= agg_sc_district
        fields=['dist_id', 'dist_name']
class agg_sc_tahsil_name_id_serializer(serializers.ModelSerializer):
    class Meta:
        model= agg_sc_tahsil
        fields=['tal_id', 'tahsil_name']


# ___________ Age ___________________________________
class agg_age_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_age
                fields = ('age_pk_id', 'age')

# ___________ End Age ___________________________________

# ___________ Gender ___________________________________
class agg_gender_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_gender
                fields = ('gender_pk_id', 'gender')
               

# ___________ End Gender ___________________________________

#________________________ Disease _________________________________
class agg_sc_disease_info_Serializer(serializers.ModelSerializer):
   class Meta:
      model = agg_sc_disease
      fields = ('disease_pk_id', 'disease')
#________________________ End Disease _________________________________


# ___________ Source _____________________________
class agg_source_Serializer(serializers.ModelSerializer):
     class Meta:
        model = agg_source
        fields = ('source_pk_id', 'source_code', 'source')
class agg_sc_source_source_name_Serializer(serializers.ModelSerializer):       
        class Meta:
                model = agg_source
                fields = ( 'source_pk_id', 'source')

class roleSerializer(serializers.ModelSerializer):
        grp_name = serializers.SerializerMethodField()

        class Meta:
            model = role
            fields = ['role_id', 'Group_id', 'source', 'role_is_deleted', 'is_deleted', 'grp_name']
        
        def get_grp_name(self, instance):
            group = instance.Group_id
            return group.grp_name if group else None
        
        def to_representation(self, instance):
            data = super().to_representation(instance)
            data['grp_name'] = self.get_grp_name(instance)
            return data
                
# class BMISerializer(serializers.ModelSerializer):
#    class Meta:
#       model = GrowthMonitoring
#       fields = '__all__'


from django.contrib.auth.models import Permission

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class Moduleserializer(serializers.ModelSerializer):
     class Meta:
          model = Permission_module
          fields = ['module_id', 'name', 'Source_id']


class permission_sub_Serializer(serializers.ModelSerializer):
    class Meta:
        model = permission
        fields = '__all__'


class AuditoryinfogetSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_audit
                fields = ['audit_id','audit_name']
                
class SAM_MAM_BMI_Serializer(serializers.ModelSerializer):
        class Meta:
                model = Citizen
                fields = ['gender','year', 'months', 'days', 'height', 'weight']
                
                
#-------------------------------Basic Information (Genral Examination)---------------------------------#
class basic_information_head_scalp_Serializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_head_scalp
                fields = ['head_scalp_id','head_scalp']
                
class basic_information_hair_colorSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_hair_color
                fields = ['hair_color_id','hair_color']
                
class basic_information_hair_densitySerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_hair_density
                fields = ['hair_density_id','hair_density']
                
class basic_information_hair_textureSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_hair_texture
                fields = ['hair_texture_id','hair_texture']
                
class basic_information_alopeciaSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_alopecia
                fields = ['alopecia_id','alopecia']
                
class basic_information_neckSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_neck
                fields = ['neck_id','neck']
                
class basic_information_noseSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_nose
                fields = ['nose_id','nose']

class basic_information_skin_colorSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_skin_color
                fields = ['skin_id','skin_color']
                
class basic_information_skin_textureSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_skin_texture
                fields = ['skin_texture_id','skin_texture']
                
class basic_information_skin_lensionSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_skin_lesions
                fields = ['skin_lesions_id','skin_lesions']
                
class basic_information_lipsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_lips
                fields = ['lips_id','lips']

class basic_information_gumsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_gums
                fields = ['gums_id','gums']
                
class basic_information_dentitionSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_dentition
                fields = ['dentition_id','dentition']
                
class basic_information_oral_mucosaSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_oral_mucosa
                fields = ['oral_mucosa_id','oral_mucosa']
                
class basic_information_toungeSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_tounge
                fields = ['tounge_id','tounge']
                
class basic_information_chestSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_chest
                fields = ['chest_id','chest']

class basic_information_abdomenSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_abdomen
                fields = ['abdomen_id','abdomen']
                
class basic_information_extremitySerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_extremity
                fields = ['extremity_id','extremity']
                
class basic_information_rs_rightSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_rs_right
                fields = ['rs_right_id','rs_right']
                
class basic_information_rs_leftSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_rs_left
                fields = ['rs_left_id','rs_left']
                
class basic_information_cvsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_cvs
                fields = ['cvs_id','cvs']
                
class basic_information_varicose_veinsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_varicose_veins
                fields = ['varicose_veins_id','varicose_veins']
                
class basic_information_lmpSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_lmp
                fields = ['lmp_id','lmp']
                
class basic_information_cnsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_cns
                fields = ['cns_id','cns']
                
class basic_information_reflexesSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_reflexes
                fields = ['reflexes_id','reflexes']
                
class basic_information_rombergsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_rombergs
                fields = ['rombergs_id','rombergs']
                
class basic_information_pupilsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_pupils
                fields = ['pupils_id','pupils']
                
class basic_information_pa_idSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_pa
                fields = ['pa_id','pa']
                
class basic_information_tendernessSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_tenderness
                fields = ['tenderness_id','tenderness']
                
class basic_information_ascitisSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_ascitis
                fields = ['ascitis_id','ascitis']
                
class basic_information_guardingSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_guarding
                fields = ['guarding_id','guarding']
                
class basic_information_jointsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_joints
                fields = ['joints_id','joints']

class basic_information_swollen_jointsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_swollen_joints
                fields = ['swollen_joints_id','swollen_joints']
                
class basic_information_spine_postureSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_spine_posture
                fields = ['spine_posture_id','spine_posture']
                
#-------------------------------Basic Information ( Disability Screening )---------------------------------#
class basic_information_language_delaySerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_language_delay
                fields = ['language_delay_id','language_delay']
                
class basic_information_behavioural_disorderSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_behavioural_disorder
                fields = ['behavioural_disorder_id','behavioural_disorder']
                
class basic_information_speech_screeningSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_speech_screening
                fields = ['speech_screening_id','speech_screening']

#-------------------------------Basic Information (Birth Defects )---------------------------------#
class basic_information_birthdefectSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_birth_defects
                fields = ['birth_defects_id','birth_defects']
                
#-------------------------------Basic Information (Childhood disease )---------------------------------#
class basic_information_childhood_diseaseSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_childhood_disease
                fields = ['childhood_disease_id','childhood_disease']
                
#-------------------------------Basic Information (Deficiencies )---------------------------------#
class basic_information_deficienciesSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_deficiencies
                fields = ['deficiencies_id','deficiencies']

#-------------------------------Basic Information (Skin Condition )---------------------------------#
class basic_information_skin_conditionsSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_skin_conditions
                fields = ['skin_conditions_id','skin_conditions']

#-------------------------------Basic Information (Check Box if Normal )---------------------------------#
class basic_information_check_box_if_normalSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_check_box_if_normal
                fields = ['check_box_if_normal_id','check_box_if_normal']

#-------------------------------Basic Information (Diagnosis )---------------------------------#
class basic_information_diagnosisSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_diagnosis
                fields = ['diagnosis_id','diagnosis']
                
#-------------------------------Basic Information (Treatment )---------------------------------#
class basic_information_referralSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_referral
                fields = ['referral_id','referral']
                           
class basic_information_place_referralSerializer(serializers.ModelSerializer):
        class Meta:
                model = basic_information_place_referral
                fields = ['place_referral_id','place_referral']
                




#---------------------------Vision Checkup-------------------------------------------------------#
class CitizenEyeCheckBoxinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = vision_eye_checkbox
                fields = ['eye_pk_id','eye']

class CitizenCheckBoxIfPresentSerializer(serializers.ModelSerializer):
        class Meta:
                model = vision_checkbox_if_present
                fields = ['checkbox_pk_id','checkbox_if_present']
                
                

                    
class CitizengetimmunisationinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_immunisation
                fields = ['immunisation_pk_id','immunisations','window_period_days_from','window_period_days_to']




#------------------------Follow-up---------------------------------#
class FollowupinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_followup_dropdownlist
        fields = ['followup_pk_id','follow_up']
        
class Followup_for_infoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_followup_for
        fields = ['followupfor_pk_id','follow_up_for']
        
        
class FollowupstatusinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_follow_up_status
        fields = ['followup_status_pk_id','followup_status']
        


class followup_refer_to_specalist_citizens_infoSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen_pk_id.name', allow_null=True)
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)
    citizen_id = serializers.CharField(source='citizen_pk_id.citizen_id', allow_null=True)
    mobile_number=serializers.CharField(source='citizen_pk_id.mobile_no', allow_null=True)
    aadhar_no = serializers.CharField(source='citizen_pk_id.aadhar_id', allow_null=True)
    dob = serializers.DateField(source='citizen_pk_id.dob', allow_null=True)
    # email_id=serializers.CharField(source='citizen_pk_id.email_id', allow_null=True)
    blood_group = serializers.CharField(source='citizen_pk_id.blood_groups', allow_null=True)   


    class Meta:
        model = follow_up
        fields = '__all__'
        
#-------------------mayank-----------------------------------------
from rest_framework import serializers

class SubmoduleSerializer(serializers.Serializer):  
    submoduleId = serializers.IntegerField()
    submoduleName = serializers.CharField()

class ModuleSerializer(serializers.Serializer):
    moduleId = serializers.IntegerField()
    moduleName = serializers.CharField()
    selectedSubmodules = SubmoduleSerializer(many=True)
class SavePermissionSerializer(serializers.ModelSerializer):
    modules_submodule = serializers.ListField(child=ModuleSerializer())

    class Meta:
        model = agg_save_permissions
        fields = ['id', 'source', 'role', 'modules_submodule', 'permission_status','modules_submodule','permission_status']

        # fields = ['citizens_pk_id','source','type','Class']





class UserDataGetSerializer(serializers.ModelSerializer):
      grp_name = serializers.CharField(source='grp_id.grp_name')
    
      class Meta:
            model = agg_com_colleague
            fields = "__all__"
      def to_representation(self, instance):
        data = super().to_representation(instance)
        return data

class Citizen_Medical_History_Get_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = medical_history
        fields = ['medical_hist_id','medical_history'] 
        
class Citizen_Past_Operative_History_Get_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_citizen_past_operative_history
        fields = ['past_operative_hist_id','past_operative_history'] 
        


class citizen_bad_habbits_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_bad_habbits
        fields = ['bad_habbits_pk_id','bad_habbits']
        







class FormSubmitSerializer(serializers.Serializer):
    submitted_forms = serializers.IntegerField()
    pending_forms = serializers.IntegerField()








        
        
class HospitalListSerializer(serializers.ModelSerializer):
    class Meta:
        model = referred_hospital_list
        fields = ['hospital_pk_id','hospital_name']
        


        

class UploadCSVSerializer(serializers.Serializer):
    csv_file = serializers.FileField()






class Screening_List_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_screening_list
        # fields = '__all__'
        fields = ['sc_list_pk_id','screening_list']
        

class Screening_sub_list_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_screening_sub_list
        fields = ['sc_sub_list_pk_id','sub_list']
        

class image_save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = image_save_table
        fields = ['image_pk_id','image','schedule_id','citizen_id','citizen_pk_id']


class image_get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = image_save_table
        fields = ['image_pk_id','image']



class ImageSaveTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = image_save_table
        fields = ['image_pk_id', 'image', 'added_date', 'modify_date']



class img_analyse_data_get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = anayalse_img_data_save_table
        fields = ['anlyse_pk_id','schedule_id','citizen_id','citizen_pk_id','oral_hygine','gum_condition','discolouration_of_teeth','oral_ulcers','food_impaction','fluorosis','carious_teeth','english','marathi']


       

        

#----------------------------------------------------------------------------------------------------------------------------------
class Citizen_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ['citizens_pk_id', 'citizen_id', 'prefix', 'name', 'vehicle_number', 'blood_groups', 'dob', 'year', 'months', 'days', 'gender', 'source', 'category', 'aadhar_id', 'mobile_no', 'source_name', 'state', 'district', 'tehsil', 'pincode', 'address', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms', 'emergency_prefix', 'emergency_fullname', 'emergency_gender', 'emergency_contact', 'relationship_with_employee', 'emergency_address', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date']


class Workshop_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = [
                    'ws_pk_id', 'workshop_code', 'source', 'Workshop_name', 'registration_no',
                    'mobile_no', 'email_id', 'logo', 'ws_state', 'ws_district', 'ws_taluka',
                    'ws_pincode', 'ws_address', 'screening_vitals', 'sub_screening_vitals',
                    'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date','longitude','latitude'
                ]
        
class Workshop_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['ws_pk_id','Workshop_name','registration_no']


class Citizen_delete_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ['citizens_pk_id','is_deleted']
        
class Citizen_Get_Serializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category', allow_null=True)
    latest_screening_pk_id = serializers.SerializerMethodField()
    previous_screen = serializers.SerializerMethodField()

    basic_info_form_submit = serializers.SerializerMethodField()
    emergency_info_form_submit = serializers.SerializerMethodField()
    growth_monitoring_info_form_submit = serializers.SerializerMethodField()
    vital_info_form_submit = serializers.SerializerMethodField()
    genral_examination_form_submit = serializers.SerializerMethodField()
    systemic_exam_form_submit = serializers.SerializerMethodField()
    disability_screening_form_submit = serializers.SerializerMethodField()
    birth_defect_form_submit = serializers.SerializerMethodField()
    deficiencies_form_submit = serializers.SerializerMethodField()
    skin_conditions_form_submit = serializers.SerializerMethodField()
    diagnosis_form_submit = serializers.SerializerMethodField()
    check_box_if_normal_form_submit = serializers.SerializerMethodField()
    treatement_form_submit = serializers.SerializerMethodField()
    auditory_info_form_submit = serializers.SerializerMethodField()
    vision_info_form_submit = serializers.SerializerMethodField()
    medical_history_info_form_submit = serializers.SerializerMethodField()
    pft_info_form_submit = serializers.SerializerMethodField()
    dental_info_form_submit = serializers.SerializerMethodField()
    immunisation_info_form_submit = serializers.SerializerMethodField()
    investigation_info_form_submit = serializers.SerializerMethodField()
    gender_name = serializers.CharField(source='gender.gender', allow_null=True)
    modify_by = agg_com_colleague_Serializer()
    added_by = agg_com_colleague_Serializer()

    class Meta:
        model = Citizen
        fields = [
            'citizens_pk_id',
            'citizen_id',
            'prefix',
            'name',
            'aadhar_id',
            'mobile_no',
            'category',
            'category_name',
            'added_by',
            'modify_by',
            'latest_screening_pk_id',
            'gender',
            'gender_name',
            'year',
            'dob',

            'basic_info_form_submit',
            'emergency_info_form_submit',
            'growth_monitoring_info_form_submit',
            'vital_info_form_submit',
            'genral_examination_form_submit',
            'systemic_exam_form_submit',
            'disability_screening_form_submit',
            'birth_defect_form_submit',
            'deficiencies_form_submit',
            'skin_conditions_form_submit',
            'diagnosis_form_submit',
            'check_box_if_normal_form_submit',
            'treatement_form_submit',
            'auditory_info_form_submit',
            'vision_info_form_submit',
            'medical_history_info_form_submit',
            'pft_info_form_submit',
            'dental_info_form_submit',
            'immunisation_info_form_submit',
            'investigation_info_form_submit',

            'previous_screen',
        ]

    # -------------------------------------------------
    # FIXED: GET LATEST SCREENING PK ID (Correct FK)
    # -------------------------------------------------
    def get_latest_screening_pk_id(self, obj):
        latest = Screening_citizen.objects.filter(
            citizen_pk_id_id=obj.citizens_pk_id        # ✅ FIXED
        ).order_by('-added_date').first()

        self._latest_screening_pk_id = latest.pk_id if latest else None
        return self._latest_screening_pk_id

    # Reusable function
    def _get_form_submit(self, model):
        latest_pk = getattr(self, "_latest_screening_pk_id", None)
        if not latest_pk:
            return None

        record = model.objects.filter(
            screening_citizen_id=latest_pk,
            is_deleted=False
        ).order_by('-added_date').first()

        return record.form_submit if record else None

    # FORM SUBMIT GETTERS
    def get_basic_info_form_submit(self, obj): return self._get_form_submit(basic_info)
    def get_emergency_info_form_submit(self, obj): return self._get_form_submit(emergency_info)
    def get_growth_monitoring_info_form_submit(self, obj): return self._get_form_submit(growth_monitoring_info)
    def get_vital_info_form_submit(self, obj): return self._get_form_submit(vital_info)
    def get_genral_examination_form_submit(self, obj): return self._get_form_submit(genral_examination)
    def get_systemic_exam_form_submit(self, obj): return self._get_form_submit(systemic_exam)
    def get_disability_screening_form_submit(self, obj): return self._get_form_submit(disability_screening)
    def get_birth_defect_form_submit(self, obj): return self._get_form_submit(birth_defect)
    def get_deficiencies_form_submit(self, obj): return self._get_form_submit(deficiencies)
    def get_skin_conditions_form_submit(self, obj): return self._get_form_submit(skin_conditions)
    def get_diagnosis_form_submit(self, obj): return self._get_form_submit(diagnosis)
    def get_check_box_if_normal_form_submit(self, obj): return self._get_form_submit(check_box_if_normal)
    def get_treatement_form_submit(self, obj): return self._get_form_submit(treatement)
    def get_auditory_info_form_submit(self, obj): return self._get_form_submit(auditory_info)
    def get_vision_info_form_submit(self, obj): return self._get_form_submit(vision_info)
    def get_medical_history_info_form_submit(self, obj): return self._get_form_submit(medical_history_info)
    def get_pft_info_form_submit(self, obj): return self._get_form_submit(pft_info)
    def get_dental_info_form_submit(self, obj): return self._get_form_submit(dental_info)
    def get_immunisation_info_form_submit(self, obj): return self._get_form_submit(immunisation_info)
    def get_investigation_info_form_submit(self, obj): return self._get_form_submit(investigation_info)

    def get_previous_screen(self, obj):
        latest_pk = getattr(self, "_latest_screening_pk_id", None)
        if not latest_pk:
            return False

        # Collect all form submit values
        forms = [
            self.get_basic_info_form_submit(obj),
            self.get_emergency_info_form_submit(obj),
            self.get_growth_monitoring_info_form_submit(obj),
            self.get_vital_info_form_submit(obj),
            self.get_genral_examination_form_submit(obj),
            self.get_systemic_exam_form_submit(obj),
            self.get_disability_screening_form_submit(obj),
            self.get_birth_defect_form_submit(obj),
            self.get_deficiencies_form_submit(obj),
            self.get_skin_conditions_form_submit(obj),
            self.get_diagnosis_form_submit(obj),
            self.get_check_box_if_normal_form_submit(obj),
            self.get_treatement_form_submit(obj),
            self.get_auditory_info_form_submit(obj),
            self.get_vision_info_form_submit(obj),
            self.get_medical_history_info_form_submit(obj),
            self.get_pft_info_form_submit(obj),
            self.get_dental_info_form_submit(obj),
            self.get_immunisation_info_form_submit(obj),
            self.get_investigation_info_form_submit(obj),
        ]

        # ✅ If ANY form has value exactly False → previous_screen = True
        if any(f is False for f in forms):
            return True

        # Otherwise keep basic logic
        return False






        
class Citizen_idwise_data_Get_Serializer(serializers.ModelSerializer):
    gender_name = serializers.CharField(source='gender.gender',allow_null=True)
    state_name = serializers.CharField(source='state.state_name',allow_null=True)
    district_name = serializers.CharField(source='district.dist_name',allow_null=True)
    tehsil_name = serializers.CharField(source='tehsil.tahsil_name',allow_null=True) 
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)
    source_id_name = serializers.CharField(source='source.source',allow_null=True)
    category_name = serializers.CharField(source='category.category',allow_null=True)
    modify_by = agg_com_colleague_Serializer()
    added_by = agg_com_colleague_Serializer()
    Workshop_name = serializers.CharField(source='workshop_pk_id.Workshop_name',allow_null=True)
    class Meta:
        model = Citizen
        fields = '__all__'
        
class Citizen_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = '__all__'
        

class ScreeningCitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening_citizen
        fields = ['pk_id', 'screening_count', 'citizen_id', 'citizen_pk_id', 'added_by', 'added_date', 'modify_by', 'modified_date']
        

class basic_info_Save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = basic_info
        fields = ['basic_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','prefix','name','gender','blood_group','dob','year','months','days','aadhar_id','phone_no','added_by','modify_by','form_submit','is_deleted','added_date','modify_date'] 

class emergency_info_Save_Serializer(serializers.ModelSerializer):
    class Meta:
        model = emergency_info
        fields = ['em_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','relationship_with_employee','emergency_address','added_by','modify_by','form_submit','is_deleted','added_date','modify_date']


class growth_monitoring_info_Save_Serializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True, read_only=True)
    class Meta:
        model = growth_monitoring_info
        fields = ['growth_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','symptoms','remark','reffered_to_specialist','form_submit','is_deleted','added_by','added_date','modify_by','modify_date','refer_doctor','doctor_name']
        
        
class basic_info_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = basic_info
        fields = ['basic_pk_id','screening_count','citizen_pk_id','screening_citizen_id','prefix','name','gender','blood_group','dob','year','months','days','aadhar_id','phone_no','added_by','modify_by','form_submit','is_deleted','citizen_id']
        

class basic_info_Citizen_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ['citizens_pk_id','name','prefix','gender','blood_groups','dob','year','months','days','aadhar_id','mobile_no','modify_by','modify_date']
        


class emergency_info_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = emergency_info
        fields = ['em_pk_id','citizen_pk_id','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','relationship_with_employee','emergency_address','modify_by','is_deleted','modify_date']
        


class emergency_info_Citizen_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ['citizens_pk_id','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','relationship_with_employee','emergency_address','modify_by','modify_date']
        
class growth_monitoring_info_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = growth_monitoring_info
        fields = ['growth_pk_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','symptoms','remark','reffered_to_specialist','modify_by','is_deleted','modify_date','refer_doctor']


class growth_monitoring_info_Get_Serializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)
    class Meta:
        model = growth_monitoring_info
        fields = ['growth_pk_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','symptoms','remark','reffered_to_specialist','modify_by','is_deleted','modify_date','refer_doctor','doctor_name']




class Citizen_Growth_Update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = [
            'gender', 'dob', 'year', 'months', 'days',
            'height', 'weight', 'weight_for_age', 'height_for_age',
            'weight_for_height', 'bmi', 'arm_size', 'symptoms',
            'modify_by', 'modify_date'
        ]

        

class vital_info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = vital_info
        fields = ['vital_info_pk_id','vital_code','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','pulse','pulse_conditions','sys_mm','sys_mm_conditions','dys_mm','dys_mm_mm_conditions','oxygen_saturation','oxygen_saturation_conditions','rr','rr_conditions','temp','temp_conditions','is_deleted','form_submit','reffered_to_specialist','added_by','added_date','modify_by','modify_date','refer_doctor']


class vital_info_Get_Serializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)
    class Meta:
        model = vital_info
        fields = ['vital_info_pk_id','vital_code','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','pulse','pulse_conditions','sys_mm','sys_mm_conditions','dys_mm','dys_mm_mm_conditions','oxygen_saturation','oxygen_saturation_conditions','rr','rr_conditions','temp','temp_conditions','is_deleted','form_submit','reffered_to_specialist','added_by','added_date','modify_by','modify_date','refer_doctor','doctor_name']



class Genral_Examination_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = genral_examination
        fields = ['genral_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id', 'head', 'nose', 'neck', 'skin_color', 'skin_texture', 'skin_lesions', 'lips', 'gums', 'dention', 'oral_mucosa', 'tongue', 'hair_color', 'hair_density', 'hair_texture', 'alopecia', 'chest', 'abdomen', 'extremity', 'is_deleted', 'form_submit', 'added_date', 'added_by', 'modify_date', 'modify_by']



class Genral_Examination_Get_Serializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.head_scalp',allow_null=True)
    nose_name = serializers.CharField(source='nose.nose',allow_null=True)
    neck_name = serializers.CharField(source='neck.neck',allow_null=True)
    skin_color_name = serializers.CharField(source='skin_color.skin_color',allow_null=True)
    skin_texture_name = serializers.CharField(source='skin_texture.skin_texture',allow_null=True)
    skin_lesions_name = serializers.CharField(source='skin_lesions.skin_lesions',allow_null=True)
    lips_name = serializers.CharField(source='lips.lips',allow_null=True)
    gums_name = serializers.CharField(source='gums.gums',allow_null=True)
    dention_name = serializers.CharField(source='dention.dentition',allow_null=True)
    oral_mucosa_name = serializers.CharField(source='oral_mucosa.oral_mucosa',allow_null=True)
    tongue_name = serializers.CharField(source='tongue.tounge',allow_null=True)
    hair_color_name = serializers.CharField(source='hair_color.hair_color',allow_null=True)
    hair_density_name = serializers.CharField(source='hair_density.hair_density',allow_null=True)
    hair_texture_name = serializers.CharField(source='hair_texture.hair_texture',allow_null=True)
    alopecia_name = serializers.CharField(source='alopecia.alopecia',allow_null=True)
    chest_name = serializers.CharField(source='chest.chest',allow_null=True)
    abdomen_name = serializers.CharField(source='abdomen.abdomen',allow_null=True)
    extremity_name = serializers.CharField(source='extremity.extremity',allow_null=True)
    
    class Meta:
        model = genral_examination
        fields = ['genral_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id', 'head', 'nose', 'neck', 'skin_color', 'skin_texture', 'skin_lesions', 'lips', 'gums', 'dention', 'oral_mucosa', 'tongue', 'hair_color', 'hair_density', 'hair_texture', 'alopecia', 'chest', 'abdomen', 'extremity', 'is_deleted', 'form_submit', 'added_date', 'added_by', 'modify_date', 'modify_by',
                  'head_name','nose_name', 'neck_name', 'skin_color_name', 'skin_texture_name', 'skin_lesions_name', 'lips_name', 'gums_name', 'dention_name', 'oral_mucosa_name', 'tongue_name', 'hair_color_name', 'hair_density_name', 'hair_texture_name', 'alopecia_name', 'chest_name', 'abdomen_name', 'extremity_name']
        
class Systemic_Exam_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = systemic_exam
        fields = [
            'systemic_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'rs_right', 'rs_left', 'cvs', 'varicose_veins', 'lmp', 'cns', 'reflexes', 
            'rombergs', 'pupils', 'pa', 'tenderness', 'ascitis', 'guarding', 'joints', 
            'swollen_joints', 'spine_posture', 'is_deleted', 'form_submit', 
            'added_date', 'added_by', 'modify_date', 'modify_by'
        ]



class Systemic_Exam_Get_Serializer(serializers.ModelSerializer):
    rs_right_name = serializers.CharField(source='rs_right.rs_right', allow_null=True)
    rs_left_name = serializers.CharField(source='rs_left.rs_left', allow_null=True) 
    cvs_name = serializers.CharField(source='cvs.cvs', allow_null=True)
    varicose_veins_name = serializers.CharField(source='varicose_veins.varicose_veins', allow_null=True)
    lmp_name = serializers.CharField(source='lmp.lmp', allow_null=True)
    cns_name = serializers.CharField(source='cns.cns', allow_null=True)
    reflexes_name = serializers.CharField(source='reflexes.reflexes', allow_null=True)
    rombergs_name = serializers.CharField(source='rombergs.rombergs', allow_null=True)
    pupils_name = serializers.CharField(source='pupils.pupils', allow_null=True)
    pa_name = serializers.CharField(source='pa.pa', allow_null=True)
    tenderness_name = serializers.CharField(source='tenderness.tenderness', allow_null=True)
    ascitis_name = serializers.CharField(source='ascitis.ascitis', allow_null=True)
    guarding_name = serializers.CharField(source='guarding.guarding', allow_null=True)
    joints_name = serializers.CharField(source='joints.joints', allow_null=True)
    swollen_joints_name = serializers.CharField(source='swollen_joints.swollen_joints', allow_null=True)
    spine_posture_name = serializers.CharField(source='spine_posture.spine_posture', allow_null=True)
    
    class Meta:
        model = systemic_exam
        fields = [
            'systemic_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'rs_right', 'rs_left', 'cvs', 'varicose_veins', 'lmp', 'cns', 'reflexes', 
            'rombergs', 'pupils', 'pa', 'tenderness', 'ascitis', 'guarding', 'joints', 
            'swollen_joints', 'spine_posture', 'is_deleted', 'form_submit', 
            'added_date', 'added_by', 'modify_date', 'modify_by','rs_right_name', 'rs_left_name', 'cvs_name', 'varicose_veins_name', 'lmp_name', 'cns_name', 'reflexes_name', 
            'rombergs_name', 'pupils_name', 'pa_name', 'tenderness_name', 'ascitis_name', 'guarding_name', 'joints_name','swollen_joints_name', 'spine_posture_name'
        ]
        
        
class Female_Screening_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = female_screening
        fields = [
            'female_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'menarche_achieved', 'date_of_menarche', 'age_of_menarche',
            'vaginal_descharge', 'flow', 'comments',
            'is_deleted', 'form_submit', 'added_date', 'added_by', 'modify_date', 'modify_by'
        ]
        
class Female_Screening_Get_Serializer(serializers.ModelSerializer):
    menarche_achieved = serializers.SerializerMethodField()
    vaginal_descharge = serializers.SerializerMethodField()
    flow = serializers.SerializerMethodField()
    class Meta:
        model = female_screening
        fields = [
            'female_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'menarche_achieved', 'date_of_menarche', 'age_of_menarche',
            'vaginal_descharge', 'flow', 'comments',
            'is_deleted', 'form_submit', 'added_date', 'added_by', 'modify_date', 'modify_by'
        ]
        
        
    def get_menarche_achieved(self, obj):
        return obj.menarche_achieved.name if obj.menarche_achieved else None

    def get_vaginal_descharge(self, obj):
        return obj.vaginal_descharge.name if obj.vaginal_descharge else None

    def get_flow(self, obj):
        return obj.flow.name if obj.flow else None
    
    
    
class Disability_Screening_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = disability_screening
        fields = ['disability_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','language_delay','behavioural_disorder','speech_screening','comment','is_deleted','form_submit','added_date','added_by','modify_date','modify_by']
        

class Disability_Screening_Get_Serializer(serializers.ModelSerializer):
    language_delay_name = serializers.CharField(source='language_delay.language_delay',allow_null=True)
    behavioural_disorder_name = serializers.CharField(source='behavioural_disorder.behavioural_disorder',allow_null=True)
    speech_screening_name = serializers.CharField(source='speech_screening.speech_screening',allow_null=True)
    
    class Meta:
        model = disability_screening
        fields = ['disability_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','language_delay','behavioural_disorder','speech_screening','comment','is_deleted','form_submit','added_date','added_by','modify_date','modify_by',
                  'language_delay_name','behavioural_disorder_name','speech_screening_name']
        

class Birth_Defect_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = birth_defect
        fields = [
            'birth_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'birth_defects', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]
        
class Birth_Defect_Get_Serializer(serializers.ModelSerializer):
    birth_defects_name = serializers.SerializerMethodField()
    class Meta:
        model = birth_defect
        fields = [
            'birth_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'birth_defects','birth_defects_name', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    def get_birth_defects_name(self, obj):
        try:
            if not obj.birth_defects:
                return []
            
            if isinstance(obj.birth_defects, list):
                defect_ids = obj.birth_defects
            elif isinstance(obj.birth_defects, dict):
                defect_ids = obj.birth_defects.get("defect_ids", [])
            else:
                return []

            defects = basic_information_birth_defects.objects.filter(
                birth_defects_id__in=defect_ids,
                is_deleted=False
            ).values('birth_defects_id', 'birth_defects')

            return list(defects)

        except Exception as e:
            return {"error": str(e)}
        
        
class Childhood_Diseases_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = childhood_diseases
        fields = [
            'childhood_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'childhood_diseases', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]


class Childhood_Diseases_Get_Serializer(serializers.ModelSerializer):
    childhood_diseases_name = serializers.SerializerMethodField()

    class Meta:
        model = childhood_diseases
        fields = [
            'childhood_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'childhood_diseases', 'childhood_diseases_name', 
            'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    def get_childhood_diseases_name(self, obj):
        """
        Map the JSON field IDs (childhood_diseases) to readable names
        from the basic_information_childhood_disease table.
        """
        if not obj.childhood_diseases:
            return []

        try:
            # Fetch all disease names where IDs are in the JSON list
            disease_ids = obj.childhood_diseases
            if not isinstance(disease_ids, list):
                return []

            diseases = basic_information_childhood_disease.objects.filter(
                childhood_disease_id__in=disease_ids,
                is_deleted=False
            ).values_list('childhood_disease', flat=True)

            return list(diseases)

        except Exception as e:
            # fallback in case of invalid JSON or lookup error
            return []
        
        


class Deficiencies_Screening_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = deficiencies
        fields = [
            'deficiencies_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'deficiencies', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]






class Deficiencies_Get_Serializer(serializers.ModelSerializer):
    deficiencies_name = serializers.SerializerMethodField()

    class Meta:
        model = deficiencies
        fields = [
            'deficiencies_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'deficiencies', 'deficiencies_name', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    def get_deficiencies_name(self, obj):
        """Return readable deficiency names from basic_information_deficiencies"""
        if not obj.deficiencies:
            return []
        try:
            ids = obj.deficiencies if isinstance(obj.deficiencies, list) else []
            values = list(
                basic_information_deficiencies.objects.filter(
                    deficiencies_id__in=ids, is_deleted=False
                ).values_list('deficiencies', flat=True)
            )
            return values
        except Exception:
            return []




class Skin_Conditions_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = skin_conditions
        fields = [
            'skin_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'skin_conditions', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]




class Skin_Conditions_Get_Serializer(serializers.ModelSerializer):
    skin_conditions_name = serializers.SerializerMethodField()

    class Meta:
        model = skin_conditions
        fields = [
            'skin_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'skin_conditions', 'skin_conditions_name', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    def get_skin_conditions_name(self, obj):
        """
        Convert stored skin_conditions IDs to their actual names.
        """
        if not obj.skin_conditions:
            return []

        # Get all matching condition names from the reference table
        conditions = basic_information_skin_conditions.objects.filter(
            skin_conditions_id__in=obj.skin_conditions,
            is_deleted=False
        ).values_list('skin_conditions', flat=True)
        return list(conditions)





class Diagnosis_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = diagnosis
        fields = [
            'diagnosis_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'diagnosis', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]




class Diagnosis_Get_Serializer(serializers.ModelSerializer):
    diagnosis_name = serializers.SerializerMethodField()

    class Meta:
        model = diagnosis
        fields = [
            'diagnosis_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id',
            'screening_citizen_id', 'diagnosis', 'diagnosis_name', 'form_submit',
            'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    def get_diagnosis_name(self, obj):
        """
        Converts diagnosis JSON (list of IDs) to actual diagnosis names
        """
        if not obj.diagnosis:
            return []
        
        # Handle if diagnosis is a list or a single value
        ids = obj.diagnosis if isinstance(obj.diagnosis, list) else [obj.diagnosis]
        
        # Fetch actual names
        diagnosis_names = basic_information_diagnosis.objects.filter(
            diagnosis_id__in=ids,
            is_deleted=False
        ).values_list('diagnosis', flat=True)
        
        return list(diagnosis_names)
    
    
class CheckBoxIfNormal_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = check_box_if_normal
        fields = [
            'check_box_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'check_box_if_normal', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]
        
class CheckBoxIfNormal_Get_Serializer(serializers.ModelSerializer):
    check_box_if_normal_name = serializers.SerializerMethodField()

    class Meta:
        model = check_box_if_normal
        fields = [
            'check_box_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'check_box_if_normal', 'check_box_if_normal_name',
            'form_submit', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    def get_check_box_if_normal_name(self, obj):
        """
        Convert JSON field (IDs) to actual names from basic_information_check_box_if_normal table
        """
        if not obj.check_box_if_normal:
            return []
        
        # Fetch all ID–Name mappings once
        mapping = dict(
            basic_information_check_box_if_normal.objects.values_list('check_box_if_normal_id', 'check_box_if_normal')
        )

        result = []
        for value in obj.check_box_if_normal:
            # Handle if it's a list of IDs
            if isinstance(value, int):
                result.append(mapping.get(value, f"Unknown ({value})"))
            # Handle if it's a dict with keys
            elif isinstance(value, dict):
                readable_dict = {}
                for k, v in value.items():
                    readable_dict[k] = mapping.get(v, f"Unknown ({v})")
                result.append(readable_dict)
            else:
                result.append(str(value))
        return result
    
    
class Treatment_Serializer(serializers.ModelSerializer):
    class Meta:
        model = treatement
        fields = [
            'treatement_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id',
            'treatment_for', 'referral', 'reason_for_referral', 'place_referral',
            'outcome', 'referred_surgery', 'hospital_name', 'basic_referred_treatment',
            'reffered_to_specialist', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date','refer_doctor'
        ]
        read_only_fields = ['added_by', 'modify_by', 'added_date', 'modify_date']
        

class Treatment_Get_Serializer(serializers.ModelSerializer):
    referral_name = serializers.CharField(source='referral.referral', read_only=True)
    place_referral_name = serializers.CharField(source='place_referral.place_referral', read_only=True)
    hospital_name_text = serializers.CharField(source='hospital_name.hospital_name', read_only=True)
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)

    class Meta:
        model = treatement
        fields = ['treatement_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id', 'treatment_for', 'referral', 'referral_name', 'reason_for_referral', 'place_referral', 'place_referral_name', 'outcome', 'referred_surgery', 'hospital_name', 'hospital_name_text', 'basic_referred_treatment', 'form_submit', 'reffered_to_specialist', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date','doctor_name','refer_doctor']


class Auditory_Info_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = auditory_info
        fields = [
            'auditory_pk_id', 'audit_code', 'citizen_id', 'screening_count',
            'citizen_pk_id', 'screening_citizen_id',
            'hz_250_left', 'hz_500_left', 'hz_1000_left', 'hz_2000_left', 'hz_4000_left', 'hz_8000_left',
            'reading_left', 'left_ear_observations_remarks',
            'hz_250_right', 'hz_500_right', 'hz_1000_right', 'hz_2000_right', 'hz_4000_right', 'hz_8000_right',
            'reading_right', 'right_ear_observations_remarks',
            'reffered_to_specialist', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date','refer_doctor',
        ]
        
class Auditory_Info_Get_Serializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)
    class Meta:
        model = auditory_info
        fields = [
            'auditory_pk_id', 'audit_code', 'citizen_id', 'screening_count',
            'citizen_pk_id', 'screening_citizen_id',
            'hz_250_left', 'hz_500_left', 'hz_1000_left', 'hz_2000_left', 'hz_4000_left', 'hz_8000_left',
            'reading_left', 'left_ear_observations_remarks',
            'hz_250_right', 'hz_500_right', 'hz_1000_right', 'hz_2000_right', 'hz_4000_right', 'hz_8000_right',
            'reading_right', 'right_ear_observations_remarks',
            'reffered_to_specialist', 'form_submit', 'is_deleted',
            'added_by', 'added_date', 'modify_by', 'modify_date','doctor_name','refer_doctor'
        ]
        
        
class Vision_Info_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = vision_info
        fields = [
            'vision_pk_id', 'vision_code', 'citizen_id', 'screening_count',
            'citizen_pk_id', 'screening_citizen_id',
            're_near_without_glasses', 're_far_without_glasses',
            'le_near_without_glasses', 'le_far_without_glasses',
            're_near_with_glasses', 're_far_with_glasses',
            'le_near_with_glasses', 'le_far_with_glasses',
            'comment', 'color_blindness', 'reffered_to_specialist',
            'form_submit', 'is_deleted', 'added_by', 'added_date',
            'modify_by', 'modify_date','refer_doctor'
        ]
        

class Vision_Info_Get_Serializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)
    class Meta:
        model = vision_info
        fields = [
            'vision_pk_id', 'vision_code', 'citizen_id', 'screening_count',
            'citizen_pk_id', 'screening_citizen_id',
            're_near_without_glasses', 're_far_without_glasses',
            'le_near_without_glasses', 'le_far_without_glasses',
            're_near_with_glasses', 're_far_with_glasses',
            'le_near_with_glasses', 'le_far_with_glasses',
            'comment', 'color_blindness', 'reffered_to_specialist',
            'form_submit', 'is_deleted', 'added_by', 'added_date',
            'modify_by', 'modify_date','doctor_name','refer_doctor'
        ]

class Medical_history_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = medical_history_info
        fields = ['medical_history_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','medical_history','past_operative_history','form_submit','is_deleted','added_by','added_date','modify_by','modify_date']


class MedicalHistoryInfo_Get_Serializer(serializers.ModelSerializer):
    medical_history_values = serializers.SerializerMethodField()
    past_operative_history_values = serializers.SerializerMethodField()

    class Meta:
        model = medical_history_info
        fields = [
            'medical_history_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id',
            'screening_citizen_id', 'medical_history', 'past_operative_history',
            'medical_history_values', 'past_operative_history_values',
            'form_submit', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date'
        ]

    # 🔹 Fetch medical history names from IDs
    def get_medical_history_values(self, obj):
        try:
            if isinstance(obj.medical_history, list):
                names = medical_history.objects.filter(
                    medical_hist_id__in=obj.medical_history, is_deleted=False
                ).values_list('medical_history', flat=True)
                return list(names)
        except Exception:
            pass
        return []

    # 🔹 Fetch past operative history names from IDs
    def get_past_operative_history_values(self, obj):
        try:
            if isinstance(obj.past_operative_history, list):
                names = agg_citizen_past_operative_history.objects.filter(
                    past_operative_hist_id__in=obj.past_operative_history, is_deleted=False
                ).values_list('past_operative_history', flat=True)
                return list(names)
        except Exception:
            pass
        return []
    
    


class PFT_Info_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = pft_info
        fields = [
            'pft_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id',
            'screening_citizen_id', 'pft_reading', 'observations',
            'form_submit', 'is_deleted', 'added_by', 'added_date',
            'modify_by', 'modify_date'
        ]
        


class PFT_Info_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = pft_info
        fields = [
            'pft_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id',
            'screening_citizen_id', 'pft_reading', 'observations',
            'form_submit', 'is_deleted', 'added_by', 'added_date',
            'modify_by', 'modify_date'
        ]
        
        

class Dental_Info_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = dental_info
        fields = [
            'denta_pk_id', 'dental_code', 'citizen_id', 'screening_count',
            'citizen_pk_id', 'screening_citizen_id', 'oral_hygiene',
            'oral_hygiene_remark', 'gum_condition', 'gum_condition_remark',
            'oral_ulcers', 'oral_ulcers_remark', 'gum_bleeding',
            'gum_bleeding_remark', 'discoloration_of_teeth',
            'discoloration_of_teeth_remark', 'food_impaction',
            'food_impaction_remark', 'carious_teeth', 'carious_teeth_remark',
            'extraction_done', 'extraction_done_remark', 'fluorosis',
            'fluorosis_remark', 'tooth_brushing_frequency',
            'tooth_brushing_frequency_remark', 'reffered_to_specialist',
            'reffered_to_specialist_remark', 'sensitive_teeth',
            'sensitive_teeth_remark', 'malalignment', 'malalignment_remark',
            'orthodontic_treatment', 'orthodontic_treatment_remark', 'comment',
            'treatment_given', 'referred_to_surgery', 'dental_conditions',
            'dental_refer_hospital', 'image', 'english', 'marathi',
            'form_submit', 'is_deleted', 'added_by', 'added_date',
            'modify_by', 'modify_date','refer_doctor'
        ]
        


class Dental_Info_Get_Serializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='refer_doctor.doctor_name', allow_null=True)
    class Meta:
        model = dental_info
        fields = [
            'denta_pk_id', 'dental_code', 'citizen_id', 'screening_count',
            'citizen_pk_id', 'screening_citizen_id', 'oral_hygiene',
            'oral_hygiene_remark', 'gum_condition', 'gum_condition_remark',
            'oral_ulcers', 'oral_ulcers_remark', 'gum_bleeding',
            'gum_bleeding_remark', 'discoloration_of_teeth',
            'discoloration_of_teeth_remark', 'food_impaction',
            'food_impaction_remark', 'carious_teeth', 'carious_teeth_remark',
            'extraction_done', 'extraction_done_remark', 'fluorosis',
            'fluorosis_remark', 'tooth_brushing_frequency',
            'tooth_brushing_frequency_remark', 'reffered_to_specialist',
            'reffered_to_specialist_remark', 'sensitive_teeth',
            'sensitive_teeth_remark', 'malalignment', 'malalignment_remark',
            'orthodontic_treatment', 'orthodontic_treatment_remark', 'comment',
            'treatment_given', 'referred_to_surgery', 'dental_conditions',
            'dental_refer_hospital', 'image', 'english', 'marathi',
            'form_submit', 'is_deleted', 'added_by', 'added_date',
            'modify_by', 'modify_date','doctor_name','refer_doctor'
        ]
        
        
class Immunisation_Info_Post_Serializer(serializers.ModelSerializer):
    class Meta:
        model = immunisation_info
        fields = ['immunization_pk_id','immunization_code','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','name_of_vaccine','form_submit','is_deleted','added_by','added_date','modify_by','modify_date']
        
        
class Immunisation_Info_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = immunisation_info
        fields = ['immunization_pk_id','immunization_code','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','name_of_vaccine','form_submit','is_deleted','added_by','added_date','modify_by','modify_date']
        
        
class Investigation_Info_Post_Serializer(serializers.ModelSerializer):
    
    class Meta:
        model = investigation_info
        fields = ['investigation_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id','investigation_report', 'urine_report', 'ecg_report', 'x_ray_report',
        'form_submit', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date','selected_submodules']

        extra_kwargs = {
                'citizen_id': {'required': False},
                'screening_count': {'required': False},
                'citizen_pk_id': {'required': False},
                'screening_citizen_id': {'required': False},
            }
        
        
class Investigation_Info_Get_Serializer(serializers.ModelSerializer):
    
    class Meta:
        model = investigation_info
        fields = ['investigation_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id','investigation_report', 'urine_report', 'ecg_report', 'x_ray_report',
        'form_submit', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date','selected_submodules']
        




class Healthcard_Citizen_List_Serializer(serializers.ModelSerializer):
    
    name = serializers.CharField(source='citizen_pk_id.name')
    aadhar_id = serializers.CharField(source='citizen_pk_id.aadhar_id')
    gender = serializers.CharField(source='citizen_pk_id.gender')
    dob = serializers.DateField(source='citizen_pk_id.dob')
    year = serializers.CharField(source='citizen_pk_id.year')
    prefix = serializers.CharField(source='citizen_pk_id.prefix')

    class Meta:
        model = Screening_citizen
        fields = ['prefix','name','aadhar_id','gender','dob','year','pk_id','citizen_id','citizen_pk_id','screening_count']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
    

class Citizen_Data_Get_Serializer(serializers.ModelSerializer):
    age = serializers.CharField(source='age.age',allow_null=True)
    source = serializers.CharField(source='source.source',allow_null=True)
    gender = serializers.CharField(source='gender.gender',allow_null=True)
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)

    # Use getattr to handle nullable fields
    state = serializers.CharField(source='state.state_name', allow_null=True)
    district = serializers.CharField(source='district.dist_name', allow_null=True)
    tehsil = serializers.CharField(source='tehsil.tahsil_name', allow_null=True)

    class Meta:
        model = Citizen
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data



class Dental_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = dental_info
        fields = '__all__'
        
class Vital_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = vital_info
        fields = '__all__'

class Auditory_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = auditory_info
        fields = '__all__'
        
class Genral_examination_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = genral_examination
        fields = '__all__'
        
class Systemic_exam_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = systemic_exam
        fields = '__all__'

class Disability_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = disability_screening
        fields = '__all__'
        

class Birthdefect_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = birth_defect
        fields = '__all__'
        
class Childhooddisease_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = childhood_diseases
        fields = '__all__'
        
class Defeciencies_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = deficiencies
        fields = '__all__'
        
class Skinconditions_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = skin_conditions
        fields = '__all__'
        
class Diagnosis_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = diagnosis
        fields = '__all__'
        
class Treatment_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = treatement
        fields = '__all__'
        
class Vision_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = vision_info
        fields = '__all__'
        
class Medicalhistory_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = medical_history_info
        fields = '__all__'
        
class pft_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = pft_info
        fields = '__all__'
        
class Immunisation_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = immunisation_info
        fields = '__all__'
        
class growth_monitoring_info_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = growth_monitoring_info
        fields = '__all__'


class followup_save_info_Serializer(serializers.ModelSerializer):
    follow_up = serializers.PrimaryKeyRelatedField(queryset=agg_sc_follow_up_status.objects.all(),required=False) 
    class Meta:
        model = followup_save
        fields = ['call_status','conversational_remarks','not_connected_reason','visit_status','visited_status','condition_improved','weight_gain_status','forward_to','priority','not_visited_reason','reschedule_date1','reschedule_date2','follow_up','remark','added_by','citizen_id','name','dob','parents_no','state','tehsil','district','source_name','follow_up_citizen_pk_id','followup_count','screening_citizen_id']


class Workshop_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['logo']

class followup_save_info_Serializer(serializers.ModelSerializer):
    follow_up = serializers.PrimaryKeyRelatedField(queryset=agg_sc_follow_up_status.objects.all(),required=False) 
    class Meta:
        model = followup_save
        fields = ['call_status','conversational_remarks','not_connected_reason','visit_status','visited_status','condition_improved','weight_gain_status','forward_to','priority','not_visited_reason','reschedule_date1','reschedule_date2','follow_up','remark','added_by','citizen_id','name','dob','parents_no','state','tehsil','district','source_name','follow_up_citizen_pk_id','followup_count','screening_citizen_id']
        
class Workshop_Get_Serializer(serializers.ModelSerializer):
    modify_by = agg_com_colleague_Serializer()
    added_by = agg_com_colleague_Serializer()
    class Meta:
        model = Workshop
        # fields = ['ws_pk_id','Workshop_name']
        fields = '__all__'
        
        
class Workshop_Id_Wise_Get_Serializer(serializers.ModelSerializer):
    ws_state_name = serializers.CharField(source='ws_state.state_name', allow_null=True)
    ws_district_name = serializers.CharField(source='ws_district.dist_name', allow_null=True)
    ws_taluka_name = serializers.CharField(source='ws_taluka.tahsil_name', allow_null=True)
    source_name = serializers.CharField(source='source.source',allow_null=True)
    modify_by = agg_com_colleague_Serializer()
    added_by = agg_com_colleague_Serializer()
    
    class Meta:
        model = Workshop
        fields = '__all__'
        
class Workshop_Update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = '__all__'
        

class Category_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['pk_id','category']

class Workshop_delete_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['Workshop','is_deleted']


class Workshop_Get_Api_Dashboard_Serializer(serializers.ModelSerializer):
   class Meta:
       model = Workshop
       fields = ['ws_pk_id','Workshop_name','ws_address','latitude','longitude','added_date']


class Workshop_list_get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['ws_pk_id','Workshop_name','ws_taluka']

class Doctor_List_Serializer(serializers.ModelSerializer):
    class Meta:
        model = doctor_list
        fields = ['doctor_pk_id','doctor_name']


class Citizen_Filter_Serializer(serializers.ModelSerializer):
     class Meta:
        model = Citizen
        fields = '__all__'



class filter_workshop_Serializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='ws_state.state_name', allow_null=True)
    district_name = serializers.CharField(source='ws_district.dist_name', allow_null=True)
    taluka_name = serializers.CharField(source='ws_taluka.tahsil_name', allow_null=True)
    
    class Meta:
        model = Workshop
        fields = '__all__'
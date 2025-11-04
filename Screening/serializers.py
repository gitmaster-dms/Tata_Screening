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

class add_new_source_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_source
        fields = ['Registration_details']

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
# __________ Testing __________________________
 
class agg_sc_citizen_dental_Download_Serializer(serializers.ModelSerializer):
     class Meta:
        model = agg_sc_citizen_dental_info
        fields = '__all__'


# class agg_sc_sick_room_info_Serializer(serializers.ModelSerializer):
#      class Meta:
#         model = agg_sc_citizen_sick_room_info
#         fields = '__all__'


        





# class agg_sc_add_new_citizens_Serializer(serializers.ModelSerializer):
#      class Meta:
#         model = agg_sc_add_new_citizens
#         fields = '__all__'

# __________ End Testing __________________________







        
# __________ Final API __________________________


# # ___________ State _____________________________
# class agg_ind_state_Serializer(serializers.ModelSerializer):
#      class Meta:
#         model = agg_ind_state
#         fields = ['state_code','state_name']
# # ___________ End State _____________________________

# # ___________ District _____________________________
# class agg_mh_district_Serializer(serializers.ModelSerializer):
#      class Meta:
#         model = agg_mh_district
#         fields = ['dis_code', 'dis_name']
# # ___________ End District _____________________________

# # ___________ Taluka _____________________________
# class agg_mh_taluka_Serializer(serializers.ModelSerializer):
#      class Meta:
#         model = agg_mh_taluka
#         fields = ['tal_code', 'tal_name']
# # ___________ End Taluka _____________________________

# # ________________ State - District - Taluka __________________
# class agg_state_district_taluka_serializer(serializers.ModelSerializer):
#         st_id = agg_ind_state_Serializer()
#         dis_id = agg_mh_district_Serializer()
#         # tal_id = agg_mh_taluka_Serializer()
#         class Meta:
#                 model = agg_mh_taluka
#                 fields = ( 'st_id', 'dis_id', 'tal_id', 'tal_code', 'tal_name' )

# # ________________ End State - District - Taluka __________________

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
# ___________ End Source _____________________________

# ____________________________ Source District Get ________________________________________

# Get Source Form Source Name
class source_SourceName_Serializer(serializers.ModelSerializer):
     source = agg_source_Serializer()
     class Meta:
        model = agg_sc_add_new_source
        fields = ('source_pk_id', 'source', 'source_names')


class ScreeningForTypeSerializer(serializers.ModelSerializer):
        source = agg_source_Serializer()
        class Meta:
                model = agg_sc_screening_for_type
                # fields = ['type','source_id']
                fields = ('type_id', 'type', 'source')
                

class source_State_Serializer4(serializers.ModelSerializer):
     source = agg_source_Serializer()
     source_state = agg_sc_state_info_Serializer()
     class Meta:
        model = agg_sc_add_new_source
        fields = ( 'source', 'source_pk_id', 'source_names', 'source_state')

# Get Add New Source under State - Source, Source Name, State, District 
class agg_sc_add_new_source_source_district_Serializer1(serializers.ModelSerializer):
     source = agg_source_Serializer()
     source_state = agg_sc_state_info_Serializer()
     source_district = agg_sc_district_name_id_serializer()
     class Meta:
        model = agg_sc_add_new_source
        fields = ('source', 'source_pk_id', 'source_names', 'source_state', 'source_district')

# Get Add New Source under District - Source, Source Name, State, District
class agg_sc_add_new_source_source_district_Serializer2(serializers.ModelSerializer):
     source = agg_source_Serializer()
     source_state = agg_sc_state_info_Serializer()
     source_district = agg_sc_district_name_id_serializer()
     class Meta:
        model = agg_sc_add_new_source
        fields = ( 'source', 'source_pk_id', 'source_names',  'source_state', 'source_district')

# Get Add New Source - Source, Source Name, State, District, Taluka 
class agg_sc_add_new_source_source_district_Serializer3(serializers.ModelSerializer):
     source = agg_source_Serializer()
     source_state = agg_sc_state_info_Serializer()
     source_district = agg_sc_district_name_id_serializer()
     source_taluka = agg_sc_tahsil_name_id_serializer()
     class Meta:
        model = agg_sc_add_new_source
        fields = ('source', 'source_pk_id', 'source_names', 'source_state', 'source_district', 'source_taluka')

# Get Add New Source District- Source, Source Name, State, District, Taluka  [District to Source Name ]
class agg_sc_add_new_source_source_district_Serializer5(serializers.ModelSerializer):
     source = agg_source_Serializer()
     source_state = agg_sc_state_info_Serializer()
     source_district = agg_sc_district_name_id_serializer()
     source_taluka = agg_sc_tahsil_name_id_serializer()
     class Meta:
        model = agg_sc_add_new_source
        fields = ( 'source_district', 'source_state','source_taluka', 'source', 'source_pk_id', 'source_names')


class taluka_to_source_name_Serializer(serializers.ModelSerializer):
     source = agg_source_Serializer()
     source_state = agg_sc_state_info_Serializer()
     source_district = agg_sc_district_name_id_serializer()
     source_taluka = agg_sc_tahsil_name_id_serializer()     
     class Meta:
        model = agg_sc_add_new_source
        fields = (  'source', 'source_state', 'source_district','source_taluka', 'source_pk_id', 'screening_source_code', 'source_names')





# Amit 

class Source_sourName_Shedule_Id_Serializer(serializers.ModelSerializer):
    source_name = source_SourceName_Serializer 
    class Meta:
          model = agg_sc_schedule_screening
          fields = ('schedule_screening_pk_id', 'schedule_id', 'source', 'source_name')





# class source_from_id_state_api_Serializer(serializers.ModelSerializer):
#      class Meta:
#         model = agg_sc_add_new_source
#         fields = ('source_pk_id', 'source', 'source_state')

#      def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data['source_pk_id'] = instance.source.source_pk_id 
#         data['state_name'] = instance.source_state.state_name
#         data['source'] = instance.source.source 
#         return data


class source_from_id_state_api_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_source
        fields = ('source_pk_id', 'source', 'source_state')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # data['source_pk_id'] = instance.source.source_pk_id 
        # data['source'] = instance.source.source 
        if instance.source:
            data['source_pk_id'] = instance.source.source_pk_id
        else:
            data['source_pk_id'] = None

        if instance.source:
            data['source'] = instance.source.source
        else:
            data['source'] = None      

        if instance.source_state:
            data['state_name'] = instance.source_state.state_name
        else:
            data['state_name'] = None  

        return data
     

class source_state_from_id_district_api_Serializer(serializers.ModelSerializer):

     class Meta:
        model = agg_sc_add_new_source
        fields = ( 'source_state', 'source_district')

     def to_representation(self, instance):
        data = super().to_representation(instance)
        # data['state_name'] = instance.source_state.state_name
        # data['dist_name'] = instance.source_district.dist_name
        if instance.source_state:
            data['state_name'] = instance.source_state.state_name
        else:
            data['state_name'] = None
 
        if instance.source_district:
            data['dist_name'] = instance.source_district.dist_name
        else:
            data['dist_name'] = None
        return data

class source_state_district_from_id_taluka_api_Serializer(serializers.ModelSerializer):

     class Meta:
        model = agg_sc_add_new_source
        fields = ('source_district', 'source_taluka')

     def to_representation(self, instance):
        data = super().to_representation(instance)
        # data['dist_name'] = instance.source_district.dist_name  
        # data['tahsil_name'] = instance.source_taluka.tahsil_name 

        if instance.source_district:
            data['dist_name'] = instance.source_district.dist_name
        else:
            data['dist_name'] = None 

        if instance.source_taluka:
            data['tahsil_name'] = instance.source_taluka.tahsil_name
        else:
            data['tahsil_name'] = None 
        return data
     
class taluka_from_id_SourceName_api_Serializer(serializers.ModelSerializer):
     class Meta:
        model = agg_sc_add_new_source
        fields = ('source_names', 'source_taluka', )

     def to_representation(self, instance):
        data = super().to_representation(instance)
        # data['tahsil_name'] = instance.source_taluka.tahsil_name 

        if instance.source_taluka:
            data['tahsil_name'] = instance.source_taluka.tahsil_name
        else:
            data['tahsil_name'] = None        
        return data
    

class taluka_from_id_SourceName_api_Serializer(serializers.ModelSerializer):

     class Meta:
        model = agg_sc_add_new_source
        fields = ('source_pk_id', 'source_names', 'source_taluka', 'source_district', 'source_state')

     def to_representation(self, instance):
        data = super().to_representation(instance)
        # data['state_name'] = instance.source_state.state_name 
        # data['dist_name'] = instance.source_district.dist_name 
        # data['tahsil_name'] = instance.source_taluka.tahsil_name  

        if instance.source_state:
            data['state_name'] = instance.source_state.state_name
        else:
            data['state_name'] = None 

        if instance.source_district:
            data['dist_name'] = instance.source_district.dist_name
        else:
            data['dist_name'] = None 

        if instance.source_taluka:
            data['tahsil_name'] = instance.source_taluka.tahsil_name
        else:
            data['tahsil_name'] = None                            
        return data

class district_from_id_SourceName_api_Serializer(serializers.ModelSerializer):

     class Meta:
        model = agg_sc_add_new_source
        fields = ('source_names', 'source_district', )

     def to_representation(self, instance):
        data = super().to_representation(instance)
        # data['dist_name'] = instance.source_district.dist_name 

        if instance.source_district:
            data['dist_name'] = instance.source_district.dist_name
        else:
            data['dist_name'] = None 
        return data
# ____________________________ End Source District Get ________________________________________




# ___________ Add New Source _____________________________
# class agg_sc_add_GET_new_source_Serializer(serializers.ModelSerializer):
#         source = serializers.CharField(source='source.source',allow_null=True)  
#         source_state = serializers.CharField(source='source_state.state_name', allow_null=True)  
#         source_district = serializers.CharField(source='source_district.dist_name', allow_null=True)  
#         source_taluka = serializers.CharField(source='source_taluka.tahsil_name', allow_null=True)
#         source_id = serializers.IntegerField(source='source.source_pk_id',allow_null=True)
#         state_id = serializers.IntegerField(source='source_state.state_id',allow_null=True)
#         district_id = serializers.IntegerField(source='source_district.dist_id',allow_null=True)
#         tehsil_id = serializers.IntegerField(source='source_taluka.tal_id',allow_null=True)  
#         # added_by = agg_com_colleague_Serializer() #AMIT
#         # modify_by = agg_com_colleague_Serializer()    #AMIT 
#         class Meta:
#                 model = agg_sc_add_new_source
#                 fields = ( 'source', 'source_pk_id', 'source_names', 'registration_no', 'mobile_no', 'email_id', 'Registration_details', 'source_state', 'source_district', 'source_taluka','source_pincode', 'source_address','source_id','state_id','district_id','tehsil_id','added_by', 'modify_by')#
        
#         def to_representation(self, instance):
#             data = super().to_representation(instance)
#             return data 

class agg_sc_add_GET_new_source_Serializer(serializers.ModelSerializer):
        source = agg_source_Serializer()
        source_state = agg_sc_state_info_Serializer()
        source_district = agg_sc_district_name_id_serializer()
        source_taluka = agg_sc_tahsil_name_id_serializer() 
        state_id = serializers.IntegerField(source='source_state.state_id',allow_null=True)
        district_id = serializers.IntegerField(source='source_district.dist_id',allow_null=True)
        tehsil_id = serializers.IntegerField(source='source_taluka.tal_id',allow_null=True)  
        source_id = serializers.IntegerField(source='source.source_pk_id',allow_null=True)       
        class Meta:
                model = agg_sc_add_new_source
                fields = ( 'source', 'source_pk_id', 'source_names', 'registration_no', 'mobile_no', 'email_id', 'Registration_details', 'source_state', 'source_district', 'source_taluka','source_pincode', 'source_address','tehsil_id','district_id','state_id','source_id','screening_vitals','sub_screening_vitals')


  
class agg_sc_add_new_source_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_source
                fields = ( 'source', 'source_pk_id', 'source_names', 'registration_no', 'mobile_no', 'email_id', 'Registration_details', 'source_state', 'source_district', 'source_taluka','source_pincode', 'source_address', 'added_by', 'modify_by')

class agg_sc_add_new_source_PUT_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_source
                fields = ( 'source', 'source_pk_id', 'source_names', 'registration_no', 'mobile_no', 'email_id', 'Registration_details', 'source_state', 'source_district', 'source_taluka','source_pincode', 'source_address', 'modify_by','screening_vitals','sub_screening_vitals')
        
class agg_sc_add_new_source_POST_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_source
                fields = ( 'source', 'source_pk_id', 'source_names', 'registration_no', 'mobile_no', 'email_id', 'Registration_details', 'source_state', 'source_district', 'source_taluka','source_pincode', 'source_address', 'added_by','screening_vitals','sub_screening_vitals')
        


# ___________ End Add New Source _____________________________

# ___________ Source _____________________________
class agg_sc_source_source_name_Serializer(serializers.ModelSerializer):       
        class Meta:
                model = agg_source
                fields = ( 'source_pk_id', 'source')
# ___________ End Source _____________________________

# ___________ Add New Schedule ___________________________________
class agg_sc_schedule_screening_Serializer(serializers.ModelSerializer): #AMIT
        class Meta:
                model = agg_sc_schedule_screening
                fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'source_name', 'source', 'Disease', 'screening_person_name', 'mobile_number','Class','type','state','district','tehsil')

class agg_sc_schedule_screening_get_Serializer(serializers.ModelSerializer): # AMIT
        source = serializers.CharField(source='source.source',allow_null=True)  
        source_name = serializers.CharField(source='source_name.source_names',allow_null=True)  
        state = serializers.CharField(source='state.state_name',allow_null=True)  
        district = serializers.CharField(source='district.dist_name',allow_null=True)  
        tehsil = serializers.CharField(source='tehsil.tahsil_name',allow_null=True)
        
        source_id = serializers.IntegerField(source='source.source_pk_id',allow_null=True)
        source_name_id = serializers.IntegerField(source='source_name.source_pk_id',allow_null=True)
        state_id = serializers.IntegerField(source='state.state_id',allow_null=True)
        district_id = serializers.IntegerField(source='district.dist_id',allow_null=True)
        tehsil_id = serializers.IntegerField(source='tehsil.tal_id',allow_null=True)  

        added_by = agg_com_colleague_Serializer() #Amit
        modify_by = agg_com_colleague_Serializer() #Amit                
        class Meta:
                model = agg_sc_schedule_screening
                fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'source_name', 'source','mobile_number','state','district','tehsil','source_id','source_name_id','state_id','district_id','tehsil_id','added_by', 'modify_by','screening_vitals','sub_screening_vitals','route','ambulance_no','pilot_name','screening_person_name')


class agg_sc_schedule_screening_POST_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_schedule_screening
                fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'source_name', 'source', 'Disease', 'screening_person_name', 'mobile_number','state','district','tehsil','added_by','screening_vitals','sub_screening_vitals')




class agg_sc_schedule_screening_PUT_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_schedule_screening
                fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'source_name', 'source', 'Disease', 'screening_person_name', 'mobile_number','Class','type','state','district','tehsil','modify_by','screening_vitals','sub_screening_vitals')
                # fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'screening_person_name', 'mobile_number','modify_by')

class agg_sc_schedule_screening_GET_PUT_Serializer(serializers.ModelSerializer):
        source = serializers.CharField(source='source.source',allow_null=True)  
        source_name = serializers.CharField(source='source_name.source_names',allow_null=True)  
        state = serializers.CharField(source='state.state_name',allow_null=True)  
        district = serializers.CharField(source='district.dist_name',allow_null=True)  
        tehsil = serializers.CharField(source='tehsil.tahsil_name',allow_null=True)
        Class = serializers.CharField(source='Class.class_name',allow_null=True)
        type = serializers.CharField(source='type.type',allow_null=True)
        Disease = serializers.CharField(source='Disease.disease',allow_null=True)
        
        source_id = serializers.IntegerField(source='source.source_pk_id',allow_null=True)
        source_name_id = serializers.IntegerField(source='source_name.source_pk_id',allow_null=True)
        state_id = serializers.IntegerField(source='state.state_id',allow_null=True)
        district_id = serializers.IntegerField(source='district.dist_id',allow_null=True)
        tehsil_id = serializers.IntegerField(source='tehsil.tal_id',allow_null=True)  
        class_id = serializers.IntegerField(source='Class.class_name',allow_null=True) 
        disease_id = serializers.IntegerField(source='Disease.disease_pk_id',allow_null=True)
        # type_id = serializers.IntegerField(source='type.type',allow_null=True)  
        
        
        class Meta:
                model = agg_sc_schedule_screening
                fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'source_name', 'source', 'Disease', 'screening_person_name', 'mobile_number','Class','type','state','district','tehsil','state_id','district_id','tehsil_id','source_id','source_name_id','class_id','type_id','disease_id','modify_by','screening_vitals','sub_screening_vitals')
                # fields = ( 'schedule_screening_pk_id', 'from_date', 'to_date', 'screening_person_name', 'mobile_number','modify_by')

# ___________ End Add New Schedule ___________________________________



# _______________________ Add New Citizen ___________________________________

# _______________________ Add New Citizen Post all data ___________________________________
class agg_sc_add_new_citizens_Serializer(serializers.ModelSerializer):
        modify_by = agg_com_colleague_Serializer() #Amit
        added_by = agg_com_colleague_Serializer() #Amit
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ('citizens_pk_id','age', 'gender', 'source','type','disease', 'name', 'gender', 'dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','Class','division','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms', 'modify_by', 'added_by')# 'modify_by' 

class agg_sc_add_new_citizens_DELETE_Serializer(serializers.ModelSerializer):
        modify_by = agg_com_colleague_Serializer() #Amit
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ('citizens_pk_id','age', 'gender', 'source','type','disease', 'name', 'gender', 'dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','Class','division','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms', 'modify_by')# 'modify_by' 

class agg_sc_add_new_citizens_POST_Serializer(serializers.ModelSerializer):
        class Meta:
            model = agg_sc_add_new_citizens
            fields = ['citizens_pk_id','age', 'gender', 'source','type','disease','prefix','name','dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','Class','division','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms', 'added_by','location']# 'added_by' 

                 
class agg_sc_add_new_citizens_PUT_Serializer(serializers.ModelSerializer):
        # modify_by = agg_com_colleague_Serializer() #Amit
        # added_by = agg_com_colleague_Serializer() #Amit
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ('citizens_pk_id','age', 'gender', 'source','type','disease', 'name', 'gender', 'dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','Class','division','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms', 'modify_by','location')# 'modify_by' 



class agg_sc_add_new_citizens_get_Serializer(serializers.ModelSerializer):
    # age = serializers.SerializerMethodField()
    # gender = serializers.SerializerMethodField()
    # source = serializers.SerializerMethodField()
    # type = serializers.SerializerMethodField()
    # disease = serializers.SerializerMethodField()
    # state = serializers.SerializerMethodField()
    # district = serializers.SerializerMethodField()
    # tehsil = serializers.SerializerMethodField()
    # source_name = serializers.SerializerMethodField()
    # Class = serializers.SerializerMethodField()
    # division = serializers.SerializerMethodField()
#     class_id = serializers.IntegerField(source='Class.class_id')
#     division_id = serializers.IntegerField(source='division.division_id')
#     age_id = serializers.IntegerField(source='age.age_pk_id')
#     gender_id = serializers.IntegerField(source='gender.gender_pk_id')
#     source_id = serializers.IntegerField(source='source.source_pk_id')
#     type_id = serializers.IntegerField(source='type.type_id')
# #     disease_id = serializers.IntegerField(source='disease.disease_pk_id')
#     state_id = serializers.IntegerField(source='state.state_id')
#     district_id = serializers.IntegerField(source='district.dist_id')
#     tehsil_id = serializers.IntegerField(source='tehsil.tal_id') 
#     source_name_id = serializers.IntegerField(source='source_name.source_pk_id')
    
    
    
    class_name = serializers.CharField(source='Class.class_name',allow_null=True)
    division_name = serializers.CharField(source='division.division_name',allow_null=True)
    age_name = serializers.CharField(source='age.age',allow_null=True)
    gender_name = serializers.CharField(source='gender.gender',allow_null=True)
    type_name = serializers.CharField(source='type.type',allow_null=True)
    disease_name = serializers.CharField(source='disease.disease',allow_null=True)
    state_name = serializers.CharField(source='state.state_name',allow_null=True)
    district_name = serializers.CharField(source='district.dist_name',allow_null=True)
    tehsil_name = serializers.CharField(source='tehsil.tahsil_name',allow_null=True) 
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)
    source_id_name = serializers.CharField(source='source.source',allow_null=True)
    
    
    modify_by = agg_com_colleague_Serializer() #Amit
    added_by = agg_com_colleague_Serializer() #Amit
    
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ('citizens_pk_id', 'age', 'gender', 'source', 'type', 'disease','prefix','name', 'dob', 'blood_groups',
                  'year', 'months', 'days', 'aadhar_id', 'Class', 'division', 'father_name', 'mother_name',
                  'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state',
                  'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age',
                  'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms', 'age_name','gender_name','type_name','state_name','district_name','tehsil_name','class_name','division_name','disease_name','source_name_name','source_id_name', 'added_by', 'modify_by','location' )
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     return data 

    # def get_age(self, instance):
    #     return instance.age.age if instance.age else None
    
    # def get_gender(self, instance):
    #     return instance.gender.gender if instance.gender else None

    # def get_source(self, instance):
    #     return instance.source.source if instance.source else None

    # def get_type(self, instance):
    #     return instance.type.type if instance.type else None

    # def get_disease(self, instance):
    #     return instance.disease.disease if instance.disease else None

    # def get_state(self, instance):
    #     return instance.state.state_name if instance.state else None
    
    # def get_district(self, instance):
    #     return instance.district.dist_name if instance.district else None

    # def get_tehsil(self, instance):
    #     return instance.tehsil.tahsil_name if instance.tehsil else None

    # def get_source_name(self, instance):
    #     return instance.source_name.source_names if instance.source_name else None
    
    # def get_Class(self, instance):
    #     return instance.Class.class_name if instance.Class else None


    # def get_division(self, instance):
    #     return instance.division.division_name if instance.division else None

# _______________________ Add New Citizen Post all data ___________________________________

#----------------------------------Corpare Screening-------------------------
# _______________________ Add New Employee Post all data ___________________________________
class agg_sc_add_new_employee_POST_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ('prefix','citizens_pk_id','age', 'gender', 'source','disease','type','name', 'gender', 'dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile','state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms','department','designation','employee_id','marital_status','emp_mobile_no','email_id','child_count','spouse_name','sibling_count','added_by','permanant_address','photo','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address','doj','official_email','site_plant','official_mobile')# 'added_by'


class EmployeeDataGetSerializer(serializers.ModelSerializer):
    # age = serializers.CharField(source='age.age',allow_null=True)
    # source = serializers.CharField(source='source.source',allow_null=True)
    # gender = serializers.CharField(source='gender.gender',allow_null=True)
    # type = serializers.CharField(source='type.type',allow_null=True)
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)

    # Use getattr to handle nullable fields
    source_id_name = serializers.CharField(source='source.source',allow_null=True)
    type_name = serializers.CharField(source='type.type',allow_null=True)
    age_name = serializers.CharField(source='age.age', allow_null=True)
    gender_name =  serializers.CharField(source='gender.gender',allow_null=True)
    disease_name = serializers.CharField(source='disease.disease', allow_null=True)
    department_name = serializers.CharField(source='department.department', allow_null=True)
    designation_name = serializers.CharField(source='designation.designation', allow_null=True)
    state_name = serializers.CharField(source='state.state_name', allow_null=True)
    district_name = serializers.CharField(source='district.dist_name', allow_null=True)
    tehsil_name = serializers.CharField(source='tehsil.tahsil_name', allow_null=True)
    
    modify_by = agg_com_colleague_Serializer()
    added_by = agg_com_colleague_Serializer() 

    class Meta:
        model = agg_sc_add_new_citizens
        fields = ('prefix','citizens_pk_id','age', 'gender', 'source','type','disease', 'name', 'gender', 'dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','department','designation','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms','department','designation','employee_id','marital_status','emp_mobile_no','email_id','child_count','spouse_name','sibling_count','age_name','gender_name','type_name','source_name_name','designation_name','disease_name','department_name','state_name','district_name','tehsil_name','source_id_name','added_by','modify_by','permanant_address','photo','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address','doj','official_email','site_plant','official_mobile')# 'modify_by' 
        
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     return data               

class departmentinfoGETSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_department
        fields = ['department_id','department']
        
class designationinfoGETSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_designation
        fields = ['designation_id','designation']
        

class agg_sc_add_new_employee_PUT_Serializer(serializers.ModelSerializer):
        # modify_by = agg_com_colleague_Serializer() #Amit
        # added_by = agg_com_colleague_Serializer() #Amit
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ('prefix','citizens_pk_id','age', 'gender', 'source','type','disease', 'name', 'gender', 'dob', 'blood_groups', 'year', 'months', 'days', 'aadhar_id','department','designation','father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count', 'state', 'district', 'tehsil', 'pincode', 'address', 'source_name', 'height', 'weight', 'weight_for_age', 'height_for_age', 'weight_for_height', 'bmi', 'arm_size', 'symptoms','department','designation','employee_id','marital_status','emp_mobile_no','email_id','child_count','spouse_name','sibling_count','modify_by','permanant_address','photo','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address','doj','official_email','site_plant','official_mobile')# 'modify_by' 
# _______________________ End Add New Citizen ___________________________________




#____________________________Start Screening____________________________
class agg_sc_start_screening_Serializer(serializers.ModelSerializer):
   class Meta:
      model = agg_sc_start_screening    
      fields = ['start_screening_id','start_screening_code','citizen_id','schedule_id','source_id','citizen_mobile']
#________________________________________________________________________________________


#____________________________Start Screening____________________________
class agg_sc_start_screening_Serializer(serializers.ModelSerializer):
   class Meta:
      model = agg_sc_start_screening
      fields = ['pk_id','citizen_name','citizen_id','schedule_id','source_id','citizen_mobile']
#________________________________________________________________________________________

#___________________________Close Screening_________________________________
# class agg_sc_close_screening_Serializer(serializers.ModelSerializer):
#     class Meta:
#         model = a

class startScreeningNewSource_serializers(serializers.ModelSerializer):
     class Meta:
        model = agg_sc_add_new_source
        fields = ['source_pk_id', 'source', 'source_names', 'source_state', 'source_district', 'source_taluka']


class startScreeningCitizen_serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['citizens_pk_id', 'citizens_code', 'name', 'parents_mobile', 'source', 'source_name', 'state', 'district', 'tehsil']

class startScreeningSchedule_screening_serializers(serializers.ModelSerializer):
#     citizens_pk_id = StartScreeningSerializer
#     source_pk_id = startScreeningNewSource_serializers
    class Meta:
        model = agg_sc_schedule_screening
        fields = ['schedule_screening_pk_id', 'source_id', 'source', 'source_name', 'state', 'district', 'tahasil']

class StartScreeningSerializer(serializers.ModelSerializer):
    schedule_screening_pk_id = startScreeningSchedule_screening_serializers
    citizens_pk_id = startScreeningCitizen_serializers
    source_pk_id = startScreeningNewSource_serializers
    class Meta:
        model = agg_sc_start_screening
        fields = ['start_screening_id', 'citizen_name', 'citizen_mobile', 'schedule_screening_pk_id', 'citizens_pk_id', 'source_pk_id']



class StartScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_start_screening
        fields = '__all__'
        
#     def create(self, validated_data):
#         # Get data from agg_sc_schedule_screening
#         schedule_screening_data = agg_sc_schedule_screening.objects.get(
#             schedule_screening_pk_id=validated_data['schedule_id'].schedule_screening_pk_id
#         )

#         # Get data from agg_sc_add_new_citizens
#         citizens_data = agg_sc_add_new_citizens.objects.get(
#             citizens_pk_id=validated_data['citizen_id'].citizens_pk_id
#         )

#         # Create a new instance of agg_sc_start_screening with the combined data
#         start_screening = agg_sc_start_screening.objects.create(
#             start_screening_code=validated_data['start_screening_code'],
#             citizen_id=citizens_data,
#             citizen_name=citizens_data.name,
#             citizen_mobile=citizens_data.parents_mobile,
#             schedule_id=schedule_screening_data,
#             source_id=validated_data['source_id']
#         )
#         return start_screening

# ___________________ Final API __________________________
class BMISerializer(serializers.ModelSerializer):
   class Meta:
      model = GrowthMonitoring
      fields = '__all__'

# ___________________ Final API __________________________


#____________________________Start Screening_______________________________________________
# class agg_sc_start_screening_Serializer(serializers.ModelSerializer):
#    class Meta:
#       model = agg_sc_start_screening
#       fields = ['pk_id','citizen_name','citizen_id','schedule_id','source_id','citizen_mobile']
#___________________________________________________________________________________________


class agg_sc_citizen_basic_info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['citizen_id', 'name', 'gender', 'blood_groups', 'dob', 'year', 'months', 'days', 'aadhar_id']

class schedule_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_schedule_screening
        fields = ['id','schedule_code']

class combined_citizenand_schedule_Serializer(serializers.Serializer):
    citizen_data = agg_sc_citizen_basic_info_Serializer(many=True)
    schedule_data = schedule_Serializer(many=True)




class BMISerializer(serializers.ModelSerializer):
   class Meta:
      model = GrowthMonitoring
      fields = '__all__'
                    


class scrserialzer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ['citizen_id','name','parents_mobile']


# serializers.py
from rest_framework import serializers
from .models import agg_sc_add_new_citizens

class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['prefix','citizens_pk_id','name', 'parents_mobile','source','source_name','state','district','tehsil','disease','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','emp_mobile_no','location']
             
     

class CitizenBasicinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['citizens_pk_id','name','prefix','gender','blood_groups','dob','year','months','days','aadhar_id','emp_mobile_no','email_id','department','designation','employee_id','doj']



class CitizenFamilyinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ['citizens_pk_id','father_name','mother_name','occupation_of_father','occupation_of_mother','parents_mobile','sibling_count','child_count','spouse_name','marital_status','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address']


class CitizenGrowthMonitoringinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ['citizens_pk_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size']

class CitizenMedicalEventinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_growth_monitoring_info
        fields = ['symptoms_if_any','remark','reffered_to_specialist']
     
class CitizenBasicinfoPUTSerializer(serializers.ModelSerializer):
    class Meta:
        model = citizen_basic_info
        fields = ['id','citizen_id','name','prefix','gender','blood_groups','aadhar_id','emp_mobile_no','email_id','employee_id','department','designation','doj','form_submit','added_by','modify_by']  
        
class CitizenBasicinfo_add_new_citizen_PUTSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['citizens_pk_id','name','prefix','gender','blood_groups','aadhar_id','emp_mobile_no','email_id','employee_id','department','designation','doj']  

class CitizenFamilyinfoPUTSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_family_info
                fields = ['id','citizen_id','father_name','mother_name','occupation_of_father','occupation_of_mother','parents_mobile','sibling_count','child_count','spouse_name','marital_status','form_submit','added_by','modify_by','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address']

class CitizenFamilyinfo_add_new_citizen_PUTSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['citizens_pk_id', 'father_name', 'mother_name', 'occupation_of_father', 'occupation_of_mother', 'parents_mobile', 'sibling_count','child_count','spouse_name','marital_status','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address']

class CitizenGrowthMonitoringinfoPUTSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_growth_monitoring_info
                fields = ['id','citizen_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','form_submit','symptoms_if_any','remark','reffered_to_specialist','added_by','modify_by','schedule_id']
                
class CitizenGrowthMonitoring_add_new_citzen_info_PUTSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_citizens
                fields = ['citizens_pk_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size']
   

class CitizenVitalinfoPUTSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_vital_info
        fields = ['vital_info_pk_id','pulse','pulse_conditions','sys_mm_conditions','dys_mm_mm_conditions','sys_mm','dys_mm','rr','oxygen_saturation','temp','oxygen_saturation_conditions','temp_conditions','rr_conditions','form_submit','reffered_to_specialist']     



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


class CitizenVitalinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_vital_info
                fields = ['vital_info_pk_id','citizen_id','schedule_id','pulse','pulse_conditions','sys_mm_conditions','dys_mm_mm_conditions','sys_mm','dys_mm','rr','oxygen_saturation','temp','oxygen_saturation_conditions','temp_conditions','rr_conditions','form_submit','reffered_to_specialist']


class ClassinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_class
                fields = ['class_id','class_name']
                
class DivisioninfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_division
                fields = ['division_id','division_name']
                
class AuditoryinfogetSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_audit
                fields = ['audit_id','audit_name']
                
# class AuditoryinfoSerializer(serializers.ModelSerializer):
#         class Meta:
#                 model = agg_sc_citizen_audit_info
#                 fields = ['audit_info_pk_id','citizen_id','schedule_id',
#                           'allergic_reaction','cleft_ip','hearing_loss',
#                           'congenital_abnormality_of_ear','cleft_palate',
#                           'tongue_tie','nad','adenoid_hyertrophy','adenoiditis',
#                           'deviated_septal_defect','ear_enfection','nasal_polyp',
#                           'parathyroid_disease','pharyngitis','sinusitis','thyroid_disease'
#                           ,'tonsilitis','right','left','tratement_given','otoscopic_exam','remark']

class AuditoryinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_audit_info
                fields = ['audit_info_pk_id','citizen_id','schedule_id','checkboxes',
                          'right','left','tratement_given','otoscopic_exam','remark','reffered_to_specialist','hz_250_left'
                          ,'hz_500_left','hz_1000_left','hz_2000_left','hz_4000_left','hz_8000_left','reading_left','left_ear_observations_remarks',
                          'hz_250_right','hz_500_right','hz_1000_right','hz_2000_right','hz_4000_right','hz_8000_right','reading_right','right_ear_observations_remarks','referred_hospital_list']
                
                # fields = "__all__"


class SAM_MAM_BMI_Serializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_add_new_citizens
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
                



#---------------------------Dental Checkup-------------------------------------------------------#
class CitizenDentalinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_dental_info
                fields = ['dental_pk_id','citizen_id','schedule_id','oral_hygiene','oral_hygiene_remark','gum_condition','gum_condition_remark',
                          'oral_ulcers','oral_ulcers_remark','gum_bleeding','gum_bleeding_remark','discoloration_of_teeth','discoloration_of_teeth_remark',
                          'food_impaction','food_impaction_remark','carious_teeth','carious_teeth_remark','extraction_done','extraction_done_remark','fluorosis',
                          'fluorosis_remark','tooth_brushing_frequency','tooth_brushing_frequency_remark','reffered_to_specialist','reffered_to_specialist_remark',
                          'sensitive_teeth','sensitive_teeth_remark','malalignment','malalignment_remark',
                          'orthodontic_treatment','orthodontic_treatment_remark','comment','treatment_given','referred_to_surgery','dental_conditions']
                

#---------------------------Pychology Checkup-------------------------------------------------------#
class CitizenPychoinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_pycho_info
                fields = ['pycho_pk_id','citizen_id','schedule_id','diff_in_read','diff_in_read_text','diff_in_write','diff_in_write_text',
                          'hyper_reactive','hyper_reactive_text','aggresive','aggresive_text','urine_stool','urine_stool_text',
                          'peers','peers_text','poor_contact','poor_contact_text','scholastic','scholastic_text','any_other','pycho_conditions','reffered_to_specialist']

#---------------------------Vision Checkup-------------------------------------------------------#
class CitizenEyeCheckBoxinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = vision_eye_checkbox
                fields = ['eye_pk_id','eye']

class CitizenCheckBoxIfPresentSerializer(serializers.ModelSerializer):
        class Meta:
                model = vision_checkbox_if_present
                fields = ['checkbox_pk_id','checkbox_if_present']
                
                
class CitizenVisioninfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_vision_info
                fields = ['vision_pk_id','citizen_id','schedule_id','eye','if_other_commnet','reffered_to_specialist','vision_with_glasses',
                          'vision_without_glasses','eye_muscle_control','refractive_error','visual_perimetry','comment','treatment',
                          'checkboxes','color_blindness','vision_screening','vision_screening_comment','referred_to_surgery',
                          're_near_without_glasses','re_far_without_glasses','le_near_without_glasses','le_far_without_glasses','re_near_with_glasses','re_far_with_glasses','le_near_with_glasses','le_far_with_glasses','refer_hospital_name']

#---------------------------Basic Screening Checkup-------------------------------------------------------#

class CitizenBasicScreeninginfoSerializer(serializers.ModelSerializer):
    head_name = serializers.SerializerMethodField()
    skin_color_name = serializers.SerializerMethodField()
    nose_name = serializers.SerializerMethodField()
    neck_name = serializers.SerializerMethodField()
    skin_texture_name = serializers.SerializerMethodField()
    skin_lesions_name = serializers.SerializerMethodField()
    lips_name = serializers.SerializerMethodField()
    gums_name = serializers.SerializerMethodField()
    dention_name = serializers.SerializerMethodField()
    oral_mucosa_name = serializers.SerializerMethodField()
    tongue_name = serializers.SerializerMethodField()
    hair_color_name = serializers.SerializerMethodField()
    hair_density_name = serializers.SerializerMethodField()
    hair_texture_name = serializers.SerializerMethodField()
    alopecia_name = serializers.SerializerMethodField()
    chest_name = serializers.SerializerMethodField()
    abdomen_name = serializers.SerializerMethodField()
    extremity_name = serializers.SerializerMethodField()
    rs_right_name = serializers.SerializerMethodField()
    rs_left_name = serializers.SerializerMethodField()
    cvs_name = serializers.SerializerMethodField()
    varicose_veins_name = serializers.SerializerMethodField()
    lmp_name = serializers.SerializerMethodField()
    cns_name = serializers.SerializerMethodField()
    reflexes_name = serializers.SerializerMethodField()
    rombergs_name = serializers.SerializerMethodField()
    pupils_name = serializers.SerializerMethodField()
    pa_name = serializers.SerializerMethodField()
    tenderness_name = serializers.SerializerMethodField()
    ascitis_name = serializers.SerializerMethodField()
    guarding_name = serializers.SerializerMethodField()
    joints_name = serializers.SerializerMethodField()
    swollen_joints_name = serializers.SerializerMethodField()
    spine_posture_name = serializers.SerializerMethodField()
    language_delay_name = serializers.SerializerMethodField()
    behavioural_disorder_name = serializers.SerializerMethodField()
    speech_screening_name = serializers.SerializerMethodField()
    referral_name = serializers.SerializerMethodField()
    place_referral_name = serializers.SerializerMethodField()

    def get_head_name(self, obj):
        if obj.head:
            head_scalp_instance = basic_information_head_scalp.objects.get(pk=obj.head.head_scalp_id)
            return head_scalp_instance.head_scalp if head_scalp_instance else None
        return None

    def get_skin_color_name(self, obj):
        if obj.skin_color:
            skin_color_instance = basic_information_skin_color.objects.get(pk=obj.skin_color.skin_id)
            return skin_color_instance.skin_color if skin_color_instance else None
        return None

    def get_nose_name(self, obj):
        if obj.nose:
            nose_instance = basic_information_nose.objects.get(pk=obj.nose.nose_id)
            return nose_instance.nose if nose_instance else None
        return None

    def get_neck_name(self, obj):
        if obj.neck:
            neck_instance = basic_information_neck.objects.get(pk=obj.neck.neck_id)
            return neck_instance.neck if neck_instance else None
        return None

    def get_skin_texture_name(self, obj):
        if obj.skin_texture:
            skin_texture_instance = basic_information_skin_texture.objects.get(pk=obj.skin_texture.skin_texture_id)
            return skin_texture_instance.skin_texture if skin_texture_instance else None
        return None

    def get_skin_lesions_name(self, obj):
        if obj.skin_lesions:
            skin_lesions_instance = basic_information_skin_lesions.objects.get(pk=obj.skin_lesions.skin_lesions_id)
            return skin_lesions_instance.skin_lesions if skin_lesions_instance else None
        return None

    def get_lips_name(self, obj):
        if obj.lips:
            lips_instance = basic_information_lips.objects.get(pk=obj.lips.lips_id)
            return lips_instance.lips if lips_instance else None
        return None

    def get_gums_name(self, obj):
        if obj.gums:
            gums_instance = basic_information_gums.objects.get(pk=obj.gums.gums_id)
            return gums_instance.gums if gums_instance else None
        return None

    def get_dention_name(self, obj):
        if obj.dention:
            dention_instance = basic_information_dentition.objects.get(pk=obj.dention.dentition_id)
            return dention_instance.dentition if dention_instance else None
        return None

    def get_oral_mucosa_name(self, obj):
        if obj.oral_mucosa:
            oral_mucosa_instance = basic_information_oral_mucosa.objects.get(pk=obj.oral_mucosa.oral_mucosa_id)
            return oral_mucosa_instance.oral_mucosa if oral_mucosa_instance else None
        return None

    def get_tongue_name(self, obj):
        if obj.tongue:
            tongue_instance = basic_information_tounge.objects.get(pk=obj.tongue.tounge_id)
            return tongue_instance.tounge if tongue_instance else None
        return None

    def get_hair_color_name(self, obj):
        if obj.hair_color:
            hair_color_instance = basic_information_hair_color.objects.get(pk=obj.hair_color.hair_color_id)
            return hair_color_instance.hair_color if hair_color_instance else None
        return None

    def get_hair_density_name(self, obj):
        if obj.hair_density:
            hair_density_instance = basic_information_hair_density.objects.get(pk=obj.hair_density.hair_density_id)
            return hair_density_instance.hair_density if hair_density_instance else None
        return None

    def get_hair_texture_name(self, obj):
        if obj.hair_texture:
            hair_texture_instance = basic_information_hair_texture.objects.get(pk=obj.hair_texture.hair_texture_id)
            return hair_texture_instance.hair_texture if hair_texture_instance else None
        return None

    def get_alopecia_name(self, obj):
        if obj.alopecia:
            alopecia_instance = basic_information_alopecia.objects.get(pk=obj.alopecia.alopecia_id)
            return alopecia_instance.alopecia if alopecia_instance else None
        return None

    def get_chest_name(self, obj):
        if obj.chest:
            chest_instance = basic_information_chest.objects.get(pk=obj.chest.chest_id)
            return chest_instance.chest if chest_instance else None
        return None

    def get_abdomen_name(self, obj):
        if obj.abdomen:
            abdomen_instance = basic_information_abdomen.objects.get(pk=obj.abdomen.abdomen_id)
            return abdomen_instance.abdomen if abdomen_instance else None
        return None

    def get_extremity_name(self, obj):
        if obj.extremity:
            extremity_instance = basic_information_extremity.objects.get(pk=obj.extremity.extremity_id)
            return extremity_instance.extremity if extremity_instance else None
        return None
    def get_rs_right_name(self, obj):
        if obj.rs_right:
            rs_right_instance = basic_information_rs_right.objects.get(pk=obj.rs_right.rs_right_id)
            return rs_right_instance.rs_right if rs_right_instance else None
        return None

    def get_rs_left_name(self, obj):
        if obj.rs_left:
            rs_left_instance = basic_information_rs_left.objects.get(pk=obj.rs_left.rs_left_id)
            return rs_left_instance.rs_left if rs_left_instance else None
        return None

    def get_cvs_name(self, obj):
        if obj.cvs:
            cvs_instance = basic_information_cvs.objects.get(pk=obj.cvs.cvs_id)
            return cvs_instance.cvs if cvs_instance else None
        return None

    def get_varicose_veins_name(self, obj):
        if obj.varicose_veins:
            varicose_veins_instance = basic_information_varicose_veins.objects.get(pk=obj.varicose_veins.varicose_veins_id)
            return varicose_veins_instance.varicose_veins if varicose_veins_instance else None
        return None

    def get_lmp_name(self, obj):
        if obj.lmp:
            lmp_instance = basic_information_lmp.objects.get(pk=obj.lmp.lmp_id)
            return lmp_instance.lmp if lmp_instance else None
        return None

    def get_cns_name(self, obj):
        if obj.cns:
            cns_instance = basic_information_cns.objects.get(pk=obj.cns.cns_id)
            return cns_instance.cns if cns_instance else None
        return None

    def get_reflexes_name(self, obj):
        if obj.reflexes:
            reflexes_instance = basic_information_reflexes.objects.get(pk=obj.reflexes.reflexes_id)
            return reflexes_instance.reflexes if reflexes_instance else None
        return None

    def get_rombergs_name(self, obj):
        if obj.rombergs:
            rombergs_instance = basic_information_rombergs.objects.get(pk=obj.rombergs.rombergs_id)
            return rombergs_instance.rombergs if rombergs_instance else None
        return None

    def get_pupils_name(self, obj):
        if obj.pupils:
            pupils_instance = basic_information_pupils.objects.get(pk=obj.pupils.pupils_id)
            return pupils_instance.pupils if pupils_instance else None
        return None

    def get_pa_name(self, obj):
        if obj.pa:
            pa_instance = basic_information_pa.objects.get(pk=obj.pa.pa_id)
            return pa_instance.pa if pa_instance else None
        return None

    def get_tenderness_name(self, obj):
        if obj.tenderness:
            tenderness_instance = basic_information_tenderness.objects.get(pk=obj.tenderness.tenderness_id)
            return tenderness_instance.tenderness if tenderness_instance else None
        return None

    def get_ascitis_name(self, obj):
        if obj.ascitis:
            ascitis_instance = basic_information_ascitis.objects.get(pk=obj.ascitis.ascitis_id)
            return ascitis_instance.ascitis if ascitis_instance else None
        return None

    def get_guarding_name(self, obj):
        if obj.guarding:
            guarding_instance = basic_information_guarding.objects.get(pk=obj.guarding.guarding_id)
            return guarding_instance.guarding if guarding_instance else None
        return None

    def get_joints_name(self, obj):
        if obj.joints:
            joints_instance = basic_information_joints.objects.get(pk=obj.joints.joints_id)
            return joints_instance.joints if joints_instance else None
        return None

    def get_swollen_joints_name(self, obj):
        if obj.swollen_joints:
            swollen_joints_instance = basic_information_swollen_joints.objects.get(pk=obj.swollen_joints.swollen_joints_id)
            return swollen_joints_instance.swollen_joints if swollen_joints_instance else None
        return None

    def get_spine_posture_name(self, obj):
        if obj.spine_posture:
                spine_posture_instance = basic_information_spine_posture.objects.get(pk=obj.spine_posture.spine_posture_id)
                return spine_posture_instance.spine_posture if spine_posture_instance else None
        return None
    
    def get_language_delay_name(self, obj):
        if obj.language_delay:
            language_delay_instance = basic_information_language_delay.objects.get(pk=obj.language_delay.language_delay_id)
            return language_delay_instance.language_delay if language_delay_instance else None
        return None

    def get_behavioural_disorder_name(self, obj):
        if obj.behavioural_disorder:
            behavioural_disorder_instance = basic_information_behavioural_disorder.objects.get(pk=obj.behavioural_disorder.behavioural_disorder_id)
            return behavioural_disorder_instance.behavioural_disorder if behavioural_disorder_instance else None
        return None

    def get_speech_screening_name(self, obj):
        if obj.speech_screening:
            speech_screening_instance = basic_information_speech_screening.objects.get(pk=obj.speech_screening.speech_screening_id)
            return speech_screening_instance.speech_screening if speech_screening_instance else None
        return None

    def get_referral_name(self, obj):
        if obj.referral:
            referral_instance = basic_information_referral.objects.get(pk=obj.referral.referral_id)
            return referral_instance.referral if referral_instance else None
        return None

    def get_place_referral_name(self, obj):
        if obj.place_referral:
            place_referral_instance = basic_information_place_referral.objects.get(pk=obj.place_referral.place_referral_id)
            return place_referral_instance.place_referral if place_referral_instance else None
        return None

    class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','citizen_id','schedule_id','head','head_name','nose','nose_name','neck','neck_name','skin_color','skin_color_name',
                                'skin_texture','skin_texture_name','skin_lesions','skin_lesions_name','lips','lips_name','gums','gums_name','dention','dention_name','oral_mucosa','oral_mucosa_name',
                                'tongue','tongue_name','hair_color','hair_color_name','hair_density','hair_density_name','hair_texture','hair_texture_name','alopecia','alopecia_name',
                                'chest','chest_name','abdomen','abdomen_name','extremity','extremity_name','rs_right','rs_right_name','rs_left','rs_left_name','cvs','cvs_name','varicose_veins','varicose_veins_name',
                                'lmp','lmp_name','cns','cns_name','reflexes','reflexes_name','rombergs','rombergs_name','pupils','pupils_name','pa','pa_name','tenderness','tenderness_name','ascitis','ascitis_name','guarding','guarding_name',
                                'joints','joints_name','swollen_joints','swollen_joints_name','spine_posture','spine_posture_name','language_delay','language_delay_name','behavioural_disorder','behavioural_disorder_name','speech_screening','speech_screening_name',
                                'comment','birth_defects','childhood_disease','deficiencies','menarche_achieved','date_of_menarche','age_of_menarche','vaginal_descharge','flow','comments',
                                'skin_conditions','check_box_if_normal','diagnosis','treatment_for','referral','referral_name','reason_for_referral','place_referral_name','place_referral',
                                'outcome','basic_referred_treatment','menarche_achieved','date_of_menarche','age_of_menarche','vaginal_descharge','flow','comments','form_submit','reffered_to_specialist','bad_habbits','genito_urinary','genito_urinary_comment',
                                'discharge','discharge_comment','hydrocele','cervical','axilla','inguinal','thyroid','observation']
                

class CitizenSymmetricExaminfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','rs_right','rs_left','cvs','varicose_veins',
                          'lmp','cns','reflexes','rombergs','pupils','pa','tenderness','ascitis','guarding',
                          'joints','swollen_joints','spine_posture','modify_by','genito_urinary','genito_urinary_comment','discharge','discharge_comment','hydrocele','cervical','axilla','inguinal','thyroid']
                

class CitizenDisabilityScreeninginfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','language_delay','behavioural_disorder','speech_screening',
                          'comment','modify_by']
                
class CitizenBirthDefectinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','birth_defects','modify_by']
                
                
class CitizenChildhood_DiseaseinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','childhood_disease','modify_by']
                
class CitizenDeficienciesinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','deficiencies','modify_by']
                
                
class CitizenSkinConditioninfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','skin_conditions','modify_by']
                
class CitizenCheckBoxIfNormalinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','check_box_if_normal','modify_by']
                
 
class CitizenDiagnosisinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','diagnosis','modify_by']
                
class CitizenTreatmentinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id','treatment_for','referral','reason_for_referral','place_referral',
                          'outcome','basic_referred_treatment','reffered_to_specialist','modify_by','schedule_id','citizen_id'] 
                
class CitizenFemaleScreeninginfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_basic_screening_info
        fields = ['basic_screening_pk_id','menarche_achieved','date_of_menarche','age_of_menarche','vaginal_descharge','flow','comments','modify_by']

                    
class CitizengetimmunisationinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_immunisation
                fields = ['immunisation_pk_id','immunisations','window_period_days_from','window_period_days_to']


class CitizenimmunisationinfoSerializer(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_immunization_info
                fields = ['immunization_info_pk_id','citizen_id','schedule_id','name_of_vaccine']#,'given_yes_no','scheduled_date_from','scheduled_date_to'            







#------------------------Follow-up---------------------------------#
class FollowupinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_followup_dropdownlist
        fields = ['followup_pk_id','follow_up']
        
class Followup_for_infoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_followup_for
        fields = ['followupfor_pk_id','follow_up_for']
        
class source_name_infoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_source
        fields = ['source_pk_id','source_names']
        
class FollowupstatusinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_follow_up_status
        fields = ['followup_status_pk_id','followup_status']

class followup_refer_to_specalist_citizens_infoSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen_pk_id.name', read_only=True)
    class Meta:
        model = agg_sc_follow_up_citizen
        fields = ['follow_up_ctzn_pk','citizen_id','citizen_pk_id','citizen_name','vital_refer','basic_screening_refer','auditory_refer','dental_refer','vision_refer','pycho_refer']
        
class followup_info_Serializer(serializers.ModelSerializer):
    follow_up = serializers.PrimaryKeyRelatedField(queryset=agg_sc_follow_up_status.objects.all(),required=False) 
    class Meta:
        model = agg_sc_followup
        fields = ['call_status','conversational_remarks','schedule_date','not_connected_reason','visit_status','visited_status','condition_improved','weight_gain_status','forward_to','priority','not_visited_reason','reschedule_date1','reschedule_date2','follow_up','remark','added_by','citizen_id','schedule_id','name','dob','parents_no','state','tehsil','district','source_name','follow_up_citizen_pk_id','followup_count']

# # from rest_framework import serializers
# # from .models import agg_sc_followup

# class FollowupInfoSerializer(serializers.ModelSerializer):
#     follow_up = serializers.PrimaryKeyRelatedField(queryset=agg_sc_follow_up_status.objects.all())  # Assuming agg_sc_follow_up_status is the related model

#     class Meta:
#         model = agg_sc_followup
#         fields = ['call_status', 'conversational_remarks', 'schedule_date', 'not_connected_reason', 'visit_status', 'visited_status', 'condition_improved', 'weight_gain_status', 'forward_to', 'priority', 'not_visited_reason', 'reschedule_date1', 'reschedule_date2', 'follow_up', 'remark', 'added_by', 'citizen_id', 'name', 'dob', 'parents_no', 'state', 'tehsil', 'district', 'source_name', 'follow_up_citizen_pk_id']

  
class followupGETinfoSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen_pk_id.name',allow_null=True)
    citizen_id = serializers.CharField(source='citizen_pk_id.citizen_id',allow_null=True)
    parents_no = serializers.CharField(source='citizen_pk_id.parents_mobile',allow_null=True)
    dob = serializers.CharField(source='citizen_pk_id.dob',allow_null=True)
    state = serializers.CharField(source='citizen_pk_id.state.state_name',allow_null=True)
    district = serializers.CharField(source='citizen_pk_id.district.dist_name',allow_null=True)
    tehsil = serializers.CharField(source='citizen_pk_id.tehsil.tahsil_name',allow_null=True)
    
    source_name = serializers.CharField(source='citizen_pk_id.source_name.source_names',allow_null=True)
    class Meta:
        model = agg_sc_follow_up_citizen
        fields = ['follow_up_ctzn_pk','citizen_name','citizen_id','vital_refer','basic_screening_refer','auditory_refer','dental_refer','vision_refer','pycho_refer', 'parents_no','dob','state','district','tehsil','source_name','weight_for_height']

    # def get_citizen_name(self, instance):
    #     citizen = instance.citizen_pk_id
    #     if citizen is not None:
    #         return citizen.name
    #     return None

class followupGETIDWISEinfoSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source='citizen_pk_id.name',allow_null=True)
    citizen_id = serializers.CharField(source='citizen_pk_id.citizen_id',allow_null=True)
    parents_no = serializers.CharField(source='citizen_pk_id.parents_mobile',allow_null=True)
    dob = serializers.CharField(source='citizen_pk_id.dob',allow_null=True)
    state = serializers.CharField(source='citizen_pk_id.state.state_name',allow_null=True)
    district = serializers.CharField(source='citizen_pk_id.district.dist_name',allow_null=True)
    tehsil = serializers.CharField(source='citizen_pk_id.tehsil.tahsil_name',allow_null=True)
    
    source_name = serializers.CharField(source='citizen_pk_id.source_name.source_names',allow_null=True)
    class Meta:
        model = agg_sc_follow_up_citizen
        fields = ['citizen_name','citizen_id','parents_no','dob','state','district','tehsil','source_name','schedule_id']
        
        
class citizen_Followup_get_infoSerializer(serializers.ModelSerializer):
    follow_up = serializers.CharField(source='follow_up.followup_status',allow_null=True)  
    class Meta:
        model = agg_sc_followup
        # fields = ['followup_id','call_status','not_connected_reason','follow_up','remark','conversational_remarks']
        fields = '__all__'
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data 
   
    
# class followupGETinfoSerializer(serializers.ModelSerializer):
#     citizen_name = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.name')
#     citizen_id = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.citizen_id')
#     parents_no = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.parents_mobile')
#     dob = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.dob')
#     state = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.state')
#     district = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.district')
#     tehsil = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.tehsil')
#     source_name = serializers.CharField(source='follow_up_citizen_pk_id.citizen_pk_id.source_name.source_names')
#     follow_up = serializers.CharField(source='follow_up_citizen_pk_id.follow_up')
    
#     class Meta:
#         model = agg_sc_followup
#         fields = ['followup_id','follow_up_citizen_pk_id','citizen_name','citizen_id','parents_no','dob','state','district','tehsil','source_name','follow_up']


        
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
        fields = ['id', 'source', 'role', 'modules_submodule', 'permission_status']


class Age_count_serializer(serializers.Serializer):
     
     class Meta:
          model = agg_sc_add_new_citizens
          fields = ['dob','source','type','Class']

class gender_count_serializer(serializers.Serializer):
     class Meta:
          model = agg_sc_add_new_citizens
          fields = ['gender','source','type','Class']

# class Student_count_serializer(serializers.Serializer):
#      class Meta:
#           model = agg_sc_add_new_citizens
#           fields = ['citizens_pk_id','source','type','Class']

        
# class GroupOrRoleserializer(serializers.Serializer):
#      class Meta:
#         model = agg_source
#         fields = ['source_pk_id','Group_id']

#      def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data['Role_name'] = instance.Group_id.grp_name
#         data['Role_id'] = instance.Group_id.grp_id
#         return data

class Dental_count_serializer(serializers.ModelSerializer):
     class Meta:
          model = agg_sc_citizen_dental_info
          fields = ['citizen_pk_id','oral_hygiene','gum_condition','oral_ulcers','gum_bleeding','discoloration_of_teeth', 'food_impaction', 'carious_teeth', 'extraction_done', 'fluorosis', 'tooth_brushing_frequency']


# class CitizenDataGetSerializer(serializers.ModelSerializer):
      
#         age = serializers.CharField(source='age.age')
#         source = serializers.CharField(source='source.source')
#         gender = serializers.CharField(source='gender.gender')
#         type = serializers.CharField(source='type.type')
#         source_name = serializers.CharField(source='source_name.source_names')
#         state = serializers.CharField(source='state.state_name')
#         district = serializers.CharField(source='district.dist_name')
#         tehsil = serializers.CharField(source='tehsil.tahsil_name')
        
#         class Meta:
#               model = agg_sc_add_new_citizens
#               fields = "__all__"    


#         def to_representation(self, instance):
#                 data = super().to_representation(instance)
#                 return data

class CitizenDataGetSerializer(serializers.ModelSerializer):
    # age = serializers.CharField(source='age.age',allow_null=True)
    source = serializers.CharField(source='source.source',allow_null=True)
    # gender = serializers.CharField(source='gender.gender',allow_null=True)
    # type = serializers.CharField(source='type.type',allow_null=True)
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)

    # Use getattr to handle nullable fields
    # state = serializers.CharField(source='state.state_name', allow_null=True)
    # district = serializers.CharField(source='district.dist_name', allow_null=True)
    # tehsil = serializers.CharField(source='tehsil.tahsil_name', allow_null=True)
    disease_name = serializers.CharField(source='disease.disease', allow_null=True)
    modify_by = agg_com_colleague_Serializer() #Amit
    added_by = agg_com_colleague_Serializer() #Amit

    class Meta:
        model = agg_sc_add_new_citizens
        fields = ['source_name_name','disease_name','prefix','name','year','citizens_pk_id','source','modify_date', 'added_by', 'modify_by','photo','location']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data


class ScheduleDataGetSerializer(serializers.ModelSerializer):
      source_name = serializers.CharField(source='source_name.source_names')
      class Meta:
            model = agg_sc_schedule_screening
            fields = "__all__"
      def to_representation(self, instance):
                data = super().to_representation(instance)
                return data        

class SourceDataGetSerializer(serializers.ModelSerializer):
      class Meta:
            model = agg_sc_add_new_source
            fields = "__all__"


class UserDataGetSerializer(serializers.ModelSerializer):
      grp_name = serializers.CharField(source='grp_id.grp_name')
    
      class Meta:
            model = agg_com_colleague
            fields = "__all__"
      def to_representation(self, instance):
        data = super().to_representation(instance)
        return data


class BMI_dashboardSerializer(serializers.ModelSerializer):
      class Meta:
            model = agg_sc_add_new_citizens
            fields = ['bmi', 'source','type','Class']


class Birth_Defect_Serializer(serializers.ModelSerializer):
      class Meta:
            model = agg_sc_basic_screening_info
            fields = ['birth_defects']

class HealthcardSerializer(serializers.ModelSerializer):
    
    name = serializers.CharField(source='citizen_pk_id.name')
    aadhar_id = serializers.CharField(source='citizen_pk_id.aadhar_id')
    gender = serializers.CharField(source='citizen_pk_id.gender')
    dob = serializers.DateField(source='citizen_pk_id.dob')
    year = serializers.CharField(source='citizen_pk_id.year')
    prefix = serializers.CharField(source='citizen_pk_id.prefix')

    class Meta:
        model = agg_sc_basic_screening_info
        fields = ['name','aadhar_id','gender','dob','year','basic_screening_pk_id', 'screening_code', 'citizen_id', 'schedule_id', 'schedule_count', 'citizen_pk_id', 'form_submit','prefix']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data


class Psyco_For_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_pycho_info
        fields = ['citizen_id', 'schedule_id', 'schedule_count', 'pycho_conditions']

class Dental_For_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_dental_info
        # fields = ['citizen_id', 'schedule_id', 'schedule_count', 'dental_conditions']
        fields = '__all__'

class agg_sc_citizen_vision_info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_vision_info
        fields = '__all__'


class Card_Filter(serializers.ModelSerializer):
    name = serializers.CharField(source='citizen_pk_id.name')
    parents_mobile = serializers.CharField(source='citizen_pk_id.parents_mobile')
    class Meta:
        model = agg_sc_citizen_schedule
        fields = '__all__'
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
    
    
class AuditoryinfoHealthcard(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_audit_info
                fields = "__all__"
                
class CitizenimmunisationinfoHealthcard(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_immunization_info
                fields = "__all__"
                
class CitizenVitalinfoHealthcard(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_vital_info
                fields = "__all__"
                
class CitizenBasicinfoHealthcard(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = "__all__"
                
class CitizenVitalinfoCompleate_status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_vital_info
                fields = ['vital_info_pk_id', 'schedule_id', 'schedule_count', 'form_submit', 'citizen_id' ]
                
class agg_sc_citizen_dental_info_Status(serializers.ModelSerializer):
     class Meta:
        model = agg_sc_citizen_dental_info
        fields = ['dental_pk_id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
        
class agg_sc_citizen_vision_info_Status(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_vision_info
        fields = ['vision_pk_id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
        
class Citizenimmunisationinfo_status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_immunization_info
                fields = ['immunization_info_pk_id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
                
class CitizenBasicinfo_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_basic_screening_info
                fields = ['basic_screening_pk_id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
                
class Auditoryinfo_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_audit_info
                fields = ['audit_info_pk_id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
                
class Psyco_For_Status(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_pycho_info
        fields = ['pycho_pk_id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
        
class Psyco_For_download(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_pycho_info
        fields = "__all__"


class Other_info_for_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_other_info
        fields = '__all__'

                
                
class Healthcard_basic_screening(serializers.ModelSerializer):
    prefix = serializers.CharField(source='citizen_pk_id.prefix',allow_null=True)
    name = serializers.CharField(source='citizen_pk_id.name', allow_null=True)
    aadhar_id = serializers.CharField(source='citizen_pk_id.aadhar_id', allow_null=True)
    blood_group = serializers.CharField(source='citizen_pk_id.blood_groups', allow_null=True)
    gender = serializers.CharField(source='citizen_pk_id.gender.gender', allow_null=True)
    dob = serializers.DateField(source='citizen_pk_id.dob', allow_null=True)
    year = serializers.CharField(source='citizen_pk_id.year', allow_null=True)
    employee_id = serializers.CharField(source='citizen_pk_id.employee_id', allow_null=True)
    source_name = serializers.CharField(source='citizen_pk_id.source_name', allow_null=True)
    head = serializers.CharField(source='head.head_scalp', allow_null=True)
    nose = serializers.CharField(source='nose.nose', allow_null=True)
    neck = serializers.CharField(source='neck.neck', allow_null=True)
    skin_color = serializers.CharField(source='skin_color.skin_color', allow_null=True)
    skin_texture = serializers.CharField(source='skin_texture.skin_texture', allow_null=True)
    skin_lesions = serializers.CharField(source='skin_lesions.skin_lesions', allow_null=True)
    lips = serializers.CharField(source='lips.lips', allow_null=True)
    gums = serializers.CharField(source='gums.gums', allow_null=True)
    dention = serializers.CharField(source='dention.dentition', allow_null=True)
    oral_mucosa = serializers.CharField(source='oral_mucosa.oral_mucosa', allow_null=True)
    tongue = serializers.CharField(source='tongue.tounge', allow_null=True)
    hair_color = serializers.CharField(source='hair_color.hair_color', allow_null=True)
    hair_density = serializers.CharField(source='hair_density.hair_density', allow_null=True)
    hair_texture = serializers.CharField(source='hair_texture.hair_texture', allow_null=True)
    alopecia = serializers.CharField(source='alopecia.alopecia', allow_null=True)
    chest = serializers.CharField(source='chest.chest', allow_null=True)
    abdomen = serializers.CharField(source='abdomen.abdomen', allow_null=True)
    extremity = serializers.CharField(source='extremity.extremity', allow_null=True)
    
    
    
    class Meta:
        model = agg_sc_basic_screening_info
        fields = [ 'birth_defects','blood_group','prefix','name','aadhar_id','gender','dob','year','source_name','basic_screening_pk_id', 'screening_code', 'citizen_id', 'schedule_id', 'schedule_count', 'citizen_pk_id', 'form_submit',
                  'head', 'nose', 'neck', 'skin_color', 'skin_texture', 'skin_lesions', 'lips', 'gums', 'dention', 'oral_mucosa',
                  'tongue', 'hair_color', 'hair_density', 'hair_texture', 'alopecia', 'chest', 'abdomen', 'extremity','added_date','employee_id','observation']
                      
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data




class Healthcard_basic_screening2(serializers.ModelSerializer):
    head = serializers.CharField(source='head.head_scalp', allow_null=True)
    nose = serializers.CharField(source='nose.nose', allow_null=True)
    neck = serializers.CharField(source='neck.neck', allow_null=True)
    skin_color = serializers.CharField(source='skin_color.skin_color', allow_null=True)
    skin_texture = serializers.CharField(source='skin_texture.skin_texture', allow_null=True)
    skin_lesions = serializers.CharField(source='skin_lesions.skin_lesions', allow_null=True)
    lips = serializers.CharField(source='lips.lips', allow_null=True)
    gums = serializers.CharField(source='gums.gums', allow_null=True)
    dention = serializers.CharField(source='dention.dentition', allow_null=True)
    oral_mucosa = serializers.CharField(source='oral_mucosa.oral_mucosa', allow_null=True)
    tongue = serializers.CharField(source='tongue.tounge', allow_null=True)
    hair_color = serializers.CharField(source='hair_color.hair_color', allow_null=True)
    hair_density = serializers.CharField(source='hair_density.hair_density', allow_null=True)
    hair_texture = serializers.CharField(source='hair_texture.hair_texture', allow_null=True)
    alopecia = serializers.CharField(source='alopecia.alopecia', allow_null=True)
    chest = serializers.CharField(source='chest.chest', allow_null=True)
    abdomen = serializers.CharField(source='abdomen.abdomen', allow_null=True)
    extremity = serializers.CharField(source='extremity.extremity', allow_null=True)

    class Meta:
        model = agg_sc_basic_screening_info
        fields = [
            'birth_defects', 'head', 'nose', 'neck', 'skin_color', 'skin_texture', 'skin_lesions', 'lips', 'gums', 'dention', 
            'oral_mucosa', 'tongue', 'hair_color', 'hair_density', 'hair_texture', 'alopecia', 'chest', 'abdomen', 'extremity', 'observation'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        custom_data = {
            'Head/Scalp': data.pop('head', None),
            'Nose': data.pop('nose', None),
            'Neck': data.pop('neck', None),
            'Skin Color': data.pop('skin_color', None),
            'Skin Texture': data.pop('skin_texture', None),
            'Skin Lesions': data.pop('skin_lesions', None),
            'Lips': data.pop('lips', None),
            'Gums': data.pop('gums', None),
            'Dentition': data.pop('dention', None),
            'Oral Mucosa': data.pop('oral_mucosa', None),
            'Tongue': data.pop('tongue', None),
            'Hair Color': data.pop('hair_color', None),
            'Hair Density': data.pop('hair_density', None),
            'Hair Texture': data.pop('hair_texture', None),
            'Alopecia': data.pop('alopecia', None),
            'Chest': data.pop('chest', None),
            'Abdomen': data.pop('abdomen', None),
            'Extremity': data.pop('extremity', None),
            'Observation': data.pop('observation', None),
        }
        custom_data = {key: value for key, value in custom_data.items() if value is not None}
        
        return custom_data







class BMI_for_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_growth_monitoring_info
        fields = "__all__"

class Medical_History_for_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_medical_history
        fields = "__all__"
        
class PFT_for_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_pft
        fields = "__all__"
        
class Family_for_Healthcard(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_family_info
        fields = "__all__"
             
             

    
class basic_information_Status(serializers.ModelSerializer):
        class Meta:
                model = citizen_basic_info
                fields = ['id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
                
class BMI_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_growth_monitoring_info
                fields = ['id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
                
                
class Family_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_family_info
                fields = ['id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']
                
class PFT_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_pft
                fields = ['id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']

class Investigation_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_investigation
                fields = ['id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']  
                
class Medical_History_Status(serializers.ModelSerializer):
        class Meta:
                model = agg_sc_citizen_medical_history
                fields = ['id', 'citizen_id', 'schedule_id', 'schedule_count' ,'form_submit']           
                
                
class CCCitizenDataGetSerializer(serializers.ModelSerializer):
    age = serializers.CharField(source='age.age',allow_null=True)
    source = serializers.CharField(source='source.source',allow_null=True)
    gender = serializers.CharField(source='gender.gender',allow_null=True)
    type = serializers.CharField(source='type.type',allow_null=True)
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)

    # Use getattr to handle nullable fields
    state = serializers.CharField(source='state.state_name', allow_null=True)
    district = serializers.CharField(source='district.dist_name', allow_null=True)
    tehsil = serializers.CharField(source='tehsil.tahsil_name', allow_null=True)
    disease_name = serializers.CharField(source='disease.disease', allow_null=True)

    class Meta:
        model = agg_sc_add_new_citizens
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
        

class citizen_report_Get_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_investigation
        fields = '__all__'

class citizen_bad_habbits_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_bad_habbits
        fields = ['bad_habbits_pk_id','bad_habbits']
        

class citizen_investigation_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_investigation
        fields = '__all__'


class citizen_medicalhistory_GET_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_medical_history
        fields = '__all__'


class citizen_pft_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_pft
        # fields = '__all__'
        fields = ['pft_reading','observations']




class FormSubmitSerializer(serializers.Serializer):
    submitted_forms = serializers.IntegerField()
    pending_forms = serializers.IntegerField()

class BasicScreeningInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_basic_screening_info
        fields = ['form_submit']

class CitizenVitalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_vital_info
        fields = ['form_submit']

class CitizenImmunizationInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_immunization_info
        fields = ['form_submit']

class CitizenAuditInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_audit_info
        fields = ['form_submit']

class CitizenPsychoInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_pycho_info
        fields = ['form_submit']

class CitizenDentalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_dental_info
        fields = ['form_submit']

class CitizenVisionInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_vision_info
        fields = ['form_submit']

class CitizenFamilyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_family_info
        fields = ['form_submit']

class GrowthMonitoringInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_growth_monitoring_info
        fields = ['form_submit']

class CitizenBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = citizen_basic_info
        fields = ['form_submit']

class InvestigationSerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_investigation
        fields = ['form_submit']

class CitizenMedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_medical_history
        fields = ['form_submit']
        
        
class HospitalListSerializer(serializers.ModelSerializer):
    class Meta:
        model = referred_hospital_list
        fields = ['hospital_pk_id','hospital_name']
        

class Addcitizencsv(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_citizens
        fields = '__all__'
        

class UploadCSVSerializer(serializers.Serializer):
    csv_file = serializers.FileField()



class ImportedDataSerializer(serializers.ModelSerializer):
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)
    source_id_name = serializers.CharField(source='source.source',allow_null=True)
    type_name = serializers.CharField(source='type.type',allow_null=True)
    age_name = serializers.CharField(source='age.age', allow_null=True)
    gender_name =  serializers.CharField(source='gender.gender',allow_null=True)
    emergency_gender_name = serializers.CharField(source='gender.gender',allow_null=True)
    department_name = serializers.CharField(source='department.department', allow_null=True)
    designation_name = serializers.CharField(source='designation.designation', allow_null=True)
    modify_by = agg_com_colleague_Serializer(allow_null=True)
    added_by = agg_com_colleague_Serializer(allow_null=True) 
    class Meta:
        model = imported_data_from_excel_csv
        # fields = '__all__'
        fields = ['id','source','source_id_name','source_name_name','source_name','type','type_name','age','age_name','gender','gender_name','name','emp_mobile_no','address','dob','modify_by','added_by','blood_groups','prefix','source_name','pincode','permanant_address','department','department_name','designation','designation_name','doj','official_email','official_mobile','employee_id','marital_status','email_id','child_count','spouse_name','height','weight','emergency_prefix','emergency_fullname','emergency_gender','emergency_gender_name','emergency_contact','emergency_email','relationship_with_employee','emergency_address']
        



class Screening_List_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_screening_list
        # fields = '__all__'
        fields = ['sc_list_pk_id','screening_list']
        



from rest_framework import serializers
from .models import agg_sc_schedule_screening, agg_screening_list

class ScreeningListSerializer(serializers.ModelSerializer):
    screening_list = serializers.SerializerMethodField()

    def get_screening_list(self, instance):
        # Build a mapping from sc_list_pk_id to screening_list
        mapping = dict(agg_screening_list.objects.exclude(is_deleted=True).values_list('sc_list_pk_id', 'screening_list'))

        # Get the list of screening_vitals IDs
        if isinstance(instance.screening_vitals, list):
            vitals_ids = instance.screening_vitals
        else:
            vitals_ids = instance.screening_vitals.values_list('sc_list_pk_id', flat=True)

        # Sort the IDs and create the list of dictionaries
        sorted_vitals_ids = sorted(vitals_ids)
        result = [{'screening_vitals': vital_id, 'screening_list': mapping.get(vital_id, 'Unknown')} for vital_id in sorted_vitals_ids]

        return result

    class Meta:
        model = agg_sc_schedule_screening
        fields = ['screening_list']



class Schedule_ID_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_schedule_screening
        fields = ['schedule_id']
        


class Gender_Count_Serializer(serializers.ModelSerializer):
    gender_id = serializers.SerializerMethodField()

    class Meta:
        model = agg_sc_citizen_schedule
        fields = ['citizen_pk_id', 'gender_id']

    def get_gender_id(self, obj):
        try:
            related_record = agg_sc_add_new_citizens.objects.get(citizens_pk_id=obj.citizen_pk_id_id)
            return related_record.gender_id 
        except agg_sc_add_new_citizens.DoesNotExist:
            return None
        
        
from rest_framework import serializers
from datetime import datetime

class Age_Count_Serializer(serializers.ModelSerializer):
    dob = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()

    class Meta:
        model = agg_sc_citizen_schedule
        fields = ['citizen_pk_id', 'dob', 'age']

    def get_dob(self, obj):
        try:
            related_record = agg_sc_add_new_citizens.objects.get(pk=obj.citizen_pk_id_id)
            return related_record.dob 
        except agg_sc_add_new_citizens.DoesNotExist:
            return None

    def get_age(self, obj):
        dob = self.get_dob(obj)
        if dob:
            today = datetime.today().date()  
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            return age
        return None



class BMI_Count_Serializer(serializers.ModelSerializer):
    bmi = serializers.SerializerMethodField()

    class Meta:
        model = agg_sc_citizen_schedule
        fields = ['citizen_pk_id', 'bmi']

    def get_bmi(self, obj):
        try:
            related_record = agg_sc_add_new_citizens.objects.get(citizens_pk_id=obj.citizen_pk_id_id)
            return related_record.bmi 
        except agg_sc_add_new_citizens.DoesNotExist:
            return None
        
        
class Screening_sub_list_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_screening_sub_list
        fields = ['sc_sub_list_pk_id','sub_list']
        
        
# class screening_vitals_Serializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_sc_add_new_source
#         fields = ['screening_vitals']


class ScreeningVitalsSerializer(serializers.ModelSerializer):
    screening_list = serializers.SerializerMethodField()

    class Meta:
        model = agg_sc_add_new_source
        fields = ['screening_vitals', 'screening_list']

    def get_screening_list(self, obj):
        vitals_ids = [int(vital) for vital in obj.screening_vitals] if obj.screening_vitals else []

        screening_list_items = agg_screening_list.objects.filter(
            sc_list_pk_id__in=vitals_ids
        ).values('sc_list_pk_id', 'screening_list')

        screening_dict = {item['sc_list_pk_id']: item for item in screening_list_items}

        ordered_screening_list = [screening_dict.get(vital_id) for vital_id in vitals_ids]

        ordered_screening_list = [item for item in ordered_screening_list if item is not None]

        return ordered_screening_list




class other_info_get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_other_info
        fields = '__all__'

# class screening_sublist_Serializer(serializers.ModelSerializer):
#     class Meta:
#         model = agg_sc_add_new_source
#         fields = ['sub_screening_vitals']
        


class ScreeningSublistSerializer(serializers.ModelSerializer):
    sub_list = serializers.SerializerMethodField()

    class Meta:
        model = agg_sc_add_new_source
        fields = ['sub_screening_vitals', 'sub_list']

    def get_sub_list(self, obj):
        # Convert sub_screening_vitals to a list of integers
        vitals_ids = [int(vital) for vital in obj.sub_screening_vitals] if obj.sub_screening_vitals else []

        # Query the agg_screening_sub_list based on the IDs
        sub_list_items = agg_screening_sub_list.objects.filter(
            sc_sub_list_pk_id__in=vitals_ids
        ).values('sc_sub_list_pk_id', 'sub_list')

        # Create a dictionary for quick lookups
        sub_list_dict = {item['sc_sub_list_pk_id']: item for item in sub_list_items}

        # Order the sub_list based on the vitals_ids
        ordered_sub_list = [sub_list_dict.get(vital_id) for vital_id in vitals_ids]

        # Remove None values if any vital_id is not found
        ordered_sub_list = [item for item in ordered_sub_list if item is not None]

        return ordered_sub_list


class Screening_Sub_Vital_Serializer(serializers.ModelSerializer):
    screening_list = serializers.SerializerMethodField()

    class Meta:
        model = agg_sc_schedule_screening
        fields = ['screening_list']

    def get_screening_list(self, obj):
        sub_vitals = obj.sub_screening_vitals  
        sub_list_records = agg_screening_sub_list.objects.filter(sc_sub_list_pk_id__in=sub_vitals)

        return [
            {
                "screening_vitals": record.sc_sub_list_pk_id,
                "screening_list": record.sub_list
            }
            for record in sub_list_records
        ]



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


class img_analyse_data_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_citizen_dental_info
        fields = ['dental_pk_id','schedule_id','citizen_id','citizen_pk_id','oral_hygiene','gum_condition','discoloration_of_teeth','oral_ulcers','food_impaction','fluorosis','carious_teeth','english','marathi']


class img_analyse_data_get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = anayalse_img_data_save_table
        fields = ['anlyse_pk_id','schedule_id','citizen_id','citizen_pk_id','oral_hygine','gum_condition','discolouration_of_teeth','oral_ulcers','food_impaction','fluorosis','carious_teeth','english','marathi']


class location_serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_location
        fields = ['location_pk_id','location_name']

class agg_sc_route_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_route
        fields = ['route_pk_id','route_name']
        
class ambulance_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_ambulance
        fields = ['amb_pk_id','ambulance_number']
        
class doctor_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_doctor
        fields = ['doc_id','doctor_name']

class pilot_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_pilot
        fields = ['pilot_pk_id','pilot_name']
        
        

class source_name_from_tahsil_Serializers(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_add_new_source
        fields = ['source_pk_id', 'source_names','source_taluka']
        
        


class Schedule_list_Serializer(serializers.ModelSerializer):
    class Meta:
        model = agg_sc_schedule_screening
        fields = ['schedule_screening_pk_id','schedule_id']
        
        
class CitizenScheduleSerializer(serializers.ModelSerializer):
    year = serializers.CharField(source="citizen_pk_id.year", read_only=True)
    dob = serializers.CharField(source="citizen_pk_id.dob", read_only=True)
    gender = serializers.CharField(source="citizen_pk_id.gender.gender_pk_id", read_only=True)
    source = serializers.CharField(source="citizen_pk_id.source.source_pk_id", read_only=True)

    class Meta:
        model = agg_sc_citizen_schedule
        fields = [
            "pk_id", "citizen_id", "schedule_id", "schedule_count",
            "citizen_pk_id", "added_by", "modify_by",
            "year", "dob", "gender", "citizen_id", "source"
        ]










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
                    'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date'
                ]
        
class Workshop_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['ws_pk_id','Workshop_name','registration_no']
        
class Citizen_Get_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ['citizens_pk_id','citizen_id','prefix','name','aadhar_id','mobile_no']
        
class Citizen_idwise_data_Get_Serializer(serializers.ModelSerializer):
    gender_name = serializers.CharField(source='gender.gender',allow_null=True)
    state_name = serializers.CharField(source='state.state_name',allow_null=True)
    district_name = serializers.CharField(source='district.dist_name',allow_null=True)
    tehsil_name = serializers.CharField(source='tehsil.tahsil_name',allow_null=True) 
    source_name_name = serializers.CharField(source='source_name.source_names',allow_null=True)
    source_id_name = serializers.CharField(source='source.source',allow_null=True)
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
    class Meta:
        model = growth_monitoring_info
        fields = ['growth_pk_id','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','symptoms','remark','reffered_to_specialist','form_submit','is_deleted','added_by','added_date','modify_by','modify_date']
        
        
class basic_info_Put_Serializer(serializers.ModelSerializer):
    class Meta:
        model = basic_info
        fields = ['basic_pk_id','screening_count','citizen_pk_id','screening_citizen_id','prefix','name','gender','blood_group','dob','year','months','days','aadhar_id','phone_no','added_by','modify_by','form_submit','is_deleted']
        

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
        fields = ['growth_pk_id','gender','dob','year','months','days','height','weight','weight_for_age','height_for_age','weight_for_height','bmi','arm_size','symptoms','remark','reffered_to_specialist','modify_by','is_deleted','modify_date']
        

class vital_info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = vital_info
        fields = ['vital_info_pk_id','vital_code','citizen_id','screening_count','citizen_pk_id','screening_citizen_id','pulse','pulse_conditions','sys_mm','sys_mm_conditions','dys_mm','dys_mm_mm_conditions','oxygen_saturation','oxygen_saturation_conditions','rr','rr_conditions','temp','temp_conditions','is_deleted','form_submit','reffered_to_specialist','added_by','added_date','modify_by','modify_date']
        



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
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]
        

class Treatment_Get_Serializer(serializers.ModelSerializer):
    referral_name = serializers.CharField(source='referral.referral', read_only=True)
    place_referral_name = serializers.CharField(source='place_referral.place_referral', read_only=True)
    hospital_name_text = serializers.CharField(source='hospital_name.hospital_name', read_only=True)

    class Meta:
        model = treatement
        fields = ['treatement_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id', 'treatment_for', 'referral', 'referral_name', 'reason_for_referral', 'place_referral', 'place_referral_name', 'outcome', 'referred_surgery', 'hospital_name', 'hospital_name_text', 'basic_referred_treatment', 'form_submit', 'reffered_to_specialist', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date']


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
            'added_by', 'added_date', 'modify_by', 'modify_date'
        ]
        
class Auditory_Info_Get_Serializer(serializers.ModelSerializer):
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
            'added_by', 'added_date', 'modify_by', 'modify_date'
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
            'modify_by', 'modify_date'
        ]
        

class Vision_Info_Get_Serializer(serializers.ModelSerializer):
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
            'modify_by', 'modify_date'
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
            'modify_by', 'modify_date'
        ]
        


class Dental_Info_Get_Serializer(serializers.ModelSerializer):
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
            'modify_by', 'modify_date'
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
        'form_submit', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date']
        
        
class Investigation_Info_Get_Serializer(serializers.ModelSerializer):
    
    class Meta:
        model = investigation_info
        fields = ['investigation_pk_id', 'citizen_id', 'screening_count', 'citizen_pk_id', 'screening_citizen_id','investigation_report', 'urine_report', 'ecg_report', 'x_ray_report',
        'form_submit', 'is_deleted', 'added_by', 'added_date', 'modify_by', 'modify_date']
        




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

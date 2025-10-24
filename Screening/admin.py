from django.contrib import admin
# Register your models here.
from .models import *
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField




class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = agg_com_colleague
        # fields = ('clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status','clg_source','clg_tahsil','clg_source_name')
        
        fields = ('clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' , 'clg_state', 'clg_district' ,'clg_added_by' ,'clg_modify_by' ,'clg_source','clg_tahsil','clg_source_name')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user



class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    # password = ReadOnlyPasswordHashField()

    class Meta:
        model = agg_com_colleague
        fields = '__all__'
        # fields = ('email', 'password','group', 'name','tc', 'is_active', 'is_admin')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'is_admin', 'clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status','clg_source','clg_tahsil','clg_source_name')

  list_filter = ('is_admin',)

  fieldsets = (
      ('User Credentials', {'fields': ('clg_ref_id', 'password')}),
      ('Personal info', {'fields': ('clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status','clg_source','clg_tahsil','clg_source_name')}),
      ('Permissions', {'fields': ('is_admin',)}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('clg_ref_id', 'clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'grp_id' ,'clg_email' ,'clg_mobile_no' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status','clg_source','clg_tahsil','clg_source_name','password1', 'password2',),
      }),
  )
  search_fields = ('clg_ref_id',)
  ordering = ('clg_ref_id', 'id')
  filter_horizontal = ()






admin.site.register(agg_com_colleague, UserModelAdmin)
admin.site.register(agg_mas_group)
admin.site.register(permission)
admin.site.register(role)
admin.site.register(Permission_module)




admin.site.register(agg_sc_citizen_sick_room_info)
admin.site.register(agg_sc_schedule_screening)


admin.site.register(agg_sc_add_new_citizens)
# admin.site.register(agg_sc_add_new)
admin.site.register(agg_sc_citizen_basic_info)



admin.site.register(agg_sc_state)
admin.site.register(agg_sc_district)
admin.site.register(agg_sc_tahsil)
admin.site.register(agg_sc_disease)
admin.site.register(agg_sc_citizen_schedule)
admin.site.register(citizen_basic_info)
admin.site.register(agg_sc_citizen_family_info)
admin.site.register(agg_sc_growth_monitoring_info)
admin.site.register(agg_sc_citizen_vital_info)
admin.site.register(agg_audit)
admin.site.register(agg_immunisation)
admin.site.register(agg_sc_citizen_immunization_info)
admin.site.register(agg_sc_citizen_audit_info)
admin.site.register(agg_sc_citizen_pycho_info)
admin.site.register(agg_sc_citizen_dental_info)
admin.site.register(agg_sc_citizen_vision_info)
admin.site.register(vision_eye_checkbox)
admin.site.register(vision_checkbox_if_present)
admin.site.register(agg_sc_basic_screening_info)
admin.site.register(agg_sc_screening_for_type)
admin.site.register(agg_sc_class)
admin.site.register(agg_sc_division)
admin.site.register(basic_information_head_scalp)
admin.site.register(basic_information_hair_color)
admin.site.register(basic_information_hair_density)
admin.site.register(basic_information_hair_texture)
admin.site.register(basic_information_alopecia)
admin.site.register(basic_information_neck)
admin.site.register(basic_information_nose)
admin.site.register(basic_information_skin_color)
admin.site.register(basic_information_skin_texture)
admin.site.register(basic_information_skin_lesions)
admin.site.register(basic_information_lips)
admin.site.register(basic_information_gums)
admin.site.register(basic_information_dentition)
admin.site.register(basic_information_oral_mucosa)
admin.site.register(basic_information_tounge)
admin.site.register(basic_information_chest)
admin.site.register(basic_information_abdomen)
admin.site.register(basic_information_extremity)


admin.site.register(basic_information_rs_right)
admin.site.register(basic_information_rs_left)
admin.site.register(basic_information_cvs)
admin.site.register(basic_information_varicose_veins)
admin.site.register(basic_information_lmp)
admin.site.register(basic_information_cns)
admin.site.register(basic_information_reflexes)
admin.site.register(basic_information_rombergs)
admin.site.register(basic_information_pupils)
admin.site.register(basic_information_pa)
admin.site.register(basic_information_tenderness)
admin.site.register(basic_information_ascitis)
admin.site.register(basic_information_guarding)
admin.site.register(basic_information_joints)
admin.site.register(basic_information_swollen_joints)
admin.site.register(basic_information_spine_posture)


admin.site.register(basic_information_language_delay)
admin.site.register(basic_information_behavioural_disorder)
admin.site.register(basic_information_speech_screening)


admin.site.register(basic_information_birth_defects)
admin.site.register(basic_information_childhood_disease)
admin.site.register(basic_information_deficiencies)
admin.site.register(basic_information_skin_conditions)
admin.site.register(basic_information_check_box_if_normal)
admin.site.register(basic_information_diagnosis)

admin.site.register(basic_information_referral)
admin.site.register(basic_information_place_referral)

admin.site.register(agg_sc_followup_dropdownlist)
admin.site.register(agg_sc_followup_for)
admin.site.register(agg_sc_follow_up_citizen)
admin.site.register(agg_sc_followup)
admin.site.register(agg_sc_follow_up_status)
admin.site.register(agg_sc_medical_event_info)

admin.site.register(agg_screening_list)
admin.site.register(agg_screening_sub_list)
#----------------Corparate-----------------------
admin.site.register(agg_sc_department)
admin.site.register(agg_sc_designation)
admin.site.register(medical_history)
admin.site.register(agg_citizen_past_operative_history)
admin.site.register(agg_sc_citizen_medical_history)
admin.site.register(agg_sc_investigation)
admin.site.register(agg_sc_bad_habbits)
admin.site.register(agg_save_permissions)
admin.site.register(referred_hospital_list)
admin.site.register(agg_sc_citizen_other_info)
# _____________ Final ________________________

# admin.site.register(agg_sc_state)
# admin.site.register(agg_mh_district)
# admin.site.register(agg_mh_taluka)
admin.site.register(agg_search_and_source_names)
admin.site.register(agg_sc_add_new_source)
admin.site.register(agg_source)
admin.site.register(agg_age)
admin.site.register(agg_gender)
admin.site.register(agg_sc_start_screening)
admin.site.register(GrowthMonitoring)
# admin.site.register(agg_mh_taluka)

# _____________ Final ________________________



admin.site.register(WHO_BMI_bmi_boys_and_girl_5_19_years)
admin.site.register(wt_for_age_0_to_10_boys_and_girl)
admin.site.register(wt_for_ht_0_to_10_boys_and_girl)
admin.site.register(ht_for_age_0_to_10_boys_and_girl)


# @admin.register(wt_for_ht_0_to_10_yrs_boys_girlfriend)
# class userdataa(ImportExportModelAdmin):
#     pass



# @admin.register(mas_weightforage_five_to_ten)
# class userdataa(ImportExportModelAdmin):
#     pass

#



admin.site.register(imported_data_from_excel_csv)


admin.site.register(agg_sc_location)
admin.site.register(agg_sc_route)
admin.site.register(agg_sc_ambulance)
admin.site.register(agg_sc_doctor)
admin.site.register(agg_sc_pilot)
from django.db import models
from django_enumfield import enum
from django.utils import timezone
from django.core.validators import RegexValidator
# from joinfield.joinfield import JoinField
from .models_choices_fields import *
import datetime
from django.contrib.auth.models import(
	BaseUserManager,AbstractBaseUser
)
from django.utils import timezone
from django.db import models, IntegrityError

class status_enum(enum.Enum):
	Active = 1
	Inactive = 2
	Delete = 3
 
class level(enum.Enum):
    Primary = 0
    Secondary = 1

class status(enum.Enum):
    NO = 0
    YES = 1

    __default__ = NO
    
           
class vision_eye_checkbox(models.Model):
    eye_pk_id = models.AutoField(primary_key=True)
    eye = models.CharField(max_length=555)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class vision_checkbox_if_present(models.Model):
    checkbox_pk_id = models.AutoField(primary_key=True)
    checkbox_if_present = models.CharField(max_length=555)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    


from django.db import models
# from django.db.models import Max
from django_enumfield import enum
from datetime import date
# Create your models here.
from django.db import models
from django_enumfield import enum


class agg_immunisation(models.Model):
    immunisation_pk_id = models.AutoField(primary_key=True)
    immunisations = models.CharField(max_length=555)
    window_period_days_from = models.IntegerField()
    window_period_days_to = models.IntegerField()
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
# ------------------------------------------------ Vital_Info ---------------------------------------------------------------



class referred_hospital_list(models.Model):
    hospital_pk_id = models.AutoField(primary_key=True)
    hospital_name = models.CharField(max_length=555)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='referred_hospital_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='referred_hospital_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)


class status(enum.Enum):
    NO = 0
    YES = 1

class flow_status(enum.Enum):
    NAD = 1
    MILD = 2
    MODERATE = 3
    EXCESSIVE = 4


class agg_audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    audit_name = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class checkbox(enum.Enum):
    CHECK = 1
    UNCHECK = 0
    __default__=UNCHECK
    


#-------------------------------Basic Information (Genral Examination)---------------------------------#
class basic_information_head_scalp(models.Model):
    head_scalp_id = models.AutoField(primary_key=True)
    head_scalp = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_hair_color(models.Model):
    hair_color_id = models.AutoField(primary_key=True)
    hair_color = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_hair_density(models.Model):
    hair_density_id = models.AutoField(primary_key=True)
    hair_density = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_hair_texture(models.Model):
    hair_texture_id = models.AutoField(primary_key=True)
    hair_texture = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_alopecia(models.Model):
    alopecia_id = models.AutoField(primary_key=True)
    alopecia = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_neck(models.Model):
    neck_id = models.AutoField(primary_key=True)
    neck = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_nose(models.Model):
    nose_id = models.AutoField(primary_key=True)
    nose = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_skin_color(models.Model):
    skin_id = models.AutoField(primary_key=True)
    skin_color = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_skin_texture(models.Model):
    skin_texture_id = models.AutoField(primary_key=True)
    skin_texture = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_skin_lesions(models.Model):
    skin_lesions_id = models.AutoField(primary_key=True)
    skin_lesions = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_lips(models.Model):
    lips_id = models.AutoField(primary_key=True)
    lips = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_gums(models.Model):
    gums_id = models.AutoField(primary_key=True)
    gums = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_dentition(models.Model):
    dentition_id = models.AutoField(primary_key=True)
    dentition = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_oral_mucosa(models.Model):
    oral_mucosa_id = models.AutoField(primary_key=True)
    oral_mucosa = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_tounge(models.Model):
    tounge_id = models.AutoField(primary_key=True)
    tounge = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
class basic_information_chest(models.Model):
    chest_id = models.AutoField(primary_key=True)
    chest = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_abdomen(models.Model):
    abdomen_id = models.AutoField(primary_key=True)
    abdomen = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_extremity(models.Model):
    extremity_id = models.AutoField(primary_key=True)
    extremity = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
#-------------------------------Basic Information (Systemic Exam)---------------------------------#
    
class basic_information_rs_right(models.Model):
    rs_right_id = models.AutoField(primary_key=True)
    rs_right = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_rs_left(models.Model):
    rs_left_id = models.AutoField(primary_key=True)
    rs_left = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_cvs(models.Model):
    cvs_id = models.AutoField(primary_key=True)
    cvs = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_varicose_veins(models.Model):
    varicose_veins_id = models.AutoField(primary_key=True)
    varicose_veins = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_lmp(models.Model):
    lmp_id = models.AutoField(primary_key=True)
    lmp = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_cns(models.Model):
    cns_id = models.AutoField(primary_key=True)
    cns = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_reflexes(models.Model):
    reflexes_id = models.AutoField(primary_key=True)
    reflexes = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_rombergs(models.Model):
    rombergs_id = models.AutoField(primary_key=True)
    rombergs = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_pupils(models.Model):
    pupils_id = models.AutoField(primary_key=True)
    pupils = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_pa(models.Model):
    pa_id = models.AutoField(primary_key=True)
    pa = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_tenderness(models.Model):
    tenderness_id = models.AutoField(primary_key=True)
    tenderness = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_ascitis(models.Model):
    ascitis_id = models.AutoField(primary_key=True)
    ascitis = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_guarding(models.Model):
    guarding_id = models.AutoField(primary_key=True)
    guarding = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_joints(models.Model):
    joints_id = models.AutoField(primary_key=True)
    joints = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_swollen_joints(models.Model):
    swollen_joints_id = models.AutoField(primary_key=True)
    swollen_joints = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_spine_posture(models.Model):
    spine_posture_id = models.AutoField(primary_key=True)
    spine_posture = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

#-------------------------------Basic Information ( Disability Screening )---------------------------------#
class basic_information_language_delay(models.Model):
    language_delay_id = models.AutoField(primary_key=True)
    language_delay = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_behavioural_disorder(models.Model):
    behavioural_disorder_id = models.AutoField(primary_key=True)
    behavioural_disorder = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class basic_information_speech_screening(models.Model):
    speech_screening_id = models.AutoField(primary_key=True)
    speech_screening = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
#-------------------------------Basic Information (Birth Defects )---------------------------------#
class basic_information_birth_defects(models.Model):
    birth_defects_id = models.AutoField(primary_key=True)
    birth_defects = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


#-------------------------------Basic Information (Childhood disease )---------------------------------#
class basic_information_childhood_disease(models.Model):
    childhood_disease_id = models.AutoField(primary_key=True)
    childhood_disease = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


#-------------------------------Basic Information (Deficiencies )---------------------------------#
class basic_information_deficiencies(models.Model):
    deficiencies_id = models.AutoField(primary_key=True)
    deficiencies = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

#-------------------------------Basic Information (Skin Condition )---------------------------------#
class basic_information_skin_conditions(models.Model):
    skin_conditions_id = models.AutoField(primary_key=True)
    skin_conditions = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
#-------------------------------Basic Information (Check Box if Normal )---------------------------------#
class basic_information_check_box_if_normal(models.Model):
    check_box_if_normal_id = models.AutoField(primary_key=True)
    check_box_if_normal = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


#-------------------------------Basic Information (Diagnosis )---------------------------------#
class basic_information_diagnosis(models.Model):
    diagnosis_id = models.AutoField(primary_key=True)
    diagnosis = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

#-------------------------------Basic Information (Treatment )---------------------------------#
class basic_information_referral(models.Model):
    referral_id = models.AutoField(primary_key=True)
    referral = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class basic_information_place_referral(models.Model):
    place_referral_id = models.AutoField(primary_key=True)
    place_referral = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)



# ___________ Source ___________________________
class agg_source(models.Model): 
    source_pk_id = models.AutoField(primary_key=True)
    source_code = models.CharField(max_length=255, editable=False, unique=True)
    created_date = models.DateField(default=timezone.now, editable=False)

    source = models.CharField(max_length=255,unique=True)
    # Group_id = models.ForeignKey('agg_mas_group',on_delete=models.CASCADE,null=True)

    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, blank=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    def generate_id(self):
        last_id = agg_source.objects.filter(created_date=self.created_date).order_by('-source_code').first()
        if last_id and '-' in last_id.source_code:
            last_id_parts = last_id.source_code.split('-')
            if len(last_id_parts) >= 2:
                last_id_value = int(last_id_parts[1][-5:])
                new_id_value = last_id_value + 1   
                
                return int(str(self.created_date.strftime('%d%m%Y')) + str(new_id_value).zfill(5))
        
        return int(str(self.created_date.strftime('%d%m%Y')) + '00001')

    def save(self, *args, **kwargs):
        if not self.source_code:
            generated_id = self.generate_id()
            self.source_code = f"SOURCE-{generated_id}"
            super(agg_source, self).save(*args, **kwargs)


# ___________ Age Parameter  ___________________
class agg_age(models.Model): 
    age_pk_id = models.AutoField(primary_key=True)

    age = models.CharField(max_length=10)
    source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)
    source_name_id = models.ForeignKey('Workshop', on_delete=models.CASCADE,null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_date_sync = models.DateTimeField(auto_now=True)

    
class agg_gender(models.Model): 
    gender_pk_id = models.AutoField(primary_key=True)

    gender = models.CharField(max_length=50)

    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    
# ___________ End Age Parameter ___________________

#________________________ Disease _________________________________
class agg_sc_disease(models.Model):
    disease_pk_id = models.AutoField(primary_key=True)
    disease = models.CharField(max_length=255)

    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_state(models.Model):
	state_id=models.AutoField(primary_key=True)
	state_name=models.CharField(max_length=100,null=True,unique=True)

	def __str__(self):
		return f"{self.state_name}"


class agg_sc_district(models.Model):#70
    dist_id=models.AutoField(primary_key=True)
    dist_name=models.CharField(max_length=100,null=True,unique=True)
    state_name=models.ForeignKey('agg_sc_state',on_delete=models.CASCADE,null=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.dist_name

class agg_sc_tahsil(models.Model):
    tal_id=models.AutoField(primary_key=True)
    dist_name=models.ForeignKey('agg_sc_district',on_delete=models.CASCADE,null=True)
    tahsil_name=models.CharField(max_length=50,null=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, blank=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
	    return self.tahsil_name




class WHO_BMI_bmi_boys_and_girl_5_19_years(models.Model):
    bmi_id = models.FloatField()
    birth_year = models.IntegerField()
    birth_month = models.IntegerField()
    minus_three_SD = models.FloatField()
    minus_two_SD = models.FloatField()
    minus_one_SD = models.FloatField()
    one_SD = models.FloatField()
    two_SD = models.FloatField()
    three_SD = models.FloatField()    
    gender = models.IntegerField()


class wt_for_age_0_to_10_boys_and_girl(models.Model):
    hfa_id = models.FloatField()
    birth_year = models.IntegerField()
    birth_month = models.IntegerField()
    minus_three_SD = models.FloatField()
    minus_two_SD = models.FloatField()
    minus_one_SD = models.FloatField()
    one_SD = models.FloatField()
    two_SD = models.FloatField()
    three_SD = models.FloatField()    
    gender = models.IntegerField()


class wt_for_ht_0_to_10_boys_and_girl(models.Model):
    wfh_id = models.FloatField()
    From = models.FloatField()
    to = models.FloatField()
    minus_three_SD = models.FloatField()
    minus_two_SD = models.FloatField()
    minus_one_SD = models.FloatField()
    one_SD = models.FloatField()
    two_SD = models.FloatField()
    three_SD = models.FloatField()
    gender = models.IntegerField()



class ht_for_age_0_to_10_boys_and_girl(models.Model):
    hfa_id = models.FloatField()
    birth_year = models.IntegerField()
    birth_month = models.IntegerField()
    minus_three_SD = models.FloatField()
    minus_two_SD = models.FloatField()
    minus_one_SD = models.FloatField()
    one_SD = models.FloatField()
    two_SD = models.FloatField()
    three_SD = models.FloatField()
    gender = models.IntegerField()
# ___________________JWT_tables-------------------------------  
class agg_mas_group(models.Model):
    grp_id = models.AutoField(primary_key=True, auto_created=True)
    grp_name = models.CharField(max_length=50, null=True)
    grp_code = models.CharField(max_length=50, null=True)
    grp_level = enum.EnumField(level, null=True)
    grp_parent = models.CharField(max_length=50, null=True)
    grp_status = enum.EnumField(status_enum, null=True)
    is_deleted = models.BooleanField(default=False)
    clg_added_by =	models.IntegerField(null=True, blank=True)
    clg_added_date = models.DateField(auto_now_add=True, blank=True)
    clg_modify_by =	models.IntegerField(null=True, blank=True)
    clg_modify_date = models.DateField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return '%s' %(self.grp_id)
    
    
  

# Custom User Manager
class agg_colleague_manager(BaseUserManager):

    # def create_user(self, clg_ref_id, clg_first_name, clg_mid_name ,clg_last_name ,grp_id , clg_email ,clg_mobile_no ,clg_gender ,clg_address ,clg_is_login ,clg_designation ,clg_state ,clg_division ,clg_district ,clg_break_type ,clg_senior ,clg_hos_id ,clg_agency_id ,clg_status ,clg_added_by ,clg_modify_by ,clg_Date_of_birth ,clg_Work_phone_number ,clg_work_email_id ,clg_Emplyee_code ,clg_qualification,clg_avaya_agentid ,clg_Aadhar_no,clg_specialization ,clg_profile_photo_path ,clg_joining_date ,clg_marital_status, clg_otp, clg_otp_count, clg_otp_expire_time,clg_source,clg_tahsil,clg_source_name,password=None,password2=None):#clg_source,clg_tahsil,clg_source_name,
    
    def create_user(self, clg_ref_id, clg_mobile_no ,grp_id , clg_email ,clg_gender ,clg_address , clg_state ,clg_district , clg_Date_of_birth, clg_source,clg_tahsil, clg_source_name, clg_added_by,password=None,password2=None):# clg_first_name, clg_mid_name ,clg_last_name clg_is_loginclg_added_by ,clg_modify_by, clg_otp, clg_otp_count, clg_otp_expire_time,


        """
        Creates and saves a User with the given email, name, tc and password.
        """
        # if not clg_ref_id:
        #     raise ValueError('User must have an user id')

        user = self.model(
            clg_email=self.normalize_email(clg_email),
            clg_ref_id = clg_ref_id,
            # clg_first_name = clg_first_name,
            # clg_mid_name = clg_mid_name, 
            # clg_last_name = clg_last_name,
            grp_id = grp_id,
            clg_mobile_no = clg_mobile_no,
            clg_gender = clg_gender,
            clg_Date_of_birth = clg_Date_of_birth,
            clg_address = clg_address,
            clg_state = clg_state,
            clg_district = clg_district,
            # clg_is_login = clg_is_login,
			# clg_otp = clg_otp,
			# clg_otp_count = clg_otp_count,
			# clg_otp_expire_time = clg_otp_expire_time,
            clg_added_by = clg_added_by ,
            # clg_modify_by = clg_modify_by,
            clg_source = clg_source,#added By mohin
            clg_tahsil = clg_tahsil,#added By mohin
            clg_source_name = clg_source_name #added By mohin
            # clg_Work_phone_number = clg_Work_phone_number,
            # clg_work_email_id = clg_work_email_id,
            # clg_designation = clg_designation,
            # clg_qualification = clg_qualification,
            # clg_specialization = clg_specialization,
            # clg_senior = clg_senior,
            # clg_division = clg_division,
            # clg_break_type = clg_break_type,
            # clg_Aadhar_no = clg_Aadhar_no,
            # clg_profile_photo_path = clg_profile_photo_path,
            # clg_joining_date = clg_joining_date,
            # clg_status = clg_status,
            # clg_marital_status = clg_marital_status,
            # clg_Emplyee_code = clg_Emplyee_code,
            # clg_hos_id = clg_hos_id,
            # clg_avaya_agentid = clg_avaya_agentid,
            # clg_agency_id = clg_agency_id
        )

        user.set_password(password)
        user.save(using=self._db)
        return user
            
    # def create_superuser(self, clg_ref_id, clg_first_name, clg_mid_name ,clg_last_name, grp_id ,clg_email ,clg_mobile_no ,clg_gender ,clg_address ,clg_is_login ,clg_designation ,clg_state ,clg_division ,clg_district ,clg_break_type ,clg_senior ,clg_hos_id ,clg_agency_id ,clg_status ,clg_added_by ,clg_modify_by ,clg_Date_of_birth ,clg_Work_phone_number ,clg_work_email_id ,clg_Emplyee_code ,clg_qualification,clg_avaya_agentid ,clg_Aadhar_no,clg_specialization, clg_profile_photo_path ,clg_joining_date ,clg_marital_status, clg_otp, clg_otp_count, clg_otp_expire_time,clg_source,clg_tahsil,clg_source_name,password=None):
        
    def create_superuser(self, clg_ref_id, clg_mobile_no ,grp_id , clg_email ,clg_gender ,clg_address ,clg_state ,clg_district , clg_Date_of_birth, clg_source,clg_tahsil,clg_source_name,password=None):# clg_first_name, clg_mid_name ,clg_last_name clg_is_login clg_otp_expire_time,clg_added_by ,clg_modify_by, clg_otp, clg_otp_count, 

        """Creates and saves a superuser with the given email, name, tc and password."""
        user = self.create_user(
            clg_email=clg_email,
            password=password,
            clg_ref_id = clg_ref_id,
            # clg_first_name = clg_first_name,
            # clg_mid_name = clg_mid_name, 
            # clg_last_name = clg_last_name,
            grp_id = grp_id,
            clg_mobile_no = clg_mobile_no,
            clg_gender = clg_gender,
            clg_Date_of_birth = clg_Date_of_birth,
            clg_address = clg_address,
            clg_state = clg_state,
            clg_district = clg_district,
            # clg_is_login = clg_is_login,
			# clg_otp = clg_otp,
			# clg_otp_count = clg_otp_count,
			# clg_otp_expire_time = clg_otp_expire_time,
            # clg_added_by = clg_added_by ,
            # clg_modify_by = clg_modify_by,
            clg_source = clg_source,#added By mohin
            clg_tahsil = clg_tahsil,#added By mohin
            clg_source_name = clg_source_name #added By mohin
            # clg_division = clg_division,
            # clg_Emplyee_code = clg_Emplyee_code,
            # clg_hos_id = clg_hos_id,
            # clg_avaya_agentid = clg_avaya_agentid,
            # clg_agency_id = clg_agency_id,
            # clg_break_type = clg_break_type,
            # clg_Aadhar_no = clg_Aadhar_no,
            # clg_profile_photo_path = clg_profile_photo_path,
            # clg_joining_date = clg_joining_date,
            # clg_status = clg_status,
            # clg_marital_status = clg_marital_status,
            # clg_Work_phone_number = clg_Work_phone_number,
            # clg_work_email_id = clg_work_email_id,
            # clg_designation = clg_designation,
            # clg_qualification = clg_qualification,
            # clg_specialization = clg_specialization,
            # clg_senior = clg_senior
        )

        user.is_admin = True
        user.save(using=self._db)
        return user

class agg_com_colleague(AbstractBaseUser):
    # clg_id = models.AutoField(primary_key=True, auto_created=True)
    clg_ref_id = models.CharField(max_length=110,unique=True, null=True, blank=True)
    clg_email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        null= True,
        blank=True
    )
    clg_work_email_id =	models.EmailField(max_length=100, null=True, blank=True)
    clg_hos_id = models.IntegerField(null=True, blank=True)
    clg_agency_id =	models.IntegerField(null=True, blank=True)
    clg_Emplyee_code =	models.CharField(max_length=50, null=True, blank=True)
    clg_avaya_agentid =	models.IntegerField(null=True, blank=True)
    clg_first_name = models.CharField(max_length=50, null=True, blank=True)
    clg_mid_name =	models.CharField(max_length=50, null=True, blank=True)
    clg_last_name =	models.CharField(max_length=50, null=True, blank=True)
    # grp_id = models.IntegerField(null=True)
    grp_id = models.ForeignKey(agg_mas_group,related_name='clg_group', on_delete=models.CASCADE, null=True, default=None, blank=True)
    clg_gender = models.ForeignKey('agg_gender', on_delete=models.CASCADE,null=True, blank=True)
    # clg_gender = models.IntegerField(null=True)
    clg_mobile_no =	models.BigIntegerField( null=True, blank=True)
    clg_Work_phone_number =	models.BigIntegerField(null=True, blank=True)
    clg_Date_of_birth =	models.DateField(null=True, blank=True)
    clg_Aadhar_no =	models.BigIntegerField(null=True, blank=True)
    clg_designation = models.CharField(max_length=50, null=True, blank=True)
    clg_qualification =	models.CharField(max_length=50, null=True, blank=True)
    clg_specialization = models.CharField(max_length=50, null=True, blank=True)
    clg_address = models.CharField(max_length=100, null=True, blank=True)
    clg_state =	models.ForeignKey('agg_sc_state', on_delete=models.CASCADE, null=True, blank=True)
    clg_division =	models.IntegerField(null=True, blank=True)
    clg_district =	models.ForeignKey('agg_sc_district', on_delete=models.CASCADE,null=True, blank=True)
    clg_source = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)#added By mohin
    clg_tahsil =	models.ForeignKey('agg_sc_tahsil', on_delete=models.CASCADE,null=True, blank=True)#added By mohin
    clg_source_name = models.ForeignKey('Workshop', on_delete=models.CASCADE,null=True, blank=True)#added By mohin
    # clg_state =	models.IntegerField(null=True)
    # clg_division =	models.IntegerField(null=True)
    # clg_district =	models.IntegerField(null=True)
    # clg_source = models.IntegerField(null=True)
    # clg_tahsil =	models.IntegerField(null=True)
    # clg_source_name = models.IntegerField(null=True)
    
    clg_senior = models.CharField(max_length=50, null=True, blank=True)
    clg_break_type = models.IntegerField(null=True, blank=True)
    clg_status = models.CharField(max_length=50, default=True, null=True, blank=True)    
    clg_profile_photo_path = models.CharField(max_length=100, null=True, blank=True)
    # clg_joining_date =	models.CharField(max_length=50, null=True, blank=True)
    clg_joining_date = models.DateTimeField(null=True, blank=True)
    clg_marital_status = models.CharField(max_length=50, null=True, blank=True)
    clg_otp =	models.IntegerField(null=True, blank=True)
    clg_otp_count =	models.IntegerField(null=True, blank=True)
    clg_otp_expire_time =	models.DateTimeField(null=True, blank=True)    
    clg_is_login =	models.BooleanField(default=False, blank=True)
    is_admin = models.BooleanField(default=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True,null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True,null=True)
    is_deleted = models.BooleanField(default=False)
    clg_added_by =	models.ForeignKey('agg_com_colleague', related_name='added_by_screenings',on_delete=models.CASCADE, null=True, blank=True)
    clg_modify_by =	models.ForeignKey('agg_com_colleague', related_name='modify_by_screenings',on_delete=models.CASCADE, null=True, blank=True)
    # clg_added_by =	models.IntegerField(null=True, blank=True)
    # clg_modify_by =	models.IntegerField(null=True, blank=True)
    clg_added_date = models.DateField(auto_now_add=True, blank=True)
    clg_modify_date = models.DateField(auto_now=True, null=True, blank=True)


    username = None
    email = None

    objects = agg_colleague_manager()

    EMAIL_FIELD = 'clg_email'
    GROUP_FIELD = 'grp_id'


    # USERNAME_FIELD = 'clg_mobile_no'
    USERNAME_FIELD = 'clg_ref_id'
    

    # 'clg_ref_id','clg_mobile_no' # Removed this field from required_fields caused it's username field declared. No need to add here

    # REQUIRED_FIELDS = ['grp_id','clg_first_name', 'clg_mid_name' ,'clg_last_name' ,'clg_email' ,'clg_gender' ,'clg_address' ,'clg_is_login' ,'clg_designation' ,'clg_state' ,'clg_division' ,'clg_district' ,'clg_break_type' ,'clg_senior' ,'clg_hos_id' ,'clg_agency_id' ,'clg_status' ,'clg_added_by' ,'clg_modify_by' ,'clg_Date_of_birth' ,'clg_Work_phone_number' ,'clg_work_email_id' ,'clg_Emplyee_code' ,'clg_qualification','clg_avaya_agentid' ,'clg_Aadhar_no','clg_specialization', 'clg_profile_photo_path' ,'clg_joining_date' ,'clg_marital_status','clg_source', 'clg_tahsil', 'clg_source_name', 'clg_otp', 'clg_otp_count', 'clg_otp_expire_time']
    # 'clg_mobile_no'
    REQUIRED_FIELDS = ['grp_id' ,'clg_email' ,'clg_gender' ,'clg_address' ,'clg_state' ,'clg_district' ,'clg_Date_of_birth' ,'clg_source', 'clg_tahsil', 'clg_source_name','clg_mobile_no' ]#,'clg_is_login''clg_added_by' ,'clg_modify_by''clg_otp', 'clg_otp_count', 'clg_otp_expire_time'


    def __str__(self):
        if self.clg_first_name:
            return self.clg_first_name
        return f"agg_com_colleague object with pk {self.pk}"

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
    
    # def save(self, *args, **kwargs):
    #     if not self.pk:
    #         if self.grp_id:
    #             group = self.grp_id  # Assuming that self.grp_id is an instance of the agg_mas_group model
    #             grp_name = group.grp_name  # Replace 'group_name' with the actual field name that stores the group name

    #             # Check if grp_name starts with "UG-" and remove it if necessary
    #             if grp_name.startswith("UG-"):
    #                 grp_name = grp_name.replace("UG-", "")

    #             # Get the current maximum code for the selected clg group with the same group and group name
    #             existing_codes = agg_com_colleague.objects.filter(grp_id=self.grp_id, clg_Emplyee_code__startswith=f'UG-{grp_name}-').values_list('clg_Emplyee_code', flat=True)
                
    #             if existing_codes:
    #                 # Extract the numeric parts of existing codes, find the maximum, and increment it
    #                 code_numbers = [int(code.split('-')[-1]) for code in existing_codes]
    #                 code_number = max(code_numbers) + 1
    #             else:
    #                 code_number = 1

    #             prefix = f'UG-{grp_name}-{code_number}'
    #         else:
    #             prefix = 'UG-OTHER'

    #         self.clg_Emplyee_code = prefix

    #     super(agg_com_colleague, self).save(*args, **kwargs)
    



    
class permission(models.Model):
    Permission_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    module = models.ForeignKey("Permission_module", on_delete=models.CASCADE,null = True)
    source =models.ForeignKey('agg_source',on_delete=models.CASCADE,null=True)
    # guard_name = models.CharField(max_length=255)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, blank=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.name


class role(models.Model):
    role_id = models.AutoField(primary_key=True)
    # permission_name = models.ForeignKey('permission',on_delete=models.CASCADE,null=True)
    Group_id = models.ForeignKey('agg_mas_group',on_delete=models.CASCADE,null=True)
    source =models.ForeignKey('agg_source',on_delete=models.CASCADE,null=True)
    # modules = models.ForeignKey('Permission_module',on_delete=models.CASCADE,null=True)
    # guard_name = models.CharField(max_length=255)
    permission_status =enum.EnumField(status, default = status.NO)
    role_is_deleted = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, blank=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    




class Permission_module(models.Model):
    module_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=250, null=True)
    Source_id = models.ForeignKey("agg_source", on_delete=models.CASCADE,null = True)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.name


    
    





#--------------------mayank-----------------------------

class agg_save_permissions(models.Model):
    id = models.AutoField(primary_key=True)
    source =models.ForeignKey('agg_source',on_delete=models.CASCADE,null=False)
    role = models.ForeignKey('agg_mas_group',on_delete=models.CASCADE,null=False)
    modules_submodule = models.JSONField(null=True)
    # modules = models.ForeignKey('Permission_module',on_delete=models.CASCADE,null=True)
    # sub_module = models.ManyToManyField('Permission', related_name='roles', blank=True)
    permission_status =enum.EnumField(status, default = status.NO)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True)


    



          

class agg_sc_followup_dropdownlist(models.Model):
    followup_pk_id = models.AutoField(primary_key=True)
    follow_up = models.CharField(max_length=555)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_followup_for(models.Model):
    followupfor_pk_id = models.AutoField(primary_key=True)
    follow_up_for = models.CharField(max_length=555)
    is_deleted = models.BooleanField(default=False)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)




class agg_sc_follow_up_status(models.Model):
    followup_status_pk_id = models.AutoField(primary_key=True)
    followup_status = models.CharField(max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    







          
class medical_history(models.Model):
    medical_hist_id = models.AutoField(primary_key=True)
    medical_history = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

class agg_citizen_past_operative_history(models.Model):  
    past_operative_hist_id = models.AutoField(primary_key=True)
    past_operative_history = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)





class agg_sc_bad_habbits(models.Model):
    bad_habbits_pk_id = models.AutoField(primary_key=True)
    bad_habbits = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)








class agg_screening_list(models.Model):
    sc_list_pk_id = models.AutoField(primary_key=True)
    screening_list = models.CharField(max_length = 255,null=True,blank=True)
    is_deleted = models.BooleanField(default=False)
    added_date = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
class agg_screening_sub_list(models.Model):
    sc_sub_list_pk_id = models.AutoField(primary_key=True)
    sub_list = models.CharField(max_length = 255,null=True,blank=True)
    screening_list = models.ForeignKey('agg_screening_list', on_delete=models.CASCADE,null=True,blank=True)
    is_deleted = models.BooleanField(default=False)
    added_date = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class image_save_table(models.Model):
    image_pk_id = models.AutoField(primary_key=True)
    image = models.FileField(upload_to='media_files/', null=True, blank=True)
    schedule_id = models.CharField(max_length=255)
    citizen_id  = models.CharField(max_length=255)
    citizen_pk_id = models.ForeignKey("Citizen", on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    

class anayalse_img_data_save_table(models.Model):
    anlyse_pk_id = models.AutoField(primary_key=True)
    # schedule_id = models.CharField(max_length=255,null=True,blank=True)
    citizen_id  = models.CharField(max_length=255,null=True,blank=True)
    # citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE,null=True,blank=True)
    oral_hygine = models.CharField(max_length=255,null=True,blank=True)
    gum_condition = models.CharField(max_length=255,null=True,blank=True)
    discolouration_of_teeth = models.CharField(max_length=255,null=True,blank=True)
    oral_ulcers = models.CharField(max_length=255,null=True,blank=True)
    food_impaction = models.CharField(max_length=255,null=True,blank=True)
    fluorosis = models.CharField(max_length=255,null=True,blank=True) 
    carious_teeth = models.CharField(max_length=255,null=True,blank=True)
    english = models.CharField(max_length=255,null=True,blank=True)
    marathi = models.CharField(max_length=255,null=True,blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
    


    



    
    
    

# ip 192.168.0.109
# user spero_it
# pass Spero@108
# port 22
# pj path /var/www/html/Aggregation_test_project/Screening
# spero_it@speroit:/var/www/html/Aggregation_test_project$ =======  source myenv/bin/activate
#  python manage.py runserver 0.0.0.0:9000
# admin = abc
# pass = 1234






# 103.186.133.168
# spero_it
# Spero@108
# 2121


#----------------------------------------------NEW Tables----------------------------------------------------------------------------------


class Category(models.Model):
    pk_id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=255,null=True,blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(max_length=255,null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(max_length=255,null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True) 


from django.db import models, transaction


class Citizen(models.Model):
    citizens_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=50, editable=False,unique=True)
    prefix = models.CharField(max_length=255,null=True,blank=True)
    name = models.CharField(max_length=255,null=True,blank=True)
    vehicle_number = models.CharField(max_length=255,null=True,blank=True)
    blood_groups = models.CharField(max_length=255,null=True,blank=True)
    dob = models.DateField(null=True,blank=True)
    year = models.CharField(max_length=12)
    months = models.CharField(max_length=12) 
    days = models.CharField(max_length=12)
    gender = models.ForeignKey('agg_gender', on_delete=models.CASCADE,null=True, blank=True)
    source = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)
    aadhar_id = models.CharField(max_length=12,null=True,blank=True)
    mobile_no = models.BigIntegerField(null=True,blank=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE,null=True, blank=True)
#___________ADDRESS_____________________________
    source_name = models.ForeignKey('Workshop', on_delete=models.CASCADE)
    state = models.ForeignKey('agg_sc_state', on_delete=models.CASCADE, blank=True, null=True)
    district = models.ForeignKey('agg_sc_district', on_delete=models.CASCADE,blank=True, null=True)
    tehsil =  models.ForeignKey('agg_sc_tahsil', on_delete=models.CASCADE,blank=True, null=True)
    pincode = models.CharField(max_length=255)
    address = models.CharField(max_length=255,null=True,blank=True)
#___________GROWTH MONITORING________________
    height = models.FloatField(blank=True,null=True)
    weight = models.FloatField(blank=True,null=True)
    weight_for_age = models.CharField(max_length=255, null=True,blank=True)
    height_for_age = models.CharField(max_length=255, null=True,blank=True)
    weight_for_height =models.CharField(max_length=50, blank=True,null=True)
    bmi = models.FloatField(blank=True, null=True)
    arm_size = models.IntegerField(blank=True, null=True)
    symptoms = models.CharField(max_length=255,blank=True, null=True)
    
    #------------------------------Emergency Contact -----------------------------------
    emergency_prefix = models.CharField(max_length=255,null=True,blank=True)
    emergency_fullname = models.CharField(max_length=255,null=True,blank=True)
    emergency_gender = models.CharField(max_length=255,null=True,blank=True)
    emergency_contact = models.CharField(max_length=10, null=True,blank=True) 
    relationship_with_employee = models.CharField(max_length=255,null=True,blank=True)
    emergency_address = models.CharField(max_length=555,null=True,blank=True)
    
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='citizen_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
    
    def generate_citizen_id(self):
        last_id = Citizen.objects.order_by('-citizens_pk_id').first()
        if last_id and last_id.citizen_id and '-' in last_id.citizen_id:
            try:
                last_id_value = int(last_id.citizen_id.split('-')[1][-5:])
            except ValueError:
                last_id_value = 0
            new_id_value = last_id_value + 1
        else:
            new_id_value = 1

        generated_id = f"{timezone.now().strftime('%d%m%Y')}{str(new_id_value).zfill(5)}"
        return f"CITIZEN-{generated_id}"

    def save(self, *args, **kwargs):
        for attempt in range(5):  # retry up to 5 times
            if not self.citizen_id:  # always regenerate if missing
                self.citizen_id = self.generate_citizen_id()
            try:
                with transaction.atomic():
                    super().save(*args, **kwargs)
                return  # ✅ success
            except IntegrityError:
                # regenerate ID and retry
                self.citizen_id = None
                if attempt == 4:
                    raise
                continue
            
            
class Workshop(models.Model):
    ws_pk_id = models.AutoField(primary_key=True)
    workshop_code = models.CharField(max_length=20, editable=False,unique=True)
    source = models.ForeignKey('agg_source',on_delete=models.CASCADE,null=True, blank=True)
    Workshop_name = models.CharField(max_length=255,null=True,blank=True)
    registration_no = models.CharField(max_length=255,null=True,blank=True)
    mobile_no = models.CharField(max_length=20,null=True,blank=True)
    email_id = models.EmailField(null=True,blank=True)
    logo = models.FileField(upload_to='media_files/', null=True, blank=True)

    ws_state = models.ForeignKey('agg_sc_state',on_delete=models.CASCADE,null=True, blank=True)
    ws_district = models.ForeignKey('agg_sc_district',on_delete=models.CASCADE,null=True, blank=True)
    ws_taluka = models.ForeignKey('agg_sc_tahsil',on_delete=models.CASCADE,null=True, blank=True)
    ws_pincode = models.CharField(max_length=255,null=True, blank=True)
    ws_address = models.CharField(max_length=255,null=True, blank=True)
    
    screening_vitals = models.JSONField(null=True,blank=True)
    sub_screening_vitals = models.JSONField(null=True,blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)  # Latitude can range from -90 to 90
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)  # Longitude can range from -180 to 180

    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='workshop_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.Workshop_name
       
    def save(self, *args, **kwargs):
        if not self.workshop_code:
            last_id = Workshop.objects.order_by('-ws_pk_id').first()
            if last_id:
                last_id_value = int(last_id.workshop_code.split('-')[1])
                new_id_value = last_id_value + 1
                generated_id = f"WS-{str(new_id_value).zfill(5)}"
            else:
                generated_id = f"WS-00001"

            self.workshop_code = generated_id

        super(Workshop, self).save(*args, **kwargs)





class Screening_citizen(models.Model):
    pk_id = models.AutoField(primary_key=True)
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_id = models.CharField(max_length=255,null=True,blank=True) 
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    added_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='screening_modify_by')
    modified_date = models.DateTimeField(auto_now=True)
    
    
    
    
class basic_info(models.Model):
    basic_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    prefix = models.CharField(max_length=255,null=True,blank=True)
    name = models.CharField(max_length=255,null=True, blank=True)
    gender = models.CharField(max_length=255,null=True, blank=True)
    blood_group = models.CharField(max_length=255,null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    year = models.CharField(max_length=12,null=True, blank=True)
    months = models.CharField(max_length=12,null=True, blank=True)
    days = models.CharField(max_length=12,null=True, blank=True)
    aadhar_id = models.CharField(max_length=12,null=True, blank=True)
    phone_no = models.CharField(max_length=10, null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='basic_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
    
class emergency_info(models.Model):
    em_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    emergency_prefix = models.CharField(max_length=255,null=True,blank=True)
    emergency_fullname = models.CharField(max_length=255,null=True,blank=True)
    emergency_gender = models.CharField(max_length=255,null=True,blank=True)
    emergency_contact = models.CharField(max_length=10, null=True,blank=True) 
    relationship_with_employee = models.CharField(max_length=255,null=True,blank=True)
    emergency_address = models.CharField(max_length=555,null=True,blank=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='emergency_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)







class growth_monitoring_info(models.Model):
    growth_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    gender = models.ForeignKey('agg_gender', on_delete=models.CASCADE,null=True, blank=True)
    
    dob = models.DateField(max_length=20,null=True, blank=True)
    year = models.CharField(max_length=20,null=True, blank=True)
    months = models.CharField(max_length=20,null=True, blank=True)
    days = models.CharField(max_length=10,null=True, blank=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    weight_for_age = models.CharField(max_length=50, blank=True, null=True)
    height_for_age = models.CharField(max_length=50, blank=True, null=True)
    weight_for_height = models.CharField(max_length=50, blank=True, null=True)
    bmi = models.FloatField(blank=True, null=True)
    arm_size = models.FloatField(blank=True, null=True)
    symptoms = models.CharField(max_length=255,null=True, blank=True)\
        
    remark = models.CharField(max_length=555,null=True, blank=True)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    refer_doctor = models.ForeignKey('doctor_list', on_delete=models.CASCADE,null=True, blank=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='growth_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
    
    
    
class vital_info(models.Model):
    vital_info_pk_id=models.AutoField(primary_key=True)
    vital_code = models.CharField(max_length=1110, editable=False) 
    
    
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    
    pulse = models.IntegerField(null=True, blank=True)
    pulse_conditions = models.CharField(max_length=555,null=True, blank=True)
    sys_mm = models.IntegerField(null=True, blank=True)
    sys_mm_conditions = models.CharField(max_length=555,null=True, blank=True)
    dys_mm = models.IntegerField(null=True, blank=True)
    dys_mm_mm_conditions = models.CharField(max_length=555,null=True, blank=True)
    oxygen_saturation = models.IntegerField(null=True, blank=True)
    oxygen_saturation_conditions = models.CharField(max_length=555,null=True, blank=True)
    rr = models.IntegerField(null=True, blank=True)
    rr_conditions = models.CharField(max_length=555,null=True, blank=True)
    temp = models.IntegerField(null=True, blank=True)
    temp_conditions = models.CharField(max_length=555,null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    form_submit = models.BooleanField(default=False)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    refer_doctor = models.ForeignKey('doctor_list', on_delete=models.CASCADE,null=True, blank=True)
    
    added_date = models.DateTimeField(auto_now_add=True)
    added_by =	models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='vital_modify_by')

    def save(self, *args, **kwargs):
        if not self.vital_code:
            last_id = vital_info.objects.order_by('-vital_code').first()
            if last_id and '-' in last_id.vital_code:
                last_id_value = int(last_id.vital_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.vital_code = f"VITAL-{generated_id}"

        super(vital_info, self).save(*args, **kwargs)
        

class genral_examination(models.Model):
    genral_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)

    head = models.ForeignKey('basic_information_head_scalp', on_delete=models.CASCADE,null=True,blank=True)
    nose = models.ForeignKey('basic_information_nose', on_delete=models.CASCADE,null=True,blank=True)
    neck = models.ForeignKey('basic_information_neck', on_delete=models.CASCADE,null=True,blank=True)
    skin_color = models.ForeignKey('basic_information_skin_color', on_delete=models.CASCADE,null=True,blank=True)
    skin_texture = models.ForeignKey('basic_information_skin_texture', on_delete=models.CASCADE,null=True,blank=True)
    skin_lesions = models.ForeignKey('basic_information_skin_lesions', on_delete=models.CASCADE,null=True,blank=True)
    lips = models.ForeignKey('basic_information_lips', on_delete=models.CASCADE,null=True,blank=True)
    gums = models.ForeignKey('basic_information_gums', on_delete=models.CASCADE,null=True,blank=True)
    dention = models.ForeignKey('basic_information_dentition', on_delete=models.CASCADE,null=True,blank=True)
    oral_mucosa = models.ForeignKey('basic_information_oral_mucosa', on_delete=models.CASCADE,null=True,blank=True)
    tongue = models.ForeignKey('basic_information_tounge', on_delete=models.CASCADE,null=True,blank=True)
    hair_color = models.ForeignKey('basic_information_hair_color', on_delete=models.CASCADE,null=True,blank=True)
    hair_density = models.ForeignKey('basic_information_hair_density', on_delete=models.CASCADE,null=True,blank=True)
    hair_texture = models.ForeignKey('basic_information_hair_texture', on_delete=models.CASCADE,null=True,blank=True)
    alopecia = models.ForeignKey('basic_information_alopecia', on_delete=models.CASCADE,null=True,blank=True)
    chest = models.ForeignKey('basic_information_chest', on_delete=models.CASCADE,null=True,blank=True)
    abdomen = models.ForeignKey('basic_information_abdomen', on_delete=models.CASCADE,null=True,blank=True)
    extremity = models.ForeignKey('basic_information_extremity', on_delete=models.CASCADE,null=True,blank=True)
    
    
    
    is_deleted = models.BooleanField(default=False)
    form_submit = models.BooleanField(default=False)

    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='genral_modify_by')
    
    
    
    
class systemic_exam(models.Model):
    systemic_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    rs_right = models.ForeignKey('basic_information_rs_right', on_delete=models.CASCADE,null=True,blank=True)
    rs_left = models.ForeignKey('basic_information_rs_left', on_delete=models.CASCADE,null=True,blank=True)
    cvs = models.ForeignKey('basic_information_cvs', on_delete=models.CASCADE,null=True,blank=True)
    varicose_veins =  models.ForeignKey('basic_information_varicose_veins', on_delete=models.CASCADE,null=True,blank=True)
    lmp =  models.ForeignKey('basic_information_lmp', on_delete=models.CASCADE,null=True,blank=True)
    cns = models.ForeignKey('basic_information_cns', on_delete=models.CASCADE,null=True,blank=True)
    reflexes = models.ForeignKey('basic_information_reflexes', on_delete=models.CASCADE,null=True,blank=True)
    rombergs = models.ForeignKey('basic_information_rombergs', on_delete=models.CASCADE,null=True,blank=True)
    pupils = models.ForeignKey('basic_information_pupils', on_delete=models.CASCADE,null=True,blank=True)
    pa = models.ForeignKey('basic_information_pa', on_delete=models.CASCADE,null=True,blank=True)
    tenderness = models.ForeignKey('basic_information_tenderness', on_delete=models.CASCADE,null=True,blank=True)
    ascitis =  models.ForeignKey('basic_information_ascitis', on_delete=models.CASCADE,null=True,blank=True)
    guarding = models.ForeignKey('basic_information_guarding', on_delete=models.CASCADE,null=True,blank=True)
    joints =  models.ForeignKey('basic_information_joints', on_delete=models.CASCADE,null=True,blank=True)
    swollen_joints =  models.ForeignKey('basic_information_swollen_joints', on_delete=models.CASCADE,null=True,blank=True)
    spine_posture = models.ForeignKey('basic_information_spine_posture', on_delete=models.CASCADE,null=True,blank=True)
    
    is_deleted = models.BooleanField(default=False)
    form_submit = models.BooleanField(default=False)

    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='systemic_modify_by')





class status2(enum.Enum):
    NO = 2
    YES = 1

class flow_status2(enum.Enum):
    NAD = 1
    MILD = 2
    MODERATE = 3
    EXCESSIVE = 4
class female_screening(models.Model):
    female_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255)
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    menarche_achieved = enum.EnumField(status2,null=True,blank=True)
    date_of_menarche = models.DateField(null=True,blank=True)  
    age_of_menarche = models.IntegerField(null=True,blank=True)
    vaginal_descharge = enum.EnumField(status2,null=True,blank=True) 
    flow = enum.EnumField(flow_status2,null=True,blank=True)
    comments = models.CharField(max_length = 555,null=True,blank=True)

    is_deleted = models.BooleanField(default=False)
    form_submit = models.BooleanField(default=False)

    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='female_modify_by')


class disability_screening(models.Model):
    disability_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    
    language_delay = models.ForeignKey('basic_information_language_delay', on_delete=models.CASCADE,null=True,blank=True)
    behavioural_disorder = models.ForeignKey('basic_information_behavioural_disorder', on_delete=models.CASCADE,null=True,blank=True)
    speech_screening = models.ForeignKey('basic_information_speech_screening', on_delete=models.CASCADE,null=True,blank=True)
    comment = models.CharField(max_length=255,null=True,blank=True)
    
    
    is_deleted = models.BooleanField(default=False)
    form_submit = models.BooleanField(default=False)

    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)


class birth_defect(models.Model):
    birth_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    birth_defects = models.JSONField(null=True,blank=True)

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='birth_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class childhood_diseases(models.Model):
    childhood_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    childhood_diseases = models.JSONField(null=True,blank=True)

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='childhood_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class deficiencies(models.Model):
    deficiencies_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    deficiencies = models.JSONField(null=True,blank=True)

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='deficiencies_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
class skin_conditions(models.Model):
    skin_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    skin_conditions = models.JSONField(null=True,blank=True)

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='skin_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

    


class diagnosis(models.Model):
    diagnosis_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    diagnosis = models.JSONField(null=True,blank=True)

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='diagnosis_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

class check_box_if_normal(models.Model):
    check_box_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    check_box_if_normal  = models.JSONField(null=True,blank=True)
    
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='checkbox_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
        


class treatement(models.Model):
    treatement_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    treatment_for = models.CharField(max_length=255,null=True,blank=True)
    referral = models.ForeignKey('basic_information_referral', on_delete=models.CASCADE,null=True,blank=True)
    reason_for_referral = models.CharField(max_length=255,null=True,blank=True)
    place_referral =models.ForeignKey('basic_information_place_referral', on_delete=models.CASCADE,null=True,blank=True)
    outcome = models.CharField(max_length=255,null=True,blank=True)
    referred_surgery = models.CharField(max_length=255,null=True,blank=True)
    hospital_name = models.ForeignKey("referred_hospital_list", on_delete=models.CASCADE,null=True,blank=True)
    basic_referred_treatment = models.CharField(max_length=255,null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    refer_doctor = models.ForeignKey('doctor_list', on_delete=models.CASCADE,null=True, blank=True)
    
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='treatement_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)



class auditory_info(models.Model):
    auditory_pk_id = models.AutoField(primary_key=True)
    audit_code = models.CharField(max_length=1110, editable=False) 
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    
    hz_250_left = models.IntegerField(null=True,blank=True)
    hz_500_left = models.IntegerField(null=True,blank=True)
    hz_1000_left = models.IntegerField(null=True,blank=True)
    hz_2000_left = models.IntegerField(null=True,blank=True)
    hz_4000_left = models.IntegerField(null=True,blank=True)
    hz_8000_left = models.IntegerField(null=True,blank=True)
    reading_left = models.CharField(max_length=255,null=True,blank=True)
    left_ear_observations_remarks = models.CharField(max_length=255,null=True,blank=True)

    
    hz_250_right = models.IntegerField(null=True,blank=True)
    hz_500_right = models.IntegerField(null=True,blank=True)
    hz_1000_right = models.IntegerField(null=True,blank=True)
    hz_2000_right = models.IntegerField(null=True,blank=True)
    hz_4000_right = models.IntegerField(null=True,blank=True)
    hz_8000_right = models.IntegerField(null=True,blank=True)
    reading_right = models.CharField(max_length=255,null=True,blank=True)
    right_ear_observations_remarks = models.CharField(max_length=255,null=True,blank=True) 
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    refer_doctor = models.ForeignKey('doctor_list', on_delete=models.CASCADE,null=True, blank=True)
    
    
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='audit_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.audit_code:
            last_id = auditory_info.objects.order_by('-audit_code').first()
            if last_id and '-' in last_id.audit_code:
                last_id_value = int(last_id.audit_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.audit_code = f"AUDIT-{generated_id}"

        super(auditory_info, self).save(*args, **kwargs)
    


class vision_info(models.Model):
    vision_pk_id = models.AutoField(primary_key=True)
    vision_code = models.CharField(max_length=1110, editable=False) 
    citizen_id = models.CharField(max_length=255)
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    
    re_near_without_glasses = models.IntegerField(null=True,blank=True)
    re_far_without_glasses = models.IntegerField(null=True,blank=True)
    le_near_without_glasses = models.IntegerField(null=True,blank=True)
    le_far_without_glasses = models.IntegerField(null=True,blank=True)
    re_near_with_glasses = models.IntegerField(null=True,blank=True)
    re_far_with_glasses = models.IntegerField(null=True,blank=True)
    le_near_with_glasses = models.IntegerField(null=True,blank=True)
    le_far_with_glasses = models.IntegerField(null=True,blank=True)
    comment = models.CharField(max_length=500,null=True,blank=True)
    color_blindness = models.CharField(max_length=500,null=True,blank=True)
    reffered_to_specialist = models.IntegerField(null=True,blank=True)
    refer_doctor = models.ForeignKey('doctor_list', on_delete=models.CASCADE,null=True, blank=True)

    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='vision_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

    def save(self, *args, **kwargs):
        if not self.vision_code:
            last_id = vision_info.objects.order_by('-vision_code').first()
            if last_id and '-' in last_id.vision_code:
                last_id_value = int(last_id.vision_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.vision_code = f"VISION-{generated_id}"

        super(vision_info, self).save(*args, **kwargs)


class medical_history_info(models.Model):
    medical_history_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    medical_history = models.JSONField(null=True,blank=True)
    past_operative_history = models.JSONField(null=True,blank=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='medical_history_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)





    
    
    
    
    
    


class follow_up(models.Model):
    follow_up_pk_id = models.AutoField(primary_key=True)
    vital_refer = models.IntegerField(blank=True,null=True)
    basic_screening_refer = models.IntegerField(blank=True,null=True)
    auditory_refer = models.IntegerField(blank=True,null=True)
    dental_refer = models.IntegerField(blank=True,null=True)
    vision_refer = models.IntegerField(blank=True,null=True)
    pycho_refer = models.IntegerField(blank=True,null=True)
    reffered_to_sam_mam = models.IntegerField(blank=True,null=True) 
    weight_for_height = models.CharField(max_length=255,blank=True,null=True) 
    
    
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    follow_up = models.IntegerField(blank=True,null=True,default=2)
    
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='followup_citizen_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)





class followup_save(models.Model):
    followup_id = models.AutoField(primary_key=True)
    followup_count = models.CharField(max_length=255,blank=True,null=True)
    citizen_id = models.CharField(max_length=255,blank=True,null=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    name = models.CharField(max_length=255,blank=True,null=True)
    dob = models.CharField(max_length=20,blank=True,null=True)
    parents_no = models.CharField(max_length=10,null=True,blank=True)
    state = models.CharField(max_length=255,blank=True,null=True)
    tehsil = models.CharField(max_length=255,blank=True,null=True)
    district = models.CharField(max_length=255,blank=True,null=True)
    source_name = models.CharField(max_length=255,blank=True,null=True)
    call_status = models.CharField(max_length=555, blank=True,null=True)
    conversational_remarks = models.CharField(max_length=555, blank=True,null=True)
    schedule_date = models.DateTimeField(blank=True,null=True)
    not_connected_reason = models.CharField(max_length=555, blank=True,null=True)
    visit_status = models.CharField(max_length=555, blank=True,null=True)
    visited_status = models.CharField(max_length=555, blank=True,null=True)
    condition_improved = models.CharField(max_length=555, blank=True,null=True)
    weight_gain_status = models.CharField(max_length=555, blank=True,null=True)
    forward_to = models.CharField(max_length=555, blank=True,null=True)
    priority = models.CharField(max_length=555, blank=True,null=True)
    not_visited_reason = models.CharField(max_length=555, blank=True,null=True)
    reschedule_date1 = models.DateTimeField(blank=True,null=True)
    reschedule_date2 = models.DateTimeField(blank=True,null=True)
    follow_up = models.ForeignKey("agg_sc_follow_up_status", on_delete=models.CASCADE,null=True,blank=True) 
    remark = models.CharField(max_length=555,blank=True,null=True)
    follow_up_citizen_pk_id = models.ForeignKey('follow_up',on_delete=models.CASCADE, blank=True,null=True)
    
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='followup_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    



class pft_info(models.Model):
    pft_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    pft_reading = models.IntegerField(blank=True,null=True)
    observations = models.CharField(max_length=555,blank=True,null=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='pft_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
class dental_info(models.Model):
    denta_pk_id = models.AutoField(primary_key=True)
    dental_code = models.CharField(max_length=1110, editable=False)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    oral_hygiene = models.CharField(max_length=255,null=True,blank=True)
    oral_hygiene = models.CharField(max_length=555,null=True,blank=True)
    oral_hygiene_remark = models.CharField(max_length=555,null=True,blank=True)
    gum_condition = models.CharField(max_length=255,null=True,blank=True)
    gum_condition_remark = models.CharField(max_length=555,null=True,blank=True)
    oral_ulcers = models.CharField(max_length=255,null=True,blank=True)
    oral_ulcers_remark = models.CharField(max_length=555,null=True,blank=True)
    gum_bleeding = models.CharField(max_length=255,null=True,blank=True)
    gum_bleeding_remark = models.CharField(max_length=555,null=True,blank=True)
    discoloration_of_teeth = models.CharField(max_length=255,null=True,blank=True)
    discoloration_of_teeth_remark = models.CharField(max_length=555,null=True,blank=True)
    food_impaction = models.CharField(max_length=255,null=True,blank=True)
    food_impaction_remark = models.CharField(max_length=555,null=True,blank=True)
    carious_teeth = models.CharField(max_length=255,null=True,blank=True)
    carious_teeth_remark = models.CharField(max_length=555,null=True,blank=True)
    extraction_done = models.CharField(max_length=255,null=True,blank=True)
    extraction_done_remark = models.CharField(max_length=555,null=True,blank=True)
    fluorosis = models.CharField(max_length=255,null=True,blank=True)
    fluorosis_remark = models.CharField(max_length=555,null=True,blank=True)
    tooth_brushing_frequency = models.CharField(max_length=255,null=True,blank=True)
    tooth_brushing_frequency_remark = models.CharField(max_length=555,null=True,blank=True)
    reffered_to_specialist = models.IntegerField(null=True,blank=True)
    refer_doctor = models.ForeignKey('doctor_list', on_delete=models.CASCADE,null=True, blank=True)
    reffered_to_specialist_remark =  models.CharField(max_length=555,null=True,blank=True)
    sensitive_teeth = models.CharField(max_length=255,null=True,blank=True)
    sensitive_teeth_remark = models.CharField(max_length=555,null=True,blank=True)
    malalignment = models.CharField(max_length=255,null=True,blank=True)
    malalignment_remark = models.CharField(max_length=555,null=True,blank=True)
    orthodontic_treatment = models.CharField(max_length=255,null=True,blank=True)
    orthodontic_treatment_remark = models.CharField(max_length=555,null=True,blank=True) 
    comment = models.CharField(max_length=555,null=True,blank=True) 
    treatment_given = models.CharField(max_length=555,null=True,blank=True) 
    referred_to_surgery = models.CharField(max_length=555,null=True,blank=True) 
    dental_conditions = models.CharField(max_length=555,null=True,blank=True)
    dental_refer_hospital = models.CharField(max_length=255,null=True,blank=True)

    image = models.FileField(upload_to='media_files/', null=True, blank=True)
    english = models.CharField(max_length=255,null=True,blank=True)
    marathi = models.CharField(max_length=255,null=True,blank=True)
    
    
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='dental_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

    

    def save(self, *args, **kwargs):
        if not self.dental_code:
            last_id = dental_info.objects.order_by('-dental_code').first()
            if last_id and '-' in last_id.dental_code:
                last_id_value = int(last_id.dental_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.dental_code = f"DENTAL-{generated_id}"

        super(dental_info, self).save(*args, **kwargs)
    
    
    

class immunisation_info(models.Model):
    immunization_pk_id = models.AutoField(primary_key=True)
    immunization_code = models.CharField(max_length=1110, editable=False) 
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    
    name_of_vaccine = models.JSONField(null=True,blank=True)
    given_yes_no = models.CharField(max_length=555,null=True,blank=True)
    scheduled_date_from = models.CharField(max_length=555,null=True,blank=True)
    scheduled_date_to = models.CharField(max_length=555,null=True,blank=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='immunization_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def save(self, *args, **kwargs):
        if not self.immunization_code:
            last_id = immunisation_info.objects.order_by('-immunization_code').first()
            if last_id and '-' in last_id.immunization_code:
                last_id_value = int(last_id.immunization_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.immunization_code = f"IMMUN-{generated_id}"

        super(immunisation_info, self).save(*args, **kwargs)


class investigation_info(models.Model):
    investigation_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    investigation_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    urine_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    ecg_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    x_ray_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    selected_submodules = models.JSONField(null=True,blank=True)
 

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey(agg_com_colleague, on_delete=models.CASCADE, null=True, blank=True, related_name='investigation_modify_by')
    modify_date = models.DateTimeField(auto_now=True, null=True)
    


class doctor_list(models.Model):
    doctor_pk_id = models.AutoField(primary_key=True)
    doctor_name = models.CharField(max_length=255,null=True,blank=True)    
    is_deleted = models.BooleanField(default=False)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
    





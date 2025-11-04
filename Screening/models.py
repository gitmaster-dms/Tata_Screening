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
    


# ----------------------------------- Citizen_Basic_Info -------------------------------------------------------------
class agg_sc_citizen_basic_info(models.Model):
    citizen_basic_info_pk_id = models.AutoField(primary_key=True)
    citizen_basic_code = models.CharField(max_length=50, editable=False)

    # citizens_pk_id = models.ForeignKey('agg_sc_add_new_citizens', on_delete=models.CASCADE)
    # schedule_screening_pk_id  = models.ForeignKey('agg_sc_schedule_screening', on_delete=models.CASCADE)
    # citizen_id = JoinField(agg_sc_add_new_citizens, to_field='citizens_id',on_delete=models.CASCADE)
    # health_key = models.ForeignKey(agg_sc_add_new_citizens, on_delete=models.CASCADE)
    # health_id = JoinField(agg_sc_add_new_citizens.health_id, to_field='health_id',on_delete=models.CASCADE)
    # schedule_screening_pk_id  = models.ForeignKey(agg_sc_schedule_screening, on_delete=models.CASCADE)
    # schedule_screening_pk_id = JoinField(agg_sc_schedule_screening, to_field='schedule_id',on_delete=models.CASCADE)


    citizen_adhar_id = models.CharField(max_length=12)
    schedule_count = models.IntegerField()
    schedule_id_old = models.CharField(max_length=255)
    past_medical_history = models.CharField(max_length=255)
    prev_hospitalization = models.CharField(max_length=255)
    current_medication = models.CharField(max_length=255)
    allergies = models.CharField(max_length=255)
    vacines = models.CharField(max_length=255)
    deworming_history = models.CharField(max_length=255)
    deworming_date = models.DateField()
    added_by = models.CharField(max_length=255)
    added_date = models.DateTimeField()
    modify_by = models.CharField(max_length=255)
    modify_date = models.DateTimeField(auto_now=True)
    is_deleted = models.CharField(max_length=10, choices=is_delete.choices)
    modify_date_sync = models.DateTimeField(auto_now=True)
    created_date = models.DateField(default=timezone.now, editable=False)


    # @property
    # def schedule_name(self):
    #     return self.schedule_id.schedule_id

    def generate_id(self):
        last_id = agg_sc_citizen_basic_info.objects.filter(created_date=self.created_date).order_by('-citizen_basic_code').first()
        if last_id and '-' in last_id.citizen_basic_code:
            last_id_parts = last_id.citizen_basic_code.split('-')
            if len(last_id_parts) >= 2:
                last_id_value = int(last_id_parts[1][-5:])
                new_id_value = last_id_value + 1   
                
                return int(str(self.created_date.strftime('%d%m%Y')) + str(new_id_value).zfill(5))
        
        return int(str(self.created_date.strftime('%d%m%Y')) + '00001')

    def save(self, *args, **kwargs):
        if not self.citizen_basic_code:
            generated_id = self.generate_id()
            self.citizen_basic_code = f"BASICIN-{generated_id}"
            super(agg_sc_citizen_basic_info, self).save(*args, **kwargs)
            
    # def __str__(self):
    #       return self.added_by

# ----------------------------------- END_Citizen_Basic_Info -------------------------------------------------------------

# ----------------------------------- Citizen_Dental_Info -------------------------------------------------------------



    
class agg_sc_citizen_dental_info(models.Model):
    dental_pk_id = models.AutoField(primary_key=True)
    dental_code = models.CharField(max_length=1110, editable=False)
    created_date = models.DateField(default=timezone.now, editable=False)
    schedule_id = models.CharField(max_length=255)
    citizen_id  = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    oral_hygiene = models.CharField(max_length=255,null=True,blank=True)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
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
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='dental_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='dental_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    image = models.FileField(upload_to='media_files/', null=True, blank=True)
    english = models.CharField(max_length=255,null=True,blank=True)
    marathi = models.CharField(max_length=255,null=True,blank=True)
    

    

    def save(self, *args, **kwargs):
        if not self.dental_code:
            last_id = agg_sc_citizen_dental_info.objects.order_by('-dental_code').first()
            if last_id and '-' in last_id.dental_code:
                last_id_value = int(last_id.dental_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.dental_code = f"DENTAL-{generated_id}"

        super(agg_sc_citizen_dental_info, self).save(*args, **kwargs)
                   
# ----------------------------------- END_Citizen_Dental_Info -------------------------------------------------------------

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
    
    
    
    
    
class agg_sc_citizen_vision_info(models.Model):
    vision_pk_id = models.AutoField(primary_key=True)
    vision_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    schedule_id = models.CharField(max_length=255)
    citizen_id  = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    eye = models.JSONField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    if_other_commnet = models.CharField(max_length=255,null=True,blank=True)
    vision_with_glasses = models.CharField(max_length=500,null=True,blank=True)
    vision_without_glasses = models.CharField(max_length=500,null=True,blank=True)
    eye_muscle_control = models.CharField(max_length=255,null=True,blank=True)
    refractive_error = models.CharField(max_length=255,null=True,blank=True)
    visual_perimetry = models.CharField(max_length=500,null=True,blank=True)
    comment = models.CharField(max_length=500,null=True,blank=True)
    treatment = models.CharField(max_length=500,null=True,blank=True)
    checkboxes = models.JSONField(null=True,blank=True)
    color_blindness = models.CharField(max_length=500,null=True,blank=True)
    vision_screening = models.CharField(max_length=500,null=True,blank=True)
    vision_screening_comment = models.CharField(max_length=500,null=True,blank=True)
    referred_to_surgery = models.CharField(max_length=500,null=True,blank=True)
    
    re_near_without_glasses = models.IntegerField(null=True,blank=True)
    re_far_without_glasses = models.IntegerField(null=True,blank=True)
    le_near_without_glasses = models.IntegerField(null=True,blank=True)
    le_far_without_glasses = models.IntegerField(null=True,blank=True)
    re_near_with_glasses = models.IntegerField(null=True,blank=True)
    re_far_with_glasses = models.IntegerField(null=True,blank=True)
    le_near_with_glasses = models.IntegerField(null=True,blank=True)
    le_far_with_glasses = models.IntegerField(null=True,blank=True)
    refer_hospital_name = models.CharField(max_length=255,null=True,blank=True)
    
    form_submit = models.BooleanField(default=False)
    reffered_to_specialist = models.IntegerField(null=True,blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='vision_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='vision_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

    def save(self, *args, **kwargs):
        if not self.vision_code:
            last_id = agg_sc_citizen_vision_info.objects.order_by('-vision_code').first()
            if last_id and '-' in last_id.vision_code:
                last_id_value = int(last_id.vision_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.vision_code = f"VISION-{generated_id}"

        super(agg_sc_citizen_vision_info, self).save(*args, **kwargs)

# ----------------------------------- END_Citizen_Vision_Info -------------------------------------------------------------

    
# ----------------------------------- Citizen_Sick_Room_Info -------------------------------------------------------------

class agg_sc_citizen_sick_room_info (models.Model):

    sick_room_info_pk_id = models.AutoField(primary_key=True)
    sick_room_code = models.CharField(max_length=1110, editable=False) 

    citizens_pk_id = models.ForeignKey('agg_sc_add_new_citizens', on_delete=models.CASCADE)
    schedule_screening_pk_id  = models.ForeignKey('agg_sc_schedule_screening', on_delete=models.CASCADE)

    schedule_id = models.CharField(max_length=10)
    student_id = models.CharField(max_length=10)
    doc_note = models.CharField(max_length=500)    
    treatment = models.CharField(max_length=500)
    added_by = models.CharField(max_length=500)
    added_date =  models.DateTimeField(auto_now=True)
    modify_by = models.CharField(max_length=500)
    modify_date = models.DateTimeField(auto_now=True)
    is_deleted = models.CharField(max_length=10, choices=is_delete.choices)
    modify_date_sync = models.DateTimeField(auto_now=True)
    created_date = models.DateField(default=timezone.now, editable=False)


    def generate_id(self):
        last_id = agg_sc_citizen_sick_room_info.objects.filter(created_date=self.created_date).order_by('-sick_room_code').first()
        if last_id and '-' in last_id.sick_room_code:
            last_id_parts = last_id.sick_room_code.split('-')
            if len(last_id_parts) >= 2:
                last_id_value = int(last_id_parts[1][-5:])
                new_id_value = last_id_value + 1   
                
                return int(str(self.created_date.strftime('%d%m%Y')) + str(new_id_value).zfill(5))
        
        return int(str(self.created_date.strftime('%d%m%Y')) + '00001')

    def save(self, *args, **kwargs):
        if not self.sick_room_code:
            generated_id = self.generate_id()
            self.sick_room_code = f"SICK-{generated_id}"
            super(agg_sc_citizen_sick_room_info, self).save(*args, **kwargs)

# ----------------------------------- END_Citizen_Sick_Room_Info -------------------------------------------------------------

# --------------------- Mohin ----------------------------------------------------------------------------------
# --------------------------------------------------------------------------------------------------------------


from django.db import models
# from django.db.models import Max
from django_enumfield import enum
from datetime import date
# Create your models here.
from django.db import models
from django_enumfield import enum

# Create your models here.

# ------------------------------------------------STATE ------------------------------------------------------------

# ------------------------------------------------ Immunization_Info ---------------------------------------------------------------
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
    
class agg_sc_citizen_immunization_info(models.Model):
    immunization_info_pk_id = models.AutoField(primary_key=True)
    immunization_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    name_of_vaccine = models.JSONField(null=True,blank=True)
    given_yes_no = models.CharField(max_length=555,null=True,blank=True)
    scheduled_date_from = models.CharField(max_length=555,null=True,blank=True)
    scheduled_date_to = models.CharField(max_length=555,null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='immunisation_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='immunisation_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    
    def save(self, *args, **kwargs):
        if not self.immunization_code:
            while True:
                last_id = agg_sc_citizen_immunization_info.objects.order_by('-immunization_code').first()
                if last_id:
                    last_id_value = int(last_id.immunization_code.split('-')[1][-4:])
                    new_id_value = last_id_value + 1
                else:
                    new_id_value = 1

                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
                self.immunization_code = f"IMMUN-{generated_id}"

                try:
                    super(agg_sc_citizen_immunization_info, self).save(*args, **kwargs)
                    break  # Break the loop if the save is successful
                except IntegrityError as e:
                    # Handle IntegrityError (duplicate key violation)
                    if 'duplicate key value violates unique constraint' in str(e):
                        # Retry the loop to generate a new immunization_code
                        continue
                    else:
                        raise e  # Re-raise other IntegrityError types
        else:
            super(agg_sc_citizen_immunization_info, self).save(*args, **kwargs)

   
# ------------------------------------------------ Vital_Info ---------------------------------------------------------------

class agg_sc_citizen_vital_info(models.Model):
    vital_info_pk_id=models.AutoField(primary_key=True)
    vital_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
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
    added_by =	models.ForeignKey('agg_com_colleague', related_name='vital_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='vital_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def save(self, *args, **kwargs):
        if not self.vital_code:
            last_id = agg_sc_citizen_vital_info.objects.order_by('-vital_code').first()
            if last_id and '-' in last_id.vital_code:
                last_id_value = int(last_id.vital_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.vital_code = f"VITAL-{generated_id}"

        super(agg_sc_citizen_vital_info, self).save(*args, **kwargs)

# ------------------------------------------------ END_Immunization_Info ---------------------------------------------------------------

# ------------------------------------------------ END_Vital_Info ---------------------------------------------------------------


# ------------------------------------------------ Screening_Info ---------------------------------------------------------------
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

class agg_sc_basic_screening_info(models.Model):
    basic_screening_pk_id = models.AutoField(primary_key=True)
    screening_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)

#--------------General Examination-------------------------#
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
    bad_habbits = models.JSONField(null=True,blank=True)
    observation= models.CharField(null=True,blank=True,max_length=5555)
#-------------------Systemic Exam----------------------#
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
    
    #----------------------Added as per Requirement----------------------------
    genito_urinary = models.CharField(max_length=255,null=True,blank=True)
    genito_urinary_comment = models.CharField(max_length=255,null=True,blank=True)
    discharge = models.CharField(max_length=255,null=True,blank=True)
    discharge_comment = models.CharField(max_length=255,null=True,blank=True)
    hydrocele = models.CharField(max_length=255,null=True,blank=True)
    cervical = models.CharField(max_length=255,null=True,blank=True)
    axilla = models.CharField(max_length=255,null=True,blank=True)
    inguinal = models.CharField(max_length=255,null=True,blank=True)
    thyroid =models.CharField(max_length=255,null=True,blank=True)
# -----------------------Female Screening-----------------------# 
    menarche_achieved = enum.EnumField(status,null=True,blank=True)
    date_of_menarche = models.DateField(null=True,blank=True)  
    age_of_menarche = models.IntegerField(null=True,blank=True)
    vaginal_descharge = enum.EnumField(status,null=True,blank=True) 
    flow = enum.EnumField(flow_status,null=True,blank=True)
    comments = models.CharField(max_length = 555,null=True,blank=True)
# -----------------------Disability Screening-----------------------#
    language_delay = models.ForeignKey('basic_information_language_delay', on_delete=models.CASCADE,null=True,blank=True)
    behavioural_disorder = models.ForeignKey('basic_information_behavioural_disorder', on_delete=models.CASCADE,null=True,blank=True)
    speech_screening = models.ForeignKey('basic_information_speech_screening', on_delete=models.CASCADE,null=True,blank=True)
    comment = models.CharField(max_length=255,null=True,blank=True)
#-----------------------Birth Defects-----------------------------#
    birth_defects = models.JSONField(null=True,blank=True)
#------------------------Childhood disease------------------------#
    childhood_disease = models.JSONField(null=True,blank=True)
#------------------------Deficiencies----------------------------#
    deficiencies = models.JSONField(null=True,blank=True)
#----------------------------Skin Condition-----------------------#
    skin_conditions = models.JSONField(null=True,blank=True)
#--------------------------Check box if normal---------------------# 
    check_box_if_normal  = models.JSONField(null=True,blank=True)
#-------------------------Diagnosis------------------------------#  
    diagnosis  = models.JSONField(null=True,blank=True)
#---------------------------Treatment---------------------------#
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
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='basic_screening_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='basic_screening_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


    def save(self, *args, **kwargs):
        if not self.screening_code:
            while True:
                last_id = agg_sc_basic_screening_info.objects.order_by('-screening_code').first()
                if last_id:
                    last_id_value = int(last_id.screening_code.split('-')[1][-4:])
                    new_id_value = last_id_value + 1
                else:
                    new_id_value = 1

                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
                self.screening_code = f"BASIC-{generated_id}"

                try:
                    super(agg_sc_basic_screening_info, self).save(*args, **kwargs)
                    break  # Break the loop if the save is successful
                except IntegrityError as e:
                    # Handle IntegrityError (duplicate key violation)
                    if 'duplicate key value violates unique constraint' in str(e):
                        # Retry the loop to generate a new screening_code
                        continue
                    else:
                        raise e  # Re-raise other IntegrityError types
        else:
            super(agg_sc_basic_screening_info, self).save(*args, **kwargs)

# ------------------------------------------------ END_Screening_Info ---------------------------------------------------------------

# ------------------------------------------------ Pycho_Info ---------------------------------------------------------------

class agg_sc_citizen_pycho_info(models.Model):
    pycho_pk_id = models.AutoField(primary_key=True)
    pycho_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    schedule_id = models.CharField(max_length=255,null=True,blank=True)
    citizen_id  = models.CharField(max_length=255,null=True,blank=True)
    schedule_count = models.IntegerField()
    diff_in_read = models.CharField(max_length=255,null=True,blank=True)
    diff_in_read_text = models.CharField(max_length=255,null=True,blank=True)
    diff_in_write = models.CharField(max_length=255,null=True,blank=True)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    diff_in_write_text = models.CharField(max_length=255,null=True,blank=True)
    hyper_reactive = models.CharField(max_length=255,null=True,blank=True)
    hyper_reactive_text = models.CharField(max_length=255,null=True,blank=True)
    aggresive = models.CharField(max_length=255,null=True,blank=True)
    aggresive_text = models.CharField(max_length=255,null=True,blank=True)
    urine_stool = models.CharField(max_length=255,null=True,blank=True)
    urine_stool_text = models.CharField(max_length=255,null=True,blank=True)
    peers = models.CharField(max_length=255,null=True,blank=True)
    peers_text = models.CharField(max_length=255,null=True,blank=True)
    poor_contact = models.CharField(max_length=255,null=True,blank=True)
    poor_contact_text = models.CharField(max_length=255,null=True,blank=True)
    scholastic = models.CharField(max_length=255,null=True,blank=True)
    scholastic_text = models.CharField(max_length=255,null=True,blank=True)
    any_other = models.CharField(max_length=255,null=True,blank=True)
    pycho_conditions = models.CharField(max_length=555,null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='pycho_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='pycho_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True) 
    

    def save(self, *args, **kwargs):
        if not self.pycho_code:
            last_id = agg_sc_citizen_pycho_info.objects.order_by('-pycho_code').first()
            if last_id and '-' in last_id.pycho_code:
                last_id_value = int(last_id.pycho_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.pycho_code = f"PYCHO-{generated_id}"

        super(agg_sc_citizen_pycho_info, self).save(*args, **kwargs)

# ------------------------------------------------ END_Pycho_Info ---------------------------------------------------------------

# ------------------------------------------------ BMI_Info ---------------------------------------------------------------

class agg_sc_citizen_bmi_info(models.Model):
    bmi_info_pk_id = models.AutoField(primary_key=True)
    bmi_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)


    citizens_pk_id = models.ForeignKey('agg_sc_add_new_citizens', on_delete=models.CASCADE)
    schedule_screening_pk_id  = models.ForeignKey('agg_sc_schedule_screening', on_delete=models.CASCADE)


    student_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    schedule_id_old = models.CharField(max_length=255)
    schedule_id = models.CharField(max_length=255)
    height = models.FloatField()
    weight = models.FloatField()
    bmi = models.FloatField()
    weight_fr_ht = models.CharField(max_length=255)
    weight_fr_age = models.CharField(max_length=255)
    height_fr_age = models.CharField(max_length=255)    
    arm_size = models.FloatField()
    note = models.CharField(max_length=255)
    general_exam = models.CharField(max_length=255)
    chief_complaint = models.IntegerField()
    symptoms = models.CharField(max_length=255)
    other_sign = models.CharField(max_length=255)
    stud_symptoms = models.CharField(max_length=255)
    remark = models.CharField(max_length=255)
    added_date = models.DateField()
    bmi_clg_id = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def generate_id(self):
        last_id = agg_sc_citizen_bmi_info.objects.filter(created_date=self.created_date).order_by('-bmi_code').first()
        if last_id and '-' in last_id.bmi_code:
            last_id_parts = last_id.bmi_code.split('-')
            if len(last_id_parts) >= 2:
                last_id_value = int(last_id_parts[1][-5:])
                new_id_value = last_id_value + 1   
                
                return int(str(self.created_date.strftime('%d%m%Y')) + str(new_id_value).zfill(5))
        
        return int(str(self.created_date.strftime('%d%m%Y')) + '00001')

    def save(self, *args, **kwargs):
        if not self.bmi_code:
            generated_id = self.generate_id()
            self.bmi_code = f"SC-{generated_id}"
            super(agg_sc_citizen_bmi_info, self).save(*args, **kwargs)

# ------------------------------------------------ END_BMI_Info ---------------------------------------------------------------

# ------------------------------------------------ Audit_Info ---------------------------------------------------------------

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
    
class agg_sc_citizen_audit_info(models.Model):
    audit_info_pk_id = models.AutoField(primary_key=True)
    audit_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    checkboxes = models.JSONField(null=True,blank=True)
    right = models.CharField(max_length=500,blank=True,null=True)
    left = models.CharField(max_length=500,blank=True,null=True)
    tratement_given = models.CharField(max_length=500,blank=True,null=True) 
    otoscopic_exam = models.CharField(max_length=500,blank=True,null=True)
    remark = models.CharField(max_length=500,blank=True,null=True)
    form_submit = models.BooleanField(default=False)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False,null=True)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='auditory_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='auditory_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    #----------------Corparate--------------------
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
    referred_hospital_list = models.CharField(max_length=255,null=True,blank=True)
    
    def save(self, *args, **kwargs):
        if not self.audit_code:
            last_id = agg_sc_citizen_audit_info.objects.order_by('-audit_code').first()
            if last_id and '-' in last_id.audit_code:
                last_id_value = int(last_id.audit_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.audit_code = f"AUDIT-{generated_id}"

        super(agg_sc_citizen_audit_info, self).save(*args, **kwargs)


    

# ------------------------------------------------ END_Audit_Info ---------------------------------------------------------------

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

    
    
# ___________ End Source ______________________

# ___________ added source ___________________
class agg_search_and_source_names(models.Model): 
    source_pk_id = models.AutoField(primary_key=True)
    search_source_code = models.CharField(max_length=1110, editable=False)
    created_date = models.DateField(default=timezone.now, editable=False)   

    source = models.CharField(max_length=255)
   
    is_deleted = models.CharField(max_length=10, choices=is_delete.choices)
     
    #_______________NEW FIELDS___________________
    added_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    modify_by = models.CharField(max_length=255)
    modified_at = models.DateTimeField(auto_now=True)

    def generate_id(self):
        last_id = agg_search_and_source_names.objects.filter(created_date=self.created_date).order_by('-search_source_code').first()
        if last_id and '-' in last_id.search_source_code:
            last_id_parts = last_id.search_source_code.split('-')
            if len(last_id_parts) >= 2:
                last_id_value = int(last_id_parts[1][-5:])
                new_id_value = last_id_value + 1   
                
                return int(str(self.created_date.strftime('%d%m%Y')) + str(new_id_value).zfill(5))
        
        return int(str(self.created_date.strftime('%d%m%Y')) + '00001')

    def save(self, *args, **kwargs):
        if not self.search_source_code:
            generated_id = self.generate_id()
            self.search_source_code = f"SERCSOUR-{generated_id}"
            super(agg_search_and_source_names, self).save(*args, **kwargs)
                     
         
    def __str__(self):
        return self.source
# ___________ added source ___________________

# ___________ Age Parameter  ___________________
class agg_age(models.Model): 
    age_pk_id = models.AutoField(primary_key=True)

    age = models.CharField(max_length=10)
    source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)
    source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE,null=True, blank=True)
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


    

#________________________ End Disease _________________________________


# _______________ Add New Source _______________________

class agg_sc_add_new_source(models.Model):
    source_pk_id = models.AutoField(primary_key=True)
    screening_source_code = models.CharField(max_length=20, editable=False,unique=True)
    # select_source = models.ForeignKey(agg_search_and_source_names, on_delete=models.CASCADE, null=True)
    source = models.ForeignKey('agg_source',on_delete=models.CASCADE)
    source_names = models.CharField(max_length=255)#unique=True
    registration_no = models.BigIntegerField()#unique=True
    mobile_no = models.CharField(max_length=20)
    email_id = models.EmailField()#unique=True
    # Registration_details = models.CharField(max_length=255,null=True)
    Registration_details = models.FileField(upload_to='media_files/', null=True, blank=True)

    source_state = models.ForeignKey('agg_sc_state',on_delete=models.CASCADE)
    source_district = models.ForeignKey('agg_sc_district',on_delete=models.CASCADE)
    source_taluka = models.ForeignKey('agg_sc_tahsil',on_delete=models.CASCADE)
    source_pincode = models.CharField(max_length=255)
    source_address = models.CharField(max_length=255)
    
    screening_vitals = models.JSONField(null=True)#New Field
    sub_screening_vitals = models.JSONField(null=True)#New Field


    #_______________NEW FIELDS___________________
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='added_screenings',on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modify_by =	models.ForeignKey('agg_com_colleague',related_name='modified_screenings',on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.source_names
       
    def save(self, *args, **kwargs):
        if not self.screening_source_code:
            last_id = agg_sc_add_new_source.objects.order_by('-source_pk_id').first()
            if last_id:
                last_id_value = int(last_id.screening_source_code.split('-')[1])
                new_id_value = last_id_value + 1
                generated_id = f"SI-{str(new_id_value).zfill(5)}"
            else:
                generated_id = f"SI-00001"

            self.screening_source_code = generated_id

        super(agg_sc_add_new_source, self).save(*args, **kwargs)


    
# _______________ End Add New Source _______________________

# ----------------------------------- Schedule_Screening -------------------------------------------------------------
class agg_sc_schedule_screening (models.Model):
    schedule_screening_pk_id = models.AutoField(primary_key=True)
    schedule_id = models.CharField(max_length=50, editable=False,unique=True)
    from_date = models.DateField()
    to_date = models.DateField()
    source = models.ForeignKey('agg_source', on_delete=models.CASCADE)
    source_name =  models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE)
    state = models.ForeignKey('agg_sc_state', on_delete=models.CASCADE)
    district = models.ForeignKey('agg_sc_district', on_delete=models.CASCADE)
    tehsil = models.ForeignKey('agg_sc_tahsil', on_delete=models.CASCADE)
    Disease = models.ForeignKey('agg_sc_disease', on_delete=models.CASCADE,blank=True,null=True)
    # type = models.ForeignKey('agg_sc_screening_for_type', on_delete=models.CASCADE,null=True, blank=True)
    # Class = models.ForeignKey('agg_sc_class', on_delete=models.CASCADE,blank=True, null=True)
    # department = models.ForeignKey('agg_sc_department', on_delete=models.CASCADE,blank=True, null=True)
    screening_person_name = models.CharField(max_length=255)
    mobile_number = models.BigIntegerField()
    #_______________NEW FIELDS___________________
    # screening_vitals = models.JSONField(null=True)
    # sub_screening_vitals = models.JSONField(null=True)
    
    # screening_vitals = models.JSONField(default=lambda: [1, 2, 3, 4, 5, 6, 8, 13, 14],null=True,blank=True)
    # sub_screening_vitals = models.JSONField(default=lambda: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],null=True,blank=True)
    
    
    created_at = models.DateField(default=timezone.now, editable=False)
    
    
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='screenings_added',on_delete=models.CASCADE, null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague',related_name='screenings_modified',on_delete=models.CASCADE, null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    location1 = models.CharField(max_length=255, null=True, blank=True)
    location2 = models.CharField(max_length=255, null=True, blank=True)
    location3 = models.CharField(max_length=255, null=True, blank=True)
    location4 = models.CharField(max_length=255, null=True, blank=True)
    # route = models.CharField(max_length=255, null=True, blank=True)
    # ambulance_no = models.CharField(max_length=255, null=True, blank=True)
    # pilot_name = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.schedule_id:
            last_id = agg_sc_schedule_screening.objects.order_by('-schedule_id').first()
    
            if last_id and '-' in last_id.schedule_id:
                last_id_value = int(last_id.schedule_id.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                # If last_id is None, initialize with a default value
                last_id = agg_sc_schedule_screening(schedule_id=f"SCHID-00000")
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')
    
            # Check if the generated_id already exists
            while agg_sc_schedule_screening.objects.filter(schedule_id=f"SCHID-{generated_id}").exists():
                new_id_value += 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
    
            self.schedule_id = f"SCHID-{generated_id}"
    
        super(agg_sc_schedule_screening, self).save(*args, **kwargs)
    
    
    
from django.db import IntegrityError

def save(self, *args, **kwargs):
    if not self.schedule_id:
        while True:
            last_id = agg_sc_schedule_screening.objects.order_by('-schedule_id').first()
            if last_id:
                last_id_value = int(last_id.schedule_id.split('-')[1][-4:])
                new_id_value = last_id_value + 1
            else:
                new_id_value = 1

            generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            self.schedule_id = f"SCHID-{generated_id}"

            try:
                super(agg_sc_schedule_screening, self).save(*args, **kwargs)
                break  # Break the loop if the save is successful
            except IntegrityError as e:
                # Handle IntegrityError (duplicate key violation)
                if 'duplicate key value violates unique constraint' in str(e):
                    # Retry the loop to generate a new schedule_id
                    continue
                else:
                    raise e  # Re-raise other IntegrityError types
    else:
        super(agg_sc_schedule_screening, self).save(*args, **kwargs)

# ----------------------------------- END_Schedule_Screening -------------------------------------------------------------

#____________________________________________________________________________________
#____________________________________________________________________________________
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



# ----------------------------------- Add_New_Citizen -------------------------------------------------------------


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


from django.db import models, IntegrityError, transaction
from django.utils import timezone

class agg_sc_add_new_citizens(models.Model):
# _______________________ ID's ______________________________________________
    citizens_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=50, editable=False,unique=True)
    created_date = models.DateField(default=timezone.now, editable=False)
# _______________________________ Relation _______________________________
    # schedule_screening_pk_id = models.ForeignKey('agg_sc_schedule_screening', on_delete=models.CASCADE)
# ________________________ Search_Fields ______________________________________
    age = models.ForeignKey('agg_age', on_delete=models.CASCADE,null=True, blank=True)
    gender = models.ForeignKey('agg_gender', on_delete=models.CASCADE,null=True, blank=True)
    source = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)
    type = models.ForeignKey('agg_sc_screening_for_type', on_delete=models.CASCADE,blank=True,null=True)
    disease = models.ForeignKey('agg_sc_disease', on_delete=models.CASCADE,blank=True,null=True)
#_________________________ CHILD DETAILS_______________________________________
    prefix = models.CharField(max_length=255,null=True,blank=True)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    blood_groups = models.CharField(max_length=255)
    year = models.CharField(max_length=12)
    months = models.CharField(max_length=12) 
    days = models.CharField(max_length=12)
    aadhar_id = models.CharField(max_length=12,null=True,blank=True)
    Class = models.ForeignKey('agg_sc_class', on_delete=models.CASCADE,blank=True,null=True)           
    division  = models.ForeignKey('agg_sc_division', on_delete=models.CASCADE,blank=True,null=True) 
    photo = models.FileField(upload_to='media_files/', null=True, blank=True)
#_____________FAMILY INFORMATION_____________
    father_name = models.CharField(max_length=255,blank=True,null=True)
    mother_name = models.CharField(max_length=255,blank=True,null=True)
    occupation_of_father = models.CharField(max_length=255,blank=True,null=True)
    occupation_of_mother = models.CharField(max_length=255,blank=True,null=True)
    parents_mobile = models.CharField(max_length=10,null=False)
    sibling_count = models.CharField(max_length=10,blank=True,null=True)
#___________ADDRESS_____________________________
    # soure = models.CharField(max_length=255)
    source_name = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE)
    state = models.ForeignKey('agg_sc_state', on_delete=models.CASCADE, blank=True, null=True)
    district = models.ForeignKey('agg_sc_district', on_delete=models.CASCADE,blank=True, null=True)
    tehsil =  models.ForeignKey('agg_sc_tahsil', on_delete=models.CASCADE,blank=True, null=True)
    pincode = models.CharField(max_length=255)
    address = models.CharField(max_length=255,null=True,blank=True)
    permanant_address = models.CharField(max_length=255,null=True,blank=True)
    location = models.CharField(max_length=255,null=True,blank=True)
#___________GROWTH MONITORING________________
    height = models.FloatField(blank=True,null=True)
    weight = models.FloatField(blank=True,null=True)
    weight_for_age = models.CharField(max_length=255, null=True,blank=True)
    height_for_age = models.CharField(max_length=255, null=True,blank=True)
    weight_for_height =models.CharField(max_length=50, blank=True,null=True)

    bmi = models.FloatField(blank=True, null=True)
    arm_size = models.IntegerField(blank=True, null=True)
    symptoms = models.CharField(max_length=255,blank=True, null=True)
    
    #-------------------------------Corporate----------------------------------
    department = models.ForeignKey('agg_sc_department',on_delete=models.CASCADE,blank=True,null=True)
    designation = models.ForeignKey('agg_sc_designation',on_delete=models.CASCADE,blank=True,null=True)
    employee_id  = models.CharField(max_length=255, null=True,blank=True)
    marital_status = models.CharField(max_length=255, null=True,blank=True)
    emp_mobile_no = models.CharField(max_length=10, null=True,blank=True)
    email_id = models.EmailField(null=True,blank=True)
    child_count = models.IntegerField(null=True,blank=True)
    spouse_name = models.CharField(max_length=255,null=True,blank=True)
    
    doj = models.DateField(null=True,blank=True)
    official_email = models.EmailField(null=True,blank=True)
    site_plant = models.CharField(max_length=500, null=True,blank=True)
    official_mobile =  models.CharField(max_length=10, null=True,blank=True) 
    #------------------------------Corporate-----------------------------------
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)#Mohin
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)#mohin
    #------------------------------Emergency Contact -----------------------------------
    emergency_prefix = models.CharField(max_length=255,null=True,blank=True)
    emergency_fullname = models.CharField(max_length=255,null=True,blank=True)
    emergency_gender = models.CharField(max_length=255,null=True,blank=True)
    emergency_contact = models.CharField(max_length=10, null=True,blank=True) 
    emergency_email = models.EmailField(null=True,blank=True)
    relationship_with_employee = models.CharField(max_length=255,null=True,blank=True)
    emergency_address = models.CharField(max_length=555,null=True,blank=True)
    

    # def save(self, *args, **kwargs):
    #     if not self.citizen_id:
    #         last_id = agg_sc_add_new_citizens.objects.order_by('-citizen_id').first()
    #         if last_id and '-' in last_id.citizen_id:
    #             last_id_value = int(last_id.citizen_id.split('-')[1][-4:])
    #             new_id_value = last_id_value + 1
    #             generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
    #         else:
    #             generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

    #         self.citizen_id = f"CITIZEN-{generated_id}"
        
    #     super(agg_sc_add_new_citizens, self).save(*args, **kwargs)
    
    # def save(self, *args, **kwargs):
    #     if not self.citizen_id:
    #         while True:
    #             last_id = agg_sc_add_new_citizens.objects.order_by('-citizen_id').first()
    #             if last_id:
    #                 last_id_value = int(last_id.citizen_id.split('-')[1][-4:])
    #                 new_id_value = last_id_value + 1
    #             else:
    #                 new_id_value = 1

    #             generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
    #             self.citizen_id = f"CITIZEN-{generated_id}"

    #             try:
    #                 super(agg_sc_add_new_citizens, self).save(*args, **kwargs)
    #                 break  # Break the loop if the save is successful
    #             except IntegrityError as e:
    #                 # Handle IntegrityError (duplicate key violation)
    #                 if 'duplicate key value violates unique constraint' in str(e):
    #                     # Retry the loop to generate a new citizen_id
    #                     continue
    #                 else:
    #                     raise e  # Re-raise other IntegrityError types
    #     else:
    #         super(agg_sc_add_new_citizens, self).save(*args, **kwargs)
    
    
    def generate_citizen_id(self):
        last_id = agg_sc_add_new_citizens.objects.order_by('-citizens_pk_id').first()
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


# ----------------------------------- END_Add_New_Citizen -------------------------------------------------------------


from django.db import models
from django.utils import timezone

class agg_sc_start_screening(models.Model):
    pk_id = models.AutoField(primary_key=True)
    screening_id = models.CharField(max_length=20,editable=False)
    citizen_id = models.ForeignKey(agg_sc_add_new_citizens, on_delete=models.CASCADE, to_field='citizen_id')
    citizen_name = models.CharField(max_length=255, blank=True)  # Add appropriate max_length
    citizen_mobile = models.CharField(max_length=10, blank=True)  # Add appropriate max_length
    schedule_id = models.ForeignKey(agg_sc_schedule_screening, on_delete=models.CASCADE, to_field='schedule_id')
    source_id = models.ForeignKey(agg_sc_add_new_source, on_delete=models.CASCADE, to_field='screening_source_code')
    created_date = models.DateTimeField(default=timezone.now, editable=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True, blank=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def generate_id(self):
        last_id = agg_sc_start_screening.objects.filter(created_date=self.created_date).order_by('-screening_id').first()
        if last_id:
            last_id_value = int(last_id.screening_id.split('-')[1][-4:])
            new_id_value = last_id_value + 1
            return int(str(self.created_date.strftime('%d%m%Y')) + str(new_id_value).zfill(5))
        else:
            return int(str(self.created_date.strftime('%d%m%Y')) + '00001')

    def save(self, *args, **kwargs):
        if not self.screening_id:
            generated_id = self.generate_id()
            self.screening_id = f"SS-{generated_id}"

            # Retrieve citizen details from the related agg_sc_add_new_citizens instance
            if self.citizen_id:
                self.citizen_name = self.citizen_id.name
                self.citizen_mobile = self.citizen_id.parents_mobile

            super(agg_sc_start_screening, self).save(*args, **kwargs)



from django.db import models
from django.utils import timezone

class GrowthMonitoring(models.Model):
    gender = models.CharField(max_length=255)
    dob = models.DateField()
    height = models.FloatField(null=False)
    weight = models.FloatField(null=False)
    weight_for_age = models.CharField(max_length=50, blank=True, null=True)
    height_for_age = models.CharField(max_length=50, blank=True, null=True)
    weight_for_height = models.CharField(max_length=50, blank=True, null=True)
    bmi = models.FloatField(blank=True, null=True)


class agg_sc_citizen_schedule(models.Model):
    pk_id = models.AutoField(primary_key=True)
    schedule_count = models.IntegerField(default=0)
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    added_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    modify_by = models.CharField(max_length=255)
    modified_at = models.DateTimeField(auto_now=True)
    closing_status = models.BooleanField(default=False)
    schedule_is_deleted = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            models.Index(fields=['citizen_id']),
            models.Index(fields=['schedule_count']),
            models.Index(fields=['citizen_pk_id']),
            models.Index(fields=['pk_id']),
    ]
    
    
class citizen_basic_info(models.Model):
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    # citizens_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    prefix = models.CharField(max_length=255,null=True,blank=True)
    name = models.CharField(max_length=255,null=True, blank=True)
    gender = models.CharField(max_length=255,null=True, blank=True)
    blood_groups = models.CharField(max_length=255,null=True, blank=True)
    dob = models.DateField()
    year = models.CharField(max_length=12)
    months = models.CharField(max_length=12)
    days = models.CharField(max_length=12)
    aadhar_id = models.CharField(max_length=12,null=True, blank=True)
    emp_mobile_no = models.CharField(max_length=10, null=True,blank=True)
    email_id = models.EmailField(null=True,blank=True)
    department = models.ForeignKey('agg_sc_department',on_delete=models.CASCADE,blank=True,null=True)
    designation = models.ForeignKey('agg_sc_designation',on_delete=models.CASCADE,blank=True,null=True)
    employee_id  = models.CharField(max_length=255, null=True,blank=True)
    doj = models.DateField(null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    # added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='basic_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    # modify_by =	models.IntegerField(null=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='basic_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
    
    
    
    
class agg_sc_citizen_family_info(models.Model):
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    # citizens_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    father_name = models.CharField(max_length=255,null=True,blank=True)
    mother_name = models.CharField(max_length=255,null=True,blank=True)
    occupation_of_father = models.CharField(max_length=255,null=True,blank=True)
    occupation_of_mother = models.CharField(max_length=255,null=True,blank=True)
    parents_mobile = models.CharField(max_length=12)
    sibling_count = models.CharField(max_length=10,null=True,blank=True)
    child_count = models.IntegerField(null=True,blank=True)
    spouse_name = models.CharField(max_length=255,null=True,blank=True)
    marital_status = models.CharField(max_length=255, null=True,blank=True)
    emergency_prefix = models.CharField(max_length=255,null=True,blank=True)
    emergency_fullname = models.CharField(max_length=255,null=True,blank=True)
    emergency_gender = models.CharField(max_length=255,null=True,blank=True)
    emergency_contact = models.CharField(max_length=10, null=True,blank=True) 
    emergency_email = models.EmailField(null=True,blank=True)
    relationship_with_employee = models.CharField(max_length=255,null=True,blank=True)
    emergency_address = models.CharField(max_length=555,null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='family_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='family_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_growth_monitoring_info(models.Model):
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE,null=True,blank=True)
    schedule_count = models.IntegerField()
    gender = models.CharField(max_length=255)
    dob = models.DateField(max_length=20)
    year = models.CharField(max_length=20)
    months = models.CharField(max_length=20)
    days = models.CharField(max_length=10)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    weight_for_age = models.CharField(max_length=50, blank=True, null=True)
    height_for_age = models.CharField(max_length=50, blank=True, null=True)
    weight_for_height = models.CharField(max_length=50, blank=True, null=True)
    bmi = models.FloatField(blank=True, null=True)
    arm_size = models.FloatField(blank=True, null=True)
    form_submit = models.BooleanField(default=False)
    symptoms_if_any = models.CharField(max_length=255,null=True, blank=True) 
    remark = models.CharField(max_length=555,null=True, blank=True)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='growth_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='growth_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    






# # 
# class WHO_BMI_bmifa_boys_and_girlfriend_z_5_19_years(models.Model):
#     bmi_id = models.FloatField()
#     birth_year = models.IntegerField()
#     birth_month = models.IntegerField()
#     minus_three_SD = models.FloatField()
#     minus_two_SD = models.FloatField()
#     minus_one_SD = models.FloatField()
#     one_SD = models.FloatField()
#     two_SD = models.FloatField()
#     three_SD = models.FloatField()    
#     gender = models.IntegerField()
#     class Meta:
#         db_table='WHO_BMI_bmifa_boys_and_girlfriend_z_5_19_years'
# # #

# # 
# class wt_for_age_0_to_10_boys_girlfriend(models.Model):
#     hfa_id = models.FloatField()
#     birth_year = models.IntegerField()
#     birth_month = models.IntegerField()
#     minus_three_SD = models.FloatField()
#     minus_two_SD = models.FloatField()
#     minus_one_SD = models.FloatField()
#     one_SD = models.FloatField()
#     two_SD = models.FloatField()
#     three_SD = models.FloatField()    
#     gender = models.IntegerField()
#     class Meta:
#         db_table='wt_for_age_0_to_10_boys_girlfriend'
# # #
        
#         # 
# class wt_for_ht_0_to_10_yrs_boys_girlfriend(models.Model):
#     wfh_id = models.FloatField()
#     From = models.FloatField()
#     to = models.FloatField()
#     minus_three_SD = models.FloatField()
#     minus_two_SD = models.FloatField()
#     minus_one_SD = models.FloatField()
#     one_SD = models.FloatField()
#     two_SD = models.FloatField()
#     three_SD = models.FloatField()
#     gender = models.IntegerField()
#     class Meta:
#         db_table='wt_for_ht_0_to_10_yrs_boys_girlfriend'
# # #
        
#         # 
# class ht_for_age_0_to_10_yrs_boys_girlfriend(models.Model):
#     hfa_id = models.FloatField()
#     birth_year = models.IntegerField()
#     birth_month = models.IntegerField()
#     minus_three_SD = models.FloatField()
#     minus_two_SD = models.FloatField()
#     minus_one_SD = models.FloatField()
#     one_SD = models.FloatField()
#     two_SD = models.FloatField()
#     three_SD = models.FloatField()
#     gender = models.IntegerField()
#     class Meta:
#         db_table='ht_for_age_0_to_10_yrs_boys_girlfriend'
# #
        







































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
    
    def create_user(self, clg_ref_id, clg_mobile_no ,grp_id , clg_email ,clg_gender ,clg_address , clg_state ,clg_district , clg_Date_of_birth, clg_source,clg_tahsil, clg_source_name,password=None,password2=None):# clg_first_name, clg_mid_name ,clg_last_name clg_is_loginclg_added_by ,clg_modify_by, clg_otp, clg_otp_count, clg_otp_expire_time,


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
            # clg_added_by = clg_added_by ,
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
    clg_source_name = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE,null=True, blank=True)#added By mohin
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

class  agg_sc_screening_for_type(models.Model):
    type_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=255)
    source = models.ForeignKey('agg_source',on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    
class agg_sc_class(models.Model):
    class_id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    

class agg_sc_division(models.Model):
    division_id = models.AutoField(primary_key=True)
    division_name = models.CharField(max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    added_by = models.IntegerField(blank=True, null=True)
    modify_by =	models.IntegerField(null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)



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


    

class agg_sc_medical_event_info(models.Model):
    medical_event_pk_id=models.AutoField(primary_key=True)
    medical_ev_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    citizen_id = models.CharField(max_length=255)
    schedule_id = models.CharField(max_length=255)
    # citizen_pk_id = models.ForeignKey('agg_sc_add_new_citizens', on_delete=models.CASCADE)
    symptoms_if_any = models.CharField(max_length=255,null=True, blank=True) 
    Remark = models.CharField(max_length=555,null=True, blank=True)
    transfer_o_hospital = models.BooleanField(default=False,blank=True,null=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def save(self, *args, **kwargs):
        if not self.medical_ev_code:
            last_id = agg_sc_medical_event_info.objects.order_by('-medical_ev_code').first()
            if last_id and '-' in last_id.medical_ev_code:
                last_id_value = int(last_id.medical_ev_code.split('-')[1][-4:])
                new_id_value = last_id_value + 1
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
            else:
                generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

            self.medical_ev_code = f"MediEV-{generated_id}"

        super(agg_sc_medical_event_info, self).save(*args, **kwargs)

          

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

class agg_sc_follow_up_citizen(models.Model):
    follow_up_ctzn_pk = models.AutoField(primary_key=True)
    vital_refer = models.IntegerField(blank=True,null=True)
    basic_screening_refer = models.IntegerField(blank=True,null=True)
    auditory_refer = models.IntegerField(blank=True,null=True)
    dental_refer = models.IntegerField(blank=True,null=True)
    dental_refer_hospital = models.CharField(max_length=255,blank=True,null=True)
    vision_refer = models.IntegerField(blank=True,null=True)
    pycho_refer = models.IntegerField(blank=True,null=True)
    reffered_to_sam_mam = models.IntegerField(blank=True,null=True) 
    weight_for_height = models.CharField(max_length=255,blank=True,null=True) 
    citizen_id = models.CharField(max_length=255)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE,null=True,blank=True) 
    schedule_id = models.CharField(max_length=255)
    follow_up = models.IntegerField(blank=True,null=True,default=2)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='followup_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='followup_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_follow_up_status(models.Model):
    followup_status_pk_id = models.AutoField(primary_key=True)
    followup_status = models.CharField(max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

class agg_sc_followup(models.Model):
    followup_id = models.AutoField(primary_key=True)
    followup_count = models.CharField(max_length=255,blank=True,null=True)
    citizen_id = models.CharField(max_length=255,blank=True,null=True)
    schedule_id = models.CharField(max_length=255,blank=True,null=True)
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
    follow_up_citizen_pk_id = models.ForeignKey('agg_sc_follow_up_citizen',on_delete=models.CASCADE, blank=True,null=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='followup_citizen_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='followup_citizen_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

class agg_sc_department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department = models.CharField(max_length=255)
    source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)
    source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE,null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_designation(models.Model):
    designation_id = models.AutoField(primary_key=True)
    designation = models.CharField(max_length=255)
    department_id = models.ForeignKey('agg_sc_department',on_delete=models.CASCADE)
    source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True, blank=True)
    source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE,null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(blank=True,null=True)
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


class agg_sc_citizen_medical_history(models.Model):
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    medical_history = models.JSONField(null=True,blank=True)
    past_operative_history = models.JSONField(null=True,blank=True)
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='medical_history_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='medical_history_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class agg_sc_investigation(models.Model):
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    
    investigation_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    urine_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    ecg_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    x_ray_report = models.FileField(upload_to='media_files/', null=True, blank=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='investigation_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='investigation_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_bad_habbits(models.Model):
    bad_habbits_pk_id = models.AutoField(primary_key=True)
    bad_habbits = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.IntegerField(blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.IntegerField(blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)



class agg_sc_pft(models.Model):
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    
    pft_reading = models.IntegerField(blank=True,null=True)
    observations = models.CharField(max_length=555,blank=True,null=True)
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='pft_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='pft_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)




class imported_data_from_excel_csv(models.Model):
    name = models.CharField(max_length=255,null=True,blank=True)
    emp_mobile_no = models.BigIntegerField(null=True,blank=True)
    address = models.CharField(max_length=255,null=True,blank=True)
    dob = models.DateField(null=True,blank=True)
    blood_groups = models.CharField(max_length=255,null=True,blank=True)
    prefix = models.CharField(max_length=255,null=True,blank=True)
    source_name = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE,null=True,blank=True)
    pincode = models.CharField(max_length=255,null=True,blank=True)
    permanant_address = models.CharField(max_length=255,null=True,blank=True)
    department = models.ForeignKey('agg_sc_department',on_delete=models.CASCADE,blank=True,null=True)
    designation = models.ForeignKey('agg_sc_designation',on_delete=models.CASCADE,blank=True,null=True)
    doj = models.DateField(null=True,blank=True)
    official_email = models.EmailField(null=True,blank=True)
    official_mobile =  models.CharField(max_length=10, null=True,blank=True) 
    employee_id  = models.CharField(max_length=255, null=True,blank=True)
    marital_status = models.CharField(max_length=255, null=True,blank=True)
    emp_mobile_no = models.CharField(max_length=10, null=True,blank=True)
    email_id = models.EmailField(null=True,blank=True)
    child_count = models.IntegerField(null=True,blank=True)
    spouse_name = models.CharField(max_length=255,null=True,blank=True)
    height = models.FloatField(blank=True,null=True)
    weight = models.FloatField(blank=True,null=True)
    emergency_prefix = models.CharField(max_length=255,null=True,blank=True)
    emergency_fullname = models.CharField(max_length=255,null=True,blank=True)
    emergency_gender = models.CharField(max_length=255,null=True,blank=True)
    emergency_contact = models.CharField(max_length=10, null=True,blank=True) 
    emergency_email = models.EmailField(null=True,blank=True)
    relationship_with_employee = models.CharField(max_length=255,null=True,blank=True)
    emergency_address = models.CharField(max_length=555,null=True,blank=True)
    age = models.ForeignKey('agg_age', on_delete=models.CASCADE,null=True,blank=True)
    gender = models.ForeignKey('agg_gender', on_delete=models.CASCADE,null=True,blank=True)
    source = models.ForeignKey('agg_source', on_delete=models.CASCADE,null=True,blank=True)
    type = models.ForeignKey('agg_sc_screening_for_type', on_delete=models.CASCADE,blank=True,null=True)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='aadded_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='mmodify_by', on_delete=models.CASCADE, blank=True,null=True)
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
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    

class anayalse_img_data_save_table(models.Model):
    anlyse_pk_id = models.AutoField(primary_key=True)
    schedule_id = models.CharField(max_length=255,null=True,blank=True)
    citizen_id  = models.CharField(max_length=255,null=True,blank=True)
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE,null=True,blank=True)
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
    
    
    
class agg_sc_location(models.Model):
    location_pk_id = models.AutoField(primary_key=True)
    location_name = models.CharField(max_length=255)
    source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE, null=True, blank=True)
    source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE, null=True, blank=True)
    state = models.ForeignKey('agg_sc_state', on_delete=models.CASCADE, null=True, blank=True)
    district = models.ForeignKey('agg_sc_district', on_delete=models.CASCADE, null=True, blank=True)
    tehsil = models.ForeignKey('agg_sc_tahsil', on_delete=models.CASCADE, null=True, blank=True)
    pincode = models.CharField(max_length=10, null=True, blank=True)
    address = models.CharField(max_length=500, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('agg_com_colleague', related_name='location_added_by', on_delete=models.CASCADE, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey('agg_com_colleague', related_name='location_modify_by', on_delete=models.CASCADE, blank=True, null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)


class agg_sc_route(models.Model):
    route_pk_id = models.AutoField(primary_key=True)
    route_name = models.CharField(max_length=255)
    source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE, null=True, blank=True)
    source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('agg_com_colleague', related_name='route_added_by', on_delete=models.CASCADE, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey('agg_com_colleague', related_name='route_modify_by', on_delete=models.CASCADE, blank=True, null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    


class agg_sc_doctor(models.Model):
    doc_id = models.AutoField(primary_key=True)
    doctor_name = models.CharField(max_length=255)
    # source_name = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE, null=True, blank=True)
    # source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE, null=True, blank=True)
    # route_id = models.ForeignKey('agg_sc_route', on_delete=models.CASCADE, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('agg_com_colleague', related_name='doctor_added_by', on_delete=models.CASCADE, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey('agg_com_colleague', related_name='doctor_modify_by', on_delete=models.CASCADE, blank=True, null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

class agg_sc_pilot(models.Model):
    pilot_pk_id = models.AutoField(primary_key=True)
    pilot_name = models.CharField(max_length=255)
    # source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE, null=True, blank=True)
    # source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE, null=True, blank=True)
    # route_id = models.ForeignKey('agg_sc_route', on_delete=models.CASCADE, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('agg_com_colleague', related_name='pilot_added_by', on_delete=models.CASCADE, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey('agg_com_colleague', related_name='pilot_modify_by', on_delete=models.CASCADE, blank=True, null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    

class agg_sc_ambulance(models.Model):
    amb_pk_id = models.AutoField(primary_key=True)
    ambulance_number = models.CharField(max_length=255)
    # source_id = models.ForeignKey('agg_source', on_delete=models.CASCADE, null=True, blank=True)
    # source_name_id = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE, null=True, blank=True)
    # route = models.ForeignKey('agg_sc_route', on_delete=models.CASCADE, null=True, blank=True)
    # pilot_name = models.ForeignKey('agg_sc_pilot', on_delete=models.CASCADE, null=True, blank=True)
    # doctor_id = models.ForeignKey('agg_sc_doctor', on_delete=models.CASCADE, null=True, blank=True)
    status = models.BooleanField(default=True)  
    is_deleted = models.BooleanField(default=False)
    added_by = models.ForeignKey('agg_com_colleague', related_name='ambulance_added_by', on_delete=models.CASCADE, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.ForeignKey('agg_com_colleague', related_name='ambulance_modify_by', on_delete=models.CASCADE, blank=True, null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)




class agg_sc_citizen_other_info(models.Model):
    pk_id=models.AutoField(primary_key=True)
    # vital_code = models.CharField(max_length=1110, editable=False) 
    created_date = models.DateField(default=timezone.now, editable=False)
    citizen_id = models.CharField(max_length=255) 
    schedule_id = models.CharField(max_length=255)
    schedule_count = models.IntegerField()
    citizen_pk_id = models.ForeignKey("agg_sc_add_new_citizens", on_delete=models.CASCADE)
    
    # 1. Footfall
    footfall = models.IntegerField(null=True, blank=True)
    footfall_refer = models.IntegerField(null=True, blank=True)

    # 2. Ante-Natal Care (ANC) Services
    anc_services = models.IntegerField(null=True, blank=True)
    anc_services_refer = models.IntegerField(null=True, blank=True)

    # 3. Iron Folic Acid (IFA) supplementation
    ifa_supplementation = models.IntegerField(null=True, blank=True)
    ifa_supplementation_refer = models.IntegerField(null=True, blank=True)

    # 4. High Risk Pregnancy
    high_risk_pregnancy = models.IntegerField(null=True, blank=True)
    high_risk_pregnancy_refer = models.IntegerField(null=True, blank=True)

    # 5. Post-Natal Care (PNC) Services
    pnc_services = models.IntegerField(null=True, blank=True)
    pnc_services_refer = models.IntegerField(null=True, blank=True)

    # 6. Leprosy
    leprosy = models.IntegerField(null=True, blank=True)
    leprosy_refer = models.IntegerField(null=True, blank=True)

    # 7. Tuberculosis (TB)
    tuberculosis = models.IntegerField(null=True, blank=True)
    tuberculosis_refer = models.IntegerField(null=True, blank=True)

    # 8. Sickle Cell Disease (SCD)
    scd = models.IntegerField(null=True, blank=True, verbose_name="Sickle Cell Disease (SCD)")
    scd_refer = models.IntegerField(null=True, blank=True)

    # 9. Hypertension
    hypertension = models.IntegerField(null=True, blank=True)
    hypertension_refer = models.IntegerField(null=True, blank=True)

    # 10. Diabetes
    diabetes = models.IntegerField(null=True, blank=True)
    diabetes_refer = models.IntegerField(null=True, blank=True)

    # 11. Anaemia
    anaemia = models.IntegerField(null=True, blank=True)
    anaemia_refer = models.IntegerField(null=True, blank=True)

    # 12. Cervical Cancer
    cervical_cancer = models.IntegerField(null=True, blank=True)
    cervical_cancer_refer = models.IntegerField(null=True, blank=True)

    # 13. Other health conditions/diseases
    other_conditions = models.IntegerField(null=True, blank=True)
    other_conditions_refer = models.IntegerField(null=True, blank=True)

    # 14. RDT tests for Malaria/Dengue
    malaria_dengue_rdt = models.IntegerField(null=True, blank=True)
    malaria_dengue_rdt_refer = models.IntegerField(null=True, blank=True)

    # 15. Diagnostic tests
    diagnostic_tests = models.IntegerField(null=True, blank=True)
    diagnostic_tests_refer = models.IntegerField(null=True, blank=True)

    # 16. Higher health facility
    higher_facility = models.IntegerField(null=True, blank=True)
    higher_facility_refer = models.IntegerField(null=True, blank=True)
    
    is_deleted = models.BooleanField(default=False)
    form_submit = models.BooleanField(default=False,null=True,blank=True)
    reffered_to_specialist = models.IntegerField(null=True, blank=True)
    added_by =	models.ForeignKey('agg_com_colleague', related_name='other_info_added_by',on_delete=models.CASCADE, blank=True,null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.ForeignKey('agg_com_colleague', related_name='other_info_modify_by', on_delete=models.CASCADE, blank=True,null=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    # def save(self, *args, **kwargs):
    #     if not self.vital_code:
    #         last_id = agg_sc_citizen_vital_info.objects.order_by('-vital_code').first()
    #         if last_id and '-' in last_id.vital_code:
    #             last_id_value = int(last_id.vital_code.split('-')[1][-4:])
    #             new_id_value = last_id_value + 1
    #             generated_id = int(str(timezone.now().strftime('%d%m%Y')) + str(new_id_value).zfill(5))
    #         else:
    #             generated_id = int(str(timezone.now().strftime('%d%m%Y')) + '00001')

    #         self.vital_code = f"VITAL-{generated_id}"

    #     super(agg_sc_citizen_vital_info, self).save(*args, **kwargs)
    
    
    

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




class Category(enum.Enum):
	Driver = 1
	Cleaner = 2

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
    category = enum.EnumField(Category, null=True,blank=True)
    aadhar_id = models.CharField(max_length=12,null=True,blank=True)
    mobile_no = models.BigIntegerField(null=True,blank=True)
    
#___________ADDRESS_____________________________
    source_name = models.ForeignKey('agg_sc_add_new_source', on_delete=models.CASCADE)
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
    added_by =	models.CharField(max_length=255,null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(max_length=255,null=True, blank=True)
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
    
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(max_length=255,null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(max_length=255,null=True, blank=True)
    modify_date = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.source_names
       
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
    added_by = models.CharField(max_length=255,null=True, blank=True)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by = models.CharField(max_length=255,null=True, blank=True)
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)







class growth_monitoring_info(models.Model):
    growth_pk_id = models.AutoField(primary_key=True)
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    gender = models.CharField(max_length=255,null=True, blank=True)
    
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
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_date = models.DateTimeField(auto_now_add=True)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)

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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
    
    
    
    
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)





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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)


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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    
    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)





    
    
    
    
    
    


class follow_up(models.Model):
    follow_up_pk_id = models.AutoField(primary_key=True)
    vital_refer = models.IntegerField(blank=True,null=True)
    basic_screening_refer = models.IntegerField(blank=True,null=True)
    auditory_refer = models.IntegerField(blank=True,null=True)
    dental_refer = models.IntegerField(blank=True,null=True)
    dental_refer_hospital = models.CharField(max_length=255,blank=True,null=True)
    vision_refer = models.IntegerField(blank=True,null=True)
    pycho_refer = models.IntegerField(blank=True,null=True)
    reffered_to_sam_mam = models.IntegerField(blank=True,null=True) 
    weight_for_height = models.CharField(max_length=255,blank=True,null=True) 
    
    
    citizen_id = models.CharField(max_length=255) 
    screening_count = models.IntegerField(null=True,blank=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
    screening_citizen_id = models.ForeignKey(Screening_citizen, on_delete=models.CASCADE, null=True,blank=True)
    
    # follow_up = models.IntegerField(blank=True,null=True,default=2)
    
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)





class followup_save(models.Model):
    followup_id = models.AutoField(primary_key=True)
    followup_count = models.CharField(max_length=255,blank=True,null=True)
    citizen_id = models.CharField(max_length=255,blank=True,null=True)
    citizen_pk_id = models.ForeignKey(Citizen, on_delete=models.CASCADE, null=True,blank=True)
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
    follow_up_citizen_pk_id = models.ForeignKey('agg_sc_follow_up_citizen',on_delete=models.CASCADE, blank=True,null=True)
    
    is_deleted = models.BooleanField(default=False)
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
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

    form_submit = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    added_by =	models.CharField(null=True, blank=True,max_length=255)
    added_date = models.DateTimeField(auto_now_add=True)
    modify_by =	models.CharField(null=True, blank=True,max_length=255)
    modify_date = models.DateTimeField(auto_now=True, null=True)
    
    
    
    




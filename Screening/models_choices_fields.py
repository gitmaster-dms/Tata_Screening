from django.db import models
from django_enumfield import enum
from django.utils import timezone
from django.core.validators import RegexValidator





class is_delete(models.TextChoices):
    NO = '1'
    YES = '0'

class Gender(models.TextChoices):
    MALE = 'MALE'
    FEMALE = 'FEMALE'
    OTHER = 'OTHER'

# class schedule_type(models.TextChoices):
#     Male = 'Male'
#     Female = 'Female'
    
class schedule_type(models.TextChoices):
    HS_Duty =  'HS Duty' 
    Screening =  'Screening'	

class schedule_ispresent(models.TextChoices):
    Absent= 'Absent' 
    Present = 'Present'    


class Siblings(models.TextChoices):
    Yes = 'Yes'
    No = 'NO'

class fwdshpm(models.TextChoices):
    Not_Forword = 'Not_Forword' 
    Forword = 'Forword'
	

class Approved(models.TextChoices):
    Apporval_Pending = 'Apporval_Pending'
    Apporval = 'Apporval'
    Not_Apporval = 'Not_Apporval'


# class Age_groups_CHOICES(models.TextChoices):
#     # ('0_TO_10', '0_TO_10'),
#     # ('10_TO_60', '10_TO_60'),
#     # ('60_TO_120', '60_TO_120'),
#     ZERO_TO_10     = 'ZERO_TO_10'
#     TEN_TO_60      = 'TEN_TO_60'
#     SIXTY_TO_120   = 'SIXTY_TO_120'

Age_groups_CHOICES = (
        ('0_TO_10', '0_TO_10'),
        ('10_TO_60', '10_TO_60'),
        ('60_TO_120', '60_TO_120'),
    )
    
# class Gender(enum.Enum):
#     MALE   = '0'
#     FEMALE = '1'
#     OTHER  = '2'
 
class Screening_Source(models.TextChoices):
    SCHOOL  = 'SCHOOL'
    CAMP    = 'CAMP'
    NGO     = 'NGO'
    SOCIETY = 'SOCIETY'


class Disease(models.TextChoices):
    COVID_19 = 'COVID_19'
    CANCER   = 'CANCER'
    HIV      = 'HIV'
    

Blood_groups_CHOICES = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    )
    
class Sibling_Count(models.TextChoices):

    ONE   = '1'
    TWO   = '2'
    THREE = '3'
    FOUR  = '4'
    FIVE  = '5'






    
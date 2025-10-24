# from django.contrib.auth.backends import ModelBackend
# from django.contrib.auth import get_user_model
# UserModel = get_user_model()

# class CustomBackend(ModelBackend):
    
#     def authenticate(self, request, clg_ref_id=None, clg_mobile_no=None, password=None, **kwargs):
#         try:
#             if clg_ref_id:
#                 print(f"Trying to authenticate with clg_ref_id: {clg_ref_id}")
#                 user = UserModel.objects.get(clg_ref_id=clg_ref_id)
#             elif clg_mobile_no:
#                 print(f"Trying to authenticate with clg_mobile_no: {clg_mobile_no}")
#                 user = UserModel.objects.get(clg_mobile_no=clg_mobile_no)
#             else:
#                 return None

#             if user.check_password(password):
#                 print("User authentication successful")
#                 return user
#             else:
#                 print("Password check failed")
#                 return None
#         except UserModel.DoesNotExist:
#             print("User does not exist")
#             return None


from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
import json
from django.http import JsonResponse
# ---------------------Login -----------------------------------------
from django.contrib.auth import authenticate
from Screening.renders import UserRenderer
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
import requests,random,pytz,io
from Tata_Screening.settings import AUTH_KEY
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from rest_framework import viewsets




#-----------------------------------------------jwt login and register api---------------------------

# Generate Token Manually
# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)
#     group = str(user.grp_id)
#     if group:
#             incs= agg_mas_group.objects.get(grp_id=group)
#             group = incs.grp_name
#     return {
#         "refresh" : str(refresh),
#         "access" : str(refresh.access_token),
#         "colleague": {
#                 'id': user.id,
#                 # 'first_name': user.clg_first_name,
#                 # 'last_name': user.clg_last_name,
#                 'email': user.clg_email,
#                 'phone_no': user.clg_mobile_no,
#                 # 'profile_photo_path':user.clg_profile_photo_path,
#                 'address':user.clg_address,
#                 # 'designation':user.clg_designation,
#                 'clg_group': group
#             },
#         "user_group" :group,
#     } 


#------------------new created by mayank------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    group = str(user.grp_id)
    if user.clg_source:
        clg_source_data = {
            'source_id': user.clg_source.source_pk_id,  
            'source': user.clg_source.source, 
            'source_name_id': user.clg_source_name.source_pk_id, 
            'source_name': user.clg_source_name.source_names, 
            'clg_state_id':user.clg_state.state_id,
            'clg_state':user.clg_state.state_name,
            'clg_district_id':user.clg_district.dist_id,
            'clg_district':user.clg_district.dist_name,
            'clg_tahsil_id':user.clg_tahsil.tal_id,
            'clg_tahsil':user.clg_tahsil.tahsil_name,
            
            
            
             
            
        }
    else:
        clg_source_data = None
    colleague_data = {
        'id': user.id,
        'name': user.clg_ref_id,
        'email': user.clg_email,
        'phone_no': user.clg_mobile_no,
        'address': user.clg_address,
        'clg_group': group,
        'clg_source': clg_source_data,
        
    }
    
    permissions_data = []
    if group:
        incs = agg_mas_group.objects.get(grp_id=group)
        pers = agg_save_permissions.objects.filter(role=group)
        group_name = incs.grp_name
        
        for permission in pers:
            permission_info = {
                'modules_submodule': permission.modules_submodule,
                'permission_status': permission.permission_status,
                # 'source_id': permission.source.source_pk_id,
                # 'source_name': permission.source.source,  
                'role_id': permission.role.grp_id,  
    }
            permissions_data.append(permission_info)
    else:
        group_name = None
    
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "colleague": colleague_data,
        "user_group": group_name,
        "permissions": permissions_data,
    }


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        username=request.data['clg_ref_id']
        try:
            is_exist = agg_com_colleague.objects.get(clg_ref_id=username)
            return Response({"error": "User is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)
        except agg_com_colleague.DoesNotExist:
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                token = get_tokens_for_user(user)
                print(token)
                return Response({'token':token,'msg':'Registration Successful'},status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

# class UserLoginView(APIView):
#     # renderer_classes = [UserRenderer]
#     def post(self, request, format=None):
#         serializer = UserLoginSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             clg_ref_id = serializer.data.get('clg_ref_id')
#             clg_mobile_no = serializer.data.get('clg_mobile_no')
#             password = serializer.data.get('password')
#             print(clg_ref_id,clg_mobile_no, password)
#             if clg_ref_id:
#                 user = authenticate(clg_ref_id=clg_ref_id, password=password)
#             else:
#                 user = authenticate(clg_mobile_no=clg_mobile_no, password=password)
#             print(user)
#             if user is not None:
#                 clg = agg_com_colleague.objects.get(clg_ref_id=user.clg_ref_id)
#                 if clg.clg_is_login == False:
#                     clg.clg_is_login = True
#                     clg.save()
#                     token = get_tokens_for_user(user)
#                     return Response({'token':token,'msg':'Logged in Successfully'},status=status.HTTP_200_OK)
#                 else:
#                     return Response({'msg':'User Already Logged In. Please check.'},status=status.HTTP_409_CONFLICT)
#             else:
#                 return Response({'errors':{'non_field_errors':['UserId or Password is not valid']}},status=status.HTTP_404_NOT_FOUND)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import authenticate

# class UserLoginView(APIView):
#     # renderer_classes = [UserRenderer]

#     def post(self, request, format=None):
#         serializer = UserLoginSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             clg_ref_id = serializer.data.get('clg_ref_id')
#             clg_mobile_no = serializer.data.get('clg_mobile_no')
#             password = serializer.data.get('password')

#             if clg_ref_id:
#                 user = authenticate(clg_ref_id=clg_ref_id, password=password)
#             else:
#                 user = authenticate(clg_mobile_no=clg_mobile_no, password=password)

#             if user is not None and not user.is_deleted:
#                 clg = agg_com_colleague.objects.get(clg_ref_id=user.clg_ref_id)
#                 if clg.clg_is_login is False:
#                     clg.clg_is_login = True
#                     clg.save()
#                     token = get_tokens_for_user(user)
#                     return Response({'token': token, 'msg': 'Logged in Successfully'}, status=status.HTTP_200_OK)
#                 else:
#                     return Response({'msg': 'User Already Logged In. Please check.'}, status=status.HTTP_409_CONFLICT)
#             else:
#                 return Response({'errors': {'non_field_errors': ['UserId or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            clg_ref_id = serializer.data.get('clg_ref_id')
            clg_mobile_no = serializer.data.get('clg_mobile_no')
            password = serializer.data.get('password')

            if clg_ref_id:
                user = authenticate(clg_ref_id=clg_ref_id, password=password)
            else:
                user = authenticate(clg_mobile_no=clg_mobile_no, password=password)

            if user is not None and not user.is_deleted:
                clg = agg_com_colleague.objects.get(clg_ref_id=user.clg_ref_id)
                if clg.clg_is_login is False:
                    clg.clg_is_login = True
                    clg.save()
                    token = get_tokens_for_user(user)
                    # Fetch registration details from agg_sc_add_new_source table
                    try:
                        registration_instance = agg_sc_add_new_source.objects.get(agg_com_colleague=user)
                        registration_serializer = add_new_source_Serializer(registration_instance)
                        registration_details = registration_serializer.data
                    except agg_sc_add_new_source.DoesNotExist:
                        registration_details = None

                    return Response({'token': token, 'msg': 'Logged in Successfully', 'registration_details': registration_details}, status=status.HTTP_200_OK)
                else:
                    return Response({'msg': 'User Already Logged In. Please check.'}, status=status.HTTP_409_CONFLICT)
            else:
                return Response({'errors': {'non_field_errors': ['UserId or Password is not valid']}}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#####--------------------------------------logout------------------------------------------#
class LogoutView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            clgid = request.data["clg_id"]
            int(clgid)
            clg = agg_com_colleague.objects.get(id=clgid)
            print("clg---- ", clg)
            clg.clg_is_login = False
            clg.save()
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'msg':'Token is blacklisted successfully.'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'msg':'Bad Request'},status=status.HTTP_400_BAD_REQUEST)
        
######--------------------------------Get API---------------------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def register_user_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        # Extract query parameters for filtering
        clg_source = request.query_params.get('clg_source')
        clg_source_name = request.query_params.get('clg_source_name')

        # Prepare filters dictionary
        filters = {'is_deleted': False}
        if clg_source:
            filters['clg_source'] = clg_source
        if clg_source_name:
            filters['clg_source_name'] = clg_source_name

        # Apply filters to the queryset
        snippets = agg_com_colleague.objects.filter(**filters).order_by('pk')
        serialized_data = []

        for snippet in snippets:
            group_name = ''  # Initialize group_name as an empty string

            if snippet.grp_id:  # Check if the snippet has a grp_id
                group = agg_mas_group.objects.get(pk=snippet.grp_id.pk)
                group_name = group.grp_name

            # Serialize the snippet data, including the group name
            serializer = UserRegistrationGETSerializer(snippet)
            data = serializer.data
            data['grp_name'] = group_name
            serialized_data.append(data)

        return Response(serialized_data)

    
    
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def register_user_get_info_ViewSet1_id_wise(request, pk):
    try:
        snippet = agg_com_colleague.objects.get(pk=pk, is_deleted=False)
    except agg_com_colleague.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserRegistrationGETSerializer(snippet)
    return Response(serializer.data)


####-----------------------------PUT API-------------------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def register_user_put_info_ViewSet1(request, pk):
    """ 
    update code snippet.
    """
    try:
        snippet = agg_com_colleague.objects.filter(is_deleted = False).get(pk=pk)
    except agg_com_colleague.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   
        serializer = UserRegistrationGETSerializer(snippet)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # plain_password = request.data['password']
        # hashed_password = make_password(plain_password)
        # print("++++++++", hashed_password, plain_password)
        # request.data['password'] = hashed_password
        # request.data['password2'] = hashed_password
        serializer = UserRegistrationPUTSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
#---------------------------Delete API-----------------------------------------------------#
@api_view(['GET', 'DELETE'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def register_user_delete_info_ViewSet1(request, pk, user_id):
    try:
        snippet = agg_com_colleague.objects.filter(is_deleted=False).get(pk=pk)
    except agg_com_colleague.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserRegistrationSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        # Soft delete the record by setting is_deleted to True
        colleague = get_object_or_404(agg_com_colleague, pk=user_id)
        snippet.clg_modify_by = colleague          
        snippet.is_deleted = True
        snippet.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
        
def send_otp(mobile,msg):
    url=(f"https://wa.chatmybot.in/gateway/waunofficial/v1/api/v1/sendmessage?access-token={AUTH_KEY}&phone={mobile}&content={msg}&fileName&caption&contentType=1")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
    except requests.exceptions.RequestException as e:
        print("Error occurred while hitting the URL:", e)
        

class ProfessionalOTPLogin(APIView):
    def post(self, request):
        try:
            number = request.data.get('phone_no')
            print("number",number)
            otp = str(random.randint(1000, 9999))
            otp_expire_time = timezone.now() + timezone.timedelta(minutes=10)
            msg = f"Use {otp} as your verification code on Spero Application. The OTP expires within 10 mins, {otp} Team Spero"
            professional_found = agg_com_colleague.objects.filter(clg_Work_phone_number=number).first()

            if number != None:

                if professional_found:
                    professional_found.clg_otp = otp
                    professional_found.clg_otp_count += 1
                    professional_found.clg_otp_expire_time = otp_expire_time
                    professional_found.save()
                    send_otp(number,msg)
                    # print("OTP for this is ", otp)
                    return Response({'phone_no': number, 'OTP': otp})
                else:              
                    return Response({"phone_no": " number not found "})
            else:
                return Response({'msg':'Phone number is not present. Please enter valid phone number.'},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)


class OTPCHECK(APIView):
    def post(self, request):
        try:
            number = request.data.get('phone_no')
            otp = request.data.get('otp')
            time = timezone.now()
            print("time", time)

            try:
                user_available = agg_com_colleague.objects.get(clg_Work_phone_number=number)
            except ObjectDoesNotExist:
                return Response({"message": 'User not found with this number'})
            if user_available.clg_otp == otp and user_available.clg_otp_expire_time > time:
                #token = get_tokens_for_user(user_available)
                #return Response({'token':token, "message": "change your password"})
                return Response({"message": "change your password"})
            else:
                return Response({"message": "Wrong OTP"})

        except Exception as e:
            return Response({"message": "An error occurred: {}".format(str(e))})
        
        


# -------------------------------------------------------------------------------------------------------------
#--------------------------------------------------------------------------------------------------------------



@api_view(['GET', 'POST'])
def agg_sc_add_new_citizens_ViewSet(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = agg_sc_add_new_citizens.objects.all()
        serializer = agg_sc_add_new_citizens_Serializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = agg_sc_add_new_citizens_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




# #__________________ADD NEW SOURCE (GET Method)_______________________#
# @api_view(['GET'])
# def agg_sc_add_new_source_get_info_ViewSet1(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets = agg_sc_add_new_source.objects.all()
#     serializer = add_new_source_Serializer(snippets, many=True)
#     return Response(serializer.data)

# #__________________END ADD NEW SOURCE (GET Method)_____________________#

# #__________________ADD NEW SOURCE (POST Method)________________________#
# @api_view(['POST'])
# def agg_sc_add_new_source_post_info_ViewSet1(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'POST'
#     serializer = add_new_source_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# #__________________END ADD NEW SOURCE (POST Method)_______________________#

# #__________________ADD NEW SOURCE (PUT/UPDATE Method)________________________#
# @api_view(['PUT'])
# def agg_sc_add_new_source_put_info_ViewSet1(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_sc_add_new_source.objects.get(pk=pk)
#     except agg_sc_add_new_source.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)


#     request.method == 'PUT'
#     serializer = add_new_source_Serializer(snippet, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #__________________END ADD NEW SOURCE (PUT Method)_______________________# 

# #__________________ADD NEW SOURCE (DELETE Method)_______________________# 
# @api_view(['DELETE'])
# def agg_sc_add_new_source_delete_info_ViewSet1(request, pk):
#     """ 
#     delete a code snippet.
#     """
#     try:
#         snippet = agg_sc_add_new_source.objects.get(pk=pk)
#     except agg_sc_add_new_source.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     request.method == 'DELETE'
#     snippet.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)

# #__________________END ADD NEW SOURCE (DELETE Method)_______________________# 








# agg_state_district_taluka_serializer

#  __________ Final ___________________

@api_view(['GET', 'POST'])
def agg_sc_add_new_source_ViewSet(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = agg_sc_add_new_source.objects.all()
        serializer = agg_sc_add_new_source_Serializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = agg_sc_add_new_source_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

    

# _____________________ State __________________________________
# # _____________________ GET State ______________________________
# @api_view(['GET'])
# def agg_ind_state_ViewSet_GET(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets =  agg_ind_state.objects.all()
#     serializer = agg_ind_state_Serializer(snippets, many=True)
#     return Response(serializer.data)
# # _____________________ GET State ______________________________
# # _____________________ POST State ______________________________
# @api_view(['POST'])
# def agg_ind_state_ViewSet_POST(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'POST'
#     serializer = agg_ind_state_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # _____________________ End POST (POST Method) ______________________________
# #__________________ State (PUT/UPDATE Method) ________________________#
# @api_view(['GET', 'PUT'])
# def agg_ind_state_ViewSet_PUT(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_ind_state.objects.get(pk=pk)
#     except agg_ind_state.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':   
#         serializer = agg_mh_taluka_Serializer(snippet)
#         return Response(serializer.data)
    
#     elif request.method == 'PUT':
#         serializer = agg_ind_state_Serializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #__________________ END State (PUT Method) _______________________# 

# #__________________ State (DELETE Method)_______________________# 
# @api_view(['GET', 'DELETE'])
# def agg_ind_state_ViewSet_DELETE(request, pk):
#     """ 
#     delete a code snippet.
#     """
#     try:
#         snippet = agg_ind_state.objects.get(pk=pk)
#     except agg_ind_state.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':   
#         serializer = agg_ind_state_Serializer(snippet)
#         return Response(serializer.data)
    
#     elif request.method == 'DELETE':
#         snippet.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

# #__________________ End State (DELETE Method)_______________________# 
# # _____________________ End State __________________________________

# # _____________________ Taluka __________________________________
# # _____________________ Taluka (GET Method) ______________________________
# @api_view(['GET'])
# def agg_mh_taluka_ViewSet_GET(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets =  agg_mh_taluka.objects.all()
#     serializer = agg_mh_taluka_Serializer(snippets, many=True)
#     return Response(serializer.data)
# # _____________________ End Taluka (GET Method) ______________________________
# # _____________________ POST Taluka (POST Method) ______________________________
# @api_view(['POST'])
# def agg_mh_taluka_ViewSet_POST(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'POST'
#     serializer = agg_mh_taluka_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # _____________________ POST Taluka (POST Method) ______________________________
# #__________________ Taluka (PUT/UPDATE Method) ________________________#
# @api_view(['GET', 'PUT'])
# def agg_mh_taluka_ViewSet_PUT(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_mh_taluka.objects.get(pk=pk)
#     except agg_mh_taluka.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':   
#         serializer = agg_mh_taluka_Serializer(snippet)
#         return Response(serializer.data)

#     elif request.method == 'PUT':        
#         serializer = agg_mh_taluka_Serializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #__________________ END Taluka (PUT Method) _______________________# 

# #__________________ Taluka (DELETE Method)_______________________# 
# @api_view(['GET', 'DELETE'])
# def agg_mh_taluka_ViewSet_DELETE(request, pk):
#     """ 
#     delete a code snippet.
#     """
#     try:
#         snippet = agg_mh_taluka.objects.get(pk=pk)
#     except agg_mh_taluka.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':   
#         serializer = agg_mh_taluka_Serializer(snippet)
#         return Response(serializer.data)
    
#     elif request.method == 'DELETE':
#         snippet.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

# #__________________ Taluka (DELETE Method)_______________________# 
# # _____________________ End Taluka __________________________________

# # _____________________ District __________________________________
# # _____________________ District (GET Method) ______________________________
# @api_view(['GET'])
# def agg_mh_district_ViewSet_GET(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets =  agg_mh_district.objects.all()
#     serializer = agg_mh_district_Serializer(snippets, many=True)
#     return Response(serializer.data)
# # _____________________ End Taluka (GET Method) ______________________________
# # _____________________ POST Taluka (POST Method) ______________________________
# @api_view(['POST'])
# def agg_mh_district_ViewSet_POST(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'POST'
#     serializer = agg_mh_district_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # _____________________ POST District (POST Method) ______________________________
# #__________________ District (PUT/UPDATE Method) ________________________#
# @api_view(['GET', 'PUT'])
# def agg_mh_district_ViewSet_PUT(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_mh_district.objects.get(pk=pk)
#     except agg_mh_district.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':   
#         serializer = agg_mh_district_Serializer(snippet)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = agg_mh_district_Serializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #__________________ END District (PUT Method) _______________________# 

# #__________________ District (DELETE Method)_______________________# 
# @api_view(['GET', 'DELETE'])
# def agg_mh_district_ViewSet_DELETE(request, pk):
#     """ 
#     delete a code snippet.
#     """
#     try:
#         snippet = agg_mh_district.objects.get(pk=pk)
#     except agg_mh_district.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':   
#         serializer = agg_mh_district_Serializer(snippet)
#         return Response(serializer.data)
    
#     elif request.method == 'DELETE':
#         snippet.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
# #__________________ District (DELETE Method)_______________________# 

# # ________________ State - District - Taluka __________________
# @api_view(['GET'])
# def agg_state_district_taluka_ViewSet_GET(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets =  agg_mh_taluka.objects.all()
#     serializer = agg_state_district_taluka_serializer(snippets, many=True)
#     return Response(serializer.data)

# # # ________________ End State - District - Taluka __________________
# _____________________ End District __________________________________

# ___________________ Age _____________________________
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_age_ViewSet_GET(request):
    """
    List all agg_age objects, optionally filtered by source_id and source_name_id.
    """
    source_id = request.query_params.get('source_id', None)
    source_name_id = request.query_params.get('source_name_id', None)

    snippets = agg_age.objects.all()

    if source_id is not None:
        snippets = snippets.filter(source_id=source_id)
    if source_name_id is not None:
        snippets = snippets.filter(source_name_id=source_name_id)

    snippets = snippets.order_by('age')
    serializer = agg_age_Serializer(snippets, many=True)
    return Response(serializer.data)

# ___________________ End Age _____________________________

# ___________________ Gender _____________________________
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_gender_ViewSet_GET(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets =  agg_gender.objects.all()
    serializer = agg_gender_Serializer(snippets, many=True)
    return Response(serializer.data)
# ___________________ End Gender _____________________________

#______________________DISEASE INFO (GET METHOD)_______________________________
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_get_disease_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_disease.objects.all().order_by('disease')
    serializer = agg_sc_disease_info_Serializer(snippets, many=True)
    return Response(serializer.data)
#______________________END DISEASE INFO (GET METHOD)_______________________________

# _____________________ Source __________________________________

# _____________________ Source (GET Method) ______________________________
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_source_ViewSet_GET(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        source_pk_id = request.query_params.get('source_pk_id')
        
        filters = {'is_deleted': False}
        if source_pk_id:
            filters['source_pk_id'] = source_pk_id

        snippets = agg_source.objects.filter(**filters).order_by('source')
        
        serializer = agg_source_Serializer(snippets, many=True)
        
        return Response(serializer.data)


# _____________________ End Source (GET Method) ______________________________

# ____________________________ Source District Get ________________________________________
# Get Source Form Source Name
class Source_SourceName_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, SourceN, formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source=SourceN, is_deleted=False).order_by('source', 'source_names')
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, SourceN):
        state_obj = self.get_object(SourceN)
        serialized = source_SourceName_Serializer(state_obj, many=True)
        return Response(serialized.data)


class Source_state_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, sour, formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source=sour, is_deleted=False).order_by('source', 'source_names', 'source_state', )
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, sour):
        state_obj = self.get_object(sour)
        serialized = source_State_Serializer4(state_obj, many=True)
        return Response(serialized.data)

# @api_view(['GET'])
# def source_district_ViewSet_GET(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets =  agg_sc_add_new_source.objects.all()
#     serializer = agg_sc_add_new_source_source_district_Serializer1(snippets, many=True)
#     return Response(serializer.data)


# Get Add New Source under State - Source, Source Name, State, District 
class Source_state_district_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, stat, formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source_state=stat, is_deleted=False).order_by('source', 'source_names', 'source_state', 'source_district')
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, stat):
        state_obj = self.get_object(stat)
        serialized = agg_sc_add_new_source_source_district_Serializer1(
            state_obj, many=True)
        return Response(serialized.data)

# Get Add New Source under District - Source, Source Name, State, District
class district_Source_name_and_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, sour_dis, formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source_district=sour_dis, is_deleted=False).order_by('source', 'source_names',  'source_state', 'source_district')
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, sour_dis):
        state_obj = self.get_object(sour_dis)
        serialized = agg_sc_add_new_source_source_district_Serializer2(
            state_obj, many=True)
        return Response(serialized.data)

# Get Add New Source District- Source, Source Name, State, District, Taluka  [District to Source Name ]


class district_taluka_Source_name_and_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, sour_dis,So ,formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source=So,source_district=sour_dis, is_deleted=False).order_by('source_district', 'source_state','source_taluka', 'source', 'source_names')
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, sour_dis, So):
        state_obj = self.get_object(sour_dis,So)
        serialized = agg_sc_add_new_source_source_district_Serializer5(
            state_obj, many=True)
        return Response(serialized.data)

class taluka_Source_name_and_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, So, St , Di, Tal, formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source=So, source_state=St, source_district=Di, source_taluka=Tal, is_deleted=False).order_by('source_names')
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, So, St , Di, Tal):
        state_obj = self.get_object(So, St , Di, Tal)
        serialized = taluka_to_source_name_Serializer(state_obj, many=True)
        return Response(serialized.data)

# Get Add New Source - Source, Source Name, State, District, Taluka 
class Source_name_and_district_and_source_ViewSet_GET(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, sour, formate=None):
        try:
            return agg_sc_add_new_source.objects.filter(source=sour, is_deleted=False).order_by('source_district')
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, sour):
        state_obj = self.get_object(sour)
        serialized = agg_sc_add_new_source_source_district_Serializer3(
            state_obj, many=True)
        return Response(serialized.data)



class source_from_id_state_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, STid):
        try:
            state_records = agg_sc_add_new_source.objects.filter(source=STid, is_deleted=False).order_by('source_state')
            unique_states = {}
            for record in state_records:
                state_name = record.source_state
                if state_name not in unique_states:
                    unique_states[state_name] = record
            return list(unique_states.values())
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)        
    def get(self, request, STid):
        state_obj = self.get_object(STid)
        serialized = source_from_id_state_api_Serializer(state_obj, many=True)
        return Response(serialized.data)

# class source_from_id_state_api(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Retrieve the query parameters
#         source_state_id = request.query_params.get('STid')
#         source_pk_id = request.query_params.get('source_pk_id')
#         source = request.query_params.get('source')

#         # Create the filters dictionary
#         filters = {'is_deleted': False}
#         if source_state_id:
#             filters['source_state_id'] = source_state_id  # Assuming STid corresponds to the source_state field
#         if source_pk_id:
#             filters['source_pk_id'] = source_pk_id
#         if source:
#             filters['source_id'] = source

#         # Apply the filters
#         state_records = agg_sc_add_new_source.objects.filter(**filters).order_by('source_state')

#         # Get unique state records
#         unique_states = {}
#         for record in state_records:
#             state_name = record.source_state
#             if state_name not in unique_states:
#                 unique_states[state_name] = record

#         # Serialize the data
#         state_obj = list(unique_states.values())
#         serialized = source_from_id_state_api_Serializer(state_obj, many=True)

#         return Response(serialized.data)



class state_from_id_district_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, DIid, So):
        try:
            # Filter records based on both source and source_state
            district_records = agg_sc_add_new_source.objects.filter(source=So, source_state=DIid, is_deleted=False).order_by('source_district')
            unique_district = {}
            for record1 in district_records:
                district_name = record1.source_district
                if district_name not in unique_district:
                    unique_district[district_name] = record1
            return list(unique_district.values())
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, DIid, So):
        state_obj = self.get_object(DIid, So)
        serialized = source_state_from_id_district_api_Serializer(state_obj, many=True)
        return Response(serialized.data)


class district_from_id_taluka_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, TLid,So):
        try:
            district_records = agg_sc_add_new_source.objects.filter(source=So,source_district=TLid, is_deleted=False).order_by('source_taluka' )
            unique_taluka = {}
            for record1 in district_records:
                taluka_name = record1.source_taluka
                if taluka_name not in unique_taluka:
                    unique_taluka[taluka_name] = record1
            return list(unique_taluka.values())
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, TLid,So):
        state_obj = self.get_object(TLid,So)
        serialized = source_state_district_from_id_taluka_api_Serializer(state_obj, many=True)
        return Response(serialized.data)

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import agg_sc_add_new_source
# from .serializers import taluka_from_id_SourceName_api_Serializer

# class taluka_from_id_SourceName_api(APIView):
#     def get_object(self, SNid, So, source_pk_id):
#         try:
#             sourceName_records = agg_sc_add_new_source.objects.filter(
#                 source=So,
#                 source_taluka=SNid,
#                 source_pk_id=source_pk_id,
#                 is_deleted=False
#             ).order_by('source_names')
            
#             unique_sourceName = {}
#             for record1 in sourceName_records:
#                 sourceName_name = record1.source_names
#                 if sourceName_name not in unique_sourceName:
#                     unique_sourceName[sourceName_name] = record1
#             return list(unique_sourceName.values())
#         except agg_sc_add_new_source.DoesNotExist:
#             raise Response(status=status.HTTP_404_NOT_FOUND)

#     def get(self, request, SNid, So, source_pk_id):
#         state_obj = self.get_object(SNid, So, source_pk_id)
#         serialized = taluka_from_id_SourceName_api_Serializer(state_obj, many=True)
#         return Response(serialized.data)




class taluka_from_id_SourceName_api(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        SNid = request.query_params.get('SNid')
        So = request.query_params.get('So')
        source_pk_id = request.query_params.get('source_pk_id')

        filters = {'is_deleted': False}
        if SNid is not None:
            filters['source_taluka'] = SNid
        if So is not None:
            filters['source'] = So
        if source_pk_id is not None:
            filters['source_pk_id'] = source_pk_id

        sourceName_records = agg_sc_add_new_source.objects.filter(**filters).order_by('source_names')
        
        unique_sourceName = {}
        for record1 in sourceName_records:
            sourceName_name = record1.source_names
            if sourceName_name not in unique_sourceName:
                unique_sourceName[sourceName_name] = record1
        state_obj = list(unique_sourceName.values())

        serialized = taluka_from_id_SourceName_api_Serializer(state_obj, many=True)
        return Response(serialized.data)



class source_name_from_taluka_api(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        # snippet = agg_sc_add_new_source.objects.filter(is_deleted=False)
        snippet = agg_sc_add_new_source.objects.all()

        serializers = source_name_from_tahsil_Serializers(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)









class district_from_id_SourceName_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self, DSid):
        try:
            sourceName_records = agg_sc_add_new_source.objects.filter(source_district=DSid, is_deleted=False).order_by('source_names')
            unique_sourceName = {}
            for record1 in sourceName_records:
                sourceName_name = record1.source_names
                if sourceName_name not in unique_sourceName:
                    unique_sourceName[sourceName_name] = record1
            return list(unique_sourceName.values())
        except agg_sc_add_new_source.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, DSid):
        state_obj = self.get_object(DSid)
        serialized = district_from_id_SourceName_api_Serializer(state_obj, many=True)
        return Response(serialized.data)

# ____________________________ End Source District Get ________________________________________

# _____________________ POST Source (POST Method) ______________________________


@api_view(['POST'])
def agg_source_ViewSet_POST(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'POST'
    serializer = agg_source_Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# _____________________ POST Source (POST Method) ______________________________
# __________________ Source (PUT/UPDATE Method) ________________________#

# _____________________ POST Source (POST Method) ______________________________
@api_view(['POST'])
def agg_source_ViewSet_POST(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'POST'
    serializer = agg_source_Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# _____________________ POST Source (POST Method) ______________________________
#__________________ Source (PUT/UPDATE Method) ________________________#
@api_view(['GET', 'PUT'])
def agg_source_ViewSet_PUT(request, pk):
    """ 
    update code snippet.
    """
    try:
        snippet = agg_source.objects.get(pk=pk)
    except agg_source.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':   
        serializer = agg_source_Serializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = agg_source_Serializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#__________________ END Source (PUT Method) _______________________# 
#__________________ Source (DELETE Method)_______________________# 
@api_view(['GET', 'DELETE'])
def agg_source_ViewSet_DELETE(request, pk):
    """ 
    delete a code snippet.
    """
    try:
        snippet = agg_source.objects.get(pk=pk)
    except agg_source.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':   
        serializer = agg_source_Serializer(snippet)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        snippet.delete()
        return Response( status=status.HTTP_204_NO_CONTENT)

#__________________ Source (DELETE Method)_______________________# 

# _____________________ Source Source Name (GET Method) ______________________________
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def source_name_ViewSet_GET(request):
    """
    List all code snippets, or create a new snippet.
    """
    source_pk_id = request.query_params.get('source_pk_id')

    # Create the filters dictionary
    filters = {'is_deleted': False}
    if source_pk_id:
        filters['source_pk_id'] = source_pk_id

    snippets = agg_source.objects.filter(**filters).order_by('source')
    serializer = agg_sc_source_source_name_Serializer(snippets, many=True)
    return Response(serializer.data)
# _____________________ End Source Source Name (GET Method) ______________________________

# _____________________ End Source __________________________________


# _____________________ Add New Source __________________________________
# _____________________ Add New Source (GET Method) ______________________________
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_source_ViewSet_GET(request):
    """
    List all code snippets, or create a new snippet.
    """
    # Getting query parameters from the URL
    source_pk_id = request.query_params.get('source_pk_id')
    source = request.query_params.get('source')
    
    # Prepare kwargs for filtering
    filters = {'is_deleted': False}
    if source_pk_id:
        filters['source_pk_id'] = source_pk_id
    if source:
        filters['source'] = source
    
    # Filtering the queryset based on the parameters
    snippets = agg_sc_add_new_source.objects.filter(**filters).order_by('source_pk_id', 'source')
    
    # Serializing the filtered data
    serializer = agg_sc_add_GET_new_source_Serializer(snippets, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_source_ViewSet_GET_ID_WISE(request, pk):
    try:
        snippet = agg_sc_add_new_source.objects.get(pk=pk, is_deleted=False)
    except agg_sc_add_new_source.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = agg_sc_add_GET_new_source_Serializer(snippet)
    return Response(serializer.data)

# _____________________ End Add New Source (GET Method) ______________________________
# _____________________ POST Add New Source (POST Method) ______________________________
# @api_view(['POST'])
# def agg_sc_add_new_source_ViewSet_POST(request):
#     """
#     List all code snippets, or create a new snippet.
#     """

#     request.method == 'POST'
#     serializer = agg_sc_add_new_source_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_source_ViewSet_POST(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'POST':
        regi = request.data.get('registration_no')
        mobile_number = request.data.get('mobile_no')
        email = request.data.get('email_id')

        # Check if any of the fields already exist
        existing_registration = agg_sc_add_new_source.objects.filter(registration_no=regi).exists()
        existing_mobile = agg_sc_add_new_source.objects.filter(mobile_no=mobile_number).exists()
        existing_email = agg_sc_add_new_source.objects.filter(email_id=email).exists()

        if existing_registration or existing_mobile or existing_email:
            return Response({"error": "Source is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)

        serializer = agg_sc_add_new_source_POST_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# _____________________ POST Add New Source (POST Method) ______________________________
#__________________ Add New Source (PUT/UPDATE Method) ________________________#
@api_view(['GET','PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_source_ViewSet_PUT(request, pk):
    """
    update code snippet.
    """
    try:
        snippet = agg_sc_add_new_source.objects.get(pk=pk)
    except agg_sc_add_new_source.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':   
        serializer = agg_sc_add_GET_new_source_Serializer(snippet)
        return Response(serializer.data)


    elif request.method == 'PUT':
        serializer = agg_sc_add_new_source_PUT_Serializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#__________________ END Add New Source (PUT Method) _______________________# 
#__________________ Add New Source (DELETE Method)_______________________# 
@api_view(['GET', 'DELETE'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_source_ViewSet_DELETE(request, pk, user_id):
    """ 
    delete a code snippet.
    """
    try:
        snippet = agg_sc_add_new_source.objects.filter(is_deleted=False).get(pk=pk)
    except agg_sc_add_new_source.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':   
        serializer = agg_sc_add_GET_new_source_Serializer(snippet)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        # Soft delete the record by setting is_deleted to True
        colleague = get_object_or_404(agg_com_colleague, pk=user_id)
        snippet.modify_by = colleague          
        snippet.is_deleted = True
        snippet.save()
        return Response({'message': 'Source is closed.'}, status=status.HTTP_204_NO_CONTENT)

# _________________ Add New Citizen _______________________________________
# __________________ADD NEW CITIZEN (GET Method)____________
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_citizen_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    snippets = agg_sc_add_new_citizens.objects.filter(is_deleted=False).order_by('citizens_pk_id').order_by('-modify_date', '-added_date')
    serializer = CitizenDataGetSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_citizen_put_info_ViewSet1(request, pk):
    """ 
    Update code snippet.
    """
    try:
        snippet = agg_sc_add_new_citizens.objects.get(pk=pk)
    except agg_sc_add_new_citizens.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = agg_sc_add_new_citizens_get_Serializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Check if aadhar_id already exists
        # new_aadhar_id = request.data.get('aadhar_id')
        # existing_snippet = agg_sc_add_new_citizens.objects.exclude(pk=pk).filter(aadhar_id=new_aadhar_id)
        # if existing_snippet.exists():
        #     return Response({'detail': 'Aadhar ID already exists'}, status=status.HTTP_409_CONFLICT)

        # Proceed with updating the snippet
        serializer = agg_sc_add_new_citizens_PUT_Serializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#__________________END ADD NEW CITIZEN (PUT Method)_______________________# 

#__________________ADD NEW CITIZEN (DELETE Method)_______________________# 
@api_view(['GET', 'DELETE'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_citizen_delete_info_ViewSet1(request, pk, user_id):
    try:
        snippet = agg_sc_add_new_citizens.objects.filter(is_deleted=False).get(pk=pk)
    except agg_sc_add_new_citizens.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = agg_sc_add_new_citizens_Serializer(snippet)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        # Soft delete the record by setting is_deleted to True
        colleague = get_object_or_404(agg_com_colleague, pk=user_id)
        snippet.modify_by = colleague  
        snippet.is_deleted = True
        snippet.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

#__________________END ADD NEW CITIZEN (DELETE Method)_______________________# 

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_department_get_info_ViewSet1(request,source_id,source_name_id):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_department.objects.filter(source_id=source_id,source_name_id=source_name_id)
    serializer = departmentinfoGETSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_designation_get_info_ViewSet1(request, department_id,source_id,source_name_id):
    """
    List all designations for a given department.
    """
    if request.method == 'GET':
        designations = agg_sc_designation.objects.filter(department_id=department_id,source_id=source_id,source_name_id=source_name_id)
        serializer = designationinfoGETSerializer(designations, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_employee_get_info_ViewSet1(request,pk):
    try:   
        snippets = agg_sc_add_new_citizens.objects.get(pk=pk,is_deleted=False)#.order_by('citizens_pk_id').order_by('-modify_date', '-added_date')
    except agg_sc_add_new_citizens.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = EmployeeDataGetSerializer(snippets)
    return Response(serializer.data)





from rest_framework import status

@api_view(['GET', 'PUT'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def agg_sc_add_new_employee_put_info_ViewSet1(request, pk):
    """ 
    Update code snippet.
    """
    try:
        snippet = agg_sc_add_new_citizens.objects.get(pk=pk)
    except agg_sc_add_new_citizens.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EmployeeDataGetSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Check if aadhar_id already exists
        new_employee_id = request.data.get('employee_id')
        existing_snippet = agg_sc_add_new_citizens.objects.exclude(pk=pk).filter(employee_id=new_employee_id)
        if existing_snippet.exists():
            return Response({'detail': 'Employee ID already exists'}, status=status.HTTP_409_CONFLICT)

        # Proceed with updating the snippet
        serializer = agg_sc_add_new_employee_PUT_Serializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    
# _________________ Add New Citizen _______________________________________

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_get_state_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_state.objects.all().order_by('state_name')
    serializer = agg_sc_state_info_Serializer(snippets, many=True)
    return Response(serializer.data)

class agg_sc_district_from_state_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,state,formate=None):
        try:
            return agg_sc_district.objects.filter(state_name=state).order_by('dist_name')
        except agg_sc_district.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)
    def get(self,request,state):
        state_obj=self.get_object(state)
        serialized=agg_sc_district_serializer(state_obj,many=True)
        return Response(serialized.data)

class agg_sc_tahsil_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_objects(self,tahsil,formate=None):
        try:
            return agg_sc_tahsil.objects.filter(dist_name=tahsil).order_by('tahsil_name')
        except agg_sc_tahsil.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)
    def get(self,request,tahsil):
        tahsil_data=self.get_objects(tahsil)
        serialized=agg_sc_tahsil_serializer(tahsil_data,many=True)
        return Response(serialized.data)

@api_view(['GET'])
def agg_sc_get_growth_monitoring_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = GrowthMonitoring.objects.all()
    serializer = BMISerializer(snippets, many=True)
    return Response(serializer.data)

  
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_add_new_citizen_get_id_info_ViewSet1(request, pk):
    try:
        snippet = agg_sc_add_new_citizens.objects.get(pk=pk, is_deleted=False)
    except agg_sc_add_new_citizens.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = agg_sc_add_new_citizens_get_Serializer(snippet)
    return Response(serializer.data)




from django.http import HttpResponse

def calculate_bmi(request, height, weight):
    
    height_cm = height  
    weight_kg = weight  

    # Calculate BMI
    bmi = weight_kg / ((height_cm / 100) ** 2)

    
    if bmi < 18.5:
        category = 'Underweight'
    elif 18.5 <= bmi < 24.9:
        category = 'Normal weight'
    elif 25 <= bmi < 29.9:
        category = 'Overweight'
    else:
        category = 'Obese'

    
    response = f'Height: {height} cm, Weight: {weight} kg, BMI: {bmi:.2f}, Category: {category}'
    return HttpResponse(response)

   

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def role_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    # snippets = role.objects.all()
    snippets = role.objects.filter(role_is_deleted=False)
    serializer = roleSerializer(snippets, many=True)
    return Response(serializer.data)


#____________Source Wise Role GET API_________________________
class agg_sc_role_from_source_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get_object(self,source,formate=None):
        try:
            return role.objects.filter(source=source)
        except role.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)
    def get(self,request,source):
        source_obj=self.get_object(source)
        serialized=roleSerializer(source_obj,many=True)
        return Response(serialized.data)
    


#--------------------Permission GET API--------------------------------- 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def citizen_permission_get(request):
    """
    List CRUD permissions for the Citizen model.
    """
    if request.method == 'GET':
        # Get the content type for the Citizen model
        content_type = ContentType.objects.get_for_model(agg_sc_add_new_citizens)

        # Filter permissions for CRUD operations on the Citizen model
        queryset = Permission.objects.filter(content_type=content_type, codename__in=['add_agg_sc_add_new_citizens', 'change_agg_sc_add_new_citizens', 'delete_agg_sc_add_new_citizens', 'view_agg_sc_add_new_citizens'])

        serializer = PermissionSerializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def permission_get(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets =  Permission.objects.all()
    serializer = PermissionSerializer(snippets, many=True)
    return Response(serializer.data)


class PermissionModuleAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, format=None):
        permission_modules = Permission_module.objects.filter(Source_id=source_id)
        serializer = Moduleserializer(permission_modules, many=True)
        return Response(serializer.data)


class PermissionSUBAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, format=None):
        permission_modules = permission.objects.filter(source=source_id)
        serializer = permission_sub_Serializer(permission_modules, many=True)
        return Response(serializer.data)

class CombinedAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        permission_modules = Permission_module.objects.filter()
        modules_serializer = Moduleserializer(permission_modules, many=True)

        permission_objects = permission.objects.filter()
        permission_serializer = permission_sub_Serializer(permission_objects, many=True)

        combined_data = []
        for module_data in modules_serializer.data:
            module_id = module_data["module_id"]
            module_name = module_data["name"]
            source_id = module_data["Source_id"]

            submodules = [submodule for submodule in permission_serializer.data if submodule["module"] == module_id]

            formatted_data = {
                "module_id": module_id,
                "name": module_name,
                "Source_id": source_id,
                "submodules": submodules
            }

            combined_data.append(formatted_data)

        final_data = combined_data

        return Response(final_data)
    




# class agg_sc_screening_for_type_ViewSet1(APIView):
#     def get_object(self,source_id,formate=None):
#         try:
#             return agg_sc_screening_for_type.objects.filter(source_id=source_id)
#         except agg_sc_screening_for_type.DoesNotExist:
#             raise Response(status.HTTP_404_NOT_FOUND)
#     def get(self,request,source_id):
#         source_obj=self.get_object(source_id)
#         serialized=ScreeningForTypeSerializer(source_obj,many=True)
#         return Response(serialized.data)

class agg_sc_screening_for_type_ViewSet1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    # def get_object(self,sourtype,formate=None):
    #     try:
    #         return agg_sc_screening_for_type.objects.filter(source=sourtype)
    #     except agg_sc_screening_for_type.DoesNotExist:
    #         raise Response(status.HTTP_404_NOT_FOUND)
    # def get(self,request,source):
    #     source_obj=self.get_object(source)
    #     serialized=ScreeningForTypeSerializer(source_obj,many=True)
    #     return Response(serialized.data)
    
    def get_object(self, sourtype, formate=None):
        try:
            return agg_sc_screening_for_type.objects.filter(source=sourtype)
        except agg_sc_screening_for_type.DoesNotExist:
            raise Response(status.HTTP_404_NOT_FOUND)

    def get(self, request, sourtype):
        state_obj = self.get_object(sourtype)
        serialized = ScreeningForTypeSerializer(state_obj, many=True)
        return Response(serialized.data)

#------------------mayank------------------


#----------------------Class GET API--------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def class_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = agg_sc_class.objects.all()

        # Define a custom sorting order for specific class names
        custom_order = {'Nursery': 0, 'Jr KG': 1, 'Sr KG': 2}

        # Sort the data based on custom order and then numerical order
        sorted_snippets = sorted(snippets, key=lambda x: (custom_order.get(x.class_name, float('inf')), int(x.class_name) if x.class_name.isdigit() else float('inf')))

        serializer = ClassinfoSerializer(sorted_snippets, many=True)
        
        # Return the sorted data as a JSON response
        return Response(serializer.data)


#----------------------Division GET API--------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def division_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_division.objects.all()
    serializer = DivisioninfoSerializer(snippets, many=True)
    return Response(serializer.data)



#----------------------AUDITORY GET API-----------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def auditory_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_audit.objects.all()
    serializer = AuditoryinfogetSerializer(snippets, many=True)
    return Response(serializer.data)


#-------------------------------Basic Information (Genral Examination)---------------------------------#
#----------------------HEAD/SCALP GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def head_scalp_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_head_scalp.objects.all()
    serializer = basic_information_head_scalp_Serializer(snippets, many=True)
    return Response(serializer.data)

#----------------------HAIRCOLOR GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def hair_color_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_hair_color.objects.all()
    serializer = basic_information_hair_colorSerializer(snippets, many=True)
    return Response(serializer.data)

#----------------------HAIRDENSITY GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def hair_density_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_hair_density.objects.all()
    serializer = basic_information_hair_densitySerializer(snippets, many=True)
    return Response(serializer.data)


#----------------------HAIRTEXTURE GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def hair_texture_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_hair_texture.objects.all()
    serializer = basic_information_hair_textureSerializer(snippets, many=True)
    return Response(serializer.data)


#----------------------ALOPECIA GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def alopecia_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_alopecia.objects.all()
    serializer = basic_information_alopeciaSerializer(snippets, many=True)
    return Response(serializer.data)


#----------------------NECK GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def neck_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_neck.objects.all()
    serializer = basic_information_neckSerializer(snippets, many=True)
    return Response(serializer.data)

#----------------------NOSE GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def nose_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_nose.objects.all()
    serializer = basic_information_noseSerializer(snippets, many=True)
    return Response(serializer.data)


#----------------------SKIN COLOR GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def skin_color_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_skin_color.objects.all()
    serializer = basic_information_skin_colorSerializer(snippets, many=True)
    return Response(serializer.data)


#----------------------SKIN TEXTURE GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def skin_texture_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_skin_texture.objects.all()
    serializer = basic_information_skin_textureSerializer(snippets, many=True)
    return Response(serializer.data)

#----------------------SKIN LENSION GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def skin_lension_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_skin_lesions.objects.all()
    serializer = basic_information_skin_lensionSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- LIPS GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def lips_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_lips.objects.all()
    serializer = basic_information_lipsSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- GUMS GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def gums_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_gums.objects.all()
    serializer = basic_information_gumsSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- Dentition GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def dentition_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_dentition.objects.all()
    serializer = basic_information_dentitionSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- ORAL MUCOSA GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def oral_mucosa_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_oral_mucosa.objects.all()
    serializer = basic_information_oral_mucosaSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- Tounge GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def tounge_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_tounge.objects.all()
    serializer = basic_information_toungeSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Chest GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def chest_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_chest.objects.all()
    serializer = basic_information_chestSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- ABDOMEN GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def abdomen_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_abdomen.objects.all()
    serializer = basic_information_abdomenSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- Extremity GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def extremity_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_extremity.objects.all()
    serializer = basic_information_extremitySerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------END Basic Information (Genral Examination)---------------------------------#

#-------------------------------Basic Information (Systemic Exam)---------------------------------#
#---------------------- RS Right GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def rs_right_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_rs_right.objects.all()
    serializer = basic_information_rs_rightSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- RS Left GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def rs_left_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_rs_left.objects.all()
    serializer = basic_information_rs_leftSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- CVS GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def cvs_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_cvs.objects.all()
    serializer = basic_information_cvsSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Varicose Veins GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def varicose_veins_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_varicose_veins.objects.all()
    serializer = basic_information_varicose_veinsSerializer(snippets, many=True)
    return Response(serializer.data)
#---------------------- LMP GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def lmp_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_lmp.objects.all()
    serializer = basic_information_lmpSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- CNS GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def cns_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_cns.objects.all()
    serializer = basic_information_cnsSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Reflexes GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def reflexes_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_reflexes.objects.all()
    serializer = basic_information_reflexesSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Rombergs GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def rombergs_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_rombergs.objects.all()
    serializer = basic_information_rombergsSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Pupils GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def pupils_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_pupils.objects.all()
    serializer = basic_information_pupilsSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- PA GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def pa_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_pa.objects.all()
    serializer = basic_information_pa_idSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Tenderness GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def tenderness_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_tenderness.objects.all()
    serializer = basic_information_tendernessSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Ascitis GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def ascitis_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_ascitis.objects.all()
    serializer = basic_information_ascitisSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- guarding GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def guarding_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_guarding.objects.all()
    serializer = basic_information_guardingSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Joints GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def joints_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_joints.objects.all()
    serializer = basic_information_jointsSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Swollen Joints GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def swollen_joints_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_swollen_joints.objects.all()
    serializer = basic_information_swollen_jointsSerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Spine_Posture GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def spine_posture_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_spine_posture.objects.all()
    serializer = basic_information_spine_postureSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information ( Disability Screening )---------------------------------#
#---------------------- Language Delay GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def language_delay_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_language_delay.objects.all()
    serializer = basic_information_language_delaySerializer(snippets, many=True)
    return Response(serializer.data)

#---------------------- Behavioural Disorder GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def behavioural_disorder_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_behavioural_disorder.objects.all()
    serializer = basic_information_behavioural_disorderSerializer(snippets, many=True)
    return Response(serializer.data)


#---------------------- Speech Screening GET API------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def speech_screening_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_speech_screening.objects.all()
    serializer = basic_information_speech_screeningSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information (Birth Defects )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def birth_defect_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_birth_defects.objects.all()
    serializer = basic_information_birthdefectSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information (Childhood disease )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def childhood_disease_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_childhood_disease.objects.all()
    serializer = basic_information_childhood_diseaseSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information (Deficiencies )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def deficiencies_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_deficiencies.objects.all()
    serializer = basic_information_deficienciesSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information (Skin Condition )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def skin_conditions_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_skin_conditions.objects.all()
    serializer = basic_information_skin_conditionsSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information (Check Box if Normal )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def check_box_if_normal_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_check_box_if_normal.objects.all()
    serializer = basic_information_check_box_if_normalSerializer(snippets, many=True)
    return Response(serializer.data)

#-------------------------------Basic Information (Diagnosis )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def diagnosis_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_diagnosis.objects.all()
    serializer = basic_information_diagnosisSerializer(snippets, many=True)
    return Response(serializer.data)


#-------------------------------Basic Information (Treatment )---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def referral_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_referral.objects.all()
    serializer = basic_information_referralSerializer(snippets, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def place_referral_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = basic_information_place_referral.objects.all()
    serializer = basic_information_place_referralSerializer(snippets, many=True)
    return Response(serializer.data)


#-------------------------------Follow-up----------------------------------#
@api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def followup_dropdown_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_followup_dropdownlist.objects.all()
    serializer = FollowupinfoSerializer(snippets, many=True)
    return Response(serializer.data)

#-------kirti----
class followup_dropdown_get(APIView):
    def get(self, request):
        snippets = agg_sc_followup_dropdownlist.objects.all()
        serializer = FollowupinfoSerializer(snippets, many=True)
        return Response(serializer.data)


class followup_for_get(APIView):
    def get(self, request):
        snippets = agg_sc_followup_for.objects.all()
        serializer = Followup_for_infoSerializer(snippets, many=True)
        return Response(serializer.data)


class source_name_get(APIView):
    def get(self, request):
        snippets = agg_sc_add_new_source.objects.all()
        serializer = source_name_infoSerializer(snippets, many=True)
        return Response(serializer.data)


class follow_up_refer_citizen(APIView):
    def get(self, request):
        snippets = agg_sc_follow_up_citizen.objects.all()
        serializer = followup_refer_to_specalist_citizens_infoSerializer(snippets, many=True)
        return Response(serializer.data)

# class follow_up_get_citizen(APIView):
#     def get(self, request, follow_up=None, follow_up_id=None, source_name=None):
        
#         snippets = agg_sc_follow_up_citizen.objects.exclude(follow_up=None)  # All data by default

#         # Validate follow_up_id allowed values
#         if follow_up_id not in [1, 2, 4] and follow_up_id is not None:
#             return Response([], status=status.HTTP_204_NO_CONTENT)

#         # Apply filters
#         if follow_up_id == 1:
#             snippets = snippets.filter(reffered_to_sam_mam=1, weight_for_height='SAM')
#         elif follow_up_id == 2:
#             snippets = snippets.filter(reffered_to_sam_mam=1, weight_for_height='MAM')
#         elif follow_up_id == 4:
#             snippets = snippets.filter(is_deleted=False)

#         # Filter by source_name if passed
#         if source_name is not None:
#             snippets = snippets.filter(citizen_pk_id__source_name=source_name)

#         serializer = followupGETinfoSerializer(snippets, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


class follow_up_status_citizen(APIView):
    def get (self,request):
        snippets = agg_sc_follow_up_status.objects.all()
        serializer = FollowupstatusinfoSerializer(snippets, many=True)
        return Response(serializer.data)


class follow_up_citizen_info(APIView):
    def get(self, request, citizen_id):
        try:
            snippets = agg_sc_followup.objects.filter(citizen_id=citizen_id, is_deleted=False)
        except agg_sc_followup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = citizen_Followup_get_infoSerializer(snippets, many=True)
        return Response(serializer.data) 



    




@api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def followup_for_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_followup_for.objects.filter(is_deleted=False)
    serializer = Followup_for_infoSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def source_name_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_add_new_source.objects.all()
    serializer = source_name_infoSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def follow_up_refer_citizen_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_follow_up_citizen.objects.all()
    serializer = followup_refer_to_specalist_citizens_infoSerializer(snippets, many=True)
    return Response(serializer.data)

# @api_view(['GET'])
# def follow_up_get_citizen_info_ViewSet1(request,follow_up,follow_up_id,source_name):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'GET'
#     snippets = agg_sc_follow_up_citizen.objects.filter(follow_up=follow_up,follow_up_citizen_pk_id=follow_up_id,citizen_pk_id__source_name__source_names=source_name)
#     serializer = followupGETinfoSerializer(snippets, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def follow_up_get_citizen_info_ViewSet1(request, follow_up, follow_up_id=None, source_name=None):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = agg_sc_follow_up_citizen.objects.filter(follow_up=follow_up)
        
#         if follow_up_id is not None:
#             snippets = snippets.filter(follow_up_citizen_pk_id=follow_up_id)
        
#         if source_name is not None:
#             snippets = snippets.filter(citizen_pk_id__source_name__source_names=source_name)
        
#         serializer = followupGETinfoSerializer(snippets, many=True)
#         return Response(serializer.data)

# @api_view(['GET'])
# def follow_up_get_citizen_info_ViewSet1(request, follow_up, follow_up_id=None, source_name=None):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = agg_sc_follow_up_citizen.objects.filter(follow_up=follow_up)
        
#         # Check if follow_up_id is 1, if not return an empty queryset
#         if follow_up_id != 4:
#             return Response([], status=status.HTTP_204_NO_CONTENT)
        
#         if source_name is not None:
#             snippets = snippets.filter(citizen_pk_id__source_name=source_name)
        
#         serializer = followupGETinfoSerializer(snippets, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import followupGETinfoSerializer
# from .models import agg_sc_follow_up_citizen

# @api_view(['GET'])
# def follow_up_get_citizen_info_ViewSet1(request, follow_up, follow_up_id=None, source_name=None):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = agg_sc_follow_up_citizen.objects.filter(follow_up=follow_up)
        
#         # Check if follow_up_id is not 4, return an empty queryset
#         if follow_up_id not in [1, 2, 4]:
#             return Response([], status=status.HTTP_204_NO_CONTENT)
        
#         # Filter for specific conditions based on follow_up_id
#         if follow_up_id == 1:
#             snippets = snippets.filter(reffered_to_sam_mam=1, weight_for_height='SAM')
#         elif follow_up_id == 2:
#             snippets = snippets.filter(reffered_to_sam_mam=1, weight_for_height='MAM')
#         elif follow_up_id == 4:
#             snippets = snippets.filter(is_deleted=False)

#         # If source_name is provided, further filter by source_name
#         if source_name is not None:
#             snippets = snippets.filter(citizen_pk_id__source_name=source_name)
        
#         # Serialize and return data
#         serializer = followupGETinfoSerializer(snippets, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def follow_up_get_citizen_info_ViewSet1(request, follow_up=None, follow_up_id=None, source_name=None):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        
        snippets = agg_sc_follow_up_citizen.objects.exclude(follow_up=None)  # Retrieve all data by default
        
        # Check if follow_up_id is not 4, return an empty queryset
        if follow_up_id not in [1, 2, 4] and follow_up_id is not None:
            return Response([], status=status.HTTP_204_NO_CONTENT)
        
        # Apply filters based on follow_up_id
        if follow_up_id == 1:
            snippets = snippets.filter(reffered_to_sam_mam=1, weight_for_height='SAM')
        elif follow_up_id == 2:
            snippets = snippets.filter(reffered_to_sam_mam=1, weight_for_height='MAM')
        elif follow_up_id == 4:
            snippets = snippets.filter(is_deleted=False)

        # If source_name is provided, further filter by source_name
        if source_name is not None:
            snippets = snippets.filter(citizen_pk_id__source_name=source_name)
        
        # Serialize and return data
        serializer = followupGETinfoSerializer(snippets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def follow_up_citizen_get_idwise_info_ViewSet1(request,citizen_id,schedule_id):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_follow_up_citizen.objects.filter(citizen_id=citizen_id, schedule_id=schedule_id)
    serializer = followupGETIDWISEinfoSerializer(snippets, many=True)
    return Response(serializer.data)


from django.shortcuts import get_object_or_404
from .models import agg_sc_follow_up_citizen, agg_sc_follow_up_status
from .serializers import followup_info_Serializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# @api_view(['POST'])
# def agg_followup_ViewSet_POST(request, follow_up_ctzn_pk):
#     """
#     Create a new followup entry and associate it with the specified follow_up_ctzn_pk.
#     """
#     if request.method == 'POST':
#         # Retrieve the follow-up citizen object
#         follow_up_citizen = get_object_or_404(agg_sc_follow_up_citizen, follow_up_ctzn_pk=follow_up_ctzn_pk)

#         # Get the follow_up_status instance based on the ID
#         follow_up_status_id = request.data.get('follow_up')
        
#         # Check if follow_up_status_id is provided
#         if follow_up_status_id is not None:
#             # Ensure follow_up_status_id is an integer
#             try:
#                 follow_up_status_id = int(follow_up_status_id)
#             except (TypeError, ValueError):
#                 return Response({"error": "Invalid follow_up value. Expected an integer."}, status=status.HTTP_400_BAD_REQUEST)
            
#             # Update the follow_up field of the follow-up citizen
#             follow_up_citizen.follow_up = follow_up_status_id  # Assign the integer value
#             follow_up_citizen.save()

#         # Serialize data
#         serializer = followup_info_Serializer(data=request.data)
#         if serializer.is_valid():
#             # Associate follow-up citizen with the follow-up entry
#             serializer.validated_data['follow_up_citizen_pk_id'] = follow_up_citizen
#             serializer.save()

#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def agg_followup_ViewSet_POST(request, follow_up_ctzn_pk):
    """
    Create a new followup entry and associate it with the specified follow_up_ctzn_pk.
    """
    if request.method == 'POST':
        # Retrieve the follow-up citizen object
        follow_up_citizen = get_object_or_404(agg_sc_follow_up_citizen, follow_up_ctzn_pk=follow_up_ctzn_pk)

        # Get the follow_up_status instance based on the ID
        follow_up_status_id = request.data.get('follow_up')
        
        # Check if follow_up_status_id is provided
        if follow_up_status_id is not None:
            # Ensure follow_up_status_id is an integer
            try:
                follow_up_status_id = int(follow_up_status_id)
            except (TypeError, ValueError):
                return Response({"error": "Invalid follow_up value. Expected an integer."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update the follow_up field of the follow-up citizen
            follow_up_citizen.follow_up = follow_up_status_id  # Assign the integer value
            follow_up_citizen.save()

        # Count existing follow-ups for the specific citizen_id and schedule_id
        citizen_id = follow_up_citizen.citizen_id
        schedule_id = follow_up_citizen.schedule_id
        followup_count = agg_sc_followup.objects.filter(citizen_id=citizen_id, schedule_id=schedule_id).count()

        # Serialize data
        serializer = followup_info_Serializer(data=request.data)
        if serializer.is_valid():
            # Associate follow-up citizen with the follow-up entry
            serializer.validated_data['follow_up_citizen_pk_id'] = follow_up_citizen

            # Save followup_count to the follow-up entry
            serializer.validated_data['followup_count'] = followup_count + 1  # Increment the count

            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




    
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def follow_up_status_citizen_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_follow_up_status.objects.all()
    serializer = FollowupstatusinfoSerializer(snippets, many=True)
    return Response(serializer.data)


@api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def follow_up_citizen_get_info_ViewSet1(request, citizen_id):
    try:
        snippets = agg_sc_followup.objects.filter(citizen_id=citizen_id, is_deleted=False)
    except agg_sc_followup.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = citizen_Followup_get_infoSerializer(snippets, many=True)
    return Response(serializer.data)


#--------------------------------------------------------------------------------------------

class GetPermissionAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = SavePermissionSerializer

    def get(self, request, source, role, *args, **kwargs):
        permissions = agg_save_permissions.objects.filter(source=source, role=role)
        serializer = self.serializer_class(permissions, many=True)
        return Response(serializer.data)

class CreatePermissionAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = SavePermissionSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdatePermissionAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = SavePermissionSerializer

    def put(self, request, id):
        try:
            permission = agg_save_permissions.objects.get(id=id)
        except agg_save_permissions.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(permission, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class AgeCountAPIView(APIView):
#     def get(self, request, format=None):
#         age_5_6_count = agg_sc_add_new_citizens.objects.filter(age__gte=5, age__lt=6).count()
#         age_6_7_count = agg_sc_add_new_citizens.objects.filter(age__gte=6, age__lt=7).count()
#         age_7_8_count = agg_sc_add_new_citizens.objects.filter(age__gte=7, age__lt=8).count()
#         age_8_9_count = agg_sc_add_new_citizens.objects.filter(age__gte=8, age__lt=9).count()
#         age_9_10_count = agg_sc_add_new_citizens.objects.filter(age__gte=9, age__lt=10).count()
#         age_10_11_count = agg_sc_add_new_citizens.objects.filter(age__gte=10, age__lt=11).count()

#         # Prepare a dictionary with counts
#         age_counts = {
#             'age_5_6_count': age_5_6_count,
#             'age_6_7_count': age_6_7_count,
#             'age_7_8_count': age_7_8_count,
#             'age_8_9_count': age_8_9_count,
#             'age_9_10_count': age_9_10_count,
#             'age_10_11_count': age_10_11_count,
#         }

class AgeCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        current_date = timezone.now()

        # Fetching query parameters
        source = request.query_params.get('source')
        type_id = request.query_params.get('type')
        class_id = request.query_params.get('Class')
        department_id = request.query_params.get('department') 

        # Filtering the queryset based on the parameters
        queryset = agg_sc_add_new_citizens.objects.filter(is_deleted=False)

        if source:
            queryset = queryset.filter(source=source)
        if type_id:
            queryset = queryset.filter(type=type_id)
        if class_id:
            queryset = queryset.filter(Class=class_id)
        if department_id:
            queryset = queryset.filter(department=department_id)

        if str(type_id) == '3':  # For type_id '3', use specific age ranges
            age_ranges = [
                (21, 30),
                (31, 40),
                (41, 50),
                (51, 60)
            ]
        else:
            age_ranges = [
                (5, 7),
                (7, 9),
                (9, 11),
                (11, 13),
                (13, 15),
                (15, 17)
            ]

        age_counts = {}

        for start, end in age_ranges:
            start_date = current_date - timedelta(days=end * 365)  # Approximate years to days
            end_date = current_date - timedelta(days=start * 365)

            count = queryset.filter(
                dob__gte=start_date,
                dob__lt=end_date
            ).count()

            age_counts[f'year_{start}_{end}_count'] = count

        return Response(age_counts)


# class AgeCountAPIView(APIView):
#     def get(self, request, source_id, type_id, department_id=None, class_id=None, format=None):
#         print(f"type_id: {type_id}") 
#         print(f"source_id: {source_id}")
#         print(f"class_id: {class_id}")
#         print(f"department_id: {department_id}")

#         current_date = timezone.now()

#         queryset = agg_sc_add_new_citizens.objects.filter(
#             source=source_id,
#             type=type_id
#         )

#         if type_id == '2':
#             class_id = None  # Exclude class_id if type_id is '2'

#         if int(type_id) > 2 and class_id is not None:
#             queryset = queryset.filter(Class=class_id)

#         # Incorporate department_id into queryset if needed
#         if department_id is not None:
#             queryset = queryset.filter(department=department_id)

#         if str(type_id) == '3':  # For type_id '3', use specific age ranges
#             age_ranges = [
#                 (21, 30),
#                 (31, 40),
#                 (41, 50),
#                 (51, 60)
#             ]
#         else:
#             age_ranges = [
#                 (5, 7),
#                 (7, 9),
#                 (9, 11),
#                 (11, 13),
#                 (13, 15),
#                 (15, 17)
#             ]

#         age_counts = {}

#         for start, end in age_ranges:
#             start_date = current_date - timedelta(days=end * 365)  # Approximate years to days
#             end_date = current_date - timedelta(days=start * 365)

#             count = queryset.filter(
#                 dob__gte=start_date,
#                 dob__lt=end_date
#             ).count()

#             age_counts[f'year_{start}_{end}_count'] = count

#         return Response(age_counts)





class GenderCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None):
        # Filter based on whether class_id is provided or not
        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id

        boys_count = agg_sc_add_new_citizens.objects.filter(**filter_params, gender=1).count()
        girls_count = agg_sc_add_new_citizens.objects.filter(**filter_params, gender=2).count()

        return Response({'boys_count': boys_count, 'girls_count': girls_count})
    
#-------------------------------Vision CheckUP---------------------------------------------------------
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def eye_checkbox_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = vision_eye_checkbox.objects.all()
    serializer = CitizenEyeCheckBoxinfoSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def checkbox_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = vision_checkbox_if_present.objects.all()
    serializer = CitizenCheckBoxIfPresentSerializer(snippets, many=True)
    return Response(serializer.data)        
#------------------------------Symmetric Exam--------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def Symmetric_exam_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenSymmetricExaminfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CitizenSymmetricExaminfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#--------------------------------Disability Screening-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def disability_screening_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenDisabilityScreeninginfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenDisabilityScreeninginfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#--------------------------------Birth Defect-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def birth_defect_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenBirthDefectinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenBirthDefectinfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#--------------------------------childhood Disease-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def childhood_disease_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenChildhood_DiseaseinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenChildhood_DiseaseinfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#--------------------------------Deficiencies-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def deficiencies_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenDeficienciesinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenDeficienciesinfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#--------------------------------SkinCondition-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def skincondition_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenSkinConditioninfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenSkinConditioninfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#--------------------------------Check Box if Normal-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def checkboxifnormal_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenCheckBoxIfNormalinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenCheckBoxIfNormalinfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#--------------------------------Diagnosis-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def diagnosis_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenDiagnosisinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenDiagnosisinfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#--------------------------------Treatment-------------------------------------------#
@api_view(['GET', 'PUT'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def treatment_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenTreatmentinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenTreatmentinfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Update basic_screening_refer field in agg_sc_follow_up_citizen table
            refer_to_specialist = request.data.get('reffered_to_specialist')
            if refer_to_specialist == 1:
                schedule_id = request.data.get('schedule_id')
                if not schedule_id:
                    return Response("schedule_id is missing in the request", status=status.HTTP_400_BAD_REQUEST)

                try:
                    # Retrieve corresponding object from agg_sc_follow_up_citizen table
                    citizen_id = snippet.citizen_id  # Assuming this is the correct way to get citizen_id
                    citizen_instance = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
                    follow_up_citizen_instance, created = agg_sc_follow_up_citizen.objects.get_or_create(
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_instance,
                        schedule_id=schedule_id,
                        defaults={'basic_screening_refer': 1}
                    )
                    # Update basic_screening_refer field
                    if not created:
                        follow_up_citizen_instance.basic_screening_refer = 1
                        follow_up_citizen_instance.save()
                except Exception as e:
                    return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            elif refer_to_specialist == 2:
                # Set None in basic_screening_refer field
                agg_sc_follow_up_citizen.objects.filter(citizen_id=snippet.citizen_id).update(basic_screening_refer=None)
            
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    

#--------------------------------Female Screening-------------------------------------------#
@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def Female_screening_put_info_ViewSet1(request, basic_screening_pk_id):
    """ 
    API view to get or update symmetric exam info.
    """
    try:
        # Retrieve the object to be updated
        snippet = agg_sc_basic_screening_info.objects.get(basic_screening_pk_id=basic_screening_pk_id)
    except agg_sc_basic_screening_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Serialize and return data for GET request
        serializer = CitizenFemaleScreeninginfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update the object with the new data
        serializer = CitizenFemaleScreeninginfoSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Ensure to return a success status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#-------------------------------Immunisation GET API---------------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def immunisation_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_immunisation.objects.filter(is_deleted=False)
    serializer = CitizengetimmunisationinfoSerializer(snippets, many=True)
    return Response(serializer.data)




class CalculateDaysView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, dob, immunisation_pk_id, *args, **kwargs):
        try:
            dob = datetime.strptime(dob, '%Y-%m-%d').date()
            today = datetime.now().date()
            total_days = (today - dob).days

            # Check if the immunisation_pk_id exists in agg_immunisation table
            immunisation_record = agg_immunisation.objects.filter(
                immunisation_pk_id=immunisation_pk_id,
                is_deleted=False
            ).first()

            if immunisation_record:
                # Check if the calculated days fall within the range specified in agg_immunisation table
                if immunisation_record.window_period_days_from <= total_days <= immunisation_record.window_period_days_to:
                    # Citizen is valid for the vaccine
                    response_data = {
                        'immunisation_pk_id': immunisation_pk_id,
                        'immunisations': immunisation_record.immunisations,
                        'total_days': total_days,
                        'status': 'Valid for vaccine',
                        
                    }
                else:
                    # Citizen is invalid for the vaccine
                    response_data = {
                        'immunisation_pk_id': immunisation_pk_id,
                        'immunisations': immunisation_record.immunisations,
                        'total_days': total_days,
                        'status': 'Max validity for taking vaccine has passed',
                        
                    }

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                # Immunization does not exist
                return Response({'error': 'Immunization not exists'}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)











# _________________ SAM MAM _____________________
class SAM_MAM_BMI_Serializer_ViewSet(APIView):
    def get(self, request, year, month, gender, height, weight):
        try:
            # Convert height and weight to float
            height = float(height)
            weight = float(weight)
            
            # height = height
            # weight = weight           

            if 0 <= year <= 9.11:
                # Query the database to get the BMI values for the given year, month, and gender
                weight_for_age = wt_for_age_0_to_10_boys_and_girl.objects.filter(
                    birth_year=year,
                    birth_month=month,
                    gender=gender
                ).first()

                height_for_age = ht_for_age_0_to_10_boys_and_girl.objects.filter(
                    birth_year=year,
                    birth_month=month,
                    gender=gender
                ).first()

                weight_for_height = wt_for_ht_0_to_10_boys_and_girl.objects.filter(
                    gender=gender,
                    From__lte=float(height),
                    to__gte=float(height)
                ).first()

                

                if weight_for_age:
                        
                        if weight_for_age and height_for_age:
                            if float(weight) == float(weight_for_age.minus_three_SD):
                                result1 = "MUW" 
                            elif weight <= float(weight_for_age.minus_three_SD):
                                result1 = "SUW"
                            elif float(weight_for_age.minus_three_SD) < weight <= float(weight_for_age.minus_two_SD):
                                result1 = "MUW"
                            elif float(weight) == float(weight_for_age.minus_two_SD):
                                result1 = "Normal"
                            elif float(weight_for_age.minus_two_SD) < weight <= float(weight_for_age.minus_one_SD):
                                result1 = "Normal"
                            elif float(weight) == float(weight_for_age.minus_one_SD):
                                result1 = "Normal" 
                            elif float(weight_for_age.minus_one_SD) < weight <= float(weight_for_age.one_SD):
                                result1 = "Normal"
                            elif float(weight) == float(weight_for_age.one_SD):
                                result1 = "Overweight" 
                            elif float(weight_for_age.one_SD) < weight <= float(weight_for_age.two_SD):
                                result1 = "Overweight"
                            elif float(weight) == float(weight_for_age.two_SD):
                                result1 = "Overweight" 
                            elif float(weight_for_age.two_SD) < weight <= float(weight_for_age.three_SD):
                                result1 = "Overweight"
                            elif float(weight) == float(weight_for_age.three_SD):
                                result1 = "Overweight" 
                            elif weight >= float(weight_for_age.three_SD):
                                result1 = "Overweight"                        

                            else:
                                if float(weight) < float(2.0):
                                    result1 = "SUW"                        
                                elif float(weight) > float(59.3):
                                    result1 = "Overweight"  
                                else :
                                    result1 = "Not Considered" 



                            if float(height) == float(height_for_age.minus_three_SD):
                                result2 = "MS" 
                            elif float(height) <= (height_for_age.minus_three_SD):
                                # if float(height) < (height_for_age.minus_three_SD):
                                result2 = "SS"
                                # elif float(height) == (height_for_age.minus_three_SD):
                                #     result2 = "MS"
                            elif (height_for_age.minus_three_SD) < float(height) <= (height_for_age.minus_two_SD):
                                result2 = "MS"
                            elif float(height) == float(height_for_age.minus_two_SD):
                                result2 = "Normal"                                 
                            elif (height_for_age.minus_two_SD) < float(height) <= (height_for_age.minus_one_SD):
                                result2 = "Normal"
                            elif (height_for_age.minus_one_SD) < float(height) <= (height_for_age.one_SD):
                                result2 = "Normal"
                            elif (height_for_age.one_SD) < float(height) <= (height_for_age.two_SD):
                                result2 = "Normal"
                            elif (height_for_age.two_SD) < float(height) <= (height_for_age.three_SD):
                                result2 = "Normal"   
                            elif float(height_for_age.three_SD) > float(height):
                                result2 = "Very Tall"

                            else:
                                if float(height) < float(44.2):
                                    result2 = "SS"
                                elif float(height) > float(165):
                                    result2 = "Overheight"
                                else :
                                    result2 = "Overheight"  



                            

                            # # Compare Height for age and return the corresponding message
                            # # if height > float(height_for_age.minus_three_SD):
                            # #     result2 = "SS"
                            # if float(height_for_age.minus_three_SD) == float(height) < float(height_for_age.minus_two_SD):
                            #     result2 = "SS"
                            # # elif float(height) == float(height_for_age.minus_three_SD):
                            # #     result2 = "SS"           

                            # elif float(height_for_age.minus_two_SD) == float(height) > float(height_for_age.minus_three_SD):
                            #     result2 = "MS"                                    
                            # # elif float(height) < float(height_for_age.minus_two_SD):
                            # #     result2 = "MS"
                            # # elif float(height_for_age.minus_three_SD) == float(weight) == float(height_for_age.minus_three_SD):
                            # #     result1 = "MUW"                                                                  
                            # # elif float(height_for_age.minus_two_SD) == float(height) == float(height_for_age.minus_two_SD):
                            # #     result2 = "MS" 
                                
                            # elif float(height_for_age.minus_two_SD) == float(height) <  float(height_for_age.three_SD): 
                            #     result2 = "Normal"
                                
                            # # elif float(height) < float(height_for_age.three_SD):
                            # #     result2 = "Normal"
    

                            # # elif float(height_for_age.minus_one_SD) > float(height) < float(height_for_age.one_SD):
                            # #     result2 = " Normal"
                            # # elif float(height_for_age.minus_one_SD) == float(height) == float(height_for_age.minus_one_SD):
                            # #     result2 = " Normal"

                            # # elif float(height_for_age.one_SD) > float(height) < float(height_for_age.two_SD):
                            # #     result2 = " Normal" 
                            # # elif float(height_for_age.one_SD) == float(height) == float(height_for_age.one_SD):
                            # #     result2 = " Normal"  

                            # # elif float(height_for_age.two_SD) > float(height) < float(height_for_age.three_SD):
                            # #     result2 = "Normal"
                            # # elif float(height_for_age.two_SD) == float(height) == float(height_for_age.two_SD):
                            # #     result2 = "Normal"

                            # elif float(height_for_age.three_SD) == float(height):
                            #     result2 = "Normal"                                
                            # elif float(height_for_age.three_SD) > float(height):
                            #     result2 = "Very Tall1"
                            # else:
                            #     if float(height) < float(44.2):
                            #         result2 = "SS"
                            #     elif float(height) > float(165):
                            #         result2 = "Very Tall2"
                            #     else :
                            #         result2 = "Very Tall3"  

                            # height1 = height
                            # weight1 = weight                
                            # return Response({"height_for_age": height1, "weight_for_age": weight1, "weight_for_age1": result1, "height_for_age2": result2}, status=status.HTTP_200_OK)



                        if weight_for_height:
                        #     if float(weight) <= (weight_for_height.minus_three_SD):
                        #         if float(weight) < (weight_for_height.minus_three_SD):
                        #             result3 = "SAM"
                        #         elif float(weight) == (weight_for_height.minus_three_SD):
                        #             result3 = "MAM"                                
                        #     elif (weight_for_height.minus_three_SD) < float(weight) <= (weight_for_height.minus_two_SD):
                        #         result3 = "MAM"
                        #     elif (weight_for_height.minus_two_SD) < float(weight) <= (weight_for_height.minus_one_SD):
                        #         result3 = "Normal"
                        #     elif (weight_for_height.minus_one_SD) < float(weight) <= (weight_for_height.one_SD):
                        #         result3 = "Normal"
                        #     elif (weight_for_height.one_SD) < float(weight) <= (weight_for_height.two_SD):
                        #         result3 = "Overweight"
                        #     elif (weight_for_height.two_SD) < float(weight) <= (height_for_age.three_SD):
                        #         result3 = "Overweight"   
                        #     elif float(weight_for_height.three_SD) > float(weight):
                        #         result3 = "OBESE"                        
                        # else:
                        #     if float(weight) <= float(1.9):
                        #         result3 = "SAM"
                        #     elif float(height) < float(45):
                        #         result3 = "SAM"
                        #     elif float(weight) > float(31.2):
                        #         result3 = "OBESE"
                        #     elif float(height) > float(120.4):
                        #         result3 = "OBESE"                                            
                        #     else :
                        #         result3= "Not Considered" 


                            # if 0 >= float(height) < (weight_for_height.minus_three_SD):
                            #         result3 = "SAM"
                            # elif float(height) == (weight_for_height.minus_three_SD):
                            #     result3 = "MAM"
                            # elif (weight_for_height.minus_three_SD) < float(height) <= (weight_for_height.minus_two_SD):
                            #     result3 = "MS"
                            # elif float(height) == float(weight_for_height.minus_two_SD):
                            #     result3 = "Normal"                                 
                            # elif (weight_for_height.minus_two_SD) < float(height) <= (weight_for_height.minus_one_SD):
                            #     result3 = "Normal"
                            # elif (weight_for_height.minus_one_SD) < float(height) <= (weight_for_height.one_SD):
                            #     result3 = "Normal"
                            # elif (weight_for_height.one_SD) < float(height) <= (weight_for_height.two_SD):
                            #     result3 = "Overweight"
                            # elif (weight_for_height.two_SD) < float(height) <= (weight_for_height.three_SD):
                            #     result3 = "Overweight"   
                            # elif float(weight_for_height.three_SD) > float(height):
                            #     result3 = "OBESE"

                            # else:
                            #     if float(weight) <= float(1.9):
                            #         result3 = "SAM"
                            #     elif float(height) < float(45):
                            #         result3 = "SAM"
                            #     elif float(weight) > float(31.2):
                            #         result3 = "OBESE"
                            #     elif float(height) > float(120.4):
                            #         result3 = "OBESE"                                            
                            #     else :
                            #         result3= "Not Considered"                            


                            if float(weight) == float(weight_for_height.minus_three_SD):
                                result3 = "MAM" 
                            elif weight < float(weight_for_height.minus_three_SD):
                                result3 = "SAM"
                            elif float(weight_for_height.minus_three_SD) < weight <= float(weight_for_height.minus_two_SD):
                                result3 = "MAM"
                            elif float(weight) == float(weight_for_height.minus_two_SD):
                                result3 = "MAM" 
                            elif float(weight_for_height.minus_two_SD) < weight <= float(weight_for_height.minus_one_SD):
                                result3 = "Normal"
                            elif float(weight) == float(weight_for_height.minus_one_SD):
                                result3 = "Normal" 
                            elif float(weight_for_height.minus_one_SD) < weight <= float(weight_for_height.one_SD):
                                result3 = "Normal"
                            elif float(weight) == float(weight_for_height.one_SD):
                                result3 = "Normal" 
                            elif float(weight_for_height.one_SD) < weight <= float(weight_for_height.two_SD):
                                result3 = "Overweight"
                            elif float(weight) == float(weight_for_height.two_SD):
                                result3 = "Overweight" 
                            elif float(weight_for_height.two_SD) < weight <= float(weight_for_height.three_SD):
                                result3 = "Overweight"
                            elif float(weight) == float(weight_for_height.three_SD):
                                result3 = "Overweight" 
                            elif weight >= float(weight_for_height.three_SD):
                                result3 = "OBESE"                        

                        else:
                            if weight <= 1.9:
                                result3 = "SAM"
                            elif height < 45:
                                result3 = "SAM"
                            elif weight > 31.2:
                                result3 = "OBESE"
                            elif height > 120.4:
                                result3 = "OBESE"
                            else:
                                result3 = "Not Considered"

                            # whe = weight
                            # return Response({"height_for_weight": whe, "height_for_weight3": result3}, status=status.HTTP_200_OK)
                            
                            
                            # height1 = round(height,2)
                            # weight1 = round(weight,2)
                            # whe = round(weight,2)                    
                            # return Response({"weight_for_age": weight1, "height_for_age": height1,  "height_for_weight": whe, "weight_for_age1": result1, "height_for_age2": result2, "height_for_weight3": result3}, status=status.HTTP_200_OK)
                        
                        # else:
                        #     return Response({"error": "SAM MAM data not found for the given parameters"}, status=status.HTTP_404_NOT_FOUND)
                    
                        height1 = height
                        weight1 = weight
                        whe = weight
                        return Response({"weight_for_age": weight1, "height_for_age": height1, "height_for_weight": whe, "weight_for_age1": result1, "height_for_age2": result2, "height_for_weight3": result3}, status=status.HTTP_200_OK)


                # else:
                    
                #     if float(weight) <= float(2.0):
                #         result1 = "SUW"                        
                #     elif float(weight) >= float(59.3):
                #         result1 = "Not Considered"  
                #     else :
                #         result1 = "Not Considered"                                
                    

                #     if float(height) < float(44.2):
                #         result2 = "SS"
                #     elif float(height) > float(165):
                #         result2 = "Very Tall"
                #     else :
                #         result2 = "Not Considered"                         


                #     if float(weight) <= float(1.9):
                #         result3 = "SAM"
                #     elif float(height) <= float(45):
                #         result3 = "SAM"
                #     elif float(height) >= float(120.4):
                #         result3 = "Obese"                                            
                #     elif float(weight) >= float(31.2):
                #         result3 = "Obese"          
                #     else :
                #         result3= "Not Considered"                                    

                #     return Response({"weight_for_age1": result1, "height_for_age2": result2, "height_for_weight3": result3}, status=status.HTTP_200_OK)



            # Check elif the person is between 10 and 18 years old
            elif 10 <= year <= 18:
                # Query the database to get the BMI values for the given year, month, and gender
                bmi_data = WHO_BMI_bmi_boys_and_girl_5_19_years.objects.filter(
                    birth_year=year,
                    birth_month=month,
                    gender=gender
                ).first()

                if bmi_data:
                    # Calculate BMI
                    bmi = float(weight) / ((float(height) / 100) ** 2)

                    # Compare BMI and return the corresponding message
                    if float(bmi) < float(bmi_data.minus_three_SD):
                        result = "SAM"
                    elif float(bmi_data.minus_three_SD) <= float(bmi) <= float(bmi_data.minus_two_SD):
                        result = "SAM"
                    elif float(bmi_data.minus_two_SD) <= float(bmi) <= float(bmi_data.minus_one_SD):
                        result = "Normal"
                    elif float(bmi_data.minus_one_SD) <= float(bmi) <= float(bmi_data.one_SD):
                        result = " Normal"                        
                    elif float(bmi_data.one_SD) <= float(bmi) <= float(bmi_data.two_SD):
                        result = " Normal"
                    elif float(bmi_data.two_SD) <= float(bmi) <= float(bmi_data.three_SD):
                        result = "overweight"
                    elif float(bmi_data.three_SD) <= float(bmi):
                        result = "Obese"
                    else:
                        result = "Obese"
                    bmi1 = round(bmi,2)
                    return Response({"bmi": bmi1, "result": result}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "BMI data not found for the given parameters"}, status=status.HTTP_404_NOT_FOUND)

            # Check if the person is 19 years or older
            elif year > 18:
                # Calculate BMI
                bmi = float(weight) / ((float(height) / 100) ** 2)

                if bmi < 18.5:
                    category = 'Underweight'
                elif 18.5 <= bmi < 24.9:
                    category = 'Normal weight'
                elif 25 <= bmi < 29.9:
                    category = 'Overweight'
                else:
                    category = 'Obese'  

                bmi1 = round(bmi,2)
                return Response({"bmi": bmi1, "result_BMI": category}, status=status.HTTP_200_OK)

            else:
                return Response({"error": "Invalid age"}, status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response({"error": "Invalid height or weight"}, status=status.HTTP_400_BAD_REQUEST)











#------------------------dental condition count for dashboard --------------------------

from collections import Counter

class StudentConditionAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = Dental_count_serializer

    def get(self, request, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id

        # Fetch the queryset based on provided filter parameters
        queryset = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Good').count()
        queryset1 = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Bad').count()
        queryset2 = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Fair').count()


        

        # Serialize the queryset
        # serializer = self.serializer_class(queryset, many=True)
        # data = serializer.data

        # # Get counts of '1' for each field
        # field_names = ['oral_hygiene', 'gum_condition', 'oral_ulcers', 'gum_bleeding',
        #                'discoloration_of_teeth', 'food_impaction', 'carious_teeth',
        #                'extraction_done', 'fluorosis', 'tooth_brushing_frequency']

        # field_counts = {field: sum(entry[field] == '1' for entry in data) for field in field_names}

        # # Define thresholds for categorization
        # good_threshold = 7
        # poor_threshold = 3

        # # Calculate condition based on field counts
        # yes_count = sum(field_counts[field] for field in field_counts)
        # if yes_count >= good_threshold:
        #     condition = 'Good'
        # elif good_threshold > yes_count > poor_threshold:
        #     condition = 'Fair'
        # else:
        #     condition = 'Poor'

        # # Count occurrences of each condition
        # good_count = sum(1 for entry in data if condition == 'Good')
        # fair_count = sum(1 for entry in data if condition == 'Fair')
        # poor_count = sum(1 for entry in data if condition == 'Poor')

        response_data = {
            'good_count': queryset,
            'fair_count': queryset2,
            'poor_count': queryset1,
        }
        return Response(response_data, status=status.HTTP_200_OK)


# class StudentConditionAPIView(APIView):
#     serializer_class = Dental_count_serializer

#     def get(self, request, source_id, type_id, class_id=None):
#         filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
#         if class_id is not None:
#             filter_params['citizen_pk_id__Class'] = class_id

#         # Fetch the queryset based on provided filter parameters
#         queryset = agg_sc_citizen_dental_info.objects.filter(**filter_params)

#         # Serialize the queryset
#         serializer = self.serializer_class(queryset, many=True)
#         data = serializer.data

#         # Count the occurrences of '1' in the relevant fields
#         field_names = ['oral_hygiene', 'gum_condition', 'oral_ulcers', 'gum_bleeding',
#                        'discoloration_of_teeth', 'food_impaction', 'carious_teeth',
#                        'extraction_done', 'fluorosis', 'tooth_brushing_frequency']

#         yes_count = sum(1 for entry in data for field in field_names if entry[field] == '1')

#         # Define thresholds for categorization
#         good_threshold = 7
#         poor_threshold = 3

#         # Categorize based on '1' count
#         if yes_count >= good_threshold:
#             condition = 'Good'
#         elif good_threshold > yes_count > poor_threshold:
#             condition = 'Fair'
#         else:
#             condition = 'Poor'

#         response_data = {
#             'condition': condition,
#             'good_count': sum(1 for entry in data if condition == 'Good'),
#             'fair_count': sum(1 for entry in data if condition == 'Fair'),
#             'poor_count': sum(1 for entry in data if condition == 'Poor')
#         }
#         return Response(response_data, status=status.HTTP_200_OK)



class VisionCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id


        vision_with_glasses = agg_sc_citizen_vision_info.objects.filter(**filter_params, vision_with_glasses=1).count()
        vision_without_glasses = agg_sc_citizen_vision_info.objects.filter(**filter_params, vision_without_glasses=2).count()
        color_blindness = agg_sc_citizen_vision_info.objects.filter(**filter_params, color_blindness=1).count()

        color_blindness_yes = agg_sc_citizen_vision_info.objects.filter(**filter_params, color_blindness=1).count()
        color_blindness_no = agg_sc_citizen_vision_info.objects.filter(**filter_params, color_blindness=2).count()

        return Response({'vision_with_glasses': vision_with_glasses, 'vision_without_glasses': vision_without_glasses, 'color_blindness':color_blindness, 'color_blindness_yes':color_blindness_yes,'color_blindness_no':color_blindness_no})
    



class PsycoCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id
        


        diff_in_read = agg_sc_citizen_pycho_info.objects.filter(**filter_params, diff_in_read=2).count()
        diff_in_write = agg_sc_citizen_pycho_info.objects.filter(**filter_params, diff_in_write=2).count()
        hyper_reactive = agg_sc_citizen_pycho_info.objects.filter(**filter_params, hyper_reactive=2).count()
        aggresive = agg_sc_citizen_pycho_info.objects.filter(**filter_params, aggresive=2).count()


        return Response({'diff_in_read': diff_in_read, 'diff_in_write': diff_in_write, 'hyper_reactive':hyper_reactive, 'aggresive':aggresive})
    


from datetime import date, timedelta
from django.db.models import Q

class CitizenDataFilterAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Getting query parameters from the URL
        age = request.query_params.get('age')
        gender = request.query_params.get('gender')
        source = request.query_params.get('source')
        type = request.query_params.get('type')
        disease = request.query_params.get('disease')
        date_filter = request.query_params.get('date_filter')  # New filter parameter
        Class = request.query_params.get('Class')
        division = request.query_params.get('division')
        department = request.query_params.get('department')
        designation = request.query_params.get('designation')
        source_name = request.query_params.get('source_name')
        source_id = request.query_params.get('source')
        district = request.query_params.get('district') 
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')

        # Filtering the queryset based on the parameters
        queryset = agg_sc_add_new_citizens.objects.filter(is_deleted=False)

        if age:
            queryset = queryset.filter(age=age)
        if gender:
            queryset = queryset.filter(gender=gender)
        if source:
            queryset = queryset.filter(source=source)
        if type:
            queryset = queryset.filter(type=type)
        if disease:
            queryset = queryset.filter(disease=disease)
        if Class:
            queryset = queryset.filter(Class=Class)
        if division:
            queryset = queryset.filter(division=division)
        if department:
            queryset = queryset.filter(department=department)
        if designation:
            queryset = queryset.filter(designation=designation)
        if source_id:
            queryset = queryset.filter(source_id=source_id)
        if source_name:
            queryset = queryset.filter(source_name=source_name)
        if district:
            queryset = queryset.filter(district=district)  
        if tehsil:
            queryset = queryset.filter(tehsil=tehsil)
        if location:
            queryset = queryset.filter(location=location)
        

        # Applying additional date filters
        # if date_filter == 'today':
        #     today = date.today()
        #     queryset = queryset.filter(created_date=today)
        # elif date_filter == 'month':
        #     first_day_of_month = date.today().replace(day=1)
        #     # Get the last day of the current month
        #     last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        #     queryset = queryset.filter(created_date__range=[first_day_of_month, last_day_of_month])
        # elif date_filter == 'date':
        #     queryset = queryset.filter(created_date__lte=date.today())
        if date_filter == 'today':
            today = date.today()
            queryset = queryset.filter(created_date=today)
        elif date_filter == 'month':
            first_day_of_month = date.today().replace(day=1)
            last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            queryset = queryset.filter(created_date__range=[first_day_of_month, last_day_of_month])
        elif date_filter == 'date':
            queryset = queryset.filter(created_date__lte=date.today())
            
        queryset = queryset.order_by('-modify_date', 'citizens_pk_id')

        
        # queryset = queryset.order_by('citizens_pk_id')
        serializer = CitizenDataGetSerializer(queryset, many=True)
        return Response(serializer.data)


class SourceDataFilterAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Getting query parameters from the URL
        source_pk_id = request.query_params.get('source_pk_id')
        source_state_id = request.query_params.get('source_state')
        source_id = request.query_params.get('source')
        source_district_id = request.query_params.get('source_district')
        source_taluka_id = request.query_params.get('source_taluka')

        source_id_id_id = request.query_params.get('source_id_id_id')  # New filter parameter
        
        # Prepare kwargs for filtering
        filters = {}
        if source_pk_id:
            filters['source_pk_id'] = source_pk_id
        if source_state_id:
            filters['source_state_id'] = source_state_id
        if source_id:
            filters['source_id'] = source_id
        if source_district_id:
            filters['source_district_id'] = source_district_id
        if source_taluka_id:
            filters['source_taluka_id'] = source_taluka_id
        
        if source_id_id_id:
            filters['source_id'] = source_id_id_id  # Adding the new filter for source_id_id_id

        
        # if source_id_id:
        #     filters['source_id_id'] = source_id_id
        
        
        
    
    
        # Filtering the queryset based on the parameters
        queryset = agg_sc_add_new_source.objects.filter(**filters,is_deleted=False)

        # Serializing the filtered data
        serializer = SourceDataGetSerializer(queryset, many=True)
        return Response(serializer.data)
            

class UserDataFilterAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Getting query parameters from the URL
        clg_source_name = request.query_params.get('clg_source_name')
        clg_state = request.query_params.get('clg_state')
        clg_source = request.query_params.get('clg_source')
        clg_district = request.query_params.get('clg_district')
        clg_tahsil = request.query_params.get('clg_tahsil')
        
        # source_id_filter = request.query_params.get('source_id_filter')  # New filter parameter
        # source_name_id_filter = request.query_params.get('source_name_id_filter')  # New filter parameter
        # Prepare kwargs for filtering
        filters = {}
        if clg_source_name:
            filters['clg_source_name'] = clg_source_name
        if clg_state:
            filters['clg_state'] = clg_state
        if clg_source:
            filters['clg_source'] = clg_source
        if clg_district:
            filters['clg_district'] = clg_district
        if clg_tahsil:
            filters['clg_tahsil'] = clg_tahsil
            
        # if source_id_filter:
        #     filters['clg_source'] = source_id_filter  
        # if source_name_id_filter:
        #     filters['clg_source_name'] = source_name_id_filter  
            

        # Filtering the queryset based on the parameters
        queryset = agg_com_colleague.objects.filter(**filters,is_deleted=False)

        # Serializing the filtered data
        serializer = UserDataGetSerializer(queryset, many=True)
        return Response(serializer.data)

class BMICategories(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None):
        # Filter based on whether class_id is provided or not
        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id
        
        # Fetch BMI values from the model based on filters
        all_bmi_values = agg_sc_add_new_citizens.objects.filter(**filter_params).values_list('bmi', flat=True)

        # Initialize category counters
        underweight_count = 0
        normal_count = 0
        overweight_count = 0
        obese_count = 0

        for bmi_value in all_bmi_values:
            # Check for None or empty values before categorizing
            if bmi_value is not None and isinstance(bmi_value, (float, int)):
                if bmi_value < 18.5:
                    underweight_count += 1
                elif 18.5 <= bmi_value < 25:
                    normal_count += 1
                elif 25 <= bmi_value < 30:
                    overweight_count += 1
                else:
                    obese_count += 1

        # Prepare response data
        response_data = {
            'underweight': underweight_count,
            'normal': normal_count,
            'overweight': overweight_count,
            'obese': obese_count
        }

        return Response(response_data)
    
    
    
#__________________CITIZEN BASIC INFO (PUT/UPDATE Method)________________________#
# @api_view(['GET','PUT'])
# def agg_sc_put_citizen_basic_info_ViewSet1(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = citizen_basic_info.objects.get(pk=pk)
#     except citizen_basic_info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':
#         serializer =CitizenBasicinfoPUTSerializer(snippet)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = CitizenBasicinfoPUTSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .serializers import CitizenBasicinfoPUTSerializer, CitizenBasicinfo_add_new_citizen_PUTSerializer
from .models import citizen_basic_info, agg_sc_add_new_citizens

@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
@transaction.atomic
def agg_sc_put_citizen_basic_info_ViewSet1(request, citizen_id):
    # Use filter instead of get to handle multiple instances with the same citizen_id
    citizen_info_instances = citizen_basic_info.objects.filter(citizen_id=citizen_id)

    if not citizen_info_instances.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CitizenBasicinfoPUTSerializer(citizen_info_instances.first())
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Iterate through instances and update each one
        for citizen_info_instance in citizen_info_instances:
            serializer = CitizenBasicinfoPUTSerializer(citizen_info_instance, data=request.data)
            if serializer.is_valid():
                serializer.save()

        # Update the second table (agg_sc_add_new_citizens) similarly
        try:
            second_table_instances = agg_sc_add_new_citizens.objects.filter(citizen_id=citizen_id)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        for second_table_instance in second_table_instances:
            second_table_serializer = CitizenBasicinfo_add_new_citizen_PUTSerializer(second_table_instance, data=request.data)
            if second_table_serializer.is_valid():
                second_table_serializer.save()
            else:
                return Response(second_table_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)









#__________________END CITIZEN BASIC INFO (PUT Method)_______________________# 


#__________________CITIZEN FAMILY INFO (PUT/UPDATE Method)________________________#
# @api_view(['GET','PUT'])
# def agg_sc_put_citizen_family_info_ViewSet1(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_sc_citizen_family_info.objects.get(pk=pk)
#     except agg_sc_citizen_family_info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':
#         serializer =CitizenFamilyinfoPUTSerializer(snippet)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = CitizenFamilyinfoPUTSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .serializers import CitizenBasicinfoPUTSerializer, CitizenBasicinfo_add_new_citizen_PUTSerializer
from .models import citizen_basic_info, agg_sc_add_new_citizens

@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
@transaction.atomic
def agg_sc_put_citizen_family_info_ViewSet1(request, citizen_id):
    # Use filter instead of get to handle multiple instances with the same citizen_id
    citizen_info_instances = agg_sc_citizen_family_info.objects.filter(citizen_id=citizen_id)

    if not citizen_info_instances.exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CitizenFamilyinfoPUTSerializer(citizen_info_instances.first())
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Iterate through instances and update each one
        for citizen_info_instance in citizen_info_instances:
            serializer = CitizenFamilyinfoPUTSerializer(citizen_info_instance, data=request.data)
            if serializer.is_valid():
                serializer.save()

        # Update the second table (agg_sc_add_new_citizens) similarly
        try:
            second_table_instances = agg_sc_add_new_citizens.objects.filter(citizen_id=citizen_id)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        for second_table_instance in second_table_instances:
            second_table_serializer = CitizenFamilyinfo_add_new_citizen_PUTSerializer(second_table_instance, data=request.data)
            if second_table_serializer.is_valid():
                second_table_serializer.save()
            else:
                return Response(second_table_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)


#__________________END CITIZEN FAMILY INFO (PUT Method)_______________________# 


#__________________CITIZEN GROWTH MONITORING INFO (PUT/UPDATE Method)________________________#
# @api_view(['GET','PUT'])
# def agg_sc_put_citizen_growth_info_ViewSet1(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_sc_growth_monitoring_info.objects.get(pk=pk)
#     except agg_sc_growth_monitoring_info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':
#         serializer =CitizenGrowthMonitoringinfoPUTSerializer(snippet)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = CitizenGrowthMonitoringinfoPUTSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT'])
# @transaction.atomic
# def agg_sc_put_citizen_growth_info_ViewSet1(request, citizen_id):
#     # Use filter instead of get to handle multiple instances with the same citizen_id
#     citizen_info_instances = agg_sc_growth_monitoring_info.objects.filter(citizen_id=citizen_id)

#     if not citizen_info_instances.exists():
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = CitizenGrowthMonitoringinfoPUTSerializer(citizen_info_instances.first())
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         # Iterate through instances and update each one
#         for citizen_info_instance in citizen_info_instances:
#             serializer = CitizenGrowthMonitoringinfoPUTSerializer(citizen_info_instance, data=request.data)
#             if serializer.is_valid():
#                 serializer.save()

#         # Update the second table (agg_sc_add_new_citizens) similarly
#         try:
#             second_table_instances = agg_sc_add_new_citizens.objects.filter(citizen_id=citizen_id)
#         except agg_sc_add_new_citizens.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#         for second_table_instance in second_table_instances:
#             second_table_serializer = CitizenGrowthMonitoring_add_new_citzen_info_PUTSerializer(second_table_instance, data=request.data)
#             if second_table_serializer.is_valid():
#                 second_table_serializer.save()
#             else:
#                 return Response(second_table_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         return Response(serializer.data)

from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import agg_sc_growth_monitoring_info, agg_sc_add_new_citizens, agg_sc_follow_up_citizen
from .serializers import CitizenGrowthMonitoringinfoPUTSerializer, CitizenGrowthMonitoring_add_new_citzen_info_PUTSerializer
from rest_framework.decorators import api_view

@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
@transaction.atomic
def agg_sc_put_citizen_growth_info_ViewSet1(request, citizen_id):
    try:
        # Fetch instances from agg_sc_growth_monitoring_info
        citizen_info_instances = agg_sc_growth_monitoring_info.objects.filter(citizen_id=citizen_id)

        if not citizen_info_instances.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = CitizenGrowthMonitoringinfoPUTSerializer(citizen_info_instances.first())
            return Response(serializer.data)

        elif request.method == 'PUT':
            # Update the first table (agg_sc_growth_monitoring_info)
            for citizen_info_instance in citizen_info_instances:
                serializer = CitizenGrowthMonitoringinfoPUTSerializer(citizen_info_instance, data=request.data)
                if serializer.is_valid():
                    serializer.save()

            # Update the second table (agg_sc_add_new_citizens)
            second_table_instances = agg_sc_add_new_citizens.objects.filter(citizen_id=citizen_id)
            for second_table_instance in second_table_instances:
                second_table_serializer = CitizenGrowthMonitoring_add_new_citzen_info_PUTSerializer(second_table_instance, data=request.data)
                if second_table_serializer.is_valid():
                    second_table_serializer.save()
                else:
                    return Response(second_table_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Update or create agg_sc_follow_up_citizen table
            refer_to_specialist = request.data.get('reffered_to_specialist')
            if refer_to_specialist == 1:
                # Check if schedule_id is provided
                if not request.data.get('schedule_id'):
                    return Response("schedule_id is missing in the request", status=status.HTTP_400_BAD_REQUEST)

                # Get or create entry in agg_sc_follow_up_citizen based on citizen_id
                follow_up_citizen_instance, created = agg_sc_follow_up_citizen.objects.get_or_create(
                    citizen_id=citizen_id,
                    defaults={
                        'reffered_to_sam_mam': refer_to_specialist,
                        'weight_for_height': request.data.get('weight_for_height'),
                        'schedule_id': request.data.get('schedule_id'),
                        'citizen_pk_id': agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
                    }
                )
                if not created:
                    follow_up_citizen_instance.reffered_to_sam_mam = refer_to_specialist
                    follow_up_citizen_instance.weight_for_height = request.data.get('weight_for_height')
                    follow_up_citizen_instance.schedule_id = request.data.get('schedule_id')
                    follow_up_citizen_instance.citizen_pk_id = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
                    follow_up_citizen_instance.save()
                else:
                    follow_up_citizen_instance.reffered_to_sam_mam = refer_to_specialist
                    follow_up_citizen_instance.weight_for_height = request.data.get('weight_for_height')
                    follow_up_citizen_instance.schedule_id = request.data.get('schedule_id')
                    follow_up_citizen_instance.citizen_pk_id = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
                    follow_up_citizen_instance.save()

            elif refer_to_specialist == 2:
                # Set reffered_to_sam_mam and weight_for_height to None
                follow_up_citizen_instance = agg_sc_follow_up_citizen.objects.filter(citizen_id=citizen_id).first()
                if follow_up_citizen_instance:
                    follow_up_citizen_instance.reffered_to_sam_mam = None
                    follow_up_citizen_instance.weight_for_height = None
                    follow_up_citizen_instance.save()

            return Response(serializer.data)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)














#__________________END CITIZEN GROWTH MONITORING INFO (PUT Method)_______________________# 

#__________________CITIZEN VITAL INFO (PUT/UPDATE Method)________________________#
@api_view(['GET','PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_put_citizen_vital_info_ViewSet1(request, pk):
    """ 
    update code snippet.
    """
    try:
        snippet = agg_sc_citizen_vital_info.objects.get(pk=pk)
    except agg_sc_citizen_vital_info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer =CitizenVitalinfoSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CitizenVitalinfoPUTSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#__________________END CITIZEN VITAL INFO (PUT Method)_______________________# 


#---------------------Birth defect--------------------------------------#
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import agg_sc_basic_screening_info
from .serializers import Birth_Defect_Serializer
from django.db.models import Q


class BirthDefectCountAPIView(generics.ListAPIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = Birth_Defect_Serializer
    # permission_classes = [IsAuthenticated]  

    def get(self, request, source_id, type_id, class_id=None, *args, **kwargs):
        try:
            
            filter_params = {
                'citizen_pk_id__source': source_id,
                'citizen_pk_id__type': type_id
            }
            if class_id is not None:
                filter_params['citizen_pk_id__Class'] = class_id
                
            filter_condition = Q(birth_defects__contains=[]) | ~Q(birth_defects__contains=["NAD"])

            
            birth_defects_count = agg_sc_basic_screening_info.objects.filter(**filter_params).exclude(**filter_condition).count()

            return Response({'birth_defects_count': birth_defects_count}, status=status.HTTP_200_OK)
        
        except ValueError as ve:
            
            return Response({'error': 'Invalid input'}, status=status.HTTP_400_BAD_REQUEST)
        
        except agg_sc_basic_screening_info.DoesNotExist:
            
            raise NotFound("Data not found")

        except Exception as e:
            
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class HealthcardAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Getting query parameters from the URL
        source_pk_id = request.query_params.get('source_pk_id')
        source = request.query_params.get('source')
        state_id = request.query_params.get('state_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        source_name = request.query_params.get('source_name')
        source_id_id = request.query_params.get('source_id_id')
        source_name_id = request.query_params.get('source_name_id')
        location = request.query_params.get('location')

        # Prepare kwargs for filtering
        filter_params = {}

        if source_pk_id:
            filter_params['citizen_pk_id__source_pk_id'] = source_pk_id
        if source:
            filter_params['citizen_pk_id__source'] = source
        if state_id:
            filter_params['citizen_pk_id__state'] = state_id
        if district:
            filter_params['citizen_pk_id__district'] = district
        if tehsil:
            filter_params['citizen_pk_id__tehsil'] = tehsil
        if source_name:
            filter_params['citizen_pk_id__source_name'] = source_name
        if source_id_id:
            filter_params['citizen_pk_id__source'] = source_id_id
        if source_name_id:
            filter_params['citizen_pk_id__source_name'] = source_name_id
        
        if location:
            filter_params['citizen_pk_id__location'] = location

        # Filtering the queryset based on the parameters
        healthcards = agg_sc_basic_screening_info.objects.filter(**filter_params, form_submit=True)

        # Serializing the filtered data
        serializer = HealthcardSerializer(healthcards, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


    

class CitizenVitalinfoCompleateStatusViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            citizen_id = self.kwargs.get('citizen_id')
            schedule_count = self.kwargs.get('schedule_count')

            
            vital_info = agg_sc_citizen_vital_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            vital_serializer = CitizenVitalinfoCompleate_status(vital_info, many=True) if vital_info else None
            
            dental_info = agg_sc_citizen_dental_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            dental_serializer = agg_sc_citizen_dental_info_Status(dental_info, many=True) if dental_info else None
            
            vision_info = agg_sc_citizen_vision_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            vision_serializer = agg_sc_citizen_vision_info_Status(vision_info, many=True) if vision_info else None
      
            immunization_info = agg_sc_citizen_immunization_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            immunization_serializer = Citizenimmunisationinfo_status(immunization_info, many=True) if immunization_info else None  
            
            basic_info = agg_sc_basic_screening_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            basic_serializer = CitizenBasicinfo_Status(basic_info, many=True) if basic_info else None
            
            audit_info = agg_sc_citizen_audit_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            audit_serializer = Auditoryinfo_Status(audit_info, many=True) if audit_info else None
            
            psycho_info = agg_sc_citizen_pycho_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            psycho_serializer = Psyco_For_Status(psycho_info, many=True) if psycho_info else None
            
            basic_information = citizen_basic_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            basic_information_serializer = basic_information_Status(basic_information, many=True) if basic_information else None
            
            family_info = agg_sc_citizen_family_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            family_info_serializer = Family_Status(family_info, many=True) if family_info else None
            
            bmi_info = agg_sc_growth_monitoring_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            bmi_info_serializer = BMI_Status(bmi_info, many=True) if bmi_info else None

            pft_info = agg_sc_growth_monitoring_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            pft_info_serializer = PFT_Status(pft_info, many=True) if pft_info else None
            
            invest_info = agg_sc_investigation.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            invest_info_serializer = Investigation_Status(invest_info, many=True) if invest_info else None
            
            med_info = agg_sc_citizen_medical_history.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            med_info_serializer = Medical_History_Status(med_info, many=True) if med_info else None

            
            response_data = {
                'vital_info': vital_serializer.data if vital_serializer else None,
                'dental_info': dental_serializer.data if dental_serializer else None,
                'vision_info': vision_serializer.data if vision_serializer else None,
                'immunization_info': immunization_serializer.data if immunization_serializer else None,
                'basic_info': basic_serializer.data if basic_serializer else None,
                'audit_info': audit_serializer.data if audit_serializer else None,
                'psycho_info': psycho_serializer.data if psycho_serializer else None,
                'basic_information': basic_information_serializer.data if basic_information_serializer else None,
                'family_info': family_info_serializer.data if family_info_serializer else None,
                'bmi_info': bmi_info_serializer.data if bmi_info_serializer else None,
                'pft_info': pft_info_serializer.data if pft_info_serializer else None,
                'med_info': med_info_serializer.data if med_info_serializer else None,
                'invest_info': invest_info_serializer.data if invest_info_serializer else None,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Healt_card_DownloadAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            citizen_id = self.kwargs.get('citizen_id')
            schedule_count = self.kwargs.get('schedule_count')

            # Retrieve psycho info based on citizen_id and schedule_count
            psycho_info = agg_sc_citizen_pycho_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            psycho_serializer = Psyco_For_download(psycho_info, many=True) if psycho_info else None

            # Retrieve dental info based on citizen_id and schedule_count
            dental_info = agg_sc_citizen_dental_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            dental_serializer = agg_sc_citizen_dental_Download_Serializer(dental_info, many=True) if dental_info else None

            # Retrieve vision info based on citizen_id and schedule_count
            vision_info = agg_sc_citizen_vision_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            vision_serializer = agg_sc_citizen_vision_info_Serializer(vision_info, many=True) if vision_info else None
            immunization_info = agg_sc_citizen_immunization_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            immunization_serializer = CitizenimmunisationinfoHealthcard(immunization_info, many=True) if immunization_info else None
            
            vital_info = agg_sc_citizen_vital_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            vital_serializer = CitizenVitalinfoHealthcard(vital_info, many=True) if vital_info else None
            
            basic_info = agg_sc_basic_screening_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            basic_serializer = Healthcard_basic_screening(basic_info, many=True) if basic_info else None
            
            bmi_info = agg_sc_growth_monitoring_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            bmi_serializer = BMI_for_Healthcard(bmi_info, many=True) if basic_info else None
            
            
            other_info = agg_sc_citizen_other_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            other_serializer = Other_info_for_Healthcard(other_info, many=True) if other_info else None
            
            

            response_data = {
                'psycho_info': psycho_serializer.data if psycho_serializer else None,
                'dental_info': dental_serializer.data if dental_serializer else None,
                'vision_info': vision_serializer.data if vision_serializer else None,
                'immunization_info': immunization_serializer.data if immunization_serializer else None,
                'vital_info': vital_serializer.data if vital_serializer else None,
                'basic_info': basic_serializer.data if basic_serializer else None,
                'bmi_info': bmi_serializer.data if bmi_serializer else None,
                'other_info': other_serializer.data if other_serializer else None,
              

                

            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class refer_to_count(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id
            
        queryset = agg_sc_follow_up_citizen.objects.filter(**filter_params).count()
        
        
        response_data = {
            'count': queryset,
            
        }
        return Response(response_data, status=status.HTTP_200_OK)


#------------------------Medical History------------------------#
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def medical_history_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = medical_history.objects.all()
    serializer = Citizen_Medical_History_Get_InfoSerializer(snippets, many=True)
    return Response(serializer.data)           


@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def past_operative_history_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_citizen_past_operative_history.objects.all()
    serializer = Citizen_Past_Operative_History_Get_InfoSerializer(snippets, many=True)
    return Response(serializer.data)
    
@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def report_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_investigation.objects.all()
    serializer = citizen_report_Get_InfoSerializer(snippets, many=True)
    return Response(serializer.data)

   
    


@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def bad_habbits_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = agg_sc_bad_habbits.objects.all()
        serializer = citizen_bad_habbits_InfoSerializer(snippets, many=True)
        return Response(serializer.data)



@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def form_submit_counts(request,citizen_id, schedule_id):
    true_count = 0
    false_count = 0

    # Count occurrences of True and False in form_submit field for each table
    true_count += agg_sc_basic_screening_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_basic_screening_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_vital_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_vital_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_immunization_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_immunization_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_audit_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_audit_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_pycho_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_pycho_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_dental_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_dental_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_vision_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_vision_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_family_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_family_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_growth_monitoring_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_growth_monitoring_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += citizen_basic_info.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += citizen_basic_info.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_investigation.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_investigation.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    true_count += agg_sc_citizen_medical_history.objects.filter(form_submit=True, citizen_id=citizen_id, schedule_id=schedule_id).count()
    false_count += agg_sc_citizen_medical_history.objects.filter(form_submit=False, citizen_id=citizen_id, schedule_id=schedule_id).count()

    data = {'submitted_forms': true_count, 'pending_forms': false_count}
    serializer = FormSubmitSerializer(data)

    return Response(serializer.data)



from django.http import HttpResponseBadRequest

class CheckAllFieldsFilledValues(APIView):
    def get(self, request, citizen_id, schedule_id, format=None):
        # Get all citizen_basic_info objects filtered by citizen_id and schedule_id
        all_citizens = citizen_basic_info.objects.filter(citizen_id=citizen_id, schedule_id=schedule_id)

        # Initialize a list to store results for each citizen
        results = []

        # Iterate over each citizen
        for citizen in all_citizens:
            # Fetch citizens_pk_id based on citizen_id
            try:
                citizen_info = agg_sc_add_new_citizens.objects.get(citizen_id=citizen.citizen_id)
                citizens_pk_id = citizen_info.pk
            except agg_sc_add_new_citizens.DoesNotExist:
                citizens_pk_id = None

            # Check if any field is null for the current citizen
            null_fields = []
            filled_fields = {}

            # Assuming source information is fetched from another related model
            source = None  # Set default value for source
            if hasattr(citizen, 'related_model_name'):  # Check if related model exists
                related_model_instance = citizen.related_model_name
                source = related_model_instance.source  # Get source from related model

            # Determine source and include fields accordingly
            required_fields = ['citizen_id', 'schedule_id', 'prefix', 'name', 'gender', 'blood_groups', 'dob', 'year', 'months', 'days', 'aadhar_id', 'email_id']

            if source == 3:  # Assuming 3 represents 'corporate' source
                # Include additional fields for corporate source
                required_fields.extend(['emp_mobile_no', 'department_id', 'designation_id', 'employee_id'])

            elif source == 1:  # Assuming 1 represents 'school' source
                # Include fields relevant for school source
                for field in required_fields:
                    value = getattr(citizen, field)
                    if value is None:
                        null_fields.append(field)
                    else:
                        filled_fields[field] = value

            # Check for null fields
            for field in required_fields:
                value = getattr(citizen, field)
                if value is None:
                    null_fields.append(field)
                else:
                    filled_fields[field] = value

            # Append citizen's result to the list
            results.append({
                "type": "citizen_basic_info",
                "citizen_id": citizen.citizen_id,
                "name": citizen.name,
                "all_fields_filled": len(null_fields) == 0,
                "null_fields": null_fields,
                "filled_fields": filled_fields,
                "citizens_pk_id": citizens_pk_id
            })

        return Response(results)




from rest_framework.views import APIView
from rest_framework.response import Response
from .models import citizen_basic_info, agg_sc_add_new_citizens, agg_sc_citizen_family_info, agg_sc_citizen_vital_info

class CheckAllFieldsFilled(APIView):
    def get(self, request, format=None):
        # Get all citizen_basic_info objects
        all_citizens = citizen_basic_info.objects.all()

        # Initialize a list to store results for each citizen
        results = []

        # Iterate over each citizen
        for citizen in all_citizens:
            # Fetch citizens_pk_id based on citizen_id
            try:
                citizen_info = agg_sc_add_new_citizens.objects.get(citizen_id=citizen.citizen_id)
                citizens_pk_id = citizen_info.pk
            except agg_sc_add_new_citizens.DoesNotExist:
                citizens_pk_id = None

            # Check if any field is null for the current citizen
            null_fields = []

            # Assuming source information is fetched from another related model
            source = None  # Set default value for source
            if hasattr(citizen, 'related_model_name'):  # Check if related model exists
                related_model_instance = citizen.related_model_name
                source = related_model_instance.source  # Get source from related model

            # Determine source and include fields accordingly
            required_fields = ['citizen_id', 'schedule_id', 'prefix', 'name', 'gender', 'blood_groups', 'dob', 'year', 'months', 'days', 'aadhar_id', 'email_id']

            if source == 3:  # Assuming 3 represents 'corporate' source
                # Include additional fields for corporate source
                required_fields.extend(['emp_mobile_no', 'department_id', 'designation_id', 'employee_id'])

            elif source == 1:  # Assuming 1 represents 'school' source
                # Include fields relevant for school source
                if citizen.citizen_id is None:
                    null_fields.append("citizen_id")
                if citizen.schedule_id is None:
                    null_fields.append("schedule_id")
                if citizen.prefix is None:
                    null_fields.append("prefix")
                if citizen.name is None:
                    null_fields.append("name")
                if citizen.gender is None:
                    null_fields.append("gender")
                if citizen.blood_groups is None:
                    null_fields.append("blood_groups")
                if citizen.dob is None:
                    null_fields.append("dob")
                if citizen.year is None:
                    null_fields.append("year")
                if citizen.months is None:
                    null_fields.append("months")
                if citizen.days is None:
                    null_fields.append("days")
                if citizen.aadhar_id is None:
                    null_fields.append("aadhar_id")
                if citizen.email_id is None:
                    null_fields.append("email_id")

            # Check for null fields
            for field in required_fields:
                if getattr(citizen, field) is None:
                    null_fields.append(field)

            # Determine if all required fields are filled
            all_fields_filled = len(null_fields) == 0
            
            null_fields_family_info = []
            
            # Fetch citizen's family info
            try:
                family_info = agg_sc_citizen_family_info.objects.filter(citizen_id=citizen.citizen_id).first()
            except agg_sc_citizen_family_info.DoesNotExist:
                family_info = None

            if family_info:
                # Determine source and include fields accordingly for family info
                required_fields1 = ['citizen_id', 'schedule_id', 'father_name', 'mother_name', 'parents_mobile','spouse_name','marital_status','child_count']

                if source == 3:  # Assuming 3 represents 'corporate' source
                    # Include additional fields for corporate source in family info
                    # required_fields1.extend(['spouse_name', 'marital_status', 'child_count'])
                    required_fields1
                elif source == 1:  # Assuming 1 represents 'school' source
                    # Include fields relevant for school source in family info
                    if family_info.citizen_id is None:
                        null_fields_family_info.append("citizen_id")
                    if family_info.schedule_id is None:
                        null_fields_family_info.append("schedule_id")
                    if family_info.father_name is None:
                        null_fields_family_info.append("father_name")
                    if family_info.mother_name is None:
                        null_fields_family_info.append("mother_name")
                    if family_info.parents_mobile is None:
                        null_fields_family_info.append("parents_mobile")
                    if family_info.sibling_count is None:
                        null_fields_family_info.append("sibling_count")
                    if family_info.child_count is None:
                        null_fields_family_info.append("child_count")

                # Check for null fields in family info
                for field in required_fields1:
                    if getattr(family_info, field) is None:
                        null_fields_family_info.append(field)

                # Determine if all required fields in family info are filled
                all_fields_filled_family_info = len(null_fields_family_info) == 0

            null_fields_vital_info = []
            
            # Fetch citizen's vital info
            try:
                vital_info = agg_sc_citizen_vital_info.objects.filter(citizen_id=citizen.citizen_id).first()
            except agg_sc_citizen_vital_info.DoesNotExist:
                vital_info = None

            if vital_info:
                # Determine source and include fields accordingly for vital info
                required_fields2 = ['citizen_id', 'schedule_id','pulse','pulse_conditions','sys_mm','sys_mm_conditions','dys_mm','dys_mm_mm_conditions','oxygen_saturation','oxygen_saturation_conditions','rr','rr_conditions','temp','temp_conditions']

                if source == 3:  # Assuming 3 represents 'corporate' source
                    # Include additional fields for corporate source in vital info
                    required_fields2
                elif source == 1:  # Assuming 1 represents 'school' source
                    # Include fields relevant for school source in vital info
                    if vital_info.citizen_id is None:
                        null_fields_vital_info.append("citizen_id")
                    if vital_info.schedule_id is None:
                        null_fields_vital_info.append("schedule_id")
                    if vital_info.pulse is None:
                        null_fields_vital_info.append("pulse")
                    if vital_info.pulse_conditions is None:
                        null_fields_vital_info.append("pulse_conditions")
                    if vital_info.sys_mm is None:
                        null_fields_vital_info.append("sys_mm")
                    if vital_info.sys_mm_conditions is None:
                        null_fields_vital_info.append("sys_mm_conditions")
                    if vital_info.dys_mm is None:
                        null_fields_vital_info.append("dys_mm")
                    if vital_info.dys_mm_mm_conditions is None:
                        null_fields_vital_info.append("dys_mm_mm_conditions")
                    if vital_info.oxygen_saturation is None:
                        null_fields_vital_info.append("oxygen_saturation")
                    if vital_info.oxygen_saturation_conditions is None:
                        null_fields_vital_info.append("oxygen_saturation_conditions")
                    if vital_info.rr is None:
                        null_fields_vital_info.append("rr")
                    if vital_info.rr_conditions is None:
                        null_fields_vital_info.append("rr_conditions")
                    if vital_info.temp is None:
                        null_fields_vital_info.append("temp")
                    if vital_info.temp_conditions is None:
                        null_fields_vital_info.append("temp_conditions")

                # Check for null fields in vital info
                for field in required_fields2:
                    if getattr(vital_info, field) is None:
                        null_fields_vital_info.append(field)

                # Determine if all required fields in vital info are filled
                all_fields_filled_vital_info = len(null_fields_vital_info) == 0

            # Append citizen's result to the list
            results.append({
                "type": "citizen_basic_info",
                "citizen_id": citizen.citizen_id,
                "schedule_id": citizen.schedule_id,
                "name": citizen.name,
                "all_fields_filled": all_fields_filled,
                "citizens_pk_id": citizens_pk_id,
                # "null_fields": null_fields,
            })
            
            # Append citizen's result to the list if family info exists
            if family_info:
                results.append({
                    "type": "citizen_family_info",
                    "citizen_id": citizen.citizen_id,
                    "schedule_id": citizen.schedule_id,
                    "name": citizen.name,
                    "all_fields_filled": all_fields_filled_family_info,
                    "citizens_pk_id": citizens_pk_id,
                    # "null_fields": null_fields_family_info,
                })
                
            # Append citizen's result to the list if vital info exists
            if vital_info:
                results.append({
                    "type": "citizen_vital_info",
                    "citizen_id": citizen.citizen_id,
                    "schedule_id": citizen.schedule_id,
                    "name": citizen.name,
                    "all_fields_filled": all_fields_filled_vital_info,
                    "citizens_pk_id": citizens_pk_id,
                    # "null_fields": null_fields_vital_info,
                })

        return Response(results)


class Hospital_list_GET_API_APIView(APIView):
    def get(self,request,format=None):
        snippets = referred_hospital_list.objects.all()
        serializer = HospitalListSerializer(snippets,many=True)
        return Response(serializer.data)

class audio_reading_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request,reading):
            if(reading>=0 and reading<=25):
                return Response({'message': 'Normal'})
            
            elif(reading>=26 and reading<=39):
                return Response({'message': 'Mild Hearning Loss'})
            
            elif(reading>=40 and reading<=69):
                return Response({'message': 'Sever Hearing Loss '})
            
            elif(reading>=70 and reading<=89):
                return Response({'message': 'Sever Hearing Loss '})
            
            elif(reading>=90 and reading<=120):
                return Response({'message': 'Profound Hearning Loss '})
            else:
                return Response({'message': 'Out Of Range'})
                   


# class left_reading(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]
#     def get(self, request, hz_500_left, hz_1000_left, hz_2000_left):
#         average = (hz_500_left + hz_1000_left + hz_2000_left) / 3
#         if average:
#             return Response({'message': 'Normal'})
#         else:
#             return Response({'message': 'Out Of Range'})


class LeftReading(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        hz_500_left = kwargs.get('hz_500_left')
        hz_1000_left = kwargs.get('hz_1000_left')
        hz_2000_left = kwargs.get('hz_2000_left')
        
        left_average_reading = (int(hz_500_left) + int(hz_1000_left) + int(hz_2000_left)) / 3
        left_average_reading = int(left_average_reading)
        if 0 <= left_average_reading <= 25:
            return Response({'left_average_reading': left_average_reading, 'message': 'Normal'})
        elif 26 <= left_average_reading <= 39:
            return Response({'left_average_reading': left_average_reading, 'message': 'Mild Hearing Loss'})
        elif 40 <= left_average_reading <= 69:
            return Response({'left_average_reading': left_average_reading, 'message': 'Moderate Hearing Loss'})
        elif 70<= left_average_reading <= 89:
            return Response({'left_average_reading': left_average_reading, 'message': 'Severe Hearing Loss'})
        elif 90 <= left_average_reading <= 120:
            return Response({'left_average_reading': left_average_reading, 'message': 'Profound Hearning Loss'})
        else:
            return Response({'message': 'Out Of Range'})
        
        
class RightReading(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        hz_500_right = kwargs.get('hz_500_right')
        hz_1000_right = kwargs.get('hz_1000_right')
        hz_2000_right = kwargs.get('hz_2000_right')
        
        Right_average_reading = (int(hz_500_right) + int(hz_1000_right) + int(hz_2000_right)) / 3
        Right_average_reading = int(Right_average_reading)
        
        if 0 <= Right_average_reading <= 25:
            return Response({'Right_average_reading': Right_average_reading, 'message': 'Normal'})
        elif 26 <= Right_average_reading <= 39:
            return Response({'Right_average_reading': Right_average_reading, 'message': 'Mild Hearing Loss'})
        elif 40 <= Right_average_reading <= 69:
            return Response({'Right_average_reading': Right_average_reading, 'message': 'Moderate Hearing Loss'})
        elif 70<= Right_average_reading <= 89:
            return Response({'Right_average_reading': Right_average_reading, 'message': 'Severe Hearing Loss'})
        elif 90 <= Right_average_reading <= 120:
            return Response({'Right_average_reading': Right_average_reading, 'message': 'Profound Hearning Loss'})
        else:
            return Response({'message': 'Out Of Range'})
        


# class ObservationCountsAPIView(APIView):
#     def get(self, request, format=None):
#         # Query to get counts of 'Danger', 'Caution', and 'Stable'
#         observation_counts = agg_sc_pft.objects.filter(observations__in=['Danger', 'Caution', 'Stable']) \
#                                                .values('observations') \
#                                                .annotate(count=Count('observations'))

#         # Create a dictionary to hold the counts
#         counts_dict = {
#             'Danger': 0,
#             'Caution': 0,
#             'Stable': 0
#         }

#         # Update the dictionary with query results
#         for item in observation_counts:
#             counts_dict[item['observations']] = item['count']

#         # Define ranges for readings
#         ranges = [
#             (60, 249),
#             (250, 449),
#             (450, 800)
#         ]

#         # Initialize counts dictionary for each range
#         for start, end in ranges:
#             counts_dict[f'Reading_{start}_{end}'] = 0

#         # Query to get counts of readings within each range
#         for start, end in ranges:
#             count = agg_sc_pft.objects.filter(pft_reading__range=(start, end)).count()
#             counts_dict[f'Reading_{start}_{end}'] = count

#         # Return the counts as JSON response
#         return Response(counts_dict)


class PFTCountsAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None, format=None):
        # Define filter parameters
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id

        # Query to get counts of 'Danger', 'Caution', and 'Stable' observations
        observation_counts = agg_sc_pft.objects.filter(**filter_params, observations__in=['Danger', 'Caution', 'Stable']) \
                                               .values('observations') \
                                               .annotate(count=Count('observations'))

        # Create a dictionary to hold the counts
        counts_dict = {
            'Danger': 0,
            'Caution': 0,
            'Stable': 0
        }

        # Update the dictionary with query results
        for item in observation_counts:
            counts_dict[item['observations']] = item['count']

        # Define ranges for readings
        ranges = [
            (60, 249),
            (250, 449),
            (450, 800)
        ]

        # Initialize counts dictionary for each range
        for start, end in ranges:
            counts_dict[f'Reading_{start}_{end}'] = 0

        # Query to get counts of readings within each range
        for start, end in ranges:
            count = agg_sc_pft.objects.filter(**filter_params, pft_reading__range=(start, end)).count()
            counts_dict[f'Reading_{start}_{end}'] = count

        # Return the counts as JSON response
        return Response(counts_dict)
    
    


#------------------------NEW DASHBOARD SOURCENAME WISE----------------------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import agg_sc_add_new_citizens
from rest_framework import status

class NEWGenderCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Initialize filter parameters with required filters
        filter_params = {'is_deleted': False}

        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        source_name_id = request.query_params.get('source_name_id')
        
        if source_id is not None:
            filter_params['source'] = source_id
        if type_id is not None:
            filter_params['type'] = type_id
        if class_id is not None:
            filter_params['Class'] = class_id
        if source_name_id is not None:
            filter_params['source_name'] = source_name_id

        # Extract additional filters from query parameters
        for param, value in request.query_params.items():
            if param not in ['source_id', 'type_id', 'class_id','source_name_id'] and param in ['age', 'city']:  # Add any other fields you want to filter by
                filter_params[param] = value

        # Filter for boys and girls count using filter_params
        boys_count = agg_sc_add_new_citizens.objects.filter(**filter_params, gender=1).count()
        girls_count = agg_sc_add_new_citizens.objects.filter(**filter_params, gender=2).count()

        return Response({'boys_count': boys_count, 'girls_count': girls_count}, status=status.HTTP_200_OK)






from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import agg_sc_citizen_vision_info
from rest_framework import status

class NEWVisionCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Initialize filter parameters with required filters
        filter_params = {}

        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        source_name = request.query_params.get('source_name')
        schedule_id = request.query_params.get('schedule_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')
        
        if source_id is not None:
            filter_params['citizen_pk_id__source'] = source_id
        if type_id is not None:
            filter_params['citizen_pk_id__type'] = type_id
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id
        if source_name is not None:
            filter_params['citizen_pk_id__source_name'] = source_name
        if schedule_id is not None:
            filter_params['schedule_id'] = schedule_id
        if district is not None:
            filter_params['citizen_pk_id__district'] = district
        if tehsil is not None:
            filter_params['citizen_pk_id__tehsil'] = tehsil
        if location is not None:
            filter_params['citizen_pk_id__location'] = location  
        
        # Extract additional filters from query parameters
        for param, value in request.query_params.items():
            if param not in ['source_id', 'type_id', 'class_id','source_name','schedule_id','district','tehsil','location']:  # Add any other fields you want to filter by
                filter_params[param] = value

        # Filter for vision counts using filter_params
        vision_with_glasses = agg_sc_citizen_vision_info.objects.filter(**filter_params, vision_with_glasses=1).count()
        vision_without_glasses = agg_sc_citizen_vision_info.objects.filter(**filter_params, vision_without_glasses=2).count()
        color_blindness_yes = agg_sc_citizen_vision_info.objects.filter(**filter_params, color_blindness=1).count()
        color_blindness_no = agg_sc_citizen_vision_info.objects.filter(**filter_params, color_blindness=2).count()

        return Response({
            'vision_with_glasses': vision_with_glasses,
            'vision_without_glasses': vision_without_glasses,
            'color_blindness_yes': color_blindness_yes,
            'color_blindness_no': color_blindness_no
        }, status=status.HTTP_200_OK)




class NewStudentDentalConditionAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = Dental_count_serializer

    def get(self, request):
        # Initialize filter parameters
        filter_params = {}

        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        source_name_id = request.query_params.get('source_name_id')
        schedule_id = request.query_params.get('schedule_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')
        
        
        if source_id is not None:
            filter_params['citizen_pk_id__source'] = source_id
        if type_id is not None:
            filter_params['citizen_pk_id__type'] = type_id
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id
        if source_name_id is not None:
            filter_params['citizen_pk_id__source_name'] = source_name_id
        if schedule_id is not None:
            filter_params['schedule_id'] = schedule_id
        
        if district is not None:
            filter_params['citizen_pk_id__district'] = district
        if tehsil is not None:
            filter_params['citizen_pk_id__tehsil'] = tehsil
        if location is not None:
            filter_params['citizen_pk_id__location'] = location

        # Extract additional filters from query parameters
        for param, value in request.query_params.items():
            if param not in ['source_id', 'type_id', 'class_id','source_name_id','schedule_id','district','tehsil','location']:  # Add any other fields you want to filter by
                filter_params[param] = value

        # Fetch the queryset based on provided filter parameters
        good_count = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Good').count()
        fair_count = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Fair').count()
        poor_count = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Bad').count()

        response_data = {
            'good_count': good_count,
            'fair_count': fair_count,
            'poor_count': poor_count,
        }

        return Response(response_data, status=status.HTTP_200_OK)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .models import agg_sc_pft
from rest_framework import status

class NEWPFTCountsAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Initialize filter parameters
        filter_params = {}

        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        source_name_id = request.query_params.get('source_name_id')
        schedule_id = request.query_params.get('schedule_id')


        if source_id is not None:
            filter_params['citizen_pk_id__source'] = source_id
        if type_id is not None:
            filter_params['citizen_pk_id__type'] = type_id
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id
        if source_name_id is not None:
            filter_params['citizen_pk_id__source_name'] = source_name_id
        if schedule_id is not None:
            filter_params['schedule_id'] = schedule_id
        

        # Extract additional filters from query parameters
        for param, value in request.query_params.items():
            if param not in ['source_id', 'type_id', 'class_id','source_name_id','schedule_id']:  
                filter_params[param] = value

       
        observation_counts = agg_sc_pft.objects.filter(
            **filter_params, 
            observations__in=['Danger', 'Caution', 'Stable']
        ).values('observations').annotate(count=Count('observations'))

        # Create a dictionary to hold the counts
        counts_dict = {
            'Danger': 0,
            'Caution': 0,
            'Stable': 0
        }

        # Update the dictionary with query results
        for item in observation_counts:
            counts_dict[item['observations']] = item['count']

        # Define ranges for readings
        ranges = [
            (60, 249),
            (250, 449),
            (450, 800)
        ]

        # Initialize counts dictionary for each range
        for start, end in ranges:
            counts_dict[f'Reading_{start}_{end}'] = 0

        # Query to get counts of readings within each range
        for start, end in ranges:
            count = agg_sc_pft.objects.filter(
                **filter_params, 
                pft_reading__range=(start, end)
            ).count()
            counts_dict[f'Reading_{start}_{end}'] = count

        # Return the counts as JSON response
        return Response(counts_dict, status=status.HTTP_200_OK)



class NEWAgeCountAPIView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        current_date = timezone.now()

        # Fetching query parameters
        source = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('Class_id')
        department_id = request.query_params.get('department_id') 
        source_name_id = request.query_params.get('source_name_id')

        # Filtering the queryset based on the parameters
        queryset = agg_sc_add_new_citizens.objects.filter(is_deleted=False)

        if source:
            queryset = queryset.filter(source=source)
        if type_id:
            queryset = queryset.filter(type=type_id)
        if class_id:
            queryset = queryset.filter(Class=class_id)
        if department_id:
            queryset = queryset.filter(department=department_id)
        if source_name_id:
            queryset = queryset.filter(source_name=source_name_id)

        # Determine age ranges based on type_id
        if str(type_id) == '3':
            age_ranges = [
                (18, 30),
                (31, 50),
                (51, 59),
                (60, 120),

            ]
        else:
            age_ranges = [
                (5, 7),
                (7, 9),
                (9, 11),
                (11, 13),
                (13, 15),
                (15, 17)
            ]

        age_counts = {}

        # Calculate counts for each age range
        for start, end in age_ranges:
            start_date = current_date - timedelta(days=end * 365)  
            end_date = current_date - timedelta(days=start * 365)

            count = queryset.filter(
                dob__gte=start_date,
                dob__lt=end_date
            ).count()

            age_counts[f'year_{start}_{end}_count'] = count

        return Response(age_counts)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import agg_sc_add_new_citizens

class NEWBMICategories(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        source_name_id = request.query_params.get('source_name_id')
        

        # Initialize filter parameters
        filter_params = {'is_deleted': False}

        if source_id is not None:
            filter_params['source'] = source_id
        if type_id is not None:
            filter_params['type'] = type_id
        if class_id is not None:
            filter_params['Class'] = class_id           
        if source_name_id:
            filter_params['source_name'] = source_name_id


        # Fetch BMI values from the model based on filters
        all_bmi_values = agg_sc_add_new_citizens.objects.filter(**filter_params).values_list('bmi', flat=True)

        # Initialize category counters
        underweight_count = 0
        normal_count = 0
        overweight_count = 0
        obese_count = 0

        for bmi_value in all_bmi_values:
            # Check for None or empty values before categorizing
            if bmi_value is not None and isinstance(bmi_value, (float, int)):
                if bmi_value < 18.5:
                    underweight_count += 1
                elif 18.5 <= bmi_value < 25:
                    normal_count += 1
                elif 25 <= bmi_value < 30:
                    overweight_count += 1
                else:
                    obese_count += 1

        # Prepare response data
        response_data = {
            'underweight': underweight_count,
            'normal': normal_count,
            'overweight': overweight_count,
            'obese': obese_count
        }

        return Response(response_data)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import FieldError

class ReferredToSpecialistCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('Class_id')
        source_name_id = request.query_params.get('source_name_id')
        schedule_id = request.query_params.get('schedule_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')
        
        # Initialize count variables for each table
        vital_info_count = audit_info_count = dental_info_count = vision_info_count = screening_info_count = 0

        # Initialize filter parameters for each table
        filter_params_vital = filter_params_audit = filter_params_dental = filter_params_vision = filter_params_screening = {}

        if source_id is not None:
            filter_params_vital['citizen_pk_id__source_id'] = filter_params_audit['citizen_pk_id__source_id'] = filter_params_dental['citizen_pk_id__source_id'] = filter_params_vision['citizen_pk_id__source_id'] = filter_params_screening['citizen_pk_id__source_id'] = source_id
        if type_id is not None:
            filter_params_vital['citizen_pk_id__type_id'] = filter_params_audit['citizen_pk_id__type_id'] = filter_params_dental['citizen_pk_id__type_id'] = filter_params_vision['citizen_pk_id__type_id'] = filter_params_screening['citizen_pk_id__type_id'] = type_id
        if class_id is not None:
            filter_params_vital['citizen_pk_id__Class_id'] = filter_params_audit['citizen_pk_id__Class_id'] = filter_params_dental['citizen_pk_id__Class_id'] = filter_params_vision['citizen_pk_id__Class_id'] = filter_params_screening['citizen_pk_id__Class_id'] = class_id
        if source_name_id is not None:
            filter_params_vital['citizen_pk_id__source_name_id'] = filter_params_audit['citizen_pk_id__source_name_id'] = filter_params_dental['citizen_pk_id__source_name_id'] = filter_params_vision['citizen_pk_id__source_name_id'] = filter_params_screening['citizen_pk_id__source_name_id'] = source_name_id
        if schedule_id is not None:
            filter_params_vital['schedule_id'] = filter_params_audit['schedule_id'] = filter_params_dental['schedule_id'] = filter_params_vision['schedule_id'] = filter_params_screening['schedule_id'] = schedule_id
        if district is not None:
            filter_params_vital['citizen_pk_id__district'] = filter_params_audit['citizen_pk_id__district'] = filter_params_dental['citizen_pk_id__district'] = filter_params_vision['citizen_pk_id__district'] = filter_params_screening['citizen_pk_id__district'] = district
        if tehsil is not None:
            filter_params_vital['citizen_pk_id__tehsil'] = filter_params_audit['citizen_pk_id__tehsil'] = filter_params_dental['citizen_pk_id__tehsil'] = filter_params_vision['citizen_pk_id__tehsil'] = filter_params_screening['citizen_pk_id__tehsil'] = tehsil
        if location is not None:
            filter_params_vital['citizen_pk_id__location'] = filter_params_audit['citizen_pk_id__location'] = filter_params_dental['citizen_pk_id__location'] = filter_params_vision['citizen_pk_id__location'] = filter_params_screening['citizen_pk_id__location'] = location
        # Retrieve counts from each model
        try:
            vital_info_count = agg_sc_citizen_vital_info.objects.filter(reffered_to_specialist=1, **filter_params_vital).count()
        except FieldError:
            pass
        try:
            audit_info_count = agg_sc_citizen_audit_info.objects.filter(reffered_to_specialist=1, **filter_params_audit).count()
        except FieldError:
            pass
        try:
            dental_info_count = agg_sc_citizen_dental_info.objects.filter(reffered_to_specialist=1, **filter_params_dental).count()
        except FieldError:
            pass
        try:
            vision_info_count = agg_sc_citizen_vision_info.objects.filter(reffered_to_specialist=1, **filter_params_vision).count()
        except FieldError:
            pass
        try:
            screening_info_count = agg_sc_basic_screening_info.objects.filter(reffered_to_specialist=1, **filter_params_screening).count()
        except FieldError:
            pass

        # Sum up the counts
        total_count = (
            vital_info_count + 
            audit_info_count + 
            dental_info_count + 
            vision_info_count + 
            screening_info_count
        )

        # Prepare response data
        response_data = {
            'vital_info_count': vital_info_count,
            'audit_info_count': audit_info_count,
            'dental_info_count': dental_info_count,
            'vision_info_count': vision_info_count,
            'screening_info_count': screening_info_count,
            'reffered_to_specialist': total_count
        }

        return Response(response_data)
    
    


class NEWPsycoCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('Class_id')
        schedule_id = request.query_params.get('schedule_id')
        source_name_id = request.query_params.get('source_name_id')
        
        filter_params = {}
        if source_id:
            filter_params['citizen_pk_id__source'] = source_id
        if type_id:
            filter_params['citizen_pk_id__type'] = type_id
        if class_id:
            filter_params['citizen_pk_id__Class'] = class_id
        if schedule_id:
            filter_params['schedule_id'] = schedule_id
        if source_name_id:
            filter_params['citizen_pk_id__source_name'] = source_name_id

        diff_in_read_count = agg_sc_citizen_pycho_info.objects.filter(**filter_params, diff_in_read=2).count()
        diff_in_write_count = agg_sc_citizen_pycho_info.objects.filter(**filter_params, diff_in_write=2).count()
        hyper_reactive_count = agg_sc_citizen_pycho_info.objects.filter(**filter_params, hyper_reactive=2).count()
        aggresive_count = agg_sc_citizen_pycho_info.objects.filter(**filter_params, aggresive=2).count()

        response_data = {
            'diff_in_read': diff_in_read_count,
            'diff_in_write': diff_in_write_count,
            'hyper_reactive': hyper_reactive_count,
            'aggresive': aggresive_count
        }

        return Response(response_data)

class Birth_Defect_Count_APIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        schedule_id = request.query_params.get('schedule_id', None)
        type_id = request.query_params.get('type_id', None)
        source_id = request.query_params.get('source_id', None)
        source_name_id = request.query_params.get('source_name_id', None)
        class_id = request.query_params.get('Class_id', None)
        district = request.query_params.get('district', None)
        tehsil = request.query_params.get('tehsil', None)
        location = request.query_params.get('location', None)

        queryset = agg_sc_basic_screening_info.objects.all()

        if schedule_id:
            queryset = queryset.filter(schedule_id=schedule_id)

        if type_id or source_id or source_name_id or class_id:
            queryset = queryset.select_related('citizen_pk_id')  

        if type_id:
            queryset = queryset.filter(citizen_pk_id__type_id=type_id)
        if source_id:
            queryset = queryset.filter(citizen_pk_id__source_id=source_id)
        if source_name_id:
            queryset = queryset.filter(citizen_pk_id__source_name_id=source_name_id)
        if class_id:
            queryset = queryset.filter(citizen_pk_id__Class_id=class_id)
        if district:
            queryset = queryset.filter(citizen_pk_id__district=district)
        if tehsil:
            queryset = queryset.filter(citizen_pk_id__tehsil=tehsil)
        if location:
            queryset = queryset.filter(citizen_pk_id__location=location)

        valid_birth_defects_count = 0
        for snippet in queryset:
            birth_defects = snippet.birth_defects

            if isinstance(birth_defects, list) and birth_defects and birth_defects != ["NAD"]:
                valid_birth_defects_count += 1
        
        return Response({'birth_defects_count': valid_birth_defects_count}, status=status.HTTP_200_OK)




    

# import csv
# from django.http import HttpResponse
# # from .models import AggScAddNewCitizens
# from rest_framework.views import APIView

# class DownloadCSVView(APIView):
#     def get(self, request, *args, **kwargs):
#         response = HttpResponse(content_type='text/csv')
#         response['Content-Disposition'] = 'attachment; filename="imported_data_from_excel_csv_selected_columns.csv"'

#         selected_fields = ['name', 'emp_mobile_no', 'address', 'dob','age','gender','source','type','blood_groups','prefix','source_name','pincode','permanant_address','department','designation','doj','official_email','official_mobile','employee_id','marital_status','email_id','child_count','spouse_name','height','weight','emergency_prefix','emergency_fullname','emergency_gender','emergency_contact','emergency_email','relationship_with_employee','emergency_address']
        
#         writer = csv.writer(response)
#         writer.writerow(selected_fields)

#         first_row = imported_data_from_excel_csv.objects.values_list(*selected_fields).first()
#         if first_row:
#             writer.writerow(first_row)

#         return response



import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from .models import imported_data_from_excel_csv

class DownloadCSVView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Retrieve the source_id from query parameters
        source_id = request.query_params.get('source_id', None)
        
        # Check if source_id is provided
        if source_id is None:
            return HttpResponse("source_id is required", status=400)

        # Convert source_id to an integer
        try:
            source_id = int(source_id)
        except ValueError:
            return HttpResponse("Invalid source_id", status=400)

        # Define selected_fields based on source_id
        if source_id == 5:
            selected_fields = [
                'name', 'emp_mobile_no', 'address', 'dob', 'age', 'gender', 'source', 'type', 'blood_groups', 'prefix',
                'source_name', 'pincode', 'permanant_address', 'department', 'designation', 'doj', 'official_email',
                'official_mobile', 'employee_id', 'marital_status', 'email_id', 'child_count', 'spouse_name', 'height',
                'weight', 'emergency_prefix', 'emergency_fullname', 'emergency_gender', 'emergency_contact', 
                'emergency_email', 'relationship_with_employee', 'emergency_address'
            ]
        elif source_id == 1:
            selected_fields = ['name','dob','address','age','gender','source','type','blood_groups']
        else:
            return HttpResponse("Invalid source_id", status=400)

        # Create the HTTP response with CSV content type and attachment filename
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="imported_data_from_excel_csv_selected_columns_source_{source_id}.csv"'

        # Initialize CSV writer
        writer = csv.writer(response)

        # Write header row
        writer.writerow(selected_fields)

        # Retrieve the first row of data for the specified source_id
        first_row = imported_data_from_excel_csv.objects.values_list(*selected_fields).first()

        # Debugging: Print first_row
        print("First Row:", first_row)

        # If first_row is not None, write it to the CSV file
        if first_row:
            writer.writerow(first_row)

        return response




import csv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import imported_data_from_excel_csv

class UploadImportedDataView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Extract CSV file from request data
        csv_file = request.FILES.get('csv_file')
        if not csv_file:
            return Response("No CSV file found.", status=status.HTTP_400_BAD_REQUEST)

        try:
            # Read and process CSV data
            decoded_file = csv_file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)

            def get_field_value(row, field):
                value = row.get(field)
                return value if value else None

            # Iterate through CSV rows
            for row in reader:
                # Create a new instance of the model for each row of data
                imported_data_from_excel_csv.objects.create(
                    name=get_field_value(row, 'name'),
                    emp_mobile_no=get_field_value(row, 'emp_mobile_no'),
                    address=get_field_value(row, 'address'),
                    dob=get_field_value(row, 'dob'),
                    age_id=get_field_value(row, 'age'),  # Use _id to directly assign the foreign key value
                    gender_id=get_field_value(row, 'gender'),
                    source_id=get_field_value(row, 'source'),
                    type_id=get_field_value(row, 'type'),
                    blood_groups=get_field_value(row, 'blood_groups'),
                    prefix=get_field_value(row, 'prefix'),
                    source_name_id=get_field_value(row, 'source_name'),
                    pincode=get_field_value(row, 'pincode'),
                    permanant_address=get_field_value(row, 'permanant_address'),
                    department_id=get_field_value(row, 'department'),
                    designation_id=get_field_value(row, 'designation'),
                    doj=get_field_value(row, 'doj'),
                    official_email=get_field_value(row, 'official_email'),
                    official_mobile=get_field_value(row, 'official_mobile'),
                    employee_id=get_field_value(row, 'employee_id'),
                    marital_status=get_field_value(row, 'marital_status'),
                    email_id=get_field_value(row, 'email_id'),
                    child_count=get_field_value(row, 'child_count'),
                    spouse_name=get_field_value(row, 'spouse_name'),
                    height=get_field_value(row, 'height'),
                    weight=get_field_value(row, 'weight'),
                    emergency_prefix=get_field_value(row, 'emergency_prefix'),
                    emergency_fullname=get_field_value(row, 'emergency_fullname'),
                    emergency_gender=get_field_value(row, 'emergency_gender'),
                    emergency_contact=get_field_value(row, 'emergency_contact'),
                    emergency_email=get_field_value(row, 'emergency_email'),
                    relationship_with_employee=get_field_value(row, 'relationship_with_employee'),
                    emergency_address=get_field_value(row, 'emergency_address')
                )
            
            return Response("CSV data successfully uploaded.", status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(f"Error processing CSV file: {e}", status=status.HTTP_400_BAD_REQUEST)




class GET_Imported_data_from_csv_and_excel(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        snippets = imported_data_from_excel_csv.objects.all()
        serializers = ImportedDataSerializer(snippets,many=True)
    
        return Response(serializers.data, status=status.HTTP_200_OK)
    
    

class GET_ID_Wise_Imported_data_from_csv_and_excel(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        try:
            snippet = imported_data_from_excel_csv.objects.get(id=id)
            serializer = ImportedDataSerializer(snippet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except imported_data_from_excel_csv.DoesNotExist:
            return Response("Imported data not found", status=status.HTTP_404_NOT_FOUND)

class GET_Screening_List_View(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = agg_screening_list.objects.all()
        serializers = Screening_List_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class Screening_sub_list_Viewset(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        screening_list = request.GET.get('screening_list')
        snippet = agg_screening_sub_list.objects.all()
        
        if screening_list:
            snippet = snippet.filter(screening_list=screening_list)
        
        serializers = Screening_sub_list_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
    
# class screening_vitals_Viewset(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]
#     def get(self,request):
#         source = request.GET.get('source')
#         source_pk_id = request.GET.get('source_pk_id')
        
#         snippet = agg_sc_add_new_source.objects.all()
        
#         if source:
#             snippet = snippet.filter(source=source)
            
#         if source_pk_id:
#             snippet = snippet.filter(source_pk_id=source_pk_id)
        
#         serializers = screening_vitals_Serializer(snippet,many=True)
#         return Response(serializers.data,status=status.HTTP_200_OK)



class ScreeningVitalsViewset(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        source = request.GET.get('source')
        source_pk_id = request.GET.get('source_pk_id')
        
        snippet = agg_sc_add_new_source.objects.all()
        
        if source:
            snippet = snippet.filter(source=source)
            
        if source_pk_id:
            snippet = snippet.filter(source_pk_id=source_pk_id)
        
        serializer = ScreeningVitalsSerializer(snippet, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    
    
# class screening_sub_vitals_Viewset(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]
#     def get(self,request):
#         source = request.GET.get('source')
#         source_pk_id = request.GET.get('source_pk_id')
        
#         snippet = agg_sc_add_new_source.objects.all()
        
#         if source:
#             snippet = snippet.filter(source=source)
            
#         if source_pk_id:
#             snippet = snippet.filter(source_pk_id=source_pk_id)
        
#         serializers = screening_sublist_Serializer(snippet,many=True)
#         return Response(serializers.data,status=status.HTTP_200_OK)
    
    

class screening_sub_vitals_Viewset(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        source = request.GET.get('source')
        source_pk_id = request.GET.get('source_pk_id')
        
        snippet = agg_sc_add_new_source.objects.all()
        
        if source:
            snippet = snippet.filter(source=source)
            
        if source_pk_id:
            snippet = snippet.filter(source_pk_id=source_pk_id)
        
        serializer = ScreeningSublistSerializer(snippet, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    



#FInal one for multiple video and image processing code

from dotenv import load_dotenv
import os
import genai
from googletrans import Translator
from PIL import Image
from tenacity import *
from tenacity import retry
from requests.adapters import HTTPAdapter
from io import BytesIO
from logging.config import dictConfig
from deep_translator import GoogleTranslator
from bs4 import BeautifulSoup
import time
from google.generativeai import GenerativeModel, upload_file, get_file, configure
import re
import google.generativeai as genai

class VideoAnalysisLinkAPI(APIView):

    def post(self, request, format=None):
        try:
            # Prompt the user to enter a video link manually
            # video_url = input("Enter the video URL: ").strip()
            video_urls = request.data.get('video_urls', [])
            image_urls = request.data.get('image_urls', [])  # Fetch 'image_path' from request
            
            print("demo")

            if image_urls and video_urls:
                # For Multiple image analysis:

                # Load environment variable:
                load_dotenv()

                # User input:
                input_prompt = "describe the given image in 250 letters"

                # Configure the API key for Google Generative AI:
                API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM")  # Replace with your key
                genai.configure(api_key=API_KEY)

                # Initialize the translator:
                translator = Translator()
                print("demo1")

                # Function to download an image from URL or local file:
                def download_image_from_url(url):
                    try:
                        # Check if it's a local file
                        if os.path.isfile(url):
                            print(f"Loading local image: {url}")
                            return Image.open(url)

                        # Prepare a session with retries and HTTP adapter
                        session = requests.Session()
                        retries = retry(total=3, backoff_factor=1, status_forcelist=[502, 503, 504])
                        session.mount('http://', HTTPAdapter(max_retries=retries))
                        session.mount('https://', HTTPAdapter(max_retries=retries))

                        # Allow insecure HTTP and timeout
                        if url.startswith('http://') or url.startswith('https://'):
                            print(f"Downloading image from URL: {url}")
                            response = session.get(url, timeout=30)

                            if response.status_code == 200:
                                return Image.open(BytesIO(response.content))
                            else:
                                raise ValueError(f"Failed to download image. Status code: {response.status_code}")

                        else:
                            raise ValueError("Invalid URL or file path.")

                    except Exception as e:
                        raise ValueError(f"Error loading image: {e}")

                # Function to process the image and generate text:
                def get_gemini_response(input_prompt, image_urls):
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    
                    responses = []
                    for index, url in enumerate(image_urls, 1):
                        obj_arr = []
                        try:
                            image = download_image_from_url(url)
                            
                            # Generate content using the image & prompt:
                            if input_prompt.strip():
                                response = model.generate_content([input_prompt, image])
                            else:
                                response = model.generate_content(image)
                            
                            print("response text--", response.text)
                            # Extract the generated text:
                            # generated_text = response.text
                            
                            # Translate the generated text to Marathi:
                            # translated_text = translator.translate(generated_text, src='en', dest='mr').text
                            
                            # print("translated_text---", translated_text)
                            # Append both English and Marathi translations:
                            # responses.append({
                            #     'english': generated_text,
                            #     'marathi': translated_text
                            # })


                            # Clean the response text to remove extra newlines and add a single newline at the end
                            clean_text = response.text.strip().replace("\n", " ")  # Remove existing newlines
                            # Translate the generated text to Marathi:
                            translated_text = translator.translate(clean_text, src='en', dest='mr').text
                            
                            # print("translated_text---", translated_text)
                            # Append both English and Marathi translations:
                            obj_arr.append({
                                'english': {clean_text + "\n"},
                                'marathi': {translated_text + "\n"}
                            })

                            print("obj-", obj_arr)


                            responses.append({f"image {index}": obj_arr})  # Add a single newline at the end
                        except Exception as e:
                            responses.append({f"image {index}": f"Failed to process {url}: {e}\n"})
                    
                    return responses


                # if not image_urls:
                #     return Response({'msg': 'No image URLs provided'}, status=status.HTTP_400_BAD_REQUEST)

                # Remove any extra spaces from the URLs:
                image_urls = [url.strip() for url in image_urls]

                try:
                    # Get the AI-generated response:
                    Imgresults = get_gemini_response(input_prompt, image_urls)
                    # return Response(results, status=status.HTTP_200_OK)
                        
                except Exception as e:
                    print(f"An error occurred: {e}")
                    return Response({'msg': 'No Data Found'}, status=status.HTTP_200_OK)










                # Video analysis -------------------------------
                # Configure the API key for Google Generative AI
                API_KEY = "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"
                configure(api_key=API_KEY)

                # Function to remove the video file
                def remove_file(file_path):
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                            print(f"File '{file_path}' has been deleted.")
                        else:
                            print(f"File '{file_path}' does not exist.")
                    except Exception as e:
                        print(f"Error removing file: {e}")


                # Function to process a single video URL
                def process_video(video_url):
                    local_video_path = "downloaded_video.mp4"
                    try:
                        print(f"\nDownloading the video from {video_url}...")
                        response = requests.get(video_url, stream=True)
                        response.raise_for_status()  # Check for request errors
                        with open(local_video_path, "wb") as video_file:
                            for chunk in response.iter_content(chunk_size=1024):
                                if chunk:
                                    video_file.write(chunk)
                        print("Video downloaded successfully.")


                        # Upload the downloaded video file
                        video_file = upload_file(path=local_video_path)

                        # Wait for processing to complete
                        print("Processing the video file...")
                        while video_file.state.name == "PROCESSING":
                            time.sleep(10)
                            video_file = get_file(video_file.name)

                        # Check if processing failed
                        if video_file.state.name == "FAILED":
                            remove_file(local_video_path)  # Remove the file if processing fails
                            raise ValueError("Video processing failed.")
                        

                        # Generate transcription with visual descriptions
                        prompt = (
                            "Describe the provided video "
                        )

                        try:
                            print("Using gemini model to process..")
                            model = GenerativeModel(model_name="gemini-1.5-pro-latest")
                            response = model.generate_content([video_file, prompt], request_options={"timeout": 600})
                        except Exception as e:
                            print(f"An error occurred: {e}")
                            return Response({'msg': 'No Data Found'}, status=status.HTTP_200_OK)

                        # Remove the video file after processing
                        remove_file(local_video_path)

                        # Parse HTML content into plain text
                        html_content = response.text
                        plain_text = BeautifulSoup(html_content, "html.parser").get_text()

                        # Remove timestamps from the transcription
                        plain_text_no_timestamps = re.sub(r"\[\d{2}:\d{2}(?::\d{2})?\]", "", plain_text).strip()

                        # Translate the plain text without timestamps into Marathi
                        translated_text = GoogleTranslator(source='auto', target='mr').translate(plain_text_no_timestamps)

                        return plain_text_no_timestamps, translated_text

                        
                    except requests.RequestException as e:
                        print(f"Failed to download video: {e}")
                        return None


                obj_arr = []
                # Process each video URL
                for i, video_url in enumerate(video_urls, start=1):
                    # video_url = video_url.strip()
                    print(f"\nProcessing Video {i} of {len(video_urls)}:")
                    result = process_video(video_url)
                    if result:
                        plain_text, translated_text = result
                        print("\nGenerated Transcription and Visual Descriptions (English):")
                        print(plain_text)
                        print("\nTranslated Transcription and Visual Descriptions (Marathi):")
                        print(translated_text)
                        obj = {
                            "Text_in_English" : plain_text,
                            "Text_in_Marathi" : translated_text
                        }
                        obj_arr.append({f"video {i}": obj})
                    else:
                        print(f"Failed to process video {i}.")




                

                Final_Output_Obj = {
                    "Image_Analyzed_data" : Imgresults,
                    "Video_Analyzed_data" : obj_arr
                }
                # Display the plain text output without timestamps
                # print("\nGenerated Transcription and Visual Descriptions:")
                # print(plain_text_no_timestamps)
                try:
                    return Response(Final_Output_Obj, status=status.HTTP_200_OK)
                except Exception as e:
                    print(f"An error occurred: {e}")
                    return Response({'msg': 'No Data Found'}, status=status.HTTP_200_OK)










            elif image_urls:

                # For Multiple image analysis:

                # Load environment variable:
                load_dotenv()

                # User input:
                input_prompt = "describe the given image in 250 letters"

                # Configure the API key for Google Generative AI:
                API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM")  # Replace with your key
                genai.configure(api_key=API_KEY)

                # Initialize the translator:
                translator = Translator()

                # Function to download an image from URL or local file:
                def download_image_from_url(url):
                    try:
                        # Check if it's a local file
                        if os.path.isfile(url):
                            print(f"Loading local image: {url}")
                            return Image.open(url)

                        # Prepare a session with retries and HTTP adapter
                        session = requests.Session()
                        retries = retry(total=3, backoff_factor=1, status_forcelist=[502, 503, 504])
                        session.mount('http://', HTTPAdapter(max_retries=retries))
                        session.mount('https://', HTTPAdapter(max_retries=retries))

                        # Allow insecure HTTP and timeout
                        if url.startswith('http://') or url.startswith('https://'):
                            print(f"Downloading image from URL: {url}")
                            response = session.get(url, timeout=30)

                            if response.status_code == 200:
                                return Image.open(BytesIO(response.content))
                            else:
                                raise ValueError(f"Failed to download image. Status code: {response.status_code}")

                        else:
                            raise ValueError("Invalid URL or file path.")

                    except Exception as e:
                        raise ValueError(f"Error loading image: {e}")

                # Function to process the image and generate text:
                def get_gemini_response(input_prompt, image_urls):
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    
                    responses = []
                    for index, url in enumerate(image_urls, 1):
                        obj_arr = []
                        try:
                            image = download_image_from_url(url)
                            
                            
                            # Generate content using the image & prompt:
                            if input_prompt.strip():
                                response = model.generate_content([input_prompt, image])
                            else:
                                response = model.generate_content(image)
                            
                            print("response text--", response.text)
                            # Extract the generated text:
                            # generated_text = response.text
                            
                            # Translate the generated text to Marathi:
                            # translated_text = translator.translate(generated_text, src='en', dest='mr').text
                            
                            # print("translated_text---", translated_text)
                            # Append both English and Marathi translations:
                            # responses.append({
                            #     'english': generated_text,
                            #     'marathi': translated_text
                            # })


                            # Clean the response text to remove extra newlines and add a single newline at the end
                            clean_text = response.text.strip().replace("\n", " ")  # Remove existing newlines
                            # Translate the generated text to Marathi:
                            translated_text = translator.translate(clean_text, src='en', dest='mr').text
                            
                            # print("translated_text---", translated_text)
                            # Append both English and Marathi translations:
                            obj_arr.append({
                                'english': {clean_text + "\n"},
                                'marathi': {translated_text + "\n"}
                            })

                            print("obj-", obj_arr)


                            responses.append({f"image {index}": obj_arr})  # Add a single newline at the end
                        except Exception as e:
                            responses.append({f"image {index}": f"Failed to process {url}: {e}\n"})
                    
                    return responses


                # if not image_urls:
                #     return Response({'msg': 'No image URLs provided'}, status=status.HTTP_400_BAD_REQUEST)

                # Remove any extra spaces from the URLs:
                image_urls = [url.strip() for url in image_urls]

                try:
                    # Get the AI-generated response:
                    results = get_gemini_response(input_prompt, image_urls)
                    return Response(results, status=status.HTTP_200_OK)
                        
                except Exception as e:
                    print(f"An error occurred: {e}")
                    return Response({'msg': 'No Data Found'}, status=status.HTTP_200_OK)


            elif video_urls:


                # Configure the API key for Google Generative AI
                API_KEY = "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"
                configure(api_key=API_KEY)

                # Function to remove the video file
                def remove_file(file_path):
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                            print(f"File '{file_path}' has been deleted.")
                        else:
                            print(f"File '{file_path}' does not exist.")
                    except Exception as e:
                        print(f"Error removing file: {e}")


                # Function to process a single video URL
                def process_video(video_url):
                    local_video_path = "downloaded_video.mp4"
                    try:
                        print(f"\nDownloading the video from {video_url}...")
                        response = requests.get(video_url, stream=True)
                        response.raise_for_status()  # Check for request errors
                        with open(local_video_path, "wb") as video_file:
                            for chunk in response.iter_content(chunk_size=1024):
                                if chunk:
                                    video_file.write(chunk)
                        print("Video downloaded successfully.")


                        # Upload the downloaded video file
                        video_file = upload_file(path=local_video_path)

                        # Wait for processing to complete
                        print("Processing the video file...")
                        while video_file.state.name == "PROCESSING":
                            time.sleep(10)
                            video_file = get_file(video_file.name)

                        # Check if processing failed
                        if video_file.state.name == "FAILED":
                            remove_file(local_video_path)  # Remove the file if processing fails
                            raise ValueError("Video processing failed.")
                        

                        # Generate transcription with visual descriptions
                        prompt = (
                            "Describe the provided video "
                        )

                        try:
                            print("Using gemini model to process..")
                            model = GenerativeModel(model_name="gemini-1.5-pro-latest")
                            response = model.generate_content([video_file, prompt], request_options={"timeout": 600})
                        except Exception as e:
                            print(f"An error occurred: {e}")
                            return Response({'msg': 'No Data Found'}, status=status.HTTP_200_OK)

                        # Remove the video file after processing
                        remove_file(local_video_path)

                        # Parse HTML content into plain text
                        html_content = response.text
                        plain_text = BeautifulSoup(html_content, "html.parser").get_text()

                        # Remove timestamps from the transcription
                        plain_text_no_timestamps = re.sub(r"\[\d{2}:\d{2}(?::\d{2})?\]", "", plain_text).strip()

                        # Translate the plain text without timestamps into Marathi
                        translated_text = GoogleTranslator(source='auto', target='mr').translate(plain_text_no_timestamps)

                        return plain_text_no_timestamps, translated_text

                        
                    except requests.RequestException as e:
                        print(f"Failed to download video: {e}")
                        return None


                obj_arr = []
                # Process each video URL
                for i, video_url in enumerate(video_urls, start=1):
                    # video_url = video_url.strip()
                    print(f"\nProcessing Video {i} of {len(video_urls)}:")
                    result = process_video(video_url)
                    if result:
                        plain_text, translated_text = result
                        print("\nGenerated Transcription and Visual Descriptions (English):")
                        print(plain_text)
                        print("\nTranslated Transcription and Visual Descriptions (Marathi):")
                        print(translated_text)
                        obj = {
                            "Text_in_English" : plain_text,
                            "Text_in_Marathi" : translated_text
                        }
                        obj_arr.append({f"video {i}": obj})
                    else:
                        print(f"Failed to process video {i}.")
                return Response(obj_arr, status=status.HTTP_200_OK)
            
            

        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'msg': 'No Data Found'}, status=status.HTTP_200_OK)
        
        
        


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import google.generativeai as genai
# from PIL import Image
# import os

# API_KEY = "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"
# genai.configure(api_key=API_KEY)

# @csrf_exempt
# def image_to_text(request):
#     if request.method == 'POST':
#         try:
#             image = request.FILES.get('image')

#             if not image:
#                 return JsonResponse({'error': 'No image provided!'}, status=400)

#             img = Image.open(image)

#             text_param = "Describe the image"

#             model = genai.GenerativeModel('gemini-1.5-flash')  
#             response = model.generate_content([text_param, img])  

#             return JsonResponse({'generated_text': response.text})

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid HTTP method. Please use POST.'}, status=405)




# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import google.generativeai as genai
# from PIL import Image
# from googletrans import Translator
# import os

# # API_KEY = "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"AIzaSyDgsUPq-BvZhf39x09A-Q9A98HzpwZ2da8
# API_KEY = "AIzaSyDgsUPq-BvZhf39x09A-Q9A98HzpwZ2da8"
# genai.configure(api_key=API_KEY)

# @csrf_exempt
# def image_to_text(request):
#     if request.method == 'POST':
#         try:
#             image = request.FILES.get('image')

#             if not image:
#                 return JsonResponse({'error': 'No image provided!'}, status=400)

#             img = Image.open(image)

#             text_param = "Describe the image"

#             model = genai.GenerativeModel('gemini-1.5-flash')  
#             response = model.generate_content([text_param, img])  

#             # Extract the generated text
#             generated_text = response.text

#             # Translate the generated text to Marathi
#             translator = Translator()
#             translated_text = translator.translate(generated_text, src='en', dest='mr').text

#             return JsonResponse({
#                 'English_text': generated_text,
#                 'Marathi_text': translated_text
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid HTTP method. Please use POST.'}, status=405)


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from google.cloud import vision
# from googletrans import Translator
# import os

# # Set the environment variable for the Google API Key (Replace with your key or use direct configuration)
# os.environ["AIzaSyDgsUPq-BvZhf39x09A-Q9A98HzpwZ2da8"] = "path/to/your/service-account-file.json"

# @csrf_exempt
# def image_to_medical_text(request):
#     if request.method == 'POST':
#         try:
#             # Retrieve the uploaded image
#             image = request.FILES.get('image')

#             if not image:
#                 return JsonResponse({'error': 'No image provided!'}, status=400)

#             # Initialize Google Cloud Vision client
#             client = vision.ImageAnnotatorClient()

#             # Convert the image file to byte content
#             content = image.read()

#             # Create an image object for Vision API
#             image_obj = vision.Image(content=content)

#             # Perform OCR on the image
#             response = client.text_detection(image=image_obj)
#             annotations = response.text_annotations

#             if not annotations:
#                 return JsonResponse({'error': 'No text detected in the image.'}, status=400)

#             # Extract the detected text
#             extracted_text = annotations[0].description

#             # Refine text to focus on medical context (for demonstration, using placeholder refinement)
#             refined_text = f"Medical Information Extracted: {extracted_text}"

#             # Translate the refined text to Marathi
#             translator = Translator()
#             translated_text = translator.translate(refined_text, src='en', dest='mr').text

#             return JsonResponse({
#                 'Extracted_Text': extracted_text,
#                 'Medical_Text': refined_text,
#                 'Translated_Text': translated_text
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid HTTP method. Please use POST.'}, status=405)





# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import google.generativeai as genai
# from PIL import Image
# from googletrans import Translator
# import os

# # API Key for Google Generative AI
# API_KEY = "AIzaSyDgsUPq-BvZhf39x09A-Q9A98HzpwZ2da8"
# genai.configure(api_key=API_KEY)

# @csrf_exempt
# def image_to_text(request):
#     if request.method == 'POST':
#         try:
#             # Check if an image is provided
#             image = request.FILES.get('image')
#             if not image:
#                 return JsonResponse({'error': 'No image provided!'}, status=400)

#             # Open the image
#             img = Image.open(image)

#             # Generate a specific prompt for medical conditions
#             text_param = "Describe only medical conditions observed in the image."

#             # Use the generative model
#             model = genai.GenerativeModel('gemini-1.5-flash')
#             response = model.generate_content([text_param, img])

#             # Debugging: Print the response to inspect its structure
#             print("Response from generative model:", response)

#             # Check if response and text are valid
#             if not response or not hasattr(response, 'text') or response.text is None:
#                 return JsonResponse({'error': 'No text generated from the image!'}, status=500)

#             # Full generated text from the image
#             generated_text = response.text

#             # Debugging: Print the generated text
#             print("Generated text:", generated_text)

#             # Extract medical-related content
#             medical_keywords = ["disease", "condition", "symptom", "treatment", "diagnosis", "medicine", "therapy"]
#             medical_text = "\n".join(
#                 [line for line in generated_text.splitlines() if any(keyword in line.lower() for keyword in medical_keywords)]
#             )

#             # Translate the full text to Marathi
#             translator = Translator()
#             translated_text = translator.translate(generated_text, src='en', dest='mr').text

#             # Prepare the response
#             response_data = {
#                 'Generated_Text': generated_text,
#                 # 'Medical_English_Text': medical_text if medical_text else "No specific medical content identified.",
#                 'Medical_Marathi_Text': translated_text
#             }

#             # Return the response
#             return JsonResponse(response_data)

#         except Exception as e:
#             # Debugging: Print the exception details
#             print("Error:", str(e))
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid HTTP method. Please use POST.'}, status=405)







# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import google.generativeai as genai
# from PIL import Image
# from googletrans import Translator
# import json
# import os

# # API Key for Google Generative AI
# API_KEY = "AIzaSyDgsUPq-BvZhf39x09A-Q9A98HzpwZ2da8"
# genai.configure(api_key=API_KEY)

# @csrf_exempt
# def image_to_text(request):
#     if request.method == 'POST':
#         try:
#             # Check if image is uploaded or image_path is provided
#             image = request.FILES.get('image')  # The file input field in form-data
#             image_path = request.POST.get('image_path')  # The path input in form-data

#             if not image and not image_path:
#                 return JsonResponse({'error': 'No image or image path provided!'}, status=400)

#             # Open the image from the uploaded file or the provided path
#             if image:
#                 img = Image.open(image)
#             elif image_path:
#                 if not os.path.exists(image_path):
#                     return JsonResponse({'error': 'Image path does not exist!'}, status=400)
#                 img = Image.open(image_path)

#             # Generate a specific prompt for medical conditions
#             text_param = "Describe only medical conditions observed in the image."

#             # Use the generative model
#             model = genai.GenerativeModel('gemini-1.5-flash')
#             response = model.generate_content([text_param, img])

#             # Check if response and text are valid
#             if not response or not hasattr(response, 'text') or response.text is None:
#                 return JsonResponse({'error': 'No text generated from the image!'}, status=500)

#             # Full generated text from the image
#             generated_text = response.text

#             # Extract medical-related content
#             medical_keywords = ["disease", "condition", "symptom", "treatment", "diagnosis", "medicine", "therapy"]
#             medical_text = "\n".join(
#                 [line for line in generated_text.splitlines() if any(keyword in line.lower() for keyword in medical_keywords)]
#             )

#             # Translate the full text to Marathi
#             translator = Translator()
#             translated_text = translator.translate(generated_text, src='en', dest='mr').text

#             # Prepare the response
#             response_data = {
#                 'Generated_Text': generated_text,
#                 'Medical_Marathi_Text': translated_text
#             }

#             # Return the response
#             return JsonResponse(response_data)

#         except Exception as e:
#             # Print the exception details for debugging
#             print("Error:", str(e))
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid HTTP method. Please use POST.'}, status=405)




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import google.generativeai as genai
from PIL import Image
from googletrans import Translator
import os
import requests
from io import BytesIO

# Configure the Google Generative AI API
API_KEY = "AIzaSyDgsUPq-BvZhf39x09A-Q9A98HzpwZ2da8"
genai.configure(api_key=API_KEY)

@csrf_exempt
def image_to_text(request):
    if request.method == 'POST':
        try:
            # Retrieve the uploaded image or image path from the request
            image = request.FILES.get('image')  # File upload in form-data
            image_paths = request.POST.get('image_path')  # Image paths in form-data

            if not image and not image_paths:
                return JsonResponse({'error': 'No image or image path provided!'}, status=400)

            # Prepare a list of images to process
            images_to_process = []

            # Process uploaded file
            if image:
                images_to_process.append(Image.open(image))

            # Process image paths (local or URL)
            if image_paths:
                paths = image_paths.split(",")  # Handle multiple paths, comma-separated
                for path in paths:
                    path = path.strip()
                    if path.startswith("http://") or path.startswith("https://"):
                        # Check if the URL is a media file served by Django
                        if path.startswith(request.build_absolute_uri(settings.MEDIA_URL)):
                            # Convert media URL to local file path
                            relative_path = path.replace(request.build_absolute_uri(settings.MEDIA_URL), "")
                            full_image_path = os.path.join(settings.MEDIA_ROOT, relative_path)
                            if os.path.exists(full_image_path):
                                images_to_process.append(Image.open(full_image_path))
                            else:
                                return JsonResponse({'error': f'File not found: {full_image_path}'}, status=400)
                        else:
                            # Handle remote URLs
                            response = requests.get(path)
                            if response.status_code == 200:
                                images_to_process.append(Image.open(BytesIO(response.content)))
                            else:
                                return JsonResponse({'error': f'Failed to download image from URL: {path}'}, status=400)
                    else:
                        # Assume it's a local file path relative to MEDIA_ROOT
                        full_image_path = os.path.join(settings.MEDIA_ROOT, path.strip('/'))
                        if os.path.exists(full_image_path):
                            images_to_process.append(Image.open(full_image_path))
                        else:
                            return JsonResponse({'error': f'File not found: {full_image_path}'}, status=400)

            # Generate text for each image
            results = []
            for img in images_to_process:
                text_param = "Describe only medical conditions observed in the image."
                model = genai.GenerativeModel('gemini-1.5-flash')
                response = model.generate_content([text_param, img])

                if not response or not hasattr(response, 'text') or response.text is None:
                    results.append({'error': 'No text generated from the image!'})
                    continue

                generated_text = response.text
                medical_keywords = ["disease", "condition", "symptom", "treatment", "diagnosis", "medicine", "therapy"]
                medical_text = "\n".join(
                    [line for line in generated_text.splitlines() if any(keyword in line.lower() for keyword in medical_keywords)]
                )

                translator = Translator()
                translated_text = translator.translate(generated_text, src='en', dest='mr').text

                results.append({
                    'Generated_Text': generated_text,
                    'Medical_Marathi_Text': translated_text
                })

            return JsonResponse({'results': results})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method. Please use POST.'}, status=405)


class Saved_image_api(APIView):
    def post(self,request):
        serializers = image_save_Serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)



        

class saved_image_get_api(APIView):
    def get(self,request):
        snippet = image_save_table.objects.all()
        serializers = image_get_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)
    
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.conf import settings
from .models import image_save_table
from PIL import Image
import os

class UploadAndGenerate360ImageView(APIView):
    parser_classes = [MultiPartParser]  # Enable file upload parsing

    def post(self, request, *args, **kwargs):
        # Retrieve the uploaded images
        images = request.FILES.getlist('images')
        if len(images) < 2:
            return Response({"error": "Please upload at least two images for processing."}, status=400)
        
        saved_images = []
        image_paths = []

        for image in images:
            # Save each image to the database and file system
            instance = image_save_table.objects.create(image=image)
            saved_images.append(instance)
            image_paths.append(instance.image.path)

        # Generate 360-degree image (placeholder function)
        output_path = os.path.join(settings.MEDIA_ROOT, 'output_360_image.jpg')
        generate_360_image(image_paths, output_path)

        # Respond with saved images and the 360-degree image URL
        return Response({
            "message": "Images uploaded successfully and 360-degree image generated.",
            "uploaded_images": [img.image.url for img in saved_images],
            "360_image_url": request.build_absolute_uri(settings.MEDIA_URL + 'output_360_image.jpg')
        })

def generate_360_image(image_paths, output_path):
    """
    Example function to stitch images into a 360-degree panorama.
    Replace with a more advanced library for actual 3D rendering.
    """
    images = [Image.open(path) for path in image_paths]
    widths, heights = zip(*(img.size for img in images))
    total_width = sum(widths)
    max_height = max(heights)

    panorama = Image.new('RGB', (total_width, max_height))
    x_offset = 0
    for img in images:
        panorama.paste(img, (x_offset, 0))
        x_offset += img.width

    panorama.save(output_path)
    
    
    
    
# import qrcode
# from django.http import HttpResponse
# from rest_framework.views import APIView
# from rest_framework.response import Response
# import os
# from django.conf import settings
# from io import BytesIO
# from PIL import Image

# class QRCodeGenerateAPIView(APIView):
#     def post(self, request, *args, **kwargs):
#         # Retrieve keys from the request body
#         citizen_id = request.data.get("citizen_id")
#         schedule_id = request.data.get("schedule_id")
#         citizens_pk_id = request.data.get("citizens_pk_id")

#         # Validate the input data
#         if not all([citizen_id, schedule_id, citizens_pk_id]):
#             return Response({"error": "All keys (citizen_id, schedule_id, citizens_pk_id) are required."}, status=400)

#         # Default link
#         default_link = "http://122.176.232.35:9000/screening/dental_assesment/"

#         # Generate QR Code
#         qr = qrcode.QRCode(
#             version=1,
#             error_correction=qrcode.constants.ERROR_CORRECT_L,
#             box_size=8,
#             border=1,
#         )
#         qr.add_data(default_link)
#         qr.make(fit=True)
#         qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

#         # Prepare a filename for the QR code image
#         file_name = f"qr_code_{citizen_id}_{schedule_id}_{citizens_pk_id}.png"

#         # Save the image to the 'media_files' folder
#         file_path = os.path.join(settings.MEDIA_ROOT, 'media_files', file_name)

#         # Ensure the 'media_files' directory exists
#         os.makedirs(os.path.dirname(file_path), exist_ok=True)

#         # Save the image to the file system
#         qr_img.save(file_path)

#         # Construct the URL to access the saved image
#         qr_code_url = os.path.join(settings.MEDIA_URL, 'media_files', file_name)

#         # Prepare the response data with a URL to the QR code image
#         response_data = {
#             "citizen_id": citizen_id,
#             "schedule_id": schedule_id,
#             "citizens_pk_id": citizens_pk_id,
#             "qr_code_image": qr_code_url  # Send the URL to the image
#         }

#         # Return the response
#         return Response(response_data)





import qrcode
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from django.conf import settings
from io import BytesIO
from PIL import Image

class QRCodeGenerateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve keys from the request body
        citizen_id = request.data.get("citizen_id")
        schedule_id = request.data.get("schedule_id")
        citizens_pk_id = request.data.get("citizens_pk_id")

        # Validate the input data
        if not all([citizen_id, schedule_id, citizens_pk_id]):
            return Response({"error": "All keys (citizen_id, schedule_id, citizens_pk_id) are required."}, status=400)

        # Construct the dynamic URL with query parameters
        base_url = "http://122.176.232.35:9000/screening/dental_assesment/"
        qr_code_url = f"{base_url}?schedule_id={schedule_id}&citizen_id={citizen_id}&citizen_pk_id={citizens_pk_id}"

        # Generate QR Code with the dynamic URL
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=8,
            border=1,
        )
        qr.add_data(qr_code_url)  # Encode the full dynamic URL in the QR code
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

        # Prepare a filename for the QR code image
        file_name = f"qr_code_{citizen_id}_{schedule_id}_{citizens_pk_id}.png"

        # Save the image to the 'media_files' folder
        file_path = os.path.join(settings.MEDIA_ROOT, 'media_files', file_name)

        # Ensure the 'media_files' directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the image to the file system
        qr_img.save(file_path)

        # Construct the URL to access the saved image
        qr_code_image_url = os.path.join(settings.MEDIA_URL, 'media_files', file_name)

        # Prepare the response data
        response_data = {
            "citizen_id": citizen_id,
            "schedule_id": schedule_id,
            "citizens_pk_id": citizens_pk_id,
            "qr_code_url": qr_code_url,  # URL stored in QR code
            "qr_code_image": qr_code_image_url  # URL to the generated QR code image
        }

        return Response(response_data)




# import os
# from PIL import Image
# from django.http import JsonResponse
# from rest_framework.views import APIView
# from io import BytesIO
# import requests
# from django.conf import settings
# import re  # For regular expression
# from googletrans import Translator

# class DentalScreeningAPIView(APIView):
#     def post(self, request, *args, **kwargs):
#         # Retrieve the uploaded image or image path from the request
#         image = request.FILES.get('image')  # File upload in form-data
#         image_paths = request.POST.get('image_path')  # Image paths in form-data

#         if not image and not image_paths:
#             return JsonResponse({'error': 'No image or image path provided!'}, status=400)

#         # Prepare a list of images to process
#         images_to_process = []

#         # Process uploaded file
#         if image:
#             images_to_process.append(Image.open(image))

#         # Process image paths (local or URL)
#         if image_paths:
#             paths = image_paths.split(",")  # Handle multiple paths, comma-separated
#             for path in paths:
#                 path = path.strip()  # Strip extra spaces or special characters
                
#                 # Remove all invisible characters using regular expression
#                 path = re.sub(r'[\u200b-\u200d\u202a\u202b\u202c\u200e\u200f\u202d\u202e\u200c\u200f]', '', path)
                
#                 # Check if the path is a local file path or URL
#                 if path.startswith("http://") or path.startswith("https://"):
#                     # Handle remote URLs
#                     response = requests.get(path)
#                     if response.status_code == 200:
#                         images_to_process.append(Image.open(BytesIO(response.content)))
#                     else:
#                         return JsonResponse({'error': f'Failed to download image from URL: {path}'}, status=400)
#                 else:
#                     # Assuming it's a local file path
#                     full_image_path = os.path.join(settings.MEDIA_ROOT, path.strip('/'))
                    
#                     if os.path.exists(full_image_path):
#                         images_to_process.append(Image.open(full_image_path))
#                     else:
#                         return JsonResponse({'error': f'File not found: {full_image_path}'}, status=400)

#         # Default input prompt
#         default_prompt = "Analyze this dental image and describe any abnormalities or conditions observed."
        
#         # Get input prompt from the request, or use the default
#         input_prompt = request.data.get('input_prompt', default_prompt)
        
#         # Dummy AI response for demonstration (replace this with your AI model integration)
#         generated_text = "The teeth appear healthy with no visible signs of cavities or discoloration."
        
#         # Translate the text to Marathi (example, replace with your actual translator logic)
#         translator = Translator()
#         translated_text = translator.translate(generated_text, src='en', dest='mr').text
        
#         # Analyze conditions (dummy logic for now)
#         conditions = {
#             "oral_hygine": "GOOD",
#             "gum_condition": "GOOD",
#             "discolouration_of_teeth": "NO",
#             "oral_ulcers": "NO",
#             "food_impaction": "NO",
#             "fluorosis": "NO",
#             "carious_teeth": "NO"
#         }

#         responses = []

#         for image in images_to_process:
#             # Append the response for this image
#             responses.append({
#                 'english': generated_text,
#                 'marathi': translated_text,
#                 'conditions': conditions
#             })

#         return JsonResponse({'result': responses}, safe=False)




# import os
# import re
# import requests
# from io import BytesIO
# from PIL import Image
# from django.conf import settings
# from django.http import JsonResponse
# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser

# class DentalScreeningAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)  # Allows file & form-data parsing

#     def post(self, request, *args, **kwargs):
#         # Retrieve uploaded image or image path
#         image = request.FILES.get('image')  # File upload
#         image_paths = request.POST.get('image_path')  # Image path(s) from form-data

#         if not image and not image_paths:
#             return JsonResponse({'error': 'No image or image path provided!'}, status=400)

#         images_to_process = []

#         # Process uploaded file
#         if image:
#             images_to_process.append(Image.open(image))

#         # Process image paths (local file or URL)
#         if image_paths:
#             paths = image_paths.split(",")  # Multiple paths (comma-separated)
#             for path in paths:
#                 path = path.strip()  # Clean path

#                 # Remove invisible characters
#                 path = re.sub(r'[\u200b-\u200d\u202a-\u202e\u200e\u200f]', '', path)

#                 if path.startswith("http://") or path.startswith("https://"):
#                     # Download image from URL
#                     response = requests.get(path)
#                     if response.status_code == 200:
#                         images_to_process.append(Image.open(BytesIO(response.content)))
#                     else:
#                         return JsonResponse({'error': f'Failed to download image from URL: {path}'}, status=400)
#                 else:
#                     # Local file path
#                     full_image_path = os.path.join(settings.MEDIA_ROOT, path.strip('/'))
#                     if os.path.exists(full_image_path):
#                         images_to_process.append(Image.open(full_image_path))
#                     else:
#                         return JsonResponse({'error': f'File not found: {full_image_path}'}, status=400)

#         # Default input prompt
#         input_prompt = request.data.get('input_prompt', "Analyze this dental image and describe any abnormalities or conditions observed.")

#         responses = []

#         for image in images_to_process:
#             # **Call Gemini AI API for analysis**
#             generated_text = self.analyze_with_gemini(input_prompt)

#             # Translate to Marathi (Using Google Translator API)
#             translated_text = self.translate_to_marathi(generated_text)

#             # Dummy conditions for now (replace with AI-based analysis)
#             conditions = {
#                 "oral_hygiene": "GOOD",
#                 "gum_condition": "GOOD",
#                 "discolouration_of_teeth": "NO",
#                 "oral_ulcers": "NO",
#                 "food_impaction": "NO",
#                 "fluorosis": "NO",
#                 "carious_teeth": "NO"
#             }

#             responses.append({
#                 'english': generated_text,
#                 'marathi': translated_text,
#                 'conditions': conditions
#             })

#         return JsonResponse({'result': responses}, safe=False)

#     def analyze_with_gemini(self, input_text):
#         GCP_API_KEY = "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"  # Replace with your actual API key
#         GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key={GCP_API_KEY}"

#         data = {
#             "prompt": {"text": input_text},
#             "max_tokens": 100  # Adjust token limit as needed
#         }

#         headers = {
#             "Content-Type": "application/json"
#         }

#         try:
#             response = requests.post(GEMINI_API_URL, json=data, headers=headers, timeout=10)
#             response.raise_for_status()  # Raise error for bad responses (4xx, 5xx)

#             response_json = response.json()
#             return response_json.get('candidates', [{}])[0].get('output', "No response generated.")
        
#         except requests.exceptions.RequestException as e:
#             return f"API Error: {str(e)}"

#     def translate_to_marathi(self, text):
#         """
#         Calls Google Translate API to convert text to Marathi.
#         """
#         GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2"
#         API_KEY = "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"  # Replace with actual API key

#         params = {
#             "q": text,
#             "source": "en",
#             "target": "mr",
#             "format": "text",
#             "key": "AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"
#         }

#         try:
#             response = requests.get(GOOGLE_TRANSLATE_API_URL, params=params)
#             response.raise_for_status()
#             result = response.json()
#             return result["data"]["translations"][0]["translatedText"]
#         except requests.exceptions.RequestException as e:
#             return f"Translation API Error: {str(e)}"






from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import google.generativeai as genai
from googletrans import Translator
from PIL import Image

# Configure Google AI
genai.configure(api_key="AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM")

# Initialize Translator
translator = Translator()

class DentalScreeningAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Support file uploads

    def post(self, request, *args, **kwargs):
        input_prompt = request.data.get('input_prompt', '')
        image_file = request.FILES.get('image')

        if not image_file:
            return Response({"error": "No image file provided"}, status=400)

        try:
            # Open image
            image = Image.open(image_file)

            # Process image with AI Model
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content([input_prompt, image])
            generated_text = response.text

            # Translate generated text to Marathi
            translated_text = translator.translate(generated_text, src='en', dest='mr').text

            # Analyze dental conditions
            conditions = analyze_dental_conditions(generated_text)

            return Response({
                "result": [
                    {
                        "english": generated_text,
                        "marathi": translated_text,
                        "conditions": conditions
                    }
                ]
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

# Function to analyze dental conditions
def analyze_dental_conditions(generated_text):
    conditions = {
        "oral_hygiene": "GOOD",
        "gum_condition": "GOOD",
        "discolouration_of_teeth": "NO",
        "oral_ulcers": "NO",
        "food_impaction": "NO",
        "fluorosis": "NO",
        "carious_teeth": "NO"
    }

    lower_text = generated_text.lower()
    if "poor hygiene" in lower_text:
        conditions["oral_hygiene"] = "POOR"
    elif "adequate hygiene" in lower_text:
        conditions["oral_hygiene"] = "FAIR"

    if "gum disease" in lower_text:
        conditions["gum_condition"] = "POOR"
    elif "minor gum issues" in lower_text:
        conditions["gum_condition"] = "FAIR"

    if "stains" in lower_text or "yellowing" in lower_text:
        conditions["discolouration_of_teeth"] = "YES"

    if "ulcer" in lower_text:
        conditions["oral_ulcers"] = "YES"

    if "food stuck" in lower_text:
        conditions["food_impaction"] = "YES"

    if "fluorosis" in lower_text:
        conditions["fluorosis"] = "YES"

    if "cavity" in lower_text or "decay" in lower_text:
        conditions["carious_teeth"] = "YES"

    return conditions






# import requests
# from io import BytesIO
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework import status
# from googletrans import Translator
# import google.generativeai as genai
# from PIL import Image
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Configure Google AI API key
# genai.configure(api_key=os.getenv("AIzaSyB6IPWiMtU5XXtkRlTlFKxR-b8cvMTHACM"))

# # Initialize the translator
# translator = Translator()

# # Function to analyze dental conditions
# def analyze_dental_conditions(generated_text):
#     conditions = {
#         "oral_hygiene": "GOOD",
#         "gum_condition": "GOOD",
#         "discolouration_of_teeth": "NO",
#         "oral_ulcers": "NO",
#         "food_impaction": "NO",
#         "fluorosis": "NO",
#         "carious_teeth": "NO"
#     }

#     lower_text = generated_text.lower()

#     # Check conditions based on AI-generated text
#     if "poor hygiene" in lower_text or "bad oral health" in lower_text:
#         conditions["oral_hygiene"] = "POOR"
#     elif "adequate hygiene" in lower_text or "fair oral health" in lower_text:
#         conditions["oral_hygiene"] = "FAIR"

#     if "gum disease" in lower_text or "inflammation" in lower_text:
#         conditions["gum_condition"] = "POOR"
#     elif "minor gum issues" in lower_text:
#         conditions["gum_condition"] = "FAIR"

#     if "stains" in lower_text or "yellowing" in lower_text or "discoloration" in lower_text:
#         conditions["discolouration_of_teeth"] = "YES"

#     if "ulcer" in lower_text or "sores" in lower_text:
#         conditions["oral_ulcers"] = "YES"

#     if "food stuck" in lower_text or "food particles" in lower_text or "impaction" in lower_text:
#         conditions["food_impaction"] = "YES"

#     if "fluorosis" in lower_text or "white streaks" in lower_text or "excess fluoride" in lower_text:
#         conditions["fluorosis"] = "YES"

#     if "cavity" in lower_text or "decay" in lower_text or "caries" in lower_text:
#         conditions["carious_teeth"] = "YES"

#     return conditions

# # Dental Screening API View
# class DentalScreeningAPIView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         if 'image' not in request.FILES:
#             return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

#         input_prompt = request.data.get("input_prompt", "Analyze this dental image and describe any abnormalities or conditions observed.")

#         # Load image
#         image_file = request.FILES["image"]
#         image = Image.open(image_file)

#         try:
#             # Generate AI response
#             model = genai.GenerativeModel('gemini-1.5-flash')
#             response = model.generate_content([input_prompt, image])
#             generated_text = response.text

#             # Translate text to Marathi
#             translated_text = translator.translate(generated_text, src="en", dest="mr").text

#             # Analyze dental conditions
#             conditions = analyze_dental_conditions(generated_text)

#             return Response({
#                 "english": generated_text,
#                 "marathi": translated_text,
#                 "conditions": conditions
#             }, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class img_analyse_data_save_api(APIView):
    def post(self,request):
        serializers = img_analyse_data_Serializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)
        
# import requests
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# class DeviceDataView(APIView):
#     def get(self, request):
#         # External API URL
#         external_api_url = "http://vision.mintti.cn/vision/open/v1/measure/query/info/1/20/9741805533"

#         # Headers required for the external API
#         headers = {
#             "appId": "91YD10001",
#             "appKey": "f65fb60bf131b5c85ded5623b613719e",
#             "t": "1740997050",
#             "sign": "e1f3299b0526559e09d403fa198d8c1b"
#         }

#         # Query parameters (type is required)
#         params = {
#             "type": request.query_params.get("type", "SPO2")  # Default to "SPO2" if not provided
#         }

#         try:
#             # Call the external API
#             response = requests.get(external_api_url, headers=headers, params=params)
#             response_data = response.json()

#             # Return the external API response through your API
#             return Response(response_data, status=response.status_code)
#         except requests.exceptions.RequestException as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# import requests
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# class DeviceDataView(APIView):
#     # Allowed types for the 'type' parameter
#     ALLOWED_TYPES = {"ECG", "SPO2", "BG", "BP", "TEMPERATURE"}

#     def get(self, request):
#         # External API URL
#         external_api_url = "http://vision.mintti.cn/vision/open/v1/measure/query/info/1/20/9741805533"

#         # Headers required for the external API
#         headers = {
#             "appId": "91YD10001",
#             "appKey": "f65fb60bf131b5c85ded5623b613719e",
#             "t": "1740997050",
#             "sign": "e1f3299b0526559e09d403fa198d8c1b"
#         }

#         # Get 'type' parameter and validate
#         type_value = request.query_params.get("type", "SPO2").upper()

#         if type_value not in self.ALLOWED_TYPES:
#             return Response(
#                 {"error": "Invalid type. Allowed values: ECG, SPO2, BG, BP, TEMPERATURE"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Query parameters
#         params = {"type": type_value}

#         try:
#             # Call the external API
#             response = requests.get(external_api_url, headers=headers, params=params)
#             response.raise_for_status()  # Raises an error for HTTP errors (4xx, 5xx)

#             # Parse JSON response
#             response_data = response.json()

#             # Return the external API response through your API
#             return Response(response_data, status=response.status_code)

#         except requests.exceptions.RequestException as e:
#             return Response(
#                 {"error": f"Failed to fetch data from external API: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )







class location_get_api(APIView):
    def get(self, request,source_name_id):
        snippet = agg_sc_location.objects.filter(source_name_id=source_name_id)
        serializers = location_serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class route_get_api(APIView):
    def get(self, request, source_name_id):
        snippet = agg_sc_route.objects.filter(source_name_id=source_name_id)
        serializers = agg_sc_route_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
class ambulance_get_api(APIView):
    def get(self, request):
        snippet = agg_sc_ambulance.objects.all()
        serializers = ambulance_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
class doctor_get_api(APIView):
    def get(self, request):
        snippet = agg_sc_doctor.objects.all()
        serializers = doctor_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
class pilot_get_api(APIView):
    def get(self, request):
        snippet = agg_sc_pilot.objects.all()
        serializers = pilot_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
    


from django.http import JsonResponse
from django.db import connection
from rest_framework.views import APIView

class location_get_APIView(APIView):
    def get(self, request):
        try:
            wrd_inst = request.GET.get("wrd_inst")  

            data = []
            if wrd_inst:   
                with connection.cursor() as cursor:
                    cursor.execute("SELECT ward_id, ward_name FROM ems_mas_ward WHERE wrd_inst = %s", [wrd_inst])
                    rows = cursor.fetchall()
                    columns = [col[0] for col in cursor.description]
                    data = [dict(zip(columns, row)) for row in rows]

            return JsonResponse(data, safe=False, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)




class OtherInfoCount(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Initialize filter parameters with required filters
        filter_params = {}

        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        source_name = request.query_params.get('source_name')
        schedule_id = request.query_params.get('schedule_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')
        
        if source_id is not None:
            filter_params['citizen_pk_id__source'] = source_id
        if type_id is not None:
            filter_params['citizen_pk_id__type'] = type_id
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id
        if source_name is not None:
            filter_params['citizen_pk_id__source_name'] = source_name
        if schedule_id is not None:
            filter_params['schedule_id'] = schedule_id
        if district is not None:
            filter_params['citizen_pk_id__district'] = district
        if tehsil is not None:
            filter_params['citizen_pk_id__tehsil'] = tehsil
        if location is not None:
            filter_params['citizen_pk_id__location'] = location  
        
        # Extract additional filters from query parameters
        for param, value in request.query_params.items():
            if param not in ['source_id', 'type_id', 'class_id','source_name','schedule_id','district','tehsil','location']:  # Add any other fields you want to filter by
                filter_params[param] = value

        # Filter for other counts using filter_params
        total_footfall_count = agg_sc_citizen_other_info.objects.filter(**filter_params, footfall=1).count()
        total_anc_services_count = agg_sc_citizen_other_info.objects.filter(**filter_params, anc_services=1).count()
        total_ifa_supplementation_count = agg_sc_citizen_other_info.objects.filter(**filter_params, ifa_supplementation=1).count()
        total_high_risk_pregnancy_count = agg_sc_citizen_other_info.objects.filter(**filter_params, high_risk_pregnancy=1).count()
        total_pnc_services_count = agg_sc_citizen_other_info.objects.filter(**filter_params, pnc_services=1).count()
        total_leprosy_count = agg_sc_citizen_other_info.objects.filter(**filter_params, leprosy=1).count()
        total_tuberculosis_count = agg_sc_citizen_other_info.objects.filter(**filter_params, tuberculosis=1).count()
        total_scd_count = agg_sc_citizen_other_info.objects.filter(**filter_params, scd=1).count()
        total_hypertension_count = agg_sc_citizen_other_info.objects.filter(**filter_params, hypertension=1).count()
        total_diabetes_count = agg_sc_citizen_other_info.objects.filter(**filter_params, diabetes=1).count()
        total_anaemia_count = agg_sc_citizen_other_info.objects.filter(**filter_params, anaemia=1).count()
        total_cervical_cancer_count = agg_sc_citizen_other_info.objects.filter(**filter_params, cervical_cancer=1).count()
        total_other_conditions_count = agg_sc_citizen_other_info.objects.filter(**filter_params, other_conditions=1).count()
        total_malaria_dengue_rdt_count = agg_sc_citizen_other_info.objects.filter(**filter_params, malaria_dengue_rdt=1).count()
        total_diagnostic_tests_count = agg_sc_citizen_other_info.objects.filter(**filter_params, diagnostic_tests=1).count()
        total_higher_facility_count = agg_sc_citizen_other_info.objects.filter(**filter_params, higher_facility=1).count()

        
        

        

        return Response({
            "total_footfall_count": total_footfall_count,
            "total_anc_services_count": total_anc_services_count,
            "total_ifa_supplementation_count": total_ifa_supplementation_count,
            "total_high_risk_pregnancy_count": total_high_risk_pregnancy_count,
            "total_pnc_services_count": total_pnc_services_count,
            "total_leprosy_count": total_leprosy_count,
            "total_tuberculosis_count": total_tuberculosis_count,
            "total_scd_count": total_scd_count,
            "total_hypertension_count": total_hypertension_count,
            "total_diabetes_count": total_diabetes_count,
            "total_anaemia_count": total_anaemia_count,
            "total_cervical_cancer_count": total_cervical_cancer_count,
            "total_other_conditions_count": total_other_conditions_count,
            "total_malaria_dengue_rdt_count": total_malaria_dengue_rdt_count,
            "total_diagnostic_tests_count": total_diagnostic_tests_count,
            "total_higher_facility_count": total_higher_facility_count,
        }, status=status.HTTP_200_OK)
        


class Citizen_Post_Api(APIView):
    def post(self, request):
        Serializer = Citizen_Post_Serializer(data=request.data)
        if Serializer.is_valid():
            Serializer.save()
            return Response(Serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(Serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Workshop_Post_Api(APIView):
    def post(self, request):
        Serializer = Workshop_Post_Serializer(data=request.data)
        if Serializer.is_valid():
            Serializer.save()
            return Response(Serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(Serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Workshop_Get_Api(APIView):
    def get(self, request):
        snippet = Workshop.objects.all()
        serializers = Workshop_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
class Citizen_Get_Api(APIView):
    def get(self, request):
        snippet = Citizen.objects.all()
        serializers = Citizen_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
class Citizen_idwise_data_Get_Api(APIView):
    def get(self,request,citizens_pk_id):
        snippet = Citizen.objects.filter(citizens_pk_id=citizens_pk_id)
        serializers = Citizen_idwise_data_Get_Serializer(snippet, many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)


class Citizen_Update_API(APIView):

    def get(self, request, citizens_pk_id):
        try:
            citizen = Citizen.objects.get(citizens_pk_id=citizens_pk_id)
            serializer = Citizen_idwise_data_Get_Serializer(citizen)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Citizen.DoesNotExist:
            return Response({'error': 'Citizen not found'}, status=status.HTTP_404_NOT_FOUND)

    # 🔹 PUT Update Citizen by ID
    def put(self, request, citizens_pk_id):
        try:
            citizen = Citizen.objects.get(citizens_pk_id=citizens_pk_id)
        except Citizen.DoesNotExist:
            return Response({'error': 'Citizen not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = Citizen_Put_Serializer(citizen, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Citizen updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class CheckCitizenScreening(APIView):
    # ------------------------
    # GET → Check existing screening
    # ------------------------
    def get(self, request, citizen_pk_id):
        try:
            latest_screening = Screening_citizen.objects.filter(
                citizen_pk_id=citizen_pk_id
            ).order_by('-added_date').first()

            if latest_screening:
                serializer = ScreeningCitizenSerializer(latest_screening)
                return Response({
                    "citizen_exists": True,
                    "message": "Previous screening found.",
                    "latest_screening": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "citizen_exists": False,
                    "message": "No previous screenings found for this citizen."
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ------------------------
    # POST → Create new screening
    # ------------------------
    def post(self, request, citizen_pk_id):
        try:
            # Find latest screening to increment count
            latest_screening = Screening_citizen.objects.filter(
                citizen_pk_id=citizen_pk_id
            ).order_by('-added_date').first()

            if latest_screening:
                next_count = (latest_screening.screening_count or 0) + 1
            else:
                next_count = 1  # First screening
                
            citizen_obj = Citizen.objects.get(citizens_pk_id=citizen_pk_id)

            # Create new record
            new_screening = Screening_citizen.objects.create(
                citizen_pk_id_id=citizen_pk_id,
                screening_count=next_count,
                citizen_id=citizen_obj.citizen_id,
                added_by=request.data.get('added_by', 'Mohin'),
                modify_by=request.data.get('modify_by', 'Mohin')
            )

            serializer = ScreeningCitizenSerializer(new_screening)
            return Response({
                "message": "New screening created successfully.",
                "is_created": True,
                "new_screening": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        


class BasicInfoSaveAPI(APIView):
    def post(self, request, pk_id):
        try:
            # 1️⃣ Fetch Screening record
            screening = Screening_citizen.objects.filter(pk_id=pk_id).first()
            if not screening:
                return Response({
                    "success": False,
                    "message": "No screening record found for the given ID."
                }, status=status.HTTP_404_NOT_FOUND)

            # 2️⃣ Fetch linked Citizen record
            citizen = screening.citizen_pk_id
            if not citizen:
                return Response({
                    "success": False,
                    "message": "No citizen linked to this screening."
                }, status=status.HTTP_404_NOT_FOUND)

            # ✅ 3️⃣ Check if BasicInfo already exists for this screening
            existing_basic_info = basic_info.objects.filter(screening_citizen_id=screening.pk_id).order_by('-basic_pk_id').first()
            if existing_basic_info:
                serializer = basic_info_Save_Serializer(existing_basic_info)
                return Response({
                    "success": True,
                    "message": "Basic info already exists.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)

            # 4️⃣ Prepare data for saving in basic_info
            data = {
                "screening_citizen_id": screening.pk_id,
                "citizen_pk_id": citizen.citizens_pk_id,
                "citizen_id": citizen.citizen_id,
                "screening_count": screening.screening_count,
                "prefix": citizen.prefix,
                "name": citizen.name,
                "gender": citizen.gender.pk if citizen.gender else None,
                "blood_group": citizen.blood_groups,
                "dob": citizen.dob,
                "year": citizen.year,
                "months": citizen.months,
                "days": citizen.days,
                "aadhar_id": citizen.aadhar_id,
                "phone_no": citizen.mobile_no,
                "added_by": request.data.get("added_by", "Mohin"),
                "modify_by": request.data.get("modify_by", "Mohin"),
            }

            # 5️⃣ Serialize and save new record
            serializer = basic_info_Save_Serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "success": True,
                    "message": "Basic info saved successfully.",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        


class EmergencyInfoSaveAPI(APIView):
    def post(self, request, pk_id):
        try:
            # 1️⃣ Fetch Screening record
            screening = Screening_citizen.objects.filter(pk_id=pk_id).first()
            if not screening:
                return Response({
                    "success": False,
                    "message": "No screening record found for the given ID."
                }, status=status.HTTP_404_NOT_FOUND)

            # 2️⃣ Fetch linked Citizen record
            citizen = screening.citizen_pk_id
            if not citizen:
                return Response({
                    "success": False,
                    "message": "No citizen linked to this screening."
                }, status=status.HTTP_404_NOT_FOUND)

            # 3️⃣ Check if emergency_info already exists for this screening
            existing_emergency_info = emergency_info.objects.filter(
                screening_citizen_id=screening.pk_id
            ).order_by('-em_pk_id').first()

            if existing_emergency_info:
                serializer = emergency_info_Save_Serializer(existing_emergency_info)
                return Response({
                    "success": True,
                    "message": "Emergency info already exists.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)

            # 4️⃣ Prepare data for saving new emergency_info record
            data = {
                "screening_citizen_id": screening.pk_id,
                "citizen_pk_id": citizen.citizens_pk_id,
                "citizen_id": citizen.citizen_id,
                "screening_count": screening.screening_count,
                "emergency_prefix": citizen.emergency_prefix,
                "emergency_fullname": citizen.emergency_fullname,
                "emergency_gender": citizen.emergency_gender,
                "emergency_contact": citizen.emergency_contact,
                "relationship_with_employee": citizen.relationship_with_employee,
                "emergency_address": citizen.emergency_address,
                "added_by": request.data.get("added_by", "Mohin"),
                "modify_by": request.data.get("modify_by", "Mohin"),
            }

            # 5️⃣ Validate & save
            serializer = emergency_info_Save_Serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "success": True,
                    "message": "Emergency info saved successfully.",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class GrowthMonitoringInfoSaveAPI(APIView):
    def post(self, request, pk_id):
        try:
            # 1️⃣ Fetch Screening record
            screening = Screening_citizen.objects.filter(pk_id=pk_id).first()
            if not screening:
                return Response({
                    "success": False,
                    "message": "No screening record found for the given ID."
                }, status=status.HTTP_404_NOT_FOUND)

            # 2️⃣ Fetch linked Citizen record
            citizen = screening.citizen_pk_id
            if not citizen:
                return Response({
                    "success": False,
                    "message": "No citizen linked to this screening."
                }, status=status.HTTP_404_NOT_FOUND)

            # 3️⃣ Check if growth_monitoring_info already exists for this screening
            existing_growth_info = growth_monitoring_info.objects.filter(
                screening_citizen_id=screening.pk_id
            ).order_by('-growth_pk_id').first()

            if existing_growth_info:
                serializer = growth_monitoring_info_Save_Serializer(existing_growth_info)
                return Response({
                    "success": True,
                    "message": "Growth monitoring info already exists.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)

            # 4️⃣ Prepare data for saving new record
            data = {
                "screening_citizen_id": screening.pk_id,
                "citizen_pk_id": citizen.citizens_pk_id,
                "citizen_id": citizen.citizen_id,
                "screening_count": screening.screening_count,
                "gender": citizen.gender.pk if citizen.gender else None,
                "dob": citizen.dob,
                "year": citizen.year,
                "months": citizen.months,
                "days": citizen.days,
                "height": citizen.height,
                "weight": citizen.weight,
                "weight_for_age": citizen.weight_for_age,
                "height_for_age": citizen.height_for_age,
                "weight_for_height": citizen.weight_for_height,
                "bmi": citizen.bmi,
                "arm_size": citizen.arm_size,
                "symptoms": citizen.symptoms,
                "added_by": request.data.get("added_by", "Mohin"),
                "modify_by": request.data.get("modify_by", "Mohin"),
            }

            # 5️⃣ Serialize and save
            serializer = growth_monitoring_info_Save_Serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "success": True,
                    "message": "Growth monitoring info saved successfully.",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": "Validation failed.",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class Citizen_BasicInfo_Update_API(APIView):
    def put(self, request, citizen_pk_id):
        try:
            # ✅ Step 1: Update Citizen table
            try:
                citizen = Citizen.objects.get(citizens_pk_id=citizen_pk_id)
            except Citizen.DoesNotExist:
                return Response(
                    {"success": False, "message": "Citizen not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            citizen_serializer = basic_info_Citizen_Put_Serializer(
                citizen, data=request.data, partial=True
            )
            if not citizen_serializer.is_valid():
                return Response(
                    {
                        "success": False,
                        "message": "Citizen validation failed.",
                        "errors": citizen_serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            citizen_serializer.save()

            # ✅ Step 2: Get all related basic_info records
            basic_info_records = basic_info.objects.filter(citizen_pk_id=citizen_pk_id)
            if not basic_info_records.exists():
                return Response(
                    {"success": False, "message": "No basic_info records found for this citizen."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # ✅ Step 3: Update all basic_info records
            updated_records = []
            for record in basic_info_records:
                basic_serializer = basic_info_Put_Serializer(
                    record, data=request.data, partial=True
                )
                if basic_serializer.is_valid():
                    basic_serializer.save()
                    updated_records.append(basic_serializer.data)
                else:
                    return Response(
                        {
                            "success": False,
                            "message": "Validation failed for one or more basic_info records.",
                            "errors": basic_serializer.errors,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # ✅ Step 4: Return success
            return Response(
                {
                    "success": True,
                    "message": "Citizen and all linked basic_info records updated successfully.",
                    "Citizen_Data": citizen_serializer.data,
                    "Updated_Basic_Info_Records": updated_records,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
        

class Emergency_Info_Update_API(APIView):
    def put(self, request, citizen_pk_id):
        try:
            # ✅ Step 1: Update Citizen table
            try:
                citizen = Citizen.objects.get(citizens_pk_id=citizen_pk_id)
            except Citizen.DoesNotExist:
                return Response(
                    {"success": False, "message": "Citizen not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            citizen_serializer = emergency_info_Citizen_Put_Serializer(
                citizen, data=request.data, partial=True
            )
            if not citizen_serializer.is_valid():
                return Response(
                    {
                        "success": False,
                        "message": "Citizen validation failed.",
                        "errors": citizen_serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            citizen_serializer.save()

            # ✅ Step 2: Get all related emergency_info records
            emergency_records = emergency_info.objects.filter(citizen_pk_id=citizen_pk_id)
            if not emergency_records.exists():
                return Response(
                    {"success": False, "message": "No emergency_info records found for this citizen."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # ✅ Step 3: Update all emergency_info records
            updated_records = []
            for record in emergency_records:
                emergency_serializer = emergency_info_Put_Serializer(
                    record, data=request.data, partial=True
                )
                if emergency_serializer.is_valid():
                    emergency_serializer.save()
                    updated_records.append(emergency_serializer.data)
                else:
                    return Response(
                        {
                            "success": False,
                            "message": "Validation failed for one or more emergency_info records.",
                            "errors": emergency_serializer.errors,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # ✅ Step 4: Return success response
            return Response(
                {
                    "success": True,
                    "message": "Citizen and all linked emergency_info records updated successfully.",
                    "Citizen_Data": citizen_serializer.data,
                    "Updated_Emergency_Info_Records": updated_records,
                    "updated_records_count": len(updated_records)
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            

class GrowthMonitoringInfoUpdateAPI(APIView):
    def get(self, request, growth_pk_id):
        """Retrieve record by growth_pk_id"""
        try:
            record = growth_monitoring_info.objects.get(growth_pk_id=growth_pk_id)
            serializer = growth_monitoring_info_Put_Serializer(record)
            return Response(
                {"success": True, "data": serializer.data},
                status=status.HTTP_200_OK
            )
        except growth_monitoring_info.DoesNotExist:
            return Response(
                {"success": False, "message": "Record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, growth_pk_id):
        """Update record by growth_pk_id"""
        try:
            record = growth_monitoring_info.objects.get(growth_pk_id=growth_pk_id)
        except growth_monitoring_info.DoesNotExist:
            return Response(
                {"success": False, "message": "Record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = growth_monitoring_info_Put_Serializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Growth monitoring info updated successfully.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )




from rest_framework.views import APIView
from rest_framework.response import Response

class pulse_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, pulse, year):
        if year <= 18:  #for Child
            if(pulse>=80 and pulse<=120):
                return Response({'message': 'Normal'})
            elif(pulse<80):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        elif year >=18:  # For adults
            if(pulse>=60 and pulse<=100):
                return Response({'message': 'Normal'})
            elif(pulse<80):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        else:
            year >=60  
            if(pulse>=60 and pulse<=100):
                return Response({'message': 'Normal'})
            elif(pulse<80):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
            
class rr_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, rr, year):

        if year <= 18: 
            if(rr>=16 and rr<=30):
                return Response({'message': 'Normal'})
            elif(rr<16):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        elif year>=18:
            if(rr>=12 and rr<=20):
                return Response({'message': 'Normal'})
            elif(rr<12):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})    
        else:  
            if(rr>=12 and rr<=25):
                return Response({'message': 'Normal'})
            elif(rr<12):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
            
class temp_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, temp, year):

        if year <= 18: 
            if(temp>=97 and temp<=99):
                return Response({'message': 'Normal'})
            elif(temp<97):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        elif year>=18:
            if(temp>=97 and temp<=99):
                return Response({'message': 'Normal'})
            elif(temp<97):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})    
        else:  
            if(temp>=97 and temp<=99):
                return Response({'message': 'Normal'})
            elif(temp<97):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})



# class hb_get_api(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self, request, hb, year,gender):
#         hb = float(hb)
#         if gender == 1: 
#             if year <= 18: 
#                 if(hb>=11 and hb<=13):
#                     return Response({'message': 'normal'})
#                 elif(hb<11):
#                     return Response({'message': 'low'})
#                 else:
#                     return Response({'message': 'high'})
#             elif year>=18:
#                 if(hb>=14 and hb<=18):
#                     return Response({'message': 'normal'})
#                 elif(hb<14):
#                     return Response({'message': 'low'})
#                 else:
#                     return Response({'message': 'high'})    
#             else:  
#                 if(hb>=12.4 and hb<=14.9):
#                     return Response({'message': 'normal'})
#                 elif(hb<12.4):
#                     return Response({'message': 'low'})
#                 else:
#                     return Response({'message': 'high'})

#         elif gender == 2: 
#             if year <= 18: 
#                 if(hb>=11 and hb<=13):
#                     return Response({'message': 'normal'})
#                 elif(hb<11):
#                     return Response({'message': 'low'})
#                 else:
#                     return Response({'message': 'high'})
#             elif year>=18:
#                 if(hb>=12 and hb<=16):
#                     return Response({'message': 'normal'})
#                 elif(hb<12):
#                     return Response({'message': 'low'})
#                 else:
#                     return Response({'message': 'high'})    
#             else:  
#                 if(hb>=11.7 and hb<=13.8):
#                     return Response({'message': 'normal'})
#                 elif(hb<11.7):
#                     return Response({'message': 'low'})
#                 else:
#                     return Response({'message': 'high'})
#         else:
#             return Response({'message': 'Invalid Choice'})


class sys_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, sys, year):
        if year <= 18:  #for Child
            if(sys>=97 and sys<=112):
                return Response({'message': 'Normal'})
            elif(sys<97):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        elif year >=18:  # For adults
            if(sys>=100 and sys<=120):
                return Response({'message': 'Normal'})
            elif(sys<100):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        else:
            year >=60  
            if(sys>=90 and sys<=100):
                return Response({'message': 'Normal'})
            elif(sys<90):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
            
            
class dys_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, dys, year):
        if year <= 18:  #for Child
            if(dys>=57 and dys<=71):
                return Response({'message': 'Normal'})
            elif(dys<57):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        elif year >=18:  # For adults
            if(dys>=80 and dys<=90):
                return Response({'message': 'Normal'})
            elif(dys<80):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        else:
            year >=60  
            if(dys>=80 and dys<=90):
                return Response({'message': 'Normal'})
            elif(dys<80):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
            
class o2sat_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, o2sat, year):
        if year <= 18:  #for Child
            if(o2sat>=95 and o2sat<=100):
                return Response({'message': 'Normal'})
            elif(o2sat<95):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        elif year >=18:  # For adults
            if(o2sat>=95 and o2sat<=100):
                return Response({'message': 'Normal'})
            elif(o2sat<95):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})
        else:
            year >=60  
            if(o2sat>=90 and o2sat<=100):
                return Response({'message': 'Normal'})
            elif(o2sat<90):
                return Response({'message': 'Low'})
            else:
                return Response({'message': 'High'})




import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class DeviceDataView(APIView):
    ALLOWED_TYPES = {"ECG", "SPO2", "BG", "BP", "TEMPERATURE"}

    def get(self, request):
        external_api_url = "http://vision.mintti.cn/vision/open/v1/measure/query/info/1/20/9741805533"

        headers = {
            "appId": "91YD10001",
            "appKey": "f65fb60bf131b5c85ded5623b613719e",
            "t": "1740997050",
            "sign": "e1f3299b0526559e09d403fa198d8c1b"
        }

        type_value = request.query_params.get("type", "SPO2").upper()

        if type_value not in self.ALLOWED_TYPES:
            return Response(
                {"error": "Invalid type. Allowed values: ECG, SPO2, BG, BP, TEMPERATURE"},
                status=status.HTTP_400_BAD_REQUEST
            )

        params = {"type": type_value}

        try:
            response = requests.get(external_api_url, headers=headers, params=params)
            response.raise_for_status()
            response_data = response.json()

            print("External API Response:", response_data)

            # Extract "rows" list inside "data"
            data_list = response_data.get("data", {}).get("rows", [])

            # Validate data_list is a list and not empty
            if isinstance(data_list, list) and data_list:
                latest_entry = max(
                    data_list,
                    key=lambda x: x.get("createTime", 0)  # Sorting based on createTime (Unix timestamp in ms)
                )
                return Response(latest_entry, status=status.HTTP_200_OK)

            return Response({"error": "No valid data found in API response"}, status=status.HTTP_404_NOT_FOUND)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"Failed to fetch data from external API: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

           

class Vital_Post_Api(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare base data
            vital_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Check if vital_info already exists
            vital_obj = vital_info.objects.filter(screening_citizen_id=screening_obj).first()

            if vital_obj:
                # Update existing record
                serializer = vital_info_Serializer(vital_obj, data={**request.data, **vital_data}, partial=True)
                if serializer.is_valid():
                    updated_obj = serializer.save(modify_by=request.data.get('modify_by'))
                    self.handle_follow_up_logic(updated_obj, request, screening_obj)
                    return Response({
                        "message": "Vital info updated successfully",
                        "data": serializer.data,
                        "is_updated": True,
                        "is_created": False
                    }, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Create new record
                serializer = vital_info_Serializer(data={**request.data, **vital_data})
                if serializer.is_valid():
                    created_obj = serializer.save(added_by=request.data.get('added_by'))
                    self.handle_follow_up_logic(created_obj, request, screening_obj)
                    return Response({
                        "message": "Vital info created successfully",
                        "data": serializer.data,
                        "is_updated": False,
                        "is_created": True
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"error": "Invalid pk_id — screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # -------------------------------------------------------
    # 🧩 Helper method: handle follow-up logic automatically
    # -------------------------------------------------------
    def handle_follow_up_logic(self, vital_obj, request, screening_obj):
        """Handles auto creation or soft delete in follow_up based on reffered_to_specialist value."""
        try:
            reffer_value = request.data.get('reffered_to_specialist')
            modify_by = request.data.get('modify_by')
            added_by = request.data.get('added_by')

            # Only handle if reffered_to_specialist is passed
            if reffer_value is not None:
                reffer_value = int(reffer_value)

                # Try to get existing follow-up record for this screening
                follow_obj = follow_up.objects.filter(
                    screening_citizen_id=screening_obj,
                    vital_refer__isnull=False
                ).first()

                # Case 1: referred_to_specialist == 1 → create/update follow_up
                if reffer_value == 1:
                    if follow_obj:
                        follow_obj.vital_refer = 1
                        follow_obj.is_deleted = False
                        follow_obj.modify_by = modify_by
                        follow_obj.save()
                    else:
                        follow_up.objects.create(
                            citizen_id=screening_obj.citizen_id,
                            screening_count=screening_obj.screening_count,
                            citizen_pk_id=screening_obj.citizen_pk_id,
                            screening_citizen_id=screening_obj,
                            vital_refer=1,
                            is_deleted=False,
                            added_by=added_by,
                            modify_by=modify_by
                        )

                # Case 2: referred_to_specialist == 0 → mark as deleted in follow_up
                elif reffer_value == 0 and follow_obj:
                    follow_obj.is_deleted = True
                    follow_obj.vital_refer = 0
                    follow_obj.modify_by = modify_by
                    follow_obj.save()

        except Exception as e:
            print("Follow-up logic error:", str(e))



class Vital_info_Get_api(APIView):
    def get(self, request, pk_id):
        snippet = vital_info.objects.filter(screening_citizen_id=pk_id)
        serializers = vital_info_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


class Genral_Examination_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = genral_examination.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Genral_Examination_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Genral_Examination_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"success": True, "message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Genral_Examination_Get_Api(APIView):
    def get(self, request, pk_id):
        snippet = genral_examination.objects.filter(screening_citizen_id=pk_id)
        serializers = Genral_Examination_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    



        
        
        
class Systemic_Examination_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = systemic_exam.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Systemic_Exam_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Systemic_Exam_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"success": True, "message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Systemic_Examination_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = systemic_exam.objects.filter(screening_citizen_id=pk_id)
        serializers = Systemic_Exam_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)      
    
    
    


class Female_Screening_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = female_screening.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Female_Screening_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Female_Screening_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Female_Screening_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = female_screening.objects.filter(screening_citizen_id=pk_id)
        serializers = Female_Screening_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    

class Disability_Screening_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = disability_screening.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Disability_Screening_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Disability_Screening_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class Disability_Screening_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = disability_screening.objects.filter(screening_citizen_id=pk_id)
        serializers = Disability_Screening_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    

class Birth_Defect_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = birth_defect.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Birth_Defect_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Birth_Defect_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class Birth_Defect_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = birth_defect.objects.filter(screening_citizen_id=pk_id)
        serializers = Birth_Defect_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)



class Childhood_Diseases_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = childhood_diseases.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Childhood_Diseases_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Childhood_Diseases_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Childhood_Disease_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = childhood_diseases.objects.filter(screening_citizen_id=pk_id)
        serializers = Childhood_Diseases_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    

class Deficiencies_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = deficiencies.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Deficiencies_Screening_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Deficiencies_Screening_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Deficiencies_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = deficiencies.objects.filter(screening_citizen_id=pk_id)
        serializers = Deficiencies_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


class SkinCondition_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = skin_conditions.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Skin_Conditions_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Skin_Conditions_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkinCondition_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = skin_conditions.objects.filter(screening_citizen_id=pk_id)
        serializers = Skin_Conditions_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


class Diagnosis_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = diagnosis.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Diagnosis_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Diagnosis_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Diagnosis_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = diagnosis.objects.filter(screening_citizen_id=pk_id)
        serializers = Diagnosis_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
    

class CheckBoxIfNormal_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = check_box_if_normal.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = CheckBoxIfNormal_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = CheckBoxIfNormal_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckBoxIfNormal_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = check_box_if_normal.objects.filter(screening_citizen_id=pk_id)
        serializers = CheckBoxIfNormal_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


class Treatment_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # ✅ Get screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # ✅ Prepare base data
            treatment_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # ✅ Check if record exists
            treatment_obj = treatement.objects.filter(screening_citizen_id=screening_obj).first()

            if treatment_obj:
                # -------- Update Existing --------
                serializer = Treatment_Serializer(treatment_obj, data={**request.data, **treatment_data}, partial=True)
                if serializer.is_valid():
                    updated_obj = serializer.save(modify_by=request.data.get('modify_by'))
                    self.handle_follow_up_logic(updated_obj, request, screening_obj)
                    return Response({
                        "message": "Treatment updated successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                # -------- Create New --------
                serializer = Treatment_Serializer(data={**request.data, **treatment_data})
                if serializer.is_valid():
                    created_obj = serializer.save(added_by=request.data.get('added_by'))
                    self.handle_follow_up_logic(created_obj, request, screening_obj)
                    return Response({
                        "message": "Treatment created successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"error": "Invalid pk_id — screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    # ---------------------------------------------
    # 🧩 Follow-up logic for referred_to_specialist
    # ---------------------------------------------
    def handle_follow_up_logic(self, treatment_obj, request, screening_obj):
        try:
            reffer_value = request.data.get('reffered_to_specialist')
            modify_by = request.data.get('modify_by')
            added_by = request.data.get('added_by')

            if reffer_value is not None:
                reffer_value = int(reffer_value)

                # Find existing follow-up entry for this screening
                follow_obj = follow_up.objects.filter(
                    screening_citizen_id=screening_obj,
                    basic_screening_refer__isnull=False
                ).first()

                # Case 1️⃣: referred_to_specialist == 1 → create/update basic_screening_refer = 1
                if reffer_value == 1:
                    if follow_obj:
                        follow_obj.basic_screening_refer = 1
                        follow_obj.is_deleted = False
                        follow_obj.modify_by = modify_by
                        follow_obj.save()
                    else:
                        follow_up.objects.create(
                            citizen_id=screening_obj.citizen_id,
                            screening_count=screening_obj.screening_count,
                            citizen_pk_id=screening_obj.citizen_pk_id,
                            screening_citizen_id=screening_obj,
                            basic_screening_refer=1,
                            is_deleted=False,
                            added_by=added_by,
                            modify_by=modify_by
                        )

                # Case 2️⃣: referred_to_specialist == 0 → mark deleted
                elif reffer_value == 0 and follow_obj:
                    follow_obj.is_deleted = True
                    follow_obj.basic_screening_refer = 0
                    follow_obj.modify_by = modify_by
                    follow_obj.save()

        except Exception as e:
            print("Follow-up logic error:", str(e))


class Treatment_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = treatement.objects.filter(screening_citizen_id=pk_id)
        serializers = Treatment_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


class Auditory_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # ✅ Get screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # ✅ Prepare base data
            auditory_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # ✅ Check if record already exists
            auditory_obj = auditory_info.objects.filter(screening_citizen_id=screening_obj).first()

            if auditory_obj:
                # -------- Update existing record --------
                serializer = Auditory_Info_Post_Serializer(auditory_obj, data={**request.data, **auditory_data}, partial=True)
                if serializer.is_valid():
                    updated_obj = serializer.save(modify_by=request.data.get('modify_by'))
                    self.handle_follow_up_logic(updated_obj, request, screening_obj)
                    return Response({
                        "message": "Auditory info updated successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # -------- Create new record --------
                serializer = Auditory_Info_Post_Serializer(data={**request.data, **auditory_data})
                if serializer.is_valid():
                    created_obj = serializer.save(added_by=request.data.get('added_by'))
                    self.handle_follow_up_logic(created_obj, request, screening_obj)
                    return Response({
                        "message": "Auditory info created successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"error": "Invalid pk_id — screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # -------------------------------------------------------------
    # 🧩 Handle follow-up logic for referred_to_specialist
    # -------------------------------------------------------------
    def handle_follow_up_logic(self, auditory_obj, request, screening_obj):
        try:
            reffer_value = request.data.get('reffered_to_specialist')
            modify_by = request.data.get('modify_by')
            added_by = request.data.get('added_by')

            if reffer_value is not None:
                reffer_value = int(reffer_value)

                # Find existing follow-up entry for this screening
                follow_obj = follow_up.objects.filter(
                    screening_citizen_id=screening_obj,
                    auditory_refer__isnull=False
                ).first()

                # Case 1️⃣: referred_to_specialist == 1 → create/update auditory_refer = 1
                if reffer_value == 1:
                    if follow_obj:
                        follow_obj.auditory_refer = 1
                        follow_obj.is_deleted = False
                        follow_obj.modify_by = modify_by
                        follow_obj.save()
                    else:
                        follow_up.objects.create(
                            citizen_id=screening_obj.citizen_id,
                            screening_count=screening_obj.screening_count,
                            citizen_pk_id=screening_obj.citizen_pk_id,
                            screening_citizen_id=screening_obj,
                            auditory_refer=1,
                            is_deleted=False,
                            added_by=added_by,
                            modify_by=modify_by
                        )

                # Case 2️⃣: referred_to_specialist == 0 → mark deleted
                elif reffer_value == 0 and follow_obj:
                    follow_obj.is_deleted = True
                    follow_obj.auditory_refer = 0
                    follow_obj.modify_by = modify_by
                    follow_obj.save()

        except Exception as e:
            print("Follow-up logic error:", str(e))

class Auditory_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = auditory_info.objects.filter(screening_citizen_id=pk_id)
        serializers = Auditory_Info_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)



class Vision_Info_Post_Api(APIView):
    def post(self, request, pk_id):
        try:
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            vision_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            vision_obj = vision_info.objects.filter(screening_citizen_id=screening_obj).first()

            if vision_obj:
                # -------- Update existing record --------
                serializer = Vision_Info_Post_Serializer(vision_obj, data={**request.data, **vision_data}, partial=True)
                if serializer.is_valid():
                    updated_obj = serializer.save(modify_by=request.data.get('modify_by'))
                    self.handle_follow_up_logic(updated_obj, request, screening_obj)
                    return Response({
                        "message": "Vision info updated successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # -------- Create new record --------
                serializer = Vision_Info_Post_Serializer(data={**request.data, **vision_data})
                if serializer.is_valid():
                    created_obj = serializer.save(added_by=request.data.get('added_by'))
                    self.handle_follow_up_logic(created_obj, request, screening_obj)
                    return Response({
                        "message": "Vision info created successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"error": "Invalid pk_id — screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # -------------------------------------------------------------
    # 🧩 Handle follow-up logic for referred_to_specialist
    # -------------------------------------------------------------
    def handle_follow_up_logic(self, vision_obj, request, screening_obj):
        try:
            reffer_value = request.data.get('reffered_to_specialist')
            modify_by = request.data.get('modify_by')
            added_by = request.data.get('added_by')

            if reffer_value is not None:
                reffer_value = int(reffer_value)

                # Find existing follow-up entry for this screening
                follow_obj = follow_up.objects.filter(
                    screening_citizen_id=screening_obj,
                    vision_refer__isnull=False
                ).first()

                # Case 1️⃣: referred_to_specialist == 1 → create/update vision_refer = 1
                if reffer_value == 1:
                    if follow_obj:
                        follow_obj.vision_refer = 1
                        follow_obj.is_deleted = False
                        follow_obj.modify_by = modify_by
                        follow_obj.save()
                    else:
                        follow_up.objects.create(
                            citizen_id=screening_obj.citizen_id,
                            screening_count=screening_obj.screening_count,
                            citizen_pk_id=screening_obj.citizen_pk_id,
                            screening_citizen_id=screening_obj,
                            vision_refer=1,
                            is_deleted=False,
                            added_by=added_by,
                            modify_by=modify_by
                        )

                # Case 2️⃣: referred_to_specialist == 0 → mark deleted
                elif reffer_value == 0 and follow_obj:
                    follow_obj.is_deleted = True
                    follow_obj.vision_refer = 0
                    follow_obj.modify_by = modify_by
                    follow_obj.save()

        except Exception as e:
            print("Follow-up logic error:", str(e))
            
class Vision_Info_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = vision_info.objects.filter(screening_citizen_id=pk_id)
        serializers = Vision_Info_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


class Medical_history_info_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = medical_history_info.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Medical_history_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Medical_history_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Medical_history_info_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = medical_history_info.objects.filter(screening_citizen_id=pk_id)
        serializers = MedicalHistoryInfo_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)


class pft_get_api(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request,reading):
            if(reading>=60 and reading<=249):
                return Response({'message': 'Danger'})
            elif(reading>=250 and reading<=449):
                return Response({'message': 'Caution'})
            elif(reading>=450 and reading<=800):
                return Response({'message': 'Stable'})
            else:
                return Response({'message': 'Out Of Range'})



class PFT_Post_info_Post_API(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = pft_info.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = PFT_Info_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = PFT_Info_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PFT_Info_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = pft_info.objects.filter(screening_citizen_id=pk_id)
        serializers = PFT_Info_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)



class Dental_Info_Post_Api(APIView):
    def post(self, request, pk_id):
        try:
            # ✅ Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # ✅ Auto-fill backend data
            dental_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # ✅ Check existing record
            dental_obj = dental_info.objects.filter(screening_citizen_id=screening_obj).first()

            if dental_obj:
                # -------- Update existing record --------
                serializer = Dental_Info_Post_Serializer(dental_obj, data={**request.data, **dental_data}, partial=True)
                if serializer.is_valid():
                    updated_obj = serializer.save(modify_by=request.data.get('modify_by'))
                    self.handle_follow_up_logic(updated_obj, request, screening_obj)
                    return Response({
                        "message": "Dental info updated successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                # -------- Create new record --------
                serializer = Dental_Info_Post_Serializer(data={**request.data, **dental_data})
                if serializer.is_valid():
                    created_obj = serializer.save(added_by=request.data.get('added_by'))
                    self.handle_follow_up_logic(created_obj, request, screening_obj)
                    return Response({
                        "message": "Dental info created successfully",
                        "data": serializer.data,
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"error": "Invalid pk_id — screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # -------------------------------------------------------------
    # 🦷 Handle follow-up logic for reffered_to_specialist
    # -------------------------------------------------------------
    def handle_follow_up_logic(self, dental_obj, request, screening_obj):
        try:
            reffer_value = request.data.get('reffered_to_specialist')
            modify_by = request.data.get('modify_by')
            added_by = request.data.get('added_by')

            if reffer_value is not None:
                reffer_value = int(reffer_value)

                # Find existing follow-up entry for this screening
                follow_obj = follow_up.objects.filter(
                    screening_citizen_id=screening_obj,
                    dental_refer__isnull=False
                ).first()

                # Case 1️⃣: referred_to_specialist == 1 → create/update dental_refer = 1
                if reffer_value == 1:
                    if follow_obj:
                        follow_obj.dental_refer = 1
                        follow_obj.is_deleted = False
                        follow_obj.modify_by = modify_by
                        follow_obj.save()
                    else:
                        follow_up.objects.create(
                            citizen_id=screening_obj.citizen_id,
                            screening_count=screening_obj.screening_count,
                            citizen_pk_id=screening_obj.citizen_pk_id,
                            screening_citizen_id=screening_obj,
                            dental_refer=1,
                            is_deleted=False,
                            added_by=added_by,
                            modify_by=modify_by
                        )

                # Case 2️⃣: referred_to_specialist == 0 → mark deleted
                elif reffer_value == 0 and follow_obj:
                    follow_obj.is_deleted = True
                    follow_obj.dental_refer = 0
                    follow_obj.modify_by = modify_by
                    follow_obj.save()

        except Exception as e:
            print("Follow-up logic error:", str(e))
            
            
class Dental_Info_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = dental_info.objects.filter(screening_citizen_id=pk_id)
        serializers = Dental_Info_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    



class Immunisation_Info_Post_Api(APIView):
    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Prepare backend auto-filled data
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id.pk if screening_obj.citizen_pk_id else None,
                'screening_citizen_id': screening_obj.pk_id,
            }

            # Combine backend + frontend data
            combined_data = {**request.data, **auto_data}

            # Check if record exists (update instead of creating new)
            existing_obj = immunisation_info.objects.filter(screening_citizen_id=screening_obj.pk_id).first()
            if existing_obj:
                serializer = Immunisation_Info_Post_Serializer(existing_obj, data=combined_data, partial=True)
            else:
                serializer = Immunisation_Info_Post_Serializer(data=combined_data)

            # Validate & save
            if serializer.is_valid():
                serializer.save()
                message = "General Examination record updated successfully" if existing_obj else "General Examination record created successfully"
                return Response({"message": message, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response({"success": False, "error": "Invalid pk_id — Screening record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Immunisation_Info_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = immunisation_info.objects.filter(screening_citizen_id=pk_id)
        serializers = Immunisation_Info_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    


from rest_framework.parsers import MultiPartParser, FormParser
class Investigation_Info_Post_Api(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, pk_id):
        try:
            # Get Screening record
            screening_obj = Screening_citizen.objects.get(pk_id=pk_id)

            # Auto data (ForeignKey fields expect instances)
            auto_data = {
                'citizen_id': screening_obj.citizen_id,
                'screening_count': screening_obj.screening_count,
                'citizen_pk_id': screening_obj.citizen_pk_id,
                'screening_citizen_id': screening_obj,
            }

            # Check for existing record
            existing_obj = investigation_info.objects.filter(
                screening_citizen_id=screening_obj.pk_id
            ).first()

            if existing_obj:
                serializer = Investigation_Info_Post_Serializer(
                    existing_obj, data=request.data, partial=True
                )
            else:
                serializer = Investigation_Info_Post_Serializer(data=request.data)

            if serializer.is_valid():
                instance = serializer.save(**auto_data)
                msg = "Investigation record updated successfully" if existing_obj else "Investigation record created successfully"
                return Response(
                    {"message": msg, "data": Investigation_Info_Post_Serializer(instance).data},
                    status=status.HTTP_200_OK
                )

            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Screening_citizen.DoesNotExist:
            return Response(
                {"error": "Invalid pk_id — Screening record not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class Investigation_Info_Get_API(APIView):
    def get(self, request, pk_id):
        snippet = investigation_info.objects.filter(screening_citizen_id=pk_id)
        serializers = Investigation_Info_Get_Serializer(snippet, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    



class Healthcard_Citizen_List(APIView):
    def get(self, request):
        # Getting query parameters from the URL
        source_pk_id = request.query_params.get('source_pk_id')
        source = request.query_params.get('source')
        state_id = request.query_params.get('state_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        source_name = request.query_params.get('source_name')
        source_id_id = request.query_params.get('source_id_id')
        source_name_id = request.query_params.get('source_name_id')
        location = request.query_params.get('location')

        # Prepare kwargs for filtering
        filter_params = {}

        if source_pk_id:
            filter_params['citizen_pk_id__source_pk_id'] = source_pk_id
        if source:
            filter_params['citizen_pk_id__source'] = source
        if state_id:
            filter_params['citizen_pk_id__state'] = state_id
        if district:
            filter_params['citizen_pk_id__district'] = district
        if tehsil:
            filter_params['citizen_pk_id__tehsil'] = tehsil
        if source_name:
            filter_params['citizen_pk_id__source_name'] = source_name
        if source_id_id:
            filter_params['citizen_pk_id__source'] = source_id_id
        if source_name_id:
            filter_params['citizen_pk_id__source_name'] = source_name_id
        

        # Filtering the queryset based on the parameters
        healthcards = Screening_citizen.objects.filter(**filter_params)

        # Serializing the filtered data
        serializer = Healthcard_Citizen_List_Serializer(healthcards, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)



class Screening_Count_API(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        citizen_id = request.GET.get('citizen_id')
        
        if not citizen_id:
            return Response({"error": "citizen_id is required"}, status=400)
        
        try:
            
            schedules = Screening_citizen.objects.filter(citizen_id=citizen_id).order_by('added_date')
            Citizen_info = Citizen.objects.filter(citizen_id=citizen_id)
            serializer = Citizen_Data_Get_Serializer(Citizen_info, many=True)
            
            
            schedule_data = [{'pk_id': schedule.pk_id} for schedule in schedules]

            
            screening_count = schedules.count()
            
            
            screening_count_sequence = list(range(1, screening_count + 1))
            
            return Response({"Citizen_info": serializer.data, "screening_count": screening_count, "screening_count_sequence": screening_count_sequence,"screening_id": schedule_data})
        
        except Screening_citizen.DoesNotExist:
            return Response({"error": "Schedule does not exist"}, status=404)






class Healthcard_Download_API(APIView):
    def get(self, request, *args, **kwargs):
        try:
            citizen_id = self.kwargs.get('citizen_id')
            screening_count = self.kwargs.get('screening_count')

            dental_qs = dental_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            dental_serializer = Dental_info_Healthcard(dental_qs, many=True) if dental_qs.exists() else None
            
            vital_qs = vital_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            vital_serializer = Vital_info_Healthcard(vital_qs, many=True) if vital_qs.exists() else None
            
            audio_qs = auditory_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            audio_serializer = Auditory_info_Healthcard(audio_qs, many=True) if audio_qs.exists() else None
            
            general_qs = genral_examination.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            general_serializer = Genral_examination_info_Healthcard(general_qs, many=True) if general_qs.exists() else None
            
            systemic_qs = systemic_exam.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            systemic_serializer = Systemic_exam_info_Healthcard(systemic_qs, many=True) if systemic_qs.exists() else None
            
            disability_qs = disability_screening.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            disability_serializer = Disability_info_Healthcard(disability_qs, many=True) if disability_qs.exists() else None
            
            birth_defect_qs = birth_defect.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            birth_defect_serializer = Birthdefect_info_Healthcard(birth_defect_qs, many=True) if birth_defect_qs.exists() else None
            
            childhood_disease_qs = childhood_diseases.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            childhood_disease_serializer = Childhooddisease_info_Healthcard(childhood_disease_qs, many=True) if childhood_disease_qs.exists() else None
            
            defeciency_qs = deficiencies.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            defeciency_serializer = Defeciencies_info_Healthcard(defeciency_qs, many=True) if defeciency_qs.exists() else None
            
            skin_conditions_qs = skin_conditions.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            skin_conditions_serializer = Skinconditions_info_Healthcard(skin_conditions_qs, many=True) if skin_conditions_qs.exists() else None
            
            diagnosis_qs = diagnosis.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            diagnosis_serializer = Diagnosis_info_Healthcard(diagnosis_qs, many=True) if diagnosis_qs.exists() else None
            
            treatment_qs = treatement.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            treatment_serializer = Treatment_info_Healthcard(treatment_qs, many=True) if treatment_qs.exists() else None
            
            vision_qs = vision_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            vision_serializer = Vision_Info_Get_Serializer(vision_qs, many=True) if vision_qs.exists() else None
            
            medical_history_qs = medical_history_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            medical_history_serializer = MedicalHistoryInfo_Get_Serializer(medical_history_qs, many=True) if medical_history_qs.exists() else None
            
            pft_qs = pft_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            pft_serializer = PFT_Info_Get_Serializer(pft_qs, many=True) if pft_qs.exists() else None
            
            immunisation_qs = immunisation_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            immunisation_serializer = Immunisation_Info_Get_Serializer(immunisation_qs, many=True) if immunisation_qs.exists() else None
            
            growth_monitoring_qs = growth_monitoring_info.objects.filter(citizen_id=citizen_id, screening_count=screening_count)
            growth_monitoring_serializer = growth_monitoring_info_Healthcard(growth_monitoring_qs, many=True) if growth_monitoring_qs.exists() else None


            response_data = {
                'dental_info': dental_serializer.data if dental_serializer else None,
                'vital_info': vital_serializer.data if vital_serializer else None,
                'auditory_info': audio_serializer.data if audio_serializer else None,
                'general_examination_info': general_serializer.data if general_serializer else None,
                'systemic_examination_info': systemic_serializer.data if systemic_serializer else None,
                'disability_info': disability_serializer.data if disability_serializer else None,
                'birth_defect_info': birth_defect_serializer.data if birth_defect_serializer else None,
                'childhood_disease_info': childhood_disease_serializer.data if childhood_disease_serializer else None,
                'deficiency_info': defeciency_serializer.data if defeciency_serializer else None,
                'skin_conditions_info': skin_conditions_serializer.data if skin_conditions_serializer else None,
                'diagnosis_info': diagnosis_serializer.data if diagnosis_serializer else None,
                'treatment_info': treatment_serializer.data if treatment_serializer else None,
                'vision_info': vision_serializer.data if vision_serializer else None,
                'medical_history_info': medical_history_serializer.data if medical_history_serializer else None,
                'pft_info': pft_serializer.data if pft_serializer else None,
                'immunisation_info': immunisation_serializer.data if immunisation_serializer else None,
                'growth_monitoring_info': growth_monitoring_serializer.data if growth_monitoring_serializer else None,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#-----------kirti--------

class FollowupPOST(APIView):
    # permission_classes = [IsAuthenticated]
    # renderer_classes = [JSONRenderer]
    def post(self, request, follow_up_pk_id):

        # 1️⃣ Fetch record from follow_up table
        follow_up_obj = get_object_or_404(follow_up, follow_up_pk_id=follow_up_pk_id)

        # 2️⃣ Get follow_up status (agg_sc_follow_up_status) from request
        follow_up_status_id = request.data.get("follow_up")
        if follow_up_status_id is not None:
            try:
                follow_up_status_id = int(follow_up_status_id)
            except:
                return Response({"error": "Invalid follow_up value"}, status=400)

            # update follow_up status in follow_up table
            follow_up_obj.follow_up = follow_up_status_id
            follow_up_obj.save()

        # 3️⃣ Count existing followups from followup_save table
        followup_count = followup_save.objects.filter(
            citizen_id = follow_up_obj.citizen_id,
            screening_citizen_id = follow_up_obj.screening_citizen_id
        ).count()

        # 4️⃣ Validate request with serializer
        serializer = followup_save_info_Serializer(data=request.data)

        if serializer.is_valid():

            # Inject required fields automatically
            serializer.validated_data["citizen_id"] = follow_up_obj.citizen_id
            serializer.validated_data["screening_citizen_id"] = follow_up_obj.screening_citizen_id
            serializer.validated_data["followup_count"] = followup_count + 1

            # save followup entry
            serializer.save()

            return Response(
                {"message": "Follow-up saved successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request, follow_up_pk_id):

    #     follow_up_obj = get_object_or_404(
    #         follow_up,
    #         follow_up_pk_id=follow_up_pk_id
    #     )

    #     citizen_obj = get_object_or_404(
    #         agg_sc_follow_up_citizen,
    #         follow_up_ctzn_pk=follow_up_pk_id  
    #     )

    #     citizen_id = follow_up_obj.citizen_id
    #     screening_citizen_id = follow_up_obj.screening_citizen_id

    #     follow_up_status_id = request.data.get('follow_up')
    #     if follow_up_status_id is not None:
    #         try:
    #             follow_up_status_id = int(follow_up_status_id)
    #         except:
    #             return Response({"error": "follow_up must be integer"}, status=400)

    #     followup_count = followup_save.objects.filter(
    #         citizen_id=citizen_id,
    #         screening_citizen_id=screening_citizen_id
    #     ).count()

    #     serializer = followup_save_info_Serializer(data=request.data)

    #     if serializer.is_valid():
    #         serializer.validated_data['citizen_id'] = citizen_id
    #         serializer.validated_data['screening_citizen_id'] = screening_citizen_id
    #         serializer.validated_data['followup_count'] = followup_count + 1

    #         serializer.validated_data['follow_up_citizen_pk_id'] = citizen_obj  

    #         serializer.save()
    #         return Response(serializer.data, status=201)

    #     return Response(serializer.errors, status=400)
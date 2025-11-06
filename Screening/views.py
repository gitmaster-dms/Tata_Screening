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
# @api_view(['GET', 'POST'])
# def agg_sc_citizen_dental_info_ViewSet(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = agg_sc_citizen_dental_info.objects.all()
#         serializer = agg_sc_citizen_dental_info_Serializer(snippets, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = agg_sc_citizen_dental_info_Serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# @api_view(['GET', 'POST'])
# def agg_sc_citizen_vision_info_ViewSet(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = agg_sc_citizen_vision_info.objects.all()
#         serializer = agg_sc_citizen_vision_info_Serializer(snippets, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = agg_sc_citizen_vision_info_Serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# @api_view(['GET', 'POST'])
# def agg_sc_sick_room_info_ViewSet(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = agg_sc_citizen_sick_room_info.objects.all()
#         serializer = agg_sc_sick_room_info_Serializer(snippets, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = agg_sc_sick_room_info_Serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def agg_sc_schedule_screening_ViewSet(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = agg_sc_schedule_screening.objects.all()
        serializer = agg_sc_schedule_screening_Serializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = agg_sc_schedule_screening_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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



# Amit 

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.http import Http404
# from rest_framework import status

# class Source_SourName_Shedule_id_Views(APIView):
#     # renderer_classes = [UserRenderer]
#     # permission_classes = [IsAuthenticated]

#     def get_object(self, So, SoN, query_params):
#         try:
#             # Initialize filter parameters
#             filter_params = {'source': So, 'source_name': SoN}
            
#             # Add additional filters from query parameters if provided
#             if 'schedule_id' in query_params:
#                 filter_params['schedule_id'] = query_params.get('schedule_id')
#             if 'another_field' in query_params:  # Replace 'another_field' with actual field names
#                 filter_params['another_field'] = query_params.get('another_field')

#             records = agg_sc_schedule_screening.objects.filter(**filter_params)
#             if not records.exists():
#                 raise Http404("No matching records found.")
#             return records
#         except agg_sc_schedule_screening.DoesNotExist:
#             raise Http404("The specified screening schedule does not exist.")
#         except Exception as e:
#             raise e

#     def get(self, request, So, SoN):
#         try:
#             # Pass query parameters to get_object
#             records = self.get_object(So, SoN, request.query_params)
#             serialized = Source_sourName_Shedule_Id_Serializer(records, many=True)
#             return Response(serialized.data, status=status.HTTP_200_OK)
#         except Http404 as e:
#             return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
#         except ValueError:
#             return Response({"error": "Invalid input. Please check the provided data."}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": "An unexpected error occurred: {}".format(str(e))}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Schedule_id_get_viewset(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        filter_params = {}
        
        source_id = request.query_params.get('source_id')
        source_name_id = request.query_params.get('source_name_id')
        
        if source_id:
            filter_params['source'] = source_id
        if source_name_id:
            filter_params['source_name_id'] = source_name_id
        
        snippet = agg_sc_schedule_screening.objects.filter(**filter_params)
        serializer = Schedule_ID_Get_Serializer(snippet, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



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

#__________________ Add New Source (DELETE Method)_______________________# 
# _____________________ End Add New Source __________________________________


# _____________________ Add New Schedule __________________________________
# _____________________ Add New Schedule (GET Method) ______________________________
class agg_sc_schedule_screening_ViewSet_GET(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self,request):
        source_id = request.query_params.get('source_id')
        source_name_id = request.query_params.get('source_name_id')
        snipet =  agg_sc_schedule_screening.objects.filter(is_deleted=False)
        
        if source_id:
            snipet = snipet.filter(source_id=source_id)
            
        if source_name_id:
            snipet = snipet.filter(source_name_id=source_name_id)
             
        serializer = agg_sc_schedule_screening_get_Serializer(snipet, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_schedule_screening_ViewSet_GET_ID_WISE(request, pk):
    try:
        snippet = agg_sc_schedule_screening.objects.get(pk=pk, is_deleted=False)
    except agg_sc_schedule_screening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = agg_sc_schedule_screening_get_Serializer(snippet)
    return Response(serializer.data)


#------------------------Closing Screening-------------------------------------#
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['DELETE'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def schedule_screening_close(request, pk, user_id):
    schedule_screening = get_object_or_404(agg_sc_schedule_screening, pk=pk)

    # Set is_deleted to True instead of actually deleting the record
    colleague = get_object_or_404(agg_com_colleague, pk=user_id)
    schedule_screening.modify_by = colleague
    schedule_screening.is_deleted = True
    schedule_screening.save()

    # Set closing_status to True in related agg_sc_citizen_schedule instances
    related_citizen_schedules = agg_sc_citizen_schedule.objects.filter(schedule_id=schedule_screening.schedule_id)
    related_citizen_schedules.update(closing_status=True)

    return Response({'message': 'Screening is closed.'}, status=status.HTTP_204_NO_CONTENT)



# _____________________ End Add New Schedule (GET Method) ______________________________
# _____________________ POST Add New Schedule (POST Method) ______________________________
# @api_view(['POST'])
# def agg_sc_schedule_screening_ViewSet_POST(request):
#     """
#     List all code snippets, or create a new snippet.
#     """

#     request.method == 'POST'
#     serializer = agg_sc_schedule_screening_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from django.db import IntegrityError
# from .models import agg_sc_schedule_screening, agg_sc_add_new_citizens, agg_sc_citizen_schedule
# from .serializers import agg_sc_schedule_screening_Serializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from .models import agg_sc_schedule_screening, agg_sc_add_new_citizens, agg_sc_citizen_schedule
from .serializers import agg_sc_schedule_screening_Serializer


# @api_view(['POST'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
# def agg_sc_schedule_screening_ViewSet_POST(request):
#     """
#     Create a new screening schedule and retrieve citizens under the added source name and class.
#     """
#     if request.method == 'POST':
#         serializer = agg_sc_schedule_screening_POST_Serializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 # Check if a schedule already exists for the same source, state, district, tehsil, source_name, and Class
#                 existing_schedule = agg_sc_schedule_screening.objects.filter(
#                     source=serializer.validated_data['source'],
#                     state=serializer.validated_data['state'],
#                     district=serializer.validated_data['district'],
#                     tehsil=serializer.validated_data['tehsil'],
#                     source_name=serializer.validated_data['source_name'],
#                     from_date__lte=serializer.validated_data['to_date'],
#                     to_date__gte=serializer.validated_data['from_date'],
#                     type=serializer.validated_data['type']
#                 )

#                 if 'Class' in serializer.validated_data:
#                     existing_schedule = existing_schedule.filter(
#                         Class=serializer.validated_data['Class']
#                     )
#                 elif 'department' in serializer.validated_data:
#                     existing_schedule = existing_schedule.filter(
#                         department=serializer.validated_data['department']
#                     )
#                 else:
#                     # If neither Class nor department is provided, add conditions for the other fields
#                     existing_schedule = existing_schedule.filter(
#                         type=serializer.validated_data['type']
#                     )

#                 existing_schedule = existing_schedule.first()

#                 if existing_schedule:
#                     # Return a response indicating that the screening is already scheduled
#                     return Response({"error": "Screening is already scheduled for the specified time period."},
#                                     status=status.HTTP_409_CONFLICT)

#                 new_schedule = serializer.save()

#                 # Retrieve citizens under the added source name and class
#                 source = new_schedule.source
#                 source_state = new_schedule.state
#                 source_district = new_schedule.district
#                 source_tahasil = new_schedule.tehsil
#                 source_name = new_schedule.source_name
#                 source_class = new_schedule.Class
#                 department = new_schedule.department
#                 type = new_schedule.type

#                 citizens_under_source = agg_sc_add_new_citizens.objects.filter(
#                     source_name=source_name,
#                     source=source,
#                     state=source_state,
#                     district=source_district, 
#                     tehsil=source_tahasil,
#                     # Class=source_class,
#                     #department=department,
#                     type=type,
#                     is_deleted=False,
#                 )

#                 highest_schedule_count = 1  # Initialize highest count

#                 for citizen in citizens_under_source:
#                     latest_citizen_schedule = agg_sc_citizen_schedule.objects.filter(
#                         citizen_id=citizen.citizen_id
#                     ).order_by('-pk').first()

#                     if latest_citizen_schedule:
#                         schedule_count = int(latest_citizen_schedule.schedule_count) + 1
#                     else:
#                         schedule_count = 1

#                     # Update schedule count in agg_sc_citizen_schedule for each citizen
#                     schedule_entry = agg_sc_citizen_schedule(
#                         schedule_count=schedule_count,
#                         citizen_id=citizen.citizen_id,
#                         schedule_id=new_schedule.schedule_id,
#                         citizen_pk_id=citizen,  # Link to agg_sc_add_new_citizens instance
#                         added_by=new_schedule.screening_person_name,
#                         modify_by=new_schedule.screening_person_name,
#                     )
#                     schedule_entry.save()

#                     if schedule_count > highest_schedule_count:
#                         highest_schedule_count = schedule_count

#                 new_schedule.schedule_count = highest_schedule_count
#                 new_schedule.save()

#                 response_data = {
#                     "schedule_id": new_schedule.schedule_id,
#                     "from_date": new_schedule.from_date.isoformat(), 
#                     "to_date": new_schedule.to_date.isoformat(),  
#                     "source": new_schedule.source.source,
#                     "source_name": new_schedule.source_name.source_names,
#                     "state": new_schedule.state.state_name,
#                     "district": new_schedule.district.dist_name,
#                     "Disease": new_schedule.Disease,
#                     "Class": new_schedule.Class.class_name if new_schedule.Class else None,
#                     "department":new_schedule.department.department if new_schedule.department else None,
#                     "type": new_schedule.type.type,
#                     "screening_person_name": new_schedule.screening_person_name,
#                     "is_deleted": new_schedule.is_deleted,
#                     "schedule_count": new_schedule.schedule_count,
#                 }

#                 return Response(response_data, status=status.HTTP_201_CREATED)

#             except IntegrityError as e:
#                 error_message = str(e)
#                 return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

#             except Exception as e:
#                 error_message = str(e)
#                 return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_schedule_screening_ViewSet_POST(request):
    """
    Create a new screening schedule and retrieve citizens under the added source name.
    """
    if request.method == 'POST':
        serializer = agg_sc_schedule_screening_POST_Serializer(data=request.data)
        if serializer.is_valid():
            try:
                # Check if a schedule already exists for the same source, state, district, tehsil, source_name
                existing_schedule = agg_sc_schedule_screening.objects.filter(
                    source=serializer.validated_data['source'],
                    state=serializer.validated_data['state'],
                    district=serializer.validated_data['district'],
                    tehsil=serializer.validated_data['tehsil'],
                    source_name=serializer.validated_data['source_name'],
                    from_date__lte=serializer.validated_data['to_date'],
                    to_date__gte=serializer.validated_data['from_date'],
                ).first()

                if existing_schedule:
                    return Response(
                        {"error": "Screening is already scheduled for the specified time period."},
                        status=status.HTTP_409_CONFLICT
                    )

                new_schedule = serializer.save()

                # Retrieve citizens under the added source name
                citizens_under_source = agg_sc_add_new_citizens.objects.filter(
                    source_name=new_schedule.source_name,
                    source=new_schedule.source,
                    state=new_schedule.state,
                    district=new_schedule.district,
                    tehsil=new_schedule.tehsil,
                    is_deleted=False,
                )

                highest_schedule_count = 1

                for citizen in citizens_under_source:
                    latest_citizen_schedule = agg_sc_citizen_schedule.objects.filter(
                        citizen_id=citizen.citizen_id
                    ).order_by('-pk').first()

                    if latest_citizen_schedule:
                        schedule_count = int(latest_citizen_schedule.schedule_count) + 1
                    else:
                        schedule_count = 1

                    schedule_entry = agg_sc_citizen_schedule(
                        schedule_count=schedule_count,
                        citizen_id=citizen.citizen_id,
                        schedule_id=new_schedule.schedule_id,
                        citizen_pk_id=citizen,
                        added_by=new_schedule.screening_person_name,
                        modify_by=new_schedule.screening_person_name,
                    )
                    schedule_entry.save()

                    if schedule_count > highest_schedule_count:
                        highest_schedule_count = schedule_count

                new_schedule.schedule_count = highest_schedule_count
                new_schedule.save()

                response_data = {
                    "schedule_id": new_schedule.schedule_id,
                    "from_date": new_schedule.from_date.isoformat(),
                    "to_date": new_schedule.to_date.isoformat(),
                    "source": new_schedule.source.source,
                    "source_name": new_schedule.source_name.source_names,
                    "state": new_schedule.state.state_name,
                    "district": new_schedule.district.dist_name,
                    "Disease": new_schedule.Disease,
                    "screening_person_name": new_schedule.screening_person_name,
                    "is_deleted": new_schedule.is_deleted,
                    "schedule_count": new_schedule.schedule_count,
                }

                return Response(response_data, status=status.HTTP_201_CREATED)

            except IntegrityError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# _____________________ POST Add New Schedule (POST Method) ______________________________
#__________________ Add New Schedule (PUT/UPDATE Method) ________________________#
# @api_view(['GET','PUT'])
# def agg_sc_schedule_screening_ViewSet_PUT(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_sc_schedule_screening.objects.get(pk=pk)
#     except agg_sc_schedule_screening.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':   
#         serializer = agg_sc_schedule_screening_GET_PUT_Serializer(snippet)
#         return Response(serializer.data)


#     elif request.method == 'PUT':
#         serializer = agg_sc_schedule_screening_PUT_Serializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_schedule_screening_ViewSet_PUT(request, pk):
    try:
        snippet = agg_sc_schedule_screening.objects.get(pk=pk)
    except agg_sc_schedule_screening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':   
        serializer = agg_sc_schedule_screening_GET_PUT_Serializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = agg_sc_schedule_screening_PUT_Serializer(snippet, data=request.data)

        if serializer.is_valid():
            # Additional logic to check if a schedule already exists for the same source, state, district, tehsil, source_name, and Class
            existing_schedule = agg_sc_schedule_screening.objects.filter(
                source=serializer.validated_data.get('source', snippet.source),
                state=serializer.validated_data.get('state', snippet.state),
                district=serializer.validated_data.get('district', snippet.district),
                tehsil=serializer.validated_data.get('tehsil', snippet.tehsil),
                source_name=serializer.validated_data.get('source_name', snippet.source_name),
                from_date__lte=serializer.validated_data.get('to_date', snippet.to_date),
                to_date__gte=serializer.validated_data.get('from_date', snippet.from_date)
            )

            if existing_schedule.exists() and existing_schedule.first() != snippet:
                return Response("A schedule already exists for the specified time period and details.", status=status.HTTP_409_CONFLICT)

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#__________________ END Add New Schedule (PUT Method) _______________________# 
#__________________ Add New Schedule (DELETE Method)_______________________# 
@api_view(['GET', 'DELETE'])
def agg_sc_schedule_screening_ViewSet_DELETE(request, pk, user_id):
    try:
        snippet = agg_sc_schedule_screening.objects.filter(is_deleted=False).get(pk=pk)
    except agg_sc_schedule_screening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = agg_sc_schedule_screening_get_Serializer(snippet)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        # Soft delete the record by setting is_deleted to True
        colleague = get_object_or_404(agg_com_colleague, pk=user_id)
        snippet.modify_by = colleague        
        snippet.is_deleted = True
        snippet.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# _____________________ End Add New Schedule __________________________________

# _____________________ POST Gender Age (POST Method) ______________________________
# @api_view(['POST'])
# def agg_sc_schedule_screening_ViewSet_POST(request):
#     """
#     List all code snippets, or create a new snippet.
#     """

#     request.method == 'POST'
#     serializer = agg_sc_schedule_screening_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# _____________________ POST Gender Age (POST Method) ______________________________
#__________________ Gender Age (PUT/UPDATE Method) ________________________#


# ------- Not in use Schedule_screening_ViewSet_PUT -----------------
    
# # @api_view(['GET','PUT'])
# # def agg_sc_schedule_screening_ViewSet_PUT(request, pk):
# #     """ 
# #     update code snippet.
# #     """
# #     try:
# #         snippet = agg_sc_schedule_screening.objects.get(pk=pk)
# #     except agg_sc_schedule_screening.DoesNotExist:
# #         return Response(status=status.HTTP_404_NOT_FOUND)
    
# #     if request.method == 'GET':   
# #         serializer = agg_sc_schedule_screening_Serializer(snippet)
# #         return Response(serializer.data)


# #     elif request.method == 'PUT':
# #         serializer = agg_sc_schedule_screening_Serializer(snippet, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ------- Not in use Schedule_screening_ViewSet_PUT -----------------

# ------- Not in use Schedule_screening_ViewSet_DELETE -----------------
# # @api_view(['GET', 'DELETE'])
# # def agg_sc_schedule_screening_ViewSet_DELETE(request, pk, id=None):
# #     """ 
# #     delete a code snippet.
# #     """
# #     try:
# #         snippet = agg_sc_schedule_screening.objects.get(pk=pk)
# #     except agg_sc_schedule_screening.DoesNotExist:
# #         return Response(status=status.HTTP_404_NOT_FOUND)
    
# #     if request.method == 'GET':   
# #         serializer = agg_sc_schedule_screening_Serializer(snippet)
# #         return Response(serializer.data)
    
# #     elif request.method == 'DELETE':
# #         snippet.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)    
# ------- Not in use Schedule_screening_ViewSet_DELETE -----------------



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


# from rest_framework.pagination import PageNumberPagination

# class CustomPagination(PageNumberPagination):
#     page_size = 50
#     page_size_query_param = 'page_size'
#     max_page_size = 1000

# @api_view(['GET'])
# def agg_sc_add_new_citizen_get_info_ViewSet1(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     snippets = agg_sc_add_new_citizens.objects.filter(is_deleted=False).order_by('citizens_pk_id')

#     # Apply pagination
#     paginator = CustomPagination()
#     paginated_data = paginator.paginate_queryset(snippets, request)

#     serializer = agg_sc_add_new_citizens_get_Serializer(paginated_data, many=True)
#     return paginator.get_paginated_response(serializer.data)






# # views.py
# from django.core.paginator import Paginator
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import agg_sc_add_new_citizens
# from .serializers import agg_sc_add_new_citizens_get_Serializer

# @api_view(['GET'])
# def agg_sc_add_new_citizen_get_info_ViewSet1(request):
#     try:
#         # Fetch the queryset without using select_related
#         snippets = agg_sc_add_new_citizens.objects.filter(is_deleted=False).order_by('citizens_pk_id')

#         # Limit the Number of Fields Returned
#         # snippets = snippets.only('name', 'age', 'source', 'source_name', 'disease')

#         # Paginate Results
#         paginator = Paginator(snippets, per_page=100)
#         page_number = request.GET.get('page', 1)
#         page_obj = paginator.get_page(page_number)

#         # Serialize the data
#         serializer = agg_sc_add_new_citizens_get_Serializer(page_obj, many=True)

#         # Return the paginated data
#         return Response(serializer.data)
#     except Exception as e:
#         return Response({'error': str(e)})




#__________________END ADD NEW CITIZEN (GET Method)_____________________#

#__________________ADD NEW CITIZEN (POST Method)________________________#
# @api_view(['POST'])
# def agg_sc_add_new_citizen_post_info_ViewSet1(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     request.method == 'POST'
#     serializer = agg_sc_add_new_citizens_Serializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.core.exceptions import MultipleObjectsReturned

@api_view(['POST'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
def agg_sc_add_new_citizen_post_info_ViewSet1(request):
    print("Request Data:", request.data)
    if request.method == 'POST':
        # aadhar_no = request.data['aadhar_id']
        # aadhar_no = request.data.get('aadhar_id', None)
        try:
        #     is_exist = agg_sc_add_new_citizens.objects.get(aadhar_id=aadhar_no)
        #     return Response({"error": "Citizen is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)
        # except agg_sc_add_new_citizens.DoesNotExist:
            # Create the new citizen record
            serializer = agg_sc_add_new_citizens_POST_Serializer(data=request.data)
            print("Serializer Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:", serializer)
            if serializer.is_valid():
                print("Serializer Validated Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                print("Serializer Validated Data:", serializer.validated_data)
                new_citizen = serializer.save()
                print("New Citizen Data:", new_citizen)
                print("New Citizen Data1111111111111111111111111111111111")

                # Extract the source_name from the newly added citizen's data
                source_name = new_citizen.source_name
                source = new_citizen.source
                source_state = new_citizen.state
                source_district = new_citizen.district
                source_tahasil = new_citizen.tehsil
                # source_class = new_citizen.Class
                # type = new_citizen.type

                # Find the schedules that match the source_name
                schedules = agg_sc_schedule_screening.objects.filter(
                    source_name=source_name,
                    source=source,
                    state=source_state,
                    district=source_district,
                    tehsil=source_tahasil,
                    is_deleted=False
                    
                    # Class=source_class,
                    # type=type
                )

                # Check if there are schedules for this source_name
                if schedules.exists():
                    # Get the schedule_ids as a list
                    schedule_ids = [schedule.schedule_id for schedule in schedules]

                    # Find the latest schedule count for the corresponding schedule
                    latest_schedule_count_entry = agg_sc_citizen_schedule.objects.filter(
                        schedule_id__in=schedule_ids,
                        is_deleted=False
                    ).order_by('-schedule_count').first()

                    if latest_schedule_count_entry:
                        # Assign the new citizen the same schedule count
                        schedule_count = latest_schedule_count_entry.schedule_count
                    else:
                        # If no existing schedule count is found, set it to 1
                        schedule_count = 1

                    # Create an entry for the new citizen in agg_sc_citizen_schedule
                    agg_sc_citizen_schedule.objects.create(
                        citizen_id=new_citizen.citizen_id,
                        schedule_id=schedule_ids[0],  # Assign to the first schedule in the list
                        schedule_count=schedule_count,  # Assign the same schedule count
                        citizen_pk_id=new_citizen,
                        
                    )
                    return Response({"message": "Citizen has been allocated an existing screening schedule"}, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except MultipleObjectsReturned:
            # Handle the case where multiple citizens with the same Aadhar ID are found
            return Response({"error": "Citizen is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)


#__________________END ADD NEW CITIZEN (POST Method)_______________________#

#__________________ADD NEW CITIZEN (PUT/UPDATE Method)________________________#
# @api_view(['GET','PUT'])
# def agg_sc_add_new_citizen_put_info_ViewSet1(request, pk):
#     """ 
#     update code snippet.
#     """
#     try:
#         snippet = agg_sc_add_new_citizens.objects.get(pk=pk)
#     except agg_sc_add_new_citizens.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if request.method == 'GET':
#         serializer =agg_sc_add_new_citizens_get_Serializer(snippet)
#         return Response(serializer.data)


#     elif request.method == 'PUT':
#         serializer = agg_sc_add_new_citizens_Serializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status

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


#-----------------------ADD NEW EMPLOYEE(POST Method)-------------------------#
# @api_view(['POST'])
# def agg_sc_add_new_employee_post_info_ViewSet1(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'POST':
#         aadhar_no = request.data.get('aadhar_id', None)
#         existing_citizens = agg_sc_add_new_citizens.objects.filter(aadhar_id=aadhar_no)
        
#         if existing_citizens.exists():
#             return Response({"error": "Citizen is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)
        
#         serializer = agg_sc_add_new_employee_POST_Serializer(data=request.data)
#         if serializer.is_valid():
#             new_citizen = serializer.save()
            
#             # Extract the source_name from the newly added citizen's data
#             source_name = new_citizen.source_name
#             source = new_citizen.source
#             source_state = new_citizen.state
#             source_district = new_citizen.district
#             source_tahasil = new_citizen.tehsil
#             source_class = new_citizen.Class
#             type = new_citizen.type

#             # Find the schedules that match the source_name
#             schedules = agg_sc_schedule_screening.objects.filter(
#                 source_name=source_name,
#                 source=source,
#                 state=source_state,
#                 district=source_district,
#                 tehsil=source_tahasil,
#                 Class=source_class,
#                 type=type
#             )

#             # Check if there are schedules for this source_name
#             if schedules.exists():
#                 # Get the schedule_ids as a list
#                 schedule_ids = [schedule.schedule_id for schedule in schedules]

#                 # Find the latest schedule count for the corresponding schedule
#                 latest_schedule_count_entry = agg_sc_citizen_schedule.objects.filter(
#                     schedule_id__in=schedule_ids
#                 ).order_by('-schedule_count').first()

#                 if latest_schedule_count_entry:
#                     # Assign the new citizen the same schedule count
#                     schedule_count = latest_schedule_count_entry.schedule_count
#                 else:
#                     # If no existing schedule count is found, set it to 1
#                     schedule_count = 1

#                 # Create an entry for the new citizen in agg_sc_citizen_schedule
#                 agg_sc_citizen_schedule.objects.create(
#                     citizen_id=new_citizen.citizen_id,
#                     schedule_id=schedule_ids[0],  # Assign to the first schedule in the list
#                     schedule_count=schedule_count,  # Assign the same schedule count
#                     citizen_pk_id=new_citizen,
#                 )

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except MultipleObjectsReturned:
#             # Handle the case where multiple citizens with the same Aadhar ID are found
#             return Response({"error": "Citizen is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)
        

# @api_view(['POST'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
# def agg_sc_add_new_employee_post_info_ViewSet1(request):
#     if request.method == 'POST':
#         # aadhar_no = request.data['aadhar_id']
#         aadhar_no = request.data.get('aadhar_id', None)
#         try:
#             is_exist = agg_sc_add_new_citizens.objects.get(aadhar_id=aadhar_no)
#             return Response({"error": "Citizen is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)
#         except agg_sc_add_new_citizens.DoesNotExist:
#             # Create the new citizen record
#             serializer = agg_sc_add_new_employee_POST_Serializer(data=request.data)
#             if serializer.is_valid():
#                 new_citizen = serializer.save()

#                 # Extract the source_name from the newly added citizen's data
#                 source_name = new_citizen.source_name
#                 source = new_citizen.source
#                 source_state = new_citizen.state
#                 source_district = new_citizen.district
#                 source_tahasil = new_citizen.tehsil
#                 source_class = new_citizen.Class
#                 department = new_citizen.department
#                 type = new_citizen.type

#                 # Find the schedules that match the source_name
#                 schedules = agg_sc_schedule_screening.objects.filter(
#                     source_name=source_name,
#                     source=source,
#                     state=source_state,
#                     district=source_district,
#                     tehsil=source_tahasil,
#                     Class=source_class,
#                     department=department,
#                     type=type
#                 )

#                 # Check if there are schedules for this source_name
#                 if schedules.exists():
#                     # Get the schedule_ids as a list
#                     schedule_ids = [schedule.schedule_id for schedule in schedules]

#                     # Find the latest schedule count for the corresponding schedule
#                     latest_schedule_count_entry = agg_sc_citizen_schedule.objects.filter(
#                         schedule_id__in=schedule_ids
#                     ).order_by('-schedule_count').first()

#                     if latest_schedule_count_entry:
#                         # Assign the new citizen the same schedule count
#                         schedule_count = latest_schedule_count_entry.schedule_count
#                     else:
#                         # If no existing schedule count is found, set it to 1
#                         schedule_count = 1

#                     # Create an entry for the new citizen in agg_sc_citizen_schedule
#                     agg_sc_citizen_schedule.objects.create(
#                         citizen_id=new_citizen.citizen_id,
#                         schedule_id=schedule_ids[0],  # Assign to the first schedule in the list
#                         schedule_count=schedule_count,  # Assign the same schedule count
#                         citizen_pk_id=new_citizen,
#                     )

#                 return Response(serializer.data, status=status.HTTP_201_CREATED)

#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except MultipleObjectsReturned:
#             # Handle the case where multiple citizens with the same Aadhar ID are found
#             return Response({"error": "Citizen is already registered with the provided data"}, status=status.HTTP_409_CONFLICT)
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import agg_sc_add_new_citizens, agg_sc_schedule_screening, agg_sc_citizen_schedule
from .serializers import agg_sc_add_new_employee_POST_Serializer

@api_view(['POST'])
def agg_sc_add_new_employee_post_info_ViewSet1(request):
    if request.method == 'POST':
        emp_id = request.data.get('employee_id', None)
        
        if emp_id is None:
            return Response({"error": "Employee ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if a citizen with the given employee_id already exists
        existing_citizens = agg_sc_add_new_citizens.objects.filter(employee_id=emp_id)
        if existing_citizens.exists():
            return Response({"error": "Citizen is already registered with the Employee ID"}, status=status.HTTP_409_CONFLICT)
        
        serializer = agg_sc_add_new_employee_POST_Serializer(data=request.data)
        if serializer.is_valid():
            new_citizen = serializer.save()

            # Extract other required fields from the newly added citizen's data
            source_name = new_citizen.source_name
            source = new_citizen.source
            source_state = new_citizen.state
            source_district = new_citizen.district
            source_tahasil = new_citizen.tehsil
            department = new_citizen.department
            type = new_citizen.type

            # Find the schedules that match the source_name
            schedules = agg_sc_schedule_screening.objects.filter(
                source_name=source_name,
                source=source,
                state=source_state,
                district=source_district,
                tehsil=source_tahasil,
                department=department,
                type=type
            )

            # Check if there are schedules for this source_name
            if schedules.exists():
                # Get the schedule_ids as a list
                schedule_ids = [schedule.schedule_id for schedule in schedules]

                # Find the latest schedule count for the corresponding schedule
                latest_schedule_count_entry = agg_sc_citizen_schedule.objects.filter(
                    schedule_id__in=schedule_ids
                ).order_by('-schedule_count').first()

                if latest_schedule_count_entry:
                    # Assign the new citizen the same schedule count
                    schedule_count = latest_schedule_count_entry.schedule_count
                else:
                    # If no existing schedule count is found, set it to 1
                    schedule_count = 1

                # Create an entry for the new citizen in agg_sc_citizen_schedule
                agg_sc_citizen_schedule.objects.create(
                    citizen_id=new_citizen.citizen_id,
                    schedule_id=schedule_ids[0],  # Assign to the first schedule in the list
                    schedule_count=schedule_count,  # Assign the same schedule count
                    citizen_pk_id=new_citizen,
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Return a method not allowed response if the request method is not POST
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    
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


# #________________ Schedule Screening INFO API(GET & PUT,DELETE Method)__________________
# @api_view(['GET'])
# def start_screening_info_ViewSet1(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         screenings = agg_sc_start_screening.objects.all()
#         serialized_data = []

#         for screening in screenings:
#             # # Serialize the screening data using the serializer
#             # serializer = agg_sc_start_screening_Serializer(screening)
#             # serialized_data.append(serializer.data)
            
#             # Retrieve citizen details from the related agg_sc_add_new_citizens instance
#             citizen_name = screening.citizen_id.name
#             citizen_mobile = screening.citizen_id.parents_mobile
            
#             # Add citizen_name and citizen_mobile to the serialized data
#             serialized_data[-1]['citizen_name'] = citizen_name
#             serialized_data[-1]['citizen_mobile'] = citizen_mobile

#         return Response(serialized_data)
#__________________________________END API__________________________________

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from .models import agg_sc_add_new_citizens, agg_sc_schedule_screening

# Define your serializers as before

class CombinedDataView(APIView):
    def get(self, request):
        citizen_data = agg_sc_add_new_citizens.objects.all()
        schedule_data = agg_sc_schedule_screening.objects.all()
        
        # Serialize the data using the combined serializer
        combined_data = {
            'citizen_data': agg_sc_citizen_basic_info_Serializer(citizen_data, many=True).data,
            'schedule_data': schedule_Serializer(schedule_data, many=True).data,
        }

        return Response(combined_citizenand_schedule_Serializer(combined_data).data)





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




 

# class startscr(APIView):
#     serializer_class = scrserialzer
#     def get(self,request, source_name):
#         data = agg_sc_add_new_citizens.objects.filter(source_name= source_name,)
#         serializer = self.serializer_class(startscr, many=True)
#         return Response(serializer.data)
    
    
class startscr(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = scrserialzer

    def get(self, request, source_name):
        data = agg_sc_add_new_citizens.objects.filter(source_name=source_name)
        serializer = self.serializer_class(data, many=True)  
        return Response(serializer.data)



# In your app's views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .models import agg_sc_citizen_schedule, agg_sc_add_new_citizens
from .serializers import CitizenSerializer
from datetime import timedelta
from django.utils import timezone

# @api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
# def agg_sc_get_start_screening_info_ViewSet1(request):
#     if request.method == 'GET':
#         filter_params = {}
        
#         # Extracting query parameters
#         type_id = request.query_params.get('type_id')
#         source_id = request.query_params.get('source_id')
#         class_id = request.query_params.get('class_id')
#         schedule_count = request.query_params.get('schedule_count')
#         department_id = request.query_params.get('department_id')
#         source_name = request.query_params.get('source_name')
        
#         # Adding filters to filter_params
#         if type_id is not None:
#             filter_params['citizen_pk_id__type'] = type_id
#         if source_id is not None:
#             filter_params['citizen_pk_id__source'] = source_id
#         if class_id is not None:
#             filter_params['citizen_pk_id__Class'] = class_id
#         if schedule_count is not None:
#             filter_params['schedule_count'] = schedule_count
#         if department_id is not None:
#             filter_params['citizen_pk_id__department_id'] = department_id
#         if source_name is not None:
#             filter_params['citizen_pk_id__source_name'] = source_name
        
#         # Retrieve schedules based on filter_params
#         schedules = agg_sc_citizen_schedule.objects.filter(**filter_params)
        
#         response_data = []

#         for schedule in schedules:
#             citizen_id = schedule.citizen_id

#             try:
#                 citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
#                 serializer = CitizenSerializer(citizen)

#                 response_data.append({
#                     'pk_id': schedule.pk_id,
#                     'citizen_id': schedule.citizen_id,
#                     'schedule_id': schedule.schedule_id,
#                     'schedule_count': schedule.schedule_count,
#                     'citizen_info': serializer.data,
#                 })

#             except ObjectDoesNotExist:
#                 # Handle the case where the citizen with the specified citizen_id doesn't exist
#                 response_data.append({
#                     'pk_id': schedule.pk_id,
#                     'citizen_id': schedule.citizen_id,
#                     'schedule_id': schedule.schedule_id,
#                     'schedule_count': schedule.schedule_count, 
#                     'citizen_info': None,  # Or any other default value or message
#                 })

#         return Response(response_data)

# @api_view(['GET'])
# @renderer_classes([UserRenderer])
# @permission_classes([IsAuthenticated])
# def agg_sc_get_start_screening_info_ViewSet1(request):
#     if request.method == 'GET':
#         filter_params = {}
        
#         type_id = request.query_params.get('type_id')
#         source_id = request.query_params.get('source_id')
#         class_id = request.query_params.get('class_id')
#         schedule_count = request.query_params.get('schedule_count')
#         department_id = request.query_params.get('department_id')
#         source_name = request.query_params.get('source_name')
#         district = request.query_params.get('district')
#         tehsil = request.query_params.get('tehsil')
#         location = request.query_params.get('location')
        
        
#         if type_id is not None:
#             filter_params['citizen_pk_id__type'] = type_id
#         if source_id is not None:
#             filter_params['citizen_pk_id__source'] = source_id
#         if class_id is not None:
#             filter_params['citizen_pk_id__Class'] = class_id
#         if schedule_count is not None:
#             filter_params['schedule_count'] = schedule_count
#         if department_id is not None:
#             filter_params['citizen_pk_id__department_id'] = department_id
#         if source_name is not None:
#             filter_params['citizen_pk_id__source_name'] = source_name
        
#         if district is not None:
#             filter_params['citizen_pk_id__district'] = district
        
#         if tehsil is not None:
#             filter_params['citizen_pk_id__tehsil'] = tehsil
        
#         if location is not None:
#             filter_params['citizen_pk_id__location'] = location
        
#         if source_id == '1':
#             tables = [
#                 ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
#                 ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
#                 ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
#                 ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
#                 ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
#                 ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
#                 ('citizen_basic_info', citizen_basic_info),
#                 ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
#                 ('agg_sc_citizen_pycho_info', agg_sc_citizen_pycho_info),
#                 ('agg_sc_citizen_immunization_info', agg_sc_citizen_immunization_info),
                
                
#             ]
#         elif source_id == '5':
#             tables = [
#                 ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
#                 ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
#                 ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
#                 ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
#                 ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
#                 ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
#                 ('citizen_basic_info', citizen_basic_info),
#                 ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
#                 ('agg_sc_investigation', agg_sc_investigation),
#                 ('agg_sc_citizen_medical_history', agg_sc_citizen_medical_history),
#                 ('agg_sc_pft', agg_sc_pft)
#             ]
        
#         elif source_id == '6':
#             tables = [
#                 ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
#                 ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
#                 ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
#                 ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
#                 ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
#                 ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
#                 ('citizen_basic_info', citizen_basic_info),
#                 ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
#                 ('agg_sc_investigation', agg_sc_investigation),
#                 ('agg_sc_citizen_medical_history', agg_sc_citizen_medical_history),
#                 ('agg_sc_pft', agg_sc_pft)
#             ]
        
        
#         schedules = agg_sc_citizen_schedule.objects.filter(**filter_params,closing_status=False)
#         response_data = []

#         for schedule in schedules:
#             citizen_id = schedule.citizen_id

#             try:
#                 citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
#                 serializer = CitizenSerializer(citizen)

#                 complete_forms = 0
#                 incomplete_forms = 0
#                 total_form_data = {}

#                 for table_name, table in tables:
#                     complete_count = table.objects.filter(citizen_id=citizen_id, form_submit=True).count()
#                     incomplete_count = table.objects.filter(citizen_id=citizen_id, form_submit=False).count()

#                     if complete_count > 0:
#                         complete_forms += 1
#                     else:
#                         incomplete_forms += 1

#                     total_form_data[table_name] = 'true' if complete_count > 0 else 'false'

#                 response_data.append({
#                     'pk_id': schedule.pk_id,
#                     'citizen_id': schedule.citizen_id,
#                     'schedule_id': schedule.schedule_id,
#                     'schedule_count': schedule.schedule_count,
#                     'citizen_info': serializer.data,
#                     'form_counts': {
#                         'complete_forms': complete_forms,
#                         'incomplete_forms': incomplete_forms,
#                         'total_tables': len(tables)
#                     },
#                     'Total_form_data': total_form_data
#                 })

#             except ObjectDoesNotExist:
#                 response_data.append({
#                     'pk_id': schedule.pk_id,
#                     'citizen_id': schedule.citizen_id,
#                     'schedule_id': schedule.schedule_id,
#                     'schedule_count': schedule.schedule_count, 
#                     'citizen_info': None,  # Or any other default value or message
#                     'form_counts': {
#                         'complete_forms': 0,
#                         'incomplete_forms': len(tables),  # All forms are incomplete if citizen does not exist
#                         'total_tables': len(tables)
#                     },
#                     'Total_form_data': {table_name: 'false' for table_name, _ in tables}
#                 })

#         return Response(response_data)


    

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.core.exceptions import ObjectDoesNotExist

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_get_start_screening_info_ViewSet1(request):
    filter_params = {}

    # Extract filters from query params
    type_id = request.query_params.get('type_id')
    source_id = request.query_params.get('source_id')
    class_id = request.query_params.get('class_id')
    schedule_count = request.query_params.get('schedule_count')
    department_id = request.query_params.get('department_id')
    source_name = request.query_params.get('source_name')
    district = request.query_params.get('district')
    tehsil = request.query_params.get('tehsil')
    location = request.query_params.get('location')
    search_info = request.query_params.get('search_info')  
    

    if type_id:
        filter_params['citizen_pk_id__type'] = type_id
    if source_id:
        filter_params['citizen_pk_id__source'] = source_id
    if class_id:
        filter_params['citizen_pk_id__Class'] = class_id
    if schedule_count:
        filter_params['schedule_count'] = schedule_count
    if department_id:
        filter_params['citizen_pk_id__department_id'] = department_id
    if source_name:
        filter_params['citizen_pk_id__source_name'] = source_name
    if district:
        filter_params['citizen_pk_id__district'] = district
    if tehsil:
        filter_params['citizen_pk_id__tehsil'] = tehsil
    if location:
        filter_params['citizen_pk_id__location'] = location

    # ✅ Default (all forms)
    all_tables = [
        ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
        ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
        ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
        ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
        ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
        ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
        ('citizen_basic_info', citizen_basic_info),
        ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
        ('agg_sc_citizen_pycho_info', agg_sc_citizen_pycho_info),
        ('agg_sc_citizen_immunization_info', agg_sc_citizen_immunization_info),
        ('agg_sc_investigation', agg_sc_investigation),
        ('agg_sc_citizen_medical_history', agg_sc_citizen_medical_history),
        ('agg_sc_pft', agg_sc_pft),
    ]

    # ✅ Choose tables by source_id
    if source_id == '1':
        tables = [
            ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
            ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
            ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
            ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
            ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
            ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
            ('citizen_basic_info', citizen_basic_info),
            ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
            ('agg_sc_citizen_pycho_info', agg_sc_citizen_pycho_info),
            ('agg_sc_citizen_immunization_info', agg_sc_citizen_immunization_info),
        ]
    elif source_id == '5':
        tables = [
            ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
            ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
            ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
            ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
            ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
            ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
            ('citizen_basic_info', citizen_basic_info),
            ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
            ('agg_sc_investigation', agg_sc_investigation),
            ('agg_sc_citizen_medical_history', agg_sc_citizen_medical_history),
            ('agg_sc_pft', agg_sc_pft),
        ]
    elif source_id == '6':
        tables = [
            ('agg_sc_citizen_vision_info', agg_sc_citizen_vision_info),
            ('agg_sc_basic_screening_info', agg_sc_basic_screening_info),
            ('agg_sc_citizen_audit_info', agg_sc_citizen_audit_info),
            ('agg_sc_citizen_vital_info', agg_sc_citizen_vital_info),
            ('agg_sc_citizen_dental_info', agg_sc_citizen_dental_info),
            ('agg_sc_citizen_family_info', agg_sc_citizen_family_info),
            ('citizen_basic_info', citizen_basic_info),
            ('agg_sc_growth_monitoring_info', agg_sc_growth_monitoring_info),
            ('agg_sc_investigation', agg_sc_investigation),
            ('agg_sc_citizen_medical_history', agg_sc_citizen_medical_history),
            ('agg_sc_pft', agg_sc_pft),
        ]
    elif source_id is None:
        tables = all_tables
    else:
        return Response(
            {"error": f"Invalid source_id {source_id}. Allowed values: 1, 5, 6, or empty."},
            status=400
        )

    # ✅ Base queryset
    schedules = agg_sc_citizen_schedule.objects.filter(closing_status=False, **filter_params)

    # ✅ Apply search filter if provided
    if search_info:
        schedules = schedules.filter(
            Q(citizen_pk_id__name__icontains=search_info) |
            Q(citizen_id__icontains=search_info) |
            Q(schedule_id__icontains=search_info) |
            Q(citizen_pk_id__parents_mobile__icontains=search_info)
        )

    # ✅ Apply default limit only when no filters AND no search
    if not filter_params and not search_info:
        schedules = schedules[:6]

    response_data = []

    for schedule in schedules:
        citizen_id = schedule.citizen_id
        try:
            citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
            # ✅ If using DRF serializer, keep context
            serializer = CitizenSerializer(citizen, context={'request': request})

            complete_forms = 0
            incomplete_forms = 0
            total_form_data = {}

            for table_name, table in tables:
                complete_count = table.objects.filter(citizen_id=citizen_id, form_submit=True).count()
                incomplete_count = table.objects.filter(citizen_id=citizen_id, form_submit=False).count()

                if complete_count > 0:
                    complete_forms += 1
                else:
                    incomplete_forms += 1

                total_form_data[table_name] = 'true' if complete_count > 0 else 'false'

            response_data.append({
                'pk_id': schedule.pk_id,
                'citizen_id': schedule.citizen_id,
                'schedule_id': schedule.schedule_id,
                'schedule_count': schedule.schedule_count,
                'citizen_info': serializer.data,
                'form_counts': {
                    'complete_forms': complete_forms,
                    'incomplete_forms': incomplete_forms,
                    'total_tables': len(tables)
                },
                'Total_form_data': total_form_data
            })

        except ObjectDoesNotExist:
            response_data.append({
                'pk_id': schedule.pk_id,
                'citizen_id': schedule.citizen_id,
                'schedule_id': schedule.schedule_id,
                'schedule_count': schedule.schedule_count,
                'citizen_info': None,
                'form_counts': {
                    'complete_forms': 0,
                    'incomplete_forms': len(tables),
                    'total_tables': len(tables)
                },
                'Total_form_data': {table_name: 'false' for table_name, _ in tables}
            })

    return Response(response_data)
   






    
# @api_view(['GET'])
# def agg_sc_get_citizen_basic_info_ViewSet1(request):
#     if request.method == 'GET':
#         schedules = agg_sc_citizen_schedule.objects.all()
#         response_data = []

#         for schedule in schedules:
#             citizen_id = schedule.citizen_id
#             citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
#             serializer = CitizenBasicinfoSerializer(citizen)
            
#             response_data.append({
#                 'citizen_id': schedule.citizen_id,
#                 'schedule_id': schedule.schedule_id,
#                 'citizen_info': serializer.data,
#             })

#         return Response(response_data)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import agg_sc_citizen_schedule, agg_sc_add_new_citizens, citizen_basic_info
from .serializers import CitizenBasicinfoSerializer

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_get_citizen_basic_info_ViewSet1(request, pk):
    if request.method == 'GET':
        schedules = agg_sc_citizen_schedule.objects.filter(pk=pk)
        response_data = []

        for schedule in schedules:
            citizen_id = schedule.citizen_id
            citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
            serializer = CitizenBasicinfoSerializer(citizen)

            existing_entry = citizen_basic_info.objects.filter(
                citizen_id=schedule.citizen_id,
                schedule_id=schedule.schedule_id
            ).first()

            if existing_entry:
                existing_entry.name = serializer.data['name']
                existing_entry.prefix = serializer.data['prefix']
                existing_entry.gender = serializer.data['gender']
                existing_entry.blood_groups = serializer.data['blood_groups']
                existing_entry.dob = serializer.data['dob']
                existing_entry.year = serializer.data['year']
                existing_entry.months = serializer.data['months']
                existing_entry.days = serializer.data['days']
                existing_entry.aadhar_id = serializer.data['aadhar_id']
                existing_entry.emp_mobile_no = serializer.data['emp_mobile_no']
                existing_entry.email_id = serializer.data['email_id']
                existing_entry.employee_id = serializer.data['employee_id']
                existing_entry.doj = serializer.data['doj']
                existing_entry.department_id = citizen.department_id  
                existing_entry.designation_id = citizen.designation_id  
                # existing_entry.citizens_pk_id = citizen  #for pk id save
                existing_entry.save()
            else:
                citizen_basic_info_obj = citizen_basic_info(
                    citizen_id=schedule.citizen_id,
                    schedule_id=schedule.schedule_id,
                    schedule_count=schedule.schedule_count,
                    name=serializer.data['name'],
                    prefix=serializer.data['prefix'],
                    gender=serializer.data['gender'],
                    blood_groups=serializer.data['blood_groups'],
                    dob=serializer.data['dob'],
                    year=serializer.data['year'],
                    months=serializer.data['months'],
                    days=serializer.data['days'],
                    aadhar_id=serializer.data['aadhar_id'],
                    emp_mobile_no=serializer.data['emp_mobile_no'],
                    email_id=serializer.data['email_id'],
                    employee_id=serializer.data['employee_id'],
                    doj=serializer.data['doj'],
                    department_id=citizen.department_id, 
                    designation_id=citizen.designation_id,  
                    # citizens_pk_id=citizen, #for pk id save
                )
                citizen_basic_info_obj.save()

            response_data.append({
                'citizen_id': schedule.citizen_id,
                'schedule_id': schedule.schedule_id,
                'schedule_count': schedule.schedule_count,
                'citizen_info': {
                    'citizens_pk_id': citizen.pk,
                    'id': existing_entry.id if existing_entry else citizen_basic_info_obj.id,
                    
                    'name': serializer.data['name'],
                    'prefix': serializer.data['prefix'],
                    'gender': serializer.data['gender'],
                    'blood_groups': serializer.data['blood_groups'],
                    'dob': serializer.data['dob'],
                    'year': serializer.data['year'],
                    'months': serializer.data['months'],
                    'days': serializer.data['days'],
                    'aadhar_id': serializer.data['aadhar_id'],
                    'emp_mobile_no': serializer.data['emp_mobile_no'],
                    'email_id': serializer.data['email_id'],
                    'employee_id': serializer.data['employee_id'],
                    'doj': serializer.data['doj'],
                    'department': citizen.department_id, 
                    'designation': citizen.designation_id,  
                    # 'citizen_pk_id': citizen.pk, #for pk id save
                },
            })

        return Response(response_data)





from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import CitizenFamilyinfoSerializer
from .models import agg_sc_citizen_schedule, agg_sc_add_new_citizens, agg_sc_citizen_family_info

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_get_citizen_family_info_ViewSet1(request, pk):
    if request.method == 'GET':
        schedules = agg_sc_citizen_schedule.objects.filter(pk=pk)
        response_data = []

        for schedule in schedules:
            citizen_id = schedule.citizen_id
            citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
            serializer = CitizenFamilyinfoSerializer(citizen)

            # Check if the entry already exists
            existing_entry = agg_sc_citizen_family_info.objects.filter(
                citizen_id=schedule.citizen_id,
                schedule_id=schedule.schedule_id
            ).first()

            if existing_entry:
                # Entry already exists, you may want to update it instead of creating a new one
                # Update the existing entry with the new data if needed
                existing_entry.father_name = serializer.data['father_name']
                existing_entry.mother_name = serializer.data['mother_name']
                # existing_entry.citizens_pk_id = citizen #for pk id save
                # ... update other fields as needed
                existing_entry.save()

                response_data.append({
                    'id': existing_entry.id,
                    'citizen_id': schedule.citizen_id,
                    'schedule_id': schedule.schedule_id,
                    'schedule_count': schedule.schedule_count,
                    'citizen_info': serializer.data,
                })
            else:
                # Entry doesn't exist, create and save a new one
                family_info_obj = agg_sc_citizen_family_info(
                    citizen_id=schedule.citizen_id,
                    schedule_id=schedule.schedule_id,
                    schedule_count=schedule.schedule_count,
                    father_name=serializer.data['father_name'],
                    mother_name=serializer.data['mother_name'],
                    occupation_of_father=serializer.data['occupation_of_father'],
                    occupation_of_mother=serializer.data['occupation_of_mother'],
                    parents_mobile=serializer.data['parents_mobile'],
                    sibling_count=serializer.data['sibling_count'],
                    child_count=serializer.data['child_count'],
                    spouse_name=serializer.data['spouse_name'],
                    marital_status=serializer.data['marital_status'],
                    
                    emergency_prefix=serializer.data['emergency_prefix'],
                    emergency_fullname=serializer.data['emergency_fullname'],
                    emergency_gender=serializer.data['emergency_gender'],
                    emergency_contact=serializer.data['emergency_contact'],
                    emergency_email=serializer.data['emergency_email'],
                    relationship_with_employee=serializer.data['relationship_with_employee'],
                    emergency_address=serializer.data['emergency_address'],
                    
                    # citizens_pk_id=citizen,#for pk id save
                    
                    
                )
                family_info_obj.save()

                response_data.append({
                    'id': family_info_obj.id,
                    'citizen_id': schedule.citizen_id,
                    'schedule_id': schedule.schedule_id,
                    'schedule_count': schedule.schedule_count,
                    'citizen_info': serializer.data,
                })

        return Response(response_data)






from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import CitizenGrowthMonitoringinfoSerializer
from .models import agg_sc_citizen_schedule, agg_sc_add_new_citizens, agg_sc_growth_monitoring_info

# @api_view(['GET'])
# def agg_sc_get_citizen_growthmonitring_info_ViewSet1(request, pk):
#     if request.method == 'GET':
#         schedules = agg_sc_citizen_schedule.objects.filter(pk=pk)
#         response_data = []

#         for schedule in schedules:
#             citizen_id = schedule.citizen_id
#             citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
#             serializer = CitizenGrowthMonitoringinfoSerializer(citizen)

#             # Fetch the latest entry from the database
#             existing_entry = agg_sc_growth_monitoring_info.objects.filter(
#                 citizen_id=schedule.citizen_id,
#                 schedule_id=schedule.schedule_id
#             ).first()

#             if existing_entry:
#                 # Include the latest entry in the response_data
#                 response_data.append({
#                     'id': existing_entry.id,
#                     'citizen_id': schedule.citizen_id,
#                     'schedule_id': schedule.schedule_id,
#                     'schedule_count': schedule.schedule_count,
#                     'citizen_info': dict(CitizenGrowthMonitoringinfoSerializer(existing_entry).data),
#                 })
#             else:
#                 # If no existing entry is found, create a new one and save it
#                 growth_info_obj = agg_sc_growth_monitoring_info(
#                     citizen_id=schedule.citizen_id,
#                     schedule_id=schedule.schedule_id,
#                     schedule_count=schedule.schedule_count,
#                     gender=serializer.data.get('gender'),
#                     dob=serializer.data.get('dob'),
#                     year=serializer.data.get('year'),
#                     months=serializer.data.get('months'),
#                     days=serializer.data.get('days'),
#                     height=serializer.data.get('height'),
#                     weight=serializer.data.get('weight'),
#                     weight_for_age=serializer.data.get('weight_for_age'),
#                     height_for_age=serializer.data.get('height_for_age'),
#                     weight_for_height=serializer.data.get('weight_for_height'),
#                     bmi=serializer.data.get('bmi', None),
#                     arm_size=serializer.data.get('arm_size')
#                     # ... add other fields as needed
#                 )
#                 growth_info_obj.save()

#                 # Include the new entry in the response_data
#                 response_data.append({
#                     'id': growth_info_obj.id,
#                     'citizen_id': schedule.citizen_id,
#                     'schedule_id': schedule.schedule_id,
#                     'schedule_count': schedule.schedule_count,
#                     'citizen_info': dict(serializer.data),
#                 })

#         return Response(response_data)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import agg_sc_citizen_schedule, agg_sc_add_new_citizens, agg_sc_growth_monitoring_info

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def agg_sc_get_citizen_growthmonitring_info_ViewSet1(request, pk):
    if request.method == 'GET':
        schedules = agg_sc_citizen_schedule.objects.filter(pk=pk)
        response_data = []

        for schedule in schedules:
            citizen_id = schedule.citizen_id
            citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
            citizen_serializer = CitizenGrowthMonitoringinfoSerializer(citizen)  # Use serializer for agg_sc_add_new_citizens

            # Serialize the citizen object
            citizen_data = citizen_serializer.data

            # Fetch the latest entry from the database
            existing_entry = agg_sc_growth_monitoring_info.objects.filter(
                citizen_id=schedule.citizen_id,
                schedule_id=schedule.schedule_id
            ).first()

            if existing_entry:
                # existing_entry.gender = citizen_serializer.data['gender']
                # existing_entry.dob = citizen_serializer.data['dob']
                # existing_entry.year = citizen_serializer.data['year']
                # existing_entry.months = citizen_serializer.data['months']
                # existing_entry.days = citizen_serializer.data['days']
                # existing_entry.height = citizen_serializer.data['height']
                # existing_entry.weight = citizen_serializer.data['weight']
                # existing_entry.weight_for_age = citizen_serializer.data['weight_for_age']
                # existing_entry.height_for_age = citizen_serializer.data['height_for_age']
                # existing_entry.weight_for_height = citizen_serializer.data['weight_for_height']
                # existing_entry.bmi = citizen_serializer.data['bmi']
                # existing_entry.arm_size = citizen_serializer.data['arm_size']
                # existing_entry.citizens_pk_id = citizen
                # existing_entry.save()
                # Include the latest entry in the response_data
                response_data.append({
                    'id': existing_entry.id,
                    'citizen_id': schedule.citizen_id,
                    'schedule_id': schedule.schedule_id,
                    'schedule_count': schedule.schedule_count,
                    'citizen_info': dict(CitizenGrowthMonitoringinfoSerializer(existing_entry).data),
                
                    
                })
            else:
                # If no existing entry is found, create a new one and save it
                growth_info_obj = agg_sc_growth_monitoring_info(
                    citizen_id=schedule.citizen_id,
                    schedule_id=schedule.schedule_id,
                    schedule_count=schedule.schedule_count,
                    citizen_pk_id=citizen,  # Assign the instance of agg_sc_add_new_citizens
                    gender=citizen_data.get('gender'),
                    dob=citizen_data.get('dob'),
                    year=citizen_data.get('year'),
                    months=citizen_data.get('months'),
                    days=citizen_data.get('days'),
                    height=citizen_data.get('height'),
                    weight=citizen_data.get('weight'),
                    weight_for_age=citizen_data.get('weight_for_age'),
                    height_for_age=citizen_data.get('height_for_age'),
                    weight_for_height=citizen_data.get('weight_for_height'),
                    bmi=citizen_data.get('bmi', None),
                    arm_size=citizen_data.get('arm_size'),
                    # citizens_pk_id=citizen,
                    # Add other fields as needed
                )
                growth_info_obj.save()

                # Include the new entry in the response_data
                response_data.append({
                    'id': growth_info_obj.id,
                    'citizen_id': schedule.citizen_id,
                    'schedule_id': schedule.schedule_id,
                    'schedule_count': schedule.schedule_count,
                    'citizen_info': citizen_data,
                    'citizen_pk_id': citizen.pk,
                })

        return Response(response_data)








class CitizenmedicalevenInfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        medical_event_info_entries = agg_sc_growth_monitoring_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = CitizenMedicalEventinfoSerializer(medical_event_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)





  
# @api_view(['POST'])
# def agg_sc_post_citizen_vital_info_ViewSet1(request,pk):
#     if request.method == 'GET':
#         schedules = CitizenVitalinfoSerializer.objects.filter(pk=pk)
#         response_data = []

#         for schedule in schedules:
#             citizen_id = schedule.citizen_id
#             citizen = agg_sc_add_new_citizens.objects.get(citizen_id=citizen_id)
#             serializer = CitizenVitalinfoSerializer(citizen)

#             # Create an instance of agg_sc_citizen_family_info and save it to the database
#             vital_info = serializer.data
#             vital_info_obj = agg_sc_citizen_vital_info(
#                 citizen_id=schedule.citizen_id,
#                 schedule_id=schedule.schedule_id,
#                 pulse=vital_info['pulse'],
#                 sys_mm=vital_info['sys_mm'],
#                 dys_mm=vital_info['dys_mm'],
#                 rr=vital_info['rr'],
#                 oxygen_saturation=vital_info['oxygen_saturation'],
#                 temp=vital_info['temp'],
#                 hb=vital_info['hb']
#             )
#             vital_info_obj.save()

#             response_data.append({
#                 'citizen_id': schedule.citizen_id,
#                 'schedule_id': schedule.schedule_id,
#                 'vital_info': vital_info,
#             })

#         return Response(response_data)

# from django.http import Http404
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from .models import agg_sc_citizen_schedule, agg_sc_citizen_vital_info

# class CitizenVitalInfoPost(APIView):
#     def post(self, request, *args, **kwargs):
#         try:
#             schedule_pk = kwargs.get('schedule_pk')
#             citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
#         except Http404:
#             return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         # Extract data from the schedule record
#         citizen_id = citizen_schedule.citizen_id
#         schedule_id = citizen_schedule.schedule_id
#         schedule_count = citizen_schedule.schedule_count
        
#         citizen_pk_id_value = request.data.get('citizen_pk_id')
#         added_by_id = request.data.get('added_by')
#         modify_by_id = request.data.get('modify_by')
        

#         try:
#             citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
#         except agg_sc_add_new_citizens.DoesNotExist:
#             return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
#         except agg_com_colleague.DoesNotExist:
#             return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
#         except agg_com_colleague.DoesNotExist:
#             return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Check if the entry already exists
#         existing_entry = agg_sc_citizen_vital_info.objects.filter(
#             citizen_id=citizen_id,
#             schedule_id=schedule_id
          
            
#         ).first()

#         if existing_entry:
#             # Entry already exists, you may want to update it instead of creating a new one
#             # Update the existing entry with the new data if needed
#             # existing_entry.citizen_pk_id = request.data.get('citizen_pk_id')
#             existing_entry.pulse = request.data.get('pulse')
#             existing_entry.pulse_conditions = request.data.get('pulse_conditions')
#             existing_entry.sys_mm = request.data.get('sys_mm')
#             existing_entry.sys_mm_conditions = request.data.get('sys_mm_conditions')
#             existing_entry.dys_mm = request.data.get('dys_mm')
#             existing_entry.dys_mm_mm_conditions = request.data.get('dys_mm_mm_conditions')
#             existing_entry.hb = request.data.get('hb')
#             existing_entry.hb_conditions = request.data.get('hb_conditions')
#             existing_entry.oxygen_saturation = request.data.get('oxygen_saturation')
#             existing_entry.oxygen_saturation_conditions = request.data.get('oxygen_saturation_conditions')
#             existing_entry.rr = request.data.get('rr')
#             existing_entry.rr_conditions = request.data.get('rr_conditions')
#             existing_entry.temp = request.data.get('temp')
#             existing_entry.temp_conditions = request.data.get('temp_conditions')
#             existing_entry.form_submit = request.data.get('form_submit')
#             existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
#             # existing_entry.added_by = added_by_instance 
#             existing_entry.modify_by = modify_by_instance
#             if not existing_entry.added_by:
#                 existing_entry.added_by = added_by_instance
            
#             existing_entry.save()

#             response_data = {
#                 'message': 'Data updated successfully',
#                 'updated_data': {
#                     # 'citizen_pk_id': existing_entry.citizen_pk_id,
#                     'pulse': existing_entry.pulse,
#                     'pulse_conditions': existing_entry.pulse_conditions,
#                     'sys_mm': existing_entry.sys_mm,
#                     'sys_mm_conditions': existing_entry.sys_mm_conditions,
#                     'dys_mm': existing_entry.dys_mm,
#                     'dys_mm_mm_conditions': existing_entry.dys_mm_mm_conditions,
#                     'hb': existing_entry.hb,
#                     'hb_conditions': existing_entry.hb_conditions,
#                     'oxygen_saturation': existing_entry.oxygen_saturation,
#                     'oxygen_saturation_conditions': existing_entry.oxygen_saturation_conditions,
#                     'rr': existing_entry.rr,
#                     'rr_conditions': existing_entry.rr_conditions,
#                     'temp': existing_entry.temp,
#                     'temp_conditions': existing_entry.temp_conditions,
#                     'reffered_to_specialist': existing_entry.reffered_to_specialist,
#                     'added_by': existing_entry.added_by.id,
#                     'modify_by': existing_entry.modify_by.id
                    
                    
#                 }
#             }

#             return Response(response_data, status=status.HTTP_200_OK)
#         else:
#             # Entry doesn't exist, create and save a new one
#             citizen_vital_info = agg_sc_citizen_vital_info(
#                 citizen_id=citizen_id,
#                 schedule_id=schedule_id,
#                 schedule_count=schedule_count,
#                 citizen_pk_id=citizen_pk_instance,
#                 pulse=request.data.get('pulse'),
#                 pulse_conditions=request.data.get('pulse_conditions'),
#                 sys_mm=request.data.get('sys_mm'),
#                 sys_mm_conditions=request.data.get('sys_mm_conditions'),
#                 dys_mm=request.data.get('dys_mm'),
#                 dys_mm_mm_conditions=request.data.get('dys_mm_mm_conditions'),
#                 hb=request.data.get('hb'),
#                 hb_conditions=request.data.get('hb_conditions'),
#                 oxygen_saturation=request.data.get('oxygen_saturation'),
#                 oxygen_saturation_conditions=request.data.get('oxygen_saturation_conditions'),
#                 rr=request.data.get('rr'),
#                 rr_conditions=request.data.get('rr_conditions'),
#                 temp=request.data.get('temp'),
#                 temp_conditions=request.data.get('temp_conditions'),
#                 form_submit=request.data.get('form_submit'),
#                 reffered_to_specialist=request.data.get('reffered_to_specialist'),
#                 added_by=added_by_instance,
#                 modify_by=modify_by_instance,
                
#             )

#             # Save the new citizen vital info record
#             citizen_vital_info.save()

#             # Update the citizen schedule record
#             citizen_schedule.closing_status = True
#             citizen_schedule.save()

            # response_data = {
            #     'message': 'Data sent successfully',
            #     'posted_data': {
            #         'citizen_pk_id': citizen_pk_instance.pk,
            #         'pulse': citizen_vital_info.pulse,
            #         'pulse_conditions': citizen_vital_info.pulse_conditions,
            #         'sys_mm': citizen_vital_info.sys_mm,
            #         'sys_mm_conditions': citizen_vital_info.sys_mm_conditions,
            #         'dys_mm': citizen_vital_info.dys_mm,
            #         'dys_mm_mm_conditions': citizen_vital_info.dys_mm_mm_conditions,
            #         'hb': citizen_vital_info.hb,
            #         'hb_conditions': citizen_vital_info.hb_conditions,
            #         'oxygen_saturation': citizen_vital_info.oxygen_saturation,
            #         'oxygen_saturation_conditions': citizen_vital_info.oxygen_saturation_conditions,
            #         'rr': citizen_vital_info.rr,
            #         'rr_conditions': citizen_vital_info.rr_conditions,
            #         'temp': citizen_vital_info.temp,
            #         'temp_conditions': citizen_vital_info.temp_conditions,
            #         'form_submit': citizen_vital_info.form_submit,
            #         'reffered_to_specialist': citizen_vital_info.reffered_to_specialist,
            #         'added_by':added_by_instance.pk,
            #         'modify_by': modify_by_instance.pk,
                    
            #     }
            # }

            # return Response(response_data, status=status.HTTP_201_CREATED)


from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import agg_sc_citizen_schedule, agg_sc_citizen_vital_info, agg_sc_follow_up_citizen
from django.utils import timezone

class CitizenVitalInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_entry = agg_sc_citizen_vital_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            existing_entry.pulse = request.data.get('pulse')
            existing_entry.pulse_conditions = request.data.get('pulse_conditions')
            existing_entry.sys_mm = request.data.get('sys_mm')
            existing_entry.sys_mm_conditions = request.data.get('sys_mm_conditions')
            existing_entry.dys_mm = request.data.get('dys_mm')
            existing_entry.dys_mm_mm_conditions = request.data.get('dys_mm_mm_conditions')
            existing_entry.oxygen_saturation = request.data.get('oxygen_saturation')
            existing_entry.oxygen_saturation_conditions = request.data.get('oxygen_saturation_conditions')
            existing_entry.rr = request.data.get('rr')
            existing_entry.rr_conditions = request.data.get('rr_conditions')
            existing_entry.temp = request.data.get('temp')
            existing_entry.temp_conditions = request.data.get('temp_conditions')
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            
            existing_entry.save()

            if existing_entry.reffered_to_specialist == 1:
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vital_refer = existing_entry.reffered_to_specialist
                    follow_up_entry.added_by = added_by_instance
                    follow_up_entry.modify_by = modify_by_instance
                    follow_up_entry.modify_date = timezone.now()
                    follow_up_entry.save()
                else:
                    follow_up_entry = agg_sc_follow_up_citizen.objects.create(
                        vital_refer=request.data.get('reffered_to_specialist'),
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_pk_instance,
                        schedule_id=schedule_id,
                        added_by=added_by_instance,
                        added_date=timezone.now(),
                        modify_by=modify_by_instance,
                        modify_date=timezone.now()
                    )

            if existing_entry.reffered_to_specialist == 2:
                # Delete the 'vital_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vital_refer = None
                    follow_up_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'pulse': existing_entry.pulse,
                    'pulse_conditions': existing_entry.pulse_conditions,
                    'sys_mm': existing_entry.sys_mm,
                    'sys_mm_conditions': existing_entry.sys_mm_conditions,
                    'dys_mm': existing_entry.dys_mm,
                    'dys_mm_mm_conditions': existing_entry.dys_mm_mm_conditions,
                    'oxygen_saturation': existing_entry.oxygen_saturation,
                    'oxygen_saturation_conditions': existing_entry.oxygen_saturation_conditions,
                    'rr': existing_entry.rr,
                    'rr_conditions': existing_entry.rr_conditions,
                    'temp': existing_entry.temp,
                    'temp_conditions': existing_entry.temp_conditions,
                    'reffered_to_specialist': existing_entry.reffered_to_specialist,
                    'added_by': existing_entry.added_by.id if existing_entry.added_by else None,
                    'modify_by': existing_entry.modify_by.id,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            citizen_vital_info = agg_sc_citizen_vital_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                pulse=request.data.get('pulse'),
                pulse_conditions=request.data.get('pulse_conditions'),
                sys_mm=request.data.get('sys_mm'),
                sys_mm_conditions=request.data.get('sys_mm_conditions'),
                dys_mm=request.data.get('dys_mm'),
                dys_mm_mm_conditions=request.data.get('dys_mm_mm_conditions'),
                oxygen_saturation=request.data.get('oxygen_saturation'),
                oxygen_saturation_conditions=request.data.get('oxygen_saturation_conditions'),
                rr=request.data.get('rr'),
                rr_conditions=request.data.get('rr_conditions'),
                temp=request.data.get('temp'),
                temp_conditions=request.data.get('temp_conditions'),
                form_submit=request.data.get('form_submit'),
                reffered_to_specialist=request.data.get('reffered_to_specialist'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
            )

            citizen_vital_info.save()
            if citizen_vital_info.reffered_to_specialist == 2:
                # Delete the 'auditory_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vital_refer_refer = None
                    follow_up_entry.save()

            response_data = {
                'message': 'Data sent successfully',
                'posted_data': {
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'pulse': citizen_vital_info.pulse,
                    'pulse_conditions': citizen_vital_info.pulse_conditions,
                    'sys_mm': citizen_vital_info.sys_mm,
                    'sys_mm_conditions': citizen_vital_info.sys_mm_conditions,
                    'dys_mm': citizen_vital_info.dys_mm,
                    'dys_mm_mm_conditions': citizen_vital_info.dys_mm_mm_conditions,
                    'oxygen_saturation': citizen_vital_info.oxygen_saturation,
                    'oxygen_saturation_conditions': citizen_vital_info.oxygen_saturation_conditions,
                    'rr': citizen_vital_info.rr,
                    'rr_conditions': citizen_vital_info.rr_conditions,
                    'temp': citizen_vital_info.temp,
                    'temp_conditions': citizen_vital_info.temp_conditions,
                    'form_submit': citizen_vital_info.form_submit,
                    'reffered_to_specialist': citizen_vital_info.reffered_to_specialist,
                    'added_by': added_by_instance.pk,
                    'modify_by': modify_by_instance.pk,
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)



class agg_sc_get_vital_info_ViewSet1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        print(f'schedule_pk: {schedule_pk}')
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
            print(f'citizen_schedule: {citizen_schedule}')
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        vital_info_entries = agg_sc_citizen_vital_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        print(f'vital_info_entries: {vital_info_entries}')

        serializer = CitizenVitalinfoSerializer(vital_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CitizenBasicScreeninginfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        basic_screening_entries = agg_sc_basic_screening_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = CitizenBasicScreeninginfoSerializer(basic_screening_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CitizenImmunizationInfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        immunization_info_entries = agg_sc_citizen_immunization_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = CitizenimmunisationinfoSerializer(immunization_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class AuditoryInfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        auditory_info_entries = agg_sc_citizen_audit_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = AuditoryinfoSerializer(auditory_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CitizenDentalInfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        dental_info_entries = agg_sc_citizen_dental_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = CitizenDentalinfoSerializer(dental_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CitizenVisionInfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        vision_info_entries = agg_sc_citizen_vision_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = CitizenVisioninfoSerializer(vision_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CitizenPychoInfoViewSet(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        pycho_info_entries = agg_sc_citizen_pycho_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = CitizenPychoinfoSerializer(pycho_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class agg_sc_get_other_info_ViewSet1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        print(f'schedule_pk: {schedule_pk}')
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
            print(f'citizen_schedule: {citizen_schedule}')
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        other_info_entries = agg_sc_citizen_other_info.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        print(f'other_info_entries: {other_info_entries}')

        serializer = other_info_get_Serializer(other_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    

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



#----------------------AUDITORY POST API------------------------------#
# from django.core.exceptions import ValidationError
# class CitizenauditInfoPost(APIView):
#     def post(self, request, *args, **kwargs):
#         try:
#             schedule_pk = kwargs.get('schedule_pk')
#             citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
#         except Http404:
#             return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         # Extract data from the schedule record
#         citizen_id = citizen_schedule.citizen_id
#         schedule_id = citizen_schedule.schedule_id

#         # Create a new citizen vital info record
#         citizen_audit_info = agg_sc_citizen_audit_info(
#             citizen_id=citizen_id,
#             schedule_id=schedule_id,
#             allergic_reaction=request.data.get('allergic_reaction'),
#             cleft_ip=request.data.get('cleft_ip'),
#             hearing_loss=request.data.get('hearing_loss'),
#             congenital_abnormality_of_ear=request.data.get('congenital_abnormality_of_ear'),
#             cleft_palate=request.data.get('cleft_palate'),
#             tongue_tie=request.data.get('tongue_tie'),
#             nad = request.data.get('nad'),
#             adenoid_hyertrophy = request.data.get('adenoid_hyertrophy'),
#             adenoiditis = request.data.get('adenoiditis'),
#             deviated_septal_defect = request.data.get('deviated_septal_defect'),
#             ear_enfection = request.data.get('ear_enfection'),
#             nasal_polyp = request.data.get('nasal_polyp'),
#             parathyroid_disease = request.data.get('parathyroid_disease'),
#             pharyngitis = request.data.get('pharyngitis'),
#             sinusitis = request.data.get('sinusitis'),
#             thyroid_disease = request.data.get('thyroid_disease'),
#             tonsilitis = request.data.get('tonsilitis'),
#             right = request.data.get('right'),
#             left = request.data.get('left'),
#             tratement_given = request.data.get('tratement_given'),
#             otoscopic_exam =  request.data.get('otoscopic_exam'),       
#             remark=request.data.get('remark'),
#         )

#         try:
#             # Save the new citizen vital info record
#             citizen_audit_info.full_clean()  # Run any model clean methods
#             citizen_audit_info.save()

#             # Update the citizen schedule record
#             citizen_schedule.closing_status = True
#             citizen_schedule.save()

#             response_data = {
#                 'message': 'Data Send successfully',
#                 'posted_data': {
#                     'audit_info_pk_id': citizen_audit_info.audit_info_pk_id,
#                     'citizen_id': citizen_audit_info.citizen_id,
#                     'schedule_id':citizen_audit_info.schedule_id,
#                     'allergic_reaction': citizen_audit_info.allergic_reaction,
#                     'cleft_ip': citizen_audit_info.cleft_ip,
#                     'hearing_loss': citizen_audit_info.hearing_loss,
#                     'congenital_abnormality_of_ear': citizen_audit_info.congenital_abnormality_of_ear,
#                     'cleft_palate': citizen_audit_info.cleft_palate,
#                     'tongue_tie': citizen_audit_info.tongue_tie,
#                     'nad': citizen_audit_info.nad,
#                     'adenoid_hyertrophy': citizen_audit_info.adenoid_hyertrophy,
#                     'adenoiditis': citizen_audit_info.adenoiditis,
#                     'deviated_septal_defect': citizen_audit_info.deviated_septal_defect,
#                     'ear_enfection': citizen_audit_info.ear_enfection,
#                     'nasal_polyp': citizen_audit_info.nasal_polyp,
#                     'parathyroid_disease': citizen_audit_info.parathyroid_disease,
#                     'pharyngitis': citizen_audit_info.pharyngitis,
#                     'sinusitis': citizen_audit_info.sinusitis,
#                     'thyroid_disease': citizen_audit_info.thyroid_disease,
#                     'tonsilitis': citizen_audit_info.tonsilitis,
#                     'right': citizen_audit_info.right,
#                     'left': citizen_audit_info.left,
#                     'tratement_given': citizen_audit_info.tratement_given,
#                     'otoscopic_exam': citizen_audit_info.otoscopic_exam,
#                     'remark': citizen_audit_info.remark,
#                 }
#             }

#             return Response(response_data, status=status.HTTP_201_CREATED)
#         except ValidationError as e:
#             return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# from django.core.exceptions import ValidationError
# class CitizenauditInfoPost(APIView):
#     def post(self, request, *args, **kwargs):
#         try:
#             schedule_pk = kwargs.get('schedule_pk')
#             citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
#         except Http404:
#             return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         # Extract data from the schedule record
#         citizen_id = citizen_schedule.citizen_id
#         schedule_id = citizen_schedule.schedule_id
#         schedule_count = citizen_schedule.schedule_count
        
#         citizen_pk_id_value = request.data.get('citizen_pk_id')
#         added_by_id = request.data.get('added_by')
#         modify_by_id = request.data.get('modify_by')

#         try:
#             citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
#         except agg_sc_add_new_citizens.DoesNotExist:
#             return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
#         except agg_com_colleague.DoesNotExist:
#             return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
#         except agg_com_colleague.DoesNotExist:
#             return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Check if the entry already exists
#         existing_entry = agg_sc_citizen_audit_info.objects.filter(
#             citizen_id=citizen_id,
#             schedule_id=schedule_id
#         ).first()

#         if existing_entry:
#             # Entry already exists, you may want to update it instead of creating a new one
#             # Update the existing entry with the new data if needed
#             existing_entry.checkboxes = request.data.get('checkboxes')
#             existing_entry.right = request.data.get('right')
#             existing_entry.left = request.data.get('left')
#             existing_entry.tratement_given = request.data.get('tratement_given')
#             existing_entry.otoscopic_exam = request.data.get('otoscopic_exam')
#             existing_entry.remark = request.data.get('remark')
#             existing_entry.form_submit = request.data.get('form_submit')
#             existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
#             existing_entry.modify_by = modify_by_instance
#             if not existing_entry.added_by:
#                 existing_entry.added_by = added_by_instance
            
#             # ... update other fields as needed
#             existing_entry.save()

#             response_data = {
#                 'message': 'Data updated successfully',
#                 'updated_data': {
#                     'audit_info_pk_id': existing_entry.audit_info_pk_id,
#                     'citizen_id': existing_entry.citizen_id,
#                     'schedule_id': existing_entry.schedule_id,
#                     'checkboxes': existing_entry.checkboxes,
#                     'right': existing_entry.right,
#                     'left': existing_entry.left,
#                     'tratement_given': existing_entry.tratement_given,
#                     'otoscopic_exam': existing_entry.otoscopic_exam,
#                     'remark': existing_entry.remark,
#                     'form_submit': existing_entry.form_submit,
#                     'reffered_to_specialist': existing_entry.reffered_to_specialist,
#                     'added_by': existing_entry.added_by.id,
#                     'modify_by': existing_entry.modify_by.id
                    
#                     # ... add other fields as needed
#                 }
#             }

#             return Response(response_data, status=status.HTTP_200_OK)
#         else:
#             # Entry doesn't exist, create and save a new one
#             citizen_audit_info = agg_sc_citizen_audit_info(
#                 citizen_id=citizen_id,
#                 schedule_id=schedule_id,
#                 schedule_count=schedule_count,
#                 citizen_pk_id=citizen_pk_instance,
#                 checkboxes=request.data.get('checkboxes'),
#                 right=request.data.get('right'),
#                 left=request.data.get('left'),
#                 tratement_given=request.data.get('tratement_given'),
#                 otoscopic_exam=request.data.get('otoscopic_exam'),
#                 remark=request.data.get('remark'),
#                 form_submit=request.data.get('form_submit'),
#                 reffered_to_specialist=request.data.get('reffered_to_specialist'),
#                 added_by=added_by_instance,
#                 modify_by=modify_by_instance,
#                 # ... add other fields as needed
#             )

#             try:
#                 # Save the new citizen audit info record
#                 citizen_audit_info.full_clean()  # Run any model clean methods
#                 citizen_audit_info.save()

#                 # Update the citizen schedule record
#                 citizen_schedule.closing_status = True
#                 citizen_schedule.save()

#                 response_data = {
#                     'message': 'Data sent successfully',
#                     'posted_data': {
#                         'audit_info_pk_id': citizen_audit_info.audit_info_pk_id,
#                         'citizen_id': citizen_audit_info.citizen_id,
#                         'schedule_id': citizen_audit_info.schedule_id,
#                         'citizen_pk_id': citizen_pk_instance.pk,
#                         'checkboxes': citizen_audit_info.checkboxes,
#                         'right': citizen_audit_info.right,
#                         'left': citizen_audit_info.left,
#                         'tratement_given': citizen_audit_info.tratement_given,
#                         'otoscopic_exam': citizen_audit_info.otoscopic_exam,
#                         'remark': citizen_audit_info.remark,
#                         'form_submit': citizen_audit_info.form_submit,
#                         'reffered_to_specialist': citizen_audit_info.reffered_to_specialist,
#                         'added_by':added_by_instance.pk,
#                         'modify_by': modify_by_instance.pk,
                        
#                         # ... add other fields as needed
#                     }
#                 }

#                 return Response(response_data, status=status.HTTP_201_CREATED)
#             except ValidationError as e:
#                 return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#             except Exception as e:
#                 return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import agg_sc_citizen_schedule, agg_sc_citizen_audit_info, agg_sc_follow_up_citizen
from django.utils import timezone

class CitizenauditInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_entry = agg_sc_citizen_audit_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            existing_entry.checkboxes = request.data.get('checkboxes')
            existing_entry.right = request.data.get('right')
            existing_entry.left = request.data.get('left')
            existing_entry.tratement_given = request.data.get('tratement_given')
            existing_entry.otoscopic_exam = request.data.get('otoscopic_exam')
            existing_entry.remark = request.data.get('remark')
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
            
            existing_entry.hz_250_left = request.data.get('hz_250_left')
            existing_entry.hz_500_left = request.data.get('hz_500_left')
            existing_entry.hz_1000_left = request.data.get('hz_1000_left')
            existing_entry.hz_2000_left = request.data.get('hz_2000_left')
            existing_entry.hz_4000_left = request.data.get('hz_4000_left')
            existing_entry.hz_8000_left = request.data.get('hz_8000_left')
            existing_entry.reading_left = request.data.get('reading_left')
            existing_entry.left_ear_observations_remarks = request.data.get('left_ear_observations_remarks')
            
            existing_entry.hz_250_right = request.data.get('hz_250_right')
            existing_entry.hz_500_right = request.data.get('hz_500_right')
            existing_entry.hz_1000_right = request.data.get('hz_1000_right')
            existing_entry.hz_2000_right = request.data.get('hz_2000_right')
            existing_entry.hz_4000_right = request.data.get('hz_4000_right')
            existing_entry.hz_8000_right = request.data.get('hz_8000_right')
            existing_entry.reading_right = request.data.get('reading_right')
            existing_entry.right_ear_observations_remarks = request.data.get('right_ear_observations_remarks')
            existing_entry.referred_hospital_list = request.data.get('referred_hospital_list')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            
            existing_entry.save()

            if existing_entry.reffered_to_specialist == 1:
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.auditory_refer = existing_entry.reffered_to_specialist
                    follow_up_entry.added_by = added_by_instance
                    follow_up_entry.modify_by = modify_by_instance
                    follow_up_entry.modify_date = timezone.now()
                    follow_up_entry.save()
                else:
                    follow_up_entry = agg_sc_follow_up_citizen.objects.create(
                        auditory_refer=request.data.get('reffered_to_specialist'),
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_pk_instance,
                        schedule_id=schedule_id,
                        added_by=added_by_instance,
                        added_date=timezone.now(),
                        modify_by=modify_by_instance,
                        modify_date=timezone.now()
                    )

            if existing_entry.reffered_to_specialist == 2:
                # Delete the 'auditory_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.auditory_refer = None
                    follow_up_entry.save()


            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'audit_info_pk_id': existing_entry.audit_info_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    'checkboxes': existing_entry.checkboxes,
                    'right': existing_entry.right,
                    'left': existing_entry.left,
                    'tratement_given': existing_entry.tratement_given,
                    'otoscopic_exam': existing_entry.otoscopic_exam,
                    'remark': existing_entry.remark,
                    
                    'hz_250_left': existing_entry.hz_250_left,
                    'hz_500_left': existing_entry.hz_500_left,
                    'hz_1000_left': existing_entry.hz_1000_left,
                    'hz_2000_left': existing_entry.hz_2000_left,
                    'hz_4000_left': existing_entry.hz_4000_left,
                    'hz_8000_left': existing_entry.hz_8000_left,
                    'reading_left': existing_entry.reading_left,
                    'left_ear_observations_remarks': existing_entry.left_ear_observations_remarks,
                    
                    'hz_250_right': existing_entry.hz_250_right,
                    'hz_500_right': existing_entry.hz_500_right,
                    'hz_1000_right': existing_entry.hz_1000_right,
                    'hz_2000_right': existing_entry.hz_2000_right,
                    'hz_4000_right': existing_entry.hz_4000_right,
                    'hz_8000_right': existing_entry.hz_8000_right,
                    'reading_right': existing_entry.reading_right,
                    'right_ear_observations_remarks': existing_entry.right_ear_observations_remarks,
                    'referred_hospital_list': existing_entry.referred_hospital_list,
                    
                    'form_submit': existing_entry.form_submit,
                    'reffered_to_specialist': existing_entry.reffered_to_specialist,
                    'added_by': existing_entry.added_by.id,
                    'modify_by': existing_entry.modify_by.id
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            citizen_audit_info = agg_sc_citizen_audit_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                checkboxes=request.data.get('checkboxes'),
                right=request.data.get('right'),
                left=request.data.get('left'),
                tratement_given=request.data.get('tratement_given'),
                otoscopic_exam=request.data.get('otoscopic_exam'),
                remark=request.data.get('remark'),
                
                hz_250_left=request.data.get('hz_250_left'),
                hz_500_left=request.data.get('hz_500_left'),
                hz_1000_left=request.data.get('hz_1000_left'),
                hz_2000_left=request.data.get('hz_2000_left'),
                hz_4000_left=request.data.get('hz_4000_left'),
                hz_8000_left=request.data.get('hz_8000_left'),
                reading_left=request.data.get('reading_left'),
                left_ear_observations_remarks=request.data.get('left_ear_observations_remarks'),
                
                hz_250_right=request.data.get('hz_250_right'),
                hz_500_right=request.data.get('hz_500_right'),
                hz_1000_right=request.data.get('hz_1000_right'),
                hz_2000_right=request.data.get('hz_2000_right'),
                hz_4000_right=request.data.get('hz_4000_right'),
                hz_8000_right=request.data.get('hz_8000_right'),
                reading_right=request.data.get('reading_right'),
                right_ear_observations_remarks=request.data.get('right_ear_observations_remarks'),
                referred_hospital_list=request.data.get('referred_hospital_list'),
                
                form_submit=request.data.get('form_submit'),
                reffered_to_specialist=request.data.get('reffered_to_specialist'),
                added_by=added_by_instance,
                modify_by=modify_by_instance
            )

            citizen_audit_info.save()

            if citizen_audit_info.reffered_to_specialist == 2:
                # Delete the 'auditory_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.auditory_refer = None
                    follow_up_entry.save()

            response_data = {
                'message': 'Data sent successfully',
                'posted_data': {
                    'audit_info_pk_id': citizen_audit_info.audit_info_pk_id,
                    'citizen_id': citizen_audit_info.citizen_id,
                    'schedule_id': citizen_audit_info.schedule_id,
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'checkboxes': citizen_audit_info.checkboxes,
                    'right': citizen_audit_info.right,
                    'left': citizen_audit_info.left,
                    'tratement_given': citizen_audit_info.tratement_given,
                    'otoscopic_exam': citizen_audit_info.otoscopic_exam,
                    'remark': citizen_audit_info.remark,
                    
                    'hz_250_left': citizen_audit_info.hz_250_left,
                    'hz_500_left': citizen_audit_info.hz_500_left,
                    'hz_1000_left': citizen_audit_info.hz_1000_left,
                    'hz_2000_left': citizen_audit_info.hz_2000_left,
                    'hz_4000_left': citizen_audit_info.hz_4000_left,
                    'hz_8000_left': citizen_audit_info.hz_8000_left,
                    'reading_left': citizen_audit_info.reading_left,
                    'left_ear_observations_remarks': citizen_audit_info.left_ear_observations_remarks,
                    
                    'hz_250_right': citizen_audit_info.hz_250_right,
                    'hz_500_right': citizen_audit_info.hz_500_right,
                    'hz_1000_right': citizen_audit_info.hz_1000_right,
                    'hz_2000_right': citizen_audit_info.hz_2000_right,
                    'hz_4000_right': citizen_audit_info.hz_4000_right,
                    'hz_8000_right': citizen_audit_info.hz_8000_right,
                    'reading_right': citizen_audit_info.reading_right,
                    'right_ear_observations_remarks': citizen_audit_info.right_ear_observations_remarks,
                    'referred_hospital_list': citizen_audit_info.referred_hospital_list,
                    
                    'form_submit': citizen_audit_info.form_submit,
                    'reffered_to_specialist': citizen_audit_info.reffered_to_specialist,
                    'added_by': added_by_instance.pk,
                    'modify_by': modify_by_instance.pk
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)


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
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def followup_dropdown_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_followup_dropdownlist.objects.all()
    serializer = FollowupinfoSerializer(snippets, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def followup_for_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_followup_for.objects.filter(is_deleted=False)
    serializer = Followup_for_infoSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
def source_name_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    request.method == 'GET'
    snippets = agg_sc_add_new_source.objects.all()
    serializer = source_name_infoSerializer(snippets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
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
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
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
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
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
@renderer_classes([UserRenderer])
@permission_classes([IsAuthenticated])
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
    

# class CitizensCountAPIView(APIView):
#     def get(self, request, source_id, type_id, class_id=None):
#         # Filter based on whether class_id is provided or not
#         filter_params = {'source': source_id, 'type': type_id}
#         if class_id is not None:
#             filter_params['Class'] = class_id

#         count = agg_sc_add_new_citizens.objects.filter(**filter_params).count()
#         count1 = agg_sc_schedule_screening.objects.filter(**filter_params).count()


#         # Serialize the count
#         # serializer = Student_count_serializer(data={'student_total_count': count})

#         # Check if the serialization is valid and return the response
        
#         return Response({'student_total_count':count, 'screening_schedule_total_count':count1})

# from datetime import datetime
# from collections import OrderedDict
# from django.db.models.functions import TruncMonth
# from django.db.models import Count
# from rest_framework.response import Response
# from rest_framework.views import APIView

# class CitizensCountAPIView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self, request, source_id, type_id, class_id=None):
#         current_year = datetime.now().year

#         filter_params = {'source': source_id, 'type': type_id}
#         if class_id is not None:
#             filter_params['Class'] = class_id

#         filter_params1 = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
#         if class_id is not None:
#             filter_params1['citizen_pk_id__Class'] = class_id

#         # Get counts month-wise for agg_sc_add_new_citizens
#         citizen_counts = agg_sc_add_new_citizens.objects.filter(**filter_params,is_deleted=False) \
#             .annotate(month=TruncMonth('created_date')) \
#             .values('month') \
#             .annotate(count=Count('citizens_pk_id', distinct=True))

#         # Get counts month-wise for agg_sc_schedule_screening
#         screening_counts = agg_sc_schedule_screening.objects.filter(**filter_params) \
#             .annotate(month=TruncMonth('from_date')) \
#             .values('month') \
#             .annotate(count=Count('schedule_screening_pk_id'))

#         screening_done_counts = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True) \
#             .annotate(month=TruncMonth('created_date')) \
#             .values('month') \
#             .annotate(count=Count('basic_screening_pk_id'))

#         # Count records for each model
#         count = agg_sc_add_new_citizens.objects.filter(**filter_params,is_deleted=False).count()
#         count1 = agg_sc_schedule_screening.objects.filter(**filter_params).count()
#         count2 = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True).count()


#         # Transform the data to a dictionary format for month-wise counts
#         citizen_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in citizen_counts}
#         screening_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_counts}
#         screening_done_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_done_counts}

#         # Add missing months with null count
#         all_months = [datetime.now().replace(month=i, day=1) for i in range(1, 13)]
#         for month in all_months:
#             month_str = month.strftime('%B %Y')
#             citizen_counts_dict.setdefault(month_str, None)
#             screening_counts_dict.setdefault(month_str, None)
#             screening_done_dict.setdefault(month_str, None)

#         # Sort the dictionaries by month
#         citizen_counts_dict = OrderedDict(sorted(citizen_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
#         screening_counts_dict = OrderedDict(sorted(screening_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
#         screening_done_dict = OrderedDict(sorted(screening_done_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))

#         # Return the sorted month-wise counts
#         return JsonResponse({
#             'citizen_counts_monthwise': citizen_counts_dict,
#             'screening_counts_monthwise': screening_counts_dict,
#             'total_screened_count_monthwise': screening_done_dict,
#             'total_added_count': count,
#             'total_schedule_count': count1,
#             'total_screened_count': count2
        # })


from datetime import datetime
from collections import OrderedDict
from django.db.models.functions import TruncMonth
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView

class CitizensCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, source_id, type_id, class_id=None):
        current_year = datetime.now().year

        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id

        filter_params1 = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params1['citizen_pk_id__Class'] = class_id

        # Get counts month-wise for agg_sc_add_new_citizens
        citizen_counts = agg_sc_add_new_citizens.objects.filter(**filter_params,is_deleted=False) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('citizens_pk_id', distinct=True))

        # Get counts month-wise for agg_sc_schedule_screening
        screening_counts = agg_sc_schedule_screening.objects.filter(**filter_params) \
            .annotate(month=TruncMonth('from_date')) \
            .values('month') \
            .annotate(count=Count('schedule_screening_pk_id'))

        screening_done_counts = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('basic_screening_pk_id'))

        # Count records for each model
        count = agg_sc_add_new_citizens.objects.filter(**filter_params,is_deleted=False).count()
        count1 = agg_sc_schedule_screening.objects.filter(**filter_params).count()
        count2 = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True).count()

        # Transform the data to a dictionary format for month-wise counts
        citizen_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in citizen_counts}
        screening_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_counts}
        screening_done_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_done_counts}

        # Add missing months with null count
        all_months = [datetime.now().replace(month=i, day=1) for i in range(1, 13)]
        for month in all_months:
            month_str = month.strftime('%B %Y')
            citizen_counts_dict.setdefault(month_str, None)
            screening_counts_dict.setdefault(month_str, None)
            screening_done_dict.setdefault(month_str, None)

        # Sort the dictionaries by month
        citizen_counts_dict = OrderedDict(sorted(citizen_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
        screening_counts_dict = OrderedDict(sorted(screening_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
        screening_done_dict = OrderedDict(sorted(screening_done_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))

        # Calculate total remaining employees
        total_remaining = count - count2

        # Return the sorted month-wise counts and total remaining employees
        return JsonResponse({
            'citizen_counts_monthwise': citizen_counts_dict,
            'screening_counts_monthwise': screening_counts_dict,
            'total_screened_count_monthwise': screening_done_dict,
            'total_added_count': count,
            'total_screened_count': count2,
            'total_remaining_screening_employees': total_remaining
        })

        


        

class screening_scheduleAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, source_id, type_id, class_id=None):
        # Filter based on whether class_id is provided or not
        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id

        count = agg_sc_schedule_screening.objects.filter(**filter_params).count()

        # Serialize the count
        # serializer = Student_count_serializer(data={'student_total_count': count})

        # Check if the serialization is valid and return the response
        
        return Response({'screening_schedule_total_count':count})
        
    
# class GroupOrRoleAPIView(APIView):
#     def get(self, request,source_pk_id):
#         groups = agg_source.objects.filter(source_pk_id=source_pk_id)
#         serializer = GroupOrRoleserializer(groups, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


#-------------------------------Dental CheckUP---------------------------------------------------------
class CitizenDentalInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
            
            citizen_pk_id_value = request.data.get('citizen_pk_id')
            try:
                citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
            except ObjectDoesNotExist:
                return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
            
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Extract data from the schedule record
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the entry already exists
        existing_entry = agg_sc_citizen_dental_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            # Entry already exists, you may want to update it instead of creating a new one
            # Update the existing entry with the new data if needed
            # existing_entry.citizen_pk_id = request.data.get('citizen_pk_id')
            existing_entry.oral_hygiene = request.data.get('oral_hygiene')
            existing_entry.oral_hygiene_remark = request.data.get('oral_hygiene_remark')
            existing_entry.gum_condition = request.data.get('gum_condition')
            existing_entry.gum_condition_remark = request.data.get('gum_condition_remark')
            existing_entry.oral_ulcers = request.data.get('oral_ulcers')
            existing_entry.oral_ulcers_remark = request.data.get('oral_ulcers_remark')
            existing_entry.gum_bleeding = request.data.get('gum_bleeding')
            existing_entry.gum_bleeding_remark = request.data.get('gum_bleeding_remark')
            existing_entry.discoloration_of_teeth = request.data.get('discoloration_of_teeth')
            existing_entry.discoloration_of_teeth_remark = request.data.get('discoloration_of_teeth_remark')
            existing_entry.food_impaction = request.data.get('food_impaction')
            existing_entry.food_impaction_remark = request.data.get('food_impaction_remark')
            existing_entry.carious_teeth = request.data.get('carious_teeth')
            existing_entry.carious_teeth_remark = request.data.get('carious_teeth_remark')
            existing_entry.extraction_done = request.data.get('extraction_done')
            existing_entry.extraction_done_remark = request.data.get('extraction_done_remark')
            existing_entry.fluorosis = request.data.get('fluorosis')
            existing_entry.fluorosis_remark = request.data.get('fluorosis_remark')
            existing_entry.tooth_brushing_frequency = request.data.get('tooth_brushing_frequency')
            existing_entry.tooth_brushing_frequency_remark = request.data.get('tooth_brushing_frequency_remark')
            existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
            existing_entry.reffered_to_specialist_remark = request.data.get('reffered_to_specialist_remark')
            existing_entry.sensitive_teeth = request.data.get('sensitive_teeth')
            existing_entry.sensitive_teeth_remark = request.data.get('sensitive_teeth_remark')
            existing_entry.malalignment = request.data.get('malalignment')
            existing_entry.malalignment_remark = request.data.get('malalignment_remark')
            existing_entry.orthodontic_treatment = request.data.get('orthodontic_treatment')
            existing_entry.orthodontic_treatment_remark = request.data.get('orthodontic_treatment_remark')
            existing_entry.comment = request.data.get('comment')
            existing_entry.treatment_given = request.data.get('treatment_given')
            existing_entry.referred_to_surgery = request.data.get('referred_to_surgery')
            existing_entry.dental_conditions = request.data.get('dental_conditions')
            existing_entry.form_submit = request.data.get('form_submit')
            # existing_entry.image = request.data.get('image')
            if 'image' in request.data:
                existing_entry.image = request.data.get('image')
            # existing_entry.dental_refer_hospital = request.data.get('dental_refer_hospital')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance

            

            existing_entry.save()
            
            if existing_entry.reffered_to_specialist == 1:
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.dental_refer = existing_entry.reffered_to_specialist
                    follow_up_entry.added_by = added_by_instance
                    follow_up_entry.modify_by = modify_by_instance
                    follow_up_entry.modify_date = timezone.now()
                    follow_up_entry.save()
                else:
                    follow_up_entry = agg_sc_follow_up_citizen.objects.create(
                        dental_refer=request.data.get('reffered_to_specialist'),
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_pk_instance,
                        schedule_id=schedule_id,
                        added_by=added_by_instance,
                        added_date=timezone.now(),
                        modify_by=modify_by_instance,
                        modify_date=timezone.now()
                    )

            if existing_entry.reffered_to_specialist == 2:
                # Delete the 'dental_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.dental_refer = None
                    follow_up_entry.save()
            
            

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'dental_pk_id': existing_entry.dental_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    # 'citizen_pk_id': existing_entry.citizen_pk_id,
                    'oral_hygiene': existing_entry.oral_hygiene,
                    'oral_hygiene_remark': existing_entry.oral_hygiene_remark,
                    'gum_condition': existing_entry.gum_condition,
                    'gum_condition_remark': existing_entry.gum_condition_remark,
                    'oral_ulcers': existing_entry.oral_ulcers,
                    'oral_ulcers_remark': existing_entry.oral_ulcers_remark,
                    'gum_bleeding': existing_entry.gum_bleeding,
                    'gum_bleeding_remark': existing_entry.gum_bleeding_remark,
                    'discoloration_of_teeth': existing_entry.discoloration_of_teeth,
                    'discoloration_of_teeth_remark': existing_entry.discoloration_of_teeth_remark,
                    'food_impaction': existing_entry.food_impaction,
                    'food_impaction_remark': existing_entry.food_impaction_remark,
                    'carious_teeth': existing_entry.carious_teeth,
                    'carious_teeth_remark': existing_entry.carious_teeth_remark,
                    'extraction_done': existing_entry.extraction_done,
                    'extraction_done_remark': existing_entry.extraction_done_remark,
                    'fluorosis': existing_entry.fluorosis,
                    'fluorosis_remark': existing_entry.fluorosis_remark,
                    'tooth_brushing_frequency': existing_entry.tooth_brushing_frequency,
                    'tooth_brushing_frequency_remark': existing_entry.tooth_brushing_frequency_remark,
                    'reffered_to_specialist': existing_entry.reffered_to_specialist,
                    'reffered_to_specialist_remark': existing_entry.reffered_to_specialist_remark,
                    'sensitive_teeth': existing_entry.sensitive_teeth,
                    'sensitive_teeth_remark': existing_entry.sensitive_teeth_remark,
                    'malalignment': existing_entry.malalignment,
                    'malalignment_remark': existing_entry.malalignment_remark,
                    'orthodontic_treatment': existing_entry.orthodontic_treatment,
                    'orthodontic_treatment_remark': existing_entry.orthodontic_treatment_remark,
                    'comment': existing_entry.comment,
                    'treatment_given': existing_entry.treatment_given,
                    'referred_to_surgery': existing_entry.referred_to_surgery,
                    'dental_conditions':existing_entry.dental_conditions,
                    'form_submit': existing_entry.form_submit,
                    # 'image':existing_entry.image,
                    'dental_image_url': existing_entry.image.url if existing_entry.image else None,
                    # 'dental_refer_hospital': existing_entry.dental_refer_hospital,
                    'added_by': existing_entry.added_by.id,
                    'modify_by': existing_entry.modify_by.id
                    
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Entry doesn't exist, create and save a new one
            citizen_dental_info = agg_sc_citizen_dental_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                oral_hygiene=request.data.get('oral_hygiene'),
                oral_hygiene_remark=request.data.get('oral_hygiene_remark'),
                gum_condition=request.data.get('gum_condition'),
                gum_condition_remark=request.data.get('gum_condition_remark'),
                oral_ulcers=request.data.get('oral_ulcers'),
                oral_ulcers_remark=request.data.get('oral_ulcers_remark'),
                gum_bleeding=request.data.get('gum_bleeding'),
                gum_bleeding_remark=request.data.get('gum_bleeding_remark'),
                discoloration_of_teeth=request.data.get('discoloration_of_teeth'),
                discoloration_of_teeth_remark=request.data.get('discoloration_of_teeth_remark'),
                food_impaction=request.data.get('food_impaction'),
                food_impaction_remark=request.data.get('food_impaction_remark'),
                carious_teeth=request.data.get('carious_teeth'),
                carious_teeth_remark=request.data.get('carious_teeth_remark'),
                extraction_done=request.data.get('extraction_done'),
                extraction_done_remark=request.data.get('extraction_done_remark'),
                fluorosis=request.data.get('fluorosis'),
                fluorosis_remark=request.data.get('fluorosis_remark'),
                tooth_brushing_frequency=request.data.get('tooth_brushing_frequency'),
                tooth_brushing_frequency_remark=request.data.get('tooth_brushing_frequency_remark'),
                reffered_to_specialist=request.data.get('reffered_to_specialist'),
                reffered_to_specialist_remark=request.data.get('reffered_to_specialist_remark'),
                sensitive_teeth=request.data.get('sensitive_teeth'),
                sensitive_teeth_remark=request.data.get('sensitive_teeth_remark'),
                malalignment=request.data.get('malalignment'),
                malalignment_remark=request.data.get('malalignment_remark'),
                orthodontic_treatment=request.data.get('orthodontic_treatment'),
                orthodontic_treatment_remark=request.data.get('orthodontic_treatment_remark'),
                comment=request.data.get('comment'),
                treatment_given=request.data.get('treatment_given'),
                referred_to_surgery=request.data.get('referred_to_surgery'),
                dental_conditions=request.data.get('dental_conditions'),
                form_submit=request.data.get('form_submit'),
                image=request.data.get('image'),
                # dental_refer_hospital=request.data.get('dental_refer_hospital'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
            )
            
            citizen_dental_info.save()
            if citizen_dental_info.reffered_to_specialist == 2:
                # Delete the 'dental_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.dental_refer = None
                    follow_up_entry.save()

            try:
                # Save the new citizen dental info record
                citizen_dental_info.full_clean()  # Run any model clean methods
                citizen_dental_info.save()

                # Update the citizen schedule record
                # citizen_schedule.closing_status = True
                # citizen_schedule.save()

                response_data = {
                    'message': 'Data sent successfully',
                    'posted_data': {
                        'dental_pk_id': citizen_dental_info.dental_pk_id,
                        'citizen_id': citizen_dental_info.citizen_id,
                        'schedule_id': citizen_dental_info.schedule_id,
                        'citizen_pk_id': citizen_pk_instance.pk,
                        'oral_hygiene': citizen_dental_info.oral_hygiene,
                        'oral_hygiene_remark': citizen_dental_info.oral_hygiene_remark,
                        'gum_condition': citizen_dental_info.gum_condition,
                        'gum_condition_remark': citizen_dental_info.gum_condition_remark,
                        'oral_ulcers': citizen_dental_info.oral_ulcers,
                        'oral_ulcers_remark': citizen_dental_info.oral_ulcers_remark,
                        'gum_bleeding': citizen_dental_info.gum_bleeding,
                        'gum_bleeding_remark': citizen_dental_info.gum_bleeding_remark,
                        'discoloration_of_teeth': citizen_dental_info.discoloration_of_teeth,
                        'discoloration_of_teeth_remark': citizen_dental_info.discoloration_of_teeth_remark,
                        'food_impaction': citizen_dental_info.food_impaction,
                        'food_impaction_remark': citizen_dental_info.food_impaction_remark,
                        'carious_teeth': citizen_dental_info.carious_teeth,
                        'carious_teeth_remark': citizen_dental_info.carious_teeth_remark,
                        'extraction_done': citizen_dental_info.extraction_done,
                        'extraction_done_remark': citizen_dental_info.extraction_done_remark,
                        'fluorosis': citizen_dental_info.fluorosis,
                        'fluorosis_remark': citizen_dental_info.fluorosis_remark,
                        'tooth_brushing_frequency': citizen_dental_info.tooth_brushing_frequency,
                        'tooth_brushing_frequency_remark': citizen_dental_info.tooth_brushing_frequency_remark,
                        'referred_to_specialist': citizen_dental_info.reffered_to_specialist,
                        'referred_to_specialist_remark': citizen_dental_info.reffered_to_specialist_remark,
                        'sensitive_teeth': citizen_dental_info.sensitive_teeth,
                        'sensitive_teeth_remark': citizen_dental_info.sensitive_teeth_remark,
                        'malalignment': citizen_dental_info.malalignment,
                        'malalignment_remark': citizen_dental_info.malalignment_remark,
                        'orthodontic_treatment': citizen_dental_info.orthodontic_treatment,
                        'orthodontic_treatment_remark': citizen_dental_info.orthodontic_treatment_remark,
                        'comment': citizen_dental_info.comment,
                        'treatment_given': citizen_dental_info.treatment_given,
                        'referred_to_surgery': citizen_dental_info.referred_to_surgery,
                        'dental_conditions': citizen_dental_info.dental_conditions,
                        'form_submit': citizen_dental_info.form_submit,
                        # 'image':citizen_dental_info.image,
                        'image': citizen_dental_info.image.name if citizen_dental_info.image else None,
                        # 'dental_refer_hospital': citizen_dental_info.dental_refer_hospital,
                        'added_by':added_by_instance.pk,
                        'modify_by': modify_by_instance.pk,
                    }
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
#-------------------------------Pychology CheckUP---------------------------------------------------------
class CitizenPychoInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Extract data from the schedule record
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count

        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the entry already exists
        existing_entry = agg_sc_citizen_pycho_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            # Entry already exists, you may want to update it instead of creating a new one
            # Update the existing entry with the new data if needed
            # existing_entry.citizen_pk_id = request.data.get('citizen_pk_id')
            existing_entry.diff_in_read = request.data.get('diff_in_read')
            existing_entry.diff_in_read_text = request.data.get('diff_in_read_text')
            existing_entry.diff_in_write = request.data.get('diff_in_write')
            existing_entry.diff_in_write_text = request.data.get('diff_in_write_text')
            existing_entry.hyper_reactive = request.data.get('hyper_reactive')
            existing_entry.hyper_reactive_text = request.data.get('hyper_reactive_text')
            existing_entry.aggresive = request.data.get('aggresive')
            existing_entry.aggresive_text = request.data.get('aggresive_text')
            existing_entry.urine_stool = request.data.get('urine_stool')
            existing_entry.urine_stool_text = request.data.get('urine_stool_text')
            existing_entry.peers = request.data.get('peers')
            existing_entry.peers_text = request.data.get('peers_text')
            existing_entry.poor_contact = request.data.get('poor_contact')
            existing_entry.poor_contact_text = request.data.get('poor_contact_text')
            existing_entry.scholastic = request.data.get('scholastic')
            existing_entry.scholastic_text = request.data.get('scholastic_text')
            existing_entry.any_other = request.data.get('any_other')
            existing_entry.pycho_conditions = request.data.get('pycho_conditions')
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            # ... update other fields as needed
            existing_entry.save()
            
            if existing_entry.reffered_to_specialist == 1:
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.pycho_refer = existing_entry.reffered_to_specialist
                    follow_up_entry.added_by = added_by_instance
                    follow_up_entry.modify_by = modify_by_instance
                    follow_up_entry.modify_date = timezone.now()
                    follow_up_entry.save()
                else:
                    follow_up_entry = agg_sc_follow_up_citizen.objects.create(
                        pycho_refer=request.data.get('reffered_to_specialist'),
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_pk_instance,
                        schedule_id=schedule_id,
                        added_by=added_by_instance,
                        added_date=timezone.now(),
                        modify_by=modify_by_instance,
                        modify_date=timezone.now()
                    )

            if existing_entry.reffered_to_specialist == 2:
                # Delete the 'pycho_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.pycho_refer = None
                    follow_up_entry.save()
            

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'pycho_pk_id': existing_entry.pycho_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    # 'citizen_pk_id': existing_entry.citizen_pk_id,
                    'diff_in_read': existing_entry.diff_in_read,
                    'diff_in_read_text': existing_entry.diff_in_read_text,
                    'diff_in_write': existing_entry.diff_in_write,
                    'diff_in_write_text': existing_entry.diff_in_write_text,
                    'hyper_reactive': existing_entry.hyper_reactive,
                    'hyper_reactive_text': existing_entry.hyper_reactive_text,
                    'aggresive': existing_entry.aggresive,
                    'aggresive_text': existing_entry.aggresive_text,
                    'urine_stool': existing_entry.urine_stool,
                    'urine_stool_text': existing_entry.urine_stool_text,
                    'peers': existing_entry.peers,
                    'peers_text': existing_entry.peers_text,
                    'poor_contact': existing_entry.poor_contact,
                    'poor_contact_text': existing_entry.poor_contact_text,
                    'scholastic': existing_entry.scholastic,
                    'scholastic_text': existing_entry.scholastic_text,
                    'any_other': existing_entry.any_other,
                    'pycho_conditions':existing_entry.pycho_conditions,
                    'form_submit': existing_entry.form_submit,
                    'reffered_to_specialist': existing_entry.reffered_to_specialist,
                    'added_by': existing_entry.added_by.id,
                    'modify_by': existing_entry.modify_by.id
                    # ... add other fields as needed
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Entry doesn't exist, create and save a new one
            citizen_pycho_info = agg_sc_citizen_pycho_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                diff_in_read=request.data.get('diff_in_read'),
                diff_in_read_text=request.data.get('diff_in_read_text'),
                diff_in_write=request.data.get('diff_in_write'),
                diff_in_write_text=request.data.get('diff_in_write_text'),
                hyper_reactive=request.data.get('hyper_reactive'),
                hyper_reactive_text=request.data.get('hyper_reactive_text'),
                aggresive=request.data.get('aggresive'),
                aggresive_text=request.data.get('aggresive_text'),
                urine_stool=request.data.get('urine_stool'),
                urine_stool_text=request.data.get('urine_stool_text'),
                peers=request.data.get('peers'),
                peers_text=request.data.get('peers_text'),
                poor_contact=request.data.get('poor_contact'),
                poor_contact_text=request.data.get('poor_contact_text'),
                scholastic=request.data.get('scholastic'),
                scholastic_text=request.data.get('scholastic_text'),
                any_other=request.data.get('any_other'),
                pycho_conditions=request.data.get('pycho_conditions'),
                form_submit=request.data.get('form_submit'),
                reffered_to_specialist=request.data.get('reffered_to_specialist'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
                
            )
            
            if citizen_pycho_info.reffered_to_specialist  == 2:
                # Delete the 'pycho_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.pycho_refer = None
                    follow_up_entry.save()

            try:
                # Save the new citizen psycho info record
                citizen_pycho_info.full_clean()  # Run any model clean methods
                citizen_pycho_info.save()

                # Update the citizen schedule record
                # citizen_schedule.closing_status = True
                # citizen_schedule.save()


                response_data = {
                    'message': 'Data sent successfully',
                    'posted_data': {
                        'pycho_pk_id': citizen_pycho_info.pycho_pk_id,
                        'citizen_id': citizen_pycho_info.citizen_id,
                        'schedule_id': citizen_pycho_info.schedule_id,
                        'citizen_pk_id': citizen_pk_instance.pk,
                        'diff_in_read': citizen_pycho_info.diff_in_read,
                        'diff_in_read_text': citizen_pycho_info.diff_in_read_text,
                        'diff_in_write': citizen_pycho_info.diff_in_write,
                        'diff_in_write_text': citizen_pycho_info.diff_in_write_text,
                        'hyper_reactive': citizen_pycho_info.hyper_reactive,
                        'hyper_reactive_text': citizen_pycho_info.hyper_reactive_text,
                        'aggresive': citizen_pycho_info.aggresive,
                        'aggresive_text': citizen_pycho_info.aggresive_text,
                        'urine_stool': citizen_pycho_info.urine_stool,
                        'urine_stool_text': citizen_pycho_info.urine_stool_text,
                        'peers': citizen_pycho_info.peers,
                        'peers_text': citizen_pycho_info.peers_text,
                        'poor_contact': citizen_pycho_info.poor_contact,
                        'poor_contact_text': citizen_pycho_info.poor_contact_text,
                        'scholastic': citizen_pycho_info.scholastic,
                        'scholastic_text': citizen_pycho_info.scholastic_text,
                        'any_other': citizen_pycho_info.any_other,
                        'pycho_conditions': citizen_pycho_info.pycho_conditions,
                        'form_submit': citizen_pycho_info.form_submit,
                        'reffered_to_specialist': citizen_pycho_info.reffered_to_specialist,
                        'added_by':added_by_instance.pk,
                        'modify_by': modify_by_instance.pk,
                        
                        
                        # ... add other fields as needed
                    }
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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

#-------------------------------Vision CheckUP---------------------------------------------------------
class CitizenVisionInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Extract data from the schedule record
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count

        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)

        # Check if the entry already exists
        existing_entry = agg_sc_citizen_vision_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            # Entry already exists, you may want to update it instead of creating a new one
            # Update the existing entry with the new data if needed
            existing_entry.eye = request.data.get('eye')
            # existing_entry.citizen_pk_id = request.data.get('citizen_pk_id')
            existing_entry.if_other_commnet = request.data.get('if_other_commnet')
            existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
            existing_entry.vision_with_glasses = request.data.get('vision_with_glasses')
            existing_entry.vision_without_glasses = request.data.get('vision_without_glasses')
            existing_entry.eye_muscle_control = request.data.get('eye_muscle_control')
            existing_entry.refractive_error = request.data.get('refractive_error')
            existing_entry.visual_perimetry = request.data.get('visual_perimetry')
            existing_entry.comment = request.data.get('comment')
            existing_entry.treatment = request.data.get('treatment')
            existing_entry.checkboxes = request.data.get('checkboxes')
            existing_entry.color_blindness = request.data.get('color_blindness')
            existing_entry.vision_screening = request.data.get('vision_screening')
            existing_entry.vision_screening_comment = request.data.get('vision_screening_comment')
            existing_entry.referred_to_surgery = request.data.get('referred_to_surgery')
            
            existing_entry.re_near_without_glasses = request.data.get('re_near_without_glasses')
            existing_entry.re_far_without_glasses = request.data.get('re_far_without_glasses')
            existing_entry.le_near_without_glasses = request.data.get('le_near_without_glasses')
            existing_entry.le_far_without_glasses = request.data.get('le_far_without_glasses')
            existing_entry.re_near_with_glasses = request.data.get('re_near_with_glasses')
            existing_entry.re_far_with_glasses = request.data.get('re_far_with_glasses')
            existing_entry.le_near_with_glasses = request.data.get('le_near_with_glasses')
            existing_entry.le_far_with_glasses = request.data.get('le_far_with_glasses')
            existing_entry.refer_hospital_name = request.data.get('refer_hospital_name')
            
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            # ... update other fields as needed
            existing_entry.save()
            
            if existing_entry.reffered_to_specialist == 1:
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vision_refer = existing_entry.reffered_to_specialist
                    follow_up_entry.added_by = added_by_instance
                    follow_up_entry.modify_by = modify_by_instance
                    follow_up_entry.modify_date = timezone.now()
                    follow_up_entry.save()
                else:
                    follow_up_entry = agg_sc_follow_up_citizen.objects.create(
                        vision_refer=request.data.get('reffered_to_specialist'),
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_pk_instance,
                        schedule_id=schedule_id,
                        added_by=added_by_instance,
                        added_date=timezone.now(),
                        modify_by=modify_by_instance,
                        modify_date=timezone.now()
                    )

            if existing_entry.reffered_to_specialist == 2:
                # Delete the 'vision_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vision_refer = None
                    follow_up_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'vision_pk_id': existing_entry.vision_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    'eye': existing_entry.eye,
                    # 'citizen_pk_id': existing_entry.citizen_pk_id,
                    'if_other_commnet': existing_entry.if_other_commnet,
                    'reffered_to_specialist': existing_entry.reffered_to_specialist,
                    'vision_with_glasses': existing_entry.vision_with_glasses,
                    'vision_without_glasses': existing_entry.vision_without_glasses,
                    'eye_muscle_control': existing_entry.eye_muscle_control,
                    'refractive_error': existing_entry.refractive_error,
                    'visual_perimetry': existing_entry.visual_perimetry,
                    'comment': existing_entry.comment,
                    'treatment': existing_entry.treatment,
                    'checkboxes': existing_entry.checkboxes,
                    'color_blindness': existing_entry.color_blindness,
                    'vision_screening': existing_entry.vision_screening,
                    'vision_screening_comment': existing_entry.vision_screening_comment,
                    'referred_to_surgery': existing_entry.referred_to_surgery,
                    'form_submit': existing_entry.form_submit,
                    
                    're_near_without_glasses': existing_entry.re_near_without_glasses,
                    're_far_without_glasses': existing_entry.re_far_without_glasses,
                    'le_near_without_glasses': existing_entry.le_near_without_glasses,
                    'le_far_without_glasses': existing_entry.le_far_without_glasses,
                    're_near_with_glasses': existing_entry.re_near_with_glasses,
                    're_far_with_glasses': existing_entry.re_far_with_glasses,
                    'le_near_with_glasses': existing_entry.le_near_with_glasses,
                    'le_far_with_glasses': existing_entry.le_far_with_glasses,
                    'refer_hospital_name': existing_entry.refer_hospital_name,
                    
                    
                    'added_by': existing_entry.added_by.id,
                    'modify_by': existing_entry.modify_by.id
                    # ... add other fields as needed
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Entry doesn't exist, create and save a new one
            citizen_vision_info = agg_sc_citizen_vision_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                eye=request.data.get('eye'),
                citizen_pk_id=citizen_pk_instance,
                if_other_commnet=request.data.get('if_other_commnet'),
                reffered_to_specialist=request.data.get('reffered_to_specialist'),
                vision_with_glasses=request.data.get('vision_with_glasses'),
                vision_without_glasses=request.data.get('vision_without_glasses'),
                eye_muscle_control=request.data.get('eye_muscle_control'),
                refractive_error=request.data.get('refractive_error'),
                visual_perimetry=request.data.get('visual_perimetry'),
                comment=request.data.get('comment'),
                treatment=request.data.get('treatment'),
                checkboxes=request.data.get('checkboxes'),
                color_blindness=request.data.get('color_blindness'),
                vision_screening=request.data.get('vision_screening'),
                vision_screening_comment=request.data.get('vision_screening_comment'),
                referred_to_surgery=request.data.get('referred_to_surgery'),
                form_submit=request.data.get('form_submit'),
                
                re_near_without_glasses=request.data.get('re_near_without_glasses'),
                re_far_without_glasses=request.data.get('re_far_without_glasses'),
                le_near_without_glasses=request.data.get('le_near_without_glasses'),
                le_far_without_glasses=request.data.get('le_far_without_glasses'),
                re_near_with_glasses=request.data.get('re_near_with_glasses'),
                re_far_with_glasses=request.data.get('re_far_with_glasses'),
                le_near_with_glasses=request.data.get('le_near_with_glasses'),
                le_far_with_glasses=request.data.get('le_far_with_glasses'),
                refer_hospital_name=request.data.get('refer_hospital_name'),
                
                added_by=added_by_instance,
                modify_by=modify_by_instance,
                # ... add other fields as needed
            )
            
            citizen_vision_info.save()
            if citizen_vision_info.reffered_to_specialist == 2:
                # Delete the 'vision_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vision_refer = None
                    follow_up_entry.save()

            try:
                # Save the new citizen Vision info record
                citizen_vision_info.full_clean()  # Run any model clean methods
                citizen_vision_info.save()

                # Update the citizen schedule record
                # citizen_schedule.closing_status = True
                # citizen_schedule.save()

                response_data = {
                    'message': 'Data sent successfully',
                    'posted_data': {
                        'vision_pk_id': citizen_vision_info.vision_pk_id,
                        'citizen_id': citizen_vision_info.citizen_id,
                        'schedule_id': citizen_vision_info.schedule_id,
                        'eye': citizen_vision_info.eye,
                        'citizen_pk_id': citizen_pk_instance.pk,
                        'if_other_commnet': citizen_vision_info.if_other_commnet,
                        'reffered_to_specialist': citizen_vision_info.reffered_to_specialist,
                        'vision_with_glasses': citizen_vision_info.vision_with_glasses,
                        'vision_without_glasses': citizen_vision_info.vision_without_glasses,
                        'eye_muscle_control': citizen_vision_info.eye_muscle_control,
                        'refractive_error': citizen_vision_info.refractive_error,
                        'visual_perimetry': citizen_vision_info.visual_perimetry,
                        'comment': citizen_vision_info.comment,
                        'treatment': citizen_vision_info.treatment,
                        'checkboxes': citizen_vision_info.checkboxes,
                        'color_blindness': citizen_vision_info.color_blindness,
                        'vision_screening': citizen_vision_info.vision_screening,
                        'vision_screening_comment': citizen_vision_info.vision_screening_comment,
                        'referred_to_surgery': citizen_vision_info.referred_to_surgery,
                        'form_submit': citizen_vision_info.form_submit,
                        
                        're_near_without_glasses': citizen_vision_info.re_near_without_glasses,
                        're_far_without_glasses': citizen_vision_info.re_far_without_glasses,
                        'le_near_without_glasses': citizen_vision_info.le_near_without_glasses,
                        'le_far_without_glasses': citizen_vision_info.le_far_without_glasses,
                        're_near_with_glasses': citizen_vision_info.re_near_with_glasses,
                        're_far_with_glasses': citizen_vision_info.re_far_with_glasses,
                        'le_near_with_glasses': citizen_vision_info.le_near_with_glasses,
                        'le_far_with_glasses': citizen_vision_info.le_far_with_glasses,
                        'refer_hospital_name': citizen_vision_info.refer_hospital_name,
                        
                        'added_by':added_by_instance.pk,
                        'modify_by': modify_by_instance.pk,
                        # ... add other fields as needed
                    }
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#-------------------------------Basic Screening CheckUP---------------------------------------------------------
class CitizenBasicScreeningInfoPost(APIView):
     renderer_classes = [UserRenderer]
     permission_classes = [IsAuthenticated]
     def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Extract data from the schedule record
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count

        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        head_value = request.data.get('head')
        head_instance = None
        if head_value is not None:
            try:
                head_instance = basic_information_head_scalp.objects.get(pk=head_value)
            except basic_information_head_scalp.DoesNotExist:
                return Response({'detail': f'Head with pk {head_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        nose_value = request.data.get('nose')
        nose_instance = None
        if nose_value is not None:
            try:
                nose_instance = basic_information_nose.objects.get(pk=nose_value)
            except basic_information_nose.DoesNotExist:
                return Response({'detail': f'Nose with pk {nose_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        neck_value = request.data.get('neck')
        neck_instance = None
        if neck_value is not None:
            try:
                neck_instance = basic_information_neck.objects.get(pk=neck_value)
            except basic_information_neck.DoesNotExist:
                return Response({'detail': f'Neck with pk {neck_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        
        skin_color_value = request.data.get('skin_color')
        skin_color_instance = None
        if skin_color_value is not None:
            try:
                skin_color_instance = basic_information_skin_color.objects.get(pk=skin_color_value)
            except basic_information_skin_color.DoesNotExist:
                return Response({'detail': f'Skin Color with pk {skin_color_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        skin_texture_value = request.data.get('skin_texture')
        skin_texture_instance = None
        if skin_texture_value is not None:
            try:
                skin_texture_instance = basic_information_skin_texture.objects.get(pk=skin_texture_value)
            except basic_information_skin_texture.DoesNotExist:
                return Response({'detail': f'Skin Texture with pk {skin_texture_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        skin_lesions_value = request.data.get('skin_lesions')
        skin_lesions_instance = None
        if skin_lesions_value is not None:
            try:
                skin_lesions_instance = basic_information_skin_lesions.objects.get(pk=skin_lesions_value)
            except basic_information_skin_lesions.DoesNotExist:
                return Response({'detail': f'Skin Lesions with pk {skin_lesions_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        lips_value = request.data.get('lips')
        lips_instance = None
        if lips_value is not None:
            try:
                lips_instance = basic_information_lips.objects.get(pk=lips_value)
            except basic_information_lips.DoesNotExist:
                return Response({'detail': f'Lips with pk {lips_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        gums_value = request.data.get('gums')
        gums_instance = None
        if gums_value is not None:
            try:
                gums_instance = basic_information_gums.objects.get(pk=gums_value)
            except basic_information_gums.DoesNotExist:
                return Response({'detail': f'Gums with pk {gums_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        dention_value = request.data.get('dention')
        dention_instance = None
        if dention_value is not None:
            try:
                dention_instance = basic_information_dentition.objects.get(pk=dention_value)
            except basic_information_dentition.DoesNotExist:
                return Response({'detail': f'Dention with pk {dention_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        oral_mucosa_value = request.data.get('oral_mucosa')
        oral_mucosa_instance = None
        if oral_mucosa_value is not None:
            try:
                oral_mucosa_instance = basic_information_oral_mucosa.objects.get(pk=oral_mucosa_value)
            except basic_information_oral_mucosa.DoesNotExist:
                return Response({'detail': f'Oral Mucosa with pk {oral_mucosa_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        tongue_value = request.data.get('tongue')
        tongue_instance = None
        if tongue_value is not None:
            try:
                tongue_instance = basic_information_tounge.objects.get(pk=tongue_value)
            except basic_information_tounge.DoesNotExist:
                return Response({'detail': f'Tongue with pk {tongue_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        hair_color_value = request.data.get('hair_color')
        hair_color_instance = None
        if hair_color_value is not None:
            try:
                hair_color_instance = basic_information_hair_color.objects.get(pk=hair_color_value)
            except basic_information_hair_color.DoesNotExist:
                return Response({'detail': f'Hair Color with pk {hair_color_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        hair_density_value = request.data.get('hair_density')
        hair_density_instance = None
        if hair_density_value is not None:
            try:
                hair_density_instance = basic_information_hair_density.objects.get(pk=hair_density_value)
            except basic_information_hair_density.DoesNotExist:
                return Response({'detail': f'Hair Density with pk {hair_density_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        hair_texture_value = request.data.get('hair_texture')
        hair_texture_instance = None
        if hair_texture_value is not None:
            try:
                hair_texture_instance = basic_information_hair_texture.objects.get(pk=hair_texture_value)
            except basic_information_hair_texture.DoesNotExist:
                return Response({'detail': f'Hair Texture with pk {hair_texture_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        alopecia_value = request.data.get('alopecia')
        alopecia_instance = None
        if alopecia_value is not None:
            try:
                alopecia_instance = basic_information_alopecia.objects.get(pk=alopecia_value)
            except basic_information_alopecia.DoesNotExist:
                return Response({'detail': f'Alopecia with pk {alopecia_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        chest_value = request.data.get('chest')
        chest_instance = None
        if chest_value is not None:
            try:
                chest_instance = basic_information_chest.objects.get(pk=chest_value)
            except basic_information_chest.DoesNotExist:
                return Response({'detail': f'Chest with pk {chest_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        abdomen_value = request.data.get('abdomen')
        abdomen_instance = None
        if abdomen_value is not None:
            try:
                abdomen_instance = basic_information_abdomen.objects.get(pk=abdomen_value)
            except basic_information_abdomen.DoesNotExist:
                return Response({'detail': f'Abdomen with pk {abdomen_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        extremity_value = request.data.get('extremity')
        extremity_instance = None
        if extremity_value is not None:
            try:
                extremity_instance = basic_information_extremity.objects.get(pk=extremity_value)
            except basic_information_extremity.DoesNotExist:
                return Response({'detail': f'Extremity with pk {extremity_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            
        rs_right_value = request.data.get('rs_right')
        rs_right_instance = None
        if rs_right_value is not None:
            try:
                rs_right_instance = basic_information_rs_right.objects.get(pk=rs_right_value)
            except basic_information_rs_right.DoesNotExist:
                return Response({'detail': f'RS Right with pk {rs_right_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        rs_left_value = request.data.get('rs_left')
        rs_left_instance = None
        if rs_left_value is not None:
            try:
                rs_left_instance = basic_information_rs_left.objects.get(pk=rs_left_value)
            except basic_information_rs_left.DoesNotExist:
                return Response({'detail': f'RS Left with pk {rs_left_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        cvs_value = request.data.get('cvs')
        cvs_instance = None
        if cvs_value is not None:
            try:
                cvs_instance = basic_information_cvs.objects.get(pk=cvs_value)
            except basic_information_cvs.DoesNotExist:
                return Response({'detail': f'CVS with pk {cvs_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        varicose_veins_value = request.data.get('varicose_veins')
        varicose_veins_instance = None
        if varicose_veins_value is not None:
            try:
                varicose_veins_instance = basic_information_varicose_veins.objects.get(pk=varicose_veins_value)
            except basic_information_varicose_veins.DoesNotExist:
                return Response({'detail': f'Varicose Veins with pk {varicose_veins_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        lmp_value = request.data.get('lmp')
        lmp_instance = None
        if lmp_value is not None:
            try:
                lmp_instance = basic_information_lmp.objects.get(pk=lmp_value)
            except basic_information_lmp.DoesNotExist:
                return Response({'detail': f'LMP with pk {lmp_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)


        cns_value = request.data.get('cns')
        cns_instance = None
        if cns_value is not None:
            try:
                cns_instance = basic_information_cns.objects.get(pk=cns_value)
            except basic_information_cns.DoesNotExist:
                return Response({'detail': f'CNS with pk {cns_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        reflexes_value = request.data.get('reflexes')
        reflexes_instance = None
        if reflexes_value is not None:
            try:
                reflexes_instance = basic_information_reflexes.objects.get(pk=reflexes_value)
            except basic_information_reflexes.DoesNotExist:
                return Response({'detail': f'Reflexes with pk {reflexes_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        rombergs_value = request.data.get('rombergs')
        rombergs_instance = None
        if rombergs_value is not None:
            try:
                rombergs_instance = basic_information_rombergs.objects.get(pk=rombergs_value)
            except basic_information_rombergs.DoesNotExist:
                return Response({'detail': f'Rombergs with pk {rombergs_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        pupils_value = request.data.get('pupils')
        pupils_instance = None
        if pupils_value is not None:
            try:
                pupils_instance = basic_information_pupils.objects.get(pk=pupils_value)
            except basic_information_pupils.DoesNotExist:
                return Response({'detail': f'Pupils with pk {pupils_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        pa_value = request.data.get('pa')
        pa_instance = None
        if pa_value is not None:
            try:
                pa_instance = basic_information_pa.objects.get(pk=pa_value)
            except basic_information_pa.DoesNotExist:
                return Response({'detail': f'PA with pk {pa_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        tenderness_value = request.data.get('tenderness')
        tenderness_instance = None
        if tenderness_value is not None:
            try:
                tenderness_instance = basic_information_tenderness.objects.get(pk=tenderness_value)
            except basic_information_tenderness.DoesNotExist:
                return Response({'detail': f'Tenderness with pk {tenderness_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        ascitis_value = request.data.get('ascitis')
        ascitis_instance = None
        if ascitis_value is not None:
            try:
                ascitis_instance = basic_information_ascitis.objects.get(pk=ascitis_value)
            except basic_information_ascitis.DoesNotExist:
                return Response({'detail': f'Ascitis with pk {ascitis_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        guarding_value = request.data.get('guarding')
        guarding_instance = None
        if guarding_value is not None:
            try:
                guarding_instance = basic_information_guarding.objects.get(pk=guarding_value)
            except basic_information_guarding.DoesNotExist:
                return Response({'detail': f'Guarding with pk {guarding_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        joints_value = request.data.get('joints')
        joints_instance = None
        if joints_value is not None:
            try:
                joints_instance = basic_information_joints.objects.get(pk=joints_value)
            except basic_information_joints.DoesNotExist:
                return Response({'detail': f'Joints with pk {joints_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        swollen_joints_value = request.data.get('swollen_joints')
        swollen_joints_instance = None
        if swollen_joints_value is not None:
            try:
                swollen_joints_instance = basic_information_swollen_joints.objects.get(pk=swollen_joints_value)
            except basic_information_swollen_joints.DoesNotExist:
                return Response({'detail': f'Swollen Joints with pk {swollen_joints_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        spine_posture_value = request.data.get('spine_posture')
        spine_posture_instance = None
        if spine_posture_value is not None:
            try:
                spine_posture_instance = basic_information_spine_posture.objects.get(pk=spine_posture_value)
            except basic_information_spine_posture.DoesNotExist:
                return Response({'detail': f'Spine Posture with pk {spine_posture_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        language_delay_value = request.data.get('language_delay')
        language_delay_instance = None
        if language_delay_value is not None:
            try:
                language_delay_instance = basic_information_language_delay.objects.get(pk=language_delay_value)
            except basic_information_language_delay.DoesNotExist:
                return Response({'detail': f'Language Delay with pk {language_delay_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        behavioural_disorder_value = request.data.get('behavioural_disorder')
        behavioural_disorder_instance = None
        if behavioural_disorder_value is not None:
            try:
                behavioural_disorder_instance = basic_information_behavioural_disorder.objects.get(pk=behavioural_disorder_value)
            except basic_information_behavioural_disorder.DoesNotExist:
                return Response({'detail': f'Behavioural Disorder with pk {behavioural_disorder_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        speech_screening_value = request.data.get('speech_screening')
        speech_screening_instance = None
        if speech_screening_value is not None:
            try:
                speech_screening_instance = basic_information_speech_screening.objects.get(pk=speech_screening_value)
            except basic_information_speech_screening.DoesNotExist:
                return Response({'detail': f'Speech Screening with pk {speech_screening_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        referral_value = request.data.get('referral')
        referral_instance = None
        if referral_value is not None:
            try:
                referral_instance = basic_information_referral.objects.get(pk=referral_value)
            except basic_information_referral.DoesNotExist:
                return Response({'detail': f'Referral with pk {referral_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        place_referral_value = request.data.get('place_referral')
        place_referral_instance = None
        if place_referral_value is not None:
            try:
                place_referral_instance = basic_information_place_referral.objects.get(pk=place_referral_value)
            except basic_information_place_referral.DoesNotExist:
                return Response({'detail': f'Place Referral with pk {place_referral_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            
        hospital_referral_value = request.data.get('hospital_name')
        hospital_referral_instance = None
        if hospital_referral_value is not None:
            try:
                hospital_referral_instance = referred_hospital_list.objects.get(pk=hospital_referral_value)
            except referred_hospital_list.DoesNotExist:
                return Response({'detail': f'Hospital Referral with pk {hospital_referral_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        # Check if the entry already exists
        existing_entry = agg_sc_basic_screening_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id,
            
        ).first()

        if existing_entry:
            # Entry already exists, you may want to update it instead of creating a new one
            # Update the existing entry with the new data if needed
         
            if head_instance:
                existing_entry.head = head_instance
            if nose_instance:
                existing_entry.nose = nose_instance
            if neck_instance:
                existing_entry.neck = neck_instance
            if skin_color_instance:
                existing_entry.skin_color = skin_color_instance
            if skin_texture_instance:
                existing_entry.skin_texture = skin_texture_instance
            if skin_lesions_instance:
                existing_entry.skin_lesions = skin_lesions_instance
            if lips_instance:
                existing_entry.lips = lips_instance
            if gums_instance:
                existing_entry.gums = gums_instance 
            if dention_instance:
                existing_entry.dention = dention_instance
            if oral_mucosa_instance:
                existing_entry.oral_mucosa = oral_mucosa_instance
            if tongue_instance:
                existing_entry.tongue = tongue_instance
            if hair_color_instance:
                existing_entry.hair_color = hair_color_instance
            if hair_density_instance:
                existing_entry.hair_density = hair_density_instance
            if hair_texture_instance:
                existing_entry.hair_texture = hair_texture_instance
            if alopecia_instance:
                existing_entry.alopecia = alopecia_instance
            if chest_instance:
                existing_entry.chest = chest_instance
            if abdomen_instance:
                existing_entry.abdomen = abdomen_instance
            if extremity_instance:
                existing_entry.extremity = extremity_instance
            if rs_right_instance:
                existing_entry.rs_right = rs_right_instance
            if rs_left_instance:
                existing_entry.rs_left = rs_left_instance
            if cvs_instance:
                existing_entry.cvs = cvs_instance
            if varicose_veins_instance:
                existing_entry.varicose_veins = varicose_veins_instance
            if lmp_instance:
                existing_entry.lmp = lmp_instance
            if cns_instance:
                existing_entry.cns = cns_instance
            if reflexes_instance:
                existing_entry.reflexes = reflexes_instance
            if rombergs_instance:
                existing_entry.rombergs = rombergs_instance
            if pupils_instance:
                existing_entry.pupils = pupils_instance
            if pa_instance:
                existing_entry.pa = pa_instance
            if tenderness_instance:
                existing_entry.tenderness = tenderness_instance
            if ascitis_instance:
                existing_entry.ascitis = ascitis_instance
            if guarding_instance:
                existing_entry.guarding = guarding_instance
            if joints_instance:
                existing_entry.joints = joints_instance
            if swollen_joints_instance:
                existing_entry.swollen_joints = swollen_joints_instance
            if spine_posture_instance:
                existing_entry.spine_posture = spine_posture_instance
            if spine_posture_instance:
                existing_entry.spine_posture = spine_posture_instance 
            if language_delay_instance:
                existing_entry.language_delay = language_delay_instance
            if behavioural_disorder_instance:
                existing_entry.behavioural_disorder = behavioural_disorder_instance
            if speech_screening_instance:
                existing_entry.speech_screening = speech_screening_instance
            if hospital_referral_instance:
                existing_entry.hospital_name = hospital_referral_instance  
            if 'treatment_for' in request.data:
                existing_entry.treatment_for = request.data['treatment_for']
            if 'comment' in request.data:
                existing_entry.comment = request.data['comment']
            if 'birth_defects' in request.data:
                existing_entry.birth_defects = request.data['birth_defects']
            if 'childhood_disease' in request.data:
                existing_entry.childhood_disease = request.data['childhood_disease']
            if 'deficiencies' in request.data:
                existing_entry.deficiencies = request.data['deficiencies']
                
            if 'menarche_achieved' in request.data:
                existing_entry.menarche_achieved = request.data['menarche_achieved']
            if 'date_of_menarche' in request.data:
                existing_entry.date_of_menarche = request.data['date_of_menarche']
            if 'age_of_menarche' in request.data:
                existing_entry.age_of_menarche = request.data['age_of_menarche']
            if 'vaginal_descharge' in request.data:
                existing_entry.vaginal_descharge = request.data['vaginal_descharge']
            if 'flow' in request.data:
                existing_entry.flow = request.data['flow']
            if 'comments' in request.data:
                existing_entry.comments = request.data['comments']
            if 'observation' in request.data:
                existing_entry.observation = request.data['observation']
        
            
            if 'skin_conditions' in request.data:
                existing_entry.skin_conditions = request.data['skin_conditions']
            if 'check_box_if_normal' in request.data:
                existing_entry.check_box_if_normal = request.data['check_box_if_normal']
            if 'diagnosis' in request.data:
                existing_entry.diagnosis = request.data['diagnosis']
            if 'referral' in request.data:
                existing_entry.referral = request.data['referral']
            if 'reason_for_referral' in request.data:
                existing_entry.reason_for_referral = request.data['reason_for_referral']
            if 'place_referral' in request.data:
                existing_entry.place_referral = request.data['place_referral']
            if 'outcome' in request.data:
                existing_entry.outcome = request.data['outcome']
            if 'referred_surgery' in request.data:
                existing_entry.referred_surgery = request.data['referred_surgery']
            if 'basic_referred_treatment' in request.data:
                existing_entry.basic_referred_treatment = request.data['basic_referred_treatment']
            if 'form_submit' in request.data:
                existing_entry.form_submit = request.data['form_submit']
            if 'bad_habbits' in request.data:
                existing_entry.bad_habbits = request.data['bad_habbits']
                
            if 'genito_urinary' in request.data:
                existing_entry.genito_urinary = request.data['genito_urinary']
            if 'genito_urinary_comment' in request.data:
                existing_entry.genito_urinary_comment = request.data['genito_urinary_comment']
            if 'discharge' in request.data:
                existing_entry.discharge = request.data['discharge']
            if 'discharge_comment' in request.data:
                existing_entry.discharge_comment = request.data['discharge_comment']
            if 'hydrocele' in request.data:
                existing_entry.hydrocele = request.data['hydrocele']
            if 'cervical' in request.data:
                existing_entry.cervical = request.data['cervical']
            if 'axilla' in request.data:
                existing_entry.axilla = request.data['axilla']
            if 'inguinal' in request.data:
                existing_entry.inguinal = request.data['inguinal']
            if 'thyroid' in request.data:
                existing_entry.thyroid = request.data['thyroid'] 
                          
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            # ... (Include fields similar to the update logic for other attributes)
            existing_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'basic_screening_pk_id': existing_entry.basic_screening_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    # 'citizen_pk_id': existing_entry.citizen_pk_id,
                    'head': basic_information_head_scalp_Serializer(head_instance).data if head_instance else None,
                    'nose': basic_information_noseSerializer(nose_instance).data if nose_instance else None,
                    'neck': basic_information_neckSerializer(neck_instance).data if neck_instance else None,
                    'skin_color': basic_information_skin_colorSerializer(skin_color_instance).data if skin_color_instance else None,
                    'skin_texture': basic_information_skin_textureSerializer(skin_texture_instance).data if skin_texture_instance else None,
                    'skin_lesions': basic_information_skin_lensionSerializer(skin_lesions_instance).data if skin_lesions_instance else None,
                    'lips': basic_information_lipsSerializer(lips_instance).data if lips_instance else None,
                    'gums': basic_information_gumsSerializer(gums_instance).data if gums_instance else None,

                    'dention': basic_information_dentitionSerializer(dention_instance).data if dention_instance else None,
                    'oral_mucosa': basic_information_oral_mucosaSerializer(oral_mucosa_instance).data if oral_mucosa_instance else None,
                    'tongue': basic_information_toungeSerializer(tongue_instance).data if tongue_instance else None,
                    'hair_color': basic_information_hair_colorSerializer(hair_color_instance).data if hair_color_instance else None,
                    'hair_density': basic_information_hair_densitySerializer(hair_density_instance).data if hair_density_instance else None,
                    'hair_texture': basic_information_hair_textureSerializer(hair_texture_instance).data if hair_texture_instance else None,
                    'alopecia': basic_information_alopeciaSerializer(alopecia_instance).data if alopecia_instance else None,
                    'chest': basic_information_chestSerializer(chest_instance).data if chest_instance else None,
                    'abdomen': basic_information_abdomenSerializer(abdomen_instance).data if abdomen_instance else None,
                    'extremity': basic_information_extremitySerializer(extremity_instance).data if extremity_instance else None,
                    'bad_habbits': existing_entry.bad_habbits,
                    
                    'rs_right': basic_information_rs_rightSerializer(rs_right_instance).data if rs_right_instance else None,
                    'rs_left': basic_information_rs_leftSerializer(rs_left_instance).data if rs_left_instance else None,
                    'cvs': basic_information_cvsSerializer(cvs_instance).data if cvs_instance else None,
                    'varicose_veins': basic_information_varicose_veinsSerializer(varicose_veins_instance).data if varicose_veins_instance else None,
                    'lmp': basic_information_lmpSerializer(lmp_instance).data if lmp_instance else None,
                    'cns': basic_information_cnsSerializer(cns_instance).data if cns_instance else None,
                    'reflexes': basic_information_reflexesSerializer(reflexes_instance).data if reflexes_instance else None,
                    'rombergs': basic_information_rombergsSerializer(rombergs_instance).data if rombergs_instance else None,
                    'pupils': basic_information_pupilsSerializer(pupils_instance).data if pupils_instance else None,
                    'pa': basic_information_pa_idSerializer(pa_instance).data if pa_instance else None,
                    'tenderness': basic_information_tendernessSerializer(tenderness_instance).data if tenderness_instance else None,
                    'ascitis': basic_information_ascitisSerializer(ascitis_instance).data if ascitis_instance else None,
                    'guarding': basic_information_guardingSerializer(guarding_instance).data if guarding_instance else None,
                    'joints': basic_information_jointsSerializer(joints_instance).data if joints_instance else None,
                    'swollen_joints': basic_information_swollen_jointsSerializer(swollen_joints_instance).data if swollen_joints_instance else None,
                    'spine_posture':basic_information_spine_postureSerializer(spine_posture_instance).data if spine_posture_instance else None,
                    'language_delay': basic_information_language_delaySerializer(language_delay_instance).data if language_delay_instance else None,
                    'behavioural_disorder': basic_information_behavioural_disorderSerializer(behavioural_disorder_instance).data if behavioural_disorder_instance else None,
                    'speech_screening': basic_information_speech_screeningSerializer(speech_screening_instance).data if speech_screening_instance else None,
                    'hospital_name': HospitalListSerializer(hospital_referral_instance).data if hospital_referral_instance else None,
                    
                    'genito_urinary': existing_entry.genito_urinary,
                    'genito_urinary_comment': existing_entry.genito_urinary_comment,
                    'discharge': existing_entry.discharge,
                    'discharge_comment': existing_entry.discharge_comment,
                    'hydrocele': existing_entry.hydrocele,
                    'cervical': existing_entry.cervical,
                    'axilla': existing_entry.axilla,
                    'inguinal': existing_entry.inguinal,
                    'thyroid': existing_entry.thyroid,
                    
                    
                    'comment': existing_entry.comment,
                    'birth_defects': existing_entry.birth_defects,
                    'childhood_disease': existing_entry.childhood_disease,
                    'deficiencies': existing_entry.deficiencies,
                    
                    'menarche_achieved': existing_entry.menarche_achieved,
                    'date_of_menarche': existing_entry.date_of_menarche,
                    'age_of_menarche': existing_entry.age_of_menarche,
                    'vaginal_descharge': existing_entry.vaginal_descharge,
                    'flow': existing_entry.flow,
                    'comments': existing_entry.comments,
                    'observation':existing_entry.observation,
                    
                    
                    'skin_conditions': existing_entry.skin_conditions,
                    'check_box_if_normal': existing_entry.check_box_if_normal,
                    'diagnosis': existing_entry.diagnosis,
                    'treatment_for': existing_entry.treatment_for,
                    'referral':  referral_instance.pk if referral_instance else None,
                    'reason_for_referral': existing_entry.reason_for_referral,
                    'place_referral': place_referral_instance.pk if place_referral_instance else None,
                    'outcome': existing_entry.outcome,
                    'referred_surgery': existing_entry.referred_surgery,
                    'basic_referred_treatment': existing_entry.basic_referred_treatment,
                    'form_submit': existing_entry.form_submit,
                    'added_by': existing_entry.added_by.id,
                    'modify_by': existing_entry.modify_by.id
                    # ... other fields ...
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Entry doesn't exist, create and save a new one
            citizen_basic_screening_info = agg_sc_basic_screening_info(
            citizen_id=citizen_id,
            schedule_id=schedule_id,
            schedule_count=schedule_count,
            citizen_pk_id=citizen_pk_instance,
            head=head_instance,
            nose=nose_instance,
            neck=neck_instance,
            skin_color=skin_color_instance,
            skin_texture=skin_texture_instance,
            skin_lesions=skin_lesions_instance,
            lips = lips_instance,
            gums = gums_instance,
            dention = dention_instance,
            oral_mucosa = oral_mucosa_instance,
            tongue = tongue_instance,
            hair_color = hair_color_instance,
            hair_density = hair_density_instance,
            hair_texture = hair_texture_instance,
            alopecia = alopecia_instance,
            chest=chest_instance,
            abdomen=abdomen_instance,
            extremity=extremity_instance,
            bad_habbits = request.data.get('bad_habbits'),
            rs_right=rs_right_instance,
            rs_left=rs_left_instance,
            cvs=cvs_instance,
            varicose_veins = varicose_veins_instance,
            lmp = lmp_instance,
            cns = cns_instance,
            reflexes = reflexes_instance,
            rombergs = rombergs_instance,
            pupils = pupils_instance,
            pa = pa_instance,
            tenderness = tenderness_instance,
            ascitis = ascitis_instance,
            guarding=guarding_instance,
            joints=joints_instance,
            swollen_joints=swollen_joints_instance,
            spine_posture=spine_posture_instance,
            
            language_delay=language_delay_instance,
            behavioural_disorder=behavioural_disorder_instance,
            speech_screening =speech_screening_instance,
            comment = request.data.get('comment'),
            observation = request.data.get('observation'),
            
            genito_urinary = request.data.get('genito_urinary'),
            genito_urinary_comment = request.data.get('genito_urinary_comment'),
            discharge = request.data.get('discharge'),
            discharge_comment = request.data.get('discharge_comment'),
            hydrocele = request.data.get('hydrocele'),
            cervical = request.data.get('cervical'),
            axilla = request.data.get('axilla'),
            inguinal = request.data.get('inguinal'),
            thyroid = request.data.get('thyroid'),
            
            
            birth_defects = request.data.get('birth_defects'),
            childhood_disease = request.data.get('childhood_disease'),
            deficiencies = request.data.get('deficiencies'),
            
            menarche_achieved = request.data.get('menarche_achieved'),
            date_of_menarche = request.data.get('date_of_menarche'),
            age_of_menarche = request.data.get('age_of_menarche'),
            vaginal_descharge = request.data.get('vaginal_descharge'),
            flow = request.data.get('flow'),
            comments = request.data.get('comments'),
            
            skin_conditions = request.data.get('skin_conditions'),
            check_box_if_normal = request.data.get('check_box_if_normal'),
            diagnosis = request.data.get('diagnosis'),
            treatment_for = request.data.get('treatment_for'),
            referral = referral_instance,
            reason_for_referral = request.data.get('reason_for_referral'),
            place_referral = place_referral_instance,
            outcome = request.data.get('outcome'),
            referred_surgery = request.data.get('referred_surgery'),
            basic_referred_treatment = request.data.get('basic_referred_treatment'),
            form_submit=request.data.get('form_submit'),
            hospital_name = hospital_referral_instance,
            added_by=added_by_instance,
            modify_by=modify_by_instance,
            
               
        )

        try:
            # Save the new citizen Basic_Screening info record
            citizen_basic_screening_info.full_clean()  # Run any model clean methods
            citizen_basic_screening_info.save()

            # Update the citizen schedule record
            # citizen_schedule.closing_status = True
            # citizen_schedule.save()

            response_data = {
                'message': 'Data Send successfully',
                'posted_data': {
                    'basic_screening_pk_id': citizen_basic_screening_info.basic_screening_pk_id,
                    'citizen_id': citizen_basic_screening_info.citizen_id,
                    'schedule_id':citizen_basic_screening_info.schedule_id,
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'head': head_instance.pk if head_instance else None,
                    'nose': nose_instance.pk if nose_instance else None,
                    'neck': neck_instance.pk if neck_instance else None,
                    'skin_color': skin_color_instance.pk if skin_color_instance else None,
                    'skin_texture': skin_texture_instance.pk if skin_texture_instance else None,
                    'skin_lesions': skin_lesions_instance.pk if skin_lesions_instance else None,
                    'lips': lips_instance.pk if lips_instance else None,
                    'gums': gums_instance.pk if gums_instance else None,
                    'dention': dention_instance.pk if dention_instance else None,
                    'oral_mucosa': oral_mucosa_instance.pk if oral_mucosa_instance else None,
                    'tongue': tongue_instance.pk if tongue_instance else None,
                    'hair_color': hair_color_instance.pk if hair_color_instance else None,
                    'hair_density': hair_density_instance.pk if hair_density_instance else None,
                    'hair_texture': hair_texture_instance.pk if hair_texture_instance else None,
                    'alopecia': alopecia_instance.pk if alopecia_instance else None,
                    'chest': chest_instance.pk if chest_instance else None,
                    'abdomen': abdomen_instance.pk if abdomen_instance else None,
                    'extremity': extremity_instance.pk if extremity_instance else None,
                    'bad_habbits': citizen_basic_screening_info.bad_habbits,
                    
                    'rs_right': rs_right_instance.pk if rs_right_instance else None,
                    'rs_left': rs_left_instance.pk if rs_left_instance else None,
                    'cvs': cvs_instance.pk if cvs_instance else None,
                    'varicose_veins': varicose_veins_instance.pk if varicose_veins_instance else None,
                    'lmp': lmp_instance.pk if lmp_instance else None,
                    'gums': gums_instance.pk if gums_instance else None,
                    'cns': cns_instance.pk if cns_instance else None,
                    'reflexes': reflexes_instance.pk if reflexes_instance else None,
                    'rombergs': rombergs_instance.pk if rombergs_instance else None,
                    'pupils': pupils_instance.pk if pupils_instance else None,
                    'pa': pa_instance.pk if pa_instance else None,
                    'tenderness': tenderness_instance.pk if tenderness_instance else None,
                    'ascitis': ascitis_instance.pk if ascitis_instance else None,
                    'guarding': guarding_instance.pk if guarding_instance else None,
                    'joints': joints_instance.pk if joints_instance else None,
                    'swollen_joints': swollen_joints_instance.pk if swollen_joints_instance else None,
                    'spine_posture': spine_posture_instance.pk if spine_posture_instance else None,
                    'language_delay': language_delay_instance.pk if language_delay_instance else None,
                    'behavioural_disorder': behavioural_disorder_instance.pk if behavioural_disorder_instance else None,
                    'speech_screening': speech_screening_instance.pk if speech_screening_instance else None,
                    'comment': citizen_basic_screening_info.comment,
                    'observation':citizen_basic_screening_info.observation,
                    'hospital_name': hospital_referral_instance.pk if hospital_referral_instance else None,
                    'genito_urinary': citizen_basic_screening_info.genito_urinary,
                    'genito_urinary_comment': citizen_basic_screening_info.genito_urinary_comment,
                    'discharge': citizen_basic_screening_info.discharge,
                    'discharge_comment': citizen_basic_screening_info.discharge_comment,
                    'hydrocele': citizen_basic_screening_info.hydrocele,
                    'cervical': citizen_basic_screening_info.cervical,
                    'axilla': citizen_basic_screening_info.axilla,
                    'inguinal': citizen_basic_screening_info.inguinal,
                    'thyroid': citizen_basic_screening_info.thyroid,
                    
                    'birth_defects': citizen_basic_screening_info.birth_defects,
                    'childhood_disease': citizen_basic_screening_info.childhood_disease,
                    'deficiencies': citizen_basic_screening_info.deficiencies,
                    
                    'menarche_achieved': citizen_basic_screening_info.menarche_achieved,
                    'date_of_menarche': citizen_basic_screening_info.date_of_menarche,
                    'age_of_menarche': citizen_basic_screening_info.age_of_menarche,
                    'vaginal_descharge': citizen_basic_screening_info.vaginal_descharge,
                    'flow': citizen_basic_screening_info.flow,
                    'comments': citizen_basic_screening_info.comments,
                    
                    
                    'skin_conditions': citizen_basic_screening_info.skin_conditions,
                    'check_box_if_normal': citizen_basic_screening_info.check_box_if_normal,
                    'diagnosis': citizen_basic_screening_info.diagnosis,
                    'treatment_for': citizen_basic_screening_info.treatment_for,
                    'referral': referral_instance.pk if referral_instance else None,
                    'reason_for_referral': citizen_basic_screening_info.reason_for_referral,
                    'place_referral':place_referral_instance.pk if place_referral_instance else None,
                    'outcome': citizen_basic_screening_info.outcome,
                    'referred_surgery': citizen_basic_screening_info.referred_surgery,
                    'basic_referred_treatment': citizen_basic_screening_info.basic_referred_treatment,
                    'form_submit': citizen_basic_screening_info.form_submit,
                    'added_by':added_by_instance.pk,
                    'modify_by': modify_by_instance.pk,

                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        

        
        
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

#------------------------Immunisation Post API---------------------------------------#
class CitizenImmunisationInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Extract data from the schedule record
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        

        # Check if the entry already exists
        existing_entry = agg_sc_citizen_immunization_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            # Entry already exists, you may want to update it instead of creating a new one
            # Update the existing entry with the new data if needed
            # existing_entry.citizen_pk_id = request.data.get('citizen_pk_id')
            existing_entry.name_of_vaccine = request.data.get('name_of_vaccine')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            # ... update other fields as needed
            existing_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'immunization_info_pk_id': existing_entry.immunization_info_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    # 'citizen_pk_id': existing_entry.citizen_pk_id,
                    'name_of_vaccine': existing_entry.name_of_vaccine,
                    'form_submit': existing_entry.form_submit,
                    'added_by': existing_entry.added_by.id,
                    'modify_by': existing_entry.modify_by.id
                    # ... add other fields as needed
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Entry doesn't exist, create and save a new one
            citizen_immunisation_info = agg_sc_citizen_immunization_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                name_of_vaccine=request.data.get('name_of_vaccine'),
                form_submit=request.data.get('form_submit'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
                # ... add other fields as needed
            )

            try:
                # Save the new citizen Immunisation info record
                citizen_immunisation_info.full_clean()  # Run any model clean methods
                citizen_immunisation_info.save()

                # Update the citizen schedule record
                # citizen_schedule.closing_status = True
                # citizen_schedule.save()

                response_data = {
                    'message': 'Data sent successfully',
                    'posted_data': {
                        'immunization_info_pk_id': citizen_immunisation_info.immunization_info_pk_id,
                        'citizen_id': citizen_immunisation_info.citizen_id,
                        'schedule_id': citizen_immunisation_info.schedule_id,
                        'citizen_pk_id': citizen_pk_instance.pk,
                        'name_of_vaccine': citizen_immunisation_info.name_of_vaccine,
                        'form_submit': citizen_immunisation_info.form_submit,
                        'added_by':added_by_instance.pk,
                        'modify_by': modify_by_instance.pk,
                        # ... add other fields as needed
                    }
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            



class CitizenOtherInfoPost(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_entry = agg_sc_citizen_other_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            existing_entry.footfall = request.data.get('footfall')
            existing_entry.footfall_refer = request.data.get('footfall_refer')
            existing_entry.anc_services = request.data.get('anc_services')
            existing_entry.anc_services_refer = request.data.get('anc_services_refer')
            existing_entry.ifa_supplementation = request.data.get('ifa_supplementation')
            existing_entry.ifa_supplementation_refer = request.data.get('ifa_supplementation_refer')
            existing_entry.high_risk_pregnancy = request.data.get('high_risk_pregnancy')
            existing_entry.high_risk_pregnancy_refer = request.data.get('high_risk_pregnancy_refer')
            existing_entry.pnc_services = request.data.get('pnc_services')
            existing_entry.pnc_services_refer = request.data.get('pnc_services_refer')
            existing_entry.leprosy = request.data.get('leprosy')
            existing_entry.leprosy_refer = request.data.get('leprosy_refer')
            existing_entry.tuberculosis = request.data.get('tuberculosis')
            existing_entry.tuberculosis_refer = request.data.get('tuberculosis_refer')
            existing_entry.scd = request.data.get('scd')
            existing_entry.scd_refer = request.data.get('scd_refer')
            existing_entry.hypertension = request.data.get('hypertension')
            existing_entry.hypertension_refer = request.data.get('hypertension_refer')
            existing_entry.diabetes = request.data.get('diabetes')
            existing_entry.diabetes_refer = request.data.get('diabetes_refer')
            existing_entry.anaemia = request.data.get('anaemia')
            existing_entry.anaemia_refer = request.data.get('anaemia_refer')
            existing_entry.cervical_cancer = request.data.get('cervical_cancer')
            existing_entry.cervical_cancer_refer = request.data.get('cervical_cancer_refer')
            existing_entry.other_conditions = request.data.get('other_conditions')
            existing_entry.other_conditions_refer = request.data.get('other_conditions_refer')
            existing_entry.malaria_dengue_rdt = request.data.get('malaria_dengue_rdt')
            existing_entry.malaria_dengue_rdt_refer = request.data.get('malaria_dengue_rdt_refer')
            existing_entry.diagnostic_tests = request.data.get('diagnostic_tests')
            existing_entry.diagnostic_tests_refer = request.data.get('diagnostic_tests_refer')
            existing_entry.higher_facility = request.data.get('higher_facility')
            existing_entry.higher_facility_refer = request.data.get('higher_facility_refer')
            
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.reffered_to_specialist = request.data.get('reffered_to_specialist')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            
            existing_entry.save()

            if existing_entry.reffered_to_specialist == 1:
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vital_refer = existing_entry.reffered_to_specialist
                    follow_up_entry.added_by = added_by_instance
                    follow_up_entry.modify_by = modify_by_instance
                    follow_up_entry.modify_date = timezone.now()
                    follow_up_entry.save()
                else:
                    follow_up_entry = agg_sc_follow_up_citizen.objects.create(
                        vital_refer=request.data.get('reffered_to_specialist'),
                        citizen_id=citizen_id,
                        citizen_pk_id=citizen_pk_instance,
                        schedule_id=schedule_id,
                        added_by=added_by_instance,
                        added_date=timezone.now(),
                        modify_by=modify_by_instance,
                        modify_date=timezone.now()
                    )

            if existing_entry.reffered_to_specialist == 2:
                # Delete the 'vital_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vital_refer = None
                    follow_up_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                    'updated_data': {
                    'footfall': existing_entry.footfall,
                    'footfall_refer': existing_entry.footfall_refer,
                    'anc_services': existing_entry.anc_services,
                    'anc_services_refer': existing_entry.anc_services_refer,
                    'ifa_supplementation': existing_entry.ifa_supplementation,
                    'ifa_supplementation_refer': existing_entry.ifa_supplementation_refer,
                    'high_risk_pregnancy': existing_entry.high_risk_pregnancy,
                    'high_risk_pregnancy_refer': existing_entry.high_risk_pregnancy_refer,
                    'pnc_services': existing_entry.pnc_services,
                    'pnc_services_refer': existing_entry.pnc_services_refer,
                    'leprosy': existing_entry.leprosy,
                    'leprosy_refer': existing_entry.leprosy_refer,
                    'tuberculosis': existing_entry.tuberculosis,
                    'tuberculosis_refer': existing_entry.tuberculosis_refer,
                    'scd': existing_entry.scd,
                    'scd_refer': existing_entry.scd_refer,
                    'hypertension': existing_entry.hypertension,
                    'hypertension_refer': existing_entry.hypertension_refer,
                    'diabetes': existing_entry.diabetes,
                    'diabetes_refer': existing_entry.diabetes_refer,
                    'anaemia': existing_entry.anaemia,
                    'anaemia_refer': existing_entry.anaemia_refer,
                    'cervical_cancer': existing_entry.cervical_cancer,
                    'cervical_cancer_refer': existing_entry.cervical_cancer_refer,
                    'other_conditions': existing_entry.other_conditions,
                    'other_conditions_refer': existing_entry.other_conditions_refer,
                    'malaria_dengue_rdt': existing_entry.malaria_dengue_rdt,
                    'malaria_dengue_rdt_refer': existing_entry.malaria_dengue_rdt_refer,
                    'diagnostic_tests': existing_entry.diagnostic_tests,
                    'diagnostic_tests_refer': existing_entry.diagnostic_tests_refer,
                    'higher_facility': existing_entry.higher_facility,
                    'higher_facility_refer': existing_entry.higher_facility_refer,
                    'reffered_to_specialist': existing_entry.reffered_to_specialist,
                    'added_by': existing_entry.added_by.id if existing_entry.added_by else None,
                    'modify_by': existing_entry.modify_by.id,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            citizen_health_info = agg_sc_citizen_other_info(
            citizen_id=citizen_id,
            schedule_id=schedule_id,
            schedule_count=schedule_count,
            citizen_pk_id=citizen_pk_instance,
            footfall=request.data.get('footfall'),
            footfall_refer=request.data.get('footfall_refer'),
            anc_services=request.data.get('anc_services'),
            anc_services_refer=request.data.get('anc_services_refer'),
            ifa_supplementation=request.data.get('ifa_supplementation'),
            ifa_supplementation_refer=request.data.get('ifa_supplementation_refer'),
            high_risk_pregnancy=request.data.get('high_risk_pregnancy'),
            high_risk_pregnancy_refer=request.data.get('high_risk_pregnancy_refer'),
            pnc_services=request.data.get('pnc_services'),
            pnc_services_refer=request.data.get('pnc_services_refer'),
            leprosy=request.data.get('leprosy'),
            leprosy_refer=request.data.get('leprosy_refer'),
            tuberculosis=request.data.get('tuberculosis'),
            tuberculosis_refer=request.data.get('tuberculosis_refer'),
            scd=request.data.get('scd'),
            scd_refer=request.data.get('scd_refer'),
            hypertension=request.data.get('hypertension'),
            hypertension_refer=request.data.get('hypertension_refer'),
            diabetes=request.data.get('diabetes'),
            diabetes_refer=request.data.get('diabetes_refer'),
            anaemia=request.data.get('anaemia'),
            anaemia_refer=request.data.get('anaemia_refer'),
            cervical_cancer=request.data.get('cervical_cancer'),
            cervical_cancer_refer=request.data.get('cervical_cancer_refer'),
            other_conditions=request.data.get('other_conditions'),
            other_conditions_refer=request.data.get('other_conditions_refer'),
            malaria_dengue_rdt=request.data.get('malaria_dengue_rdt'),
            malaria_dengue_rdt_refer=request.data.get('malaria_dengue_rdt_refer'),
            diagnostic_tests=request.data.get('diagnostic_tests'),
            diagnostic_tests_refer=request.data.get('diagnostic_tests_refer'),
            higher_facility=request.data.get('higher_facility'),
            higher_facility_refer=request.data.get('higher_facility_refer'),
            added_by=added_by_instance,
            modify_by=modify_by_instance,
        )

            citizen_health_info.save()
            if citizen_health_info.reffered_to_specialist == 2:
                # Delete the 'auditory_refer' field in the 'agg_sc_follow_up_citizen' table
                follow_up_entry = agg_sc_follow_up_citizen.objects.filter(
                    citizen_id=citizen_id,
                    schedule_id=schedule_id
                ).first()

                if follow_up_entry:
                    follow_up_entry.vital_refer_refer = None
                    follow_up_entry.save()

            response_data = {
                'message': 'Data sent successfully',
                'posted_data': {
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'footfall': citizen_health_info.footfall,
                    'footfall_refer': citizen_health_info.footfall_refer,
                    'anc_services': citizen_health_info.anc_services,
                    'anc_services_refer': citizen_health_info.anc_services_refer,
                    'ifa_supplementation': citizen_health_info.ifa_supplementation,
                    'ifa_supplementation_refer': citizen_health_info.ifa_supplementation_refer,
                    'high_risk_pregnancy': citizen_health_info.high_risk_pregnancy,
                    'high_risk_pregnancy_refer': citizen_health_info.high_risk_pregnancy_refer,
                    'pnc_services': citizen_health_info.pnc_services,
                    'pnc_services_refer': citizen_health_info.pnc_services_refer,
                    'leprosy': citizen_health_info.leprosy,
                    'leprosy_refer': citizen_health_info.leprosy_refer,
                    'tuberculosis': citizen_health_info.tuberculosis,
                    'tuberculosis_refer': citizen_health_info.tuberculosis_refer,
                    'scd': citizen_health_info.scd,
                    'scd_refer': citizen_health_info.scd_refer,
                    'hypertension': citizen_health_info.hypertension,
                    'hypertension_refer': citizen_health_info.hypertension_refer,
                    'diabetes': citizen_health_info.diabetes,
                    'diabetes_refer': citizen_health_info.diabetes_refer,
                    'anaemia': citizen_health_info.anaemia,
                    'anaemia_refer': citizen_health_info.anaemia_refer,
                    'cervical_cancer': citizen_health_info.cervical_cancer,
                    'cervical_cancer_refer': citizen_health_info.cervical_cancer_refer,
                    'other_conditions': citizen_health_info.other_conditions,
                    'other_conditions_refer': citizen_health_info.other_conditions_refer,
                    'malaria_dengue_rdt': citizen_health_info.malaria_dengue_rdt,
                    'malaria_dengue_rdt_refer': citizen_health_info.malaria_dengue_rdt_refer,
                    'diagnostic_tests': citizen_health_info.diagnostic_tests,
                    'diagnostic_tests_refer': citizen_health_info.diagnostic_tests_refer,
                    'higher_facility': citizen_health_info.higher_facility,
                    'higher_facility_refer': citizen_health_info.higher_facility_refer,
                    'added_by': added_by_instance.pk,
                    'modify_by': modify_by_instance.pk,
                }
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

            




# Assuming you have already imported necessary modules and classes

# class CitizenImmunisationInfoPost(APIView):
#     def post(self, request, *args, **kwargs):
#         try:
#             schedule_pk = kwargs.get('schedule_pk')
#             citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
#         except Http404:
#             return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         # Extract data from the schedule record
#         citizen_id = citizen_schedule.citizen_id
#         schedule_id = citizen_schedule.schedule_id

#         # Create a new citizen Immunisation info record
#         citizen_immunisation_info = agg_sc_citizen_immunization_info(
#             citizen_id=citizen_id,
#             schedule_id=schedule_id,
#             name_of_vaccine=request.data.get('name_of_vaccine'),
#             given_yes_no=request.data.get('given_yes_no'),
#             scheduled_date_from=request.data.get('scheduled_date_from'),
#             scheduled_date_to=request.data.get('scheduled_date_to'),            
#         )

#         try:
#             # Save the new citizen Immunisation info record
#             citizen_immunisation_info.full_clean()  # Run any model clean methods
#             citizen_immunisation_info.save()

#             # Update the citizen schedule record
#             citizen_schedule.closing_status = True
#             citizen_schedule.save()

#             response_data = {
#                 'message': 'Data Send successfully',
#                 'posted_data': {
#                     'immunization_info_pk_id': citizen_immunisation_info.immunization_info_pk_id,
#                     'citizen_id': citizen_immunisation_info.citizen_id,
#                     'schedule_id':citizen_immunisation_info.schedule_id,
#                     'name_of_vaccine': citizen_immunisation_info.name_of_vaccine,
#                     'given_yes_no': citizen_immunisation_info.given_yes_no,
#                     'scheduled_date_from': citizen_immunisation_info.scheduled_date_from,
#                     'scheduled_date_to': citizen_immunisation_info.scheduled_date_to,
#                 }
#             }

#             return JsonResponse(response_data)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)


        
# class pulse_get_api(APIView):
#     def get(self,request,pulse,):
#         print("this is pulse",pulse)
#         if(pulse>=80 and pulse<=120):
#             return Response({'message':'normal'})
#         elif(pulse<80):
#             return Response({'message':'low'})
#         else:
#             return Response({'message':'high'})



            
            
            




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






from rest_framework.views import APIView
from rest_framework.response import Response
from .models import agg_sc_schedule_screening
from .serializers import ScheduleDataGetSerializer
from datetime import date, timedelta
from django.utils import timezone

class ScheduleDataFilterAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Getting query parameters from the URL
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('class_id')
        department_id = request.query_params.get('department_id')
        disease_id = request.query_params.get('disease_id')
        date_filter = request.query_params.get('date_filter')  # New filter parameter
        source_name = request.query_params.get('source_name')

        # Adding filters to filter_params
        filter_params = {}

        if source_id is not None:
            filter_params['source_id'] = source_id
        if type_id is not None:
            filter_params['type_id'] = type_id
        if class_id is not None:
            filter_params['Class_id'] = class_id
        if department_id is not None:
            filter_params['department_id'] = department_id
        if disease_id is not None:
            filter_params['Disease_id'] = disease_id
        if source_name is not None:
            filter_params['source_name'] = source_name
           
            
        # Filtering the queryset based on the parameters
        queryset = agg_sc_schedule_screening.objects.filter(**filter_params)

        # Applying additional date filters
        if date_filter == 'today':
            today = date.today()
            queryset = queryset.filter(created_at=today)
        elif date_filter == 'month':
            first_day_of_month = date.today().replace(day=1)
            # Get the last day of the current month
            last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            queryset = queryset.filter(created_at__range=[first_day_of_month, last_day_of_month])
        elif date_filter == 'date':
            queryset = queryset.filter(created_at__lte=date.today())

        # Serializing the filtered data
        serializer = ScheduleDataGetSerializer(queryset, many=True)
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




class medical_event_infoPost(APIView):
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Extract data from the schedule record
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id

        # Check if the entry already exists
        existing_entry = agg_sc_medical_event_info.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            # Entry already exists, you may want to update it instead of creating a new one
            # Update the existing entry with the new data if needed
            existing_entry.symptoms_if_any = request.data.get('symptoms_if_any')
            existing_entry.Remark = request.data.get('Remark')
            existing_entry.transfer_o_hospital = request.data.get('transfer_o_hospital')
            # ... update other fields as needed
            existing_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'medical_event_pk_id': existing_entry.medical_event_pk_id,
                    'citizen_id': existing_entry.citizen_id,
                    'schedule_id': existing_entry.schedule_id,
                    'symptoms_if_any': existing_entry.symptoms_if_any,
                    'Remark': existing_entry.Remark,
                    'transfer_o_hospital': existing_entry.transfer_o_hospital,
                    # ... add other fields as needed
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Entry doesn't exist, create and save a new one
            citizen_medical_event_info = agg_sc_medical_event_info(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                symptoms_if_any=request.data.get('symptoms_if_any'),
                Remark=request.data.get('Remark'),
                transfer_o_hospital=request.data.get('transfer_o_hospital'),
                # ... add other fields as needed
            )

            try:
                # Save the new citizen medical event info record
                citizen_medical_event_info.full_clean()  # Run any model clean methods
                citizen_medical_event_info.save()

                # Update the citizen schedule record
                # citizen_schedule.closing_status = True
                # citizen_schedule.save()

                response_data = {
                    'message': 'Data sent successfully',
                    'posted_data': {
                        'medical_event_pk_id': citizen_medical_event_info.medical_event_pk_id,
                        'citizen_id': citizen_medical_event_info.citizen_id,
                        'schedule_id': citizen_medical_event_info.schedule_id,
                        'symptoms_if_any': citizen_medical_event_info.symptoms_if_any,
                        'Remark': citizen_medical_event_info.Remark,
                        'transfer_o_hospital': citizen_medical_event_info.transfer_o_hospital,
                        # ... add other fields as needed
                    }
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            

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
    

class ScheduleCountAPIView(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        citizen_id = request.GET.get('citizen_id')
        
        if not citizen_id:
            return Response({"error": "citizen_id is required"}, status=400)
        
        try:
            
            schedules = agg_sc_citizen_schedule.objects.filter(citizen_id=citizen_id).order_by('created_at')
            Citizen_info = agg_sc_add_new_citizens.objects.filter(citizen_id=citizen_id)
            serializer = CCCitizenDataGetSerializer(Citizen_info, many=True)
            
            
            schedule_data = [{'schedule_id': schedule.schedule_id} for schedule in schedules]

            
            schedule_count = schedules.count()
            
            
            schedule_count_sequence = list(range(1, schedule_count + 1))
            
            return Response({"Citizen_info": serializer.data, "schedule_count": schedule_count, "schedule_count_sequence": schedule_count_sequence,"schedules_id": schedule_data})
        
        except agg_sc_citizen_schedule.DoesNotExist:
            return Response({"error": "Schedule does not exist"}, status=404)


class CitizenInfoAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            citizen_id = self.kwargs.get('citizen_id')
            schedule_count = self.kwargs.get('schedule_count')

            psycho_info = agg_sc_citizen_pycho_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            psycho_serializer = Psyco_For_Healthcard(psycho_info, many=True) if psycho_info else None

            dental_info = agg_sc_citizen_dental_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            dental_serializer = Dental_For_Healthcard(dental_info, many=True) if dental_info else None

            vision_info = agg_sc_citizen_vision_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            vision_serializer = agg_sc_citizen_vision_info_Serializer(vision_info, many=True) if vision_info else None
            
            
            audit_info = agg_sc_citizen_audit_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            audit_serializer = AuditoryinfoHealthcard(audit_info, many=True) if audit_info else None
            
            immunization_info = agg_sc_citizen_immunization_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            immunization_serializer = CitizenimmunisationinfoHealthcard(immunization_info, many=True) if immunization_info else None
            
            vital_info = agg_sc_citizen_vital_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            vital_serializer = CitizenVitalinfoHealthcard(vital_info, many=True) if vital_info else None
            
            basic_info = agg_sc_basic_screening_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            basic_serializer = Healthcard_basic_screening(basic_info, many=True) if basic_info else None
            
            bmi_info = agg_sc_growth_monitoring_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            bmi_serializer = BMI_for_Healthcard(bmi_info, many=True) if basic_info else None
            
            medical_history_info = agg_sc_citizen_medical_history.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            medical_history_serializer = Medical_History_for_Healthcard(medical_history_info, many=True) if medical_history_info else None
            
            pft_info = agg_sc_pft.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            pft_serializer = PFT_for_Healthcard(pft_info, many=True) if pft_info else None
            
            family_info = agg_sc_citizen_family_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            family_serializer = Family_for_Healthcard(family_info, many=True) if family_info else None
            
            basic_info2 = agg_sc_basic_screening_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            basic_serializer2 = Healthcard_basic_screening2(basic_info2, many=True) if basic_info2 else None
            
            
            other_info = agg_sc_citizen_other_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            other_serializer = Other_info_for_Healthcard(other_info, many=True) if other_info else None

            response_data = {
                'psycho_info': psycho_serializer.data if psycho_serializer else None,
                'dental_info': dental_serializer.data if dental_serializer else None,
                'vision_info': vision_serializer.data if vision_serializer else None,
                'audit_info': audit_serializer.data if audit_serializer else None,
                'immunization_info': immunization_serializer.data if immunization_serializer else None,
                'vital_info': vital_serializer.data if vital_serializer else None,
                'basic_info': basic_serializer.data if basic_serializer else None,
                'bmi_info': bmi_serializer.data if bmi_serializer else None,
                'medical_history_info':medical_history_serializer.data if medical_history_serializer else None,
                'pft_info':pft_serializer.data if pft_serializer else None,
                'family_info':family_serializer.data if family_serializer else None,
                'basic_info2': basic_serializer2.data if basic_serializer2 else None,
                'other_info': other_serializer.data if other_serializer else None,

                     

            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Card_filter_APIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, type_id=None, source_id=None, class_id=None, schedule_count=None):
        try:
            filter_params = {}
            # Filter based on whether class_id is provided or not
            if type_id is not None:
                filter_params['citizen_pk_id__type'] = type_id
            if source_id is not None:
                filter_params['citizen_pk_id__source'] = source_id
            if class_id is not None:
                filter_params['citizen_pk_id__Class'] = class_id
            if schedule_count is not None:
                filter_params['schedule_count'] = schedule_count

            card = agg_sc_citizen_schedule.objects.filter(**filter_params)
            serializer = Card_Filter(card, many=True)

            return Response({'card_data': serializer.data})
        
        except Exception as e:
            # Handle the exception here
            error_message = str(e)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

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
            
            
            audit_info = agg_sc_citizen_audit_info.objects.filter(citizen_id=citizen_id, schedule_count=schedule_count)
            audit_serializer = AuditoryinfoHealthcard(audit_info, many=True) if audit_info else None
            
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
                'audit_info': audit_serializer.data if audit_serializer else None,
                'immunization_info': immunization_serializer.data if immunization_serializer else None,
                'vital_info': vital_serializer.data if vital_serializer else None,
                'basic_info': basic_serializer.data if basic_serializer else None,
                'bmi_info': bmi_serializer.data if bmi_serializer else None,
                'other_info': other_serializer.data if other_serializer else None,
              

                

            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from datetime import datetime, timedelta
from collections import OrderedDict
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

class CombinedAPI_Download(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    serializer_class = Dental_count_serializer

    serializer_class = Birth_Defect_Serializer
    def get(self, request, source_id, type_id, class_id=None):
        # Call each sub-API's logic and gather the results
        age_counts = self.get_age_counts(source_id, type_id, class_id)
        gender_counts = self.get_gender_counts(source_id, type_id, class_id)
        citizens_counts = self.get_citizens_counts(source_id, type_id, class_id)
        screening_schedule_counts = self.get_screening_schedule_counts(source_id, type_id, class_id)
        student_condition_counts = self.get_student_condition_counts(source_id, type_id, class_id)
        vision_counts = self.get_vision_counts(source_id, type_id, class_id)
        psyco_counts = self.get_psyco_counts(source_id, type_id, class_id)
        bmi_categories = self.get_bmi_categories(source_id, type_id, class_id)
        birth_defects_count = self.get_birth_defects_count(source_id, type_id, class_id)

        # Combine results into a single response
        combined_response = {
            'age_counts': age_counts,
            'gender_counts': gender_counts,
            'citizens_counts': citizens_counts,
            'screening_schedule_counts': screening_schedule_counts,
            'student_condition_counts': student_condition_counts,
            'vision_counts': vision_counts,
            'psyco_counts': psyco_counts,
            'bmi_categories': bmi_categories,
            'birth_defects_count': birth_defects_count,
        }

        return Response(combined_response)

    def get_age_counts(self, source_id, type_id, class_id=None):
        current_date = timezone.now()

        queryset = agg_sc_add_new_citizens.objects.filter(
            source=source_id,
            type=type_id
        )

        if type_id == '2':
            class_id = None  # Exclude class_id if type_id is '2'

        if class_id is not None:
            queryset = queryset.filter(Class=class_id)

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

        return age_counts

    def get_gender_counts(self, source_id, type_id, class_id=None):
        # Filter based on whether class_id is provided or not
        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id

        boys_count = agg_sc_add_new_citizens.objects.filter(**filter_params, gender=1).count()
        girls_count = agg_sc_add_new_citizens.objects.filter(**filter_params, gender=2).count()

        return {'boys_count': boys_count, 'girls_count': girls_count}

    def get_citizens_counts(self, source_id, type_id, class_id=None):
        current_year = datetime.now().year

        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id

        filter_params1 = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params1['citizen_pk_id__Class'] = class_id

        # Get counts month-wise for agg_sc_add_new_citizens
        citizen_counts = agg_sc_add_new_citizens.objects.filter(**filter_params) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('citizens_pk_id', distinct=True))

        # Get counts month-wise for agg_sc_schedule_screening
        screening_counts = agg_sc_schedule_screening.objects.filter(**filter_params) \
            .annotate(month=TruncMonth('from_date')) \
            .values('month') \
            .annotate(count=Count('schedule_screening_pk_id'))

        screening_done_counts = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('basic_screening_pk_id'))

        # Count records for each model
        count = agg_sc_add_new_citizens.objects.filter(**filter_params).count()
        count1 = agg_sc_schedule_screening.objects.filter(**filter_params).count()
        count2 = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True).count()

        # Transform the data to a dictionary format for month-wise counts
        citizen_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in citizen_counts}
        screening_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_counts}
        screening_done_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_done_counts}

        # Add missing months with null count
        all_months = [datetime.now().replace(month=i, day=1) for i in range(1, 13)]
        for month in all_months:
            month_str = month.strftime('%B %Y')
            citizen_counts_dict.setdefault(month_str, None)
            screening_counts_dict.setdefault(month_str, None)
            screening_done_dict.setdefault(month_str, None)

        # Sort the dictionaries by month
        citizen_counts_dict = OrderedDict(sorted(citizen_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
        screening_counts_dict = OrderedDict(sorted(screening_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
        screening_done_dict = OrderedDict(sorted(screening_done_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))

        # Return the sorted month-wise counts
        return {
            'citizen_counts_monthwise': citizen_counts_dict,
            'screening_counts_monthwise': screening_counts_dict,
            'total_screened_count_monthwise': screening_done_dict,
            'total_added_count': count,
            'total_schedule_count': count1,
            'total_screened_count': count2
        }

    def get_screening_schedule_counts(self, source_id, type_id, class_id=None):
        # Filter based on whether class_id is provided or not
        filter_params = {'source': source_id, 'type': type_id}
        if class_id is not None:
            filter_params['Class'] = class_id

        count = agg_sc_schedule_screening.objects.filter(**filter_params).count()

        # Serialize the count
        # serializer = Student_count_serializer(data={'student_total_count': count})

        # Check if the serialization is valid and return the response
        return {'screening_schedule_total_count': count}

    def get_student_condition_counts(self, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id

        # Fetch the queryset based on provided filter parameters
        queryset = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Good').count()
        queryset1 = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Bad').count()
        queryset2 = agg_sc_citizen_dental_info.objects.filter(**filter_params, dental_conditions='Fair').count()

        response_data = {
            'good_count': queryset,
            'fair_count': queryset2,
            'poor_count': queryset1,
        }
        return response_data

    def get_vision_counts(self, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id

        vision_with_glasses = agg_sc_citizen_vision_info.objects.filter(**filter_params, vision_with_glasses=1).count()
        vision_without_glasses = agg_sc_citizen_vision_info.objects.filter(**filter_params, vision_without_glasses=2).count()
        color_blindness = agg_sc_citizen_vision_info.objects.filter(**filter_params, color_blindness=1).count()

        return {'vision_with_glasses': vision_with_glasses, 'vision_without_glasses': vision_without_glasses, 'color_blindness': color_blindness}

    def get_psyco_counts(self, source_id, type_id, class_id=None):
        filter_params = {'citizen_pk_id__source': source_id, 'citizen_pk_id__type': type_id}
        if class_id is not None:
            filter_params['citizen_pk_id__Class'] = class_id

        diff_in_read = agg_sc_citizen_pycho_info.objects.filter(**filter_params, diff_in_read=2).count()
        diff_in_write = agg_sc_citizen_pycho_info.objects.filter(**filter_params, diff_in_write=2).count()
        hyper_reactive = agg_sc_citizen_pycho_info.objects.filter(**filter_params, hyper_reactive=2).count()
        aggressive = agg_sc_citizen_pycho_info.objects.filter(**filter_params, aggresive=2).count()

        return {'diff_in_read': diff_in_read, 'diff_in_write': diff_in_write, 'hyper_reactive': hyper_reactive, 'aggressive': aggressive}

    def get_bmi_categories(self, source_id, type_id, class_id=None):
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

        return response_data

    serializer_class = Birth_Defect_Serializer
    def get_birth_defects_count(self, source_id, type_id, class_id=None, *args, **kwargs):
        try:
            filter_params = {
                'citizen_pk_id__source': source_id,
                'citizen_pk_id__type': type_id
            }
            if class_id is not None:
                filter_params['citizen_pk_id__Class'] = class_id

            birth_defects_count = agg_sc_basic_screening_info.objects.filter(**filter_params).exclude(birth_defects__contains=["NAD"]).count()

            # Return a dictionary instead of a Response object
            return {'birth_defects_count': birth_defects_count}

        except ValueError:
            return {'error': 'Invalid input'}

        except agg_sc_basic_screening_info.DoesNotExist:
            raise NotFound("Data not found")

        except Exception:
            return {'error': 'Internal server error'}




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
            
    


from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import agg_sc_citizen_schedule, agg_sc_citizen_medical_history, agg_sc_add_new_citizens, agg_com_colleague

class CitizenmedicalhistoryInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count
        
        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_entry = agg_sc_citizen_medical_history.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            existing_entry.medical_history = request.data.get('medical_history')
            existing_entry.past_operative_history = request.data.get('past_operative_history')
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            
            existing_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'medical_history': existing_entry.medical_history,
                    'past_operative_history': existing_entry.past_operative_history,
                    'form_submit': existing_entry.form_submit,
                    'added_by': existing_entry.added_by.id if existing_entry.added_by else None,
                    'modify_by': existing_entry.modify_by.id,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            new_citizen_medical_history = agg_sc_citizen_medical_history(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                medical_history=request.data.get('medical_history'),
                past_operative_history=request.data.get('past_operative_history'),
                form_submit=request.data.get('form_submit'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
            )

            new_citizen_medical_history.save()
            

            response_data = {
                'message': 'Data sent successfully',
                'posted_data': {
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'medical_history': new_citizen_medical_history.medical_history,
                    'past_operative_history': new_citizen_medical_history.past_operative_history,
                    'form_submit': new_citizen_medical_history.form_submit,
                    'added_by': added_by_instance.pk,
                    'modify_by': modify_by_instance.pk,
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)



    
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

   
    


class CitizeninvestigationInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count

        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        existing_entry = agg_sc_investigation.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            if 'investigation_report' in request.data:
                existing_entry.investigation_report = request.data.get('investigation_report')
            if 'urine_report' in request.data:
                existing_entry.urine_report = request.data.get('urine_report')
            if 'ecg_report' in request.data:
                existing_entry.ecg_report = request.data.get('ecg_report')
            if 'x_ray_report' in request.data:
                existing_entry.x_ray_report = request.data.get('x_ray_report')
            if 'form_submit' in request.data:
                existing_entry.form_submit = request.data.get('form_submit')

            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance

            existing_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'investigation_report_url': existing_entry.investigation_report.url if existing_entry.investigation_report else None,
                    'urine_report_url': existing_entry.urine_report.url if existing_entry.urine_report else None,
                    'ecg_report_url': existing_entry.ecg_report.url if existing_entry.ecg_report else None,
                    'x_ray_report_url': existing_entry.x_ray_report.url if existing_entry.x_ray_report else None,
                    'form_submit': existing_entry.form_submit,
                    'added_by': existing_entry.added_by.id if existing_entry.added_by else None,
                    'modify_by': existing_entry.modify_by.id,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            new_agg_sc_investigation = agg_sc_investigation(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                investigation_report=request.data.get('investigation_report'),
                urine_report=request.data.get('urine_report'),
                ecg_report=request.data.get('ecg_report'),
                x_ray_report=request.data.get('x_ray_report'),
                form_submit=request.data.get('form_submit'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
            )

            new_agg_sc_investigation.save()

            response_data = {
                'message': 'Data sent successfully',
                'posted_data': {
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'investigation_report': new_agg_sc_investigation.investigation_report.name if new_agg_sc_investigation.investigation_report else None,
                    'urine_report': new_agg_sc_investigation.urine_report.name if new_agg_sc_investigation.urine_report else None,
                    'ecg_report': new_agg_sc_investigation.ecg_report.name if new_agg_sc_investigation.ecg_report else None,
                    'x_ray_report': new_agg_sc_investigation.x_ray_report.name if new_agg_sc_investigation.x_ray_report else None,
                    'form_submit': new_agg_sc_investigation.form_submit,
                    'added_by': added_by_instance.pk,
                    'modify_by': modify_by_instance.pk,
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)



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



class agg_sc_get_investigation_info_ViewSet1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        print(f'schedule_pk: {schedule_pk}')
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
            print(f'citizen_schedule: {citizen_schedule}')
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        investigation_info_entries = agg_sc_investigation.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = citizen_investigation_InfoSerializer(investigation_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    
class agg_sc_get_medical_history_info_ViewSet1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        print(f'schedule_pk: {schedule_pk}')
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
            print(f'citizen_schedule: {citizen_schedule}')
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        vital_info_entries = agg_sc_citizen_medical_history.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = citizen_medicalhistory_GET_InfoSerializer(vital_info_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


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
        

class CitizenpftInfoPost(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            schedule_pk = kwargs.get('schedule_pk')
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        citizen_id = citizen_schedule.citizen_id
        schedule_id = citizen_schedule.schedule_id
        schedule_count = citizen_schedule.schedule_count

        citizen_pk_id_value = request.data.get('citizen_pk_id')
        added_by_id = request.data.get('added_by')
        modify_by_id = request.data.get('modify_by')

        try:
            citizen_pk_instance = agg_sc_add_new_citizens.objects.get(pk=citizen_pk_id_value)
        except agg_sc_add_new_citizens.DoesNotExist:
            return Response({'detail': f'Citizen with pk_id {citizen_pk_id_value} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            added_by_instance = agg_com_colleague.objects.get(pk=added_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {added_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            modify_by_instance = agg_com_colleague.objects.get(pk=modify_by_id)
        except agg_com_colleague.DoesNotExist:
            return Response({'detail': f'Colleague with pk {modify_by_id} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if an entry already exists for the citizen and schedule
        existing_entry = agg_sc_pft.objects.filter(
            citizen_id=citizen_id,
            schedule_id=schedule_id
        ).first()

        if existing_entry:
            # Update existing entry
            existing_entry.pft_reading = request.data.get('pft_reading')
            existing_entry.observations = request.data.get('observations')
            existing_entry.form_submit = request.data.get('form_submit')
            existing_entry.modify_by = modify_by_instance
            if not existing_entry.added_by:
                existing_entry.added_by = added_by_instance
            
            existing_entry.save()

            response_data = {
                'message': 'Data updated successfully',
                'updated_data': {
                    'pft_reading': existing_entry.pft_reading,
                    'observations': existing_entry.observations,
                    'form_submit': existing_entry.form_submit,
                    'added_by': existing_entry.added_by.id if existing_entry.added_by else None,
                    'modify_by': existing_entry.modify_by.id,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            # Create a new entry
            agg_sc_pft_info = agg_sc_pft.objects.create(
                citizen_id=citizen_id,
                schedule_id=schedule_id,
                schedule_count=schedule_count,
                citizen_pk_id=citizen_pk_instance,
                pft_reading=request.data.get('pft_reading'),
                observations=request.data.get('observations'),
                form_submit=request.data.get('form_submit'),
                added_by=added_by_instance,
                modify_by=modify_by_instance,
            )

            response_data = {
                'message': 'Data sent successfully',
                'posted_data': {
                    'citizen_pk_id': citizen_pk_instance.pk,
                    'pft_reading': agg_sc_pft_info.pft_reading,
                    'observations': agg_sc_pft_info.observations,
                    'form_submit': agg_sc_pft_info.form_submit,
                    'added_by': added_by_instance.pk,
                    'modify_by': modify_by_instance.pk,
                }
            }

            return Response(response_data, status=status.HTTP_201_CREATED)






class agg_sc_get_pft_info_ViewSet1(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, schedule_pk, *args, **kwargs):
        print(f'schedule_pk: {schedule_pk}')
        try:
            citizen_schedule = get_object_or_404(agg_sc_citizen_schedule, pk_id=schedule_pk)
            print(f'citizen_schedule: {citizen_schedule}')
        except Http404:
            return Response({'detail': f'Citizen schedule with pk_id {schedule_pk} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        pft_info = agg_sc_pft.objects.filter(
            citizen_id=citizen_schedule.citizen_id,
            schedule_id=citizen_schedule.schedule_id
        )

        serializer = citizen_pft_InfoSerializer(pft_info, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

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




# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.db.models import Count
# from django.db.models.functions import TruncMonth
# from django.http import JsonResponse
# from collections import OrderedDict
# from datetime import datetime
# from .models import agg_sc_add_new_citizens, agg_sc_schedule_screening, agg_sc_basic_screening_info
# from rest_framework import status

# class NEWCitizensCountAPIView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         current_year = datetime.now().year

#         # Initialize filter parameters
#         filter_params = {}
#         filter_params1 = {}

#         # Extract optional query parameters
#         source_id = request.query_params.get('source_id')
#         type_id = request.query_params.get('type_id')
#         class_id = request.query_params.get('class_id')
#         source_name_id = request.query_params.get('source_name_id')

#         if source_id is not None:
#             filter_params['source'] = source_id
#             filter_params1['citizen_pk_id__source'] = source_id
#         if type_id is not None:
#             filter_params['type'] = type_id
#             filter_params1['citizen_pk_id__type'] = type_id
#         if class_id is not None:
#             filter_params['Class'] = class_id
#             filter_params1['citizen_pk_id__Class'] = class_id
#         if source_name_id is not None:
#             filter_params['source_name'] = source_name_id
#             filter_params1['citizen_pk_id__source_name'] = source_name_id

#         # Extract additional filters from query parameters
#         for param, value in request.query_params.items():
#             if param not in ['source_id', 'type_id', 'class_id','source_name_id']:
#                 filter_params[param] = value
#                 filter_params1[param] = value

#         # Get counts month-wise for agg_sc_add_new_citizens
#         citizen_counts = agg_sc_add_new_citizens.objects.filter(**filter_params, is_deleted=False) \
#             .annotate(month=TruncMonth('created_date')) \
#             .values('month') \
#             .annotate(count=Count('citizens_pk_id', distinct=True))

#         # Get counts month-wise for agg_sc_schedule_screening
#         screening_counts = agg_sc_schedule_screening.objects.filter(**filter_params) \
#             .annotate(month=TruncMonth('from_date')) \
#             .values('month') \
#             .annotate(count=Count('schedule_screening_pk_id'))

#         screening_done_counts = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True) \
#             .annotate(month=TruncMonth('created_date')) \
#             .values('month') \
#             .annotate(count=Count('basic_screening_pk_id'))

#         # Count records for each model
#         count = agg_sc_add_new_citizens.objects.filter(**filter_params, is_deleted=False).count()
#         count1 = agg_sc_schedule_screening.objects.filter(**filter_params).count()
#         count2 = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True).count()

#         # Transform the data to a dictionary format for month-wise counts
#         citizen_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in citizen_counts}
#         screening_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_counts}
#         screening_done_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_done_counts}

#         # Add missing months with null count
#         all_months = [datetime.now().replace(month=i, day=1) for i in range(1, 13)]
#         for month in all_months:
#             month_str = month.strftime('%B %Y')
#             citizen_counts_dict.setdefault(month_str, None)
#             screening_counts_dict.setdefault(month_str, None)
#             screening_done_dict.setdefault(month_str, None)

#         # Sort the dictionaries by month
#         citizen_counts_dict = OrderedDict(sorted(citizen_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
#         screening_counts_dict = OrderedDict(sorted(screening_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
#         screening_done_dict = OrderedDict(sorted(screening_done_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))

#         # Calculate total remaining employees
#         total_remaining = count - count2

#         # Return the sorted month-wise counts and total remaining employees
#         return JsonResponse({
#             'citizen_counts_monthwise': citizen_counts_dict,
#             'screening_counts_monthwise': screening_counts_dict,
#             'total_screened_count_monthwise': screening_done_dict,
#             'total_added_count': count,
#             'total_screened_count': count2,
#             'total_remaining_screening_employees': total_remaining
#         })


from collections import OrderedDict
from datetime import datetime
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from rest_framework.views import APIView

class NEWCitizensCountAPIView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_year = datetime.now().year

        # Initialize filter parameters
        filter_params = {}
        filter_params1 = {}

        # Extract optional query parameters
        source_id = request.query_params.get('source_id')
        type_id = request.query_params.get('type_id')
        class_id = request.query_params.get('Class_id')
        source_name_id = request.query_params.get('source_name_id')
        schedule_id = request.query_params.get('schedule_id')
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')

        if source_id is not None:
            filter_params['source'] = source_id
            filter_params1['citizen_pk_id__source'] = source_id
        if type_id is not None:
            filter_params['type'] = type_id
            filter_params1['citizen_pk_id__type'] = type_id
        if class_id is not None:
            filter_params['Class'] = class_id
            filter_params1['citizen_pk_id__Class'] = class_id
        if source_name_id is not None:
            filter_params['source_name'] = source_name_id
            filter_params1['citizen_pk_id__source_name'] = source_name_id
        if schedule_id is not None:
            filter_params1['schedule_id'] = schedule_id
        if district is not None:
            filter_params['district'] = district
            filter_params1['citizen_pk_id__district'] = district
        if tehsil is not None:
            filter_params['tehsil'] = tehsil
            filter_params1['citizen_pk_id__tehsil'] = tehsil
        if location is not None:
            # filter_params['location'] = location
            filter_params1['citizen_pk_id__location'] = location

        # Extract additional filters from query parameters
        for param, value in request.query_params.items():
            if param not in ['source_id', 'type_id', 'Class_id', 'source_name_id','schedule_id','district','tehsil','location']:
                filter_params[param] = value
                filter_params1[param] = value

        # Get counts month-wise for agg_sc_add_new_citizens
        citizen_counts = agg_sc_add_new_citizens.objects.filter(**filter_params, is_deleted=False) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('citizens_pk_id', distinct=True))
            
            
        
        screening_queryset = agg_sc_schedule_screening.objects.filter(
            **{k: v for k, v in filter_params.items() if k != 'location'}
        )

        if location is not None:
            screening_queryset = screening_queryset.filter(
                Q(location1=location) |
                Q(location2=location) |
                Q(location3=location) |
                Q(location4=location)
            )
        
        
        

        # Get counts month-wise for agg_sc_schedule_screening
        screening_counts = agg_sc_schedule_screening.objects.filter(**filter_params) \
            .annotate(month=TruncMonth('from_date')) \
            .values('month') \
            .annotate(count=Count('schedule_screening_pk_id'))
        
        

        # Get counts month-wise for agg_sc_basic_screening_info
        screening_done_counts = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('basic_screening_pk_id'))

        # Count records for each model
        count = agg_sc_add_new_citizens.objects.filter(**filter_params, is_deleted=False).count()
        count1 = agg_sc_schedule_screening.objects.filter(**filter_params).count()
        count2 = agg_sc_basic_screening_info.objects.filter(**filter_params1, form_submit=True).count()

        # Apply additional filter for total_screened_count based on the citizen_pk_id
        additional_filter_params = {**filter_params1}
        if source_id:
            additional_filter_params['citizen_pk_id__source'] = source_id
        if source_name_id:
            additional_filter_params['citizen_pk_id__source_name'] = source_name_id
        if type_id:
            additional_filter_params['citizen_pk_id__type_id'] = type_id
        if schedule_id:
            additional_filter_params['schedule_id'] = schedule_id
        if class_id:
            additional_filter_params['citizen_pk_id__Class'] = class_id
        if district:
            additional_filter_params['citizen_pk_id__district'] = district
        if tehsil:
            additional_filter_params['citizen_pk_id__tehsil'] = tehsil
        if location:
            additional_filter_params['citizen_pk_id__location'] = location
        

        count2_filtered = agg_sc_basic_screening_info.objects.filter(
            **additional_filter_params,
            form_submit=True
        ).count()

        # Transform the data to a dictionary format for month-wise counts
        citizen_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in citizen_counts}
        screening_counts_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_counts}
        screening_done_dict = {entry['month'].strftime('%B %Y'): entry['count'] for entry in screening_done_counts}

        # Add missing months with null count
        all_months = [datetime.now().replace(month=i, day=1) for i in range(1, 13)]
        for month in all_months:
            month_str = month.strftime('%B %Y')
            citizen_counts_dict.setdefault(month_str, None)
            screening_counts_dict.setdefault(month_str, None)
            screening_done_dict.setdefault(month_str, None)

        # Sort the dictionaries by month
        citizen_counts_dict = OrderedDict(sorted(citizen_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
        screening_counts_dict = OrderedDict(sorted(screening_counts_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))
        screening_done_dict = OrderedDict(sorted(screening_done_dict.items(), key=lambda x: datetime.strptime(x[0], '%B %Y')))

        # Calculate total remaining employees
        total_remaining = count - count2

        # Return the sorted month-wise counts and total remaining employees
        return JsonResponse({
            'citizen_counts_monthwise': citizen_counts_dict,
            'screening_counts_monthwise': screening_counts_dict,
            'total_screened_count_monthwise': screening_done_dict,
            'total_added_count': count,
            'total_screened_count': count2_filtered,
            'total_remaining_screening_employees': total_remaining
        })


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
    
    
    



class gender_count_viewset(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        filter_params = {}
        schedule_id = request.query_params.get('schedule_id')
        source_id = request.query_params.get('source_id')
        source_name_id = request.query_params.get('source_name_id')
        type_id = request.query_params.get('type_id')
        Class_id = request.query_params.get('Class_id') 
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')

        if schedule_id:
            filter_params['schedule_id'] = schedule_id

        snippet = agg_sc_citizen_schedule.objects.filter(**filter_params)

        citizen_ids = snippet.values_list('citizen_pk_id_id', flat=True)

        citizen_filter = {'citizens_pk_id__in': citizen_ids}
        if source_id:
            citizen_filter['source_id'] = source_id
        if source_name_id:
            citizen_filter['source_name_id'] = source_name_id
        if type_id:
            citizen_filter['type_id'] = type_id
        if Class_id:
            citizen_filter['Class_id'] = Class_id  
        if district:
            citizen_filter['district'] = district
        if tehsil:
            citizen_filter['tehsil'] = tehsil
        if location:
            citizen_filter['location'] = location

        gender_counts = agg_sc_add_new_citizens.objects.filter(
            **citizen_filter
        ).values('gender_id').annotate(count=Count('gender_id'))

        male_count = 0
        female_count = 0


        for item in gender_counts:
            if item['gender_id'] == 1:
                male_count = item['count']
            elif item['gender_id'] == 2:
                female_count = item['count']

        return Response({
            'Male': male_count,
            'Female': female_count,
        }, status=status.HTTP_200_OK)



from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Age_Count_Get_viewset(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        filter_params = {}
        type_id = request.query_params.get('type_id')
        schedule_id = request.query_params.get('schedule_id')
        source_id = request.query_params.get('source_id')
        source_name_id = request.query_params.get('source_name_id')
        class_id = request.query_params.get('Class_id')  
        district = request.query_params.get('district')
        tehsil = request.query_params.get('tehsil')
        location = request.query_params.get('location')
        

        if schedule_id:
            filter_params['schedule_id'] = schedule_id

        try:
            if type_id:
                type_id = int(type_id)
            if source_id:
                source_id = int(source_id)
            if source_name_id:
                source_name_id = int(source_name_id)
            if class_id:
                class_id = int(class_id)
            if district:
                district = int(district)
            if tehsil:
                tehsil = int(tehsil)
            if location:
                location = int(location)
        except ValueError:
            return Response({"error": "Invalid parameter format"}, status=status.HTTP_400_BAD_REQUEST)
        
        citizen_ids_query = agg_sc_add_new_citizens.objects.all()
        if type_id:
            citizen_ids_query = citizen_ids_query.filter(type_id=type_id)
        if source_id:
            citizen_ids_query = citizen_ids_query.filter(source_id=source_id)
        if source_name_id:
            citizen_ids_query = citizen_ids_query.filter(source_name_id=source_name_id)
        if class_id:
            citizen_ids_query = citizen_ids_query.filter(Class_id=class_id)  
        if district:
            citizen_ids_query = citizen_ids_query.filter(district=district)
        if tehsil:
            citizen_ids_query = citizen_ids_query.filter(tehsil=tehsil)
        if location:
            citizen_ids_query = citizen_ids_query.filter(location=location)
            
        citizen_ids = citizen_ids_query.values_list('citizens_pk_id', flat=True)
        snippet = agg_sc_citizen_schedule.objects.filter(
            citizen_pk_id__in=citizen_ids,
            **filter_params
        )

        serializers = Age_Count_Serializer(snippet, many=True)
        data = serializers.data

        if source_id == 3:
            age_ranges = {
                '18-30 years': 0,
                '31-50 years': 0,
                '51-59 years': 0,
                '60-120 years': 0
            }
        else:
            age_ranges = {
                '5-7 years': 0,
                '7-9 years': 0,
                '9-11 years': 0,
                '11-13 years': 0,
                '13-15 years': 0,
                '15-17 years': 0
            }

        current_date = datetime.now().date()

        for item in data:
            dob = item.get('dob')
            if dob:
                if isinstance(dob, str):
                    dob = datetime.strptime(dob, '%Y-%m-%d').date()
                elif isinstance(dob, datetime):  
                    dob = dob.date()

                age = (current_date - dob).days // 365  
                
                if source_id == 5:
                    if 18 <= age <= 30:
                        age_ranges['18-30 years'] += 1
                    elif 31 <= age <= 50:
                        age_ranges['31-50 years'] += 1
                    elif 51 <= age <= 59:
                        age_ranges['51-59 years'] += 1
                    elif 60 <= age <= 120:
                        age_ranges['60-120 years'] += 1
                else:
                    if 5 <= age < 7:
                        age_ranges['5-7 years'] += 1
                    elif 7 <= age < 9:
                        age_ranges['7-9 years'] += 1
                    elif 9 <= age < 11:
                        age_ranges['9-11 years'] += 1
                    elif 11 <= age < 13:
                        age_ranges['11-13 years'] += 1
                    elif 13 <= age < 15:
                        age_ranges['13-15 years'] += 1
                    elif 15 <= age < 17:
                        age_ranges['15-17 years'] += 1

        return Response(age_ranges, status=status.HTTP_200_OK)
    
    
class BMI_Count_GET_Api_Viewset(APIView):
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
        
        if schedule_id is not None:
            snippets = agg_sc_citizen_schedule.objects.filter(schedule_id=schedule_id)
        else:
            snippets = agg_sc_citizen_schedule.objects.all()

        if any([type_id, source_id, source_name_id, class_id, district, tehsil, location]):
            snippets = snippets.filter(
                citizen_pk_id__in=agg_sc_add_new_citizens.objects.filter(
                    **{k: v for k, v in {
                        'type_id': type_id,
                        'source_id': source_id,
                        'source_name_id': source_name_id,
                        'Class_id': class_id  
                    }.items() if v is not None}
                ).values_list('citizens_pk_id', flat=True)
            )

        serializers = BMI_Count_Serializer(snippets, many=True)


        underweight_count = 0
        normal_count = 0
        overweight_count = 0
        obese_count = 0

        for data in serializers.data:
            bmi_value = data.get('bmi')
            if bmi_value is not None and isinstance(bmi_value, (float, int)):
                if bmi_value < 18.5:
                    underweight_count += 1
                elif 18.5 <= bmi_value < 25:
                    normal_count += 1
                elif 25 <= bmi_value < 30:
                    overweight_count += 1
                else:
                    obese_count += 1

        response_data = {
            'underweight': underweight_count,
            'normal': normal_count,
            'overweight': overweight_count,
            'obese': obese_count
        }

        return Response(response_data, status=status.HTTP_200_OK)










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


class GET_Schedule_Screening_List_View(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        source_id = request.query_params.get('source_id')
        source_name_id = request.query_params.get('source_name_id')
        schedule_id = request.query_params.get('schedule_id')

        schedule_screenings = agg_sc_schedule_screening.objects.all()
        
        if source_id:
            schedule_screenings = schedule_screenings.filter(source_id=source_id)
        if source_name_id:
            schedule_screenings = schedule_screenings.filter(source_name_id=source_name_id)
        if schedule_id:
            schedule_screenings = schedule_screenings.filter(schedule_id=schedule_id)

        serializer = ScreeningListSerializer(schedule_screenings, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class GET_Schedule_Screening_sub_vital_View(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        source_id = request.GET.get('source')
        source_name_id = request.GET.get('source_name')
        schedule_id = request.GET.get('schedule_id')

        schedule_screenings = agg_sc_schedule_screening.objects.all()
        
        if source_id:
            schedule_screenings = schedule_screenings.filter(source_id=source_id)
        if source_name_id:
            schedule_screenings = schedule_screenings.filter(source_name_id=source_name_id)
        if schedule_id:
            schedule_screenings = schedule_screenings.filter(schedule_id=schedule_id)

        serializer = Screening_Sub_Vital_Serializer(schedule_screenings, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    



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
# import genai
import google.generativeai as genai
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
        
        
class Schedule_list_APIView(APIView):
    def get(self, request):
        queryset = agg_sc_schedule_screening.objects.filter(is_deleted=False)
        
        district = request.query_params.get("district")
        tehsil = request.query_params.get("tehsil")
        source_name = request.query_params.get("source_name")

        if district:
            queryset = queryset.filter(district_id=district) 
        if tehsil:
            queryset = queryset.filter(tehsil_id=tehsil)  
        if source_name:
            queryset = queryset.filter(source_name_id=source_name)  
            
        serializers = Schedule_list_Serializer(queryset, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)





class CitizenScheduleCreateAPIView(APIView):
    def post(self, request):
        data = request.data.copy()

        citizen_id = data.get("citizen_id")
        if not citizen_id:
            return Response(
                {"error": "citizen_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Count existing records for this citizen
        existing_count = agg_sc_citizen_schedule.objects.filter(
            citizen_id=citizen_id
        ).count()

        next_count = existing_count + 1  
        data["schedule_count"] = next_count

        serializer = CitizenScheduleSerializer(data=data)
        if serializer.is_valid():
            obj = serializer.save(schedule_count=next_count)
            return Response(
                {
                    "message": "Citizen schedule created successfully",
                    "data": CitizenScheduleSerializer(obj).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




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
    


class TotalDriverReg_Dashboard_API(APIView):
    def get(self, request):
        try:
            total_driver_screened = 0
            total_driver_not_screened = 0

            # total_drivers = Citizen.objects.filter(category=1, is_deleted=False).order_by('citizens_pk_id')
            # total_others = Citizen.objects.filter(category=2, is_deleted=False).order_by('citizens_pk_id')

            citizens = Citizen.objects.filter(is_deleted=False).order_by('citizens_pk_id')

            total_drivers = citizens.filter(category=1)
            total_others = citizens.filter(category=2)

            referral_count = follow_up.objects.filter(citizen_pk_id__in=citizens.values_list('citizens_pk_id', flat=True),is_deleted=False).count()
            print("Total Referral Count:", referral_count)
            
            for driver in total_drivers:
                citizen_id = driver.citizens_pk_id

                # List of all querysets to check
                tables = [
                    basic_info,
                    emergency_info,
                    growth_monitoring_info,
                    vital_info,
                    genral_examination,
                    systemic_exam,
                    female_screening,
                    disability_screening,
                    birth_defect,
                    childhood_diseases,
                    deficiencies,
                    skin_conditions,
                    diagnosis,
                    check_box_if_normal,
                    treatement,
                    auditory_info,
                    vision_info,
                    medical_history_info,
                    pft_info,
                    dental_info,
                    immunisation_info,
                    investigation_info,
                ]

                all_have_records = True  # assume all have records initially

                for model in tables:
                    count = model.objects.filter(citizen_pk_id=citizen_id, form_submit=False).count()
                    # print(f"{model.__name__} count:", count)
                    if count == 0:
                        all_have_records = False
                        break  # no need to check further if any is missing

                if all_have_records:
                    total_driver_screened += 1
                    # print(f"✅ Driver {citizen_id} counted as screened")
                else:
                    total_driver_not_screened += 1
                #     print(f"❌ Driver {citizen_id} not screened (one or more empty tables)")

            
            driver_data = {
                "Total_Drivers_Registered": total_drivers.count(),
                "Total_Drivers_Added": total_drivers.count(),
                "Total_Others_Added": total_others.count(),
                "Total_Referrals_Made": referral_count,
                "Total_Drivers_Screened": total_driver_screened,
                "Drivers_Pending_Screening": total_driver_not_screened,
            }
            return Response(driver_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        







class Health_Score_API(APIView):

    def get(self, request):
        try:
            # Define custom order
            ordered_categories = [
                'Underweight',
                'Normal',
                'Overweight',
                'Obese (Class I)',
                'Obese (Class II & III)',
            ]

            # Total valid records
            total_records = growth_monitoring_info.objects.filter(is_deleted=False).count()

            # Group by category
            health_scores = (
                growth_monitoring_info.objects
                .filter(is_deleted=False, weight_for_height__in=ordered_categories)
                .values('weight_for_height')
                .annotate(count=Count('growth_pk_id'))
            )

            # Convert to dict for quick lookup
            category_count_map = {item['weight_for_height']: item['count'] for item in health_scores}

            # Prepare ordered list
            health_score_arr = []
            for category in ordered_categories:
                count = category_count_map.get(category, 0)
                percentage = (count / total_records * 100) if total_records > 0 else 0

                health_score_arr.append({
                    "Category": category,
                    "Count": count,
                    "Percentage": int(round(percentage, 2))
                })

            return Response({"health_score_count": health_score_arr}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class BMI_Vitals_dashboard_API(APIView):
    def get(self, request):
        try:
            citizens = Citizen.objects.filter(is_deleted=False).order_by('citizens_pk_id')
            print("Total Citizens Fetched:", citizens.count())

            bmi_count = growth_monitoring_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total BMI Records Fetched:", bmi_count)

            vital_count = vital_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Vitals Records Fetched:", vital_count)

            auditory_count = auditory_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Auditory Records Fetched:", auditory_count)

            dental_count = dental_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Dental Records Fetched:", dental_count)

            vital_info_count = vision_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Vision Records Fetched:", vital_info_count)

            medical_history_count = medical_history_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Medical History Records Fetched:", medical_history_count)

            investigation_info_count = investigation_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Investigation Records Fetched:", investigation_info_count)

            pft_info_count = pft_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total PFT Records Fetched:", pft_info_count)

            immunisation_info_count = immunisation_info.objects.filter(citizen_pk_id__in=citizens, is_deleted=False).count()
            print("Total Immunisation Records Fetched:", immunisation_info_count)

            count_obj = {
                "total_citizen_count": citizens.count(),
                "bmi_count": bmi_count,
                "vital_count": vital_count,
                "auditory_count": auditory_count,
                "dental_count": dental_count,
                "vision_count": vital_info_count,
                "medical_history_count": medical_history_count,
                "investigation_info_count": investigation_info_count,
                "pft_info_count": pft_info_count,
                "immunisation_info_count": immunisation_info_count,
            }

            return Response(count_obj, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
from datetime import timedelta
from django.shortcuts import get_object_or_404

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
                        registration_instance = Workshop.objects.get(agg_com_colleague=user)
                        registration_serializer = Workshop_Serializer(registration_instance)
                        registration_details = registration_serializer.data
                    except Workshop.DoesNotExist:
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




class State_Get_Api(APIView):
    def get(self,request):
        state = agg_sc_state.objects.all().order_by('state_name')
        serializers = agg_sc_state_info_Serializer(state,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)


class District_Get_Api(APIView):
    def get(self,request,state_name):
        District = agg_sc_district.objects.filter(state_name=state_name).order_by('dist_name')
        serializers = agg_sc_district_serializer(District,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK) 

class Tehsil_Get_Api(APIView):
    def get(self,request,dist_name):
        Tehsil = agg_sc_tahsil.objects.filter(dist_name=dist_name).order_by('tahsil_name')
        serializers = agg_sc_tahsil_serializer(Tehsil,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK) 

        



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
            snippets = followup_save.objects.filter(citizen_id=citizen_id, is_deleted=False)
        except followup_save.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = followup_save_info_Serializer(snippets, many=True)
        return Response(serializer.data) 


class follow_up_citizen_info2(APIView):
    def get(self, request, citizen_id, screening_citizen_id):
        try:
            snippets = followup_save.objects.filter(citizen_id=citizen_id,screening_citizen_id=screening_citizen_id, is_deleted=False)
        except followup_save.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = followup_save_info_Serializer(snippets, many=True)
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
def bad_habbits_get_info_ViewSet1(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = agg_sc_bad_habbits.objects.all()
        serializer = citizen_bad_habbits_InfoSerializer(snippets, many=True)
        return Response(serializer.data)


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
        

class GET_Screening_List_View(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        snippet = agg_screening_list.objects.all()
        serializers = Screening_List_Serializer(snippet,many=True)
        return Response(serializers.data,status=status.HTTP_200_OK)

class Screening_sub_list_Viewset(APIView):
    # renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated]
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

        follow_up_obj = get_object_or_404(follow_up, follow_up_pk_id=follow_up_pk_id)

        follow_up_status_id = request.data.get("follow_up")
        if follow_up_status_id is not None:
            try:
                follow_up_status_id = int(follow_up_status_id)
            except:
                return Response({"error": "Invalid follow_up value"}, status=400)

            follow_up_obj.follow_up = follow_up_status_id
            follow_up_obj.save()

        followup_count = followup_save.objects.filter(
            citizen_id = follow_up_obj.citizen_id,
            screening_citizen_id = follow_up_obj.screening_citizen_id
        ).count()

        serializer = followup_save_info_Serializer(data=request.data)

        if serializer.is_valid():

            serializer.validated_data["citizen_id"] = follow_up_obj.citizen_id
            serializer.validated_data["screening_citizen_id"] = follow_up_obj.screening_citizen_id
            serializer.validated_data["followup_count"] = followup_count + 1

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
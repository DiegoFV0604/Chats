from django.contrib.auth import authenticate, login
from django.db import models
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import json

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if not email or not username or not password:
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        try:
            # Verificar si el nombre de usuario o el correo ya existen
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({'error': 'El nombre de usuario ya existe'}, status=400)
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'El correo electrónico ya está registrado'}, status=400)

            # Crear el usuario
            user = CustomUser.objects.create_user(
                email=email,
                username=username,
                password=password
            )
            user.save()

            return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Por favor, ingresa tanto el nombre de usuario como la contraseña'}, status=400)

        # Autenticar al usuario
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)

            # Crear el token JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Devolver el token JWT y el email en la respuesta
            return JsonResponse({
                'message': 'Login exitoso',
                'token': access_token,
                'email': user.email,  # Asegúrate de que el usuario tenga un campo email
                'refresh_token': str(refresh)
            }, status=200)
        else:
            return JsonResponse({'error': 'Credenciales incorrectas'}, status=401)

    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def get_users(request):
    if request.method == 'GET':
        users = CustomUser.objects.exclude(username='')  # Cambia aquí para excluir el usuario logueado
        user_data = [{'id': user.id, 'username': user.username} for user in users]
        return JsonResponse(user_data, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser  # Asegúrate de importar tu modelo

@csrf_exempt
def get_profile(request, user_id):
    if request.method == 'GET':
        try:
            user = CustomUser.objects.get(id=user_id)
            user_data = {
                'username': user.username,
                'email': user.email,
            }
            return JsonResponse(user_data)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    return JsonResponse({'error': 'Método no permitido'}, status=405)



@api_view(['GET'])
def get_messages(request, recipient_username):
    if not request.user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=403)

    try:
        recipient = CustomUser.objects.get(username=recipient_username)
        messages = Message.objects.filter(
            (models.Q(sender=request.user) & models.Q(recipient=recipient)) |
            (models.Q(sender=recipient) & models.Q(recipient=request.user))
        ).order_by('timestamp')

        # Formatear los mensajes en una lista de diccionarios
        messages_data = [
            {
                'sender': message.sender.username,
                'content': message.content,
                'timestamp': message.timestamp
            }
            for message in messages
        ]

        return Response({'messages': messages_data}, status=200)

    except CustomUser.DoesNotExist:
        return Response({'error': 'Recipient not found'}, status=404)


@api_view(['POST'])
def send_message(request):
    if not request.user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=403)

    recipient_username = request.data.get('recipient')
    content = request.data.get('content')

    try:
        recipient = CustomUser.objects.get(username=recipient_username)
        message = Message.objects.create(sender=request.user, recipient=recipient, content=content)
        return Response({'message': 'Message sent', 'content': message.content}, status=201)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Recipient not found'}, status=404)
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return Response({'error': 'An error occurred'}, status=500)

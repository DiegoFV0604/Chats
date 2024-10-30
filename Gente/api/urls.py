from django.urls import path
from .views import get_messages, send_message, get_profile
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_view, name='login_user'),
    path('users/', views.get_users, name='get_users'),
    path('messages/<str:recipient_username>/', get_messages, name='get_messages'),
    path('messages/', send_message, name='send_message'),  # Necesitarás esta vista para enviar mensajes
    path('profile/<int:user_id>/', get_profile, name='get_profile'),
]
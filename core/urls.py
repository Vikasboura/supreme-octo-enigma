from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.index, name='index'),
    path('features/', views.features, name='features'),
    path('pricing/', views.pricing, name='pricing'),
    path('contact/', views.contact_us, name='contact'),
    path('docs/', views.docs, name='docs'),
    path('pii-scrubber/', views.pii_scrubber, name='pii_scrubber'),
    path('kali-terminal/', views.kali_terminal, name='kali_terminal'),
    path('ai-ssh-terminal/', views.ai_ssh_terminal, name='ai_ssh_terminal'),
    path('api/execute-kali/', views.execute_kali_command, name='execute_kali_command'),
    path('api/ai-ssh-execute/', views.execute_ai_ssh_command, name='execute_ai_ssh_command'),
]

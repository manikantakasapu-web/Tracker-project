from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, signup, login

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup),
    path('login/', login),
]
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by("-id")
    serializer_class = TransactionSerializer


@api_view(["POST"])
def signup(request):
    username = request.data.get("username", "").strip()
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "").strip()

    if not username or not email or not password:
        return Response(
            {"error": "Username, email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {"message": "User created successfully"},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def login(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {"message": "Login successful"},
        status=status.HTTP_200_OK,
    )
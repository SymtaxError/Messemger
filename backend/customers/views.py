from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import CustomerSerializer, ProfileSerializer
from .models import Customer

class CustomerRegistrationView(APIView):
    def post(self, request):
        customer = CustomerSerializer(data=request.data)
        if customer.is_valid():
            Customer.objects.create_user(**customer.validated_data)
            return Response(status=status.HTTP_201_CREATED)
        return Response(customer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        profile = ProfileSerializer(request.user)
        return Response(profile.data, status=status.HTTP_200_OK)

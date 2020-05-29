from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomerSerializer
from .models import Customer

class CustomerRegistrationView(APIView):
    def post(self, request):
        customer = CustomerSerializer(data=request.data)
        if customer.is_valid():
            Customer.objects.create_user(**customer.validated_data)
            return Response(status=status.HTTP_201_CREATED)
        return Response(customer.errors, status=status.HTTP_400_BAD_REQUEST)
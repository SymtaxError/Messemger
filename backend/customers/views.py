from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomerSerializer

class CustomerRegistrationView(APIView):
    def post(self, request):
        customer = CustomerSerializer(data=request.data)
        if customer.is_valid():
            customer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(customer.errors, status=status.HTTP_400_BAD_REQUEST)
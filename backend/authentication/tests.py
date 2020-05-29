from django.test import RequestFactory, TestCase
from customers.models import Customer
from rest_framework_simplejwt.views import TokenObtainPairView

class LoginTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        Customer.objects.create_user('test@test.ru', '12345', 'Ilia', 'Muravev')

    def test_details(self):
        payload = {
            'email': 'test@test.ru',
            'password': '12345',
        }
        request = self.factory.post('/jwt/login/', data=payload)
        response = TokenObtainPairView.as_view()(request)
        self.assertEqual(response.status_code, 200)
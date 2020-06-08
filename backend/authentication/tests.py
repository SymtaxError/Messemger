from django.test import RequestFactory, TestCase
from users.models import User
from rest_framework_simplejwt.views import TokenObtainPairView

class TestLogin(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        User.objects.create_user(email='test@test.ru', password='12345')

    def test_existing_user_can_sign_in(self):
        payload = {
            'email': 'test@test.ru',
            'password': '12345',
        }
        request = self.factory.post('/jwt/login/', data=payload)
        response = TokenObtainPairView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_sign_in_with_bad_credentials_should_fail(self):
        payload = {
            'email': 'test@test.ru',
            'password': 'qwerty'
        }
        request = self.factory.post('/jwt/login/', data=payload)
        response = TokenObtainPairView.as_view()(request)
        self.assertEqual(response.status_code, 401)

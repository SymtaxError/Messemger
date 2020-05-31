from django.test import RequestFactory, TestCase
from .views import UserRegistrationView

class RegistrationTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_details(self):
        payload = {
            'email': 'test@test.ru',
            'password': '12345',
            'first_name': 'Ilia',
            'last_name': 'Muravev'
        }
        request = self.factory.post('/register/', data=payload)
        response = UserRegistrationView.as_view()(request)
        self.assertEqual(response.status_code, 201)
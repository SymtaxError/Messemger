from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import NewsPostSerializer
from .models import NewsPost

class NewsPostView(APIView):
    """Analyses given requests connected with newspost and returns response."""
    permission_classes = [permissions.IsAuthenticated] #: Only authenticated users can interact with news posts.
    
    def get(self, request):
        """Returns a list of requested count news posts from requested 
        start number or an error if request is incorrect."""
        count = int(request.GET.get('count'))
        start = int(request.GET.get('start')) - 1
        try:
            query_set = NewsPost.objects.all()[start : start + count]
            print(NewsPost.objects.all()[start : start + count])
            serializer = NewsPostSerializer(
                query_set, 
                many=True
            )
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        """ Allows superusers create new news posts."""
        user = request.user
        if user.is_superuser:
            query_set = {}
            for item in request.data.items():
                query_set[item[0]] = item[1]
            query_set['author'] = user.profile.get_full_name()
            serializer = NewsPostSerializer(data=query_set)
            if serializer.is_valid():
                data = serializer.validated_data
                NewsPost.objects.create_news_post(
                    data['title'], 
                    data['text'],
                    user
                )
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request):
        """ Allows superusers delete requested post."""
        post_id = int(request.GET.get('post_id'))
        if request.user.is_superuser:
            NewsPost.objects.get(id=post_id).delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request):
        """Allows superusers update news posts."""
        post_id = int(request.GET.get('post_id'))
        if request.user.is_superuser:
            query_set = {}
            for item in request.data.items():
                query_set[item[0]] = item[1]
            query_set['author'] = str(request.user)
            serializer = NewsPostSerializer(data=query_set)
            if serializer.is_valid():
                post = NewsPost.objects.get(id=post_id)
                post.update(**serializer.validated_data)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(status=status.HTTP_403_FORBIDDEN)

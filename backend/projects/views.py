from rest_framework import viewsets

from .models import VideoProject
from .serializers import VideoProjectSerializer


class VideoProjectViewSet(viewsets.ModelViewSet):
    queryset = VideoProject.objects.all()
    serializer_class = VideoProjectSerializer

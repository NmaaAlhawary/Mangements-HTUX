from rest_framework.routers import DefaultRouter

from .views import VideoProjectViewSet

router = DefaultRouter()
router.register("projects", VideoProjectViewSet, basename="project")

urlpatterns = router.urls

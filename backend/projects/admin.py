from django.contrib import admin

from .models import VideoProject


@admin.register(VideoProject)
class VideoProjectAdmin(admin.ModelAdmin):
    list_display = (
        "project_category",
        "project_name",
        "video_title",
        "video_code",
        "project_date",
        "main_camera_man",
    )
    search_fields = ("project_name", "video_title", "video_code")

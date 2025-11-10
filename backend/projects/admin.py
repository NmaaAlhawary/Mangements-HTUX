from django.contrib import admin

from .models import VideoProject


@admin.register(VideoProject)
class VideoProjectAdmin(admin.ModelAdmin):
    list_display = (
        "project_name",
        "video_title",
        "project_date",
        "project_category",
        "main_camera_man",
    )
    search_fields = ("project_name", "video_title", "video_code")

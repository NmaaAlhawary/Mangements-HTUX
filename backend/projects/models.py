from django.db import models


class VideoProject(models.Model):
    project_name = models.CharField(max_length=255)
    project_category = models.CharField(max_length=255, blank=True)
    project_date = models.DateField(null=True, blank=True)
    pathway = models.CharField(max_length=255, blank=True)
    module = models.CharField(max_length=255, blank=True)
    block = models.CharField(max_length=255, blank=True)
    video = models.CharField(max_length=255, blank=True)
    video_code = models.CharField(max_length=255, blank=True)
    video_title = models.CharField(max_length=255)
    main_camera_man = models.CharField(max_length=255, blank=True)
    camera_assistant = models.CharField(max_length=255, blank=True)
    instructor_on_camera = models.CharField(max_length=255, blank=True)
    graphic_designer = models.CharField(max_length=255, blank=True)
    script_link = models.URLField(blank=True)
    screencast_link = models.URLField(blank=True)
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)
    additional_info = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.project_name

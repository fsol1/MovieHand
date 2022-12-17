from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from hands.views import LogInView, SignUpView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/sign_up/", SignUpView.as_view(), name="sign_up"),
    path("api/log_in/", LogInView.as_view(), name="log_in"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("hands.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

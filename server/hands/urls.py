from rest_framework.routers import SimpleRouter

from .views import (CommentViewSet, FollowViewSet, HandViewSet,
                    LikedHandViewSet, ProfileViewSet)

router = SimpleRouter()
router.register(r"profiles", ProfileViewSet)
router.register(r"hands", HandViewSet)
router.register(r"follows", FollowViewSet)
router.register(r"likes", LikedHandViewSet)
router.register(r"comments", CommentViewSet)

urlpatterns = router.urls

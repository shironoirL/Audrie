from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from drugs.views import PathPredictionAutocomplete, home


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path(
        "api/path-predictions-autocomplete/",
        PathPredictionAutocomplete.as_view(),
        name="path-predictions-autocomplete",
    ),
    path("", home, name="home"),
]

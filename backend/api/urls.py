from django.urls import path, include
from .views import (
    DrugListView, DrugDetailView, DiseaseListView, DrugDiseaseProbabilityListView,
    api_overview, PathPredictionListView, MetaPathPredictionListView,
    SourceEdgePredictionListView, TargetEdgePredictionListView, IndicationListView,
    MechanismOfActionListView, activate_user
)

urlpatterns = [
    path('', api_overview, name='api-overview'),
    path('drugs/', DrugListView.as_view(), name='drugs'),
    path('drugs/<str:drugname>/', DrugDetailView.as_view(), name='drug-detail'),  # Используем str для drugname
    path('diseases/', DiseaseListView.as_view(), name='disease-list'),
    path('drug-diseases-probability/', DrugDiseaseProbabilityListView.as_view(), name='probability-list'),
    path('path-predictions/', PathPredictionListView.as_view(), name='path-predictions'),
    path('metapath-predictions/', MetaPathPredictionListView.as_view(), name='metapath-predictions'),
    path('source-edge-predictions/', SourceEdgePredictionListView.as_view(), name='source-edge-predictions'),
    path('target-edge-predictions/', TargetEdgePredictionListView.as_view(), name='target-edge-predictions'),
    path('indication/', IndicationListView.as_view(), name='indications'),
    path('mechanism-of-action/', MechanismOfActionListView.as_view(), name='mechanism-of-action'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls.authtoken')),
    path('activate/<uidb64>/<token>/', activate_user, name='activate'),
]

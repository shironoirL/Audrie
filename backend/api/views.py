from django.shortcuts import render
from drugs.models import Drug, Disease, DrugDiseaseProbability, PathPrediction, MetaPathPrediction, SourceEdgePrediction, TargetEdgePrediction, DiseaseIndication, MechanismOfAction
from .serializers import DrugSerializer, DiseaseSerializer, DrugDiseaseProbabilitySerializer, PathPredictionSerializer, MetaPathPredictionSerializer, SourceEdgePredictionSerializer, TargetEdgePredictionSerializer, IndicationSerializer, MechanismOfActionSerializer
from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class DrugListView(generics.ListAPIView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class DrugDetailView(generics.RetrieveAPIView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    lookup_field = 'name'
    lookup_url_kwarg = 'drugname'

class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class DrugDiseaseProbabilityListView(generics.ListAPIView):
    queryset = DrugDiseaseProbability.objects.prefetch_related('drug', 'disease').all()
    serializer_class = DrugDiseaseProbabilitySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['drug__name', 'disease__name']
    # permission_classes = [IsAuthenticated]

    @method_decorator(cache_page(60*2))  # кэширование на 2 минуты
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class BasePredictionListView(generics.ListAPIView):
    filter_backends = [filters.SearchFilter]
    search_fields = ['drug_disease_probability__id']
    def get_queryset(self):
        queryset = super().get_queryset()
        drug_disease_probability_id = self.request.query_params.get('drug_disease_probability_id')
        if drug_disease_probability_id is not None:
            queryset = queryset.filter(drug_disease_probability_id=drug_disease_probability_id)
        return queryset

class PathPredictionListView(BasePredictionListView):
    queryset = PathPrediction.objects.all()
    serializer_class = PathPredictionSerializer

class MetaPathPredictionListView(BasePredictionListView):
    queryset = MetaPathPrediction.objects.all()
    serializer_class = MetaPathPredictionSerializer

class SourceEdgePredictionListView(BasePredictionListView):
    queryset = SourceEdgePrediction.objects.all()
    serializer_class = SourceEdgePredictionSerializer

class TargetEdgePredictionListView(BasePredictionListView):
    queryset = TargetEdgePrediction.objects.all()
    serializer_class = TargetEdgePredictionSerializer

class IndicationListView(generics.ListAPIView):
    queryset = DiseaseIndication.objects.all()
    serializer_class = IndicationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['chembl_id__name']

class MechanismOfActionListView(generics.ListAPIView):
    queryset = MechanismOfAction.objects.all()
    serializer_class = MechanismOfActionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['chembl_id__name']

def api_overview(request):
    context = {
        'endpoints': [
            {'name': 'Drugs', 'url': '/api/drugs/'},
            {'name': 'Diseases', 'url': '/api/diseases/'},
            {'name': 'Drug-Disease Probabilities', 'url': 'drug-diseases-probability'},
            {'name': 'Path Predictions', 'url': 'path-predictions'},
            {'name': 'Metapath predictions', 'url': 'metapath-predictions'},
            {'name': 'Source edge predictions', 'url': 'source-edge-predictions'},
            {'name': 'Target edge predictions', 'url': 'target-edge-predictions'},
            {'name': 'Indication', 'url': 'indication'},
            {'name': 'Mechanism of Action', 'url': 'mechanism-of-action'},
        ]
    }
    return render(request, 'api_overview.html', context)

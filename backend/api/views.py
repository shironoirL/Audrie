from django.shortcuts import render
from drugs.models import (
    Drug, Disease, DrugDiseaseProbability, PathPrediction, MetaPathPrediction,
    SourceEdgePrediction, TargetEdgePrediction, DiseaseIndication, MechanismOfAction
)
from .serializers import (
    DrugSerializer, DiseaseSerializer, DrugDiseaseProbabilitySerializer,
    PathPredictionSerializer, MetapathPredictionSerializer, SourceEdgePredictionSerializer,
    TargetEdgePredictionSerializer, IndicationSerializer, MechanismOfActionSerializer
)
from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse

class BaseListView(generics.ListAPIView):
    filter_backends = [filters.SearchFilter]

class BaseDetailView(generics.RetrieveAPIView):
    lookup_field = 'name'
    lookup_url_kwarg = 'drugname'

class DrugListView(BaseListView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
    search_fields = ['name']

class DrugDetailView(BaseDetailView):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer

class DiseaseListView(BaseListView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class CachedAPIView(APIView):
    cache_timeout = 60 * 2  # Cache for 2 minutes

    @method_decorator(cache_page(cache_timeout))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def execute_query(self, sql_query, params):
        with connection.cursor() as cursor:
            cursor.execute(sql_query, params)
            return cursor.fetchall()

    def format_results(self, rows, columns):
        return [
            {col: row[idx] for idx, col in enumerate(columns)}
            for row in rows
        ]

    def paginate_results(self, results, request, serializer_class):
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(results, request)
        if page is not None:
            serializer = serializer_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = serializer_class(results, many=True)
        return Response(serializer.data)

    def handle_exception(self, e):
        # Log the error for debugging
        print(f'Error executing SQL query: {e}')
        return JsonResponse({'error': str(e)}, status=500)

    def build_search_sql(self, search_query, fields):
        if not search_query:
            return '', []

        search_terms = search_query.split()
        search_clauses = [f"({' OR '.join(f'{field} LIKE %s' for field in fields)})" for _ in search_terms]
        params = [f'%{term}%' for term in search_terms for _ in fields]
        search_sql = 'WHERE ' + ' AND '.join(search_clauses)
        return search_sql, params

class DrugDiseaseProbabilityListView(CachedAPIView):
    def get(self, request, format=None):
        search_query = request.query_params.get('search', '')
        search_sql, params = self.build_search_sql(search_query, ['d.name', 'dis.name'])

        sql_query = f'''
            SELECT 
                ddp.id, d.name AS drug_name, dis.name AS disease_name, ddp.prediction,
                ddp.compound_prediction, ddp.disease_prediction, ddp.category, ddp.trial_count
            FROM drug_disease_probability ddp
            JOIN drug d ON ddp.drug_id = d.dbid
            JOIN disease dis ON ddp.disease_id = dis.doid
            {search_sql}
        '''

        try:
            rows = self.execute_query(sql_query, params)
            results = self.format_results(rows, [
                'id', 'drug_name', 'disease_name', 'prediction', 'compound_prediction',
                'disease_prediction', 'category', 'trial_count'
            ])
            return self.paginate_results(results, request, DrugDiseaseProbabilitySerializer)
        except Exception as e:
            return self.handle_exception(e)

class PathPredictionListView(CachedAPIView):
    def get(self, request, format=None):
        search_query = request.query_params.get('search', '')
        search_sql = 'WHERE ddp.id = %s' if search_query else ''
        params = [search_query] if search_query else []

        sql_query = f'''
            SELECT 
                pp.percent_of_prediction, pp.percent_of_dwpc, pp.metapath, pp.length, 
                pp.verbose_path, pp.drug_disease_probability_id
            FROM path_prediction pp 
            JOIN drug_disease_probability ddp ON ddp.id = pp.drug_disease_probability_id
            {search_sql}
        '''

        try:
            rows = self.execute_query(sql_query, params)
            results = self.format_results(rows, [
                'percent_of_prediction', 'percent_of_dwpc', 'metapath', 'length',
                'verbose_path', 'drug_disease_probability'
            ])
            return self.paginate_results(results, request, PathPredictionSerializer)
        except Exception as e:
            return self.handle_exception(e)

class MetaPathPredictionListView(CachedAPIView):
    def get(self, request, format=None):
        search_query = request.query_params.get('search', '')
        search_sql = 'WHERE ddp.id = %s' if search_query else ''
        params = [search_query] if search_query else []

        sql_query = f'''
            SELECT 
                mp.metapath, mp.percent_of_prediction, mp.path_count, mp.length, 
                mp.verbose, mp.drug_disease_probability_id
            FROM metapath_prediction mp
            JOIN drug_disease_probability ddp ON ddp.id = mp.drug_disease_probability_id
            {search_sql}
        '''

        try:
            rows = self.execute_query(sql_query, params)
            results = self.format_results(rows, [
                'metapath', 'percent_of_prediction', 'path_count', 'length',
                'verbose', 'drug_disease_probability'
            ])
            return self.paginate_results(results, request, MetapathPredictionSerializer)
        except Exception as e:
            return self.handle_exception(e)

class SourceEdgePredictionListView(CachedAPIView):
    def get(self, request, format=None):
        search_query = request.query_params.get('search', '')
        search_sql = 'WHERE ddp.id = %s' if search_query else ''
        params = [search_query] if search_query else []

        sql_query = f'''
            SELECT 
                sp.source_edge, sp.percent_of_prediction, sp.path_count, 
                sp.distinct_metapaths, sp.drug_disease_probability_id
            FROM sourceedge_prediction sp
            JOIN drug_disease_probability ddp ON ddp.id = sp.drug_disease_probability_id
            {search_sql}
        '''

        try:
            rows = self.execute_query(sql_query, params)
            results = self.format_results(rows, [
                'source_edge', 'percent_of_prediction', 'path_count',
                'distinct_metapaths', 'drug_disease_probability'
            ])
            return self.paginate_results(results, request, SourceEdgePredictionSerializer)
        except Exception as e:
            return self.handle_exception(e)

class TargetEdgePredictionListView(CachedAPIView):
    def get(self, request, format=None):
        search_query = request.query_params.get('search', '')
        search_sql = 'WHERE ddp.id = %s' if search_query else ''
        params = [search_query] if search_query else []

        sql_query = f'''
            SELECT 
                tp.target_edge, tp.percent_of_prediction, tp.path_count, 
                tp.distinct_metapaths, tp.drug_disease_probability_id
            FROM targetedge_prediction tp
            JOIN drug_disease_probability ddp ON ddp.id = tp.drug_disease_probability_id
            {search_sql}
        '''

        try:
            rows = self.execute_query(sql_query, params)
            results = self.format_results(rows, [
                'target_edge', 'percent_of_prediction', 'path_count',
                'distinct_metapaths', 'drug_disease_probability'
            ])
            return self.paginate_results(results, request, TargetEdgePredictionSerializer)
        except Exception as e:
            return self.handle_exception(e)

class IndicationListView(BaseListView):
    queryset = DiseaseIndication.objects.all()
    serializer_class = IndicationSerializer
    search_fields = ['chembl_id__name']

class MechanismOfActionListView(BaseListView):
    queryset = MechanismOfAction.objects.all()
    serializer_class = MechanismOfActionSerializer
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

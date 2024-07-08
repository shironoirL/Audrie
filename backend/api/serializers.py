from rest_framework import serializers
from drugs.models import Drug, Disease, DrugDiseaseProbability, PathPrediction, MetaPathPrediction, \
    SourceEdgePrediction, TargetEdgePrediction, DiseaseIndication, MechanismOfAction
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from .models import CustomUser

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = ['name', 'dbid','mechanism_large', 'treatment_count', 'edges', 'auroc', 'type', 'group', 'atc_code', 'categories', 'inchikey', 'description', 'pharmacodynamics', 'toxicity', 'clearance', 'half_life', 'route_of_elimination', 'metabolism', 'indication', 'smiles']

class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = ['name']

class DrugDiseaseProbabilitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    drug_name = serializers.CharField()
    disease_name = serializers.CharField()
    prediction = serializers.FloatField()
    compound_prediction = serializers.FloatField()
    disease_prediction = serializers.FloatField()
    category = serializers.CharField()
    trial_count = serializers.IntegerField()

class BasePathPredictionSerializer(serializers.ModelSerializer):
    drug_disease_probability = DrugDiseaseProbabilitySerializer()

class PathPredictionSerializer(BasePathPredictionSerializer):
    class Meta:
        model = PathPrediction
        fields = ['drug_disease_probability', 'percent_of_prediction', 'percent_of_dwpc', 'metapath', 'length', 'verbose_path']

class MetaPathPredictionSerializer(BasePathPredictionSerializer):
    class Meta:
        model = MetaPathPrediction
        fields = ['drug_disease_probability', 'metapath', 'percent_of_prediction', 'path_count', 'length', 'verbose']

class SourceEdgePredictionSerializer(BasePathPredictionSerializer):
    class Meta:
        model = SourceEdgePrediction
        fields = ['drug_disease_probability', 'source_edge', 'percent_of_prediction', 'path_count', 'distinct_metapaths']

class TargetEdgePredictionSerializer(BasePathPredictionSerializer):
    class Meta:
        model = TargetEdgePrediction
        fields = ['drug_disease_probability', 'target_edge', 'percent_of_prediction', 'path_count', 'distinct_metapaths']

class IndicationSerializer(serializers.ModelSerializer):
    drug_name = serializers.StringRelatedField(source='chembl_id')

    class Meta:
        model = DiseaseIndication
        fields = ['drug_name', 'disease', 'chembl_id', 'efo_name', 'reference_link', 'max_phase_for_indication']

class MechanismOfActionSerializer(serializers.ModelSerializer):
    drug_name = serializers.StringRelatedField(source='chembl_id')

    class Meta:
        model = MechanismOfAction
        fields = ['drug_name', 'chembl_id', 'action_type', 'mechanism_of_action', 'target_name', 'target_type', 'target_list', 'reference_list']

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'username', 'email', 'password')
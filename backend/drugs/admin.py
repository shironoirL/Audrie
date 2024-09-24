from django.contrib import admin
from .models import (
    Drug,
    Disease,
    DrugDiseaseProbability,
    PathPrediction,
    MetaPathPrediction,
    SourceEdgePrediction,
    TargetEdgePrediction,
    DiseaseIndication,
    MechanismOfAction,
)
from dal import autocomplete
from django import forms


class DrugAdmin(admin.ModelAdmin):
    list_display = ["name", "dbid"]
    search_fields = ["name", "dbid"]


class DiseaseAdmin(admin.ModelAdmin):
    list_display = ["name", "doid"]
    search_fields = ["name", "doid"]


class DrugDiseaseProbabilityAdmin(admin.ModelAdmin):
    list_display = ["drug", "disease"]
    search_fields = ["drug__name", "disease__name"]


class PathPredictionForm(forms.ModelForm):
    class Meta:
        model = PathPrediction
        fields = [
            "drug_disease_probability",
            "percent_of_prediction",
            "percent_of_dwpc",
            "metapath",
            "length",
            "verbose_path",
        ]
        widgets = {
            "drug_disease_probability": autocomplete.ModelSelect2(
                url="path-predictions-autocomplete", forward=["length"]
            ),
        }


class PathPredictionAdmin(admin.ModelAdmin):
    form = PathPredictionForm
    list_display = [
        "verbose_path",
        "drug_disease_probability",
        "percent_of_prediction",
        "percent_of_dwpc",
        "metapath",
        "length",
    ]
    search_fields = [
        "drug_disease_probability__drug__name",
        "drug_disease_probability__disease__name",
    ]


class MetaPathPredictionForm(forms.ModelForm):
    class Meta:
        model = MetaPathPrediction
        fields = [
            "drug_disease_probability",
            "metapath",
            "percent_of_prediction",
            "path_count",
            "length",
            "verbose",
        ]
        widgets = {
            "drug_disease_probability": autocomplete.ModelSelect2(
                url="path-predictions-autocomplete", forward=["length"]
            ),
        }


class MetaPathPredictionAdmin(admin.ModelAdmin):
    list_display = [
        "metapath",
        "drug_disease_probability",
        "percent_of_prediction",
        "path_count",
        "length",
        "verbose",
    ]
    search_fields = [
        "drug_disease_probability__drug__name",
        "drug_disease_probability__disease__name",
    ]
    form = MetaPathPredictionForm


class SourceEdgePredictionForm(forms.ModelForm):
    class Meta:
        model = SourceEdgePrediction
        fields = [
            "drug_disease_probability",
            "source_edge",
            "percent_of_prediction",
            "path_count",
            "distinct_metapaths",
        ]
        widgets = {
            "drug_disease_probability": autocomplete.ModelSelect2(
                url="path-predictions-autocomplete", forward=["length"]
            ),
        }


class SourceEdgePredictionAdmin(admin.ModelAdmin):
    list_display = [
        "source_edge",
        "drug_disease_probability",
        "percent_of_prediction",
        "path_count",
        "distinct_metapaths",
    ]
    search_fields = [
        "drug_disease_probability__drug__name",
        "drug_disease_probability__disease__name",
    ]
    form = SourceEdgePredictionForm


class TargetEdgePredictionForm(forms.ModelForm):
    class Meta:
        model = TargetEdgePrediction
        fields = [
            "drug_disease_probability",
            "target_edge",
            "percent_of_prediction",
            "path_count",
            "distinct_metapaths",
        ]
        widgets = {
            "drug_disease_probability": autocomplete.ModelSelect2(
                url="path-predictions-autocomplete", forward=["length"]
            ),
        }


class TargetEdgePredictionAdmin(admin.ModelAdmin):
    list_display = [
        "target_edge",
        "drug_disease_probability",
        "percent_of_prediction",
        "path_count",
        "distinct_metapaths",
    ]
    search_fields = [
        "drug_disease_probability__drug__name",
        "drug_disease_probability__disease__name",
    ]
    form = TargetEdgePredictionForm


class DiseaseIndicationForm(forms.ModelForm):
    class Meta:
        model = DiseaseIndication
        fields = [
            "chembl_id",
            "disease",
            "efo_name",
            "reference_link",
            "max_phase_for_indication",
        ]


class DiseaseIndicationAdmin(admin.ModelAdmin):
    list_display = [
        "chembl_id",
        "disease",
        "efo_name",
        "reference_link",
        "max_phase_for_indication",
    ]
    search_fields = ["disease", "efo_name", "chembl_id__chembl_id", "chembl_id__name"]
    form = DiseaseIndicationForm


class MechanismOfActionForm(forms.ModelForm):
    class Meta:
        model = MechanismOfAction
        fields = [
            "chembl_id",
            "action_type",
            "mechanism_of_action",
            "target_name",
            "target_type",
            "target_list",
            "reference_list",
        ]


class MechanismOfActionAdmin(admin.ModelAdmin):
    list_display = [
        "chembl_id",
        "action_type",
        "mechanism_of_action",
        "target_name",
        "target_type",
        "target_list",
        "reference_list",
    ]
    search_fields = ["chembl_id__chembl_id", "chembl_id__name"]
    form = MechanismOfActionForm


admin.site.register(SourceEdgePrediction, SourceEdgePredictionAdmin)
admin.site.register(TargetEdgePrediction, TargetEdgePredictionAdmin)
admin.site.register(MetaPathPrediction, MetaPathPredictionAdmin)
admin.site.register(PathPrediction, PathPredictionAdmin)
admin.site.register(Drug, DrugAdmin)
admin.site.register(Disease, DiseaseAdmin)
admin.site.register(DrugDiseaseProbability, DrugDiseaseProbabilityAdmin)
admin.site.register(DiseaseIndication, DiseaseIndicationAdmin)
admin.site.register(MechanismOfAction, MechanismOfActionAdmin)

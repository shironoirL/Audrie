from django.db import models

class Drug(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    dbid = models.CharField(max_length=20, primary_key=True)
    treatment_count = models.IntegerField(default=0, blank=True)
    edges = models.CharField(blank=True)
    auroc = models.FloatField(blank=True, null=True)
    type = models.CharField(max_length=1000, blank=True)
    group = models.CharField(max_length=1000, blank=True)
    atc_code = models.CharField(max_length=5000, blank=True)
    categories = models.CharField(max_length=20000, blank=True)
    inchikey = models.CharField(max_length=250, blank=True)
    description = models.CharField(max_length=20000, blank=True)
    mechanism_large = models.CharField(max_length=20000, blank=True)
    pharmacodynamics = models.CharField(max_length=20000, blank=True)
    toxicity = models.CharField(max_length=20000, blank=True)
    clearance = models.CharField(max_length=20000, blank=True)
    half_life = models.CharField(max_length=20000, blank=True)
    route_of_elimination = models.CharField(max_length=20000, blank=True)
    metabolism = models.CharField(max_length=20000, blank=True)
    indication = models.CharField(max_length=20000, blank=True)
    smiles = models.CharField(max_length=1000, blank=True)
    pubchem_cid = models.CharField(max_length=100, blank=True)
    chembl_id = models.CharField(max_length=100, blank=True, unique=True)
    class Meta:
        db_table = 'drug'
        ordering = ['dbid']

    def __str__(self):
        return self.name


class Disease(models.Model):
    doid = models.CharField(max_length=50,blank=True, primary_key=True)
    name = models.CharField(max_length=200, blank=True, db_index=True)
    treatment_count = models.IntegerField(default=0, blank=True)
    edge_count = models.CharField(blank=True)
    auroc = models.FloatField(blank=True, null=True)
    class Meta:
        db_table = 'disease'
        ordering = ['doid']

    def __str__(self):
        return self.name


class DrugDiseaseProbability(models.Model):
    drug = models.ForeignKey(Drug, on_delete=models.CASCADE)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    prediction = models.FloatField(blank=True, default=0)
    compound_prediction = models.FloatField(blank=True, default=0) #The prediction's percentile within all predictions for the compound
    disease_prediction = models.FloatField(blank=True, default=0) #The prediction's percentile within all predictions for the disease
    category = models.CharField(max_length=100, blank=True) #DM = disease modiying indication, SYM = symptomatic indication, NOT = non-indication
    trial_count = models.IntegerField(default=0, blank=True) #Trials investigating this compound-disease pair in ClinicalTrials.gov
    class Meta:
        unique_together = (("drug", "disease"),)
        ordering = ['drug', 'disease']

    class Meta:
        db_table = 'drug_disease_probability'
        ordering = ['drug', 'disease']

    def __str__(self):
        return self.drug.name + " - " + self.disease.name
class PathPrediction(models.Model):
    drug_disease_probability = models.ForeignKey(DrugDiseaseProbability, on_delete=models.CASCADE)
    percent_of_prediction = models.FloatField()
    percent_of_dwpc = models.FloatField()
    metapath = models.CharField(max_length=100)
    length = models.IntegerField()
    verbose_path = models.TextField()

    def __str__(self):
        return self.verbose_path
    class Meta:
        db_table = 'path_prediction'
        ordering = ['-percent_of_prediction']

class MetaPathPrediction(models.Model):
    drug_disease_probability = models.ForeignKey(DrugDiseaseProbability, on_delete=models.CASCADE)
    metapath = models.CharField(max_length=100)
    percent_of_prediction = models.FloatField()
    path_count = models.IntegerField()
    length = models.IntegerField()
    verbose = models.CharField(max_length=300)
    class Meta:
        db_table = 'metapath_prediction'
        ordering = ['-percent_of_prediction']

    def __str__(self):
        return self.verbose

class SourceEdgePrediction(models.Model):
    drug_disease_probability = models.ForeignKey(DrugDiseaseProbability, on_delete=models.CASCADE)
    source_edge = models.CharField(max_length=100)
    percent_of_prediction = models.FloatField()
    path_count = models.IntegerField()
    distinct_metapaths = models.IntegerField()
    class Meta:
        db_table = 'sourceedge_prediction'
        ordering = ['-percent_of_prediction']
    def __str__(self):
        return self.source_edge

class TargetEdgePrediction(models.Model):
    drug_disease_probability = models.ForeignKey(DrugDiseaseProbability, on_delete=models.CASCADE)
    target_edge = models.CharField(max_length=100)
    percent_of_prediction = models.FloatField()
    path_count = models.IntegerField()
    distinct_metapaths = models.IntegerField()
    class Meta:
        db_table = 'targetedge_prediction'
        ordering = ['-percent_of_prediction']

    def __str__(self):
        return self.target_edge

class DiseaseIndication(models.Model):
    chembl_id = models.ForeignKey(Drug, on_delete=models.CASCADE, to_field='chembl_id', db_column='chembl_id')
    disease = models.CharField(max_length=100, blank=True, null=True)
    efo_name = models.CharField(max_length=100, blank=True, null=True)
    reference_link = models.CharField(max_length=40000, blank=True, null=True)
    max_phase_for_indication = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.chembl_id} - {self.disease}"
    class Meta:
        db_table = 'indication'
        ordering = ['chembl_id']

class MechanismOfAction(models.Model):
    action_type = models.CharField(max_length=100, blank=True, null=True)
    mechanism_of_action = models.CharField(max_length=400, blank=True, null=True)
    chembl_id = models.ForeignKey(Drug, on_delete=models.CASCADE, to_field='chembl_id', db_column='chembl_id')
    target_name = models.CharField(max_length=100, blank=True, null=True)
    target_type = models.CharField(max_length=100, blank=True, null=True)
    target_list = models.CharField(max_length=2000, blank=True, null=True)
    reference_list  = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.chembl_id} - {self.mechanism_of_action}"
    class Meta:
        db_table = 'mechanism_of_action'
        ordering = ['chembl_id']


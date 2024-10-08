from django.shortcuts import render
from dal import autocomplete
from .models import DrugDiseaseProbability


class PathPredictionAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = DrugDiseaseProbability.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs


def home(request):
    return render(request, "home.html")

from django.db import models

class Transaction(models.Model):
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10)
    category = models.CharField(max_length=50)
    date = models.DateField()

    def __str__(self):
        return self.title
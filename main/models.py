from django.db import models
from operator import attrgetter
from account.models import SuddenDraftUser

class Draft(models.Model):
    name = models.CharField(max_length=100)
    width = models.IntegerField(default=1920)
    height = models.IntegerField(default=1080)
    is_public = models.BooleanField(default=False)
    users = models.ManyToManyField(SuddenDraftUser, related_name='packages')
    
    picture_objects = models.ManyToManyField('PictureObject', related_name='picture_objects')
    text_objects = models.ManyToManyField('TextObject', related_name='text_objects')
    
    def get_layers(self):
        all_objects = list(self.picture_objects.all()) + list(self.text_objects.all())
        all_objects = sorted(all_objects, key=attrgetter('order')) 
        return all_objects  
    
    def raise_higher(self, object):
        
        if object.order == (self.picture_objects.count() + self.text_objects.count() - 1):
            return
        
        all_objects = self.get_layers()
        
        insertion_index = 0
        for obj in all_objects:
            if obj != object:
                insertion_index += 1
            else:
                break
            
        all_objects[insertion_index].order += 1
        all_objects[insertion_index + 1].order -= 1
        
        all_objects[insertion_index].save()
        all_objects[insertion_index + 1].save()
        self.save() 
    
    def add_picture_object(self, object):
        object.order = self.picture_objects.count() + self.text_objects.count()
        object.save()
        
        self.picture_objects.add(object)
        self.picture_objects.save()
        self.save()

def get_picture_object_filepath(self, filename):
	return 'file_picture/' + str(self.pk) + '/' + filename + '.png'

class PictureObject(models.Model):
    name = models.CharField(max_length=100, null=False, default='layer')
    picture = models.ImageField(upload_to=get_picture_object_filepath, null=True)
    x_position = models.IntegerField()
    y_position = models.IntegerField()
    order = models.PositiveIntegerField(default=0, null=False)
    
    def save(self, *args, **kwargs):
        # Combine 'layer' and 'order' to create the 'name'
        self.name = f'layer{self.order}'

        super().save(*args, **kwargs)

class TextObject(models.Model):
    name = models.CharField(max_length=100, null=False, default='layer')
    content = models.TextField()
    x_position = models.IntegerField()
    y_position = models.IntegerField()
    order = models.PositiveIntegerField(default=0, null=False)
    
    def save(self, *args, **kwargs):
        # Combine 'layer' and 'order' to create the 'name'
        self.name = f'layer{self.order}'

        super().save(*args, **kwargs)
        
        
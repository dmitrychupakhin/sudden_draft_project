from django.db import models
from operator import attrgetter
from account.models import SuddenDraftUser

class Draft(models.Model):
    name = models.CharField(max_length=100)
    width = models.IntegerField(default=1920)
    height = models.IntegerField(default=1080)
    background = models.IntegerField(default=1)
    is_public = models.BooleanField(default=False)
    users = models.ManyToManyField(SuddenDraftUser, related_name='packages')
    
    def get_layers(self):
        all_objects = list(self.picture_object.all()) + list(self.text_object.all())
        all_objects = sorted(all_objects, key=attrgetter('order')) 
        try:
            all_objects = all_objects + list(self.drawn_object)
        except:
            pass
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
        
def get_picture_object_filepath(instance):
    draftid = instance.draft.id
    fileid = instance.id
    return f'file_picture/{draftid}/{fileid}.png'

class PictureObject(models.Model):
    name = models.CharField(max_length=100, null=False, default='layer')
    x_position = models.IntegerField()
    y_position = models.IntegerField()
    order = models.PositiveIntegerField(default=0, null=False)
    draft =  models.ForeignKey(Draft, related_name='picture_object', on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=get_picture_object_filepath, null=True)
    def save(self, *args, **kwargs):
        # Combine 'layer' and 'order' to create the 'name'
        self.name = f'layer{self.order}'

        super().save(*args, **kwargs)

class DrawnObject(models.Model):
    name = models.CharField(max_length=100, null=False, default='layer')
    x_position = models.IntegerField()
    y_position = models.IntegerField()
    draft =  models.OneToOneField(Draft, related_name='drawn_object', on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=get_picture_object_filepath, null=True)
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
    draft =  models.ForeignKey(Draft, related_name='text_object', on_delete=models.CASCADE)
        
    def save(self, *args, **kwargs):
        # Combine 'layer' and 'order' to create the 'name'
        self.name = f'layer{self.order}'

        super().save(*args, **kwargs)
        
        
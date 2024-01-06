import os
from django.conf import settings
from django.db import models
from operator import attrgetter
from account.models import SuddenDraftUser
from ckeditor.fields import RichTextField

class Draft(models.Model):
    name = models.CharField(max_length=100)
    width = models.IntegerField(default=1920)
    height = models.IntegerField(default=1080)
    background = models.IntegerField(default=1)
    is_public = models.BooleanField(default=False)
    users = models.ManyToManyField(SuddenDraftUser, related_name='packages')
    
    def get_pictures(self):
        all_objects = list(self.picture_object.all())
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
        
def get_drawn_object_filepath(instance, filename):
    draft_id = instance.draft.id
    return f'file_picture/{draft_id}/drawn_object.png'

def get_drawn_object_filepath_for_save(draft_id):
    return f'file_picture/{draft_id}/drawn_object.png'

def get_picture_object_filepath(instance, filename):
    file_id = instance.id
    draft_id = instance.draft.id
    return f'file_picture/{draft_id}/picture_object{file_id}.png'

class PictureObject(models.Model):
    x_position = models.IntegerField()
    y_position = models.IntegerField()
    order = models.PositiveIntegerField(default=0, null=False)
    draft =  models.ForeignKey(Draft, related_name='picture_object', on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=get_picture_object_filepath, null=True)
    height = models.IntegerField()
    width = models.IntegerField()
    rotate = models.IntegerField()
    

class TextObject(models.Model):
    content = models.TextField()
    x_position = models.IntegerField(default=0)
    y_position = models.IntegerField(default=0)
    height = models.IntegerField(default=50)
    width = models.IntegerField(default=250)
    order = models.PositiveIntegerField(default=0, null=False)
    draft =  models.ForeignKey(Draft, related_name='text_object', on_delete=models.CASCADE)
    content = RichTextField(blank=True, null=True)

   

class DrawnObject(models.Model):
    draft =  models.OneToOneField(Draft, related_name='drawn_object', on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=get_drawn_object_filepath, null=True)
    def save(self, *args, **kwargs):
            # Проверяем, существует ли файл по заданному пути
            if self.picture:
                file_path = os.path.join(settings.MEDIA_ROOT, get_drawn_object_filepath_for_save(draft_id=self.draft.pk))
                if os.path.exists(file_path):
                    # Если файл существует, удаляем его
                    os.remove(file_path)

            super().save(*args, **kwargs)

        
        
        
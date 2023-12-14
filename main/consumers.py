import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
import base64
from .models import *

class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.draft_id = self.scope['url_route']['kwargs']['draft_id']
        self.room_group_name = f"draft_{self.draft_id}"
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        
        self.accept()
        

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        
        message_type = data.get('type')
        draft = Draft.objects.get(id=self.draft_id)
                
        if message_type == 'background_set':
            background_style = data.get('background_style', None)
            draft.background = background_style
            draft.save()
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'background_style.data',
                'background_style': background_style,})
            return
        elif message_type == 'draw_picture_save':
            save_draw_image = data.get('save_draw_image', None)
            format, imgstr = save_draw_image.split(';base64,')
            ext = format.split('/')[-1]
            image_content = ContentFile(base64.b64decode(imgstr), name=f'picture.{ext}')
            
            draft = Draft.objects.get(id=self.draft_id)
            
            try:
                picture_object = DrawnObject.objects.create(
                    draft=draft,
                )
                picture_object.picture = image_content
                picture_object.save()
            except:
                drawn_object = DrawnObject.objects.get(draft=draft)
                drawn_object.picture = image_content
                drawn_object.save()
            
            return
            
        elif message_type == 'eraser_change':
            coordinates = data.get('coordinates', [])
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'erase.data',
                'coordinates': coordinates,
            }
        )
        elif message_type == 'draw_picture_change':
            image_data = data['image']
            x_position = data['x_position']
            y_position = data['y_position']
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat.data',
                    'x_position': x_position,
                    'y_position': y_position,
                    'picture_url': image_data
                }
            )
        elif message_type == 'image-upload':
            image_data = data.get('imageData')
            
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            image_content = ContentFile(base64.b64decode(imgstr), name=f'picture.{ext}')
            
            draft = Draft.objects.get(id=self.draft_id)
            
            
            picture_object = PictureObject.objects.create(
                x_position = 0,
                y_position = 0,
                draft=draft,
            )
            picture_object.picture = image_content
            picture_object.save()
            
            return
            
            
            
            
        
    def erase_data(self, event):
        coordinates = event['coordinates']
        self.send(text_data=json.dumps({
            'coordinates': coordinates,
        }))
        
        
    def background_style_data(self, event):
        background_style = event['background_style']
        self.send(text_data=json.dumps({
            'background_style': background_style,
        }))
        
    def chat_data(self, event):
        # Отправляем сообщение конкретному клиенту
        x_position = event['x_position']
        y_position = event['y_position']
        picture_url = event['picture_url']
        self.send(text_data=json.dumps({
            'x_position': x_position,
            'y_position': y_position,
            'picture_url': picture_url,
        }))

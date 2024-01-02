import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
import base64
from .models import *
from PIL import Image
import base64
from io import BytesIO

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
                    'type': 'draw.data',
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
            
            pil_image = Image.open(image_content)
            width, height = pil_image.size
            
            picture_object = PictureObject.objects.create(
                x_position = 0,
                y_position = 0,
                draft=draft,
                width = width,
                height = height,
                rotate = 0
            )
            picture_object.picture = image_content
            
            picture_object.save()
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'image_upload.data',
                    'id': picture_object.id,
                    'img': picture_object.picture.url
                }
            )
        elif message_type == 'picture_position_change':
            id = data.get('id')
            x_position = data.get('x_position')
            y_position = data.get('y_position')
            
            picture_object = PictureObject.objects.get(id=id)
            
            picture_object.x_position = x_position
            picture_object.y_position = y_position
            
            picture_object.save()
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'picture_position_change.data',
                    'id': id,
                    'x': x_position,
                    'y': y_position
                }
            )
        elif message_type == 'picture_size_change':
            id = data.get('id')
            width = data.get('width')
            height = data.get('height')
            
            picture_object = PictureObject.objects.get(id=id)
            
            picture_object.width = width
            picture_object.height = height
            
            picture_object.save()
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'picture_size_change.data',
                    'id': id,
                    'width': width,
                    'height': height
                }
            )
        elif message_type == 'picture_rotate_change':
            id = data.get('id')
            rotate = data.get('rotate')
            
            picture_object = PictureObject.objects.get(id=id)
            
            picture_object.rotate = rotate
            
            picture_object.save()
            
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'picture_rotate_change.data',
                    'id': id,
                    'rotate': rotate
                }
            )
            
    def erase_data(self, event):
        coordinates = event['coordinates']
        self.send(text_data=json.dumps({
            'type': 'erase_data',
            'coordinates': coordinates,
        }))
        
    def background_style_data(self, event):
        background_style = event['background_style']
        self.send(text_data=json.dumps({
            'type': 'background_style_data',
            'background_style': background_style,
        }))
        
    def draw_data(self, event):
        # Отправляем сообщение конкретному клиенту
        x_position = event['x_position']
        y_position = event['y_position']
        picture_url = event['picture_url']
        self.send(text_data=json.dumps({
            'type': 'draw_data',
            'x_position': x_position,
            'y_position': y_position,
            'picture_url': picture_url,
        }))
    def image_upload_data(self, event):
        id = event['id']
        img = event['img']
        self.send(text_data=json.dumps({
            'type': 'image_upload_data',
            'id': id,
            'img': img,
        }))
        
    def picture_position_change_data(self, event):
        id = event.get('id')
        x = event.get('x')
        y = event.get('y')

        self.send(text_data=json.dumps({
            'type': 'picture_position_change_data',
            'id': id,
            'x': x,
            'y': y,
        }))

    def picture_rotate_change_data(self, event):
        id = event.get('id')
        rotate = event.get('rotate')

        self.send(text_data=json.dumps({
            'type': 'picture_rotate_change_data',
            'id': id,
            'rotate': rotate,
        }))

    def picture_size_change_data(self, event):
        id = event.get('id')
        width = event.get('width')
        height = event.get('height')

        self.send(text_data=json.dumps({
            'type': 'picture_size_change_data',
            'id': id,
            'width': width,
            'height': height,
        }))
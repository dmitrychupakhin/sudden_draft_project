import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
import base64

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
        
        coordinates = data.get('coordinates', [])
        print(coordinates)
        if coordinates != []:
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'erase.data',
                'coordinates': coordinates,
            }
        )
        else:
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
        
    def erase_data(self, event):
        coordinates = event['coordinates']
        self.send(text_data=json.dumps({
            'coordinates': coordinates,
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

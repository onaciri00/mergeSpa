from django.urls import re_path
from .consumers import TicTacToeConsumer

websocket_urlpatterns = [
    re_path(r'ws/playx/(?P<room_code>\w+)/$', TicTacToeConsumer.as_asgi()),
    re_path(r'ws/playx/', TicTacToeConsumer.as_asgi()),
]

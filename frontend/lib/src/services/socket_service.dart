import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  IO.Socket? _socket;

  void connect(String token) {
    _socket = IO.io('http://localhost:5000', <String, dynamic>{
      'transports': ['websocket'],
      'auth': {'token': token},
    });
  }

  void joinOrderRoom(String orderId) {
    _socket?.emit('joinOrderRoom', {'orderId': orderId});
  }

  void onOrderStatusUpdate(Function(dynamic) callback) {
    _socket?.on('orderStatusUpdate', callback);
  }

  void onRiderLocationUpdate(Function(dynamic) callback) {
    _socket?.on('riderLocationUpdate', callback);
  }

  void disconnect() {
    _socket?.disconnect();
  }
}

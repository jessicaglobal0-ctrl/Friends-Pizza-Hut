import 'package:flutter/material.dart';
import '../api/api_service.dart';

class NotificationProvider with ChangeNotifier {
  final ApiService api;
  List<dynamic> _notifications = [];
  List<dynamic> get notifications => _notifications;

  NotificationProvider(this.api);

  Future<void> fetchNotifications() async {
    final res = await api.get('/user/notifications');
    if (res.statusCode == 200) {
      _notifications = res.body;
      notifyListeners();
    }
  }
}

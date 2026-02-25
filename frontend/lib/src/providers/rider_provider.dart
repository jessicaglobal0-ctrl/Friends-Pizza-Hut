import 'package:flutter/material.dart';
import '../api/api_service.dart';

class RiderProvider with ChangeNotifier {
  final ApiService api;
  List<dynamic> _assignedOrders = [];
  List<dynamic> get assignedOrders => _assignedOrders;
  List<dynamic> _history = [];
  List<dynamic> get history => _history;
  Map<String, dynamic>? _location;
  Map<String, dynamic>? get location => _location;

  RiderProvider(this.api);

  Future<void> fetchAssignedOrders() async {
    final res = await api.get('/rider/orders/assigned');
    if (res.statusCode == 200) {
      _assignedOrders = res.body;
      notifyListeners();
    }
  }
  // Add similar methods for history, location, status updates
}

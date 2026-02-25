import 'package:flutter/material.dart';
import '../api/api_service.dart';

class OrderProvider with ChangeNotifier {
  final ApiService api;
  List<dynamic> _orders = [];
  List<dynamic> get orders => _orders;

  OrderProvider(this.api);

  Future<void> fetchOrders() async {
    final res = await api.get('/user/orders');
    if (res.statusCode == 200) {
      _orders = res.body;
      notifyListeners();
    }
  }
}

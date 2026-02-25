import 'package:flutter/material.dart';
import '../api/api_service.dart';

class AdminProvider with ChangeNotifier {
  final ApiService api;
  List<dynamic> _orders = [];
  List<dynamic> get orders => _orders;
  List<dynamic> _users = [];
  List<dynamic> get users => _users;
  List<dynamic> _products = [];
  List<dynamic> get products => _products;
  List<dynamic> _categories = [];
  List<dynamic> get categories => _categories;
  List<dynamic> _cities = [];
  List<dynamic> get cities => _cities;
  List<dynamic> _payments = [];
  List<dynamic> get payments => _payments;
  Map<String, dynamic>? _dashboard;
  Map<String, dynamic>? get dashboard => _dashboard;

  AdminProvider(this.api);

  Future<void> fetchDashboard() async {
    final res = await api.get('/admin/dashboard');
    if (res.statusCode == 200) {
      _dashboard = res.body;
      notifyListeners();
    }
  }
  // Add similar fetch methods for orders, users, products, categories, cities, payments
}

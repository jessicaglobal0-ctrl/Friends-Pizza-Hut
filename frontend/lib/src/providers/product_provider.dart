import 'package:flutter/material.dart';
import '../api/api_service.dart';

class ProductProvider with ChangeNotifier {
  final ApiService api;
  List<dynamic> _products = [];
  List<dynamic> get products => _products;

  ProductProvider(this.api);

  Future<void> fetchProducts() async {
    final res = await api.get('/user/products');
    if (res.statusCode == 200) {
      _products = res.body['products'];
      notifyListeners();
    }
  }
}

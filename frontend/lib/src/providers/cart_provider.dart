import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../providers/order_provider.dart';
import '../providers/auth_provider.dart';

class CartProvider with ChangeNotifier {
  final List<Map<String, dynamic>> _cartItems = [];
  List<Map<String, dynamic>> get cartItems => _cartItems;

  void addToCart(Map<String, dynamic> product) {
    final index = _cartItems.indexWhere((item) => item['id'] == product['id']);
    if (index >= 0) {
      _cartItems[index]['quantity'] += 1;
    } else {
      _cartItems.add({...product, 'quantity': 1});
    }
    notifyListeners();
  }

  void removeFromCart(String productId) {
    _cartItems.removeWhere((item) => item['id'] == productId);
    notifyListeners();
  }

  void updateQuantity(String productId, int quantity) {
    final index = _cartItems.indexWhere((item) => item['id'] == productId);
    if (index >= 0) {
      _cartItems[index]['quantity'] = quantity;
      notifyListeners();
    }
  }

  void clearCart() {
    _cartItems.clear();
    notifyListeners();
  }

  double get totalPrice => _cartItems.fold(0, (sum, item) => sum + (item['price'] * item['quantity']));
}

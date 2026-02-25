import 'package:flutter/material.dart';
import '../api/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService api;
  String? _accessToken;
  String? get accessToken => _accessToken;
  Map<String, dynamic>? _user;
  Map<String, dynamic>? get user => _user;

  AuthProvider(this.api);

  Future<bool> login(String email, String password) async {
    final res = await api.post('/auth/login', body: {
      'email': email,
      'password': password,
    });
    if (res.statusCode == 200) {
      final data = res.body;
      _accessToken = data['accessToken'];
      _user = data['user'];
      api.setAccessToken(_accessToken);
      notifyListeners();
      return true;
    }
    return false;
  }

  void logout() {
    _accessToken = null;
    _user = null;
    api.setAccessToken(null);
    notifyListeners();
  }
}

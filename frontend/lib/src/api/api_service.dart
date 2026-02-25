import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl;
  String? _accessToken;

  ApiService(this.baseUrl);

  void setAccessToken(String? token) {
    _accessToken = token;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_accessToken != null) 'Authorization': 'Bearer $_accessToken',
  };

  Future<http.Response> get(String path) async {
    final url = Uri.parse('$baseUrl$path');
    return await http.get(url, headers: _headers);
  }

  Future<http.Response> post(String path, {Map<String, dynamic>? body}) async {
    final url = Uri.parse('$baseUrl$path');
    return await http.post(url, headers: _headers, body: jsonEncode(body));
  }

  Future<http.Response> put(String path, {Map<String, dynamic>? body}) async {
    final url = Uri.parse('$baseUrl$path');
    return await http.put(url, headers: _headers, body: jsonEncode(body));
  }

  Future<http.Response> patch(String path, {Map<String, dynamic>? body}) async {
    final url = Uri.parse('$baseUrl$path');
    return await http.patch(url, headers: _headers, body: jsonEncode(body));
  }

  Future<http.Response> delete(String path) async {
    final url = Uri.parse('$baseUrl$path');
    return await http.delete(url, headers: _headers);
  }
}

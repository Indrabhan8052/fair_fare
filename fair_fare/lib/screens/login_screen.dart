import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  bool loading = false;

  Future<void> login() async {
    if (emailCtrl.text.isEmpty || passCtrl.text.isEmpty) return;
    setState(() => loading = true);
    try {
      final cred = await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: emailCtrl.text.trim(), password: passCtrl.text.trim());

      // check role in Firestore (users collection)
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(cred.user!.uid)
          .get();

      final isAdmin = doc.exists && (doc.data()?['isAdmin'] == true);

      if (isAdmin) {
        Navigator.pushReplacementNamed(context, '/adminDashboard');
      } else {
        Navigator.pushReplacementNamed(context, '/userDashboard');
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Login failed: $e')));
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: 20),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Login',
                    style:
                        TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 20),
              TextField(
                  controller: emailCtrl,
                  decoration: const InputDecoration(labelText: 'Email')),
              const SizedBox(height: 12),
              TextField(
                  controller: passCtrl,
                  decoration: const InputDecoration(labelText: 'Password'),
                  obscureText: true),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: loading ? null : login,
                child: loading
                    ? const CircularProgressIndicator()
                    : const Text('Login'),
              ),
              TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/signup'),
                  child: const Text('Register here')),
            ],
          ),
        ),
      ),
    );
  }
}

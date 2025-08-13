'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/supabase';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Tunggu cookie sync
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/beranda');
      }

    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center bg-[#f3f0e3] px-4 pt-4 pb-10">
      <div className="max-w-md w-full bg-[#fbfaf6] rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Login Admin</h1>
        
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="nama@domain.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              type="password"
              placeholder="*****"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" disabled={loading} />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#184D3B] hover:bg-green-700"
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </div>
    </section>
  );
}

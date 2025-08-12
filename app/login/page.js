'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from 'next/navigation'; // Perubahan di sini

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/admin/beranda');
    }
  }

  return (
    <section className="flex items-center justify-center bg-[#f3f0e3] px-4 pt-5 pb-10">
      <div className="max-w-md w-full bg-[#fbfaf6] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h1>
        
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email" className="mb-2 block font-medium text-gray-700">
              Email
            </Label>
            <TextInput
              id="email"
              type="email"
              placeholder="nama@domain.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 focus:border-[#184D3B] focus:ring-[#184D3B]"
            />
          </div>

          <div>
            <Label htmlFor="password" className="mb-2 block font-medium text-gray-700">
              Password
            </Label>
            <TextInput
              id="password"
              type="password"
              placeholder="*****"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 focus:border-[#184D3B] focus:ring-[#184D3B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="font-medium text-gray-700">
              Remember me
            </Label>
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

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
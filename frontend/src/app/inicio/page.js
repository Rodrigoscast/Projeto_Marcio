'use client'

import React from 'react';
import 'react-toastify/dist/ReactToastify.css'
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ToastContainer, toast } from 'react-toastify'
import { usePathname } from 'next/navigation'

import { Skeleton } from "@/components/ui/skeleton"
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card'

export default function Dashboard() {
  const router = useRouter()
  const { user } = useUser();
  const pathname = usePathname()

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-4">
        {user ? (
          <h1 className="text-3xl font-bold mb-6">Olá, {user.nome}!</h1>
        ) : (
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
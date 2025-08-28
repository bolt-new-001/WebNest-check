import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { api } from '@/lib/api'

export default function ExportData() {
  const [downloading, setDownloading] = useState(false)

  const handleExport = async () => {
    try {
      setDownloading(true)
      const token = localStorage.getItem('token')
      const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5001'
      const res = await fetch(`${base}/api/profile/export`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'webnest_user_export.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Export Data</h2>
        <p className="text-muted-foreground">Download all your account data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Export</CardTitle>
          <CardDescription>Includes profile, projects, sessions, and activity logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} disabled={downloading}>
            {downloading ? <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.download className="mr-2 h-4 w-4" />}
            {downloading ? 'Preparing...' : 'Download JSON'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}



"use client"

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, Github, ExternalLink } from 'lucide-react'

const GITHUB_REPO_URL = "https://github.com/pouyahbb/mochi"

export default function EnvCheck() {
  const [isOpen, setIsOpen] = useState(false)
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/check-env')
        const data = await response.json()

        if (!data.isValid) {
          setMissingVars(data.missingVars)
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Failed to check environment variables:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkEnv()
  }, [])

  const handleOpenGitHub = () => {
    window.open(GITHUB_REPO_URL, '_blank')
  }

  if (isChecking) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl">
              Missing Environment Variables
            </DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            Some required environment variables are not configured.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            To run the application correctly, please set the following variables
            in the{' '}
            <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
              .env
            </code>{' '}
            file:
          </p>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
            <ul className="space-y-2">
              {missingVars.map((varName) => (
                <li key={varName} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-destructive"></span>
                  <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                    {varName}
                  </code>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Setup Guide:
            </p>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Clone the GitHub repository</li>
              <li>
                Create a{' '}
                <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 font-mono text-xs">
                  .env.local
                </code>{' '}
                file in the project root
              </li>
              <li>Copy the required variables from the README</li>
              <li>Provide appropriate values for each variable</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Later
          </Button>
          <Button
            onClick={handleOpenGitHub}
            className="w-full sm:w-auto"
          >
            <Github className="w-4 h-4 mr-2" />
            Open GitHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

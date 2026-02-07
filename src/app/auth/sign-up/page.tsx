"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
    const { handleSignUp, isLoading, signUpForm } = useAuth()
    const { register, handleSubmit, formState: { errors } } = signUpForm

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleSubmit(handleSignUp)}
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        LOGO
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Create a S2C Account</h1>
                        <p className="text-sm">Welcome! Create an account to continue</p>
                    </div>

                    <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="block text-sm">
                                    First Name
                                </Label>
                                <Input
                                    type="text"
                                    id="firstName"
                                    {...register("firstName")}
                                    className={errors.firstName ? "border-destructive" : ""}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-destructive">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="block text-sm">
                                    Last Name
                                </Label>
                                <Input
                                    type="text"
                                    id="lastName"
                                    {...register("lastName")}
                                    className={errors.lastName ? "border-destructive" : ""}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-destructive">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                {...register("email")}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm">
                                Password
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                {...register("password")}
                                className={cn("input sz-md variant-mixed", errors.password ? "border-destructive" : "")}
                            />
                            {errors.password && (
                                <p className='text-xs text-destructive'>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {errors.root && (
                            <p className='text-xs text-center text-destructive'>
                                {errors.root.message}
                            </p>
                        )}

                        <Button disabled={isLoading} className="w-full">
                            {isLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin ' />
                                Creating account...
                            </> : "Sign Up"}
                        </Button>
                    </div>
                </div>

                <div className="bg-muted rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Already have an account?
                        <Button
                            asChild
                            variant="link"
                            className="px-2">
                            <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}

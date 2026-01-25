import {useAuthActions} from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'


const signInSchema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(6 , "Password must be at least 6 characters")
})

type signInData = z.infer<typeof signInSchema>


const signUpSchema = z.object({
    firstName : z.string().min(2 , "First name must be at least 2 characters"),
    lastName : z.string().min(2 , "Last name must be at least 2 characters"),
    email : z.string().email("Invalid email address"),
    password : z.string().min(6 , "Password must be at least 6 characters")
})

type signUpData = z.infer<typeof signUpSchema>


export const useAuth = () => {
    const {signIn , signOut} = useAuthActions()
    const router = useRouter()
    const [isLoading , setIsLoading] = useState(false)
    const signInForm = useForm<signInData>({
        resolver : zodResolver(signInSchema),
        defaultValues : {
            email : "",
            password : ""
        }
    })
    const signUpForm = useForm<signUpData>({
        resolver : zodResolver(signUpSchema),
        defaultValues : {
            firstName:"",
            lastName :"",
            email : "",
            password : ""
        }
    })
    const handleSignIn = async(data:signInData) => {
        setIsLoading(true)
        try{
            await signIn("password" , {
                email : data.email,
                password : data.password,
                flow : "signIn"
            } )
            router.push("/dashboard")
        }catch(err){
            console.log(err)
            signInForm.setError("root" , {
                message : "Invalid email or password. Please check your credentials."
            })
        }finally{
            setIsLoading(false)
        }
    }
    const handleSignUp = async(data:signUpData) => {
        console.log(data)
        setIsLoading(true)
        try{
            await signIn("password" , {
                name : `${data.firstName } ${data.lastName}`,
                password : data.password,
                email : data.email,
                flow : "signUp"
            })
            router.push("/dashboard")
        }catch(err){
            console.log(err)
            signUpForm.setError("root" , {
                message : "Failed to create account. Email may already exist"
            })
        }finally{
            setIsLoading(false)

        }
    }
    
    const handleSignOut = async() => {
        try{
            await signOut()
            router.push("/auth/sign-in")
        }catch(err){
            console.log(err)
        }

    }

    return {
        signInForm , 
        signUpForm , 
        isLoading,
        handleSignIn,
        handleSignUp,
        handleSignOut
    }
    
}
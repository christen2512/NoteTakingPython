import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { useEffect } from "react"



export function LoginForm() {
    useEffect(() => {
        const redirectAuth0 = async () => {
            window.location.href = "http://localhost:8000/login"
        }
        redirectAuth0()
    }, [])
    return (
    <div>
        <h1>Redirecting to login...</h1>
    </div>
    )
}
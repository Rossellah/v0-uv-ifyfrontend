"use client"

import { useState, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../main"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "", // Added phone field
  })
  const [error, setError] = useState("")
  const authCardRef = useRef(null) // Added ref for scrolling to auth card

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  // 🌐 Change this to your Render backend URL
  const BACKEND_URL = "https://uvify-backend.onrender.com"

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const scrollToAuthCard = () => {
    authCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Login attempt started")

    try {
      const endpoint = isLogin ? "/auth/login" : "/register"
      const url = `${BACKEND_URL}${endpoint}`

      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone, // Added phone to registration body
          }

      console.log("[v0] Sending request to:", url)

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      console.log("[v0] Response received:", data)

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong")
        console.log("[v0] Login failed:", data.message)
        return
      }

      if (isLogin) {
        login(data.user)
        console.log("[v0] Login successful, navigating to dashboard")
        navigate("/dashboard")
      } else {
        alert("Signup successful! You can now log in.")
        setIsLogin(true)
      }
    } catch (err) {
      console.error("[v0] Auth error:", err)
      setError("Server error. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        {/* Hero Section */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500">
              UVify
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your intelligent UV index monitoring system. Stay protected with real-time UV tracking and personalized
            safety recommendations.
          </p>

          <button
            onClick={scrollToAuthCard}
            className="md:hidden w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 text-white rounded-lg font-semibold shadow-lg hover:from-yellow-600 hover:to-orange-700 dark:hover:from-yellow-700 dark:hover:to-orange-800 transition-all duration-200 text-lg"
          >
            Get Started
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {[
              {
                icon: "☀️",
                color: "text-yellow-500 dark:text-yellow-400",
                title: "Real-time Monitoring",
                desc: "Live UV index readings from ESP32 sensors with instant updates.",
              },
              {
                icon: "🛡️",
                color: "text-orange-500 dark:text-orange-400",
                title: "Safety Alerts",
                desc: "Personalized recommendations and alerts based on current UV levels.",
              },
              {
                icon: "📈",
                color: "text-amber-500 dark:text-amber-400",
                title: "Historical Data",
                desc: "Track UV patterns over time with detailed charts and analytics.",
              },
              {
                icon: "👥",
                color: "text-red-500 dark:text-red-400",
                title: "Multi-user Support",
                desc: "Individual profiles with personalized settings and preferences.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-yellow-200 dark:border-gray-700 transition-colors duration-300"
              >
                <div className={`${item.color} text-2xl mb-2`}>{item.icon}</div>
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div ref={authCardRef} className="w-full max-w-md mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 dark:border-gray-700 p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
              {isLogin ? "Login to UVify" : "Create an Account"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {isLogin ? "Sign in to your account" : "Sign up to get started"}
            </p>

            {error && (
              <div className="mb-4 text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
              )}
              {!isLogin && (
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-colors duration-200"
                required
              />
              {!isLogin && (
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:border-transparent transition-colors duration-200"
                required
              />

              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 text-white rounded-lg font-medium shadow-md hover:from-yellow-600 hover:to-orange-700 dark:hover:from-yellow-700 dark:hover:to-orange-800 transition-all duration-200"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-600 dark:text-yellow-400 font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

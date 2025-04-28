import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { getSession, commitSession } from "~/utils/session.server";
import bcrypt from "bcryptjs";

/**
 * Handles the POST request for the login form.
 * Validates user credentials, creates a session on success, and redirects.
 */
export async function action({ request }: ActionFunctionArgs) {
    // 1. Parse form data from the request
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    // 2. Basic validation for email and password presence and type
    if (typeof email !== "string" || email.trim() === "") {
        return json({ error: "Vui lòng nhập địa chỉ email" }, { status: 400 });
    }
    if (typeof password !== "string" || password.trim() === "") {
        return json({ error: "Vui lòng nhập mật khẩu" }, { status: 400 });
    }

    // 3. Find the user in the database by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    // 4. Handle user not found
    if (!user) {
        // Use a generic error message for security (don't reveal if email exists)
        return json({ error: "Email hoặc mật khẩu không đúng" }, { status: 400 });
    }

    // 5. Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 6. Handle invalid password
    if (!isPasswordValid) {
        // Use the same generic error message
        return json({ error: "Email hoặc mật khẩu không đúng" }, { status: 400 });
    }

    // 7. Password is valid, create a user session
    // Get the current session based on the request cookie (if any)
    const session = await getSession(request.headers.get("Cookie"));
    // Store the user's ID in the session data
    session.set("userId", user.id);

    // 8. Redirect the user to the courses page upon successful login
    // Commit the session data (generates a Set-Cookie header) and redirect
    return redirect(`/courses`, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

/**
 * Renders the Login page component.
 * Displays a form for users to enter their email and password.
 */
export default function Login() {
    return (
        <div className="h-full bg-white">
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                {/* Logo and Title Section */}
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" // Updated URL as per Tailwind UI docs
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                {/* Login Form Section */}
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* The form submits a POST request to the current route's action function */}
                    <form className="space-y-6" method="post">
                        {/* Email Input Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    name="email" // Name attribute must match formData key in action
                                    id="email"
                                    autoComplete="email"
                                    required // Basic HTML5 validation
                                    className="block w-full rounded-md border-0 bg-white py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" // Updated classes based on Tailwind UI
                                />
                            </div>
                        </div>

                        {/* Password Input Field */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                {/* Forgot Password Link (consider making this functional later) */}
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password" // Name attribute must match formData key in action
                                    id="password"
                                    autoComplete="current-password"
                                    required // Basic HTML5 validation
                                    className="block w-full rounded-md border-0 bg-white py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" // Updated classes based on Tailwind UI
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" // Updated classes based on Tailwind UI
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    {/* Link to Sign Up Page */}
                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '} {/* Added space */}
                        {/* Consider using Remix <Link to="/register"> for client-side navigation */}
                        <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign up now!
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
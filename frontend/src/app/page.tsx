import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="text-2xl font-bold text-blue-600">ApplyTrack</div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-blue-50">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Take Control of Your <span className="text-blue-600">Job Search</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-600 mb-10">
            Organize your internship and job applications in one place. Track interviews,
            monitor your progress, and land your dream job with ApplyTrack.
          </p>
          <div className="flex space-x-4">
            <Link href="/register" className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started for Free
            </Link>
            <Link href="#features" className="px-8 py-3 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Learn More
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to track your career</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Application Tracking"
                description="Keep a detailed record of every company, position, and application date."
                icon="📝"
              />
              <FeatureCard
                title="Interview Management"
                description="Track interview dates, times, and types. Never miss a call again."
                icon="📅"
              />
              <FeatureCard
                title="Application Analytics"
                description="Visualize your progress with beautiful charts and success rates."
                icon="📊"
              />
              <FeatureCard
                title="Smart Reminders"
                description="Get notified about upcoming interviews and follow-up dates."
                icon="🔔"
              />
              <FeatureCard
                title="Search & Filtering"
                description="Find any application instantly with advanced search and filters."
                icon="🔍"
              />
              <FeatureCard
                title="Secure Dashboard"
                description="Your data is private and secure, accessible only to you."
                icon="🔒"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-20 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Step number="1" title="Add Applications" description="Enter the company and position details." />
              <Step number="2" title="Track Progress" description="Update statuses as you move forward." />
              <Step number="3" title="Manage Interviews" description="Schedule and track your interviews." />
              <Step number="4" title="Get Offers" description="Land your dream role!" />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 bg-white text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to organize your job search?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of students and graduates who are landing their dream jobs.
          </p>
          <Link href="/register" className="px-10 py-4 text-xl font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
            Create Your Free Account
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">ApplyTrack</div>
            <p className="max-w-xs">
              The ultimate application tracker for students and graduates.
              Simplify your job hunt and focus on what matters.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-white">Login</Link></li>
              <li><Link href="/register" className="hover:text-white">Register</Link></li>
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; {new Date().getFullYear()} ApplyTrack. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
}

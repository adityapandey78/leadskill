import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">LeadSkill</h1>
              <span className="ml-3 text-sm text-neutral-400">Buyer Lead Management</span>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-neutral-300">Welcome, {session.user?.name || session.user?.email}</span>
                  <Link 
                    href="/signout"
                    className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-600 rounded-lg hover:border-neutral-500 transition-colors"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-600 rounded-lg hover:border-neutral-500 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Buyer Lead
            <span className="text-blue-500"> Management</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-neutral-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Capture, manage, and track your buyer leads with powerful search, filtering, and CSV import/export capabilities.
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/buyers"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                View Leads
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/buyers/new"
                className="w-full flex items-center justify-center px-8 py-3 border border-neutral-600 text-base font-medium rounded-md text-neutral-300 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-500 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Add New Lead
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lead Management</h3>
              <p className="text-neutral-400">Capture and organize buyer leads with comprehensive contact details, property preferences, and budget information.</p>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Search & Filter</h3>
              <p className="text-neutral-400">Advanced search and filtering capabilities to quickly find leads by city, property type, budget, and more.</p>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">CSV Import/Export</h3>
              <p className="text-neutral-400">Bulk import leads from CSV files with validation, and export your data for external analysis.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {session && (
          <div className="mt-16 bg-neutral-900 rounded-xl p-8 border border-neutral-800">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link
                href="/buyers"
                className="text-center p-6 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700 hover:border-neutral-600"
              >
                <div className="text-3xl font-bold text-blue-500 mb-2">📋</div>
                <div className="text-white font-medium">View All Leads</div>
                <div className="text-neutral-400 text-sm mt-1">Browse and manage</div>
              </Link>
              
              <Link
                href="/buyers/new"
                className="text-center p-6 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700 hover:border-neutral-600"
              >
                <div className="text-3xl font-bold text-green-500 mb-2">➕</div>
                <div className="text-white font-medium">Add New Lead</div>
                <div className="text-neutral-400 text-sm mt-1">Capture details</div>
              </Link>
              
              <div className="text-center p-6 bg-neutral-800 rounded-lg border border-neutral-700">
                <div className="text-3xl font-bold text-purple-500 mb-2">📊</div>
                <div className="text-white font-medium">Import/Export</div>
                <div className="text-neutral-400 text-sm mt-1">Bulk operations</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

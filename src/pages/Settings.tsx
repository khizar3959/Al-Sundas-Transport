import { User, Shield, Bell, Moon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../components/auth/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, security, and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Section */}
        <Card>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Profile Information</h3>
              <p className="text-sm text-slate-500">Your account details</p>
            </div>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email || ''} 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 focus:outline-none" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <input 
                  type="text" 
                  disabled 
                  value="Administrator" 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 focus:outline-none" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">General Preferences</h3>
              <p className="text-sm text-slate-500">System-wide settings</p>
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-slate-500">Adjust the interface to reduce eye strain</p>
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-slate-200 dark:bg-slate-700">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Notifications</p>
                  <p className="text-xs text-slate-500">Receive alerts for rentals and maintenance</p>
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-orange-600">
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
             <Button>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

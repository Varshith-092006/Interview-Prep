import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import api from "../services/api";

const ProfilePage = () => {
  const { user, setAuth, token } = useAuthStore();
  const [loading, setLoading] = useState(!user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (data?.success) {
          setAuth(data.user, token);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user && token) {
      fetchUser();
    } else if (user) {
      setEditData({ name: user.name || "", email: user.email || "" });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, token, setAuth]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await api.put("/auth/update", editData);
      if (data?.success) {
        setAuth(data.user, token);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-2xl relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <h1 className="text-2xl font-semibold mb-8">Your Profile</h1>

            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 mb-10">
              <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-xl font-medium text-white mb-1">{user?.name || "User"}</h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-green-400 font-medium">Active Account</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-white/5 pt-8">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <span className="block text-xs text-gray-500 mb-1">Full Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500/50"
                    />
                  ) : (
                    <span className="text-sm text-gray-200">{user?.name}</span>
                  )}
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <span className="block text-xs text-gray-500 mb-1">Email Address</span>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500/50"
                    />
                  ) : (
                    <span className="text-sm text-gray-200">{user?.email}</span>
                  )}
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <span className="block text-xs text-gray-500 mb-1">Role</span>
                  <span className="text-sm text-gray-200 capitalize">Candidate</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 border-t border-white/5 pt-8 flex justify-end gap-3">
               {isEditing ? (
                 <>
                   <button 
                     onClick={() => {
                       setIsEditing(false);
                       setEditData({ name: user?.name, email: user?.email });
                     }}
                     disabled={saving}
                     className="px-6 py-2.5 rounded-xl bg-transparent border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSave}
                     disabled={saving}
                     className="px-6 py-2.5 rounded-xl bg-violet-600 border border-violet-500 text-sm font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                   >
                     {saving ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                          Saving...
                        </>
                     ) : "Save Changes"}
                   </button>
                 </>
               ) : (
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                 >
                   Edit Profile
                 </button>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

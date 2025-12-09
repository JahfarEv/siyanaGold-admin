import React, { useState } from "react";
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  Key,
  UserCheck,
} from "lucide-react";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import Swal from "sweetalert2";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "No user is logged in.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "white",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "New password and confirm password do not match.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "white",
      });
      return;
    }

    try {
      // Reauthenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, passwordData.newPassword);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Password updated successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
        background: "#1f2937",
        color: "white",
      });
    } catch (error) {
      console.error("Password update error:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update password.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "white",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    {
      text: "At least 8 characters",
      met: passwordData.newPassword.length >= 8,
    },
    {
      text: "One uppercase letter",
      met: /[A-Z]/.test(passwordData.newPassword),
    },
    {
      text: "One lowercase letter",
      met: /[a-z]/.test(passwordData.newPassword),
    },
    { text: "One number", met: /[0-9]/.test(passwordData.newPassword) },
    {
      text: "One special character",
      met: /[!@#$%^&*]/.test(passwordData.newPassword),
    },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const progress =
    (passwordRequirements.filter((req) => req.met).length /
      passwordRequirements.length) *
    100;

  return (
    <div className="min-h-screen px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-rose-700 bg-clip-text text-transparent mb-4">
            Account Security
          </h1>
          <p className="hidden md:block text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your password and keep your account secure with our advanced
            protection features
          </p>
        </div>

        {/* Security Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-100/50 p-8 max-w-2xl mx-auto">
          {/* Card Header */}
          <div className="flex items-center space-x-4 mb-4 pb-6 border-b border-amber-100">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 hidden md:block">
                Password Settings
              </h2>
              <p className="text-gray-600 text-lg mt-1 hidden md:block">
                Create a strong, unique password to protect your account
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center ">
              <Key className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-8 mb-6">
              {/* Current Password */}
              <div className="group">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Current Password *
                </label>
                <div className="relative transform transition-all duration-200 group-hover:scale-[1.02]">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                    className="w-full px-6 py-4 text-lg border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-50/50 transition-all duration-200 pr-14"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-amber-600 transition-colors duration-200"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="group">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  New Password *
                </label>
                <div className="relative transform transition-all duration-200 group-hover:scale-[1.02]">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    className="w-full px-6 py-4 text-lg border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-50/50 transition-all duration-200 pr-14"
                    placeholder="Create a new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-amber-600 transition-colors duration-200"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {passwordData.newPassword && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-2xl border border-amber-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-lg font-semibold text-gray-800">
                        Password Strength
                      </p>
                      <div className="text-sm font-medium text-amber-600">
                        {Math.round(progress)}% Complete
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${progress}%`,
                          background:
                            progress < 40
                              ? "#ef4444"
                              : progress < 80
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {passwordRequirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-white/50"
                        >
                          {req.met ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <span
                            className={`text-base font-medium ${
                              req.met ? "text-green-600" : "text-gray-500"
                            }`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Confirm New Password *
                </label>
                <div className="relative transform transition-all duration-200 group-hover:scale-[1.02]">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    className="w-full px-6 py-4 text-lg border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-50/50 transition-all duration-200 pr-14"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-amber-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-6 w-6" />
                    ) : (
                      <Eye className="h-6 w-6" />
                    )}
                  </button>
                </div>
                {passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <div className="flex items-center space-x-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <p className="text-red-600 text-base font-medium">
                        Passwords do not match
                      </p>
                    </div>
                  )}
                {passwordData.confirmPassword &&
                  passwordData.newPassword === passwordData.confirmPassword &&
                  allRequirementsMet && (
                    <div className="flex items-center space-x-2 mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <p className="text-green-600 text-base font-medium">
                        Passwords match and meet all requirements
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={
                  loading ||
                  !allRequirementsMet ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                className="group relative bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-12 py-4 rounded-2xl flex items-center space-x-3 shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold min-w-[200px] justify-center transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6" />
                    <span>Update Password</span>
                  </>
                )}

                {/* Button Shine Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-gray-500 text-lg">
            🔒 Your security is our priority. Always choose a strong, unique
            password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

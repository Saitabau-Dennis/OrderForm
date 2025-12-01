import { User } from "@/lib/models/User";
import dbConnect from "@/lib/db";
import { Check, X } from "lucide-react";
import Link from "next/link";

interface VerifyPageProps {
  searchParams: { token?: string };
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9] p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-instrument-serif text-3xl font-bold text-gray-900">Invalid Link</h2>
            <p className="font-instrument-sans text-gray-500 text-lg leading-relaxed">
              This verification link is invalid or missing.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <Link
              href="/register"
              className="inline-flex items-center justify-center w-full py-3 px-6 text-black font-medium hover:underline"
            >
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await dbConnect();

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9] p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="font-instrument-serif text-3xl font-bold text-gray-900">Verification Failed</h2>
            <p className="font-instrument-sans text-gray-500 text-lg leading-relaxed">
              This verification link is invalid or has expired.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3 px-6 text-black font-medium hover:underline"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Verify user
  user.emailVerified = new Date();
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9] p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-gray-100">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="font-instrument-serif text-3xl font-bold text-gray-900">Email Verified!</h2>
          <p className="font-instrument-sans text-gray-500 text-lg leading-relaxed">
            Your email has been successfully verified. You can now log in to your account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full py-4 px-6 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all shadow-lg hover:shadow-xl"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

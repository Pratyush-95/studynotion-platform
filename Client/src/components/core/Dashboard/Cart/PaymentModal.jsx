import { AiOutlineClose } from "react-icons/ai"
import IconBtn from "../../../common/IconBtn"

export default function PaymentModal({ open, onClose, amount, onConfirm, user }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-richblack-500 bg-richblack-950 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col lg:flex-row">
          <div className="relative flex w-full flex-col gap-6 bg-gradient-to-b from-[#0f1d36] via-[#142850] to-[#0b1930] p-8 text-white lg:w-[42%] lg:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-richblack-400">StudyNotion</p>
                <p className="mt-2 text-xl font-semibold text-white">Secure checkout</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-100">
                Test Mode
              </span>
            </div>

            <div className="rounded-[28px] bg-white/10 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.03)]">
              <p className="text-sm uppercase tracking-[0.3em] text-richblack-400">Price summary</p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-lg text-richblack-200">Order total</p>
                  <p className="mt-1 text-xs text-richblack-400">You are paying for selected courses</p>
                </div>
                <p className="text-4xl font-semibold text-yellow-200">₹ {amount}</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <p className="text-sm uppercase tracking-[0.3em] text-richblack-400">Paying as</p>
              <div className="mt-4 rounded-3xl bg-richblack-900 p-4">
                <p className="text-sm text-richblack-300">Name</p>
                <p className="mt-2 text-base font-medium text-white">{user?.firstName || user?.email || "Student"}</p>
                <p className="mt-1 text-sm text-richblack-400">{user?.email || "user@example.com"}</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <p className="text-sm uppercase tracking-[0.3em] text-richblack-400">Payment details</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-3xl bg-richblack-900 p-4">
                  <p className="text-sm text-richblack-400">Payment method</p>
                  <p className="mt-2 text-base font-semibold text-white">Razorpay</p>
                </div>
                <div className="rounded-3xl bg-richblack-900 p-4">
                  <p className="text-sm text-richblack-400">Order type</p>
                  <p className="mt-2 text-base font-semibold text-white">Instant checkout</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-richblack-300 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              <p className="font-semibold text-white">Secure payment</p>
              <p className="mt-3 leading-6 text-richblack-300">
                Your payment is processed securely by Razorpay. Click continue to verify and complete the payment.
              </p>
            </div>
          </div>

          <div className="relative w-full bg-white p-8 lg:w-[58%] lg:p-10">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-richblack-900 text-white transition hover:bg-richblack-800"
            >
              <AiOutlineClose size={18} />
            </button>

            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-richblack-900">Payment Options</h2>
                <p className="mt-2 text-sm text-richblack-500">Verify your order and then continue to the secure Razorpay checkout.</p>
              </div>
              <div className="rounded-3xl bg-richblack-900 px-4 py-2 text-sm font-semibold text-white">
                ₹ {amount}
              </div>
            </div>

            <div className="rounded-[32px] border border-richblack-200 bg-richblack-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-richblack-900">Available Offers</p>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-richblack-900">2 offers</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl border border-richblack-200 bg-white p-4">
                  <p className="font-medium text-richblack-900">New user offer</p>
                  <p className="mt-1 text-sm text-richblack-500">Get ₹100 cashback on first purchase.</p>
                </div>
                <div className="rounded-3xl border border-richblack-200 bg-white p-4">
                  <p className="font-medium text-richblack-900">Bank partner</p>
                  <p className="mt-1 text-sm text-richblack-500">5% off with HDFC Bank cards.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Cards", subtitle: "Visa, MasterCard, RuPay", icon: "💳" },
                { title: "Netbanking", subtitle: "SBI, HDFC, ICICI", icon: "🏦" },
                { title: "Wallet", subtitle: "Paytm, Mobikwik", icon: "👛" },
                { title: "Pay Later", subtitle: "Simpl, LazyPay", icon: "⏳" },
              ].map((option) => (
                <div
                  key={option.title}
                  className="group rounded-[28px] border border-richblack-200 bg-white p-5 transition hover:border-yellow-300 hover:shadow-[0_20px_60px_rgba(255,211,87,0.18)]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-richblack-900">{option.title}</p>
                      <p className="mt-1 text-sm text-richblack-500">{option.subtitle}</p>
                    </div>
                    <span className="text-2xl">{option.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[32px] bg-[#f8fafc] p-6">
              <p className="text-sm font-semibold text-richblack-900">Add a new card</p>
              <div className="mt-4 grid gap-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full rounded-[22px] border border-richblack-200 bg-white px-4 py-4 text-sm outline-none focus:border-yellow-300"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full rounded-[22px] border border-richblack-200 bg-white px-4 py-4 text-sm outline-none focus:border-yellow-300"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full rounded-[22px] border border-richblack-200 bg-white px-4 py-4 text-sm outline-none focus:border-yellow-300"
                  />
                </div>
                <label className="inline-flex items-center gap-3 text-sm text-richblack-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-richblack-300 text-yellow-500" />
                  Save this card as per RBI guidelines
                </label>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-richblack-500">Total payment</p>
                <p className="text-4xl font-semibold text-richblack-900">₹ {amount}</p>
              </div>
              <IconBtn
                text="Continue"
                onClick={onConfirm}
                customClasses="w-full rounded-[28px] bg-yellow-200 py-4 text-lg font-semibold text-richblack-900 shadow-[0_18px_40px_rgba(234,179,8,0.25)] sm:w-auto sm:px-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

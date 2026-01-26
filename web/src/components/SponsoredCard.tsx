import { assets } from "../assets/assets";

export function SponsoredCard() {
  return (
    <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
      <h3 className="text-slate-800 font-semibold">
        Sponsored
      </h3>

      <img
        src={assets.sponsored_img}
        alt=""
        className="w-75 h-50 rounded-md"
      />

      <p className="text-slate-600">Email marketing</p>

      <p className="text-slate-400">
        Boost your sales using email marketing. Try it now with our free
        trial!
      </p>
    </div>
  )
}
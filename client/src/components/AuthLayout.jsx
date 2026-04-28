import BackButton from "./BackButton";

export const inputClass =
  "bg-[#2a3540] border border-[#2a3540] rounded-[3px] px-3 py-2.5 text-white text-sm w-full outline-none focus:bg-white focus:text-[#14181c] transition-all";

export const submitBtnClass =
  "mt-1 bg-gradient-to-r from-[#006400] to-[#00e054] text-black font-bold text-sm uppercase tracking-[1px] py-3 rounded-[3px] cursor-pointer hover:brightness-125 active:translate-y-px transition-all";

function AuthLayout({ title, footer, onSubmit, children }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#14181c] px-4">
      <div
        className="w-full max-w-xs mb-3 self-center"
        style={{ maxWidth: "320px" }}
      >
        <BackButton />
      </div>
      <div className="bg-[#1b2228] px-8 py-8 rounded-md w-full max-w-xs shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
        <h1 className="text-white text-xl font-bold uppercase tracking-[1.2px] pb-3 mb-5 border-b border-[#445566]">
          {title}
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {children}
        </form>
        {footer}
      </div>
    </div>
  );
}

export default AuthLayout;

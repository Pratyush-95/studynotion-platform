import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

function PasswordInput({ name, value, onChange, placeholder, required = false }) {
  const [show, setShow] = useState(false)

  return (
    <label className="relative w-full">
      <input
        required={required}
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-[38px] z-[10] cursor-pointer text-inherit"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
        ) : (
          <AiOutlineEye fontSize={24} fill="#AFB2BF" />
        )}
      </button>
    </label>
  )
}

export default PasswordInput

import { FaApple } from "react-icons/fa";
export default function ApplePay() {
  return (
    <div className="flex flex-row justify-center items-center p-2 bg-black text-white rounded-lg w-full my-4 cursor-pointer">
      <FaApple className="text-xl" />
      <h1 className="text-xl font-semibold">Pay</h1>
    </div>
  );
}

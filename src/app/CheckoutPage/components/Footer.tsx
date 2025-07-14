export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col lg:flex-row justify-center items-center text-xs cursor-pointer font-light mt-8">
        <div className="flex flex-row my-2">
          <span className="hidden lg:inline-block mx-2">|</span>
          <a href="https://mellys.store/privacy-policy-2/" className="hover:underline">
            Return Policy
          </a>
          <a href="https://mellys.store/privacy-policy/" className="mx-2 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col lg:flex-row justify-center items-center text-xs cursor-pointer font-light mt-8">
        <div className="flex flex-row">
          <a href="#" className="block lg:inline-block">
            Powered by
            <span className="font-bold ml-1 ">hixcoder</span>
          </a>
        </div>
        <div className="flex flex-row my-2">
          <span className="hidden lg:inline-block mx-2">|</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="mx-2 hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

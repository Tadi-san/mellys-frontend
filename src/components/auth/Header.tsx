"use client";

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return <h1 className="text-2xl font-semibold text-center w-full">{label}</h1>;
};

export default Header;

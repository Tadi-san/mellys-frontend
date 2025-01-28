"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./BackButton";
import Header from "./Header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="hover:border hover:shadow-md bg-gray-100/45 p-5">
      <CardHeader className="p-2 mb-8">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>

      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>

      <CardFooter className="py-0">
        <p className="text-xs mt-6 text-muted-foreground">
          By continuing, you confirm that you‘re an adult and you’ve read and
          accepted our
          <a
            target="_blank"
            className="underline mx-1"
            href="https://terms.alicdn.com/legal-agreement/terms/suit_bu1_aliexpress/suit_bu1_aliexpress202204182115_37406.html"
          >
            AliExpress Free Membership Agreement
          </a>{" "}
          and
          <a
            target="_blank"
            className="underline mx-1"
            href="https://terms.alicdn.com/legal-agreement/terms/suit_bu1_aliexpress/suit_bu1_aliexpress201909171350_82407.html"
          >
            Privacy Policy.
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;

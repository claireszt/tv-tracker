import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center p-m">
      <h1 className="text-h1 mobile:text-h1-mobile font-heading text-light-text">
        Welcome to TV Tracker
      </h1>
      <div className="mt-4">
        <Link href="/search">
          <Button variant="primary">Search for a Show</Button>
        </Link>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Link href="/components-display">
          <Button variant="accent">Components</Button>
        </Link>
      </div>
    </div>
  );
}

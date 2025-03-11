import Image from "next/image";

export default function Logo() {
  return <Image src="/icon.png" alt="App Icon" width={256} height={256} priority />;
}

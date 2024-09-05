import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="relative z-50 border-b bg-white">
      <div className="container mx-auto flex h-20 items-center py-5">
        <Link className="mr-12" href="/">
          <Image
            className="py-0"
            width={80}
            height={80}
            src="/static/herai.png"
            alt="Logo"
          />
        </Link>
        <nav
          className="justify-center flex-grow flex nav-primary"
          aria-label="Nav Menu"
        >
          <ul
            id="menu-nav-menu"
            className="lg:flex lg:items-center lg:gap-16"
          >
            <li className="menu-item">
              <Link href="">Calculator</Link>
            </li>
            <li className="menu-item">
              <Link href="">Predictor</Link>
            </li>
          </ul>
        </nav>
        <nav className="justify-end flex-grow flex nav-primary">
          <ul
            className="lg:flex lg:items-center lg:gap-16"
          >
            <li className="menu-item">
              <Link href="">Login</Link>
            </li>
            <li className="menu-item">
              <Link href="">Registor</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

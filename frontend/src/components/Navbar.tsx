import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  LogOut,
  Rat,
  Settings,
  User,
  ChartNoAxesColumn,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `btn btn-sm gap-2 ${isActive ? 'btn-primary' : 'btn-ghost'}`;

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-base-100/90 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rat className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-lg font-bold">RatRacer</h1>
          </Link>

          <nav
            className="hidden md:flex items-center gap-2"
            aria-label="Primary"
          >
            {authUser && (
              <>
                <NavLink to="/leaderboard" className={navLinkClass}>
                  <ChartNoAxesColumn className="size-5" aria-hidden="true" />
                  Leaderboard
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  <User className="size-5" aria-hidden="true" />
                  Profile
                </NavLink>
              </>
            )}
            <NavLink to="/settings" className={navLinkClass}>
              <Settings className="size-5" aria-hidden="true" />
              Settings
            </NavLink>
            {authUser ? (
              <button
                type="button"
                className="btn btn-sm btn-ghost gap-2"
                onClick={logout}
              >
                <LogOut className="size-5" aria-hidden="true" />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-sm btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="md:hidden btn btn-sm btn-ghost btn-square"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="md:hidden border-t border-base-300 bg-base-100 px-4 py-3 flex flex-col gap-2"
        >
          {authUser && (
            <>
              <NavLink to="/leaderboard" className={navLinkClass} onClick={closeMenu}>
                <ChartNoAxesColumn className="size-5" aria-hidden="true" />
                Leaderboard
              </NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                <User className="size-5" aria-hidden="true" />
                Profile
              </NavLink>
            </>
          )}
          <NavLink to="/settings" className={navLinkClass} onClick={closeMenu}>
            <Settings className="size-5" aria-hidden="true" />
            Settings
          </NavLink>
          {authUser ? (
            <button
              type="button"
              className="btn btn-sm btn-ghost gap-2 justify-start"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              <LogOut className="size-5" aria-hidden="true" />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost" onClick={closeMenu}>
                Log in
              </Link>
              <Link to="/signup" className="btn btn-sm btn-primary" onClick={closeMenu}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};
export default Navbar;

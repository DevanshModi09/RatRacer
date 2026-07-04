const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="container mx-auto flex items-center justify-center h-10 px-6">
        <p className="text-sm text-base-content/60">
          © {new Date().getFullYear()} RatRacer &nbsp;
          <a
            href="https://github.com/devanshmodi09"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-base-content hover:text-primary transition-colors"
          >
            ~ By Devansh
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

const Footer = () => {
  return (
    <footer className="border-t border-base-300 fixed bottom-0 w-full z-40 bg-base-100/80 backdrop-blur-lg">
      <div className="flex items-center h-10 px-6">
        <p
          className="text-sm text-base-content/60"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {' '}
          <span
            className="font-semibold text-base-content"
            style={{
              fontFamily: 'Courier New, monospace',
              letterSpacing: '0.04em',
            }}
          >
            © 2026 RatRacer&nbsp; &nbsp;
            <a href="https://github.com/devanshmodi09" target="blank">
              ~ By Devansh
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

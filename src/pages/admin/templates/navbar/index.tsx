import './styles/admin.templates.navbar.styles.main.scss';

interface AdminNavbarProps {
  globalStyle: any;
}

export default function AdminNavbar(props: AdminNavbarProps) {
  const { globalStyle } = props;
  const { primaryColor } = globalStyle;

  return (
    <nav
      className="Admin-Navbar"
      style={{
        backgroundColor: primaryColor,
      }}
    >
      <p className="Admin-Navbar-Title">Permata Komputer</p>
      <header className="Admin-Navbar-Link-Container">
        <button>Dokumentasi</button>
        <p className="Admin-Navbar-Link-Sepataror">.</p>
        <button>Kontak</button>
        <p className="Admin-Navbar-Link-Sepataror">.</p>
        <button>Tentang Kami</button>
      </header>
    </nav>
  );
}

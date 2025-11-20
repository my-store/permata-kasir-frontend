import "./styles/user.templates.header.styles.main.scss";
import { serverUrl } from "../../../../App";
import type { CSSProperties } from "react";

interface FooterProps {
  globalStyle: any;
}

export default function UserHeader(props: FooterProps) {
  const { globalStyle } = props;

  // Navbar config
  const { navbarHeight } = globalStyle;

  // Colors
  const { primaryColor, secondaryColor } = globalStyle;

  const globalButtonStyle: CSSProperties = {
    backgroundColor: secondaryColor,
  };

  return (
    <header
      className="User-Navbar"
      style={{
        backgroundColor: primaryColor,
        height: navbarHeight,
      }}
    >
      <div
        className="User-Navbar-Logo"
        style={{
          height: globalStyle.navbarHeight,
          width: globalStyle.navbarHeight,
          backgroundImage: `url(${serverUrl}/static/img/logo-permata-komputer.png)`,
        }}
      ></div>
      <div className="User-Navbar-Link-Container">
        <button style={globalButtonStyle}>Youtube</button>
        <button style={globalButtonStyle}>Facebook</button>
        <button style={globalButtonStyle}>WhatsApp</button>
        <button style={globalButtonStyle}>Instagram</button>
      </div>
    </header>
  );
}

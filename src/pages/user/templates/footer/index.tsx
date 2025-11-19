import './styles/user.templates.footer.styles.main.scss';

interface FooterProps {
  globalStyle: any;
}

export default function Footer(props: FooterProps) {
  const { globalStyle } = props;

  return (
    <footer
      style={{
        paddingLeft: globalStyle.sidebarWidth,
        backgroundColor: globalStyle.primaryColor,
      }}
    >
      <p className="footer-copyright-text">
        Copyright &copy; {new Date().getFullYear()} Permata Komputer Brebes
      </p>
    </footer>
  );
}

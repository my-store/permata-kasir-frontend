import './styles/user.laporan.styles.main.scss';
import { useEffect } from 'react';
import $ from 'jquery';

export default function Laporan({ socketConnect }: any) {
  function load() {
    // Force scrolll to top
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="Laporan">
      <p>Laporan</p>
    </section>
  );
}

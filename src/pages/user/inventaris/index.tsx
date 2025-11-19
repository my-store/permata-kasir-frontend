import './styles/user.inventaris.styles.main.scss';
import { useEffect } from 'react';
import $ from 'jquery';

export default function Inventaris({ socketConnect }: any) {
  function load() {
    // Force scrolll to top
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="Inventaris">
      <p>Inventaris</p>
    </section>
  );
}

import ConsultaForm from "./ConsultaForm";

export default function Home() {
  return (
    <>
      <header>
        <div className="container nav">
          <a href="#" className="brand">
            C &amp; V Estudio Jurídico
          </a>
          <ul className="menu">
            <li>
              <a href="#contacto" className="contacto-link">
                Contacto
              </a>
            </li>
            <li>
              <a href="tel:+59899502866" className="phone">
                +598 99 502 866
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="container">
          <div className="wordmark">C &amp; V Estudio Jurídico</div>
          <div className="tagline">Abogadas · Uruguay</div>
          <p className="lede">
            Asesoramiento jurídico <strong>confiable</strong>,{" "}
            <strong>humano</strong> y al alcance de nuestros clientes, buscando
            soluciones jurídicas claras, orientadas a obtener los{" "}
            <strong>mejores resultados</strong>.
          </p>
          <a href="#contacto" className="btn btn-solid">
            Contáctanos
          </a>
        </div>
      </section>

      {/* ACERCA DE LA FIRMA */}
      <section className="acerca" id="acerca">
        <div className="container">
          <div className="section-title">acerca de la firma</div>
          <div className="grid">
            <div>
              <h2>Asesoramiento jurídico integral, claro y a medida.</h2>
            </div>
            <div className="text">
              <p>
                Brindamos soluciones legales claras, ágiles y adaptadas a tus
                necesidades. Somos un equipo de profesionales comprometidas con
                ofrecerte un servicio serio, cercano y personalizado.
              </p>
              <p>
                Te acompañamos en cada etapa con experiencia, confianza y
                atención dedicada. Nuestras áreas de práctica se centran en el
                Derecho Laboral, Civil y Familia. La confidencialidad y el
                secreto profesional son la base de nuestra práctica.
              </p>
              <p>
                Toda consulta es tratada con la reserva que la profesión exige.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMUNÍQUESE CON NOSOTROS */}
      <section className="contacto" id="contacto">
        <div className="container">
          <div className="section-title">comuníquese con nosotros</div>
          <div className="grid">
            {/* left: contact info */}
            <div className="contacto-info">
              <h2>Escuchar tu caso es el mejor paso para ayudarte.</h2>
              <p>
                Completá el formulario y te respondemos dentro de las 24 horas
                hábiles. La primera consulta es sin costo y sin compromiso.
              </p>

              <ul className="contact-list">
                <li>
                  <span className="label">Teléfono / WhatsApp</span>
                  <a className="value" href="tel:+59899502866">
                    +598 99 502 866
                  </a>
                  <a className="value" href="tel:+59898429038">
                    +598 98 429 038
                  </a>
                </li>
                <li>
                  <span className="label">Email</span>
                  <a className="value" href="mailto:consultas@estudio.com.uy">
                    consultas@estudio.com.uy
                  </a>
                </li>
                <li>
                  <span className="label">Horario</span>
                  <span className="value">Lunes a viernes · 9 a 18 hs</span>
                </li>
              </ul>
            </div>

            {/* right: form */}
            <ConsultaForm />
          </div>

          <div className="trust">
            <div className="item">
              <span className="num">24 h</span>
              <span className="lab">Tiempo de respuesta</span>
            </div>
            <div className="item">
              <span className="num">Presencial / Online</span>
              <span className="lab">Consulta</span>
            </div>
            <div className="item">
              <span className="num">100%</span>
              <span className="lab">Confidencial</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container foot">
          <span className="brand-sm">C &amp; V Estudio Jurídico</span>
          <div className="foot-links">
            <a href="#acerca">Acerca</a>
            <a href="#contacto">Contacto</a>
            <a href="#contacto">Privacidad</a>
          </div>
          <span className="foot-copy">© 2026 · Montevideo, UY</span>
        </div>
      </footer>
    </>
  );
}

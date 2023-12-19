import styles from "./footer.module.css";
import Link from "next/link";
import logoAfip from "../../images/afip-sello.jpg";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.firstSection}>
        <div className={styles.logoAfipContainer}>
          <Link
            href="http://qr.afip.gob.ar/?qr=Fql_9B62NyuJZVonsfkiQQ,,"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={logoAfip}
              className={styles.logoAfip}
              border="0"
              alt="AFIP"
            />
          </Link>
        </div>
        <div className={styles.footerRight}>
          <p>
            <b>Pianesi & Chiramberro Asesores de Seguros</b>
          </p>
          <p>Lamadrid 2952, Olavarría, Buenos Aires</p>
          <p>
            <b>Martín Pianesi</b>
            <span> - CUIT 20-33344952-9</span>
          </p>
          <p>
            <b>Mat SSN:</b> <span>85.837</span>
          </p>
          <p>
            <a href="tel:+5492284662477">(2284) 15 66-2477</a> /{" "}
            <a href="tel:+5492284497810">15 49-7810</a> /{" "}
            <a href="tel:+5492284680187">15 68-0187</a>
          </p>
          <p>
            <a href="mailto:seguros@pianesichiramberro.com.ar">
              seguros@pianesichiramberro.com.ar
            </a>
          </p>
        </div>
      </div>
      <div className={styles.thirdSection}>
        Todos los derechos reservados - 2022&nbsp;&nbsp;|&nbsp;&nbsp;Pianesi &
        Chiramberro
        <br />
        <span>
          Desarrollado por{" "}
          <a href="mailto:armendariz.ignacio@gmail.com">Ignacio Armendariz</a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
